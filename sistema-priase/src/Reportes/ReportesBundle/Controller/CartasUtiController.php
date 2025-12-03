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
 * Description of CartasUtiController
 *
 * @author jpsierra
 */
class CartasUtiController extends Controller {
    //put your code here

    /**
     * @Route("/cartasUti")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:cartasUti.html.twig") 
     */
    public function cartasUtiCartera() {
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $ciclos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros['ciclos'] = $ciclos;
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarReporteCartasUti")
     * @Method({"POST"}) 
     */
    public function generarReporteCartasUti(Request $request) {
        
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $anno = $content['anno'];
        $mes = $content['mes'];
        $fechaInicial = "$anno-$mes-01";
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $parameters["PR_STR_FECHA_INICIAL"] = $fechaInicial;
        $parameters["PR_STR_FECHA_FINAL"] = date('Y-m-t', strtotime($fechaInicial));


        $condiciones = "";

        if ($content['tipoUso'] != '-1') {
            $condiciones.=" AND dsus.uni_tipusosuscr = " . $content['tipoUso'];
        }
        $ver=strpos($content['proyecto'], '-1');
        
        if ($ver===FALSE) {
            $condiciones.=" AND dsus.uni_municipio in (".$content['proyecto'].")";
        }
        
        if ($content['ciclo'] != '-1') {
            $condiciones.=" AND dsus.cic_ideregistro = " . $content['ciclo'];
        }
        
        if ($content['ruta'] != '-1') {
            $condiciones.=" AND rusu.rut_ideregistro = " . $content['ruta'];
        }
        
        $reportName = "carta_individual_uti.jrxml";

        if($content['formato'] == 1){
            $formato = "pdf";
            if ($content['tipoCarta'] == '-1') {
                $reportName = "cartas_uti.jrxml";
            } else if ($content['tipoCarta'] == '1') {
                $parameters["PR_STR_MESES"] = "'4'";
                $parameters["PR_INT_MESES"] = "4";
                $reportName = "carta_individual_uti_texto.jrxml";    
            } else if ($content['tipoCarta'] == '2') {
                $parameters["PR_STR_MESES"] = "'1'";
                $parameters["PR_INT_MESES"] = "1";
                $reportName = "carta_individual_uti_texto.jrxml";
            } else if ($content['tipoCarta'] == '3') {
                $parameters["PR_STR_MESES"] = "'0'";
                $parameters["PR_INT_MESES"] = "0";
                $reportName = "carta_individual_uti.jrxml";
            }    
        }else{
            $reportName = "listado_cartas_uti.jrxml";
            $formato = "xlsx";
            
            if ($content['tipoCarta'] == '1') {
                $parameters["PR_STR_MESES"] = "'4'";
                $parameters["PR_INT_MESES"] = "4";
            } else if ($content['tipoCarta'] == '2') {
                $parameters["PR_STR_MESES"] = "'1'";
                $parameters["PR_INT_MESES"] = "1";
            } else if ($content['tipoCarta'] == '3') {
                $parameters["PR_STR_MESES"] = "'0'";
                $parameters["PR_INT_MESES"] = "0";
            }     
        }

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        set_time_limit(3600);
        $report = $base->getReportObject($reportName, $parameters, $formato);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
