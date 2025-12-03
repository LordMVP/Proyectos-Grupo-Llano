<?php

namespace Reportes\ReportesBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class TarifasController extends Controller {

    
    public function __construct() {

    }   
    
     /**
     * @Route("/reporteTarifas")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:reporteTarifas.html.twig")
     */
     public function indexAction(){
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }
    
    /**
     * @Route("/generarTarifaValidar")
     * @Method({"POST"})
     */
    public function generarTarifaValidar(Request $request) {
        

            $base = $this->get("reportes.base");
            $content = json_decode($request->getContent(), true);
            $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
            $parametros['PR_STR_PERIODO']=$content['periodo'];
            $parametros['PR_STR_CONDICION']=" ";
            if($content['mercado']>0)
            {
                $parametros['PR_STR_CONDICION'] = " AND vper.varper_codmer= '".$content['mercado']."'";
                $parametros['PR_STR_MERCADO'] =$content['mercado'];
                
            }
            else
            {
                $parametros['PR_STR_MERCADO'] ="Todos los Mercados";
            }
            set_time_limit(3600);
            $report= $base->getReportObject("TarifasValidar.jrxml", $parametros, "xlsx");
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
         
    }
    

}
