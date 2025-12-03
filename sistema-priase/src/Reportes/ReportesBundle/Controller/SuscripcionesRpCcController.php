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
 * Description of SuscripcionesRpCcController
 *
 * @author AppFuture
 */
class SuscripcionesRpCcController extends Controller {

    /**
     * @Route("/suscripcionesrpcc")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:suscripcionesRpCc.html.twig") 
     */
    public function suscripcionesRpCc() {
        $base = $this->get("reportes.base");
        $parametros['cajeros'] = null;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarReporteSuscripcionesRpCc")
     * @Method({"POST"})
     */
    public function generarReporteSuscipcionesRpCc(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_FECHA_INICIO'] = $content['fechaInicio'];
        $params['PR_STR_FECHA_FIN'] = $content['fechaFin'];
        $params['PR_STR_TITULO_REPORTE'] = "REPORTE SUCRIPCIONES CON PAGO POR CARTERA CASTIGADA Y RECUPERACIÓN DE PROVISIÓN";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        if (!empty($content['documento'])) {
            $documento = $content['documento'];
            $params['PR_STR_CONDICION'] = " AND ter.ter_documento = '" . $documento . "'";
        }
        set_time_limit(3600);
        $report = $base->getReportObject('SuscripcionesRpCc.jrxml', $params, 'xlsx', true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
