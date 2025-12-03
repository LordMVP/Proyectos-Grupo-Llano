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
 * Description of CobroRevisionQuinquenal : Reporte de facturacion
 *
 * @author AppFuture
 */
class AnticiposPendientesCurzarController extends Controller {

    /**
     * @Route("/anticipospendintescruzar")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:anticiposPendintesCruzar.html.twig") 
     */
    public function anticipospendintescruzar() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarAnticiposPendientesCruzar")
     * @Method({"POST"})
     */
    public function generarAnticiposPendientesCruzar(Request $requiest) {
        try {
            $base = $this->get('reportes.base');
            $datosInterfaz = json_decode($requiest->getContent(), true);
            $parametros['PR_STR_CONDICION'] = "";
            $parametros['PR_STR_FECHA_INICIO'] = $datosInterfaz['fechaInicio'];
            $parametros['PR_STR_FECHA_FIN'] = $datosInterfaz['fechaFin'];
            $parametros['PR_STR_TITULO_REPORTE'] = "ANTICIPOS PEDIENTES POR CRUZAR";
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;;
            if (isset($datosInterfaz['ciclo'])) {
                if (!empty($datosInterfaz['ciclo'])) {
                    $parametros['PR_STR_CONDICION'] = 'AND dire.cic_ideregistro in (' . $datosInterfaz['ciclo'] . ')';
                }
            }

            set_time_limit(3600);
            $reporte = $base->getReportObject('AnticiposPendientesCruzar.jrxml', $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($reporte);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
