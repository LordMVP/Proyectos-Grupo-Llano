<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class ValidarCreditoController extends Controller {

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
        $lisParametros["motivovalidar"] = $registroCreditoDelegado->obtenerMotivosValidacion($idusuario, PROGRAMA_REGISTRO_VALIDACION_CREDITO);
        $lisParametros["motivorechazo"] = $registroCreditoDelegado->obtenerMotivosRechazo($idusuario, PROGRAMA_REGISTRO_VALIDACION_CREDITO);
        $response = $this->render("LibranzaBundle:ValidarCredito:ValidarSolicitud.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * permite consultar el estado del credito
     * @return type
     */
    public function consultarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $parametros['estado'] = $request->get('estado');
            $parametros['nombre'] = $request->get('nombre');
            $parametros['documento'] = $request->get('documento');
            $parametros['idcredito'] = $request->get('radicado');
            if (!empty($parametros['idcredito'])) {
                if (!is_numeric($parametros['idcredito'])) {
                    throw new MyException('El campo credito debe ser numerico', -1);
                }
            }
            if (empty($parametros['idcredito'])) {
                $parametros['idcredito'] = -1;
            }
            if (empty($parametros['documento'])) {
                $parametros['documento'] = -1;
            }
            if (empty($parametros['nombre'])) {
                $parametros['nombre'] = -1;
            }
            $listaCreditos = $registroCreditoDelegado->consultar($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Credito validado con éxito.   Radicado Número ' . $parametros['idcredito'];
            $respuesta['creditos'] = $listaCreditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    /**
     * permite consultar el estado del credito
     * @return type
     */
    public function evaluarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $estado = $request->get('estado');
            $idmotivo = $request->get('idmotivo');
            $comentario = $request->get('comentario');
            $idcredito = $request->get('idcredito');

            $registroCreditoDelegado->validarCredito($idcredito, $idmotivo, $comentario, $estado);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'El crédito ' . $idcredito . ' se actualizó exitosamente';
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

}
