<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CerrarLecturasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas 
 * 
 */
class CerrarLecturasGenericoDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado
     */
    private $genericoDelegado;

    /**
     *
     * @var CerrarLecturasModel 
     */
    private $cerrarLectura;

    /**
     *
     * @var int 
     */
    private $idproceso;

    /**
     *
     * @var int 
     */
    private $filasAfectadas;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct() {
        $this->conexion = ConexionBD::getConexion();
        $this->cerrarLectura = new CerrarLecturasModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Procesar las lecturas de un ciclo especifico con el fin de poder realizar los nuevos encabezados
     * @param int $idCiclo ciclo a validar 
     * @param int $empresa empresa a evaluar
     * @throws MyException Validaciones de lanzamientos en sub-métodos
     */
    private function procesarlecturas($idCiclo, $empresa, $idusuario) {

        try {
            //indice inciialde páginación de consulta
            $idPeriodoSiguiente = $this->cerrarLectura->ObtenerSiguientePeriodoActual($idCiclo);
            // permite obtener el  periodo con respecto al ciclo
            $cicloPeriodo = $this->cerrarLectura->consultarPeriodo($idCiclo);
            $periodo = $cicloPeriodo['periodo'];
            $nombreCiclo = $cicloPeriodo ['ciclo'];
            $anociclo = $cicloPeriodo ['anociclo'];
            $this->conexion->beginTransaction();
            $this->escribirLog("Verificando lecturas a Cerrar para el periodo { $periodo } ciclo { $nombreCiclo } ");
            $filasAfectadas = $this->cerrarLectura->ProcesarLecturasActuales($idCiclo, $empresa, $idusuario);
            if ($filasAfectadas > 0) {
                $this->escribirLog("Lecturas Activas Cerradas para el periodo { $periodo } ciclo { $nombreCiclo } ", $filasAfectadas, 'MODULO LECTURAS');
            }
            $filasAfectadasEncabezadoG = $this->cerrarLectura->obtenerCantidadFilasAfectasEncabezado($idCiclo, $periodo, $empresa, $anociclo);
            if ($filasAfectadasEncabezadoG > 0) {
                $this->escribirLog("Generando Encabezados Estado G para el periodo { " . $idPeriodoSiguiente['periodo'] . " } ciclo { $nombreCiclo } ", $filasAfectadasEncabezadoG, 'MODULO LECTURAS');
            }

            $filasAfectadasEncabezado = $this->cerrarLectura->generarNuevoEncabezado($idCiclo, $idPeriodoSiguiente['periodo'], $empresa, $idPeriodoSiguiente['aniociclo'], $idusuario);
            if ($filasAfectadasEncabezado > 0) {
                $this->escribirLog("Generando Encabezados Estado A para el periodo { " . $idPeriodoSiguiente['periodo'] . " } ciclo { $nombreCiclo } ", $filasAfectadasEncabezado, 'MODULO LECTURAS');
//                $filasAfectadasEncabezadoG = $this->cerrarLectura->obtenerCantidadFilasAfectasEncabezado($idCiclo, $periodo, $empresa, $anociclo);
            }

            $this->cerrarLectura->actualizarEstadoProcesado($idusuario, $idCiclo, $periodo);
            /*
             * Se adiciona control para validar que no haya quedado ninguna suscripción en estado G -
             */
            $filasAfectadasEncabezadoG_A = $this->cerrarLectura->obtenerCantidadFilasEstadoG_A($idCiclo, $periodo, $empresa, $anociclo);
            $this->escribirLog("Registros Sin Procesar Estado A o G  { " . $idPeriodoSiguiente['periodo'] . " } ciclo { $nombreCiclo } ", $filasAfectadasEncabezadoG_A, 'MODULO LECTURAS');
//                $this->conexion->rollBack();
            $this->conexion->commit();
        } catch (\Exception $ex) {
            if (strpos($ex->getMessage(), "llave duplicada viola restricción de unicidad") !== false) {
                $this->escribirLog("ERROR: El Proceso ya se ha ejecutado anteriormente. Verifique y Ejecute nuevamente", 0, '', true);
            }
            $this->escribirLog("ERROR: " . $ex->getMessage(), 0, '', true);
            print_r($ex->getTraceAsString());
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            throw new MyException($ex->getMessage(), -1);
        }
    }

    /**
     * permite procesar el ciclo especifico
     * @param type $idciclo captura el ciclo a evaluar
     * @throws MyException
     */
    public function procesarEncabezado($idciclo, $idempresa, $idproceso, $idusuario) {
        try {

            $this->cerrarLectura->CrearTablaLogModel();
            $respuesta = $this->genericoDelegado->validarPrograma(PROGRAMA_LECTURAS, $idciclo, $idempresa);
            $this->escribirLog("Actualizando Actividad");
            print_r($respuesta);
            if ($respuesta['idactividad'] != 0) {
                $this->escribirLog("Validando actividades de programa");
                $this->genericoModel->actualizarActividad($respuesta, 'C');
            }
            $this->procesarlecturas($idciclo, $idempresa, $idusuario);

            $this->finalizarProceso($idproceso, $idusuario);
        } catch (\Exception $e) {
            $this->finalizarProceso($idproceso, $idusuario);
            print_r($e->getTraceAsString());
            $this->escribirLog($e->getMessage(), 0, '', true);
        }
    }

    /**
     * Se finaliza el proceso que está en ejecución
     * @param type $idproceso
     * @param type $idusuario
     */
    private function finalizarProceso($idproceso, $idusuario) {
        $conexionLog = ConexionBD::getConexion();
        $conexionLog->beginTransaction();
        try {
            $cerrarLecturaLogModel = new CerrarLecturasModel($conexionLog);
            $cerrarLecturaLogModel->finalizarProcesoModel($idproceso, $idusuario);
            $this->escribirLog("Proceso ( $idproceso )  Terminado ");
        } catch (\Exception $e) {
            $conexionLog->rollBack();
            print_r($e->getTraceAsString());
        } finally {
            if ($conexionLog->isTransactionActive()) {
                $conexionLog->commit();
            }
            $conexionLog->close();
            $conexionLog = null;
        }
    }

    /**
     * Se escribe el archivo log
     * @param type $descripcion
     * @param type $filasafectadas
     * @param type $idsuscripcion
     * @param type $eserror
     * @return type
     */
    private function escribirLog($descripcion, $filasafectadas = 0, $idsuscripcion = '', $eserror = false) {
        $conexionLog = ConexionBD::getConexion();
        $conexionLog->beginTransaction();
        try {
            $cerrarLecturaLogModel = new CerrarLecturasModel($conexionLog);

            print_r($descripcion . '\n');
            if ($eserror) {
                $cerrarLecturaLogModel->InsertarLogModel($descripcion, 'Cerrar Lecturas', 'ERROR', $idsuscripcion, 0);
                return;
            }

            $cerrarLecturaLogModel->InsertarLogModel($descripcion, 'MÓDULO => Cerrar Lecturas', 'COMPLETADO', $idsuscripcion, $filasafectadas);
        } catch (\Exception $e) {
            $conexionLog->rollBack();
            print_r($e->getTraceAsString());
        } finally {
            if ($conexionLog->isTransactionActive()) {
                $conexionLog->commit();
            }
            $conexionLog->close();
            $conexionLog = null;
        }
    }

}
