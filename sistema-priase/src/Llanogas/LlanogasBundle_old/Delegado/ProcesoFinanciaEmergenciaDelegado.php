<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoFinanciaEmergenciaModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * proceso financia emergencia
 *
 * @author oabaquero
 */
class ProcesoFinanciaEmergenciaDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoFinanciaEmergenciaModel
     */
    private $ProcesoFinanciaEmergenciaModel;

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
    private $cicloPeriodo;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->ProcesoFinanciaEmergenciaModel = new ProcesoFinanciaEmergenciaModel($this->conexion, $sesion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $sesion;
    }

    public function consultarCiclosActivos($idEmpresa) {
        return $this->genericoModel->getCiclosActivosPrograma($idEmpresa, PROGRAMA_IMPORTAR_FACTURA_BIO_ACE);
    }

    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $resultado['resumencorrectos'] = $this->ProcesoFinanciaEmergenciaModel->consultarResumen($idUsuario, $idEmpresa);
        $resultado['resumenconerrores'] = $this->ProcesoFinanciaEmergenciaModel->consultarResumenErrores($idUsuario, $idEmpresa);
        return $resultado;
    }

    public function obtenerMunicipios($municipio) {
        $municipios = $this->ProcesoFinanciaEmergenciaModel->consultarMunicipios($municipio);
        if (empty($municipios)) {
            throw new MyException("Error, No se encontraron municipios", 0);
        }
        return $municipios;
    }

    /**
     * Permite filtrar suscripciones 
     * @param int $idMunicipio id del municipio
     * @param int $idsuscripcion id de la suscripcion
     * @param int $codigoAnterior id del codigo anterior
     */
    public function filtrarSuscripciones($idMunicipio, $idsuscripcion, $codigoAnterior) {
        $parametros["idmunicipio"] = $idMunicipio;
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["codigoanterior"] = $codigoAnterior;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron resultados para la suscripción", 0);
        }
        return $suscripcion;
    }

    /**
     * Cierra la ejecucion del programa para el ciclo ejecutado
     * @param int $idActividad id de la actividad registrada en dper_detperiodo
     * @return int numero de filas afectadas despues de la actualización
     */
    public function cerrarActividad($idActividad) {
        $this->conexion->beginTransaction();
        try {
            $actividad["idactividad"] = $idActividad;
            $resultado = $this->genericoModel->actualizarActividad($actividad, "C");
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            print_r($exc->getTraceAsString());
        }
    }

    /**
     * Se registró el procesó.
     */

    /**
     * Realiza la insersion de un proceso activo en la tabla cpr_ctrproceso
     * bloqueando cualquier intento de una nueva ejecucion del programa mientras
     * se esta ejecutando
     * @param string $accion
     * @return int id del proceso
     */
    public function registrarProceso($accion) {
        $idControl = NULL;
        if ($accion == "C" || $accion == "c") {
            try {
                $this->conexion->beginTransaction();
                $proceso['estado'] = 'A';
                $proceso['fechaInicio'] = 'now()';
                $proceso['idPrograma'] = PROGRAMA_FINANCIA_EMERGENCIA;
                $proceso['idAcceso'] = $this->sesion->get("idacceso");
                $proceso['idEmpresa'] = $this->sesion->get("idempresa");
                $proceso['idHilo'] = 1;
                $idControl = $this->procesoModel->insertarProceso($proceso);
                $this->conexion->commit();
            } catch (\Exception $exc) {
                print_r($exc->getTraceAsString());
                $this->conexion->rollBack();
            }
        }
        return $idControl;
    }

    /**
     * Bloquea el proceso.
     */

    /**
     * Cierra la ejecucion del proceso dejando al programa habilitado para una
     * nueva ejecución
     * @param int $idControlProceso
     */
    public function finalizarProceso($idControlProceso) {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    public function leerArchivo($archivo) {
        $listaLineas = array();
        $file = fopen($archivo, "r");
        $numeroLinea = 0;
        while ($linea = fgets($file)) {
            $numeroLinea++;
            $registro = explode(';', $linea);
            $listaLineas[] = $this->getInfoRegistroArchivo($registro);
        }
        return $listaLineas;
    }

    public function getInfoRegistroArchivo($registro) {
        if (count($registro) != 3) {
            throw new MyException('El archivo no tiene el formato correcto', -3);
        }
        $i = 0;
        $infoRegistro = array();
        $infoRegistro['fac_ideregistro'] = trim($registro[$i++]);
        $infoRegistro['valorfinanciar'] = trim($registro[$i++]);
        $infoRegistro['numerocuotas'] = trim($registro[$i++]);
        $infoRegistro['idliquidacion'] = 3139;
        $infoRegistro['idempresa'] = $this->sesion->get('idempresa');
        $infoRegistro['idusuario'] = $this->sesion->get('idusuario');
        return $infoRegistro;
    }

    public function importarFacturas(array $listaLineas) {
        $this->ProcesoFinanciaEmergenciaModel->deleteArchivoTemporal($this->sesion->get('idempresa'));
        $this->conexion->beginTransaction();
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $numeroLinea = 0;
        try {
            foreach ($listaLineas as $linea) {
                $this->ProcesoFinanciaEmergenciaModel->insertarFactura($linea);
                $numeroLinea++;
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            print_r($e);
            $this->conexion->rollBack();
            $numeroLinea = 0;
        }
        return $numeroLinea;
    }

}
