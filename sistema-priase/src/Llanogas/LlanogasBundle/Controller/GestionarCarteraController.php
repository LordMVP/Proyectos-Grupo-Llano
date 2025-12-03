<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\GestionCarteraDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Realiza la gestión de la cartera
 * @author mebonilla
 */
class GestionarCarteraController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");

        $listaEstados = array("A" => "Activo", "C" => "Cerrado");
        $lisParametros["cmbEstado"] = Util::crearCombo("cmbEstado", $listaEstados);

        $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
        $etapas = $gestionarDelegado->obtenerListaEtapas();
        $lisParametros["etapas"] = $etapas;

        $response = $this->render("LlanogasLlanogasBundle:Cartera:GestionarCartera.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Buscar una suscripción por documento( cedula del cliente), idsuscripcion o codigoanterior
     * @return json con la información de las suscripciones.
     */
    public function buscarSuscripcionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $documento = $request->get("documento");
            $codigoAnterior = $request->get("codigoanterior");
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $suscripciones = $gestionarDelegado->obtenerFiltroSuscripcionesGestion($idSuscripcion, $documento, $codigoAnterior);
            $respuesta["codigoRespuesta"] = empty($suscripciones) ? 0 : 1;
            $respuesta["mensajeError"] = empty($suscripciones) ? "No se encontraron suscripciones" : "Se encontraron " . count($suscripciones) . " suscripciones";
            $respuesta["datos"] = $suscripciones;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta de las facturas por suscripción.
     * @return json con la información de las facturas asociadas a un suscripción
     * @throws MyException Si la suscripcón no lelga.
     */
    public function consultarFacturasPorSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $idSeguimiento = $request->get("idseguimiento");
            if (empty($idSuscripcion)) {
                throw new MyException("Error, la suscripción es obligatoria");
            }
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $facturas = $gestionarDelegado->obtenerFacturasPorSuscripcion($idSuscripcion,$idSeguimiento);
            $respuesta["codigoRespuesta"] = (empty($facturas) ? 0 : 1);
            $respuesta["datos"] = $facturas;
            $respuesta["mensaje"] = (empty($facturas)) ? "No se encontraron facturas" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los tipos de documentos asignados a una suscripción.
     * @return json con la infromación de los tipos de documentos
     * @throws MyException Error en el idsuscripción sino es correcto
     */
    public function consultarTipoDocumentosPorSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            if (empty($idSuscripcion) || !is_numeric($idSuscripcion)) {
                throw new MyException("Error, la suscripción es obligatoria");
            }
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $tipoDocumentos = $gestionarDelegado->obtenerTiposDocumentosPorSuscripcion($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($tipoDocumentos) ? 0 : 1);
            $respuesta["datos"] = $tipoDocumentos;
            $respuesta["mensaje"] = (empty($tipoDocumentos)) ? "No se encontraron tipos de documento" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta documentos por suscripción y tipo de documento
     * @return json con los documentos encontrados.
     * @throws MyException Error en la suscripción.
     */
    public function consultarDocumentosPorSuscripcionyTipoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $idTipoDocumento = $request->get("idtipodocumento");
            if (empty($idSuscripcion) || !is_numeric($idSuscripcion)) {
                throw new MyException("Error, la suscripción es obligatoria");
            }
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $documentos = $gestionarDelegado->obtenerDocumentosPorSuscripcionTipoDocumento($idSuscripcion, $idTipoDocumento);
            $respuesta["codigoRespuesta"] = (empty($documentos) ? 0 : 1);
            $respuesta["datos"] = $documentos;
            $respuesta["mensaje"] = (empty($documentos)) ? "No se encontraron documentos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la siguente ó anterior gestión
     * @return json con la información de la gestión que se encontró.
     */
    public function consultarSiguienteAnteriorAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idGestionActual = $request->get("idGestionActual");
            $op = $request->get("opcion");
            $opcion = ($op == "0") ? false : true;
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $suscripciones = $gestionarDelegado->obtenerSuscripcionSiguienteAnterior($idGestionActual, $opcion);
            $respuesta["codigoRespuesta"] = (empty($suscripciones) ? 0 : 1);
            $respuesta["datos"] = $suscripciones;
            $respuesta["mensaje"] = (empty($suscripciones)) ? "No se encontraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la primera o última gestión a una suscripción.
     * @return json con la información de la gestión.
     */
    public function consultarPrimeroUltimoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $opcion = $request->get("opcion");
            $orden = ($opcion) ? "asc" : "desc";
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $suscripciones = $gestionarDelegado->obtenerSuscripcionPrimeroUltimo($orden);
            $respuesta["codigoRespuesta"] = (empty($suscripciones) ? 0 : 1);
            $respuesta["datos"] = $suscripciones;
            $respuesta["mensaje"] = (empty($suscripciones)) ? "No hay detalle de suscripción" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Guarda la gestión realizada a un suscriptor,suscripción o factura.
     * @return json con el resultado de la transacción.
     */
    public function grabarGestionarCarteraAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $parametros = $this->getParametrosGrabarGestion($request, $sesion);
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $resultado = $gestionarDelegado->guardarGestionCartera($parametros);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "Ocurrió un problema al registrar la gestión" : "Se ha registrado una nueva gestión";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene los parámetros para poder guardar la gestión.
     * @return array con los parámetros.
     */
    private function getParametrosGrabarGestion($request, $sesion) {
        $parametros["estado"] = $request->get("estado");
        $parametros["idgestion"] = $request->get("idgestion");
        $parametros["seguimientos"] = $request->get("seguimientos");
        $parametros["idsuscripcion"] = $request->get("idsuscripcion");
        $parametros["idempresa"] = $sesion->get("idEmpresa");
        return $parametros;
    }

    /**
     * Consulta el historico de la gestion.
     * @return json con la información del historico
     * @throws MyException Si el idgestion no es correcto.
     */
    public function consultarHistoricoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idGestion = $request->get("idgestion");
            if (!is_numeric($idGestion)) {
                throw new MyException("Error, identificador de la gestión obligatorio");
            }
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $resultado = $gestionarDelegado->obtenerHistorico($idGestion);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontraron históricos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite subir un archivo adjunto para la gestion
     * @return json Resultado con informacion del archivo adjunto
     */
    public function subirAdjuntoDetalleAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $listaArchivos = Util::subirAdjunto($request, $sesion->get("idusuario"), "gestioncartera");
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $adjuntosDetalle = $gestionarDelegado->setArchivoGestionDetalle($listaArchivos);
            $respuesta["codigoRespuesta"] = (empty($adjuntosDetalle) ? 0 : 1);
            $respuesta["datos"] = $adjuntosDetalle;
            $respuesta["mensaje"] = (empty($adjuntosDetalle)) ? "Ocurrió un problema al adjuntar el archivo" : "Se adjuntaron correctamente los archivos";
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion historica de un detalle de gestion de cartera
     * @return json informacion del historico del detalle de la gestion
     * @throws MyException
     */
    public function getDetalleHistoricoSeguimientoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idDetalleGestion = $request->get('iddetallegestion');
            if (!is_numeric($idDetalleGestion)) {
                throw new MyException("Error, identificador de la gestión obligatorio");
            }
            $gestionarDelegado = new GestionCarteraDelegado($this, $sesion);
            $resultado = $gestionarDelegado->obtenerDetalleHistoricoGestion($idDetalleGestion);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontraroon históricos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
