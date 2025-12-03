<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

/**
 * Description of FacturacionEmitidaController
 *
 * @author jpsierra
 */
class FacturacionEmitidaController extends Controller {
    //put your code here

    
    /**
     * @Route("/notasReclamacion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:notasReclamacion.html.twig") 
     */
     public function notasReclamacion(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }

    /**
     * @Route("/generarNotasReclamacion")
     * @Method({"POST"})
     */
    public function generarNotasReclamacion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        
          
        $report = $base->getReportObject("notas_reclamacion.jrxml", $parametros, "xlsx", false);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Notas Reclamacion.xlsx", true);
    } 
    
    
    /**
     * @Route("/facturacionEmitida")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:facturacionEmitida.html.twig") 
     */
    public function facturacionEmitida() {
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $parametros['ciclos']  = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarReporteFacturacionEmitida")
     * @Method({"POST"}) 
     */
    public function generarReporteFacturacionEmitida(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);

        $reportName = "";
        $params = array();
        if ($content['tipo'] === '1') {
            $reportName = "facturacion_emitida_faca.jrxml";
            $params['PR_STR_TITULO_REPORTE'] = "FACTURACION EMITIDA RESIDENCIAL Y COMERCIAL.";
        } else if ($content['tipo'] === '2') {
            $reportName = "facturacion_industrial_emitida.jrxml";
            $params['PR_STR_TITULO_REPORTE'] = "FACTURACION EMITIDA INDUSTRIAL, ATR Y GNV.";
        } else {
            //retornoar errors
        }
        
        //$params['PR_STR_CONDICIONES']="AND 1=1";
        
        $params['PR_INT_CICLO'] = $content['ciclo'];
        
        
        /*if($content['ciclo']!='-1' && $content['tipo'] === '2' ){
            $params['PR_STR_CONDICIONES'] = "AND cic.cic_ideregistro = ".$content['ciclo'];
        }else if($content['ciclo']!='-1' && $content['tipo'] === '1'){
            $params['PR_STR_CONDICIONES'] = "AND dsus.cic_ideregistro  = ".$content['ciclo'];
        }*/
        
        $params['PR_STR_ANNO_MES'] = $content['anno'] . "" . $content['mes'];
        
        $params['PR_STR_LABEL_PERIODO'] = "FACTURACION DEL MES DE " . strtoupper($base->utilModel->getMes((int) $content['mes'])) . " DE " . $content['anno'];
        $params['PR_INT_ANNO'] = $content['anno'];
        $params['PR_INT_MES'] = $content['mes'];
        //$params['PR_STR_TITULO_REPORTE'] = "FACTURACION EMITIDA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        $params['PR_STR_EMPRESA'] = $base->idEmpresa;

        if(isset($content['format'])){
            $format = $content['format'];
        }else{
            $format = "pdf";
        }        
        $report = $base->getReportObject($reportName, $params, $format, false);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Facturacion emitida.".$format, true);
    }

}
