<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\Models\RecaudosReportesModel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FacturacionReportesController extends Controller {

    public function __construct() {
        
    }

    /**
     * @Route("/reportesBioagricola")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reportesBioagricola.html.twig") 
     */
    public function reportesBioagricola() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarBioagricolaCartera")
     * @Method({"POST"})
     */
    public function generarBioagricolaCartera(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $periodo = $requestContent['periodo'];
        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];
        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel = new \Reportes\ReportesBundle\Models\BioagricolaReportesModel($base->conexion);
        //$resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        $resultados = $ventasModel->Bioagricolacartera($periodo);
        if (count($resultados) == 0) {
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("BioCartera");
        $excelReport->agregarHoja($resultados, "BioCartera");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/generarBioagricolaGasodomestico")
     * @Method({"POST"})
     */
    public function generarBioagricolaGasodomestico(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $periodo = $requestContent['periodo'];
        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];
        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel = new \Reportes\ReportesBundle\Models\BioagricolaReportesModel($base->conexion);
        //$resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        $resultados = $ventasModel->Bioagricolagaso($periodo);
        if (count($resultados) == 0) {
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("BioGasodomestico");
        $excelReport->agregarHoja($resultados, "BioGasodomestico");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/generarBioagricolaCarteraTotal")
     * @Method({"POST"})
     */
    public function generarBioagricolaCarteraTotal(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $report = $base->getReportObject("BioTotalCartera.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "BioTotalCartera.xlsx", true);
    }

    /**
     * @Route("/generarBioagricolaGasodomesticoTotal")
     * @Method({"POST"})
     */
    public function generarBioagricolaGasodomesticoTotal(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $report = $base->getReportObject("BioTotalGaso.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "BioTotalGaso.xlsx", true);
    }

    /**
     * @Route("/generarBioagricolaTotal")
     * @Method({"POST"})
     */
    public function generarBioagricolaTotal(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $report = $base->getReportObject("BioTotalGeneral.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "BioTotalGeneral.xlsx", true);
    }

    /**
     * @Route("/reportesSui")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reportesSui.html.twig") 
     */
    public function reportesSui() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarSuiRegulados")
     * @Method({"POST"})
     */
    public function generarSuiRegulados(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $periodo = $requestContent['periodo'];
        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];
        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel = new \Reportes\ReportesBundle\Models\FacturacionGeneralModel($base->conexion);
        //$resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        set_time_limit(3600);
        ini_set('memory_limit', '-1');
        $resultados = $ventasModel->SuiRegulados($periodo);
        if (count($resultados) == 0) {
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("SuiRegulados");
        $excelReport->agregarHoja($resultados, "SuiRegulados");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/generarSuiNoRegulados")
     * @Method({"POST"})
     */
    public function generarSuiNoRegulados(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $periodo = $requestContent['periodo'];
        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];
        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel = new \Reportes\ReportesBundle\Models\FacturacionGeneralModel($base->conexion);
        //$resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        $resultados = $ventasModel->SuiNoRegulados($periodo);
        if (count($resultados) == 0) {
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("SuiNoRegulados");
        $excelReport->agregarHoja($resultados, "SuiNoRegulados");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/reporteRestot")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reporteRestot.html.twig") 
     */
    public function reporteRestot() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarRestotProyecto")
     * @Method({"POST"})
     */
    public function generarRestotProyecto(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_FECHA']=$content['fechaConsulta'];
        $parametros['PR_INT_FECHA'] = $content['ciclo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotGeneral.jrxml", $parametros);
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneral", true);
    }

    /**
     * @Route("/generarRestotProyecto2")
     * @Method({"POST"})
     */
    public function generarRestotProyecto2(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_FECHA']=$content['fechaConsulta'];
        $parametros['PR_INT_FECHA'] = $content['ciclo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotGeneral.jrxml", $parametros, "xlsx");
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneral.xlsx", true);
    }

    /**
     * @Route("/generarRestotConsolidado")
     * @Method({"POST"})
     */
    public function generarRestotConsolidado(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_FECHA']=$content['fechaConsulta'];
        $parametros['PR_INT_FECHA'] = $content['ciclo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotConsolidado.jrxml", $parametros);
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "RestotConsolidado", true);
    }

    /**
     * @Route("/generarRestotConsolidado2")
     * @Method({"POST"})
     */
    public function generarRestotConsolidado2(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_INT_FECHA']=$content['fechaConsulta'];
        $parametros['PR_INT_FECHA'] = $content['ciclo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotConsolidado.jrxml", $parametros, "xlsx");
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "RestotConsolidado.xlsx", true);
    }

    /**
     * @Route("/reportePostventas")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reportePostventas.html.twig") 
     */
    public function reportePostventas() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarPostventas")
     * @Method({"POST"})
     */
    public function generarPostventas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO'] = $content['periodo'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("postventas.jrxml", $parametros);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/reporteRequerimientos")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reporteRequerimientos.html.twig") 
     */
    public function reporteRequerimientos() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarRequerimientosfacturacion")
     * @Method({"POST"})
     */
    public function generarRequerimientosfacturacion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO'] = $content['periodo'];
        //$parametros['PR_INT_FECHA']=$content['fechaConsulta'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("requerimientos.jrxml", $parametros, "xlsx");
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "requerimientos.xlsx", true);
    }

    /**
     * @Route("/generarSuiReguladosPdf")
     * @Method({"POST"})
     */
    public function generarSuiReguladosPdf(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;

        //set_time_limit(3600);
        $report = $base->getReportObject("SuiReguladosFaca.jrxml", $parametros, "csv");  
        
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/reporteNovedadLectura")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reporteNovedadLectura.html.twig") 
     */
    public function reporteNovedadLectura() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarNovedadLectura")
     * @Method({"POST"})
     */
    public function generarNovedadLectura(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        //$periodo = $requestContent['periodo'];
        $novedad = $requestContent['novedad'];
        $fecha = $requestContent['fechaConsulta1'];
        $empresa = $base->idEmpresa;
        $laFecha = explode("-", $fecha);
        $mes = $laFecha[1];
        $anno = $laFecha[0];
        $ventasModel = new \Reportes\ReportesBundle\Models\FacturacionGeneralModel($base->conexion);

        $resultados = $ventasModel->NovedadLectura($mes, $anno, $novedad, $empresa);
        if (count($resultados) == 0) {
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("NovedadLectura");
        $excelReport->agregarHoja($resultados, "NovedadLectura");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/generarRestotPeriodo")
     * @Method({"POST"})
     */
    public function generarRestotPeriodo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_INT_PERIODO'] = $content['periodo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotPeriodo.jrxml", $parametros);
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "Restotperiodo", true);
    }

    /**
     * @Route("/generarSuiNoReguladosPdf")
     * @Method({"POST"})
     */
    public function generarSuiNoReguladosPdf(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $report = $base->getReportObject("SuiNoReguladoFaca.jrxml", $parametros, "csv");        
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarBioCarteraLista")
     * @Method({"POST"})
     */
    public function generarBioCarteraLista(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO'] = $content['periodo'];
        set_time_limit(3600);
        $report = $base->getReportObject("BioListaCartera.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarBioGasodomesticoLista")
     * @Method({"POST"})
     */
    public function generarBioGasodomesticoLista(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO'] = $content['periodo'];
        set_time_limit(3600);
        $report = $base->getReportObject("BioListaGaso.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarRestotMes")
     * @Method({"POST"})
     */
    public function generarRestotMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotGeneral.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneral.xlsx", true);
    }

    /**
     * @Route("/generarPostventaPeriodo")
     * @Method({"POST"})
     */
    public function generarPostventaPeriodo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $emitido=$content['tipoEmitido'];
        
        if($emitido == 2)
        {           
            $parametros['PR_STR_LIQUIDACION']="AND 
                (
                SELECT
                MAX(faca2.fac_ideregistro) as total
                FROM
                faca_faccartera faca2
                WHERE faca2.fac_ideregistro=fac.fac_ideregistro
                AND faca2.faca_estado='A'
                --AND faca2.dsus_ideregistr=dsus.dsus_ideregistr
                ) IS NULL --AND fac.fac_estado !='F'";
        }
        if($emitido == 1)
        {
        $parametros['PR_STR_FECHA1'] = $content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2'] = $content['fechaConsulta2'];
            $parametros['PR_STR_LIQUIDACION'] =" AND fac.fac_fecha::DATE BETWEEN $"."P{PR_STR_FECHA1}" . "::DATE AND  $"."P{PR_STR_FECHA2}"."::DATE "
                  // . " AND dsus.dsus_fecinicio NOT BETWEEN per.per_fecinicial AND per.per_fecinicial  "
                    . "AND
                        (
                        --CASE WHEN fac.fac_estado !='F' THEN
                        --(
                        SELECT
                        MAX(faca2.fac_ideregistro) as total
                        FROM
                        faca_faccartera faca2
                        WHERE faca2.fac_ideregistro=fac.fac_ideregistro
                        AND faca2.dsus_ideregistr=dsus.dsus_ideregistr
                        AND faca2.faca_estado='A'
                        --) 
			--WHEN fac.fac_estado='F' THEN fac.fac_ideregistro
                        --END
                        )=fac.fac_ideregistro 
                        ";
           //$parametros['PR_STR_LIQUIDACION'] =" AND fac.fac_fecha::DATE BETWEEN '2016-10-01'::DATE AND  '2016-10-30'::DATE ";
        }    
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("postventas.jrxml", $parametros, "xlsx");
        //$manager = new ReportManager();
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        //$manager->executeReport($report);
        $manager->executeReportBytes($report);
        //return JasperUtil::getJSONBase64Response($manager, "postventas.xlsx", true);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarReqierimientosMes")
     * @Method({"POST"})
     */
    public function generarReqierimientosMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("requerimientos.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "requerimientos.xlsx", true);
    }

    /**
     * @Route("/generarRestotAnual")
     * @Method({"POST"})
     */
    public function generarRestotAnual(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        //$parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotGeneralAnual.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneralAnual.xlsx", true);
    }

    /**
     * @Route("/generarRestotAnualConsolidado")
     * @Method({"POST"})
     */
    public function generarRestotAnualConsolidado(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        //$fecha=$content['fechaConsulta1'];            
        //$laFecha = explode ( "-", $fecha); 
        //$parametros['PR_INT_MES']=$laFecha[1];
        //$parametros['PR_INT_ANO']=$laFecha[0];         
        $parametros['PR_INT_ANO'] = $content['fechaConsulta'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $parametros['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotFaca1.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneralAnual.xlsx", true);
    }

    /**
     * @Route("/generarReqierimientosAnno")
     * @Method({"POST"})
     */
    public function generarReqierimientosAnno(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_ANO'] = $content['fechaConsulta'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("requerimientosConsolidadoFaca.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "requerimientosConsolidado.xlsx", true);
    }

    /**
     * @Route("/reportesCreg")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reportesCreg.html.twig") 
     */
    public function reportesCreg() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteCreg")
     * @Method({"POST"})
     */
    public function generarReporteCreg(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        set_time_limit(3600);
        $report = $base->getReportObject("Creg.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarListaBioCartera")
     * @Method({"POST"})
     */
    public function generarListaBioCartera(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];

        set_time_limit(3600);
        $report = $base->getReportObject("BioListaCartera.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarListaGasodomestico")
     * @Method({"POST"})
     */
    public function generarListaGasodomestico(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];

        set_time_limit(3600);
        $report = $base->getReportObject("BioListaGaso.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarListaHomologadas")
     * @Method({"POST"})
     */
    public function generarListaHomologadas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_CICLO'] = $content['ciclo'];
        $parametros['PR_STR_PERIODO'] =$laFecha[0].$laFecha[1];
        //set_time_limit(3600);
        $report = $base->getReportObject("BioListaHomo.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarBioagricolaTotalTotal")
     * @Method({"POST"})
     */
    public function generarBioagricolaTotalTotal(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_CICLO'] = $content['ciclo'];
        $parametros['PR_STR_PERIODO'] =$laFecha[0].$laFecha[1];
        $report = $base->getReportObject("BioTotalGeneral.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "BioTotalGeneral.xlsx", true);
    }

    /**
     * @Route("/generarRestotAnualIndustrial")
     * @Method({"POST"})
     */
    public function generarRestotAnualIndustrial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        //$fecha=$content['fechaConsulta1'];            
        //$laFecha = explode ( "-", $fecha); 
        //$parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_INT_ANO'] = $content['fechaConsulta'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("RestotAchagua1.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "RestotGeneralAnualIndustrial.xlsx", true);
    }

    /**
     * @Route("/generarRequerimientoIndustrial")
     * @Method({"POST"})
     */
    public function generarRequerimientoIndustrial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        //$fecha=$content['fechaConsulta1'];            
        //$laFecha = explode ( "-", $fecha); 
        //$parametros['PR_INT_MES']=$laFecha[1];
        //$parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_INT_ANO'] = $content['fechaConsulta'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("subsidio.jrxml", $parametros);
        $report = $base->getReportObject("requerimientosConsolidadoAchagua.jrxml", $parametros, "xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "RequerimientosIndustrial.xlsx", true);
    }

    /**
     * @Route("/generarCambioMedidor")
     * @Method({"POST"})
     */
    public function generarCambioMedidor(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA1'] = $content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2'] = $content['fechaConsulta2'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //set_time_limit(3600);       
        $report = $base->getReportObject("Cambiomedidor.jrxml", $parametros, "xlsx");
        //$manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarComprobacionSui")
     * @Method({"POST"})
     */
    public function generarComprobacionSui(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report = $base->getReportObject("Comprobacion_sui.jrxml", $parametros);
        set_time_limit(3600);
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        //return JasperUtil::getJSONBase64Response($manager, "ComprobacionSui", true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarReguladosIndustrialSui")
     * @Method({"POST"})
     */
    public function generarReguladosIndustrialSui(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        set_time_limit(3600);
        $report = $base->getReportObject("SuiReguladosInd.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarReporteCregFaca")
     * @Method({"POST"})
     */
    public function generarReporteCregFaca(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0];        
        
        
        
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;

        set_time_limit(3600);
        $report = $base->getReportObject("CregFaca.jrxml", $parametros, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarComprobacionCreg")
     * @Method({"POST"})
     */
    public function generarComprobacionCreg(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANNO'] = $laFecha[0];
        $report = $base->getReportObject("Comprobacion_General_creg2_Faca.jrxml", $parametros);
        set_time_limit(3600);
        //$manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        //$manager->executeReportBytes($report);
        //return JasperUtil::getJSONPathResponse($manager);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "ComprobacionCregMasivo", true);
    }

    /**
     * @Route("/generarComprobacionCreg2")
     * @Method({"POST"})
     */
    public function generarComprobacionCreg2(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = $content['fechaConsulta1'];
        $fecha = $content['fechaConsulta1'];
        $laFecha = explode("-", $fecha);
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANNO'] = $laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report = $base->getReportObject("Comprobacion_General_creg2_Faca.jrxml", $parametros);
        set_time_limit(3600);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "ComprobacionCregIndustrial", true);
    }

    /**
     * @Route("/generarReporteListasRutas")
     * @Method({"POST"})
     */
    public function generarReporteListasRutas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $ruta = $content['ruta'];
        //$municipio = $content['municipio'];
        $PR_STR_CODICIONES = "";
        
        if (isset($content['estado'])){
            $usuarios = $content['estado'];
        }else{
            $usuarios[0] = 'ALL';
        }
        
        $condicionestados=" ";
        $reportName = "rutasGeneral.jrxml";
        
               
        if ($ruta != "all") {
            $PR_STR_CODICIONES = '$X{IN,rut.rut_ideregistro , PR_LIST_RUTAS}';
        } 
        else{
            $PR_STR_CODICIONES = '1=1';
        }
        
        if ($content['municipio'][0] != "-1") {
            $municipios= implode(",", $content['municipio']);
            $PR_STR_CODICIONES.=" AND dsus.uni_municipio in (".$municipios.")";
        }
        else{
            $PR_STR_CODICIONES.=" AND 1=1";
        }
        
               
        if($usuarios[0] == 'ALL'){
            $condicionestados = " AND dsus.dsus_estado IS NOT NULL " ;
        }else{
            $condicionestados = " AND dsus.dsus_estado IN ('".implode("','", $usuarios)."')";            
        }
        
        
        $params['PR_STR_ESTADO']=$condicionestados;
        $params['PR_INT_PROYECTO'] = ""; //$municipio;
        $params['PR_LIST_RUTAS'] = $ruta;
        $params['PR_STR_CONDICIONES'] = $PR_STR_CODICIONES.' AND dsus.emp_ideregistro = '.$base->idEmpresa;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;

        $report = $base->getReportObject($reportName, $params, "csv");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    
    /**
     * @Route("/buscarRutasPorProyecto")
     * @Method({"POST"})
     * */
    public function buscarRutasPorProyecto(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        
        if ($requestContent['municipio'][0] != "-1") {
            $municipios= implode(",", $requestContent['municipio']);
        }
        
        //$municipio = $requestContent['municipio'];
        //if ($municipio == null) {
        //    $municipio = 1;
        //}
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        $resultado["rutas"] = $facturacionModel->consultarRutasMunicipios($municipios);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/reporteCargueUsuarios")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reporteCargueUsuarios.html.twig") 
     */
    public function reporteCargueUsuarios() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/buscarUsuariosCicloAgrupados")
     * @Method({"POST"})
     * */
    public function buscarUsuariosCicloAgrupados(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $ciclo = $requestContent['idciclo'];
        $empresa = $base->idEmpresa;
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        if ($ciclo == "all") {
            $ciclo = null;
        }
        $resultado["ciclos"] = $facturacionModel->consultarUsuariosCiclo($ciclo, $empresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/buscarUsuariospendientes")
     * @Method({"POST"})
     * */
    public function buscarUsuariospendientes(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $ciclo = $requestContent['idciclo'];
        $empresa = $base->idEmpresa;
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        if ($ciclo == "all") {
            $ciclo = null;
        }
        $resultado["usuarios"] = $facturacionModel->consultarUsuariosPendientes($ciclo,$empresa );

        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/informacionBio")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:informacionBio.html.twig") 
     */
    public function informacionBio() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/BioHomologadosFacturaActivo")
     * @Method({"POST"})
     */
    public function BioHomologadosFacturaActivo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        if ($content['idciclo'] == -1) {
            $parametros['PR_STR_CONDICION'] = " ";
        } else {
            $parametros['PR_STR_CONDICION'] = "AND fac.per_ideregistro=" . $content['periodo'];
        }
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("BioPeriodoActivo.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarGasNuevosBio")
     * @Method({"POST"})
     */
    public function generarGasNuevosBio(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA1'] = $content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2'] = $content['fechaConsulta2'];
        $parametros['PR_INT_PROYECTO']= $content['proyecto'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("BioNuevosGas.jrxml", $parametros, "csv");
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "ReconexionesPago.xlsx", true);

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/buscarUsuariosCicloAgrupadosPendientes")
     * @Method({"POST"})
     * */
    public function buscarUsuariosCicloAgrupadosPendientes(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $ciclo = $requestContent['idciclo'];
        $empresa = $base->idEmpresa;
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        if ($ciclo == "all") {
            $ciclo = null;
        }
        $resultado["pendientes"] = $facturacionModel->consultarUsuariosCicloPendientes($ciclo, $empresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/buscarDuplicadoFacturaPeriodo")
     * @Method({"POST"})
     * */
    public function buscarDuplicadoFacturaPeriodo(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $empresa = $base->idEmpresa;
        $empleado = $base->idUsuario;
        $requestContent = json_decode($request->getContent(), true);
        $anno = $requestContent['fechaConsulta'];
        $usuario=$requestContent['idSuscripcion'];
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        $resultado["columnas"] = $facturacionModel->consultarFacturasPeriodo($anno,$usuario,$empresa, $empleado);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/generarRutasPeriodo")
     * @Method({"POST"})
     */
    public function generarRutasPeriodo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['mes'];
        $parametros['PR_INT_ANIO'] = $content['anno'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("Rutas_periodo.jrxml", $parametros, "xlsx");
        
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
