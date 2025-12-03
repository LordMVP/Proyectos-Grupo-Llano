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
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Description of PagosFacturacionController
 *
 * @author AppFuture
 */
class PagosFacturacionController extends Controller {

    /**
     * @Route("/pagosfacturacion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:pagosFacturacion.html.twig") 
     */
    public function pagosFacturacion() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarpagosfacturacion")
     * @Method({"POST"})
     */
    public function generarPagosFacturacion(Request $request) {
        try {
            $base = $this->get('reportes.base');
            $datosInterfaz = json_decode($request->getContent(), true);
            $parametros['PR_INT_ID_PERIODO_ORDEN'] = $datosInterfaz['idordenperiodo'];
            $parametros['PR_INT_ANOS'] = $datosInterfaz['anos'];
            $parametros['PR_STR_TITULO_REPORTE'] = "REPORTE DE PAGOS";
            $parametros['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            
            if($datosInterfaz['tipo'] == 1){
                $parametros['PR_STR_CONDICION'] = ' dfac.uni_concepto in (41,42)';
            }else{
                $parametros['PR_STR_CONDICION'] = ' 1=1';
            }
            
            set_time_limit(3600);
            $reporte = $base->getReportObject('PagosFacturacion.jrxml', $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($reporte);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

    /**
     * @Route("/generarRecaudosfacturacion")
     * @Method({"POST"})
     */
    public function generarRecaudosfacturacion(Request $request) {

        $base = $this->get('reportes.base');
        $datosInterfaz = json_decode($request->getContent(), true);
        
        $fecha = split("-", $datosInterfaz['fechaConsulta2']);
        $parametros['PR_STR_FECHA2'] = "01-".$fecha[1]."-".$fecha[0];
        $parametros['PR_STR_PERIODO'] = "PERIODO ".$fecha[1]."-".$fecha[0];
        $parametros['PR_INT_EMPRESA']= $base->idEmpresa;
        $parametros['PR_STR_CONDICION']=" ";
        
        if($datosInterfaz['municipio'] > 0){
            
            $parametros['PR_STR_CONDICION']=" AND rec.uni_municipio=".$datosInterfaz['municipio'];
        }
        
        set_time_limit(3600);
        $reporte = $base->getReportObject('anticipos.jrxml', $parametros, 'xlsx', true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($reporte);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
    /**
     * @Route("/generarRecaudosFacturacionConciliacion")
     * @Method({"POST"})
     */
    public function generarRecaudosFacturacionConciliacion(Request $request) {

        $base = $this->get('reportes.base');
        $datosInterfaz = json_decode($request->getContent(), true);
        
        $fecha = split("-", $datosInterfaz['fechaConsulta2']);
        $parametros['PR_STR_FECHA2'] = "01-".$fecha[1]."-".$fecha[0];
        $parametros['PR_STR_PERIODO'] = "PERIODO ".$fecha[1]."-".$fecha[0];
        $parametros['PR_INT_EMPRESA']= $base->idEmpresa;
        $parametros['PR_STR_CONDICION']=" ";
        
        if($datosInterfaz['municipio'] > 0){
            
            $parametros['PR_STR_CONDICION']=" AND rec.uni_municipio=".$datosInterfaz['municipio'];
        }
        
        set_time_limit(3600);
        $reporte = $base->getReportObject('anticipos_conciliacion.jrxml', $parametros, 'xlsx', true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($reporte);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
