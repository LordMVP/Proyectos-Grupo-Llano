<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\CarteraCastigadaDelegado;
use Llanogas\LlanogasBundle\Delegado\CarteraCastigadaGenericoDelegado;

/**
 * Permite generar la cartera castigada
 * /facturacion/proceso/cartera/castigada/
 * @author sergio vargas
 */
class ProcesoCarteraCastigadaController extends Controller {

    //put your code here
    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $carteraCastigada = new CarteraCastigadaDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['ciclos'] = $carteraCastigada->obtenerCiclosActivos();
        $response = $this->render('LlanogasLlanogasBundle:Cartera:CarteraCastigada.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function ObtenerEstadoCarteraCastigadaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $carteraCastigadaSuscripcion = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
            $respuesta['resumen'] = $carteraCastigadaSuscripcion->obtenerEstado($sesion->get('idempresa'));
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function ObtenerProcesoCarteraCastigadaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $carteraCastigadaSuscripcion = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
            $respuesta['estado'] = $carteraCastigadaSuscripcion->obtenerEjecucionActual($sesion->get('idempresa'));
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite procesar la cartera castigada
     * /facturacion/proceso/cartera/castigada/ejecutar/
     */
    public function ProcesarCarteraAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idciclo = $request->request->get('idciclo');
            if (empty($idciclo)) {
                throw new MyException("Error, el ciclo es obligatorio");
            }
            $carteraCastigada = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
            $respuesta = $carteraCastigada->lanzarProcesoSegundoPlano($idciclo, $this->container, $sesion->get('idempresa'), $sesion->get('idusuario'), $sesion->get('idacceso'));
            //Se espera 5 segundos mientras se lanza el proceso en segundo plano
            sleep(5);
            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = "Proceso iniciado con éxito";
        } catch (MyException $e) {
            $respuesta = array("codigoRespuesta" => $e->getCode(), "mensaje" => $e->getMessage());
        } catch (\Exception $e) {
            print_r($e);
        }
        return Util::construyeRespuesta($respuesta);
    }

}
