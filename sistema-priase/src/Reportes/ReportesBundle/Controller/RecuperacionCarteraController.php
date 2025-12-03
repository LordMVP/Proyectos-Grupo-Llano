<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\Models\RecaudosReportesModel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class RecuperacionCarteraController extends Controller {

    public function __construct() {
        
    }

    /**
     * @Route("/recuperacionCartera")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:recuperacionCartera.html.twig") 
     */
    public function recuperacionCartera() {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $ciclos = $utilModel->consultarCiclosEmpresa($base->idEmpresa);
        $parametros = array('ciclos' => $ciclos);
        return array_merge($base->parametrosBasicos, $parametros);
    }

    /**
     * @Route("/generarReporteRecuperacionCartera")
     * @Method({"POST"})
     */
    public function generarReporteRecuperacionCartera(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $ciclo = $content['ciclo'];
        $municipio = $content['municipios'];
        $PR_STR_CODICIONES = "1=1";
        $fecha=  $content['fechaConsulta'];
        
        $reportName = "recuperacion_cartera_completa.jrxml";
        
        
        if ($ciclo == "all"){
            $PR_STR_CODICIONES = "1=1";
        }else{
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} '; 
        }
        
        
        if($municipio == null || $municipio == ""){
            
        }else{
           $PR_STR_CODICIONES .= " AND dsus.uni_municipio IN (".$municipio.")"; 
        }
        
        /*if ($ciclo == "all" && $municipio == "all") {
            $PR_STR_CODICIONES = "1=1";            
        }else if($ciclo !="all" && $municipio!="all"){
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} AND dsus.uni_municipio =  $P{PR_INT_PROYECTO} ';
        }else if($ciclo !="all" && $municipio=="all"){
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} ';            
        }else if($ciclo =="all" && $municipio!="all"){
            $PR_STR_CODICIONES = 'dsus.uni_municipio =  $P{PR_INT_PROYECTO} ';
        }*/

        
        $params['PR_INT_PROYECTO'] = $municipio;
        $params['PR_LIST_CICLOS'] = $ciclo;
        $params['PR_STR_CONDICIONES'] = $PR_STR_CODICIONES;
        $params['PR_STR_FECHA'] = $fecha;
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        //set_time_limit(3600);
        $report = $base->getReportObject($reportName, $params, "xlsx");
        //return JasperUtil::getJSONBase64Response($manager, "Reporte Recuperacion Cartera.xlsx", true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
    }

    /**
     * @Route("/generarReporteEfectividadRecuperacionCartera")
     * @Method({"POST"})
     */
    public function generarReporteEfectividadRecuperacionCartera(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $ciclo = $content['ciclo'];
        $municipio = $content['municipios'];
        $PR_STR_CODICIONES = "1=1";        
        
        
        if ($ciclo == "all"){
            $PR_STR_CODICIONES = "1=1";
        }else{
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} '; 
        }
        
        if($municipio == null || $municipio == ""){
            
        }else{
           $PR_STR_CODICIONES .= " AND dsus.uni_municipio IN (".$municipio.")"; 
        }
        
        
        /*if ($ciclo == "all" && $municipio == "all") {
            $PR_STR_CODICIONES = "1=1";            
        }else if($ciclo !="all" && $municipio!="all"){
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} AND dsus.uni_municipio =  $P{PR_INT_PROYECTO} ';
        }else if($ciclo !="all" && $municipio=="all"){
            $PR_STR_CODICIONES = '$X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} ';            
        }else if($ciclo =="all" && $municipio!="all"){
            $PR_STR_CODICIONES = 'dsus.uni_municipio =  $P{PR_INT_PROYECTO} ';
        }*/

        $params['PR_INT_PROYECTO'] = $municipio;
        if($ciclo ==="all"){
            $params['PR_LIST_CICLOS'] = array(0);
        }else{
            $params['PR_LIST_CICLOS'] = $ciclo;
        }
       // $params['PR_LIST_CICLOS'] = $ciclo;
        $params['PR_STR_CONDICIONES'] = $PR_STR_CODICIONES;
        
        
        $params['PR_STR_TITULO_REPORTE'] = "Reporte de efectividad en la gestion de cartera";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;                
        
        $report = $base->getReportObject("efectividad_gestion_cartera_v2.jrxml", $params);

        //return JasperUtil::getJSONBase64Response($manager, "Reporte Efectividad Recuperacion Cartera", true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarReporteGestionCobroCartera")
     * @Method({"POST"})
     */
    public function generarReporteGestionCobroCartera(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $ciclo = $content['ciclo'];
        $municipio = $content['municipios'];
        $PR_STR_CODICIONES = "AND 1=1";
        $fecha=  $content['fechaConsulta'];
        if ($ciclo == "all"){
            $PR_STR_CODICIONES = "AND 1=1 ";
        }else{
            $PR_STR_CODICIONES = ' AND $X{IN,ges.cic_ideregistro , PR_LIST_CICLOS} '; 
        }  
        if($municipio == null || $municipio == ""){
            
        }else{
           $PR_STR_CODICIONES .= " AND dsus.uni_municipio IN (".$municipio.")"; 
        }
        $params['PR_INT_PROYECTO'] = $municipio;
        $params['PR_LIST_CICLOS'] = $ciclo;
        $params['PR_STR_CONDICIONES'] = $PR_STR_CODICIONES;
        $params['PR_STR_FECHA'] = $fecha;
        $params['PR_INT_EMPRESA']=$base->idEmpresa;

        $report = $base->getReportObject("gestion_cobro.jrxml", $params, "xlsx");
        //return JasperUtil::getJSONBase64Response($manager, "Reporte Gestion de Cobro", true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
