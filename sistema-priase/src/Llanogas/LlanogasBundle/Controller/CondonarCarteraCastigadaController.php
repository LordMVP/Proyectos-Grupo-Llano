<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\CondonarCarteraCastigadaDelegado;

/**
 * Permite generar la cartera castigada
 * /facturacion/proceso/cartera/castigada/suscripción/
 * @author sergio vargas
 */
class CondonarCarteraCastigadaController extends Controller {

    //put your code here
    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:CondonarCarteraCastigada.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Función encargada de filtrar las suscripciones 
     * que se va a condonar las facturas castigadas
     * @return json
     */
    public function FiltrarSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $codigoanterior = $request->get('codigoanterior');
            if (!isset($idsuscripcion) && !isset($codigoanterior)) {
                throw new MyException('Error, suscripción o código anterior obligatorios.', -1);
            }
            $condonarCastigadaSuscripcion = new CondonarCarteraCastigadaDelegado($this, $sesion);
            $respuesta ['suscripcion'] = $condonarCastigadaSuscripcion->filtrarSuscripciones($idsuscripcion, $codigoanterior);
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las facturas que están en estado 'C'
     * @return json para mostrar en la interfaz
     */
    public function cargarFacturasCastigadasAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            if (!isset($idsuscripcion)) {
                throw new MyException('Error, suscripción obligatoria. ', -1);
            }
            $condonarCastigadaSuscripcion = new CondonarCarteraCastigadaDelegado($this, $sesion);
            $respuesta ['facturascastigadas'] = $condonarCastigadaSuscripcion->obtenerFacturasCastigadas($idsuscripcion);
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     *  Consulta los detalles de las facturas seleccionadas y únicamente 
     * los conceptos que suman
     * @return type
     */
    public function listarConceptosFacturaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idfactura = $request->get('idfactura');
            if (!isset($idfactura)) {
                throw new MyException('Error, identificador de factura obligatorio.', -1);
            }
            $condonarCastigadaSuscripcion = new CondonarCarteraCastigadaDelegado($this, $sesion);
            $respuesta = $condonarCastigadaSuscripcion->obtenerConceptosFacturas($idfactura);
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función que se encarga a procesar la información de agregarles las notas créditos a las facturas castigadas
     * @return type
     */
    public function procesarCarteraCastigadaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $facturas = $request->get('facturas');
            if (!isset($facturas)) {
                throw new MyException('No existen facturas para condonar. ', -1);
            }
            $condonarCastigadaSuscripcion = new CondonarCarteraCastigadaDelegado($this, $sesion);
            $respuesta = $condonarCastigadaSuscripcion->procesarCondonarCarteraCastigada($facturas);
            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = 'Cartera condonada con éxito';
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

   /**
     * Consulta los permisos para activar botones de seleccion de facturas para condonacion de cartera a una suscripcion
     * @return json Resultado con la informacion de permisos
     */		
    public function consultarPermisosBotonesCondonacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $suscripcion = $request->get("idprograma");
            $condonarCarteraCastigadaDelegado = new CondonarCarteraCastigadaDelegado($this, $sesion);
            $permisos = $condonarCarteraCastigadaDelegado->consultarPermisosBotonesFacturas();

            $respuesta["codigoRespuesta"] = (empty($permisos) ? 0 : 1);
            $respuesta["datos"] = $permisos;
            $respuesta["mensaje"] = (empty($permisos)) ? "El Usuario No tiene registrado permisos para consultar Facturas" : "consulta exitosa...";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

     /**
     * Obtiene la informacion de las facturas de una suscripcion
     * @return json Resultado con la informacion de las facturas de la
     * suscripcion
     */

    public function getFacturasIntCorrienteSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $condonarCarteraCastigadaDelegado= new condonarCarteraCastigadaDelegado($this, $sesion);
            $facturas = $condonarCarteraCastigadaDelegado->obtenerFacturasCarteraIntCorriente($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($facturas) ? 0 : 1);
            $respuesta["datos"] = $facturas;
            $respuesta["mensaje"] = (empty($facturas)) ? "Suscripción sin facturas" : "La consulta se realizó correctamente";

        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }


}
