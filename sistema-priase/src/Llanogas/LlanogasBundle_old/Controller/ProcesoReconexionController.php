<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\LiquidacionesDelegado;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\ProcesosMasivos\ProcesoReconexion;

/**
 * Description of ProcesoReconexionController
 *
 * @author mebonilla
 */
class ProcesoReconexionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $idUsuario = $sesion->get("idUsuario");
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros["procesoActivo"] = count($procesoActual);
        $lisParametros["proceso"] = $procesoActual;
        $lisParametros["tiposUsoSuscripcion"] = $liquidacionesDelegado->getTiposDeUsos();
        $genericoModel = new \Llanogas\LlanogasBundle\Models\GenericoModel($conexion);
        $lisParametros["municipios"] = $genericoModel->getMunicipiosPorPerfilAndPrograma($idUsuario, $idEmpresa,PROGRAMA_PROCESO_RECONEXIONES);
        $response = $this->render("LlanogasLlanogasBundle:Suspension:ProcesoReconexiones.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Valida e inicia el proceso de suspensiones y reconexiones.
     * @return json con el estado de la ejecución del proceso
     * @throws MyException Error sí el proceso ya está en ejecución.
     */
    public function procesarSuspensionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get("idEmpresa");
            $idAcceso = $sesion->get("idAcceso");
            $procesosEjecucion = $this->consultarProcesoEjecucion($idEmpresa);
            if (count($procesosEjecucion) > 0) {
                throw new MyException("Proceso en ejecución");
            }
            $tipoDeUso = $request->get("tipodeuso");
            $municipios= $request->get("municipios");
            $idUsuario = $sesion->get("idusuario");
            if (empty($tipoDeUso)) {
                throw new MyException("Debe seleccionar un Tipo de Uso");
            }
            $this->iniciarProcesoSuspension($idEmpresa, $tipoDeUso, $idAcceso, $idUsuario, $municipios);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeError"] = "Se inició correctamente el proceso";
        } catch (\Exception $e) {
            $respuesta["mensajeError"] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lanza el proceso de suspensiones
     * @param int $idEmpresa identificador de la empresa
     * @param int $tipoDeUso id del tipo de uso de la suscripción enviada por el cliente
     * @param int $idAcceso identificador del usuario que lanza el proceso
     */
    private function iniciarProcesoSuspension($idEmpresa, $tipoDeUso, $idAcceso, $idUsuario,$municipios) {
        try {
            $rutaProyecto = RUTA_PRINCIPAL;
            $parametros = "$idEmpresa $tipoDeUso $idAcceso $idUsuario $rutaProyecto $municipios";
            $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/ProcesoReconexion.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/reconexiones.log & ";
            Util::ejecutarHilo($script);
//            $proceso = new ProcesoReconexion($idEmpresa, $tipoDeUso, $idAcceso, $idUsuario);
//            $proceso->run();
        } catch (\Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     * Muestra el estado del proceso en ejecución 
     * @return json con el estado del proceso.
     */
    public function consultarProgresoAction() {
        $respuesta["codigoRespuesta"] = 1;
        $respuesta["mensajeError"] = "Progreso";
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $respuesta["progreso"] = $this->consultarProcesoEjecucion($idEmpresa);
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Verifica que el proceso no se esté ejecutando por otro usuario.
     * @param int $idEmpresa identificador de la empresa.
     * @return array con la información del proceso
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objProcesoModel = new ProcesoModel();
        $objProcesoModel->setConexion($conexion);
        $resultado = $objProcesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_RECONEXIONES, $idEmpresa);
        $conexion->close();
        return $resultado;
    }

    /**
     * Consulta el resumen de las reconexiones que se cerraron 
     * correctamente y la cantidad de suscripciones que generaron error
     * @return type
     */
    public function consultarResumenExitosoAction() {
        try {
            $resultado = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idempresa");
            $procesoSuspensiones = new ProcesoSuspensionModel($conexion);
            $resultado["generadas"] = $procesoSuspensiones->consultarResumenSuccessRec($idEmpresa);
            $resultado["sspcanceladas"] = $procesoSuspensiones->consultarResumenNoSuccessRecSppCanceladas($idEmpresa);
            $resultado["rcocanceladas"] = $procesoSuspensiones->consultarResumenNoSuccessRecRcoCanceladas($idEmpresa);
            $resultado["cantidadSuscripcionesModificadas"] = $procesoSuspensiones->consultarSuscripcionesModificadas($idEmpresa);
            $resultado["suscripcionsinfechas"] = $procesoSuspensiones->consultarResumenSuscripcionSinFechasEnReconexiones($idEmpresa);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontró información de resumen" : "Información de resumen encontrada";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
