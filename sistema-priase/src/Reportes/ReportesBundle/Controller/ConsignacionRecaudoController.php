<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\Models\RecaudosReportesModel;
use Llanogas\LlanogasBundle\Utiles\Util;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class ConsignacionRecaudoController extends Controller {

    public function __construct() {

    }

    /**
     * @Route("/consignacionRecaudo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:consignacionRecaudo.html.twig")
     */
     public function consignacionRecaudo(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }


    /**
     * @Route("/generarReporteConsignacionRecaudo")
     * @Method({"POST"})
     */
    public function generarReporteConsignacionRecaudo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $parametros['PR_STR_USUARIO']=$base->usuario;
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $parametros['PR_STR_MEDIOPAGO'] = "";

        if($content['metodosPago'] != -1){
            $parametros['PR_STR_MEDIOPAGO'] = " AND uni.uni_ideregistro IN (".$content['metodosPago'].")";
        }


        $report= $base->getReportObject("ConsignacionGeneral.jrxml", $parametros, $content['formato']);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "ConsignacionGeneral.".$content['formato'], true);
    }



    /**
     * @Route("/recaudoFinMes")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:recaudoFinMes.html.twig")
     */
    public function recaudoFinMes(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/contactCenter")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:contactCenter.html.twig")
     */
     public function contactCenter(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarContactCenter")
     * @Method({"POST"})
     */
     public function generarContactCenter(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        //$requestContent = json_decode($request->getContent(),true);

        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];

        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);
        //$resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        set_time_limit(3600);
        ini_set('memory_limit', '1024M');
        ini_set('post_max_size','100M');
        ini_set('upload_max_filesize','100M');
        ini_set('max_execution_time','1000');
        ini_set('max_input_time','1000');
        $resultados=$ventasModel->contactcenter();
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("Contact center");
        $excelReport->agregarHoja($resultados, "Contact center");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

     /**
     * @Route("/generarReporteContactCenterDirecto")
     * @Method({"POST"})
     */
    public function generarReporteContactCenterDirecto(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        //$report= $base->getReportObject("FinanciacionConceptos.jrxml", $parametros);
        set_time_limit(3600);
        $report = $base->getReportObject("Contactcenter.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }


     /**
     * @Route("/suscripcionCastigada")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:suscripcionCastigada.html.twig")
     */
     public function suscripcionCastigada(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarSuscripcionCastigada")
     * @Method({"POST"})
     */

    public function generarSuscripcionCastigada(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("Castigadas.jrxml", $parametros,"xlsx");

	$manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }


    /**
     * @Route("/generarSuscripcionCastigadaAgrupada")
     * @Method({"POST"})
     */
     public function generarSuscripcionCastigadaAgrupada(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $report= $base->getReportObject("CastigadasAgrupada.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "SuscripcionesCastigadasAgrupadas.xlsx", true);
    }

    /**
     * @Route("/generarSuscripcionCastigadasin")
     * @Method({"POST"})
     */
     public function generarSuscripcionCastigadasin(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);

        $fechaInicial = $requestContent['fechaInicial'];
        $fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];

        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $ventasModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);
        $resultados = $ventasModel->suscripcioncastigadasin($fechaInicial,$fechaFinal);
        //$resultados=$ventasModel->suscripcioncastigada();
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("suscripciones castigadas");
        $excelReport->agregarHoja($resultados, "castigadassinfinanciacion");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

    /**
     * @Route("/reconexionesPago")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:reconexionesPago.html.twig")
     */
     public function reconexionesPago(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarreconexionesPago")
     * @Method({"POST"})
     */
    public function generarreconexionesPago(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ReconexionesPago.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/generarreconexionesMañana")
     * @Method({"POST"})
     */
    public function generarreconexionesMañana(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ReconexionesMañana.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/reporteBioDia")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:reporteBioDia.html.twig")
     */
     public function reporteBioDia(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteBioDia")
     * @Method({"POST"})
     */
     public function generarReporteBioDia(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $opc = $content['opc'];
        if($opc==1 )
        {
            $report= $base->getReportObject("Biopagos.jrxml", $parametros,"txt");
            $manager = new ReportManager();
            $manager->executeReport($report);
            return JasperUtil::getJSONBase64Response($manager, "Biopagos.dat", true);
        }
        else
        {
            $report= $base->getReportObject("ReporteRecaudoPSE.jrxml", $parametros,"csv");
            $manager = new ReportManager();
            $manager->executeReport($report);
            return JasperUtil::getJSONBase64Response($manager, "PAGPSE.CSV", true);
        }
    }

    /**
     * @Route("/movimientoContable")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:movimientoContable.html.twig")
     */
     public function movimientoContable(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }


     /**
     * @Route("/listaSuspensionesReconexiones")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:listaSuspensionesReconexiones.html.twig")
     *
     */
    public function listaSuspensionesReconexiones() {
        $base = $this->get("reportes.base");
        $sesion = Util::iniciarSesion($this);

        $idEmpresa = $sesion->get("idEmpresa");
        $idUsuario = $sesion->get("idUsuario");

        $conexion = Util::getConexion($this);
        $genericoModel = new \Llanogas\LlanogasBundle\Models\GenericoModel($conexion);
        $lisParametros["proyectos"] = $genericoModel->getMunicipiosPorPerfilAndPrograma($idUsuario, $idEmpresa, 119);

        return array_merge($base->parametrosBasicos,$lisParametros);
    }

    /**
     * @Route("/generarListaSuspensionesRTR")
     * @Method({"POST"})
     * */
    public function generarListaSuspensionesRTR(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        set_time_limit(3600);
        $report= $base->getReportObject("suspension.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }

        /**
     * @Route("/generarListaReconexionesRTR")
     * @Method({"POST"})
     * */
    public function generarListaReconexionesRTR(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        set_time_limit(3600);
        $report= $base->getReportObject("reconexion.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }

         /**
     * @Route("/generarListaSuspensionesFacturacion")
     * @Method({"POST"})
     * */
         public function generarListaSuspensionesFacturacion(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta3'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta4'];
        $parametros['PR_INT_PROYECTO']=$content['proyecto'];
        $parametros['PR_INT_TIPO']=$content['tipo'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $array=$content['idmotivo'];
        $condicion2=" ";
        $condicion3=" ";
        $condicionTipoSus=" ";

        $valor2="0";
        foreach ($array as &$valor)
            {
             $valor2 =$valor2.",".$valor;
            }
        $condicion ="AND mosu.uni_motsuspen  IN (".$valor2.")";
        if($content['zona']==1)
        {
           $condicion2=" AND pro.pro_altriesgo='S'";
        }
        if($content['zona']==2)
        {
           $condicion2=" AND pro.pro_altriesgo='N'";
        }
        if($content['zonatipo']==1)
        {
            $condicion3=" AND pro.pro_zona='U'";
        }
        if($content['zonatipo']==2)
        {
            $condicion3=" AND pro.pro_zona='R'";
        }
        $parametros['PR_STR_CONDICION']=$condicion.$condicion2.$condicion3;
        set_time_limit(3600);
        $report= $base->getReportObject("listasuspension.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }

         /**
     * @Route("/generarListaReconexionesFacturacion")
     * @Method({"POST"})
     * */
         public function generarListaReconexionesFacturacion(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta3'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta4'];
        $parametros['PR_INT_PROYECTO']=$content['proyecto'];
        $parametros['PR_INT_TIPO']=$content['tipo'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $valor0="";
        $condicionTipoSus ="";

        if(isset($content['idfiltro']) && !empty($content['idfiltro'])){
            $array2 = $content['idfiltro'];
            foreach ($array2 as &$valor)
                {
                 $valor0 =$valor0.",".$valor;
                }

            $condicionTipoSus =" AND ssp.uni_tipsuspen IN (".substr($valor0,1).")";
        }

        $condicion ="";
        $condicion2=" ";
        $condicion3=" ";
        $valor2="";

        if(isset($content['idmotivo']) && !empty($content['idmotivo'])){
            $array = $content['idmotivo'];
             foreach ($array as &$valor)
                {
                 $valor2 =$valor2.",".$valor;
                }
            $condicion =" AND morx.uni_motreconex IN (".substr($valor2,1).")";
        }



        if($content['zona']==1)
        {
           $condicion2=" AND pro.pro_altriesgo='S'";
        }
        if($content['zona']==2)
        {
           $condicion2=" AND pro.pro_altriesgo='N'";
        }
        if($content['zonatipo']==1)
        {
            $condicion3=" AND pro.pro_zona='U'";
        }
        if($content['zonatipo']==2)
        {
            $condicion3=" AND pro.pro_zona='R'";
        }
        $parametros['PR_STR_CONDICION']=$condicion.$condicion2.$condicion3.$condicionTipoSus;
        set_time_limit(3600);
        $report= $base->getReportObject("listareconexion.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }

         /**
     * @Route("/generarreconexionesAntesPago")
     * @Method({"POST"})
     */
    public function generarreconexionesAntesPago(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ReconexionesAntesPago.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/centralesRiesgo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:centralesRiesgo.html.twig")
     *
     */
    public function centralesRiesgo() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarCentralesRiesgo")
     * @Method({"POST"})
     */
     public function generarCentralesRiesgo(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);

        //$fechaInicial = $requestContent['fechaInicial'];
        //$fechaFinal = $requestContent['fechaFinal'];
        //$estado = $requestContent['estado'];
        //$municipio = $requestContent['municipio'];

        //$ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $recaudo=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);
        $resultados = $recaudo->centralesRiesgo();
        //$resultados=$ventasModel->suscripcioncastigada();
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("suscripciones castigadas");
        $excelReport->agregarHoja($resultados, "castigadassinfinanciacion");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }

     /**
     * @Route("/generarCentralesRiesgoExcel")
     * @Method({"POST"})
     */
    public function generarCentralesRiesgoExcel(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_VENCIMIENTO']=$content['fechaConsulta1'];
        $parametros['PR_STR_CORTE']=$content['fechaConsulta2'];
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;

        /**
         * Inicio modificacion Julian Poveda
         */

        if($base->idEmpresa == 322){
            $parametros['PR_STR_CONCEPTOS'] = " AND dfin.uni_concepto IN(538,326)";
        }else{
            $parametros['PR_STR_CONCEPTOS'] = " ";
        }

        $report= $base->getReportObject("CentralesRiesgo.jrxml",$parametros,"xlsx");
        if($base->idEmpresa == 325){
            $report= $base->getReportObject("CentralesRiesgo_Potenza.jrxml",$parametros,"xlsx");
        }

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

     /**
     * @Route("/generarCentralesRiesPositivo")
     * @Method({"POST"})
     */
    public function generarCentralesRiesPositivo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_STR_VENCIMIENTO']=$content['fechaConsulta1'];
        //$parametros['PR_STR_CORTE']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $parametros['PR_STR_CONDICIONES'] =' AND uni_concepto IN(538,326) ';
        if ($base->idEmpresa == '325')
        {
            $parametros['PR_STR_CONDICIONES'] = ' ';
        }
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report= $base->getReportObject("CentralesFinanciacion.jrxml",$parametros,"xlsx");
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "ReconexionesPago.xlsx", true);

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

     /**
     * @Route("/generarReporteMovimientoContable")
     * @Method({"POST"})
     */
    public function generarReporteMovimientoContable(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA1']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $parametros['PR_INT_PROYECTO']=$content['proyecto'];
        $parametros['PR_INT_USUARIO']=$base->idUsuario;
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_TIPO']=$content['tipo'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $condicion=$content['tipo']==1 ? "causacion" : "recaudo" ;
        $condicionmovi="";
        $condicionproy="";
        if($content['mvi2']==-1)
        {
            $condicionmovi=" ";
        }
        else
        {
            $condicionmovi=" AND emv.mvi_ideregistro=".$content['mvi2'];
        }
        if($content['proyecto']==-1)
        {
            //$parametros['PR_STR_CONDICION']=" "." AND emv.mvi_ideregistro=".$content['mvi2'];
            $condicionproy=" ";
        }
        else
        {
            $condicionproy=" AND emv.uni_municipio= ".$content['proyecto'];
        }
        $parametros['PR_STR_CONDICION']=$condicionmovi.$condicionproy;
        //$report= $base->getReportObject("movimiento_$condicion.jrxml", $parametros,"xlsx");
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "movimiento_$condicion.xlsx", true);
        set_time_limit(3600);
        $report= $base->getReportObject("movimiento_$condicion.jrxml",$parametros,"xlsx",true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }


    /**
     * @Route("/generarReporteRecaudoFinMes")
     * @Method({"POST"})
     */
    public function generarReporteRecaudoFinMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA1']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $parametros['PR_INT_USUARIO']=$base->idUsuario;
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;

        if($content['lista'] == ""){
            $parametros['PR_STR_MEDIOPAGO'] = " IS NOT NULL";
        }else{
            $parametros['PR_STR_MEDIOPAGO'] = " IN (".$content['lista'].")";
        }

        set_time_limit(3600);
        $report= $base->getReportObject("recaudoFinMes.jrxml",$parametros,"xlsx",true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }






    /**
     * @Route("/generarListaSuspensionesPagoFacturacion")
     * @Method({"POST"})
     * */
         public function generarListaSuspensionesPagoFacturacion(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaConsulta3'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta4'];
        $parametros['PR_INT_PROYECTO']=$content['proyecto'];
        $parametros['PR_INT_TIPO']=$content['tipo'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $condicion2=" ";
        $condicion3=" ";

        $array = $content['idfiltro'];
        $valor = implode(", ", $array);

        if(strlen($valor)>0){
            $condicionTipoSus =" AND ssp.uni_tipsuspen IN (".$valor.")";
        }

        $array = $content['idmotivo'];
        $valor = implode(", ", $array);

        if(strlen($valor) > 0){
            $condicion =" AND morx.uni_motreconex IN (".$valor.")";
        }

        if($content['zona']==1)
        {
           $condicion2=" AND pro.pro_altriesgo='S'";
        }
        if($content['zona']==2)
        {
           $condicion2=" AND pro.pro_altriesgo='N'";
        }
        if($content['zonatipo']==1)
        {
            $condicion3=" AND pro.pro_zona='U'";
        }
        if($content['zonatipo']==2)
        {
            $condicion3=" AND pro.pro_zona='R'";
        }
        $parametros['PR_STR_CONDICION']=$condicion.$condicion2.$condicion3.$condicionTipoSus;
        set_time_limit(3600);
        $report= $base->getReportObject("listasuspensionpago.jrxml", $parametros,"xlsx");

        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }

    /**
     * @Route("/buscarEmvExpmovimient")
     * @Method({"POST"})
     * */
    public function buscarEmvExpmovimient(Request $request) {
         $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$municipio = $content['municipio'];
        $fechaInicio=$content['fechaConsulta3'];
        $fechaFinal=$content['fechaConsulta4'];
        $empresa=$base->idEmpresa;
        $usuario=$base->idUsuario;
        $tipo="";
        $municipio="";
        $condicion="";
        $tipomvi="";
        if ($content['municipio']<0) {
            $municipio = "";
        }
        if($content['municipio']>0)
        {
            $municipio = "AND emv.uni_municipio=".$content['municipio'];
        }
        if($content['tipo2']==1)
        {
            $tipo=" AND emv.doto_tipo IN('WSMC','WSFP')";
        }else{
            $tipo=" AND emv.doto_tipo NOT IN('WSMC','WSFP')";
        }

        if($content['mvi'] > 0 ){
            $tipomvi=" AND emv.mvi_ideregistro=".$content['mvi'];
        }

        $condicion= $municipio.$tipo.$tipomvi;
        $recaudomodel = new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);
        $resultado["emv"] = $recaudomodel->consultarEmv($fechaInicio,$fechaFinal,$condicion,$empresa,$usuario);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

     /**
     * @Route("/generarMovimientoDetallado")
     * @Method({"POST"})
     */
    public function generarMovimientoDetallado(Request $request) {
        $base       = $this->get("reportes.base");
        $content    = json_decode($request->getContent(), true);
        $movi       = $content['movi'];
        $documento  = $content['documento'];
        $tipoDoc    = $content['tipoDocumento'];
        $concepto   = $content['concepto'];

        $params['PR_STR_FILTRO'] = "1=1";

        if(!empty($documento)){
            $params['PR_STR_FILTRO'] .= " AND cod_documento IN (".$documento.")";
        }

        if(!empty($tipoDoc)){
            $params['PR_STR_FILTRO'] .= " AND cod_tipodocumento IN (".$tipoDoc.")";
        }

        if(!empty($concepto)){
            $params['PR_STR_FILTRO'] .= " AND cod_concepto IN (".$concepto.")";
        }


        if($content['group'] == true){
            $params['PR_INT_AGRUPADO'] = 1;
        }else{
            $params['PR_INT_AGRUPADO'] = 0;
        }

        $reportName = "movimiento_causacion_detallado.jrxml";
        $PR_STR_CONDICIONES = '$X{IN,emv.emv_ideregistro , PR_LIST_EMV}';
        //$PR_STR_CONDICIONES = "1=1";
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        $params['PR_INT_USUARIO']=$base->idUsuario;
        $params['PR_LIST_EMV'] = $movi;
        $params['PR_STR_CONDICIONES'] = $PR_STR_CONDICIONES;
        $report = $base->getReportObject($reportName, $params, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }


    /**
     * @Route("/getJsonMediosPagoUsuario")
     * @Method({"GET"})
     */
    public function getJsonMediosPagoUsuario() {
        $base = $this->get("reportes.base");
        $consignacionRecaudoModel = new \Reportes\ReportesBundle\Models\ConsignacionRecaudoModel($base->conexion);
        $resultado['mediosPago'] = $consignacionRecaudoModel->consultarMediosPagoUsuario($base->idUsuario, $base->idEmpresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/generarMorososSSPD")
     * @Method({"POST"})
     */

    public function generarMorososSSPD(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("InformeMorosos_SSPD.jrxml", $parametros,"xlsx");

	$manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/reporteIncompletosWERE")
     * @Method({"GET"})
     * @Template("ReportesBundle:Recaudo:reportesWERE.html.twig")
     */
     public function reporteIncompletosWERE(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarReporteIncompletosWERE")
     * @Method({"POST"})
     */
     public function generarReporteIncompletosWERE (Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_TITULO_EMPRESA']=$base->empresaNombre;
        $parametros['PR_STR_TITULO_REPORTE']= "REPORTE DE RECAUDOS INCOMPLETOS INGRESADOS POR WERE" ;
        $opc = $content['opc'];
        if($opc==1 )
        {
            $report= $base->getReportObject("ReporteIncompletosWERE.jrxml", $parametros,"xlsx");
            $manager = new ReportManager();
            $manager->executeReport($report);
            return JasperUtil::getJSONBase64Response($manager, "IncompletosWERE.xlsx", true);
        }
    }

}
