<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\Delegado\EliminarFacturaDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 * Registra los conceptos más antiguos
 */
class EliminarFacturasController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDelegado = new RecaudosDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:eliminarFacturas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Método que filtra las suscripciones a las que se les puede hacer 
     * abono
     * @return json Objeto json con el arreglo de los registros.
     * @throws MyException Error sí el usuario  no digita los parámetros 
     */
    public function consultarSuscripcionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $documento = $request->get('documento');
            $codAnterior = $request->get('codanterior');
            $idSuscripcion = $request->get('idsuscripcion');
            $estado = $request->get('estado');
            $suscripciones = $request->get('suscripcionesvarias'); 
            $eliminarFacturaDelegado = new EliminarFacturaDelegado($this, $sesion);
            $suscripciones = $eliminarFacturaDelegado->getSuscripcionesDelegado($documento, $idSuscripcion, $codAnterior, $suscripciones);
            
            $respuesta["codigoRespuesta"] = (empty($suscripciones)) ? 0 : 1;
            $respuesta['suscripciones'] = $suscripciones;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de consultar las facturas por una suscripción.
     * @return json Object json con la información de las facturas.
     * @throws MyException Error sí la petición no se hace por el método POST
     */
    public function cargarFacturaSuscripcionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suscripcion = $request->get('suscripcion');
            if (empty($suscripcion)) {
                throw new MyException("No se encontró la suscripción", -1);
            }
            $idsSuscripcion = str_replace('"', '', $suscripcion);
            $eliminarFacturaDelegado = new EliminarFacturaDelegado($this, $sesion);
            $respuesta = $eliminarFacturaDelegado->consultaFacturaSuscripcion($idsSuscripcion);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = 0;
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function eliminarFacturaSuscripcionAction(){
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idFatura = $request->get('factura');
            if (empty($idFatura)) {
                throw new MyException("No hay facturas para eliminar", -1);
            }
//            print_r($idFatura);
//            echo("\nconrolador \n");
            $eliminarFacturaDelegado = new EliminarFacturaDelegado($this, $sesion);
            $respuesta = $eliminarFacturaDelegado->actualizarFacturasSuscricion($idFatura);
            
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeRespuesta"] = "Se eliminó la factura Seleccionada";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
