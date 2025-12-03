<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Permite generar el reporte de consumo de gas del mercado central *
 * @author Appfuture
 */
class RangosConsumoController extends Controller {

    /**
     * @Route("/rango_consumo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:rangosConsumo.html.twig")
     */
    public function rangoConsumo() {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->consultarPeriodos($base->idEmpresa);
        $parametros['periodos'] = $periodos;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generar_reporte_rangos")
     * @Method({"POST"})
     */
    public function generarReporteRangos(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(), true);
        $params['PR_INT_ID_EMPRESA'] = $base->idEmpresa;
        $params['PR_INT_ID_MERCADO'] = $requestInfo['mercado'];
        $params['PR_STR_PERIODO_TITULO'] = str_pad($requestInfo['periodo'],2,"0",STR_PAD_LEFT)."-".$requestInfo['anno'];
        $params['PR_STR_PERIODO_INI'] = "'01-01-".$requestInfo['anno']."'";
        $params['PR_STR_PERIODO_FIN'] = "'01-".str_pad($requestInfo['periodo'],2,"0",STR_PAD_LEFT)."-".$requestInfo['anno']."'";
        
        set_time_limit(3600);

        $report = $base->getReportObject("rangosConsumo.jrxml", $params, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    /**
     * @Route("/generar_costos_ingresos")
     * @Method({"POST"})
     */
    public function generarCostosIngresos(Request $request) {
        $base = $this->get("reportes.base");
        $requestInfo = json_decode($request->getContent(), true);
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        $params['PR_INT_MERCADO'] = $requestInfo['mercado'];
        $params['PR_INT_ANIO'] = $requestInfo['anno'];
        $params['PR_INT_MES'] = $requestInfo['periodo'];
        
        set_time_limit(3600);

        $report = $base->getReportObject("CostosVsIngresos.jrxml", $params, "xlsx");
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }
    
    
    private function obtenerCondicionesRangos($idMercado){
        $idMercado = intval($idMercado);
        
        $condicionRangos = "CASE 
            WHEN dfac.dfac_vlrtotal <= 60 OR dfac.dfac_vlrtotal IS NULL THEN '1 0 - 60'
	    WHEN dfac.dfac_vlrtotal BETWEEN 61 AND 5000 THEN '2 61 - 5000' 
            WHEN dfac.dfac_vlrtotal BETWEEN 5001 AND 84999 THEN '3 5001 - 84999' 
            WHEN dfac.dfac_vlrtotal > 84999 THEN '4 Más de 85000' 
        END ";
        switch ($idMercado) {
            case 587://Acacias
            case 1703://San josé del guaviare
                $condicionRangos = "CASE 
                    WHEN dfac.dfac_vlrtotal <= 60 OR dfac.dfac_vlrtotal IS NULL THEN '1 0 - 60'
		    WHEN dfac.dfac_vlrtotal BETWEEN 61 AND 130 THEN '2 61 - 130'
		    WHEN dfac.dfac_vlrtotal BETWEEN 131 AND 9999999 THEN '3 131 - 999999'
		END";
                break;
            case 2737://Casanare sur
            case 976://Granada
                $condicionRangos = "CASE 
                    WHEN dfac.dfac_vlrtotal <= 60 OR dfac.dfac_vlrtotal IS NULL THEN '1 0 - 60'
                    WHEN dfac.dfac_vlrtotal BETWEEN 61 AND 150 THEN '2 61 - 150'
                    WHEN dfac.dfac_vlrtotal BETWEEN 151 AND 9999999 THEN '3 151 - 999999'
		END";
                break;
            case 771:	//Barranca de Upia
            case 872:	//Puerto Gaitan
            case 1072:	//Cabuyaro
            case 1183:	//Cubarral
            case 1288:	//El Castillo
            case 1392:	//El Dorado
            case 1455:	//Puerto Concordia
            case 1517:	//Puerto Lleras
            case 1579:	//Puerto Rico
            case 1641:	//San Carlos de Guaroa
            case 1774:	//San Juan de Arama
            case 1838:	//Puerto Fuente
            case 1838:	//Puerto Fuente
                $condicionRangos = "CASE 
                    WHEN dfac.dfac_vlrtotal <= 60 OR dfac.dfac_vlrtotal IS NULL THEN '1 0 - 60'
                    WHEN dfac.dfac_vlrtotal BETWEEN 61 AND 9999999 THEN '2 61 - 999999'
                END";
                break;
        }
        return $condicionRangos;
    } 
}