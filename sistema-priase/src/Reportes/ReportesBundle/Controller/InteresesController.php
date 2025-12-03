<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Description of InteresesController
 *
 * @author AppFuture
 */
class InteresesController extends Controller {

    /**
     * @Route("/intereses")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:intereses.html.twig") 
     */
    public function intereses() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteIntereses")
     * @Method({"POST"})
     */
    public function generarReporteIntereses(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_CICLOS_FACA'] = "";
        $params['PR_STR_CICLOS_FAC'] = "";
        $params['PR_INT_ID_PERIODO_ORDER'] = $content['idordenperiodo'];
        $params['PR_INT_ANOS'] = $content['anos'];
        $params['PR_STR_TITULO_REPORTE'] = "REPORTE VALOR FACTURADO Y RECAUDADO POR INTERESES CORRIENTE Y MORA POR TIPO DE CONCEPTO";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        if (!empty($content['ciclos'])) {
            $ciclos = $content['ciclos'];
            $params['PR_STR_CICLOS_FAC'] = " AND fac.cic_ideregistro in (" . $ciclos . ")";
            $params['PR_STR_CICLOS_FACA'] = " AND faca.cic_ideregistro in (" . $ciclos . ")";
        }
        
        set_time_limit(3600);
        $report = $base->getReportObject('Intereses.jrxml', $params, 'xlsx', true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
    /**
     * @Route("/interesesConciliacion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:interesesConciliacion.html.twig") 
     */
    public function interesesConciliacion() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos; 
    }
    
    
    /**
     * @Route("/generarReporteInteresesConciliacion")
     * @Method({"POST"})
     */
    public function generarReporteInteresesConciliacion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $report= $base->getReportObject("InteresesConciliacion.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
