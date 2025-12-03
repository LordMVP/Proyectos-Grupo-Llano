<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\ProcesoModel;

/**
 * Clase que ejecuta un proceso en segundo plano que se encarga de aplicar los recuados que tiene saldo
 *
 * @author hrey
 */
class AplicarRecaudosController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idempresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros['procesoActivo'] = count($procesoActual);
        $lisParametros['proceso'] = $procesoActual;
        $lisParametros['tiposSuscripcion'] = $this->consultarTiposSuscripcion($idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:Aplicar.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los tipos de suscripción de acuerdo a una empresa.
     * @param int $idEmpresa Empresa del usuario que ha iniciado sesión.
     * @return array con el listado de registros.
     */
    private function consultarTiposSuscripcion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objModel = new RecaudosModel();
        $objModel->setConexion($conexion);
        $tiposSuscripcion = $objModel->consultarTiposSuscripcion($idEmpresa);
        return $tiposSuscripcion;
    }

    /**
     * Método que se encarga de verificar sí hay otro usuario ejecutando el mismo proceso.
     * @param int $idEmpresa Empresa que pertenece el usuario que inicio sesión.
     * @return array información del proceso que ejecuto el proceso.
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objProcesoModel = new ProcesoModel();
        $objProcesoModel->setConexion($conexion);
        $resultado = $objProcesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_APLICAR_RECAUDOS, $idEmpresa);
        $conexion->close();
        return $resultado;
    }

    /**
     * Método encargado de ejecutar en segundo plano.
     * @return json con la información del proceso en ejecución.
     * @throws MyException Error en la petición.
     */
    public function aplicarRecaudosAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get('idempresa');
            $idAcceso = $sesion->get('idAcceso');
            $procesosEjecucion = $this->consultarProcesoEjecucion($idEmpresa);
            if (count($procesosEjecucion) > 0) {
                throw new MyException('Proceso en ejecución');
            }
            //Se obtiene la conexión del controlador
            $conexion = Util::getConexion($this);
            $proceso = new \Llanogas\LlanogasBundle\Models\ProcesoRecaudosModel($conexion);
            $idTipoSuscripcion = $request->get('idTipoSuscripcion');
            $recaudosDisponibles = $proceso->getRecaudosDisponibleTipoSuscripcion($idTipoSuscripcion, $idEmpresa, 0);

            if (empty($recaudosDisponibles)) {
                throw new MyException('No hay registros por procesar', 0);
            }
            //Lanza el proceso en segundo plazo
            $this->iniciarProcesoConsolidado($idEmpresa, $idAcceso, $idTipoSuscripcion);
            // se coloca un sleep de 2 segundos para que el motor alcance  a persistir la tabla en el motor
            sleep(2);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensajeError'] = 'Se inició correctamente el proceso';
        } catch (\Exception $e) {
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lanza proceso de aplicar recaudos.
     * @param int $idEmpresa empresa que ejecuta el proceo
     * @param int $idMotivoSuspension Con que motivo de suspensión se realiza el proceso
     * @param int $idAcceso Que usuario ejecutó el proceso.
     * @param int $idTipoSuscripcion  A qué tipos de suscripción se va ejecutar el proceso.
     */
    private function iniciarProcesoConsolidado($idEmpresa, $idAcceso, $idTipoSuscripcion) {
        try {
            $parametros = "$idEmpresa $idAcceso $idTipoSuscripcion " . RUTA_PRINCIPAL;
            $script = $this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/ProcesoAplicarRecaudos.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/aplicar-recaudos.log & ";
            //Se ejecuta el proceso en segundo plano de acuerdo al sistema operativo
            Util::ejecutarHilo($script);
        } catch (\Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     * Consulta el avance del proceso
     * @return json con la información del proceso en ejecución.
     */
    public function consultarProgresoAction() {
        $respuesta['mensajeError'] = 'Progreso';
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $respuesta['progreso'] = $this->consultarProcesoEjecucion($idEmpresa);
        $respuesta['codigoRespuesta'] = count($respuesta['progreso']);
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * función encargada de mostrar el resumen del proceso de segundo plano
     * @return json con la respuesta estándar
     */
    public function resumenAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            $objModel = new RecaudosModel();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $objModel->setConexion($conexion);
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get('idempresa');
            $objModel->resumenSinResultados($idEmpresa);
            $resultado = $objModel->resumen($idEmpresa);
            //Se valida que código de respuesta se va a enviar al usuario
            $respuesta['codigoRespuesta'] = empty($resultado) ? 0 : 1;
            $respuesta['mensaje'] = 'El proceso de aplicar recaudos ha terminado correctamente';
            $respuesta['resumen'] = $resultado;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = 0;
            $respuesta['mensaje'] = 'No se encontró información';
        }
        return Util::construyeRespuesta($respuesta);
    }

}
