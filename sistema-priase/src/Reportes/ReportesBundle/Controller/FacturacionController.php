<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class FacturacionController extends Controller {

    private $base;

    public function __construct() {
        
    }

    /**
     * @Route("/buscarPeriodosCiclo/{ciclo}")
     * @Method({"GET"})
     */
    public function buscarPeriodosCiclo($ciclo) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $periodos = $utilModel->consultarPeriodosCiclo($ciclo);
        if (count($periodos) > 0) {
            $respuesta['periodos'] = $periodos;
            $respuesta['codigoRespuesta'] = 1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        } else {
            $respuesta['codigoRespuesta'] = -1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        }
    }

    /**
     * @Route("/totalesFacturados")
     */
    public function relacionTotalesFacturadosAction() {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $ciclosActivos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $tiposInstalacion = $utilModel->consultarTiposInstalacion();
        $parametros['tiposInstalacion'] = $tiposInstalacion;
        $parametros['ciclosActivos'] = $ciclosActivos;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $this->render('ReportesBundle:Facturacion:relacionTotalesFacturados.html_1.twig', $parametros);
    }

    /**
     * @Route("/generarReporteFacturacion")
     * @Method({"POST"})
     */
    public function generarReporteFacturacionAction(Request $request) {
        $base = $this->get("reportes.base");
        $params['PRG_STR_USUARIO'] = $base->usuario;
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $datosCiclo = $utilModel->consultarCicloPrograma(84);
        $content = json_decode($request->getContent(),true);
        $params['PR_INT_CICLO'] =$content['ciclo'];// $datosCiclo[0]['ciclo'];
        $params['PR_INT_CICLO_ANNO'] = $content['cicloAnno']; //$datosCiclo[0]['anno'];
        $params['PR_INT_PERIODO'] = $content['periodo']; //$datosCiclo[0]['periodo'];
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        $params['PR_STR_TITULO_REPORTE'] = "RELACION DE TOTALES FACTURADOS POR CONSUMO";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;

        $params = JasperUtil::parseParams($params);
        $report = $base->getReportObject("facturacion_consolidados_consumos_horizontal.jrxml",$params);
        $manager = new ReportManager();
        $manager->executeReport($report);
        //return JasperUtil::getPDFResponse($manager, "Facturacion.pdf");
        return JasperUtil::getJSONBase64Response($manager, "Consolidado facturacion.pdf", true);
    }

    /**
     * @Route("/obtenerCicloPeriodoActual")
     * @Method({"POST"})
     */
    public function obtenerCicloPeriodoActual() {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $datosCiclo = $utilModel->consultarCicloPrograma(84);
        if (count($datosCiclo) != 0) {
            $respuesta['info'] = $datosCiclo[0];
            $respuesta['codigoRespuesta'] = 1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        } else {
            $respuesta['info'] = null;
            $respuesta['codigoRespuesta'] = -1;
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        }
    }

    /**
     * @Route("/listadoEspecialSuscripcionesTomaLecturas")
     * @Method({"GET"})
     */
    public function listadoEmitirFacturaSuscriptor() {
        $base = $this->get("reportes.base");
        $ciclosActivos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $parametros = $base->parametrosBasicos;
        $parametros['ciclosActivos'] = $ciclosActivos;
        return $this->render('ReportesBundle:Facturacion:listadoEspecialSuscripcionesTomaLecturas.html.twig', $parametros);
    }

    /**
     * @Route("/generarReporteBatallonFac")
     * @Method({"POST"})
     */
    public function generarReporteBatallonFac(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_USUARIO'] = $base->usuario;
        $params['PR_STR_TITULO_REPORTE'] = "Listado para emitir lecturas";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_TERCERO'] = $content['tercero'];
        $params['PR_INT_MES'] = $content['mesPeriodo'];
        $params['PR_INT_ANNO'] = $content['annoPeriodo'];
        $condiciones = " 1=1 ";
        
        if($content['ciclo'] !=-1){
            $condiciones .= " AND dsus.cic_ideregistro = ".$content['ciclo'];
        }
        if($content['tipoUso']!=-1){
            $condiciones .= " AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        $params['PR_STR_CONDICIONES'] = $condiciones;
        
        $reportName = "";
        $reportNametTitle = "";
        switch($content['tipo']){
            case 1:$reportName="listado_emitir_lecturas.jrxml";
                    $reportNametTitle = "Listado para toma lecturas";
                    $params['PR_STR_TITULO_REPORTE'] = "LISTADO PARA TOMA DE LECTURAS";
                break;
            case 2:$reportName="listado_emitido_batallon.jrxml";
                $reportNametTitle = "Listado de facturacion";
                $params['PR_STR_TITULO_REPORTE'] = "FACTURACION DE LAS SUSCRIPCIONES";
                break;
            default:return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta(array(""));
        }
        
        $report = $base->getReportObject($reportName, $params);
        $manager = new ReportManager();
        $manager->executeReport($report);
        return JasperUtil::getJSONBase64Response($manager, $reportNametTitle, true);
    }

    /**
     * @Route("/maestroLecturas")
     * @Method({"GET"})
     */
    public function maestroLecturas() {
        $base = $this->get("reportes.base");
        $parametros = $base->parametrosBasicos;
        return $this->render('ReportesBundle:Facturacion:listadoMaestroLecturas.html.twig', $parametros);
    }

    /**
     * @Route("/generarMaestroLecturas")
     * @Method({"POST"})
     */
    public function generarMaestroLecturas(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parameters["PR_STR_TITULO_REPORTE"] = "NOVEDADES DE LECTURAS";
        
        $parameters["PR_INT_MES"] = $content['mes'];
        $parameters["PR_INT_ANNO"] = $content['anno'];
        $parameters["PR_STR_FECHA"] = "01-".str_pad($content['mes'],2,"0",STR_PAD_LEFT)."-".$content['anno'];
        $condiciones = " leca.lec_consumo ".$content['operador']." ".$content['consumo'];
        
        if($content['ciclo'] != -1){
            $condiciones .= " AND dsus.cic_ideregistro = ".$content['ciclo'];
        }        
        if ($content['novedad'] != -1) {
            $condiciones.=" AND dlec.uni_novlectura = ".$content['novedad'];
        }
        if ($content['tipoUso'] != -1) {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['proyecto'] != -1) {
            $condiciones.=" AND dsus.uni_municipio = ".$content['proyecto'];
        }
        
        if($content['pcodigos'] != null && $content['pcodigos'] != ''){
            $pcodigo = str_replace(chr(10), "", $content['pcodigos']);  
            $pcodigo = str_replace(chr(13), "", $pcodigo);
            $pcodigo = str_replace(" ", "", $pcodigo);
            $pcodigo = str_replace("\n", "", $pcodigo);  
            $pcodigo = str_replace(",", "','", $pcodigo);            
            $condiciones .= " AND dsus.dsus_pcodigo IN ('".$pcodigo."')";
        }
        
        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        $parameters['PR_INT_EMPRESA'] = $base->idEmpresa;
       
        set_time_limit(3600);
        $report = $base->getReportObject("novedades_lectura.jrxml", $parameters,"xlsx",true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

    /**
     * @Route("/facturacionIndustrialEmitida")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:facturacionIndustrial.html.twig") 
     */
    public function facturacionIndustrialEmitida() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarReporteFacturacionIndustrial")
     * @Method({"POST"})
     */
    public function generarReporteFacturacionIndustrial(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params["PR_INT_CICLO"]=$content['ciclo'];
        $params["PR_INT_PERIODO"]=$content['periodo'];
        $params["PR_STR_TITULO_REPORTE"]="FACTURACION INDUSTRIAL EMITIDA";
        $params["PR_STR_TITULO_EMPRESA"]=$base->empresaNombre;
        
        
        //$report = $base->getReportObject("facturacion_industrial_consolidado.jrxml", $params);
        //$manager = new ReportManager();
        //$manager->executeReport($report);
        //return JasperUtil::getJSONBase64Response($manager, "Facturacion industrial emitida", true);
        
        set_time_limit(3600);
        $report = $base->getReportObject("facturacion_industrial_consolidado.jrxml", $params);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Estado de cuenta.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    }

}
