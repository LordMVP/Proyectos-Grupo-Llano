<?php

namespace Libranza\LibranzaBundle\Controller;

use Libranza\LibranzaBundle\Delegado\CalificarCreditoDelegado;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class AprobarRechazarCreditoController extends Controller {

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
        $lisParametros["motivovalidar"] = $registroCreditoDelegado->obtenerMotivosValidacion($idusuario, PROGRAMA_REGISTRO_APROBACION_CREDITO);
        $lisParametros["motivorechazo"] = $registroCreditoDelegado->obtenerMotivosRechazo($idusuario, PROGRAMA_REGISTRO_APROBACION_CREDITO);
        $response = $this->render("LibranzaBundle:AprobarCredito:AprobarSolicitud.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * permite consultar el estado del credito
     * @return type
     */
    public function AprobadoRechazarAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $estado = $request->get('estado');
            $motivo = $request->get('motivo');
            $comentario = $request->get('comentario');
            $idcredito = $request->get('idcredito');

            $listaCreditos = $registroCreditoDelegado->AprobarRechazarSolicitud($estado, $motivo, $comentario, $idcredito);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'El crédito ' . $idcredito . ' se actualizó exitosamente';
            $respuesta['creditos'] = $listaCreditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function ObtenerCalificacionParametrizadaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $calificarCreditoDelegado = new CalificarCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $idcredito = $request->get('idcredito');

            $calificaciones = $calificarCreditoDelegado->obtenerCalificacionesParametrizadas($idcredito);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
            $respuesta['calificacion'] = $calificaciones;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

}
