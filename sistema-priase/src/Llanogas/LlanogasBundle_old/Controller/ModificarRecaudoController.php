<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\ModificarRecaudoDelegado;
use Llanogas\LlanogasBundle\Delegado\AnticiposDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase que se encarga de modificar la fecha del recaudo
 * y el medio de pago de un recaudo
 */
class ModificarRecaudoController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros["listamediopago"] = $modificarRecaudoDelegado->getMediosPagos($sesion->get("idempresa"), $sesion->get("idusuario"));
        $lisParametros["listasucursales"] = $modificarRecaudoDelegado->getSucursales();
        $lisParametros["listaclases"] = $modificarRecaudoDelegado->getClasePago();
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:modificarRecaudo.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta la informacion de un recaudo que cumpla con los parametros del
     * filtro
     * @return json Resultado con la informacion del recaudo
     * @throws MyException
     */
    public function getRecaudosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            $fechaIni = $request->get("fechainicio");
            $fechaFin = $request->get("fechafin");
            $documento = $request->get("clasepago");
            $suscripcion = $request->get("suscripcion");
            $terDocumento = $request->get("cedula");
            $codigoAnterior = $request->get("codigoanterior");
            $idRecaudo = $request->get('idrecaudo');
            if (empty($municipio)) {
                throw new MyException("Error, el municipio es obligatorio", -1);
            }
            if (empty($fechaIni)) {
                $fechaIni = "";
            }
            if (empty($fechaFin)) {
                $fechaFin = "";
            }
            if (empty($documento)) {
                $documento = "";
            }
            if (empty($suscripcion)) {
                $suscripcion = "";
            }
            if (empty($terDocumento)) {
                $terDocumento = "";
            }
            if (empty($codigoAnterior)) {
                $codigoAnterior = "";
            }
            if (!empty($idRecaudo)) {
                if (!is_numeric($idRecaudo)) {
                    throw new MyException('El campo id recaudo debe ser numerico', -1);
                }
            }
            if (!empty($suscripcion)) {
                if (!is_numeric($suscripcion)) {
                    throw new MyException('El campo suscrición debe ser numerico', -1);
                }
            }
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            $recaudos = $modificarRecaudoDelegado->getRecaudos($municipio, $fechaIni, $fechaFin, $documento, $suscripcion, $terDocumento, $codigoAnterior, $idRecaudo);
            $respuesta["codigoRespuesta"] = (empty($recaudos) ? 0 : 1);
            $respuesta["listadocumentosvalidos"] = $modificarRecaudoDelegado->getDocumentosValidosXCambio($sesion->get("idempresa"), $sesion->get("idusuario"),$idRecaudo);
            $respuesta["periodos"] = $anticiposDelegado->getPeriodos(null,$recaudos[0]['idrecaudo']);
            $respuesta["datos"] = $recaudos;
            $respuesta["mensaje"] = (empty($recaudos)) ? "No se encontraron recaudos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las suscripcion , facturas y formas de pago que pertenecientes al recaudo
     * @return Resultado con la informacion de suscripciones y facturas del recaudo
     */
    public function getInformacionRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get("idrecaudo");
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            $informacionRecaudo["suscripciones"] = $modificarRecaudoDelegado->getSuscripcionRecaudo($idRecaudo);
            $informacionRecaudo["facturas"] = $modificarRecaudoDelegado->getFacturasRecaudo($idRecaudo);
            $informacionRecaudo["formaspago"] = $modificarRecaudoDelegado->getFormasPago($idRecaudo);
            $informacionRecaudo["distribucionRecaudo"] = $modificarRecaudoDelegado->getDistribucionRecaudo($idRecaudo);
            $respuesta["codigoRespuesta"] = (empty($informacionRecaudo) ? 0 : 1);
            $respuesta["datos"] = $informacionRecaudo;
            $respuesta["mensaje"] = (empty($informacionRecaudo)) ? "No se encontró información del recaudo" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Registra la modificacion de un recaudo
     * @return json Resultado con la confirmacion de la modificacion del recaudo
     */
    public function modificarRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get("idRecaudo");
            $idMedioPago = $request->get("idMedioPago");
            $idSucursal = $request->get("idSucursal");
            $fechaPago = $request->get("fechaPago");
            $formaspagos = $request->get("formaspago");
            $iddocumento = $request->get("idDocumento");
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            $filasRecaudo = $modificarRecaudoDelegado->actualizarLiquidacion($idRecaudo, $idMedioPago, $idSucursal, $fechaPago, $formaspagos,$iddocumento);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = "Se modifico el recaudo, filas afectadas: " . $filasRecaudo;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los municipios disponibles para el programa
     * @return json Resultado con la informacion del programa
     */
    public function getMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            $municipios = $modificarRecaudoDelegado->getMunicipiosAutocomplete($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * Routing /recaudos/obtener/tipos_documento/
     * Consulta los tipos de documento asociados a la suscripción
     * @return json con los tipos de documento
     * @throws MyException Error sí la suscripción no es un número ó si la consulta no trae datos.
     */
    public function consultarTiposDocumentoPorTipoUsoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('La suscripción debe ser un valor numérico', -1);
            }
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            $respuesta["tiposDocumento"] = $modificarRecaudoDelegado->obtenerTiposDocumentoPorTipoUso($idSuscripcion);
            $respuesta["periodos"] = $anticiposDelegado->getPeriodos($idSuscripcion);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        //Se construye el JSON para ser mostrado en la interfaz de usuario
        return Util::construyeRespuesta($respuesta);
    }
    
    public function setDistribucionRecaudoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idRecaudo = $request->get('idrecaudo');
            $idTipodocumento = $request->get('idTipoDoc');
            $idDocumento = $request->get('idDocumento');
            $idConcepto = $request->get('idConcepto');
            $idPeriodo = $request->get('idPeriodo');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('La suscripción debe ser un valor numérico', -1);
            }
            if (empty($idTipodocumento)) {
                throw new MyException('Seleccione el tipo de documento.', -1);
            }
            if (empty($idRecaudo)) {
                throw new MyException('Error, El id Recaudo no fue enviado', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["tiposDocumento"] = $modificarRecaudoDelegado->setDistribucionRecaudo($idSuscripcion,$idRecaudo,$idTipodocumento,$idDocumento,$idConcepto,$idPeriodo);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        //Se construye el JSON para ser mostrado en la interfaz de usuario
        return Util::construyeRespuesta($respuesta);
    }
    
    public function validaRecaudoSetAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $modificarRecaudoDelegado = new ModificarRecaudoDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idrecaudo');
            if (!is_numeric($idRecaudo)) {
                throw new MyException('El recaudo debe ser un valor numérico', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["fes"] = $modificarRecaudoDelegado->validaRecaudoSet($idRecaudo);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        //Se construye el JSON para ser mostrado en la interfaz de usuario
        return Util::construyeRespuesta($respuesta);
    }

}
