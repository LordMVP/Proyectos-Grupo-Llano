<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\ResumenCreditoDelegado;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class ResumenCreditoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $response = $this->render("LibranzaBundle:ResumenCreditos:ResumenCreditos.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Función que obtiene el listado con etapas y productos del crédito
     */
    public function obtenerEtapasCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $resumenCreditoDelegado = new ResumenCreditoDelegado($this, $sesion);
            $etapas = $resumenCreditoDelegado->obtenerEtapasCredito();
            $productos = $resumenCreditoDelegado->obtenerDestinoCredito();
            $empresas = $resumenCreditoDelegado->obtenerEmpresas();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['etapas'] = $etapas;
            $respuesta['productos'] = $productos;
            $respuesta['empresas'] = $empresas;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función que obtiene el listado de solicitudes de crédito
     */
    public function obtenerCreditosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            $resumenCreditoDelegado = new ResumenCreditoDelegado($this, $sesion);
            $parametros = $request->get('parametros');
            $creditos = $resumenCreditoDelegado->obtenerCreditos($parametros);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $creditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función que obtiene el listado de comentarios de un crédito
     */
    public function obtenerComentariosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            $resumenCreditoDelegado = new ResumenCreditoDelegado($this, $sesion);
            $idcredito = $request->get('idcredito');
            $comentarios = $resumenCreditoDelegado->obtenerComentarios($idcredito);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $comentarios;
            $respuesta['radicado'] = $idcredito;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función que obtiene información específica de un crédito
     */
    public function obtenerInformacionAction() {
        try {
            Util::iniciarSesion($this);
            $request = $this->get('request');
            $parametros = $request->get('parametros');
            $_SESSION['paramCredito'] = $parametros;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se a guardado el crédito';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function renderDetallesAction() {

        $sesion = Util::iniciarSesion($this);
        $param = $sesion->get('paramCredito');
        $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);

        $parametros = Array();
        $parametros['idcredito'] = $param['idcredito'];
        $parametros['estado'] = $param['estado'];
        $parametros['documento'] = '';
        $parametros['nombre'] = '';

        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $lisParametros["estado"] = $param['estado'];
        $lisParametros["numeroradicado"] = $param['idcredito'];
        $response = $this->render("LibranzaBundle:SolicitudCredito:Informativo.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

}
