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
 * Description of MedidoresInternosController
 *
 * @author jpsierra
 */
class MedidoresInternosController extends Controller {
    //put your code here
    
     /**
     * @Route("/medidoresInternos")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:medidoresInternos.html.twig") 
     */
    
    public function medidoresInternos(){
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfilAndPrograma($base->idUsuario, $base->idEmpresa, 138);
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
     /**
     * @Route("/generarReporteMedidoresInternos")
     * @Method({"POST"}) 
     */
    
    public function generarReporteMedidoresInternos(Request $request){
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parameters["PR_STR_TITULO_REPORTE"] = "LISTADO DE MEDIDORES INTERNOS";
        $parameters["PR_STR_FECHA_INICIAL"] = $content['fechaInicial'];
        $parameters["PR_STR_FECHA_FINAL"] = $content['fechaFinal'];
        $condiciones = "";
        
        if ($content['tipoUso'] != -1) {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['proyecto'] != -1) {
            $condiciones.=" AND dsus.uni_municipio = ".$content['proyecto'];
        }
       

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        set_time_limit(3600);
        $report = $base->getReportObject("medidores_internos.jrxml", $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
    }
}
