<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\LiquidacionesDelegado;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class ProcesoSuspensionesController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $idUsuario = $sesion->get("idUsuario");
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        //$lisParametros["idusuario"] = $sesion->get("idusuario");
        $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros["proceso"] = $procesoActual;
        $lisParametros["procesoActivo"] = count($procesoActual);
        $lisParametros["tiposUsoSuscripcion"] = $liquidacionesDelegado->getTiposDeUsos();
        $genericoModel = new \Llanogas\LlanogasBundle\Models\GenericoModel($conexion);
        $lisParametros["municipios"] = $genericoModel->getMunicipiosPorPerfilAndPrograma($idUsuario, $idEmpresa,PROGRAMA_PROCESO_SUSPENCIONES);
        $response = $this->render("LlanogasLlanogasBundle:Suspension:ProcesoSuspensiones.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
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
        $resultado = $objProcesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_SUSPENSIONES, $idEmpresa);
        $conexion->close();
        return $resultado;
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
            $idEmpresa = $sesion->get("idempresa");
            $idAcceso = $sesion->get("idacceso");
            $procesosEjecucion = $this->consultarProcesoEjecucion($idEmpresa);
            if (count($procesosEjecucion) > 0) {
                throw new MyException("No se puede ejecturar porque ya existe un proceso en ejecución", -1);
            }
            $tipoDeUso = $request->get("tipodeuso");
            $municipios= $request->get("municipios");
            $desde = $request->get("desde");
            $hasta = $request->get("hasta");
            $fechaIni = !empty($request->get("fechaini")) ? $request->get("fechaini") : null;
            $fechaFin = !empty($request->get("fechafin")) ? $request->get("fechafin") : null;
            $idUsuario = $sesion->get("idusuario");
            if (empty($tipoDeUso)) {
                throw new MyException("Debe seleccionar un tipo de uso", -1);
            }
            $this->iniciarProcesoSuspension($idEmpresa, $tipoDeUso, $desde, $hasta, $fechaIni, $fechaFin, $idAcceso, $idUsuario, $municipios);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeError"] = "Se inició correctamente el proceso";
        } catch (\Exception $e) {
            $respuesta["mensajeError"] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consultan los tipos de uso que tiene asociados la empresa
     * @return type
     */
    public function consultarTipoUsoSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $liquidaciones = $liquidacionesDelegado->getTiposDeUsos();
            $respuesta["datos"] = $liquidaciones;
            $respuesta["codigoRespuesta"] = empty($liquidaciones) ? 0 : 1;
            $respuesta["mensaje"] = "Se consulta correctamente los tipos de uso";
        } catch (\Exception $e) {
            $respuesta["mensaje"] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    

    /**
     * Lanza el proceso de suspensiones
     * @param int $idEmpresa identificador de la empresa
     * @param int $tipoDeUso id del tipo de uso de las suscripciones
     * @param int $desde valor inicial del intervalo de cantidad de facturas
     * vencidas por suscripcion
     * @param int $hasta valor final del intervalo de cantidad de facturas
     * vencidas por suscripcion
     * @param timestamp $fechaIni valor inicial de la fecha de vencimiento de 
     * las facturas de la suscripcion
     * @param timestamp $fechaFin valor final de la fecha de vencimiento de 
     * las facturas de la suscripcion
     * @param int $idAcceso identificador del usuario que lanza el proceso
     */
    private function iniciarProcesoSuspension($idEmpresa, $tipoDeUso, $desde, $hasta, $fechaIni, $fechaFin, $idAcceso, $idUsuario, $municipios) {
        try {
            $rutaProyecto = RUTA_PRINCIPAL;
            $parametros = "$idEmpresa $tipoDeUso $desde $hasta $fechaIni $fechaFin $idAcceso $idUsuario $rutaProyecto $municipios";
            $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/ProcesoSuspension.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/suspensiones.log & ";
            Util::ejecutarHilo($script);
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
     * Consulta el resumen de la ejecución del proceso, ya que se encuentra 
     * en subproceso se consulta la tabla de log para mostrar la cantidad 
     * de suscripciones que fueron satisfactios y cuales generaron error 
     * @return type
     * @throws MyException
     */
    public function consultarResumenExitosoAction() {
        try {
            $resultado = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idempresa");
            $primeraPeticion = $request->get("primerapeticion");
            $procesoSuspensiones = new ProcesoSuspensionModel($conexion);
            $sinResultado = $procesoSuspensiones->consultarSinResultados($idEmpresa);

            if (!empty($sinResultado)) {
                throw new MyException(MENSAJE_SIN_SUSPENSIONES, -3);
            }
            $resultado["generadas"] = $procesoSuspensiones->consultarResumenSuccessSus($idEmpresa);
            $resultado["nogeneradas"] = $procesoSuspensiones->consultarResumenNoSuccessSus($idEmpresa);
            if (empty($resultado["generadas"]) && empty($resultado["nogeneradas"]) && !$primeraPeticion) {
                throw new MyException(MENSAJE_SIN_SUSPENSIONES, -3);
            }

            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontro informacion de resumen" : "Informacion de resumen encontrada";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
