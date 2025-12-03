<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\CargarFactorCorreccionDelegado;
use Llanogas\LlanogasBundle\ValidacionException;

class CargarFactorCorreccionController extends Controller {

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['opcion'] = 0;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:cargarFactorCorreccion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    
    public function cargarFactorCorreccionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $cargueIndustrial = null;//$request->get('cargueIndustrial');
            Util::validarPeticion($this);         
            if(isset($_POST['checkIndustrial'])){
                $cargueIndustrial = 1;
            }
            $cargarFactorCorreccionDelegado = new CargarFactorCorreccionDelegado($this, $sesion);
            $numeroRegistros = $cargarFactorCorreccionDelegado->cargarFactorCorreccion($request, $cargueIndustrial);
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

    private function resultadoArchivo(array $respuesta) {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['opcion'] = 1;
        $lisParametros['empresa'] = $sesion->get('empresa_nom'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['respuesta'] = $respuesta;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:cargarFactorCorreccion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

}
