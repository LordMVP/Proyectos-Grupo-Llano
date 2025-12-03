<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\ConstructorasGenerarAmortizacionDelegado;

/**
 * Description of CerrarLecturaController
 *
 * @author sergio vargas
 */
class ConstructorasGenerarAmortizacionController extends Controller {

    //put your code here
    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $delamortizacion = new ConstructorasGenerarAmortizacionDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['ciclos'] = $delamortizacion->getCicloActivosPrograma();
        $response = $this->render('LlanogasLlanogasBundle:Ventas:Constructora_amortizacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function procesarAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $delamortizacion = new ConstructorasGenerarAmortizacionDelegado($this, $sesion);

            Util::validarPeticion($this);
            $ciclos = $request->get("idciclo");
            if (empty($ciclos) || $ciclos == -1) {
                throw new MyException("No se seleccionó ningún Ciclo ", -1);
            }
            $delamortizacion->ProcesarAmortizacion();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Transaccion Exitosa";
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // </editor-fold>
}
