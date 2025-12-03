<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;
use Libranza\LibranzaBundle\Delegado\DesembolsoDelegado;
use Llanogas\LlanogasBundle\Delegado\ProcesoFacturacionDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class CreditosAprobadosController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $desembolsoDelegado = new DesembolsoDelegado($this, $sesion);
        $lisParametros = array();
        $idempresa = $sesion->get('idempresa');
        $lisParametros["empresa"] = $sesion->get("empresa");
        $lisParametros['ciclos'] = $desembolsoDelegado->consultarCiclos($idempresa);
        $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
        $idusuario = $sesion->get("idusuario");
        $lisParametros["motivorechazo"] = $registroCreditoDelegado->obtenerMotivosRechazo($idusuario, PROGRAMA_REGISTRO_DESEMBOLSO_CREDITO);
        $response = $this->render("LibranzaBundle:CreditosAprobados:CreditosAprobados.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    public function AprobarDesembolsoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $desembolsoDelegado = new DesembolsoDelegado($this, $sesion);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $creditos = $request->get('creditos');
            $idClico = $request->get('idciclo'); //se debe descomentarioar cuando se envie desde la interfaz
            $idempresa = $sesion->get('idempresa');
            $estado = $request->get('estado');
            $desembolso = $desembolsoDelegado->procesarDesembolso($creditos, $idempresa, $idClico);
            // Enviar correo de credito desembolsado           
            foreach ($desembolso as $credito) {
                $registroCreditoDelegado->enviarCorreoCreditoDesembolsado($credito['idcredito']);
            }            
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se ha realizado los desembolsos seleccionados con éxito';
            $respuesta['datos'] = $desembolso;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * CAmbia el estado de las solicituddes de crédito
     * @return type
     */
    public function aprobarSinDesembolsarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $estado = $request->get('estado');
            $idmotivo = $request->get('motivo');
            $comentario = $request->get('comentario');
            $creditos = $request->get('creditos');

            foreach ($creditos as $credito) {
                $registroCreditoDelegado->aprobarCreditoAprobadoNoDesembolsado($credito['idcredito'], $idmotivo, $comentario, $estado);
            }

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Los créditos fueron aprobados correctamente';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return type 
     */
    public function ObtenerCreditosAprobadosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $desembolsoDelegado = new DesembolsoDelegado($this, $sesion);
            $creditosAprobados = $desembolsoDelegado->obtenerCreditosAprobados();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $creditosAprobados;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
