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
 * Archivo para generar el reporte de créditos
 *
 * @author progredi1
 */
class InformeCreditosController extends Controller {
    //put your code here

    /**
     * @Route("informe_creditos")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:informeCreditos.html.twig")
     */
    public function informeCreditos() {
        $base = $this->get("reportes.base");       
        $parametros = array();
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("generar_informe_creditos")
     * @Method({"POST"})
     */
    public function generarInformeCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);
            $fecha = $info['fecha'] ;
            $laFecha = explode ( "-", $fecha); 
            $mes = $laFecha[1];
            $meses = array('ENERO', 'FEBRERO', 'MARZO' , 'ABRIL', 'MAYO' , 'JUNIO', 'JULIO','AGOSTO', 'SEPTIEMBRE' , 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE' ) ;
            $params['PR_STR_MES'] = $meses[$mes-1];
            $params['PR_STR_ANO'] = $laFecha[0];
            $params['PR_STR_TITULO_REPORTE'] = "REPORTE MENSUAL DE CRÉDITOS";
            $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
            $params['PR_STR_FECHA_CORTE'] = $fecha ;
            $fecha_ant = $laFecha[0]."-". $mes ."-01" ;
            $params['PR_STR_FECHA_COR_ANT'] = date("d-m-Y",strtotime($fecha_ant." - 1 day"));      
            set_time_limit(3600);
            $report = $base->getReportObject("InformeCreditos.jrxml", $params, "xlsx", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
            
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }  
    
    /**
     * @Route("reporte_provision_creditos")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:ReporteProvisionCreditos.html.twig")
    */
    public function ReporteProvisionCreditos() {
        $base = $this->get("reportes.base");       
        $parametros = array();
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
    /**
     * @Route("generar_provision_creditos")
     * @Method({"POST"})
     */
    public function generarProvisionCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);
            $fecha_ini = $info['fecha_ini'] ;
            $fecha_fin = $info['fecha_fin'] ;
            $laFecha = explode ( "-", $fecha_ini); 
            $fecha_ini = "01-". $laFecha[1] . "-" .  $laFecha[0] ;            
            $laFecha = explode ( "-",$info['fecha_fin']); 
            $fecha_fin = date("d-m-Y",strtotime(("01-". $laFecha[1] . "-" .  $laFecha[0])."+ 1 month" )) ;
            $fecha_fin = date("d-m-Y",strtotime($fecha_fin."- 1 day")) ;
            $params['PR_STR_TITULO_REPORTE'] = "REPORTE PROVISION CRÉDITOS";
            $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
            $params['PR_INT_EMPRESA'] = $base->idEmpresa;
            $params['PR_FECHA_INICIAL'] = $fecha_ini ;
            $params['PR_FECHA_FINAL'] = $fecha_fin ;    
            set_time_limit(3600);  
            $report = $base->getReportObject("Reporte_Provision_Creditos.jrxml", $params, "xlsx", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
             return JasperUtil::getJSONPathResponse($manager);            
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }
    
    /**
     * @Route("reporte_creditos")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:reporteCreditos.html.twig")
     */
    public function reporteCreditos() {
        $base = $this->get("reportes.base");
        $empresas = $base->utilModel->consultarEmpresas();
        $parametros['convenios'] = $empresas;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
    /**
     * @Route("getEstadosCredito")
     * @Method({"GET"})
     */
    public function getJsonEstadoCredito() {
        $base = $this->get("reportes.base");
        $estadosCredito = $base->modeloGenerico->obtenerListaPorClase(27, $base->idEmpresa);
        $resultado['estados'] = $estadosCredito;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("generar_reporte_creditos")
     * @Method({"POST"})
     */
    public function generarReporteCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);

            $params['PR_STR_TITULO_REPORTE'] = " REPORTE DE CREDITOS " ;
            $params['PR_STR_CONDICION'] = " ";
            $params['PR_INT_ID_EMPRESA'] =  $base->idEmpresa;
            $params['PR_INT_ID_EMPRESA'] =  $base->empresaNombre;
            if (isset($info['idconvenio'])) {
                $params['PR_STR_CONDICION'] .= " AND cae.ter_ideempresa = " . $info['idconvenio'];
            }
            if (isset($info['idciclo'])) {
                $params['PR_STR_CONDICION'] .= " AND finn.cic_ideregistro = " . $info['idciclo'];
            }
            if (isset($info['nitTercero'])) {
                $params['PR_STR_CONDICION'] .= " AND finn.cic_ideregistro = '" . $info['nitTercero']."'";
            }            
            if (isset($info['fechaInicioSol'])) {
                $params['PR_STR_CONDICION'] .= " AND cre_fecha::date >= '" . $info['fechaInicioSol']."'::DATE";
            }            
            if (isset($info['fechaFinSol'])) {
                $params['PR_STR_CONDICION'] .= " AND cre_fecha::date <= '" . $info['fechaFinSol']."'::DATE";
            }
            if (isset($info['montodesde'])) {
                $params['PR_STR_CONDICION'] .= " AND crec.cre_monto >= " . $info['montodesde'];
            }            
            if (isset($info['montohasta'])) {
                $params['PR_STR_CONDICION'] .= " AND crec.cre_monto <= " . $info['montohasta'];
            }            
            if (isset($info['morosidaddesde'])) {
                $params['PR_STR_CONDICION'] .= " AND COALESCE ( (now()::DATE -
                                                (SELECT MIN(fac_fecvence) 
						FROM fac_factura fcc2 
						WHERE fcc2.fin_ideregistro = finn.fin_ideregistro 
						and fcc2.fac_sdoreal::NUMERIC > 0 )::DATE ), 0 )>= " . $info['morosidaddesde'];
            }
            if (isset($info['morosidadhasta'])) {
                $params['PR_STR_CONDICION'] .= " AND COALESCE ( (now()::DATE -
                                                (SELECT MIN(fac_fecvence) 
						FROM fac_factura fcc2 
						WHERE fcc2.fin_ideregistro = finn.fin_ideregistro 
						and fcc2.fac_sdoreal::NUMERIC > 0 )::DATE ), 0 ) <= " . $info['morosidadhasta'];
            }
            if (isset($info['idestado'])) {
                $params['PR_STR_CONDICION'] .= " AND crec.uni_creetapa = " . $info['idestado'];
            }  
            //echo  $params['PR_STR_CONDICION'] ; 
            set_time_limit(3600);
            $report = $base->getReportObject("ReporteCreditosPotenza.jrxml", $params, "xlsx", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
            return $params['PR_STR_CONDICION'] ;
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}