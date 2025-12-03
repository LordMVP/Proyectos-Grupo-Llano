<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Component\HttpFoundation\Response;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use ZipArchive;

/**
 * Control para generar los créditos que se han facturado
 * @author AppFuture
 */
class ExtractoCreditosController extends Controller {

    /**
     * @Route("extracto_credito")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:extractoCreditos.html.twig")
     */
    public function ExtractoCreditos() {
        $base = $this->get("reportes.base");
        $parametros = array_merge($base->parametrosBasicos);
        return $parametros;
    }

    /**
     * @Route("reporte_extracto_creditos")
     * @Method({"POST"})
     */
    public function generarExtractoCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);

            $params['PR_STR_TITULO_REPORTE'] = "EXTRACTO CRÉDITO LIBRANZA N° " ;
            $params['PR_STR_TITULO_EMPRESA'] = "POTENZA INVERSIONES SAS" ;
            $params['PR_INT_EMPRESA'] =  $base->idEmpresa;
            $paramestros['fechacorte'] = "'".$info['fechacorte']."'";
            $paramestros['idempresa'] =  $base->idEmpresa ;
            $paramestros['ideusuario'] =  $base->idUsuario ;
            $params["PR_INT_USUARIO"] = $base->idUsuario ;
            $paramestros['idfinanciacion'] = NULL ; 
            $paramestros['idciclo'] = NULL ;
            set_time_limit(20000);            
           
            if (isset($info['idfinanciacion'])) {
                $paramestros['idfinanciacion'] = (integer) $info['idfinanciacion'];
            } else if (isset($info['idciclo'])) {
                $paramestros['idciclo'] = (integer) $info['idciclo'];        
            }          
                   
            $financicaionModel = new \Reportes\ReportesBundle\Models\FinanciacionReportesModel($base->conexion);
            $financiaciones = $financicaionModel->GenererarFinancionesReporte($paramestros);
            $idfin = 0 ;
            if ( count($financiaciones) == 1) 
            {
                foreach ($financiaciones as $financiacion) 
                {                    
                    $params['PR_INT_FINANCIACION'] = (integer)$financiacion['fin_ideregis'] ;
                    $report = $base->getReportObject("extracto_credito_V2.jrxml", $params, "pdf", true);
                    $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
                    $manager->executeReportBytes($report);
                    return JasperUtil::getJSONPathResponse($manager);                     
                }   
            }
            else if (count($financiaciones) > 1)
            {
                $nombrezip = RUTA_REPORTES_GRANDES.'ExtractoCredito_'.$base->idEmpresa .'.zip' ;
                $nombred = 'ExtractoCredito_'.$base->idEmpresa .'.zip' ;
                $zip = new ZipArchive();
                $res = $zip->open($nombrezip , ZipArchive::OVERWRITE);
		if ($res === TRUE) 
		{
                    $zip->close();   
                    unlink($nombrezip);		
		}  	
                $res = $zip->open($nombrezip , ZipArchive::CREATE);
                if ($res === TRUE) 
                {
                    foreach ($financiaciones as $financiacion) 
                    {
                        $idfin =  (integer)$financiacion['fin_ideregis'] ;
                        $params['PR_INT_FINANCIACION'] = (integer)$financiacion['fin_ideregis'] ;
                        $report = $base->getReportObject("extracto_credito_V2.jrxml", $params, "pdf", true, JASPER_REPORTS_JNDI_POTENZA);
                        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
                        $manager->executeReportBytes($report);
                        $nombre = "extracto_".$idfin.".pdf" ;
                        $zip->addFile (RUTA_REPORTES_GRANDES.$manager->reportPath, $nombre );
                    }   
                    $zip->close();                    
                    $obj = array ();
                    $obj['reportPath']= $nombrezip ;
                    $obj['size']= 10 ;
                    $obj['format']='zip' ;
                    $json = array("id" => $nombred ,"size"=> filesize( $nombrezip ) ,"format"=> "zip");
                    return new Response(json_encode($json), 200, array('Content-Type' => 'application/json'));
                }                
            }            
            else
            {
                $report = $base->getReportObject("extracto_credito_V2.jrxml", $params, "pdf", true, JASPER_REPORTS_JNDI_POTENZA);
                $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
                $manager->executeReportBytes($report);
                return JasperUtil::getJSONPathResponse($manager); 
            }

        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
