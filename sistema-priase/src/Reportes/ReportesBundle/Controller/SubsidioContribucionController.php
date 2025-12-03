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

class SubsidioContribucionController extends Controller {

    public function __construct() {
        
    }
    
    /**
     * @Route("/exentosContribucion")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:exentosContribucion.html.twig") 
     */
     public function exentosContribucion(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    

    /**
     * @Route("/generarReporteExentosContribucion")
     * @Method({"POST"})
     */
    public function generarReporteExentosContribucion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("exentos.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
     /**
     * @Route("/contribucionTipo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:contribucionTipo.html.twig") 
     */
     public function contribucionTipo(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    

    /**
     * @Route("/generarReporteContribucion")
     * @Method({"POST"})
     */
    public function generarReporteContribucion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];        
        set_time_limit(3600);
        $report = $base->getReportObject("Contribucion.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
        }
    
     /**
     * @Route("/generarReporteContribucionResidencial")
     * @Method({"POST"})
     */
    public function generarReporteContribucionResidencial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];        
        set_time_limit(3600);
        $report = $base->getReportObject("ContribucionResidencial.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
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
     public function generarreconexionesPago(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $ventasModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);       
        $resultados=$ventasModel->reconexionespago();
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }           
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("reconexiones pago");
        $excelReport->agregarHoja($resultados, "reconexiones pago");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }
    
    /**
     * @Route("/provisionGeneral")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:provisionGeneral.html.twig") 
     */
     public function subsidioTipo(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
        
    /**
     * @Route("/generarProvisionGeneral")
     * @Method({"POST"})
     */
    public function generarProvisionGeneral(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $report= $base->getReportObject("ProvisionMunicipios.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "ProvisionGeneral.xlsx", true);
    }
    
    /**
     * @Route("/generarProvisionVillavo")
     * @Method({"POST"})
     */
    public function generarProvisionVillavo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $report= $base->getReportObject("ProvisionVillavoGeneral.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "ProvisionVillavoGeneral.xlsx", true);
    }
    
     /**
     * @Route("/generalFacongas")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:generalFacongas.html.twig") 
     */
     public function generalFacongas(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
        
    /**
     * @Route("/GenerarFacongas")
     * @Method({"POST"})
     */
    public function GenerarFacongas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("FacongasGeneral.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Facongas.xlsx", true);
    }
    
    /**
     * @Route("/GenerarFacongasVillavo")
     * @Method({"POST"})
     */
    public function GenerarFacongasVillavo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $report= $base->getReportObject("FacongasVillavoGeneral.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasVillavo.xlsx", true);
    }
    
    /**
     * @Route("/generarProvisionVillavoPeriodo")
     * @Method({"POST"})
     */
    public function generarProvisionVillavoPeriodo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_CONDICION']=" AND pro.proyecto_ideregistro=1";
        $report= $base->getReportObject("ProvisionVillavoPeriodo.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "ProvisionVillavoGeneral.xlsx", true);
    }
    
    /**
     * @Route("/generarProvisionPeriodoMunicipios")
     * @Method({"POST"})
     */
    public function generarProvisionPeriodoMunicipios(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_STR_CONDICION']=" ";
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ProvisionPeriodo.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "ProvisionPeriodoGeneral.xlsx", true);
    }
    
     /**
     * @Route("/generarReporteSubsidioContribucion")
     * @Method({"POST"})
     */
    public function generarReporteSubsidioContribucion(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_INT_PERIODO']=$content['periodo'];
        $report= $base->getReportObject("subsidio.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarFacongasMunicipios")
     * @Method({"POST"})
     */
    public function generarFacongasMunicipios(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0]; 
        $report= $base->getReportObject("FacongasGeneral.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasGeneral.xlsx", true);
    }
    
    /**
     * @Route("/generarFacongasVillavoMes")
     * @Method({"POST"})
     */
    public function generarFacongasVillavoMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0]; 
        $report= $base->getReportObject("FacongasVillavoMes.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasVillavoPeriodo.xlsx", true);
    }
    
    /**
     * @Route("/generarContribucionMes")
     * @Method({"POST"})
     */
    public function generarContribucionMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0]; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $parametros['PR_STR_PERIODO'] = str_pad($laFecha[1],2,"0",STR_PAD_LEFT)."-".$laFecha[0];
        $opc=$content['tipoReporte'];    
        switch ($opc) {
            case 1:
                $parametros['PR_STR_TIPO'] = "5,6";
                $report= $base->getReportObject("usuariostarifas.jrxml", $parametros, "xlsx");
                break;
            case 2:
                $parametros['PR_STR_TIPO'] = "7,197,198";
                $report= $base->getReportObject("usuariostarifas.jrxml", $parametros,"xlsx");
                break;
            case 3:
                $parametros['PR_STR_TIPO'] = "5,6,7";
                $report= $base->getReportObject("usuariostarifas_contrib.jrxml", $parametros, "xlsx");
                break;
            case 4:
                $report= $base->getReportObject("usuariostarifas_subs.jrxml", $parametros, "xlsx");   
                break;
            case 5:
                $parametros['PR_INT_USUARIO'] = $base->idUsuario;
                $mes = $laFecha[1];
                $parametros['PR_INT_TRIM'] = ceil($mes/3) ;  
                $report= $base->getReportObject("Reporte_F1.jrxml", $parametros, "xlsx");   
                break;
            case 6:
                $parametros['PR_INT_USUARIO'] = $base->idUsuario;
                $mes = $laFecha[1];
                $parametros['PR_INT_TRIM'] = ceil($mes/3) ;  
                $report= $base->getReportObject("Reporte_Anexo_F1.jrxml", $parametros, "xlsx");   
                break;
        } 
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarContribucionResidencial")
     * @Method({"POST"})
     */
    public function generarContribucionResidencial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];    
        $opc=$content['opc'];             
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES'] = $laFecha[1];
        $parametros['PR_INT_ANO'] = $laFecha[0]; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        $parametros['PR_STR_PERIODO'] = str_pad($laFecha[1],2,"0",STR_PAD_LEFT)."-".$laFecha[0];
        if ($opc == 1 )
        {
            $parametros['PR_STR_TIPO'] = "5,6";
            $report= $base->getReportObject("usuariostarifas.jrxml", $parametros, "xlsx");
        } 
        elseif ($opc == 2 ) 
        {
            $parametros['PR_STR_TIPO'] = "5,6,7";
            $report= $base->getReportObject("usuariostarifas_contrib.jrxml", $parametros, "xlsx");
        }
        else {
             $report= $base->getReportObject("usuariostarifas_subs.jrxml", $parametros, "xlsx");   
        } 
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarExentosMes")
     * @Method({"POST"})
     */
    public function generarExentosMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $opc_r=$content['opc'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0]; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        if ($opc_r == 1 )
        {
            $report= $base->getReportObject("exentos.jrxml", $parametros,"xlsx");
        }
        else
        {
            $mes = $laFecha[1];
            $parametros['PR_INT_TRIM'] = ceil($mes/3) ;  
            $report= $base->getReportObject("exentos_tarifas.jrxml", $parametros, "xlsx");
        }
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarsubsidioMes")
     * @Method({"POST"})
     */
    public function generarsubsidioMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0]; 
        $report= $base->getReportObject("subsidio.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarFacongasExcel")
     * @Method({"POST"})
     */
    public function generarFacongasExcel(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$parametros['PR_INT_PERIODO']=$content['periodo'];
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0]; 
        $report= $base->getReportObject("FacongasGeneralExcel.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasGeneral.xlsx", true);
    }
    
    /**
     * @Route("/generarFacongasConsolidados")
     * @Method({"POST"})
     */
    public function generarFacongasConsolidados(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha=$content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_STR_PROYECTOS']="AND dsus.uni_municipio IN (1,5,3,6,7,8,9,11,12,4)";
        $parametros['PR_STR_PROYECTOS2']="AND dsus.uni_municipio IN (14,18)";  
        $parametros['PR_STR_PROYECTOS3']="";
        $parametros['PR_STR_TITULO']="MERCADO CENTRAL";
        $parametros['PR_STR_TITULO2']="FUENTE DE ORO-PUERTO LOPEZ";  
        $parametros['PR_STR_TITULO3']="GENERAL";  
        $report= $base->getReportObject("FacongasGeneralConsolidados.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasConsolidado.xlsx", true);
    }   
    
    /**
     * @Route("/generarFacongasUnico")
     * @Method({"POST"})
     */
    public function generarFacongasUnico(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha = $content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_STR_TOTAL']=" ";
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_TITULO']="TOTAL";
        $report= $base->getReportObject("FacongasUnico3.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        set_time_limit(3600);
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "FacongasIndustrial.xlsx", true);
    }
    
     /**
     * @Route("/duplicadoFacturaLocal")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:duplicadoFacturaLocal.html.twig") 
     */
     public function duplicadoFacturaLocal(){
        $base = $this->get("reportes.base");
        $empresa = $base->idEmpresa;
       $empleado = $base->idUsuario;
       $ideunidades = $base->utilModel->consultaPermisoUsuario($empresa, $empleado);
       if(empty($ideunidades)){
                $parametros['permisos']['ideunidad'] = 1217;
            }
        $parametros['permisos'] = $ideunidades;
       return array_merge($base->parametrosBasicos, $parametros);
    }
    
    
     /**
     * @Route("/generarDuplicadoLocal")
     * @Method({"POST"})
     */
    public function generarDuplicadoLocal(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_PCODIGO']= $content['idSuscripcion'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $idsuscripcion =$content['idSuscripcion'];
        $convenioModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);  
        $idConvenio = $convenioModel ->evaluarConvenio($idsuscripcion);
        //echo $idConvenio;
	  if($parametros['PR_INT_EMPRESA']==317){
            $parametros['PR_INT_EMPRESA']=322;
        }
        $nombre = $idConvenio[0]['homologado']=="2" ||$idConvenio[0]['homologado']=="1" ? 'factura_llanogas':'factura_llanogas2';
        
        $report= $base->getReportObject("$nombre.jrxml", $parametros,'pdf',false);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "factura_llanogas", true);
    }
    
    /**
     * @Route("/buscarFacturasPeriodo")
     * @Method({"POST"})
     * */
    public function buscarFacturasPeriodo(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $empresa = $base->idEmpresa;
        $empleado = $base->idUsuario;
        $requestContent = json_decode($request->getContent(), true);
        $anno = $requestContent['fechaConsulta'];
        $usuario=$requestContent['idSuscripcion'];
        $facturacionModel = new \Reportes\ReportesBundle\Models\FacturacionReportesModel($base->conexion);
        $resultado["columnas"] = $facturacionModel->consultarFacturasPeriodo($anno,$usuario, $empresa, $empleado);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
      /**
     * @Route("/generarDuplicadoLocalPeriodo")
     * @Method({"POST"})
     */
    public function generarDuplicadoLocalPeriodo(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $ide = $content['ide'];
        $parametros['PR_INT_PERIODO']=$ide;
        $parametros['PR_STR_PCODIGO']= $content['idSuscripcion'];
        $parametros['PR_INT_TIPO']= $content['idTipo'];
	$parametros['PR_INT_EMPRESA']=$base->idEmpresa;
         if($parametros['PR_INT_EMPRESA']==317){
            $parametros['PR_INT_EMPRESA']=322;
        }
        $idsuscripcion = str_replace(".","",$content['idSuscripcion']);
        
        if(!is_numeric($idsuscripcion)){
            return null;
        }
        
        $convenioModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);  
        $idConvenio = $convenioModel ->evaluarConvenio($idsuscripcion);
        //echo $idConvenio;
        
        /*if($idConvenio[0]['homologado']=="2" ||$idConvenio[0]['homologado']=="1"){
            $nombre = 'factura_llanogas';
        }else{
            $nombre = 'factura_llanogas2';
        }*/
        if($idConvenio[0]['homologado']=="2" ||$idConvenio[0]['homologado']=="1"){
            $nombre = 'factura_llanogas_formatofes';
        }else{
            $nombre = 'factura_sologas_formatofes';
        }
        $report= $base->getReportObject("$nombre.jrxml", $parametros);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "factura_llanogas", true);
    }
    
      /**
     * @Route("/generarDuplicadoVariasSuscripciones")
     * @Method({"POST"})
     */
    public function generarDuplicadoVariasSuscripciones(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $convenioModel=new \Reportes\ReportesBundle\Models\RecaudosReportesModel($base->conexion);  
        $convenioModel ->vaciarTablaDsusDuplicado( $base->idUsuario);
        $convenioModel ->getSuscripcionConvenioPeriodo($content['idSuscripciones'], $base->idUsuario);
        $parametros['PR_INT_USUARIO']= $base->idUsuario;
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        if($parametros['PR_INT_EMPRESA']==317){
            $parametros['PR_INT_EMPRESA']=322;
        }   
        $report= $base->getReportObject("Duplicado_Factura_Varias_Suscripciones.jrxml", $parametros);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "facturas", true);
    }
    
    
    
    /**
     * @Route("/consumoCero")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:consumoCero.html.twig") 
     */
     public function consumoCero(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    
    /**
     * @Route("/generarReporteConsumoCero")
     * @Method({"POST"})
     */
    public function generarReporteConsumoCero(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = "'".$content['fechaConsulta']."'"; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $report= $base->getReportObject("consumoCero.jrxml", $parametros, "xlsx", false);
        set_time_limit(3600);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    
    }
    
    
    /**
     * @Route("/generarReporteConsumoCeroMes")
     * @Method({"POST"})
     */
    public function generarReporteConsumoCeroMes(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = "'".$content['fechaConsulta']."'"; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $report= $base->getReportObject("consumoCeroMes.jrxml", $parametros, "xlsx", false);
        set_time_limit(3600);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    
    }
    
    /**
     * @Route("/generarReporteConsumoComite")
     * @Method({"POST"})
     */
    public function generarReporteConsumoComite(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA'] = "'".$content['fechaConsulta']."'"; 
        $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $report= $base->getReportObject("consumoComite.jrxml", $parametros, "csv", false);
        set_time_limit(3600);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    
    }
    
}
