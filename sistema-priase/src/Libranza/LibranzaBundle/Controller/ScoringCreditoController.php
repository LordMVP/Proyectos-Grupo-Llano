<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\CalificarCreditoDelegado;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;


use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class ScoringCreditoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
        $calificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
        $idusuario = $sesion->get("idusuario");
        $idempresa = $sesion->get('idempresa');
        $lisParametros["motivovalidar"] = $registroCreditoDelegado->obtenerMotivosValidacion($idusuario, PROGRAMA_REGISTRO_SCORING);
        $lisParametros["motivorechazo"] = $registroCreditoDelegado->obtenerMotivosRechazo($idusuario, PROGRAMA_REGISTRO_SCORING);
        $lisParametros["liquidaciones"] = $calificarCreditoDelegado->obtenerLiquidaciones($idempresa);
        $response = $this->render("LibranzaBundle:CalificarCredito:CalificarSolicitud.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * permite consultar el estado del credito
     * @return type
     */
    public function obtenerCalificacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $CalificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $idcredito = $request->get('idcredito');
            $resultado = $CalificarCreditoDelegado->obtenerCalificacionCredito($idcredito);
            $param_estudio[0]['valor'] =  $request->get('monto_credito');
            $estudio_credito = $CalificarCreditoDelegado->cacularEstudioCredito($idcredito, $param_estudio);
            $resultado2['estudio_credito'] = $estudio_credito ;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Credito calificado con éxito.   Radicado Número ' . $idcredito;
            $respuesta['datos'] = $resultado;
            $respuesta['datos1'] = $resultado2 ;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function registrarCalificacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $CalificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $idcredito = $request->get('idcredito');
            $variables = $request->get('variables');
            $motivo = $request->get('idmotivo');
            $comentario = $request->get('comentario');
            $estado = $request->get('estado');
            $idliquidacion = $request->get('idliquidacion');
            $seguro = $request->get('seguro');
            $estudioCredito = $request->get('estudiocredito');
            if (!empty($variables)) {
                $CalificarCreditoDelegado->calificarCredito($idcredito, $variables, $idliquidacion);
            }
            $registroCreditoDelegado->AprobarRechazarSolicitud($estado, $motivo, $comentario, $idcredito);
            //Actualiza el credito con la infomacion del seguro y el estudio del credito
            $registroCreditoDelegado->actualizarCredito($idcredito, $seguro, $estudioCredito);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se procesó el crédito correctamente';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }
    public function ActualizarInformacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $CalificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $idcredito = $request->get('idcredito');
            $monto = $request->get('monto');
            $plazo = $request->get('plazo');
            $CalificarCreditoDelegado->actualizarInformacionActivos($idcredito, $monto, $plazo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se guardó la información correctamente';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function ValidarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $CalificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $idcredito = $request->get('idcredito');
            $parametros = $request->get('parametros');
            $resultado = $CalificarCreditoDelegado->validarCalificacionCredito($idcredito, $parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
            $respuesta['datos'] = $resultado;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        
        return Util::construyeRespuesta($respuesta);
    }

}
