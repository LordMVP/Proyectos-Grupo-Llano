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
 * Description of ProvisionCarteraController
 *
 * @author Appfuture
 */
class ProvisionCarteraController extends Controller {

    /**
     * @Route("/provisioncartera")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:provisionCarera.html.twig") 
     */
    public function provisionCartera() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarProvisionCartera")
     * @Method({"POST"})
     */
    public function generarProvisionCartera(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $datosInterfaz = json_decode($request->getContent(), true);
            $parametros['PR_STR_FECHA_INICIO'] = $datosInterfaz['fechaInicio'];
            $parametros['PR_STR_FECHA_FIN'] = $datosInterfaz['fechaFin'];
            $parametros['PR_STR_TITULO_REPORTE'] = "PROVISION DE CARTERA";
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            if (!empty($datosInterfaz['nit_cedula'])) {
                $parametros['PR_STR_CONDICION'] .= " AND ter.ter_documento = '" . $datosInterfaz['nit_cedula'] . "' ";
            }
            set_time_limit(3600);
            $report = $base->getReportObject('ProvisionCartera.jrxml', $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
