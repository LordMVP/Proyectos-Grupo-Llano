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
 * Archivo controller que genera el reporte de recaudos de ace seguros
 * @author Appfuture
 */
class RecaudoAceController extends Controller {

    /**
     * @Route("/recaudo_ace")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:recaudoAce.html.twig")
     */
    public function recaudosAce() {
        $base = $this->get("reportes.base");
        $ciclos = $base->utilModel->consultarCiclosAce();
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);

        $parametros['ciclos'] = $ciclos;
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generar_reporte_recaudo_ace")
     * @Method({"POST"})
     */
    public function generarReporteRecaudosAce(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(), true);

        $params['PR_INT_ID_ORDER_PERIODO'] = $requestInfo['periodo'];
        $params['PR_INT_ANO_ACTUAL'] = $requestInfo['anos'];
        $params['PR_STR_TITULO_REPORTE'] = "RECAUDOS ACE SEGUROS";

        set_time_limit(3600);
        $report = $base->getReportObject("recaudosAce.jrxml", $params, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
