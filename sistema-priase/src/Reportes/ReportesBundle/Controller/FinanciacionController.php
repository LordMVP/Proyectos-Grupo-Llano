<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Llanogas\LlanogasBundle\Utiles\Util;    
use Reportes\ReportesBundle\Models\RecaudosReportesModel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FinanciacionController extends Controller {

    public function __construct() {
         
    }

    /**
     * @Route("/financiacionConcepto")
     * @Method({"GET"})
     * @Template("ReportesBundle:Financiaciones:financiacionConcepto.html.twig") 
     */
    public function financiacionConcepto() {
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $tiposUso = $base->utilModel->consultarTiposUso();
        $parametros['municipios'] = $municipios;
        $parametros['tiposUso'] = $tiposUso;
        $parametros['ciclos']  = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarFinanciacionConcepto")
     * @Method({"POST"})
     */
    public function generarFinanciacionConcepto(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $parametros['PR_STR_CONDICIONES'] = " AND 1=1";
        $parametros['PR_STR_CONDICIONES2'] = " AND 1=1";
        
        if($content['codigoProyecto']!=='-1'){
            $parametros['PR_STR_CONDICIONES'] = " AND dsus.uni_municipio = ".$content['codigoProyecto'];
        } 
        
        if(isset($content['suscripcion'])&&$content['suscripcion']!==''){
            $parametros['PR_STR_CONDICIONES'] = " AND dsus.dsus_ideregistr = ".$content['suscripcion'];
        }
        if(isset($content['financiacion'])&&$content['financiacion']!==''){
            $parametros['PR_STR_CONDICIONES'] = " AND fin.fin_ideregistro = ".$content['financiacion'];
        }
        $reportName= "";
        if($content['tipoReporte']===1){
            $reportName= "financiacion_conceptos_detallado.jrxml";
            $parametros['PR_STR_TITULO_REPORTE'] = "FINANCIACIONES POR CONCEPTOS INFORME DETALLADO";
        }
        else if($content['tipoReporte']===2){
            $reportName= "financiacion_conceptos_agrupado.jrxml";
            $parametros['PR_STR_TITULO_REPORTE'] = "FINANCIACIONES POR CONCEPTOS INFORME AGRUPADO";
        }
        
        if($content['ciclo']!=='-1'){
            $parametros['PR_STR_CONDICIONES']   = " AND dsus.cic_ideregistro = ".$content['ciclo'];
            $parametros['PR_STR_CONDICIONES2']  = " AND	fac.cic_ideregistro = ".$content['ciclo'];
        } 
        
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;           
        $parametros['PR_STR_FECHA'] = $content['fechaCorte'] ;         
        $parametros['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;      
        
        set_time_limit(3600);
        $report = $base->getReportObject($reportName, $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
    }
    
    

    /**
     * @Route("/estadoCuentaFinanciacion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Financiaciones:estadoCuenta.html.twig") 
     */
    public function estadoCuentaFinanciacion() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteEstadoCuentaFinanciacion")
     * @Method({"POST"})
     */
    public function generarReporteEstadoCuentaFinanciacion(Request $request) {
        $base = $this->get("reportes.base");
        //Util::validarPeticion($this);
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_FINANCIACION'] = $content['numeroFinanciacion'];
        $parametros['PR_STR_TITULO_REPORTE'] = "ESTADO DE CUENTA FINANCIACION";
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa; 
        $report = $base->getReportObject("estado_cuenta_financiacion_v4.jrxml", $parametros);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Estado de cuenta financiacion", true);
    }
    
            /**
     * @Route("/generarReporteEstadoCuentaFinanciacion2")
     * @Method({"POST"})
     */
    public function generarReporteEstadoCuentaFinanciacion2(Request $request) {
        $base = $this->get("reportes.base");
        //Util::validarPeticion($this);
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_FINANCIACION'] = $content['numeroFinanciacion'];
        $parametros['PR_STR_TITULO_REPORTE'] = "ESTADO DE CUENTA FINANCIACION";
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa; 
        $report = $base->getReportObject("estado_cuenta_financiacion_v4.jrxml", $parametros, "xlsx");
       /* $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Estado de cuenta financiacion", true);*/
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
     /**
     * @Route("/generarReporteSaldoFinanciacion")
     * @Method({"POST"})
     */
    public function generarRepSaldoFinanciacion(Request $requiest) {
        try {
            $base = $this->get("reportes.base");
            $requestInfo = json_decode($requiest->getContent(), true);
            $empresa = $base->utilModel->consultarEmpresaCodSeven($base->idEmpresa);
            $informacionUsuario = $base->getUserDetails(); 
            $fecha_corte = $requestInfo['fechaCorte'] ;
            $finaciacionModel =  new \Reportes\ReportesBundle\Models\FinanciacionReportesModel($base->conexion);
            $dias_fac =  $finaciacionModel->consultar_dias_interes($requestInfo["numeroFinanciacion"] , $fecha_corte) ;
            if (!isset($dias_fac) or $dias_fac < 0  )
            {
                $dias_fac = 0 ; 
            }
            $parametro =  $finaciacionModel->consultar_tasas_interes($requestInfo["numeroFinanciacion"]) ;
            if (isset($parametro))
            {
                $tasa_interes = $parametro['interes'] ; 
            }
            else
            {
                $tasa_interes = 0 ; 
            }
            $parametros = array();
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            $parameters["PR_STR_USUARIO"] = $informacionUsuario['usu_login'] ;
            $parametros['PR_STR_EMPRESA_NIT'] = "NIT: " . $empresa[0]['empresa_cod'] ;
            $parametros['PR_STR_TITULO_EMPRESA'] = $base->idEmpresa;
            $parametros['PR_STR_USUARIO_APR'] =  "Mvparrado";
            $parametros['PR_INT_ID_FINANCIACION'] = $requestInfo["numeroFinanciacion"];
            $parametros['PR_STR_TASA_INTERES'] = $tasa_interes ;
            $parametros['PR_INT_DIAS_FACTURAR'] = $dias_fac ;
            $report = $base->getReportObject("Saldo_Financiacion.jrxml", $parametros);
            $manager = new ReportManager();
            $manager->executeReport($report);
            return JasperUtil::getJSONBase64Response($manager, "Saldo Financiacion", true);
//            $reporte = $base->getReportObject('Saldo_Financiacion.jrxml', $parametros, 'pdf', true);
//            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
//            $manager->executeReportBytes($reporte);
//            return JasperUtil::getJSONPathResponse($manager); 
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
