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
class CobroRevisionQuinquenalController extends Controller {

    /**
     * @Route("/cobrorevisionquinquenal")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:cobroRevisionQuinquenal.html.twig") 
     */
    public function cobroRevisionQuinquenal() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarCobroRevisionQuinquenal")
     * @Method({"POST"})
     */
    public function generarCobroRevisionQuinquenal(Request $requiest) {
        try {
            $base = $this->get('reportes.base');
	     $datosInterfaz = json_decode($requiest->getContent(), true);
            //$parametros['PR_STR_RAGO'] = " AND visitas.visitaqui_fecvis::DATE BETWEEN  '" . $datosInterfaz['fechaInicial'] . "'::DATE  AND '" . $datosInterfaz['fechaFinal'] . "'::DATE";
            //$parametros['PR_STR_TITULO_REPORTE'] = "COBROS DE REVISION QUINQUENAL";
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            $parametros['PR_STR_FECINI'] = "'".$datosInterfaz['fechaInicial']."'";
            $parametros['PR_STR_FECFIN'] = "'".$datosInterfaz['fechaFinal']."'";
            $parametros['PR_STR_CONDICION'] = '';            
	    if (!empty(isset($datosInterfaz['estado']))) {
                $parametros['PR_STR_CONDICION'] .= " AND dsus.dsus_estado = '" . $datosInterfaz['estado'] . "'";
            }
            if (!empty(isset($datosInterfaz['municipio']))) {
                $parametros['PR_STR_CONDICION'] .= " AND  dsus.uni_municipio in ( " . $datosInterfaz['municipio'] . ")";
            }
            set_time_limit(3600);
            $reporte = $base->getReportObject('CobroRevisionQuinquenal.jrxml', $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($reporte);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
