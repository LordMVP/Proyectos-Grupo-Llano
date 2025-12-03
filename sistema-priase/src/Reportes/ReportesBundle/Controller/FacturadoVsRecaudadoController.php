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
 * Description of FacturadoVsRecaudado por servicio publico o por financiacion
 *
 * @author AppFuture
 */
class FacturadoVsRecaudadoController extends Controller {
    //put your code here

    /**
     * @Route("/facturadovsrecaudado")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:facturadoVsRecaudado.html.twig")
     */
    public function facturadoVsRecaudado() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteFacturadoRecaudado")
     * @Method({"POST"})
     */
    public function generarReporte(Request $request) {
        try {
            $base = $this->get('reportes.base');
            $nombreReporte = "";
            $tituloReporte = "FACTURADO Vs RECAUDADO";
            $datosInterfaz = json_decode($request->getContent(), true);
            $parametros["PR_INT_ANO"] = $datosInterfaz["anos"];
            $parametros["PR_INT_IDORDEN"] = $datosInterfaz["idordenperiodo"];
	    $parametros["PR_INT_EMPRESA"] = $base->idEmpresa;
                        
            $this->validacionAgrupacionParametros($datosInterfaz, $nombreReporte, $tituloReporte, $parametros);
            $parametros["PR_STR_TITULO_REPORTE"] = $tituloReporte; 
            set_time_limit(3600);
            $report = $base->getReportObject($nombreReporte, $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

    private function validacionAgrupacionParametros($datos, &$nombreReporte, &$tituloReporte, &$parametros) {
        $condiciones = "";
        $tipoagrupacion = $datos["tipoagrupacion"];
        $tipoVista = $datos["tipovista"];
        switch ($tipoagrupacion) {
            case "TU"://Tipo de uno
                if ($tipoVista == "F") { //Financiado
                    $nombreReporte .= "FacturadoVsRecaudadoTipoUso_Financiado.jrxml";
                    $tituloReporte .= " | TIPO USO - FINANCIADO";
                }
                if ($tipoVista == "NF") {
                    $nombreReporte = "FacturadoVsRecaudadoTipoUso_NoFinanciado.jrxml";
                    $tituloReporte .= " | TIPO USO - NO FINANCIADO ";
                }
                break;
            case "C"://Concepto
                if ($tipoVista == "F") { //Financiado
                    $nombreReporte = "FacturadoVsRecaudadoConcepto_Financiado.jrxml";
                    $tituloReporte .= " | CONCEPTO - FINANCIADO";
                    break;
                }
                if ($tipoVista == "NF") {
                    $nombreReporte = "FacturadoVsRecaudadoConcepto_NoFinanciado.jrxml";
                    $tituloReporte .= " | CONCEPTO - NO FINANCIADO ";
                }
                break;
        }
        $this->validacionFiltros($datos, $parametros);
    }

    public function validacionFiltros($datos, &$parametros) {
        $condicion_ciclo = '';
        $condicion_municipio = '';
        $condicion_tipouso = '';
        $recaudado = '';
        if (!empty($datos["ciclo"])) {
            $condicion_ciclo = " AND ciclo IN ( " . $datos["ciclo"] . " ) ";
            
            /*$facturacion .= " AND faca.cic_ideregistro in ( " . $datos["ciclo"] . " ) ";
            $facturacionliq.= " AND fac.cic_ideregistro in ( " . $datos["ciclo"] . " ) ";
            $refacturado .= " AND faca.cic_ideregistro in ( " . $datos["ciclo"] . " ) ";
            $recaudado .= " AND dsus.cic_ideregistro in ( " . $datos["ciclo"] . " ) ";*/
        }
        if (isset($datos["municipio"])) {
            if (is_numeric($datos["municipio"])) {
                $condicion_municipio = " AND municipio = " . $datos["municipio"];
                
                /*$facturacion .= " AND dsus.uni_municipio = " . $datos["municipio"];
                $facturacionliq .= " AND dsus.uni_municipio = " . $datos["municipio"];
                $refacturado .= " AND dsus.uni_municipio = " . $datos["municipio"];
                $recaudado .= " AND dsus.uni_municipio = " . $datos["municipio"];*/
            }
        }
        if (isset($datos["tipouso"])) {
            if (is_numeric($datos["tipouso"])) {
                $condicion_tipouso = " AND idtipouso =" . $datos["tipouso"]; 
                
                /*$facturacion .=" AND fac.uni_tipusosuscr =" . $datos["tipouso"];
                $facturacionliq .=" AND fac.uni_tipusosuscr =" . $datos["tipouso"];
                $refacturado .=" AND fac.uni_tipusosuscr =" . $datos["tipouso"];
                $recaudado .=" AND fac.uni_tipusosuscr =" . $datos["tipouso"];*/
            }
        }
        if (isset($datos["liquidacion"])) {
            if (is_numeric($datos["liquidacion"])) {
                /*$facturacion .= " AND fac.uni_liquidacion = " . $datos["liquidacion"];
                $facturacionliq .= " AND fac.uni_liquidacion = " . $datos["liquidacion"];
                $refacturado .= " AND fac.uni_liquidacion = " . $datos["liquidacion"];
                $recaudado.= " AND fac.uni_liquidacion = " . $datos["liquidacion"];*/
            }
        }
        
        $parametros['PR_STR_CONDICION'] = $condicion_ciclo.$condicion_municipio.$condicion_tipouso;
        
        /*$parametros['PR_STR_GENERAL_FACTURACION'] = $facturacion;
        $parametros['PR_STR_GENERAL_FACTURACION_LIQ'] = $facturacionliq;
        $parametros['PR_STR_GENERAL_REFACTURADO'] = $refacturado;
        $parametros['PR_STR_GENERAL_RECAUDADO'] = $recaudado;*/
    }

}
