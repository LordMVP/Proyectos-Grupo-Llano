<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Description of RecaudoFinanciacionController
 * @author Appfuture
 */
class RecaudoFinanciacionController extends Controller {

    /**
     * @Route("/recaudo_financiacion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:recaudoFinanciacion.html.twig")
     */
    public function recaudoFinanciacion() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generar_reporte_recaudos")
     * @Method({"POST"})
     */
    public function generarReporteRecaudosFinanciacion(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(), true);

        $params['PR_STR_FECHA_INICIO'] = $requestInfo['fechaInicio'];
        $params['PR_STR_FECHA_FIN'] = $requestInfo['fechaFin'];
        $params['PR_STR_TITULO_REPORTE'] = "RECAUDOS POR FINANCIACIONES";

        set_time_limit(3600);

        $report = $base->getReportObject("reportesFinanciacion.jrxml", $params, "xlsx", true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
