<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Llanogas\LlanogasBundle\Delegado\FinanciarVentasDelegado;
use \Llanogas\LlanogasBundle\Delegado\GenerarFinanciacionDelegado;

/**
 * Description of FinanciacionController
 *
 * @author hrey
 * 
 * modificación: Sergio Andrés Vargas 
 * fecha       : 29 / jul / 2015
 * descripcion :
 *          1.  Se ajusta la funcionalidad por cambios en las tablas.
 *          2.  Se incluye la estructura en el estándar de delegados.
 * 
 */
class GenerarFinanciacionController extends Controller {

    /**
     * Función que renderiza la página de generar financiación.
     * @return html.twig con la información de la página
     */
    public function indexAction() {
        $lisParametros = array();
        $sesion = Util::iniciarSesion($this);
        $lisParametros['fecha'] = date('Y-m-d');
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
        $lisParametros['parentescos'] = $financiarVentasDelegado->getParentescos();
        $lisParametros['cargos'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_TIPOCARGO);
        $lisParametros['profesiones'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_PROFESIONES);
        $lisParametros['tiposociedad'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_TIPOSOCIEDAD);
        $lisParametros['actividadeconomica'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_ACTIVIDADECONOMICA);
        $response = $this->render('LlanogasLlanogasBundle:Cartera:GenerarFinanciacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    //   <editor-fold desc="Suscripcion">  
    /**
     * Consulta las suscripciones por el idsuscripcion, codigo anterior y empresa
     * @return json con todas las suscripciones que se quiere generar una financiación.
     * @throws MyException Error al generar la financiación.
     */
    public function filtrarSuscripcionesFinanciacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idSuscripcion');
            $codigoAnterior = $request->get('codigoAnterior');
            if (!isset($idSuscripcion) && !isset($codigoAnterior)) {
                throw new MyException("Error, no hay parámetros de búsqueda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $respuesta = $generarFinanciacion->filtrarSuscripcionesFinanciacion($idSuscripcion, $codigoAnterior);
            $topefinanciacion = $generarFinanciacion->obtenerTopeFinanciacion();
            $respuesta["topefinanciacion"] = $topefinanciacion['topefinanciacion'];
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consulta los documentos de acuerdo al tipo de documento
     * @return json
     */
    public function filtrarDocumentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $idtiposdocumentos = $request->get('idtiposdocumentos');
            if (!isset($idsuscripcion) && !isset($idtiposdocumentos)) {
                throw new MyException("Error, no hay parámetros de búsqueda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $respuesta["documentos"] = $generarFinanciacion->consultarDocumentosFinanciacion($idsuscripcion, $idtiposdocumentos);
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consulta los tipos de documentos de acuerdo al segmento
     * @return json
     */
    public function filtrarTiposDocumentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idsuscripcion');
            $idsegmento = $request->get('idsegmento');

            if (!isset($idsuscripcion) && !isset($idsegmento)) {
                throw new MyException("Error, no hay par�metros de b�squeda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $respuesta["tiposdocumentos"] = $generarFinanciacion->consultarTiposDocumentosFinanciacion($idsuscripcion, $idsegmento);
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // <editor-fold desc="Ver Facturas">  

    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function consultarFacturasSuscripcionDocumentoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idsegmento = $request->get('idsegmento');
            $idDocumento = $request->get('iddocumento');
            $idtiposdocumentos = $request->get('idtiposdocumentos');
            $descartaConceptos = $request->get('descartaConceptos');
            $stringDescartaConceptos= null;
            if(!empty($descartaConceptos)){
                $stringDescartaConceptos = implode(",", $descartaConceptos);
            }
            if (!isset($idSuscripcion) || !isset($idDocumento)) {
                throw new MyException("Error, no hay parámetros de búsqueda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $facturas = $generarFinanciacion->consultarFacturasSuscripcionDocumento($idSuscripcion,$idsegmento, $idDocumento, $idtiposdocumentos,$stringDescartaConceptos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["facturas"] = $facturas;
        } catch (MyException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Verifica si todos los conceptos hacen base para la financiación.
     * @return Error al validar la financiación
     */
    public function validarConceptosFinanciacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $listaFacturas = $request->get('facturas');
            if (empty($listaFacturas)) {
                throw new MyException("Error, no hay facturar a financiar", -1);
            }
            $idsFacturas = implode(',', $listaFacturas);
            $idLiquidacion = $request->get('idLiquidacion');
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $listaConceptos = $financiacion->validarConceptosFinanciacion($idLiquidacion, $idsFacturas);
            $respuesta["codigoRespuesta"] = 1;
            if (!empty($listaConceptos)) {
                $respuesta['conceptos'] = $listaConceptos;
            }
        } catch (MyException $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['codigoRespuesta'] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las liquidaciones dependiendo del documento o tipo de documento
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function consultarLiquidacionesDocumentoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idtiposdocumentos = $request->get('idtiposdocumentos');
            if (!isset($idtiposdocumentos)) {
                throw new MyException("Debe elegir un tipo de documento");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $facturas = $generarFinanciacion->consultarLiquidaciones(null, $idtiposdocumentos);
            $respuesta["financiacion"] = $facturas;
            $respuesta['codigoRespuesta'] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la tasa de interes por la liquidación 
     * @return json con el interes de liquidacion.
     * @throws MyException Error al no encontrar interes
     */
    public function consultarInteresLiquidacionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idliquidacion = $request->get('idliquidacion');
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $interesLiquidacion = $generarFinanciacion->consultarInteresLiquidacion($idliquidacion);
            $interesIvaLiquidacion = $generarFinanciacion->consultarInteresIvaLiquidacion($idliquidacion);
            $respuesta["interes"] = $interesLiquidacion;
            $respuesta["interesiva"] = $interesIvaLiquidacion;
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los detalles de una factura que se quiere financiar
     * @return type
     * @throws MyException
     */
    public function consultarDetallesFacturaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, identificador de factura obligatorio', -1);
            }
            $respuesta['financiable'] = $financiacion->consultarDetallesConceptos($idFactura, 'S');
            $respuesta['nofinanciable'] = $financiacion->consultarDetallesConceptos($idFactura, 'N');
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Genera una nueva financiación.
     * @return json con la información de la generación de la financiación 
     * @throws MyException Error al generar la financiación.
     */
    public function insertarFinanciacionAction() {
        try {
            $request = $this->get('request');
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $financiacionArray['idsuscripcion'] = $request->get('idsuscripcion');
            $financiacionArray['idtipodocumento'] = $request->get('idtipodocumento');
            $financiacionArray['valorTotalFinanciar'] = $request->get('valortotalfinanciar');
            $financiacionArray['facturas'] = $request->get('facturas');
            $financiacionArray['idsolicitante'] = $request->get('idsolicitante');
            $financiacionArray['identidad'] = $request->get('identidad');
            $financiacionArray['numcuotas'] = $request->get('numerocuotas');
            $financiacionArray['idliquidacion'] = $request->get('idliquidacion');
            $financiacionArray['archivos'] = $request->get('archivos');
            $financiacionArray['valorfinanciable'] = $request->get('valorfinanciable');
            $financiacionArray['idparentesco'] = $request->get('idparentesco');
            $financiacionArray['personanatural'] = $request->get('personanatural');
            $financiacionArray['personajuridica'] = $request->get('personajuridica');
            $financiacionArray['documentosObligatorios'] = $request->get('documentosObligatorios');
            if (empty($financiacionArray['facturas'])) {
                throw new MyExecption('Deben existir facturas a financiar', -1);
            }
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $numFinanciacion = $financiacion->generarNuevaFinanciacion($financiacionArray);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $numFinanciacion;
            $respuesta['mensaje'] = 'Se generó correctamente la financiación con número: ' . $numFinanciacion;
        } catch (MyException $e) {
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['codigoRespuesta'] = $e->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

// </editor-fold>
    // <editor-fold desc="listado de bancos">  
    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function consultarBancosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $nombre = $request->get('nombre');
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $bancosresult = $financiacion->consultarBanco($nombre);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["bancos"] = $bancosresult;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

// </editor-fold>
    // <editor-fold desc="Liquidaciones Adjuntas">  
    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function subirFinanciacionAdjuntaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);

            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $documentosAdjuntos = $financiacion->subirArchivoAdjunto($request);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["uploadedFiles"] = $documentosAdjuntos;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function actualizarAdjuntoFinanciacionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $archivos = $request->get('archivos');
            $numerofinanciacion = $request->get('numerofinanciacion');
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $financiacion->actualizarAdjuntoFinanciacion($archivos, $numerofinanciacion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se guardaron correctamente los adjuntos de la financiación ' . $numerofinanciacion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function eliminarFinanciacionAdjuntaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idarchivo = $request->get('idarchivo');
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $documentosAdjuntos = $financiacion->eliminarArchivoAdjunto($idarchivo);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["documentosadjuntos"] = $documentosAdjuntos;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el número (nudo) que le corresponde a esa financiación
     * @return json 
     */
    public function generarNumeroPagareAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $idfinanciacion = $request->get('idfinanciacion');
            if (!is_numeric($idfinanciacion)) {
                throw new MyException('Debe seleccionar una financiación', -1);
            }
            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $numeroPagare = $financiacion->generarNumeroPagare($idfinanciacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["numeropagare"] = $numeroPagare;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la tasa de interes por la liquidación 
     * @return json con el interes de liquidacion.
     * @throws MyException Error al no encontrar interes
     */
    public function consultarInteresIvaLiquidacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idliquidacion = $request->get('idliquidacion');
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $interesLiquidacion = $generarFinanciacion->consultarInteresIvaLiquidacion($idliquidacion);
            $respuesta["interes"] = $interesLiquidacion;
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarDiasPeriodoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $dias = $generarFinanciacion->consultarDiasPeriodo($idSuscripcion);
            $respuesta["diasterminoperiodo"] = $dias;
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
     // <editor-fold desc="Ver Facturas">  

    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function consultarFacturasDescarteSuscripcionDocumentoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idDocumento = $request->get('iddocumento');
            $idtiposdocumentos = $request->get('idtiposdocumentos');
            if (!isset($idSuscripcion) || !isset($idDocumento)) {
                throw new MyException("Error, no hay parámetros de búsqueda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $facturas = $generarFinanciacion->consultarFacturasDescarteSuscripcionDocumento($idSuscripcion, $idDocumento, $idtiposdocumentos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["conceptos"] = $facturas;
        } catch (MyException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta restrición del monto, de acuerdo con la parametrización, validando si el monto esta dentro del limite 
     * @return json con restriccion encontrada
     * @throws MyException Error al no encontrar restricción o inputs vacios
     */
    public function consultarRestriccionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);
            $porcentaje= $request->get('porcentaje');
            $monto = $request->get('monto');
            $idSuscripcion = $request->get('idsuscripcion');
           
            if ((!isset($porcentaje) || !isset($monto) || !isset($idSuscripcion)) && $porcentaje === "" && $monto === "" && $idSuscripcion === "") {
                throw new MyException("Error, no hay parámetros de búsqueda");
            }
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            $response = $generarFinanciacion->consultarRestriccion($idSuscripcion);

            $valida = false;
            if (!empty($response)) {
                $restriccion = $response[0];
                $monto_bd = floatval($restriccion['luspu_limitemonto']);
                $porcentaje_bd= floatval($restriccion['luspu_limiteporcentaje']);
                if($monto_bd!=0 && $porcentaje_bd!=0){
                    if($monto_bd>=$monto && $monto>=1 && $porcentaje_bd>=$porcentaje && $porcentaje>=1){
                        $valida = true;
                    }
                }else{
                    if($monto_bd!=0){
                        if($monto_bd>=$monto && $monto>=1){
                            $valida = true;
                        }
                    }
                    if($porcentaje_bd!=0){
                        if($porcentaje_bd>=$porcentaje && $porcentaje>=1){
                            $valida = true;
                        }
                    }
                }
            }else{
                $restriccion['luspu_limitemonto'] = 0;
                $restriccion['luspu_limiteporcentaje'] = 0;
            }

	    $respuesta["codigoRespuesta"] = $valida?1:2;
        $respuesta["flag"] = $valida;
        $respuesta["restriccion"] = $restriccion;
            
        } catch (MyException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = "Se ha generado una excepción al consultar restricción, por favor comuniquese con el administrador".$ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
