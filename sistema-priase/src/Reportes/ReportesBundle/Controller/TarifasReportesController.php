<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class TarifasReportesController extends Controller {

    public function __construct() {
        
    }
    
      
     /**
     * @Route("/tarifasAplicadas")
     * @Method({"GET"})
     * @Template("ReportesBundle:Tarifas:TarifasAplicadas.html.twig") 
     */
     public function tarifasAplicadas(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }   
    
     /**
     * @Route("/generarTarifasAplicadas")
     * @Method({"POST"})
     */
    public function generarTarifasAplicadas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];  
        
        $laFecha = explode ( "-", $fecha); 
        $mes = $laFecha[1];
        $parametros['PR_INT_MES'] = $mes ;
        $parametros['PR_INT_ANO'] = $laFecha[0]; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;   
        $parametros['PR_INT_TRIM'] = ceil($mes/3) ;  
        
        $report= $base->getReportObject("Reporte_TA.jrxml", $parametros, "xlsx");   
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    } 
    
         /**
     * @Route("/variablesCalculo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Tarifas:VariablesCalculo.html.twig") 
     */
     public function VariablesCalculo(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }   
    
     /**
     * @Route("/generarReporteVariablesCalculo")
     * @Method({"POST"})
     */
    public function generarReporteVariablesCalculo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha = $content['fechaConsulta1'];  
        $mercado = $content['mercado']; 
        $laFecha = explode ( "-", $fecha); 
        $mes = $laFecha[1];
        $parametros['PR_INT_MES'] = $mes ;
        $parametros['PR_INT_ANO'] = $laFecha[0]; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;  
        $parametros['PR_STR_NOMEMPRESA'] = $base->empresaNombre;  
        if($mercado == -1 )
        {
            $parametros['PR_STR_CODICIONES'] = " AND 1=1 ";
        }
        else
        {
            $parametros['PR_STR_CODICIONES'] = ' AND mercado_cod = '.$mercado;
        }
        
        $report= $base->getReportObject("Reporte_VariablesCalculo.jrxml", $parametros, "xlsx");   
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    } 
    
    /**
     * @Route("/tarifasFES")
     * @Method({"GET"})
     * @Template("ReportesBundle:Tarifas:TarifasFES.html.twig") 
     */
     public function tarifasFES(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }   
    
     /**
     * @Route("/generarTarifasFES")
     * @Method({"POST"})
     */
    public function generarTarifasFES(Request $request) {
        //$sesion = Util::iniciarSesion($this);
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];          
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_STR_PERIODO'] = $laFecha[0].$laFecha[1]; // ;
        $parametros['PR_STR_INTER_RESI'] = $content['intMorDom']; 
        $parametros['PR_STR_INTER_COM'] = $content['intMorCom']; 
        $parametros['PR_INT_CONSU_EST'] = $content['consEst']; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;           
        $report= $base->getReportObject("Listado_Tarifas_FES.jrxml", $parametros, "csv", false);     
        $nombreAc="TFES".$base->idEmpresa.".txt" ;
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, $nombreAc , true);        
    } 
    
     /**
     * @Route("/opcionTarifaEspecial")
     * @Method({"GET"})
     * @Template("ReportesBundle:Tarifas:OpcionTarifaEspecial.html.twig") 
     */
     public function opcionTarifaEspecial(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }   
    
     /**
     * @Route("/generarReporteOpcionTarifaEspecial")
     * @Method({"POST"})
     */
    public function generarReporteOpcionTarifaEspecial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha = $content['fechaConsulta1'];  
        $fechaFinal = $content['fechaConsulta1Final'];  
        $laFecha = explode ( "-", $fecha); 
        $laFechaFinal = explode ( "-", $fechaFinal); 
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2'] = $content['fechaConsulta1Final']; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;  
        $parametros['PR_STR_NOMEMPRESA'] = $base->empresaNombre;  
        $report= $base->getReportObject("opcion_tarifa_especial.jrxml", $parametros, "xlsx");   
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
    
     /**
     * @Route("/opcionTarifaFaltanteSobrante")
     * @Method({"GET"})
     * @Template("ReportesBundle:Tarifas:OpcionTarifaFaltanteSobrante.html.twig") 
     */
     public function opcionTarifaEspecialFaltanteSobrante(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }   
    
     /**
     * @Route("/generarReporteFaltanteSobrante")
     * @Method({"POST"})
     */
    public function generarReporteOpcionTarifaFaltanteSobrante(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha = $content['fechaConsulta1'];  
        $fechaFinal = $content['fechaConsulta1Final']; 
        $fechaComoEntero = strtotime($fecha);
        $mes = date("n", $fechaComoEntero);
        $ano = date("Y", $fechaComoEntero);
        $meses = array('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre');
        $mesNombre = $meses[$mes - 1];
        $idempresa = $base->idEmpresa;
        if ($idempresa == 322) {
            $empresa = "llano";
        }
        if ($idempresa == 319) {
            $empresa = "cusiana";
        }
        $tabla = 'ajuste' . $mesNombre . $empresa . $ano . '_opt';        
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $parametros['PR_STR_TABLA'] = $tabla; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;  
        $parametros['PR_STR_NOMEMPRESA'] = $base->empresaNombre;  
        $report= $base->getReportObject("opciontarifa_faltantesobrante.jrxml", $parametros, "xlsx");   
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
}
