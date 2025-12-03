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
 * Description of SuscripcionesRpCcController
 *
 * @author AppFuture
 */
class ValidacionRecaudosCajaController extends Controller {

    /**
     * @Route("/validacionrecaudoscaja")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:validacionRecaudosCaja.html.twig") 
     */
    public function validacionRecaudosCaja() {
        $base = $this->get("reportes.base");
        $parametros['municipios'] = $base->modeloGenerico->getMunicipiosPorPerfilAndPrograma($base->idUsuario, $base->idEmpresa, 161);
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarReporteValidacionRecaudosCaja")
     * @Method({"POST"})
     */
    public function generarReporteValidacionRecaudosCaja(Request $request) {
        $base = $this->get("reportes.base");
        $content = json_decode($request->getContent(), true);
        $params['PR_STR_SUCURSAL_RE1'] = '';
        $params['PR_STR_SUCURSAL_REC'] = '';
        $params['PR_STR_MEDIO_PAGO_RE1'] = '';
        $params['PR_STR_MEDIO_PAGO_REC'] = '';
        $params['PR_STR_DIA'] = $content['dia'];
        $params['PR_INT_CAJERO'] = $content['cajero'];
        $params['PR_STR_TITULO_REPORTE'] = "REPORTE VALIDACIÓN RECAUDOS CAJA";
        $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
        $params['PR_INT_EMPRESA'] = $base->idEmpresa;
        
        if (!empty($content['municipios'])) {
            $municipios = $content['municipios'];
            $params['PR_STR_SUCURSAL_RE1'] .= ' AND re1.uni_municipio in  (' . $municipios . ')  ';
            $params['PR_STR_SUCURSAL_REC'] .= ' AND rec.uni_municipio in  (' . $municipios . ')  ';
        }

        if (!empty($content['mediospagos'])) {
            $mediospagos = $content['mediospagos'];
            $params['PR_STR_MEDIO_PAGO_RE1'] .= ' AND re1.uni_medpago in  (' . $mediospagos . ')  ';
            $params['PR_STR_MEDIO_PAGO_REC'] .= ' AND rec.uni_medpago in  (' . $mediospagos . ')  ';
        }
        set_time_limit(3600);
        $report = $base->getReportObject('ValidacionRecaudosCaja.jrxml', $params, 'xlsx');
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
