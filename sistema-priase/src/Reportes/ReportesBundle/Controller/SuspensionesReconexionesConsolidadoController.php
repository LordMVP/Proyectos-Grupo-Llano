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
 * Description of Suspensiones y reconexiones
 *
 * @author jpsierra
 */
class SuspensionesReconexionesConsolidadoController extends Controller {
    //put your code here
    
     /**
     * @Route("/suspensionesReconexionesConsolidado")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:suspensionesReconexionesConsolidado.html.twig") 
     */
    
    public function suspensionesReconexionesConsolidado(){
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $ciclos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $parametros['ciclos'] = $ciclos;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
     /**
     * @Route("/generarReporteSuspensionesReconexionesConsolidado")
     * @Method({"POST"}) 
     */
    
    public function generarReporteSuspensionesReconexionesConsolidado(Request $request){
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parameters["PR_STR_TITULO_REPORTE"] = "";
        $parameters["PR_STR_FECHA_INICIAL"] = $content['fechaInicial'];
        $parameters["PR_STR_FECHA_FINAL"] = $content['fechaFinal'];
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $condiciones = "";
        
        if ($content['tipoUso'] != -1) {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['proyecto'] != -1)  {
            $condiciones.=" AND dsus.uni_municipio = ".$content['proyecto'];
        }
        if ($content['ciclo'] != -1)  {
            $condiciones.=" AND dsus.cic_ideregistro = ".$content['ciclo'];
        }
       
        $reportName="";
        if($content['tipoReporte']==1){
            $reportName="ssp_consolidado.jrxml";
        }else if($content['tipoReporte']==2){
            $reportName="rco_consolidado.jrxml";
        }

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        set_time_limit(3600);
        $report = $base->getReportObject($reportName, $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
    }
}
