<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use \Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/**
 * Inicia el proceso en segundo plano.
 * Clase encargada de aplicar todos los pagos que tengan saldo y cruzarlos con las facturas que 
 * tengan un valor con deuda
 * @author hrey
 */
class ProcesoCerrarRecaudosController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
        $lisParametros['procesoActivo'] = count($procesoActual);
        $lisParametros['proceso'] = $procesoActual;
        $genericoModel = new GenericoModel($conexion);
        $lisParametros['ciclos'] = $genericoModel->consultarCiclosActivosPrograma(COD_PROCESO_CERRAR_RECAUDOS, $idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:ProcesoCerrarRecaudos.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Valida sí el proceso está en ejecución.
     * @param int $idEmpresa identificador de la empresa que esta corriendo el proceso
     * @return type
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objProcesoModel = new ProcesoModel();
        $objProcesoModel->setConexion($conexion);
        $resultado = $objProcesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_CERRAR_RECAUDOS, $idEmpresa);
        $conexion->close();
        return $resultado;
    }

    /**
     * Inicia el proceso de cerrar recaudos
     * @return type
     * @throws MyException
     */
    public function cerrarRecaudosAction() {
        $complementoMensaje = '';
        try {
            $respuesta['codigoRespuesta'] = -1;
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get('idEmpresa');
            $idAcceso = $sesion->get('idAcceso');
            $idCiclo = $request->get('idciclo');
            $objModel = new RecaudosModel($conexion);
            $genericoDelegado = new GenericoDelegado($conexion);
            //Se valida que no se haya ejecutado el programa de acuerdo a la agenda
            $actividad = $genericoDelegado->validarPrograma(COD_PROCESO_CERRAR_RECAUDOS, $idCiclo, $idEmpresa);
            //Verifica que no haya un proceso en ejecución
            $procesosEjecucion = $this->consultarProcesoEjecucion($idEmpresa);
            if (count($procesosEjecucion) > 0) {
                throw new MyException('Ya existe un proceso en ejecución');
            }
            //Se consulta primero la cantidad de recaudos que se van a aplicar 
            //si no encuentra registro se muestra un mensaje que no hay recaudos
            $cantidadRegistros = $objModel->consultarCantidadRecaudosCerrar($idCiclo, $idEmpresa);
            $genericoModel = new GenericoModel($conexion);
            if ($cantidadRegistros <= 0) {
                $genericoModel->actualizarActividad($actividad, 'C');
                throw new MyException('No hay recaudos por cerrar.(Solo se cierra a actividad)', 0);
            }
            $cantidadFacturas = $objModel->consultarCantidadFacturasCruzarRecaudo($idCiclo, $idEmpresa);
            if ($cantidadFacturas <= 0) {
                $complementoMensaje = " Obs(Ciclo con recaudo sin facturas con saldo)";
            }

            if ($actividad['idactividad'] != 0) {
                $genericoModel->actualizarActividad($actividad, 'C');
            }
            //Se lanzan los procesos en segundo plano
            $this->iniciarProcesoConsolidado($idEmpresa, $idAcceso, $idCiclo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensajeError'] = 'Se inició correctamente el proceso ' . $complementoMensaje;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode() || $e->getCode() == 0 ? $e->getCode() : -1;
            $respuesta['mensajeError'] = $e->getMessage() . " " . $complementoMensaje;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lanza el proceso
     * @param int $idEmpresa identificador de  la empresa que ejecuta el proceso
     * @param int $idAcceso Identificador del usuario que lanzó el proceso
     * @param int $idCiclo  
     */
    private function iniciarProcesoConsolidado($idEmpresa, $idAcceso, $idCiclo) {
        $parametros = "$idEmpresa $idAcceso $idCiclo " . RUTA_PRINCIPAL;
//        $proceso = new \Llanogas\LlanogasBundle\ProcesosMasivos\ProcesoCerrarRecaudos($idEmpresa, $idAcceso, $idCiclo);
//        $proceso->iniciarProceso();
        $script = $this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/ProcesoCerrarRecaudos.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cerrar_recaudos.log &";
        Util::ejecutarHilo($script);
    }

    /**
     * Consulta el estado del proceso actual 
     * @return json con la información del proceso
     */
    public function consultarProgresoAction() {
        $respuesta['mensajeError'] = 'Progreso';
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $respuesta['progreso'] = $this->consultarProcesoEjecucion($idEmpresa);
        $respuesta['codigoRespuesta'] = count($respuesta['progreso']);
        return Util::construyeRespuesta($respuesta);
    }

}
