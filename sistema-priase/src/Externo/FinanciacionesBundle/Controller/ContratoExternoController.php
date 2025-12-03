<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Controller;

use Externo\FinanciacionesBundle\Delegado\ContratoExternoDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of ContratoController
 *
 * @author god
 */
class ContratoExternoController extends GenericoController {

    private $contratoExternoDelegado;
    private $sesion;

    private function init() {
        $this->sesion = Util::iniciarSesion($this);
        $this->contratoExternoDelegado = new ContratoExternoDelegado($this->conexion, $this->sesion, $this->parametros);
    }

    //put your code here
    public function indexAction() {
        $lisParametros = array();
        try {
            $this->init();
            $this->sesion = Util::iniciarSesion($this);
            $lisParametros['empresa'] = $this->sesion->get('empresa');
            $lisParametros['fecha'] = date('Y-m-d');
        } catch (\Exception $e) {
            
        }
        $response = $this->render('ExternoFinanciacionesBundle:Default:contrato.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function consultarEmpresasAction() {
        try {
            $this->init();
            $lista = $this->contratoExternoDelegado->consultarEmpresas($this->conexion);
            return $this->construyeRespuesta($lista);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    public function generarContratoAction() {
        try {
            $this->init();
            $lista = $this->contratoExternoDelegado->generarContrato();
            return $this->construyeRespuesta($lista);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    public function consultarContratoAction() {
        try {
            $this->init();
            $lista = $this->contratoExternoDelegado->consultarContratos();
            return $this->construyeRespuesta($lista);
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

    public function generarReporteContratoAction() {
        try {
            $this->init();
            return $this->contratoExternoDelegado->generarReporteContrato($this);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

}
