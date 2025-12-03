<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;

class SuspensionesNovedadesController extends Controller {

    /**
     * @Route("/reporteNovedadesSuspensiones")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:novedadesSuspensiones.html.twig") 
     */
    public function reporteNovedadesSuspensiones() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/reporteRendimientoSuspensiones")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:rendimientoSuspensiones.html.twig") 
     */
    public function reporteRendimientoSuspensiones() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarNovedadesSuspensiones")
     * @Method({"POST"})
     */
    public function generarNovedadesSuspensiones(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parameters["PR_STR_TITULO_REPORTE"] = "NOVEDADES DE SUSPENSIONES";
        $parameters["PR_STR_FECHA_INICIAL"] = $content['fechaInicial'];
        $parameters["PR_STR_FECHA_FINAL"] = $content['fechaFinal'];
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $condiciones = "";
        if ($content['tipoSuspension'] != -1) {
            $condiciones.=" AND ssp.uni_tipsuspen = ".$content['tipoSuspension'];
        }
        if ($content['tipoUso'] != -1) {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['novedad'] != -1) {
            $condiciones.=" AND ssp.uni_novsuspen = ".$content['novedad'];
        }
        if ($content['motivo'] != -1 && $content['motivo'][0] != '-1') {
            $motivosuspension= implode(",", $content['motivo']);
            $condiciones.=" AND  ssp.uni_motsuspen in (".$motivosuspension.")";
        }

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        set_time_limit(3600);
        $report = $base->getReportObject("novedades_suspension.jrxml", $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generarNovedadesReconexiones")
     * @Method({"POST"})
     */
    public function generarNovedadesReconexiones(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $parameters["PR_STR_TITULO_REPORTE"] = "NOVEDADES DE RECONEXIONES";
        $parameters["PR_STR_FECHA_INICIAL"] = $content['fechaInicial'];
        $parameters["PR_STR_FECHA_FINAL"] = $content['fechaFinal'];
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $condiciones = "";
        if ($content['tipoUso'] != -1) {
            $condiciones.=" AND dsus.uni_tipusosuscr = ".$content['tipoUso'];
        }
        if ($content['novedad'] != -1) {
            $condiciones.=" AND rco.uni_novreconex = ".$content['novedad'];
        }
         if ($content['motivo'] != -1 && $content['motivo'][0] != '-1') {
            $motivosuspension= implode(",", $content['motivo']);
            $condiciones.=" AND rco.uni_motreconex in (".$motivosuspension.")";
        }

        $parameters["PR_STR_CONDICIONES"] = $condiciones;
        set_time_limit(3600);
        $report = $base->getReportObject("novedades_reconexion.jrxml", $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/verResumenDiario")
     * @Method({"POST"})
     */
    public function verResumenDiario(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $empresa = $base->idEmpresa;
        $fecha = $content["fechaConsulta"];
                
        $suspensionModel = new \Reportes\ReportesBundle\Models\SuspensionesReportesModel($base->conexion);
        $resultado['resumen'] = $suspensionModel->consultarResumenDiario($empresa, $fecha);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    
    /**
     * @Route("/verDetalleDiario")
     * @Method({"POST"})
     */
    public function verDetalleDiario(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $empresa = $base->idEmpresa;
        $fecha = $content["fechaConsulta"];
        $ure   = $content["ure"];
                
        $suspensionModel = new \Reportes\ReportesBundle\Models\SuspensionesReportesModel($base->conexion);
        $resultado['detalle'] = $suspensionModel->consultarDetalleDiario($empresa, $fecha, $ure);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    
    /**
     * @Route("/generarReporteResumen")
     * @Method({"POST"})
     */
    public function generarReporteResumen(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $parameters['PR_STR_TITULO_EMPRESA']=$base->empresaNombre;
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $parameters["PR_STR_FECHA"] = $content['fechaConsulta'];
        
        set_time_limit(3600);
        $report = $base->getReportObject("resumen_rendimientos_ssp_rco.jrxml", $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
    /**
     * @Route("/generarReporteDetalle")
     * @Method({"POST"})
     */
    public function generarReporteDetalle(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        
        $parameters['PR_STR_TITULO_EMPRESA']=$base->empresaNombre;
        $parameters['PR_INT_EMPRESA']=$base->idEmpresa;
        $parameters["PR_STR_FECHA"] = $content['fechaConsulta'];
        $parameters["PR_INT_URE"] = $content['ure'];
        
        set_time_limit(3600);
        $report = $base->getReportObject("detalle_rendimientos_ssp_rco.jrxml", $parameters,"xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
