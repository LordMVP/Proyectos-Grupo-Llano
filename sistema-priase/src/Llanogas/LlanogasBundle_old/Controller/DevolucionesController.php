<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\DevolucionesDelegado;

/**
 * Clase encargada de controlar la devolución de un recaudo,
 * La devolución del recaudo está dada total.
 */
class DevolucionesController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $devolucionesDelegado = new DevolucionesDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['motivos'] = $devolucionesDelegado->ObtenerMotivos();
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:Devoluciones.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta la suscripción que se quiere hacer la devolución
     * @return type
     * @throws MyException
     */
    public function consultarSuscripcionesAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $devolucionesDelegado = new DevolucionesDelegado($this, $sesion);
            $idSuscripcion = $request->get('idsuscripcion');
            $cedula = $request->get('documento');
            $codigoAnterior = $request->get('codanterior');
            if (!is_numeric($idSuscripcion) && empty($codigoAnterior) && empty($cedula)) {
                throw new MyException('Debe ingresar un criterio de búsqueda', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Consulta realizada correctamente';
            $respuesta['suscripciones'] = $devolucionesDelegado->obtenerSuscripciones($idSuscripcion, $cedula, $codigoAnterior);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return type
     * @throws MyException
     */
    public function consultarDetalleRecaudoFacturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $devolucionesDelegado = new DevolucionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idrecaudofactura = $request->get('idrecaudofactura');
            if (!is_numeric($idrecaudofactura)) {
                throw new MyException('Error en el identificador ', -1);
            }
            $tipo = $request->get('tipo');
            if (empty($tipo)) {
                throw new MyException('Debe existir un tipo ', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Consulta realizada correctamente';
            //Se consultan la distribución de un recaudo o la facrtura que origina el anticipo
            $respuesta['devoluciones'] = $devolucionesDelegado->obtenerDetalleRecaudoFactura($idrecaudofactura, $tipo);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consultan los recaudos que se le pueden realizar una devolución
     * @return json con la lista de recaudos que tiene un saldo por aplicar
     */
    public function consultarDevolucionesAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $devolucionesDelegado = new DevolucionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, identificador de suscripción obligatorio ', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Consulta realizada correctamente';
            $respuesta['devoluciones'] = $devolucionesDelegado->obtenerDevoluciones($idSuscripcion);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se guarda la devolución, se registra una nota crédito al recaudo por el 
     * valor del mismo para que después sea contabilizada
     * @return type
     */
    public function grabarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $devolucionesDelegado = new DevolucionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $informacion['idmotivo'] = $request->get('idmotivo');
            $informacion['comentario'] = $request->get('comentario');
            $informacion['idsuscripcion'] = $request->get('idsuscripcion');
            //Un arreglo con los ids de los recaudos o facturas a realizar la devolución
            $informacion['devoluciones'] = $request->get('devoluciones');
            $respuesta['notas'] = $devolucionesDelegado->consultaProcesoAplicar($informacion);
//            $respuesta['notas'] = $devolucionesDelegado->grabarDevoluciones($informacion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se registró correctamente la devolución ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
