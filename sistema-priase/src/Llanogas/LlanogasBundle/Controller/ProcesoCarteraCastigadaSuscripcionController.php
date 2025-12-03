<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\CarteraCastigadaGenericoDelegado;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoCarteraCastigada;

/**
 * Permite generar la cartera castigada a una suscripción específica 
 * /facturacion/proceso/cartera/castigada/suscripción/
 * @author sergio vargas
 */
class ProcesoCarteraCastigadaSuscripcionController extends Controller {

    //put your code here
    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $carteraCastigadaSuscripcion = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['ciclos'] = $carteraCastigadaSuscripcion->obtenerCiclosActivos($sesion->get('idempresa'));
        $response = $this->render('LlanogasLlanogasBundle:Cartera:CarteraCastigadaSuscripcion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Permite verificar si el usuario que se está castigando se encuentra al día
     * @return json cantidad de facturas que están en 0 y de financiaciones que están en 0
     */
    public function ValidarUsuarioAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $carteraCastigadaSuscripcion = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
            $respuesta = $carteraCastigadaSuscripcion->validarUsuario($idsuscripcion);
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Busca una suscripción por el identificador o el código anterior de la
     * suscripción
     * @return json Devuelve la lista de suscripciones con toda la información
     * @throws MyException
     */
    public function FiltrarSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $codigoanterior = $request->get('codigoanterior');
            if (!isset($idsuscripcion) && !isset($codigoanterior)) {
                throw new MyException('Error en los parámetros de búsqueda.', -1);
            }

            if (!is_numeric($idsuscripcion) && !is_numeric($codigoanterior)) {
                throw new MyException('Error en los parámetros de búsqueda deben ser númericos.', -1);
            }

            $carteraCastigadaSuscripcion = new CarteraCastigadaGenericoDelegado($sesion->get('idacceso'));
            $respuesta ['suscripcion'] = $carteraCastigadaSuscripcion->filtrarSuscripciones($idsuscripcion, $codigoanterior, $sesion->get('idempresa'), $sesion->get('idusuario'));
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método que se encarga de castigar una suscripción 
     * sin importar si ya cumplió el tiempo para castigar
     * @return json el resultado del proceso
     */
    public function ProcesarAction() {
        try {

            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idCiclo = $request->get('idciclo');
            if (!isset($idSuscripcion) && !isset($idCiclo)) {
                throw new MyException('Error, el ciclo y la suscripción son obligatorios', -1);
            }
            $idAcceso = $sesion->get('idacceso');
            $castigarSuscripcion = new CarteraCastigadaGenericoDelegado($idAcceso);
            $parametros['idsuscripcion'] = $idSuscripcion;
            $parametros['idempresa'] = $sesion->get('idempresa');
            $parametros['idusuario'] = $sesion->get('idusuario');

            $suscripcionesSaldo = $castigarSuscripcion->validarSuscripcionesConSaldo($parametros['idempresa'], $idSuscripcion);
            if (!empty($suscripcionesSaldo)) {
                $resultado = $suscripcionesSaldo;
            } else {
                $proceso = new ProcesoCarteraCastigada($sesion->get('idempresa'), $sesion->get('idusuario'), $idCiclo, $idAcceso, 0);
                $proceso->procesarSuscripcion($idSuscripcion);
            }

            if (!empty($resultado)) {
                $respuesta ['carteracastigada'] = $resultado;
            }

            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = "Proceso terminado con éxito";
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
