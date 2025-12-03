<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CarteraCastigadaController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDelegado = new RecaudosDelegado($this, $sesion);
        $lisParametros = array();
        //cargar el combo de medios de pago
        $cmbMedioPago = $recaudosDelegado->cargarComboDb('cmbMedioPago');
        $lisParametros['cmbMedioPago'] = $cmbMedioPago;

        $cmbClasePago = $recaudosDelegado->cargarComboDb('cmbClasePago', 'PC', PROGRAMA_CARTERA_CASTIGADA_ID);
        $lisParametros['cmbClasePago'] = $cmbClasePago;

        $cmbSucursal = $recaudosDelegado->consultarSucursal(PROGRAMA_CARTERA_CASTIGADA_ID);
        $lisParametros['cmbSucursal'] = $cmbSucursal;

//        $lisParametros['empresa'] = 'Llanogas S.A.';
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:cartera_castigada.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta las facturas que están en estado castigada
     * @return json con la información con las facturas castigadas de un suscripción.
     * @throws MyException  Error al envíar los parámetros de consulta.
     */
    public function consultarFacturasCarteraAction() {
        try {
            $sesion = Util::iniciarSesion($this);

            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcion = $request->request->get('suscripcion');
            if (empty($suscripcion)) {
                throw new MyException("Error, La suscripción es obligatoria", -1);
            }
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            //Se consultan las facturas castigadas de una suscripción específica
            $respuesta = $recaudosDelegado->getFacturasCarteraCastigada($suscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (MyException $e) {
            $respuesta = array("codigoRespuesta" => $e->getCode(), "mensaje" => $e->getMessage());
        }
        return Util::construyeRespuesta($respuesta);
    }

}
