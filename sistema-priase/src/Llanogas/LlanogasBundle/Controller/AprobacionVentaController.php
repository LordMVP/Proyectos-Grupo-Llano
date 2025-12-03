<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\AprobacionVentaDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase encargada de administrar el registro de ventas.
 */
class AprobacionVentaController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $lisParametros['version'] = '1.0.2';
        $response = $this->render('LlanogasLlanogasBundle:Ventas:aprobar_ventas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function getListaAgendasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            $aprobacionDelegado = new AprobacionVentaDelegado($this, $sesion);
            $listaAgendas = $aprobacionDelegado->getListaAgendas($idVenta);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['agendas'] = $listaAgendas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function aprobarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            $accion = $request->get('accion');
            $observacion = $request->get('observacion');
            if (empty($observacion)) {
                throw new MyException('Debe ingresar una observación', -1);
            }
            $aprobacionVenta = new AprobacionVentaDelegado($this, $sesion);
            //Se valida que acción se va a realizar si se E=Eliminar, A=Aprobar 
            if ($accion == 'E') {
                $aprobacionVenta->eliminarVenta($accion, $idVenta, $accion, $observacion);
            } else {
                $agenda = $request->get('agenda');
                $aprobacionVenta->aprobarVenta($idVenta, $agenda, $observacion);
            }
            $mensaje = ($accion == 'E') ? 'eliminó' : 'aprobó';
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Se $mensaje correctamente la venta con número " . $idVenta;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultaHistoricoVentaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            $aprobacionDelegado = new AprobacionVentaDelegado($this, $sesion);
            $historicoVenta = $aprobacionDelegado->consultaHistoricoVenta($idVenta);
            $historicoVenta = $historicoVenta >= 1 ? $historicoVenta = '1' : $historicoVenta = '0';

            $respuesta['codigoRespuesta'] = $historicoVenta;
            $respuesta['historico'] = $historicoVenta;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
