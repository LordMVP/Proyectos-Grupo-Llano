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
use Llanogas\LlanogasBundle\MyException;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Reportes\ReportesBundle\Models\SaldoIndustrialesReporteModel;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of SaldoInsdustrialesController
 *
 * @author AppFuture
 */
class SaldoIndustrialesController extends Controller {

    /**
     * @Route("/saldoindustriales")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:saldoIndustriales.html.twig") 
     */
    public function saldoIndustriales() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
    * @Route("/generarReporteSaldoIndustriales")
    * @Method({"POST"})
    */
   public function generarReporteSaldoIndustriales(Request $request) {
       try {
           $base = $this->get("reportes.base");
           $content = json_decode($request->getContent(), true);
           $parametros = array();
           $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
           $parametros['PR_INT_CICLO'] = $content['ciclo'];
           $parametros['PR_INT_PERIODO'] = $content['periodo'];
           $complemento = "";
           if (!empty($content['tiposuso'])) {
               $tiposuso = $content['tiposuso'];
               $complemento = " AND dsus.uni_tipusosuscr in (" . $tiposuso . ")";
           }
           $parametros['PR_STR_COMPLEMENTO'] = $complemento;
           $reporte = $base->getReportObject('SaldosIndustriales.jrxml', $parametros, 'xlsx', true);
           $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
           $manager->executeReportBytes($reporte);
           return JasperUtil::getJSONPathResponse($manager);
       } catch (\Exception $e) {
           return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
       }
    }
    
}