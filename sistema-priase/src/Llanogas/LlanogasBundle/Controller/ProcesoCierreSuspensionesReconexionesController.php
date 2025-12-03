<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de generar los nuevos encabezados de suspensión 
 * y reconexión de los usuarios que están en mora
 *
 * @author mebonilla
 */
class ProcesoCierreSuspensionesReconexionesController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $procesoSuspensionModel = new ProcesoSuspensionModel($conexion);
        //$procesoSuspensionModel->crearTablaResumenCierre($idEmpresa);
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros["procesoActivo"] = count($procesoActual);
        $lisParametros["proceso"] = $procesoActual;
        $genericoDelegado = new GenericoDelegado($conexion);
        try {
            $ciclos = $genericoDelegado->obtenerCiclosActivosPrograma(COD_PROCESO_CERRAR_SYR, $sesion->get("idempresa"));
            if (!empty($ciclos)) {
                $lisParametros["ciclos"] = $ciclos;
            }
        } catch (\Exception $exc) {
            
        }
        $response = $this->render("LlanogasLlanogasBundle:Suspension:ProcesoCierre.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Envía los parámetros al hilo que va a ejecutar el proceso de cierre
     * @return array respuesta del servidor
     * @throws MyException
     */
    public function procesarSuspensionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get("idEmpresa");
            $idAcceso = $sesion->get("idAcceso");
            $idCiclo = $request->get("idciclo");
            $idUsuario = $sesion->get("idusuario");
            $procesosEjecucion = $this->consultarProcesoEjecucion($idEmpresa);
            //Se valida que no haya otro proceso en ejecución 
            if (count($procesosEjecucion) > 0) {
                throw new MyException("Proceso en ejecución");
            }
            if (empty($idCiclo)) {
                throw new MyException("Error el ciclo es obligatorio", -1);
            }
            $genericoDelegado = new GenericoDelegado(Util::getConexion($this));
            //Se valida que el programa no se haya ejecutado
            $genericoDelegado->validarPrograma(COD_PROCESO_CERRAR_SYR, $idCiclo, $sesion->get("idempresa"));
            $this->iniciarProcesoSuspension($idEmpresa, $idAcceso, $idCiclo, $idUsuario);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeError"] = "Se inició el procesos correctamente";
        } catch (\Exception $e) {
            $respuesta["codigoRespuesta"] = $e->getCode();
            $respuesta["mensajeError"] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lanza el proceso de suspensiones por ejecucion
     * @param type $idEmpresa id de la empresa logueada en pa aplicacion
     * @param type $idAcceso id de acceso del usuario
     * @param type $idCiclo ciclo en el que se va a ejecutar el proceso
     * @param type $idUsuario id del usuario que lanza el proceso
     */
    private function iniciarProcesoSuspension($idEmpresa, $idAcceso, $idCiclo, $idUsuario) {
        try {
            $rutaProyecto = RUTA_PRINCIPAL;
            /*$obj = new \Llanogas\LlanogasBundle\ProcesosMasivos\ProcesoCierreSuspensionesReconexiones($idEmpresa, $idAcceso, $idCiclo, $idUsuario);
            $obj->run();
            */
              //Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio
            $this->quitarValorAporteVoluntario($idEmpresa, $idCiclo, $idUsuario);
            //Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio
            $parametros = "$idEmpresa $idAcceso $rutaProyecto $idCiclo $idUsuario";
            $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/ProcesoCierreSuspensionesReconexiones.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cierresyr.log & ";
            //$test = new \Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoCierresSuspensionesReconexiones($idCiclo, $idEmpresa, $idAcceso, 60, $idUsuario); 
            //$test->iniciar(); 
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
     * Verifica que el proceso no se esté ejecutando por otro usuario.
     * @param int $idEmpresa identificador de la empresa.
     * @return array con la información del proceso
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        try {
            $conexion = Util::getConexion($this);
            $objProcesoModel = new ProcesoModel();
            $objProcesoModel->setConexion($conexion);
            $resultado = $objProcesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_CERRAR_SYR, $idEmpresa);
            $conexion->close();
            return $resultado;
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
        }
    }

    /**
     * Consulta el resumen de los usuarios que se ejecutó 
     * correctamente el proceso y los que tuvieron alguna novedad
     * @return json resultado de la ejecición del proceso
     */
    public function consultarResumenExitosoAction() {
        try {
            $resultado = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idempresa");
            $procesoSuspensiones = new ProcesoSuspensionModel($conexion);

            $sinResultado = $procesoSuspensiones->consultarResumenSinResultadoSyr($idEmpresa);
            if (!empty($sinResultado)) {
                throw new MyException(MENSAJE_SIN_SUSPENSIONES, -3);
            }
            $resultado["generadas"] = $procesoSuspensiones->consultarResumenSuccessSyr($idEmpresa);
            $resultado["nogeneradas"] = $procesoSuspensiones->consultarResumenNoSuccessSyr($idEmpresa);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado["generadas"]) && empty($resultado["generadas"])) ? "No se encontro informacion de resumen" : "Informacion de resumen encontrada";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    //Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio
    /**
    * Método encargado de quitar el valor de Aporte Voluntario
    * el usuario que no pago el periodo anterior
    */
   public function quitarValorAporteVoluntario($idEmpresa, $idCiclo, $idUsuario) {
      try {
          $conexion = Util::getConexion($this);
          $procesoSuspensiones = new ProcesoSuspensionModel($conexion);
          // print_r(" Se inician a quitar valores de Aporte voluntario");
          $procesoSuspensiones->quitarValorAporteVoluntario($idEmpresa, $idCiclo, $idUsuario);
       } catch (\Exception $e) {
           print_r($e->getMessage());
       }
   }
 //fin Logica adicional x Emergencia COVID 19 - Alcaldia Villavicencio 

}
