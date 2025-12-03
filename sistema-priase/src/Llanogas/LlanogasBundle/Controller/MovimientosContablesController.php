<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\MovimientosContablesDelegado;

/**
 * Clase encargada de administrar generar los movimientos 
 * contables
 */
class MovimientosContablesController extends Controller {

    /**
     *
     * @var \Llanogas\LlanogasBundle\Delegado\MovimientosContablesDelegado
     */
    private $movimientosContablesDelegado;

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $this->movimientosContablesDelegado = new MovimientosContablesDelegado($this, $sesion);
        $listaParametros = array();
        $listaParametros['empresa'] = $sesion->get('empresa');
        $listaParametros['ciclos'] = $this->movimientosContablesDelegado->listarCiclosGeneral(38);
        $response = $this->render('LlanogasLlanogasBundle:MovimientosContables:movimientocontable.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Permite procesar los movimientos contables 
     *  /contabilizacion/movimientos_contables/procesar/
     * @return type
     */
    public function procesarMovimientosContablesAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $respuesta["codigoRespuesta"] = 1;
            $idciclo = $request->get('idciclo');
            $idperiodoCerrado = $request->get('idperiodo');
           // print_r($idperiodoCerrado);
            if(empty($idperiodoCerrado) || $idperiodoCerrado == -1){
                $idperiodoCerrado = 0 ; 
            }
            
            if (empty($idciclo)) {
                throw new MyException('Error, el ciclo es obligatorio', -1);
            }
            $this->movimientosContablesDelegado = new MovimientosContablesDelegado($this, $sesion);
            $movimiento = $this->movimientosContablesDelegado->procesarMovimientosContables($idciclo, $this->container, $idperiodoCerrado);

            $mensajeSalida = "Proceso lanzado..";
            if (isset($movimiento['idProceso'])) {
                $mensajeSalida = 'Proceso en ejecución por el usuario ' . $movimiento['usuario'];
            }
            $respuesta['movimiento'] = $movimiento;
            $respuesta['mensaje'] = $mensajeSalida;
            $respuesta['idperiodocerrado'] = $idperiodoCerrado;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * /contabilizacion/movimientos_contables/estado
     * Consulta si hay un proceso en ejecución
     * @return type
     */
    public function estadoMovimientoAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = 1;
            $this->movimientosContablesDelegado = new MovimientosContablesDelegado($this, $sesion);
            $movimiento = $this->movimientosContablesDelegado->obtenerEjecucionActual(false);
            $respuesta['movimiento'] = $movimiento;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function consultaCiclosAction(){
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idEmpresa");
            
            $consultaCiclos = new \Llanogas\LlanogasBundle\Delegado\GenericoDelegado($conexion);
            $idciclos = $consultaCiclos->obtenerCiclosActivosPrograma(PROGRAMA_MOVIMIENTO_CONTABLE, $idEmpresa);
           
            $respuesta['ciclos'] = $idciclos;
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['movimiento'] = $idciclos;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function consultaPeriodosAction(){
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $conexion = Util::getConexion($this);
            
            $consultaCiclos = new \Llanogas\LlanogasBundle\Delegado\GenericoDelegado($conexion);
            $idCiclo = $request->get("idciclo");
            $idperiodos = $consultaCiclos->getCicloPeriodoAnteriorDelegado($idCiclo);
            
            $respuesta['periodos'] = $idperiodos;
            $respuesta["codigoRespuesta"] = 1;
            
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
     public function consultaCicloGeneralAction(){
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $conexion = Util::getConexion($this);
            $this->movimientosContablesDelegado = new MovimientosContablesDelegado($this, $sesion);
            $consultaCiclos =  $this->movimientosContablesDelegado->listarCiclosGeneral(38);
            
            $respuesta['ciclos'] = $consultaCiclos;
            $respuesta["codigoRespuesta"] = 1;
            
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
