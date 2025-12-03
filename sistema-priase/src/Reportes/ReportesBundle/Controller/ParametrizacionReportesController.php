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
use Reportes\ReportesBundle\JasperBridge\ReporteConsulta;
/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class ParametrizacionReportesController extends Controller {

    
    public function __construct() {

    }   
    
     /**
     * @Route("/parametrizacionReportes")
     * @Method({"GET"})
     * @Template("ReportesBundle:Admin:parametrizacionReportes.html.twig")
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
    
    /**
     * @Route("/insertarReporteUnidades")
     * @Method({"POST"})
     */
    public function insertarReporteUnidades(Request $request) {       

            $base = $this->get("reportes.base");
            $datos = json_decode($request->getContent(), true);
            $parametros['nombre'] = $datos['nombre'];
            $parametros['empresa'] = $datos['empresa'];
            $parametros['parametros'] = json_encode($datos['parametros']);
            $parametros['logo'] = $datos['logo'];
            $parametros['usuario'] = $base->idUsuario; 
            $parametros['tituloEmpresa'] = $datos['tituloEmpresa'];                                   
            $resultado = $base->utilModel->insertarReporteUnidades($parametros);
            //$resultado['resultado'] = $resultado;
            //return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
            $data = ['resultado' => $resultado];
            //return json_encode($data);
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta(json_encode($data));
         
    }
    
     /**
     * @Route("/editarReporteUnidades")
     * @Method({"POST"})
     */
    public function editarReporteUnidades(Request $request) {       

            $base = $this->get("reportes.base");
            $datos = json_decode($request->getContent(), true);
            $parametros['nombre'] = $datos['nombre'];
            $parametros['empresa'] = $datos['empresa'];
            $parametros['parametros'] = json_encode($datos['parametros']);
            $parametros['logo'] = $datos['logo'];
            $parametros['usuario'] = $base->idUsuario; 
            $parametros['tituloEmpresa'] = $datos['tituloEmpresa'];                                   
            $resultado = $base->utilModel->editarReporteUnidades($parametros);
            $data = ['resultado' => $resultado];
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta(json_encode($data));
         
    }
    
    /**
     * @Route("/valoresReporteJasper")
     * @Method({"POST"})
     */

    public function valoresReporteJasper(Request $request)
    {
        
            $base = $this->get("reportes.base");
            ///sacar clave
            $informacionUsuario = $base->getUserDetails(); 
            ///fin sacar clave
            $content = json_decode($request->getContent(), true);
            $parametros['nombreReporte']=JASPER_REPORTS_PATH.$content['nombre'].".jrxml";
            $parametros['jndi']=JASPER_REPORTS_JNDI;         
            $parametros['user']=$base->idUsuario;
            $parametros['password']=md5($informacionUsuario['usuario_pas']);
            $manager = new ReporteConsulta(WEB_SERVICE_JASPER_REPORT_CONTENT);
            $response=$manager->ejecutarConsulta($parametros);
            //return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta(json_encode($parametros));
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta(json_encode($response));
        
    }
}
