<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

class VentasController extends Controller
{
    
    /**
     *  @Route("/facturaVenta")
     *  @Template("ReportesBundle:Ventas:facturaVenta.html.twig") 
     *  @Method({"GET"})
     */
    public function facturaVenta(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
     /**
     *  @Route("/ordenServicio")
     *  @Template("ReportesBundle:Ventas:ordenServicio.html.twig") 
     *  @Method({"GET"})
     */
    public function ordenServicio(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     *  @Route("/ventasTramite")
     *  @Template("ReportesBundle:Ventas:ventasTramite.html.twig") 
     *  @Method({"GET"})
     */
    public function ventasTramite(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     *  @Route("/ventasLiquidacion")
     *  @Template("ReportesBundle:Ventas:ventasLiquidacion.html.twig") 
     *  @Method({"GET"})
     */
    public function ventasLiquidacion(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     *  @Route("/ministerioMinas")
     *  @Template("ReportesBundle:Ventas:ministerioMinas.html.twig") 
     *  @Method({"GET"})
     */
    public function ministerioMinas(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     *  @Route("/ordenTrabajo")
     *  @Template("ReportesBundle:Ventas:ordenTrabajo.html.twig") 
     *  @Method({"GET"})
     */
    public function ordenTrabajo(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     *  @Route("/vinculacionServicio")
     *  @Template("ReportesBundle:Ventas:vinculacionServicio.html.twig") 
     *  @Method({"GET"})
     */
    public function vinculacionServicio(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
    /**
     * @Route("/buscarVentasPorDocumento")
     * @Method({"POST"})
     * */    
    public function buscarVentasPorDocumento(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $empresa = $base->idEmpresa;
        $requestContent = json_decode($request->getContent(),true);
        $numeroDocumento = $requestContent['numeroDocumento'];
        $numeroVenta = $requestContent['numeroVenta'];
        $numeroSuscripcion=$requestContent['numeroSuscripcion'];
        
        
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $resultado["ventas"] = $ventasModel->buscarVentasPorDocumentoONumeroVenta($numeroDocumento,$numeroVenta,$numeroSuscripcion, $empresa);        
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
        
    }
    
    //LLAMADO A CONSULTA DE VERIFICACION DE CAMBIOS EN LA VENTA 
    /**
     * @Route("/existeCambiosVenta")
     * @Method({"POST"})
     * */    
    public function existeCambiosVenta(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroVenta = $requestContent["numeroVenta"];
        
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $resultado = $ventasModel->existeCambiosVenta($numeroVenta);        
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    
    /**
     * @Route("/generarFormatoFacturaDeVenta")
     * @Method({"POST"})
     * */
    public function generarFormatoFacturaDeVenta(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $ventasModelo = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $numeroVenta = $requestContent['numeroVenta'];
        $resultado=$ventasModelo->numerofactura($numeroVenta);
        $numeroFactura=$resultado[0]['factura'];
        $parametrosReporte['PR_INT_NUMERO_VENTA']=$numeroVenta;
        $parametrosReporte['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("factura_venta_v5.jrxml", $parametrosReporte);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Factura de venta ".$numeroFactura, true);
    }
    
    /**
     * @Route("/generarFormatoOrdenDeServicio")
     * @Method({"POST"})
     * */
    public function generarFormatoOrdenDeServicio(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroVenta = $requestContent['numeroVenta'];        
        $parametrosReporte['PR_INT_NUMERO_VENTA']=$numeroVenta;
        $parametrosReporte['PR_INT_SUSCRIPCION']=$numeroVenta;
        $parametrosReporte['PR_STR_DOCUMENTO']="'".$numeroVenta."'";
        $parametrosReporte['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("Orden_Servicio_Padre.jrxml", $parametrosReporte);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Orden de Servicio N-".$numeroVenta, true);
    }
    
    
    
    //METODO PARA LLAMAR EL REPORTE DE CAMBIOS DE UNA ORDEN DE TRABAJO
    /**
     * @Route("/generarFormatoCambios")
     * @Method({"POST"})
     * */
    public function generarFormatoCambios(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroVenta = $requestContent['numeroVenta'];        
        $parametrosReporte['PR_INT_NUMERO_VENTA']=$numeroVenta;
        $report= $base->getReportObject("orden_servicio_cambios_v1.jrxml", $parametrosReporte);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Modificaciones Orden de Servicio N-".$numeroVenta, true);
    }
    
    /**
     * @Route("/generarFormatoOrdenDeTrabajo")
     * @Method({"POST"})
     * */
    public function generarFormatoOrdenDeTrabajo(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroOrden = $requestContent['numeroOrden'];
        $parametrosReporte['PR_INT_NUMERO_ORDEN']=$numeroOrden;
        $parametrosReporte['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("orden_trabajo.jrxml", $parametrosReporte,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Orden de Trabajo N-".$numeroOrden.".xlsx", true);
    }
    
    /**
     * @Route("/generarVentasTramite")
     * @Method({"POST"})
     */
    public function generarVentasEnTramite(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        
        $fechaInicial = $requestContent['fechaInicial'];
        $fechaFinal = $requestContent['fechaFinal'];
        $estado = $requestContent['estado'];
        $municipio = $requestContent['municipio'];
        
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);        
        $resultados = $ventasModel->ventasEnTramite($fechaInicial,$fechaFinal,$estado,$municipio);
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }           
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("Ventas en tramite");
        $excelReport->agregarHoja($resultados, "Ventas en tramite");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }
    
    
    
    
    /**
     * @Route("/generarMinisterioMinas")
     * @Method({"POST"})
     */
    public function generarMinisterioMinas(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        
        $fechaInicial = $requestContent['fechaInicial'];
        $fechaFinal = $requestContent['fechaFinal'];
        $liquidacion = $requestContent['liquidacion'];
        
        
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);        
        $resultados = $ventasModel->ministerioMinas($fechaInicial,$fechaFinal,$liquidacion);
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }   
        
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("CX_800021272",false);
        $excelReport->agregarHoja($resultados, "CX_800021272");
        $res = $excelReport->construirRespuestaAjax("CSV");
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }
    
    /**
     * @Route("/generarVentasConvenio")
     * @Method({"POST"})
     */
    public function generarVentasConvenios(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        
        $fechaInicial = $requestContent['fechaInicial'];
        $fechaFinal = $requestContent['fechaFinal'];
        $estado = $requestContent['estado'];
        $municipio = $requestContent['municipio'];
        $liquidacion = $requestContent['liquidacion'];
        $empresa = $base->idEmpresa;
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);        
        $resultados = $ventasModel->ventasConvenios($fechaInicial,$fechaFinal,$estado,$municipio,$liquidacion,$empresa);
        if(count($resultados)==0){
            $res['noContent'] = true;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
        }   
        
        $excelReport = new \Reportes\ReportesBundle\ModelReport\ExcelReportsManager("Ventas por liquidacion");
        $excelReport->agregarHoja($resultados, "Ventas por liquidacion");
        $res = $excelReport->construirRespuestaAjax();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($res);
    }
    
    /**
     * @Route("/generarReporteVentastramites")
     * @Method({"POST"})
     */
    public function generarReporteVentastramites(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $estado =$content['estado'];
        $municipio =$content['municipio'];
        $condiciones="";
        if ($estado !== '-1') {
            
            $condiciones .= "AND ven.ven_estado ="."'".$content['estado']."'";
        }
        if ($municipio !== '-1') {
            
            $condiciones .= " AND dsus.uni_municipio =".$content['municipio'];
        }
        $parametros['PR_STR_CONDICION']=$condiciones;         
       
        $report= $base->getReportObject("ventas_tramites.jrxml", $parametros, "xlsx", false);
              
        set_time_limit(3600);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarReporteMinisterioMinas")
     * @Method({"POST"})
     */
    public function generarReporteMinisterioMinas(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
       $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ministerio_minas.jrxml", $parametros,"csv");
        $manager = new ReportManager();
        $manager->executeReport($report);
        
        return JasperUtil::getJSONBase64Response($manager, "CX_800021272.csv", true);
    }
    
     /**
     * @Route("/generarReporteMinisterioMinascsv")
     * @Method({"POST"})
     */
    public function generarReporteMinisterioMinascsv(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("ministerio_minas.jrxml", $parametros,"csv");
        $manager = new ReportManager();
        $manager->executeReport($report);
        
        return JasperUtil::getJSONBase64Response($manager, "CX_800021272.csv", true);
    }
    
    /**
     *  @Route("/ventasConstructoras")
     *  @Template("ReportesBundle:Ventas:ventasConstructoras.html.twig") 
     *  @Method({"GET"})
     */
    public function ventasConstructoras(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
     /**
     * @Route("/generarReporteConstructora")
     * @Method({"POST"})
     * */
    public function generarReporteConstructora(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroOrden = $requestContent['numeroOrden'];
        $parametrosReporte['PR_INT_IDE']=$numeroOrden;
        $parametrosReporte['PR_INT_EMPRESA']=$base->idEmpresa;
        $report= $base->getReportObject("Constructora.jrxml", $parametrosReporte);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Amortizacion N-".$numeroOrden, true);
    }
    
    /**
     * @Route("/generarReporteConstructoraDetalle")
     * @Method({"POST"})
     * */
    public function generarReporteConstructoraDetalle(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroOrden = $requestContent['numeroOrden'];
        $parametrosReporte['PR_INT_IDE']=$numeroOrden;
        $parametrosReporte['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametrosReporte['PR_STR_USUARIO']=$base->usuario;
        $report= $base->getReportObject("Constructora_detalle.jrxml", $parametrosReporte,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Amortizacion_Detalle N-".$numeroOrden.".xlsx", true);
    }
    
    /**
     *  @Route("/listaVentasDiaBancos")
     *  @Template("ReportesBundle:Ventas:listaVentasDiaBancos.html.twig") 
     *  @Method({"GET"})
     */
    public function listaVentasDiaBancos(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    
     /**
     * @Route("/generarReporteVentasDias")
     * @Method({"POST"})
     * */
         public function generarReporteVentasDias(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_USUARIO']=$base->usuario;
        $parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_FECHA1']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $condicion1=" ";
        $condicion2=" ";
        switch ($content['estado'])
        {
            case 1:
                $condicion1=" ";
                break;
            case 2:
                $condicion1="AND ven.ven_estado='A'";
                break;
            case 3:
                $condicion1="AND ven.ven_estado='P'";
                break;
            case 4:
                $condicion1="AND ven.ven_estado='F'";
                break;
            case 5:
                $condicion1="AND ven.ven_estado='E'";
                break;
        }
        switch ($content['facturado'])
        {
            case 1:
                $condicion2=" ";
                break;
            case 2:
                $condicion2=" AND ven.fac_ideregistro IS NOT NULL ";
                break;
            case 3:
                $condicion2=" AND ven.fac_ideregistro IS NULL ";
                break;
        }
        $parametros['PR_STR_CONDICION']=$condicion1.$condicion2;
        $report= $base->getReportObject("ventas_diario.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }
        
        /**
     * @Route("/generarReporteVentasBancos")
     * @Method({"POST"})
     * */
         public function generarReporteVentasBancos(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_USUARIO']=$base->usuario;
        $parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $parametros['PR_STR_FECHA1']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        $condicion1=" ";
        $condicion2=" ";        
        switch ($content['estado'])
        {
            case 1:
                $condicion1=" ";
                break;
            case 2:
                $condicion1="AND ven.ven_estado='A'";
                break;
            case 3:
                $condicion1="AND ven.ven_estado='P'";
                break;
            case 4:
                $condicion1="AND ven.ven_estado='F'";
                break;
            case 5:
                $condicion1="AND ven.ven_estado='E'";
                break;
        }
        switch ($content['facturado'])
        {
            case 1:
                $condicion2=" ";
                break;
            case 2:
                $condicion2=" AND ven.fac_ideregistro IS NOT NULL ";
                break;
            case 3:
                $condicion2=" AND ven.fac_ideregistro IS NULL ";
                break;
        }
        
        if($content['banco']==-1)
        {
         $parametros['PR_STR_CONDICIONGENERAL']=" ";   
        }
        if($content['banco']!=-1)
        {
         $parametros['PR_STR_CONDICIONGENERAL']="AND ter.ter_ideregistro=".$content['banco'];   
        }    
        $parametros['PR_STR_CONDICION']=$condicion1.$condicion2;
        $report= $base->getReportObject("ventas_banco.jrxml", $parametros,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        }
        
        /**
     * @Route("/cambioTercero")
     * @Method({"GET"})
     * @Template("ReportesBundle:Ventas:cambioTercero.html.twig") 
     */
     public function cambioTercero(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }
    

    /**
     * @Route("/generarReporteCambioTercero")
     * @Method({"POST"})
     */
    public function generarReporteCambioTercero(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA1']=$content['fechaConsulta1'];
        $parametros['PR_STR_FECHA2']=$content['fechaConsulta2'];
        //$parametros['PR_STR_USUARIO']=$base->usuario;
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        //$parametros['PR_STR_CARGO']=$base->getUserDetails()['cargo_nom'];
        $report= $base->getReportObject("CambioPropietario.jrxml", $parametros,"xlsx");
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "CambioPropietario.xlsx", true);
    }
    
     /**
     * @Route("/buscarVentasPorDocumentoFacturaVenta")
     * @Method({"POST"})
     * */    
    public function buscarVentasPorDocumentoFacturaVenta(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(),true);
        $numeroDocumento = $requestContent['numeroDocumento'];
        $numeroVenta = $requestContent['numeroVenta'];
        $numeroSuscripcion=$requestContent['numeroSuscripcion'];
        
        
        $ventasModel = new \Reportes\ReportesBundle\Models\VentasReportesModel($base->conexion);
        $resultado["ventas"] = $ventasModel->buscarVentasPorDocumentoONFacturaVenta($numeroDocumento,$numeroVenta,$numeroSuscripcion);        
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
        
    }
    
    /**
     * @Route("/generarReporteFacturaElectronica")
     * @Method({"POST"})
     */
    public function generarReporteFacturaElectronica(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parametros['PR_STR_FECHA']=$content['fechaInicial'];
        $parametros['PR_STR_FECHA2']=$content['fechaFinal'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;     
       
        $report= $base->getReportObject("Validacion_FacturaElectronica.jrxml", $parametros, "xlsx", false);
              
        set_time_limit(3600);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
}
