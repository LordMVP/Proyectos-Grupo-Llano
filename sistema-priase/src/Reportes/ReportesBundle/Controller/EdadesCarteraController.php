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
 * Description of EdadesCarteraController
 *
 * @author jpsierra
 */
class EdadesCarteraController extends Controller {
    //put your code here
    
     /**
     * @Route("/edadesCartera")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:edadesCartera.html.twig") 
     */
    
    public function edadesCartera(){
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
     /**
     * @Route("/generarReporteEdadesCartera")
     * @Method({"POST"}) 
     */
    
    public function generarReporteEdadesCartera(Request $request){
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_FECHA_CORTE'] = $content['fechaCorte'];
        $params['PR_INT_CODIGO_PROYECTO'] = $content['codigoProyecto'];
        $params['PR_STR_TITULO_REPORTE'] = "EDADES DE CARTERA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        if ($content['codigoProyecto']!=-1) {
            $params["PR_STR_CONDICIONES"]="dsus.uni_municipio = ".$content['codigoProyecto'];
        } 
        $report = $base->getReportObject("edades_cartera.jrxml", $params,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Edades de cartera.xlsx", true);
        
    }
    
    
    
    /**
     * @Route("/generarReporteConciliacionEdadesCartera")
     * @Method({"POST"}) 
     */
    
    public function generarReporteConciliacionEdadesCartera(Request $request){
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_FECHA_CORTE'] = $content['fechaCorte'];
        $params['PR_INT_CODIGO_PROYECTO'] = $content['codigoProyecto'];
        $params['PR_STR_TITULO_REPORTE'] = "EDADES DE CARTERA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        if ($content['codigoProyecto']!=-1) {
            $params["PR_STR_CONDICIONES"]="dsus.uni_municipio = ".$content['codigoProyecto'];
        } 
        $report = $base->getReportObject("conciliacion_edades_cartera.jrxml", $params,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Conciliacion edades de cartera.xlsx", true);
        
    }
}
