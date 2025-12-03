<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\SuscriptoresDelegado;
use Llanogas\LlanogasBundle\MyException;

class SuscriptoresController extends Controller {

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $response = $this->render('LlanogasLlanogasBundle:Suscriptor:gestionarSuscriptor.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function BuscarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscriptoresDelegado = new SuscriptoresDelegado($this, $sesion);
            $opcion = $request->get('opcion');

            switch ($opcion) {
                case "TER" :
                    $cedula = $request->get('cedula');
                    $idTercero = $request->get('idtercero');
                    $terceros = $suscriptoresDelegado->getTerceros($cedula, $idTercero);
                    $respuesta['codigoRespuesta'] = empty($terceros) ? 0 : 1;
                    $respuesta['terceros'] = $terceros;
                    $respuesta['mensaje'] = 'Consulta Terceros realizada correctamente';
                    break;
                case "CON" :
                    $convenios = $respuesta['convenios'] = $suscriptoresDelegado->getConvenios();
                    $respuesta['codigoRespuesta'] = empty($convenios) ? 0 : 1;
                    $respuesta['convenios'] = $convenios;
                    $respuesta['mensaje'] = 'Consulta Convenios realizada correctamente';
                    break;
                case "SUS" :
                    $parametros['idsuscriptor'] = $request->get('idsuscriptor');
                    $estado = $request->get('estado');
                    $suscripciones = $suscriptoresDelegado->getSuscripciones($parametros, $estado);
                    $respuesta['codigoRespuesta'] = empty($suscripciones) ? 0 : 1;
                    $respuesta['suscripciones'] = $suscripciones;
                    $respuesta['mensaje'] = 'Consulta Suscripciones realizada correctamente';
                    break;
                case "DES" :
                    $parametros['tercero'] = $request->get('tercero');
                    $parametros['suscriptor'] = $request->get('suscriptor');
                    $parametros['tiposuscripcion'] = $request->get('tiposuscripcion');
                    $parametros['suscripcion'] = $request->get('suscripcion');
                    $conveniostrasladar = $suscriptoresDelegado->getConveniosTrasladar($parametros);
                    $respuesta['codigoRespuesta'] = empty($conveniostrasladar) ? 0 : 1;
                    $respuesta['conveniostrasladar'] = $conveniostrasladar;
                    $respuesta['mensaje'] = 'Consulta Convenios a trasladar realizada correctamente';
            }
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = ($e->getCode() < 0) ? $e->getCode() : -1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function grabarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscriptores = array();
            $trasladosuscripciones = array();
            Util::validarPeticion($this);
            $suscriptoresDelegado = new SuscriptoresDelegado($this, $sesion);
            $suscriptores = $request->get('nuevosuscriptor');
            if (!empty($suscriptores)) {
                $nuevoSuscriptor = $suscriptoresDelegado->grabarSuscriptor($suscriptores);
            }
            $trasladosuscripciones = $request->get('trasladarSuscripciones');
            if (!empty($trasladosuscripciones)) {
                $trasladosuscripciones = $suscriptoresDelegado->actualizarTraslados($trasladosuscripciones);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Grabación correcta de la información';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = ($e->getCode() < 0) ? $e->getCode() : -1;
            $respuesta['mensaje'] = $e->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

}
