<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Registra un recaudo en forma de pago.
 */
class PagosController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDeledado = new RecaudosDelegado($this, $sesion);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        //cargar el combo de medios de pago
        $cmbMedioPago = $recaudosDeledado->cargarComboDb('cmbMedioPago');
        $lisParametros['cmbMedioPago'] = $cmbMedioPago;

        $cmbClasePago = $recaudosDeledado->cargarComboDb('cmbClasePago', 'PA', PROGRAMA_PAGOS_ID);
        $lisParametros['cmbClasePago'] = $cmbClasePago;

        $cmbSucursal = $recaudosDeledado->consultarSucursal(PROGRAMA_PAGOS_ID, $idUsuario);
        $lisParametros['cmbSucursal'] = $cmbSucursal;

        $response = $this->render('LlanogasLlanogasBundle:Recaudos:pagos.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Genera el nuevo registro en recaudos.
     * @return json con la información de la transacción
     */
    public function registrarPagoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            $idEmpresa = $sesion->get('idEmpresa');
            Util::validarPeticion($this);
            $recaudo = $request->get('pago');
            $idRecaudo = $recaudosDelegado->insertarRecaudoAbono($recaudo, $idEmpresa);
            // Creacion de registro de autorizacion de impresion en la creacion del recaudo
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $idUsuario = $sesion->get('idusuario');
            $impresion = $request->get('impresion');
            //Se valida que sea la primera impresión del usuario con ese recaudo
            if (!empty($impresion) && $impresion > 0) {
                $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idUsuario);
            } else {
                $cantLimite = $autorizarImpresionesDelegado->obtenerLimiteImpresionRecaudo($idRecaudo);
                $imp = 1;
                if ($cantLimite['impresiones'] == 0) {
                    $imp = 0;
                }
                $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idUsuario, $imp);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeRespuesta"] = 'Se registró correctamente el pago con número: ' . $idRecaudo;
            $respuesta['recaudo'] = $recaudosDelegado->getRecaudoInfo($idRecaudo);
            $respuesta['impresionrecaudo'] = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario);
        } catch (MyException $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las suscripciones de un suscriptor
     * @return json lista de suscripciones 
     */
    public function getSuscripcionesPagoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscriptor = $request->get('idsuscriptor');
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            $suscripciones = $recaudosDelegado->getSuscripcionesPagos($idSuscriptor);
            $respuesta['codigoRespuesta'] = (empty($suscripciones)) ? 0 : 1;
            $respuesta['suscripciones'] = $suscripciones;
            $respuesta['mensaje'] = (empty($suscripciones)) ? 'No hay facturas para pagar' : 'La consulta se realizó correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
