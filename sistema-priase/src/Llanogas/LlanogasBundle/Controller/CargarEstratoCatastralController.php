<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\CargarEstratoCatastralDelegado;
use Llanogas\LlanogasBundle\ValidacionException;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

class CargarEstratoCatastralController extends Controller {

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['opcion'] = 0;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:cargarEstratoCatastral.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
  
    public function cargarEstratoCatastralAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $resolucion = $request->get('resolucion');
            Util::validarPeticion($this);
            $cargarEstratoCatastralDelegado = new CargarEstratoCatastralDelegado($this, $sesion);
            $numeroRegistros = $cargarEstratoCatastralDelegado->cargarEstratoCatastral($request);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["errorlineas"] = $cargarEstratoCatastralDelegado->getRegitrosTemp_EstratoCatastral();
            $respuesta["mensaje"] = "Se procesó correctamente el archivo plano - Número de registros procesados " . $numeroRegistros;
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje']         = $ex->getMessage();
            $respuesta['errorlineas']     = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return $this->resultadoArchivo($respuesta);
    }

    private function resultadoArchivo(array $respuesta) {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['opcion'] = 1;
        $lisParametros['empresa'] = $sesion->get('empresa_nom'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['respuesta'] = $respuesta;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:cargarEstratoCatastral.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
    
    public function consultartempestratocatastralAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $resolucion = $request->get('resolucion');
            Util::validarPeticion($this);
            $cargarEstratoCatastralDelegado = new CargarEstratoCatastralDelegado($this, $sesion);
            $listaRegistros = $cargarEstratoCatastralDelegado->cargarEstratoCatastral($request);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = "Se procesó correctamente el archivo plano - Número de registros procesados " . $numeroRegistros;
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta['errorlineas'] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return $this->resultadoArchivo($respuesta);
    }
    
     public function consultarresumentempestratocatastralAction() {
        $base = $this->get("reportes.base");
        //$params['PRG_STR_USUARIO'] = $base->usuario;
        $params['PR_INT_EMPRESA'] = $base->empresa;
        $params = array();
        $params = JasperUtil::parseParams($params);
        $report = $base->getReportObject("reporte_catastralestrato.jrxml",$params,"xlsx",true);
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $manager->executeReportBytes($report);
        //return JasperUtil::getPDFResponse($manager, "Facturacion.pdf");
        return JasperUtil::getJSONPathResponse($manager);
    } 
    
}
