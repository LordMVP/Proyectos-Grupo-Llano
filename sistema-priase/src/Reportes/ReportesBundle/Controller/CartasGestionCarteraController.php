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
 * Description of CartasGestionCarteraController
 *
 * @author jpsierra
 */
class CartasGestionCarteraController extends Controller {
    //put your code here
    
     /**
     * @Route("/cartasGestionCartera")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:cartasGestionCartera.html.twig") 
     */
    
    public function cartasGestionCartera(){
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfilAndPrograma($base->idUsuario, $base->idEmpresa, 164);
        $ciclos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros['ciclos'] = $ciclos;
        $parametros['municipios'] = $municipios;
        $parametros['idempresa'] = $base->idEmpresa;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
     /**
     * @Route("/generarReporteCartasGestionCartera")
     * @Method({"POST"}) 
     */
    
    public function generarReporteCartasGestionCartera(Request $request){
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $parameters["PR_INT_USUARIO"] = $base->idUsuario;
        $parameters["PR_STR_FECHA_CORTE"] = $content['fechaCorte'];
        $parameters["PR_INT_VALOR_DEUDA_MIN"] = $content['valorMinimo'];
        $parameters["PR_INT_VALOR_DEUDA_MAX"] = $content['valorMaximo'];
        $parameters["PR_INT_MOROSIDAD_MIN"] = $content['morosidadMinima'];
        $parameters["PR_INT_MOROSIDAD_MAX"] = $content['morosidadMaxima'];
         $parameters["PR_INT_EMPRESA"] = $base->idEmpresa ;  
        $condiciones = "";
        
        if ($content['tipoUso'] != '-1') {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['proyecto'] != '-1') {
            $condiciones.=" AND dsus.uni_municipio = ".$content['proyecto'];
        }
        if ($content['ciclo'] != '-1') {
            $condiciones.=" AND dsus.cic_ideregistro = ".$content['ciclo'];
        }
        if ($content['ruta'] != '-1') {
            $condiciones.=" AND rusu.rut_ideregistro = ".$content['ruta'];
        }
        
        
        $reportName = "";
        if($content['tipoCarta']=='1' || $content['tipoCarta']=='2' || $content['tipoCarta']=='3' || $content['tipoCarta']=='7' || $content['tipoCarta']=='8'){
            $reportName = "carta_final_lista.jrxml";    
        }else if($content['tipoCarta']=='4' || $content['tipoCarta']=='5' || $content['tipoCarta']=='9'){
            $reportName = "carta_centrales_riesgo_lista.jrxml";    
        }

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        $report= $base->getReportObject($reportName, $parameters, 'csv');

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);    
    }
}
