<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;
use Libranza\LibranzaBundle\Delegado\DesembolsoDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class AprobadoNoDesembolsadoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
        $idusuario = $sesion->get("idusuario");
        $lisParametros["motivoaprobar"] = $registroCreditoDelegado->obtenerMotivosRechazo($idusuario, PROGRAMA_REGISTRO_DESEMBOLSO_CREDITO);
        $response = $this->render("LibranzaBundle:AprobadoNoDesembolsado:AprobadoNoDesembolsado.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * permite consultar el estado del credito
     * @return type
     */
    public function aprobarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $estado = $request->get('estado');
            $idmotivo = $request->get('idmotivo');
            $comentario = $request->get('comentario');
            $idcredito = $request->get('idcredito');

            $registroCreditoDelegado->aprobarCreditoAprobadoNoDesembolsado($idcredito, $idmotivo, $comentario, $estado);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'El crédito ' . $idcredito . ' se actualizó exitosamente';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

}
