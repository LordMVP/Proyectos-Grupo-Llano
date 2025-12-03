<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\FinanciarVentasDelegado;
use Llanogas\LlanogasBundle\Delegado\RegistrarVentasDelegado;

/**
 * Clase encargada de administrar el registro de ventas.
 */
class FinanciarVentaSimuladorController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $lisParametros['liquidaciones'] = $financiarVentasDelegado->getLiquidacionesSimulador();
        $response = $this->render('LlanogasLlanogasBundle:Ventas:financiar_ventas_simulador.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
   
}
