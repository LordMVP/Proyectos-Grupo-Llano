<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoFacturacionModel;
use Llanogas\LlanogasBundle\ValidacionException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFacturacion;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CargarFactorCorreccionDelegado
 *
 * @author jeisson
 */
class ProcesoFacturacionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoFacturacionModel 
     */
    private $procesoFacturacionModel;

    /**
     *
     * @var Controller 
     */
    private $control;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde el cual se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->control = $control;
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->procesoFacturacionModel = new ProcesoFacturacionModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Se consultan los ciclos activos 
     * relacionados al programa
     * @return type
     */
    public function getCiclosActivosPrograma() {
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getCiclosActivosPrograma($idEmpresa, PROGRAMA_FACTURAR_PERIODO);
    }

    /**
     * Método encargado de ejecutar los hilos del proceso de facturación del servicio
     * @param type $idCiclo
     * @param ContainerInterface $container
     * @param type $preliquidar
     * @throws MyException
     */
    public function iniciarProceso($idCiclo, ContainerInterface &$container, $preliquidar) {
        $idEmpresa = $this->sesion->get('idempresa');
        $listaFacturas = $this->procesoFacturacionModel->consultarFacturasGeneradas($idCiclo, $idEmpresa);
        if (!empty($listaFacturas)) {
            throw new MyException('Hay facturas por aprobar', -1);
        }
        $this->procesoFacturacionModel->vaciarTablaProceso($this->sesion->get('idempresa'));
        /**
         * Se cargan en la tabla temporal las suscripciones que se quieren liquidar 
         */
        $this->procesoFacturacionModel->cargarSuscripciones($idCiclo, NUMERO_HILOS_FACTURACION, $this->sesion->get('idempresa'), $this->sesion->get('idusuario'));
        $this->lanzarHilosFacturacion($idCiclo, $preliquidar, $container);
    }

    /**
     * Cuando se quiere liquidar una suscripción en específico 
     * @param type $idSuscripcion
     * @return type
     */
    public function cargarSuscripcion($idSuscripcion) {
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $this->procesoFacturacionModel->vaciarTablaProceso($idEmpresa);
        return $this->procesoFacturacionModel->cargarSuscripcion($idSuscripcion, $idUsuario, $idEmpresa);
    }

    /**
     * Se lanzan los procesos en segundo plano
     * @param type $idCiclo
     * @param type $preliquidar
     * @param ContainerInterface $container
     */
    private function lanzarHilosFacturacion($idCiclo, $preliquidar, ContainerInterface &$container) {
        sleep(1);
        for ($i = 0; $i < NUMERO_HILOS_FACTURACION; $i++) {
            $idEmpresa = $this->sesion->get('idempresa');
            $idAcceso = $this->sesion->get('idacceso');
            $parametros = "$idEmpresa $idAcceso $idCiclo $i $preliquidar " . RUTA_PRINCIPAL;
            $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoFacturacion.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/facturacion_$i.log &";
            Util::ejecutarHilo($script);
        }
        sleep(2);
    }

    /**
     * Verifica si el proceso está en ejecución
     * @return type
     * @throws ValidacionException
     */
    public function validarProcesoEjecucion() {
        $resultado = $this->procesoModel->getProcesoEjecucion($this->sesion->get('idempresa'), PROGRAMA_FACTURAR_PERIODO);
        if (empty($resultado)) {
            return;
        }
        if ($resultado == -4) {
            return;
        }
        $validacionException = new ValidacionException('Hay un proceso en ejecución', -3);
        $validacionException->setData($resultado);
        throw $validacionException;
    }

    /**
     * Consulta la suscripción que se quiere liquidar 
     * @param type $idSuscripcion
     * @param type $cedula
     * @param type $codigoAnterior
     * @return type
     * @throws MyException
     */
    public function getSuscripciones($idSuscripcion, $cedula, $codigoAnterior) {
        $resultado = $this->procesoFacturacionModel->getSuscripciones($idSuscripcion, $cedula, $codigoAnterior);
        if (empty($resultado)) {
            throw new MyException('No se encontraron las suscripciones ', -1);
        }
        return $resultado;
    }

    /**
     * Realiza la liquidación de la suscripción
     * @param type $idLiquidacion
     * @param type $idSuscripcion
     * @param type $preliquidar
     * @return type
     * @throws \Exception
     * @throws MyException
     */
    public function liquidar($idLiquidacion, $idSuscripcion, $preliquidar) {
        $infoSuscripcion = $this->genericoModel->consultarInformacionVariasSuscripciones($idSuscripcion);
        $parametros['idacceso'] = $this->sesion->get('idacceso');
        $parametros['idciclo'] = $infoSuscripcion['idciclo'];
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['idproceso'] = 0;
        $parametros['preliquidar'] = $preliquidar;
        $procesoFacturacion = new ProcesoFacturacion($parametros);
        try {
            $procesoFacturacion->cargarLiquidacion($idLiquidacion);
            $suscripcion = $this->procesoFacturacionModel->getSuscripcionPorId($idSuscripcion);
            /**
             * Se invoca el método de facturar una suscripción
             */
            $infoFactura = $procesoFacturacion->facturarSuscripcion($suscripcion);
            $procesoFacturacion->finalizarProceso();
            if (isset($infoFactura['factura'])) {
                return $infoFactura['factura'];
            }
            throw new MyException('La suscripción ya fue liquidada', -1);
        } catch (\Exception $e) {
            $procesoFacturacion->finalizarProceso();
            throw $e;
        }
    }

    /**
     * Se aprueba la liquidación de una suscripción
     * @param type $idsuscripcion
     * @return type
     * @throws MyException
     */
    public function aprobarLiquidacionSuscripcion($idsuscripcion) {
        $listaErrores = array();
        $idEmpresa = $this->sesion->get('idempresa');
        $listaFacturas = $this->procesoFacturacionModel->consultarFacturasGeneradasSuscripcion($idsuscripcion, $idEmpresa);
        if (empty($listaFacturas)) {
            $this->procesoFacturacionModel->vaciarTablaProceso($this->sesion->get('idempresa'));
            throw new MyException('No se encontraron facturas para aprobar', 0);
        }
        foreach ($listaFacturas as $factura) {
            try {
                $this->conexion->beginTransaction();
                /* $this->procesoFacturacionModel->procesarFacturasCartera($factura['idsuscripcion']); */
                $this->procesoFacturacionModel->actualizarEstadoFacturaCartera('A', $factura['idsuscripcion']);
                $this->genericoModel->actualizarEstadoFactura($factura['idfactura'], 'A');
                $factura['tipo'] = 'FA';
                $this->genericoDelegado->actualizarNumeroFactura($factura);
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $error['idfactura'] = $factura['idfactura'];
                $error['mensaje'] = $e->getMessage();
                $listaErrores[] = $error;
                throw new MyException($e->getMessage(), -1);
            }
        }
        /**
         * Si no se generaron errores y se está aprobando se elimina la tabla 
         */
        if (empty($listaErrores)) {
            $this->procesoFacturacionModel->vaciarTablaProceso($this->sesion->get('idempresa'));
        }
        return $listaErrores;
    }

    /**
     * Se aprueba la liquidación de un ciclo 
     * @param type $idCiclo
     * @return type
     * @throws MyException
     */
    public function aprobarLiquidacion($idCiclo) {
        if($idCiclo == 0){
            return;
        }
        $listaErrores = array();
        $idEmpresa = $this->sesion->get('idempresa');
        $listaFacturas = $this->procesoFacturacionModel->consultarFacturasGeneradas($idCiclo, $idEmpresa);
        if (empty($listaFacturas)) {
            $this->procesoFacturacionModel->vaciarTablaProceso($this->sesion->get('idempresa'));
            throw new MyException('No se encontraron facturas para aprobar', 0);
        }
        foreach ($listaFacturas as $factura) {
            try {
                $this->conexion->beginTransaction();
                /*    $this->procesoFacturacionModel->procesarFacturasCartera($factura['idsuscripcion']);  */
                $this->procesoFacturacionModel->actualizarEstadoFacturaCartera('A', $factura['idsuscripcion']);
                $this->genericoModel->actualizarEstadoFactura($factura['idfactura'], 'A');
                $factura['tipo'] = 'FA';
                $this->genericoDelegado->actualizarNumeroFactura($factura);
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $error['idfactura'] = $factura['idfactura'];
                $error['mensaje'] = $e->getMessage();
                $listaErrores[] = $error;
            }
        }
        /**
         * Se elimina los datos de la tabla si no hay errores al momento de realizar la aprobación
         */
        if (empty($listaErrores)) {
            $this->procesoFacturacionModel->vaciarTablaProceso($this->sesion->get('idempresa'));
        }
        return $listaErrores;
    }

    public function getResultado($idCiclo) {
        $resultado = $this->procesoFacturacionModel->getResultado($this->sesion->get('idempresa'), $idCiclo);
        return $resultado;
    }

    public function getSatisfactorios($idCiclo) {
        return $this->procesoFacturacionModel->getSatisfactorios($this->sesion->get('idempresa'), $idCiclo);
    }

    /**
     * Método encargado de eliminar la liquidación de un ciclo
     * @param type $idCiclo
     */
    public function eliminarLiquidacion($idCiclo) {
        if($idCiclo == 0){
            return;
        }
        $idEmpresa = $this->sesion->get('idempresa');
        $this->procesoFacturacionModel->eliminarLiquidacion($idCiclo);
        $this->procesoFacturacionModel->vaciarTablaProceso($idEmpresa);
        $this->procesoFacturacionModel->eliminarFacturaCartera($idCiclo);
    }

    /**
     * Se elimina la liquidación de una suscripción 
     * @param type $idsuscripcion
     * @throws MyException
     */
    public function eliminarLiquidacionSuscripcion($idsuscripcion) {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $this->procesoFacturacionModel->eliminarLiquidacionSuscripcion($idsuscripcion);
            $this->procesoFacturacionModel->vaciarTablaProcesoSuscripcion($idEmpresa, $idsuscripcion);
            $this->procesoFacturacionModel->eliminarFacturaCarteraSuscripcion($idsuscripcion);
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), -1);
        }
    }
    
    public function adminVariasSuscripciones($ideVariasSuscripciones, $idCiclo, $preliquidar){
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $this->procesoFacturacionModel->vaciarTablaProceso($idEmpresa);
        $this->procesoFacturacionModel->cargarSuscripcion($ideVariasSuscripciones, $idUsuario, $idEmpresa);
        
        $ideSuscripciones = $this->procesoFacturacionModel->getSuscripcionesTemporales($idEmpresa);
        
        foreach ($ideSuscripciones as $idSuscripcion) {
           $this->liquidar($idSuscripcion['idliquidacion'], $idSuscripcion['idsuscripcion'], $preliquidar);
        }
    }

     public function getReportePreLiquidacion($idsuscripcion,$fechainicial,$fechafinal,$ciclo){
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $resultado= $this->procesoFacturacionModel->getReportePreLiquidacionModel($ciclo,$fechainicial,$fechafinal);
        return $resultado;
    }

}
