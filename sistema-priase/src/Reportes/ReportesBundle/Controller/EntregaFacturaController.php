<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;

class EntregaFacturaController extends Controller
{
    /**
     * @Route("/generarFormatosEntregaFactura")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:entregaFactura.html.twig")
     * 
     */
    public function generarFormatosEntregaFactura(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarReporteEntregaFactura")
     * @Method({"POST"})
     * */
    public function generarReporteEntregaFactura(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(),true);
        $params['PR_INT_CICLO']=$requestInfo['ciclo'];
        //$params['PR_INT_CICLO_ANNO']=2014;
        //$params['PR_INT_PERIODO']=$requestInfo['periodo'];
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        $params['PR_STR_IMAGES_PATH']=JASPER_REPORTS_PATH;
        $report= $base->getReportObject("formato_entrega_factura.jrxml", $params);
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "Listado entrega de facturas", true); 
        
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
}
