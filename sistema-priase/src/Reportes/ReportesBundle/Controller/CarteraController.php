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


class CarteraController extends Controller {

    public function __construct() {
        
    }
    
    /**
     * @Route("/deterioroCartera")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:deterioroCartera.html.twig") 
     */
     public function deterioroCartera(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;        
    }

    /**
     * @Route("/generarDeterioroCartera")
     * @Method({"POST"})
     */
    public function generarDeterioroCartera(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $fecha = $content['fechaConsulta1'];            
        $laFecha = explode ( "-", $fecha); 
        $parametros['PR_INT_MES']=$laFecha[1];
        $parametros['PR_INT_ANO']=$laFecha[0];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        
        set_time_limit(300);
        $report = $base->getReportObject("DeterioroCartera.jrxml", $parametros, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
        
    }    
    
    

    /**
     * @Route("/arqueoCaja")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:arqueoCaja.html.twig") 
     */
    public function arqueoCaja() {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $mediosPago = $utilModel->consultarMediosPagoCaja($base->idUsuario);
        $municipios=$utilModel->municipios_uspr_arqueo($base->idUsuario);
        $parametros['municipios'] = $municipios;
        $parametros['mediosPago'] = $mediosPago;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }
    
       /**
     * @Route("/interesMoraLiquidados")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:intereses_mora_liquidados.html.twig")
     */
    public function intereses_mora_liquidados() {
        $base = $this->get("reportes.base");
        $ciclos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros['ciclos'] = $ciclos;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/estadoCuenta")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:estadoCuenta.html.twig") 
     */
    public function estadoCuenta() {
        $base = $this->get("reportes.base");
        //$model = new RecaudosReportesModel($base->conexion);
        $resultados = null; //$model->buscarDevoluciones('2015-01-01', '2015-12-30', 1);        
        $parametros = array_merge($base->parametrosBasicos, ["recaudos" => $resultados]);
        return $parametros;
    }
    
    

    /**
     * @Route("/devolucionRecaudo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:devolucionRecaudo.html.twig") 
     */
    public function devolucionRecaudo() {
        $base = $this->get("reportes.base");
        //$model = new RecaudosReportesModel($base->conexion);
        $resultados = null; //$model->buscarDevoluciones('2015-01-01', '2015-12-30', 1);        
        $parametros = array_merge($base->parametrosBasicos, ["recaudos" => $resultados]);
        return $parametros;
    }

    /**
     * @Route("/generarReporteArqueoCaja")
     * @Method({"POST"})
     */
    public function generarReporteArqueoCaja(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_INT_MEDIO_PAGO'] = $content['medioPago'];
        $params['PR_INT_CODIGO_PROYECTO'] = $content['codigoProyecto'];
        $params['PR_STR_FECHA_CONSULTA'] = $content['fechaConsulta'];
        $params['PR_STR_TITULO_REPORTE'] = "ARQUEO DE CAJA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA']=$base->idEmpresa;
        //$params['PR_INT_CODIGO_CAJERO'] = $content['cajero'];
        $params['PR_INT_CAJERO'] = $content['idcajero'];
        //$params['PR_INT_CAJERO'] ='287';
       // if ($content['consolidado']) {
         //   $report = $base->getReportObject("arqueo_caja_cajero.jrxml", $params);
        //} else {
            $report = $base->getReportObject("arqueo_caja_cajero.jrxml", $params);
        //}
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Reporte Arqueo Caja", true);
    }
    
    /**
     * @Route("/generarReporteInteresBase")
     * @Method({"POST"})
     */
    public function generarReporteInteresBase(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_FECHA_CORTE'] = $content['fechaCorte'];
        $params['PR_STR_TITULO_REPORTE'] = "BASE PARA INTERES DE MORA A LIQUIDAR";
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        $nombre_reporte="base_int_mora.jrxml" ;
        
        if ($content['ciclo']!=-1 ) {
         
            $params['PR_STR_NOMCICLO'] = $content['nombreCiclo'];
            $params["PR_STR_CONDICIONES"]=" AND cicc.cic_ideregistro = ".$content['ciclo'];
            
        }else{
            
            $params["PR_STR_CONDICIONES"]=" ";
            $params['PR_STR_NOMCICLO'] = "TODOS LOS CICLOS" ;
        }
        
        if ($content['reporte']!= "1") {
            
            $params['PR_STR_TITULO_REPORTE'] = "INTERESES DE MORA LIQUIDADOS";
            $nombre_reporte="int_mora_liquidado.jrxml" ; 
        }        
        
        $report = $base->getReportObject($nombre_reporte, $params ,"xlsx"); 
       
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarReporteArqueoCaja2")
     * @Method({"POST"})
     */
    public function generarReporteArqueoCaja2(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_INT_MEDIO_PAGO'] = $content['medioPago'];
        $params['PR_INT_CODIGO_PROYECTO'] = $content['codigoProyecto'];
        $params['PR_STR_FECHA_CONSULTA'] = $content['fechaConsulta'];
        $params['PR_STR_TITULO_REPORTE'] = "ARQUEO DE CAJA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_CAJERO'] = $content['idcajero'];
        $params['PR_STR_NOMCAJERO'] = $content['nomcajero'];
        $params['PR_STR_CAR_CAJERO'] = $content['carcajero'];
        $params['PR_STR_PROYECTO_NOM'] = $content['nomproyecto'];
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        $report = $base->getReportObject("arqueo_caja_consolidado_v2.jrxml", $params);        
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Reporte Arqueo Caja",true);
    }

    /**
     * @Route("/buscarDevolucionesJson")
     * @Method({"POST"})
     */
    public function buscarDevolucionesJsonAction() {
        $base = $this->get("reportes.base");
        $model = new RecaudosReportesModel($base->conexion);
        $request = $this->getRequest();
        $datosBuscar = $request->getContent();
        $parameters = json_decode($datosBuscar, true);
        $fechaInicio = $parameters['fechaInicio'];
        $fechaFinal = $parameters['fechaFinal'];
        $idSuscripcion = $parameters['valorBusquedad'];
        $codigoAnterior = $parameters['valorBusquedad'];

        $resultados = $model->buscarDevoluciones($fechaInicio, $fechaFinal, $idSuscripcion, $codigoAnterior);
        if (count($resultados) > 0) {
            $respuesta['recaudos'] = $resultados;
            $respuesta['codigoRespuesta'] = 1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        } else {
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['recaudos'] = array();
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        }
    }

    /**
     * @Route("/obtenerInformacionRecaudoJson/{recaudo}")
     * @Method({"GET","POST"})
     */
    public function obtenerInformacionRecaudoJsonAction($recaudo) {
        $base = $this->get("reportes.base");
        try {
            $recaudoInfo = $base->modeloGenerico->getRecaudoInfo($recaudo);
        } catch (MyException $e) {
            $respuesta['codigoRespuesta'] = -1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        }
        $cifrado = base64_encode(md5($recaudoInfo['idrecaudo'] . '' . $recaudoInfo['valorreal'] . $recaudoInfo['fecha']));
        if (strlen($cifrado) > 32) {
            $cifrado = substr($cifrado, 0, 31);
        }
        $recaudoInfo['cifrado'] = $cifrado;
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['recaudoInfo'] = $recaudoInfo;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
    }

    /**
     * @Route("/generarReporteDevolucion/{recaudo}")
     * @Method({"POST"})
     */
    public function generarReporteDevolucion($recaudo) {
        $base = $this->get("reportes.base");
        //$params = JasperUtil::parseParams($request->request->all());
        $params['PR_STR_USUARIO'] = $base->usuario;
        $params['PR_INT_ID_RECAUDO'] = $recaudo;
        $params['PR_STR_CIFRADO'] = ""; //$cifrado;
        $params['PR_STR_TITULO_REPORTE'] = "DEVOLUCION DE RECAUDO";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        //$params = JasperUtil::parseParams($params);
        
        /*$report = array("jndi" => "java:/Poolllanogas", "format" => "pdf", 
            "reportName" => JASPER_REPORTS_PATH . "devolucion.jrxml", "parameters" => $params);
        $report['user'] = $base->idUsuario;
        $report['password'] = md5($base->getUserDetails()['usuario_pas']);*/
        
        $report = $base->getReportObject("devolucion.jrxml", $params, "pdf");
        
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Devolucion.pdf");
        return JasperUtil::getJSONBase64Response($manager, "Devolucion Recaudo.pdf", true);
    }

    /* Estado de cuenta */

    /**
     * @Route("/generarReporteEstadoCuenta")
     * @Method({"POST"})
     */
    public function generarReporteEstadoCuenta(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $formato = $content['formato'];
        
        if (is_int($content['codigoSuscripcion'])) {
            $params['PR_INT_ID_SUSCRIPCION'] = $content['codigoSuscripcion'];
            $params['PR_STR_CODIGO_ANTERIOR'] = $content['codigoSuscripcion'];
        } else {
            $params['PR_STR_CODIGO_ANTERIOR'] = $content['codigoSuscripcion'];
        }
        
        $params['PR_INT_ID_SUSCRIPCION'] = $content['codigoSuscripcion'];
        $params['PR_STR_FECHA_INICIO'] = $content['fechaInicio'];
        $params['PR_STR_FECHA_FINAL'] = $content['fechaFinal'];
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        $params['PR_STR_TITULO_REPORTE'] = "Informe de estado de cuenta";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $format = $content['format'];
        $report = $base->getReportObject("resumen_estado_cuenta_version_2.jrxml", $params, $format);

        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, "Resumen Estado de cuenta.".$format, true);
    }
    
    /**
     * @Route("/generarReporteEstadoCuentaXlsx")
     * @Method({"POST"})
     */
    public function generarReporteEstadoCuentaXlsx(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        //$formato = $content['formato'];
        if (is_int($content['codigoSuscripcion'])) {
            $params['PR_INT_ID_SUSCRIPCION'] = $content['codigoSuscripcion'];
            $params['PR_STR_CODIGO_ANTERIOR'] = $content['codigoSuscripcion'];
        } else {
            $params['PR_STR_CODIGO_ANTERIOR'] = $content['codigoSuscripcion'];
        }
        $params['PR_INT_ID_SUSCRIPCION'] = $content['codigoSuscripcion'];
        $params['PR_STR_FECHA_INICIO'] = $content['fechaInicio'];
        $params['PR_STR_FECHA_FINAL'] = $content['fechaFinal'];
        $params['PR_STR_TITULO_REPORTE'] = "Informe de estado de cuenta";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $report = $base->getReportObject("resumen_estado_cuenta_version_3.jrxml", $params,"xlsx");

        // $report = array("jndi" => "jdbc/llanogasdbu", "format" => $formato, "reportName" => JASPER_REPORTS_PATH . "estado_cuenta_suscripcion_v1.jrxml", "parameters" => $params);
        //$report['user'] = $base->idUsuario;
        //  $report['password'] = md5($base->getUserDetails()['usuario_pas']);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONBase64Response($manager, "Resumen Estado de cuenta.xlsx", true);
    }

    
    /**
     * Inicio modificacion Julian Poveda
     */
    
    /**
     * @Route("buscarDevoluciones")
     * @Method({"POST"})
     */
    public function buscarDevoluciones(\Symfony\Component\HttpFoundation\Request $request){
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $datoBusqueda   = $requestContent['valorBusqueda'];
        $fechaInicio    = $requestContent['fechaInicio'];
        $fechaFinal     = $requestContent['fechaFinal'];
        $empresa        = $base->idEmpresa;
        
        $carteraModel = new \Reportes\ReportesBundle\Models\CarteraReportesModel($base->conexion);
        $resultado["columnas"] = $carteraModel->buscarDevoluciones($datoBusqueda, $fechaInicio, $fechaFinal, $empresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);        
    }
}
