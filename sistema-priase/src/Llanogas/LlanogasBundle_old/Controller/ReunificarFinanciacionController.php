<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use \Llanogas\LlanogasBundle\Delegado\ReunificarFinanciacionDelegado;

/**
 * Clase que controla la transacción de unificar varias financiaciones.
 */
class ReunificarFinanciacionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:ReunificarFinanciacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    // <editor-fold desc="Consulta de suscripciones">

    /**
     * Filtra las suscripciones que se quieren financiar
     * @return json con el listado de suscripciones
     * @throws MyException Error en los criterios de búsqueda.
     */
    public function filtrarSuscripcionesFinanciacionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suscripcionesSinAmortizaciones = array();
            $idSuscripcion = $request->get('idsuscripcion');
            $codigoAnterior = $request->get('codigoanterior');
            $documentoTercero = $request->get('documentotercero');
            if (empty($idSuscripcion)) {
                $idSuscripcion = -1;
            }
            if (empty($documentoTercero)) {
                $documentoTercero = -1;
            }
            if (empty($codigoAnterior)) {
                $codigoAnterior = -1;
            }

            $reunificarFinanciacion = new ReunificarFinanciacionDelegado($this, $sesion);
            $suscripciones = $reunificarFinanciacion->obtenerSuscripcionReunificar($idSuscripcion, $documentoTercero, $codigoAnterior);
            foreach ($suscripciones as $suscripcion) {
                $permitido = $reunificarFinanciacion->consultarReunificacionRealizadaPorSuscripcion($suscripcion['idsuscripcion']);
                //Se valida la cantidad de reunificaciones que tiene el usuario sea inferior al 
                //permitido
                if ($permitido < NUMERO_REUNIFICACIONESPERMITIDAS) {
                    $suscripcionesSinAmortizaciones[] = $suscripcion;
                }
            }
            $respuesta['mensaje'] = count($suscripciones) == count($suscripcionesSinAmortizaciones) ? 'No se encontraron resultados' : 'La suscripción no tiene permitido realizar más reunificaciones';
            $respuesta["codigoRespuesta"] = empty($suscripcionesSinAmortizaciones) ? 0 : 1;
            $respuesta["suscripciones"] = $suscripcionesSinAmortizaciones;
        } catch (\Exception $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la información de una suscripción.
     * @return type
     */
    public function consultarInformacionPorSuscripcionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $reunificarFinanciacion = new ReunificarFinanciacionDelegado($this, $sesion);
            $respuesta = $reunificarFinanciacion->obtenerInformacionSuscripcion($idsuscripcion);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la información de una suscripción.
     * @return type
     */
    public function ConsultarDocumentosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idtipodocumento = $request->get('idtipodocumento');
            $reunificarFinanciacion = new ReunificarFinanciacionDelegado($this, $sesion);
            $respuesta['documentos'] = $reunificarFinanciacion->obtenerDocumentos($idtipodocumento);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los tipos de documentos que tiene asociados 
     * la suscripción que se quiere reunificar
     * @return json lista de tipos de documentos 
     */
    public function ConsultarTipoDocumentosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $reunificarFinanciacion = new ReunificarFinanciacionDelegado($this, $sesion);
            $respuesta['tipodocumento'] = $reunificarFinanciacion->obtenerTiposDocumento($idsuscripcion);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

// </editor-fold> 

    /**
     *  Genera la unificación de las financiaciones seleccionadas
     * @return json con el resultado de la transacción.
     */
    public function grabarReunificacionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $financiacion = $request->get('financiacion');
            $reunificar = $request->get('reunificar');
            $parametros['idsuscripcion'] = $idSuscripcion;
            $parametros['reunificar'] = $reunificar;
            $parametros['financiacion'] = $financiacion;
            $reunificarFinanciacion = new ReunificarFinanciacionDelegado($this, $sesion);
            $idNuevaFinanciacion = $reunificarFinanciacion->crearReunificacion($parametros);
            $respuesta['nuevafinanciacion'] = $idNuevaFinanciacion;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se realizó correctamente la reunificación con identificador : ' . $idNuevaFinanciacion;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensajeError'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
