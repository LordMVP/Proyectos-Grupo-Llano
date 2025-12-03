<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Controller;

use Externo\FinanciacionesBundle\Delegado\ReporteVentasExternoDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of ContratoController
 *
 * @author god
 */
class ReporteVentasExternoController extends GenericoController {

    private $reporteVentasExternoDelegado;
    private $sesion;

    private function init() {
        try {
            $this->reporteVentasExternoDelegado = new ReporteVentasExternoDelegado($this->conexion, $this->getSesionPHP(), $this->parametros);
        } catch (\Exception $ex) {
            
        }
    }

    //put your code here
    public function indexAction() {
        $this->init();
        $sesion = $this->getSesionPHP();
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion['empresa'];
        $lisParametros['fecha'] = date('Y-m-d');
        $lisParametros['version'] = time();
        $response = $this->render('ExternoFinanciacionesBundle:Default:reporte_ventas_externo.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Método encargado de generar el reporte 
     * @return type
     */
    public function procesarAction() {
        try {
            $this->init();
            return $this->reporteVentasExternoDelegado->crearReporte($this);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

}
