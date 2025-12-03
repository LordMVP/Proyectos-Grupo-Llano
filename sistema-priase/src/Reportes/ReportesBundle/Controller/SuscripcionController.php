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
 * Description of SuscripcionController
 *
 * @author AppFuture
 */
class SuscripcionController extends Controller {

    /**
     * @Route("/suscripcionEstado")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:suscripcionEstado.html.twig") 
     */
    public function suscripcion() {
        $base = $this->get("reportes.base");
        $municipios = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $parametros['municipios'] = $municipios;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("/generarReporteSuscipcionEstado")
     * @Method({"POST"})
     */
    public function generarReporteSuscipcionEstado(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $content = json_decode($request->getContent(), true);
            //        $params['PR_STR_FECHA_INICIO'] = $content['fechaInicio'];
            //        $params['PR_STR_FECHA_FIN'] = $content['fechaFin'];
            $params['PR_STR_TITULO_REPORTE'] = "SUSCRIPCIÓN POR ESTADO";
            $params['PR_STR_TITULO_EMPRESA'] = $base->empresaNombre;
            $params['PR_STR_CONDICION'] = ' AND dsus.emp_ideregistro = ' . $base->idEmpresa;
            if (!empty($content['municipios'])) {
                $municipios = $content['municipios'];
                $params['PR_STR_CONDICION'] .= ' AND proyectos.proyecto_ideregistro in (' . $municipios . ')  ';
            }
            set_time_limit(3600);
            $report = $base->getReportObject('SuscripcionEstado.jrxml', $params, 'csv');
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
