<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\FinanciacionModel;
use Llanogas\LlanogasBundle\Delegado\GenerarDocumentoPagoDelegado;

/**
 * Clase controladora de generar un documento de pago.
 *
 * @author Sergio Vargas 
 * fecha:   11 / ago / 2015 
 */
class GenerarDocumentoPagoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:GenerarDocumentoPago.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function consultarSuscripcionesAction() {
        $respuesta["codigoRespuesta"] = 0;
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $documento = $request->get('documento');
            $codAnterior = $request->get('codAnterior');
            $idSuscripcion = $request->get('idSuscripcion');
            if (empty($documento) && empty($codAnterior) && empty($idSuscripcion)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            if ((!empty($documento) && !is_numeric($documento)) || (!empty($codAnterior) && !is_numeric($codAnterior)) || (!empty($idSuscripcion) && !is_numeric($idSuscripcion))) {
                throw new MyException("Los campos deben ser numéricos");
            }
            $documentoPago = new GenerarDocumentoPagoDelegado($this, $sesion);
            $suscripciones = $documentoPago->obtenerSuscripcionesFinanciables($documento, $codAnterior, $idSuscripcion);
            $parametros = $documentoPago->consultar_aplica_interes( $sesion->get('idempresa'));
            $respuesta["codigoRespuesta"] = empty($suscripciones) ? 0 : 1;
            $respuesta["suscripciones"] = $suscripciones;
            $respuesta["parametros"] = $parametros;
        } catch (MyException $exc) {
            $respuesta["mensajeError"] = $exc->getMessage();
            $respuesta["codigoRespuesta"] = $exc->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /* Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */

    public function obtenerConceptosFinanciacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idfinanciacion = $request->get('idfinanciacion');
            $documentoPago = new GenerarDocumentoPagoDelegado($this, $sesion);
            $conceptosFinanciables = $documentoPago->obtenerConceptosFinanciables($idfinanciacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["conceptos"] = $conceptosFinanciables;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Guarda y valida el documento de pago.
     * @return json con la información de la generación del documento de pago.
     * @throws MyException Error de regla de negocio.
     */
    public function guardarDocumentoPagoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $financiaciones = $request->get('financiaciones');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se generó correctamente el documento de pago';
            $documentoPago = new GenerarDocumentoPagoDelegado($this, $sesion);           
            $documentoPago->generarDocumentoPago($financiaciones);
        } catch (MyException $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

        /**
     * Genera los intereses para el valor que se va abonar.
     * @return json con la información de los intereses que se generaron.
     * @throws MyException Error de regla de negocio.
     */
    public function GenIntDocumentoPagoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $financiaciones = $request->get('financiaciones');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["valor_interes"] = 0 ; 
            $respuesta["valor_capital"] = 0 ; 
            $respuesta["mensaje"] = 'Se generó correctamente el interes para el capital';
            $documentoPago = new GenerarDocumentoPagoDelegado($this, $sesion);
            $parametros = $documentoPago->consultar_aplica_interes( $sesion->get('idempresa'));
            if ($parametros['abono_parcial'] =='si' or $parametros['int_abon_total'] == 'si')
            {
                $datos =  $documentoPago->generarIntCapitalPago($financiaciones);
               $respuesta["valor_interes"] = $datos['valor_interes'] ; 
               $respuesta["valor_capital"] = $datos['valor_capital'] ; 
            }
        } catch (MyException $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
    /**
     * Consulta la tabla de financiaciones  
     * @return json con la información de todas las financiaciones que tiene una suscripción.
     */
    public function consultarTablaFinanciacionAction() {
        $respuesta["codigoRespuesta"] = 1;
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get('idempresa');
            $idsuscripcion = $request->get('idSuscripcion');
            $documentoPago = new GenerarDocumentoPagoDelegado($this, $sesion);
            $tablaFinanciacion = $documentoPago->consultarTablaFinanciacion($idsuscripcion);
            $conexion = Util::getConexion($this);
            foreach ($tablaFinanciacion as &$financiacion) {
                $objModel = new FinanciacionModel($conexion);
                $financiacion['liquidaciones'] = $objModel->consultarLiquidacionFinanciacionModel($financiacion['idtipodocumento'], $idEmpresa);
            }
            
            $respuesta["tablaFinanciacion"] = $tablaFinanciacion;
        } catch (MyException $exc) {
            throw new MyException('Ocurrió un problema al buscar las financiaciones de la suscripción', -1);
            $respuesta["mensaje"] = $exc;
        }
        return Util::construyeRespuesta($respuesta);
    }

}
