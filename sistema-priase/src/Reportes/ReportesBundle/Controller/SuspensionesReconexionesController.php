<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;

class SuspensionesReconexionesController extends Controller {

    /**
     * @Route("/generarFormatosSuspensionReconexionRTR")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:suspensionesReconexiones.html.twig")
     * 
     */
    public function generarFormatosSuspensionReconexionRTR() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteSuspensionesReconexionesRTR")
     * @Method({"POST"})
     * */
    public function generarReporteSuspensionesReconexionesRTR(Request $request) {
        
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(),true);
        $params['PR_STR_IMAGES_PATH']=JASPER_REPORTS_PATH;
        $params['PR_STR_FECHA']=$requestInfo['fechaConsulta1'];
        $params['PR_STR_FECHA2']=$requestInfo['fechaConsulta2'];
        $params['PR_INT_PROYECTO']=$requestInfo['proyecto'];
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        
        if($requestInfo['jornada'] == 0){
            $params['PR_STR_JORNADA'] = " AND (EXTRACT(EPOCH FROM rco.rco_fecha - rco.rco_fecha::DATE)/3600) <= 7 ";
        }else{
            $params['PR_STR_JORNADA'] = " AND (EXTRACT(EPOCH FROM rco.rco_fecha - rco.rco_fecha::DATE)/3600)  > 7 ";
        }
        
        
        $array=$requestInfo['idmotivo'];
        set_time_limit(3600);
        $nameTable = $requestInfo['tipo'] == 1 ? 'suspension' : 'reconexion';
        $condicion2=" ";
        $condicion3=" ";
        
        if($requestInfo['tipo']==1){            
            $valor2="0";
            
            foreach ($array as &$valor){
                $valor2 =$valor2.",".$valor;
            }

            $condicion1 ="AND ssp.uni_motsuspen  IN (".$valor2.")";
        }
        
        if($requestInfo['tipo']==2){
            $valor2="0";
            
            foreach ($array as &$valor){
                $valor2 =$valor2.",".$valor;
            }
            $condicion1 ="AND  rco.uni_motreconex  IN (".$valor2.")";                        
        }
        
        if($requestInfo['zona']==1){
           $condicion2=" AND pro.pro_altriesgo='S'"; 
        }else if($requestInfo['zona']==2){
           $condicion2=" AND pro.pro_altriesgo='N'"; 
        }
        
        if($requestInfo['zonatipo']==1){
            $condicion3=" AND pro.pro_zona='U'";
        }else if($requestInfo['zonatipo']==2){
            $condicion3=" AND pro.pro_zona='R'";
        }
        
        $params['PR_STR_CONDICION']=$condicion1.$condicion2.$condicion3;       
        $report= $base->getReportObject("notificacion_solo_$nameTable.jrxml", $params);
        
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarFormatosSuspensionReconexion2")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:suspensionesReconexiones2.html.twig")
     * 
     */
    public function generarFormatosSuspensionReconexion2() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarReporteSuspensionesReconexiones2")
     * @Method({"POST"})
     * */
    public function generarReporteSuspensionesReconexiones2(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(),true);
        $params['PR_INT_CICLO']=$requestInfo['ciclo'];
        $params['PR_INT_CICLO_ANNO']=2016;
        $params['PR_INT_PERIODO']=$requestInfo['periodo'];
        $params['PR_STR_IMAGES_PATH']=JASPER_REPORTS_PATH;
        $report= $base->getReportObject("notificacion_suspension_reconexion_otro.jrxml", $params);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Listado suspensiones y reconexiones", true);        
    }
    
    /**
     * @Route("/generarListaSuspensionesRTR2")
     * @Method({"POST"})
     * */
    public function generarListaSuspensionesRTR2(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_CICLO']=$content['ciclo'];
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        set_time_limit(3600);
        $report= $base->getReportObject("suspension.jrxml", null,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "suspension.xlsx", true);
        }
        
        /**
     * @Route("/generarListaReconexionesRTR2")
     * @Method({"POST"})
     * */
    public function generarListaReconexionesRTR2(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_CICLO']=$content['ciclo'];
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        set_time_limit(3600);
        $report= $base->getReportObject("reconexion.jrxml", null,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "suspension.xlsx", true);
        }
        
         /**
     * @Route("/listaSuspensionesReconexiones2")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:listaSuspensionesReconexiones2.html.twig")
     * 
     */
    public function listaSuspensionesReconexiones2() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarReporteSuspensionesReconexionesMora")
     * @Method({"POST"})
     * */
    public function generarReporteSuspensionesReconexionesMora(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(),true);
        $params['PR_STR_IMAGES_PATH']=JASPER_REPORTS_PATH;
        $params['PR_STR_FECHA']=$requestInfo['fechaConsulta1'];
        $params['PR_STR_FECHA2']=$requestInfo['fechaConsulta2'];
        $params['PR_INT_PROYECTO']=$requestInfo['proyecto'];
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        $array=$requestInfo['idmotivo'];
        set_time_limit(3600);
        $nameTable =$requestInfo['tipo']==1?'suspension':'reconexion';
        
        $condicion2=" ";
        $condicion3=" ";
        
        if($requestInfo['tipo']==1)
        {
        $valor2="0";
        foreach ($array as &$valor)
            {
             $valor2 =$valor2.",".$valor;
            }
        $condicion1 ="AND ssp.uni_motsuspen  IN (".$valor2.")";
        }
        if($requestInfo['tipo']==2)
        {
        $valor2="0";
        foreach ($array as &$valor)
            {
             $valor2 =$valor2.",".$valor;
            }
        $condicion1 ="AND  rco.uni_motreconex  IN (".$valor2.")";                        
        }
        if($requestInfo['zona']==1)
        {
           $condicion2=" AND pro.pro_altriesgo='S'"; 
        }
        if($requestInfo['zona']==2)
        {
           $condicion2=" AND pro.pro_altriesgo='N'"; 
        }
        if($requestInfo['zonatipo']==1)
        {
            $condicion3=" AND pro.pro_zona='U'";
        }
        if($requestInfo['zonatipo']==2)
        {
            $condicion3=" AND pro.pro_zona='R'";
        }
        $params['PR_STR_CONDICION']=$condicion1.$condicion2.$condicion3;
        $report= $base->getReportObject("notificacion_normal_$nameTable.jrxml", $params,"pdf",true);
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "Listado usuarios mora", true);

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarReporteSusyRxTarde")
     * @Method({"POST"})
     * */
    public function generarReporteSusyRxTarde(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(),true);
        
        $array = $requestInfo['idmotivo'];        
        
        if(count($array) > 0){            
            $motivo = " IN (".implode(",", $array).")";
            
        }else{
            $mmotivo = " IS NOT NULL";
        }
        
        
        if($requestInfo['tipo'] == 2){
            $condicion =" AND rco.uni_motreconex ".$motivo;        
        }
        
        
        $params['PR_STR_IMAGES_PATH']=JASPER_REPORTS_PATH;
        $params['PR_STR_FECHA']=$requestInfo['fechaConsulta1'];
        $params['PR_STR_FECHA2']=$requestInfo['fechaConsulta2'];
        $params['PR_INT_PROYECTO']=$requestInfo['proyecto'];
        $params['PR_STR_CONDICION'] = $condicion;  
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        
        
        set_time_limit(3600);
        $nameTable =$requestInfo['tipo']==1?'suspension':'reconexion';
        $report= $base->getReportObject("notificacion_tarde_".$nameTable.".jrxml", $params,"pdf",true);

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
}
