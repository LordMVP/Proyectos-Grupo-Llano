<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\GenerarGestionCarteraDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Genera la gestión de la cartera a realizar durante un periodo y ciclo.
 *
 * @author hrey
 */
class GenerarGestionCarteraController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $generarGestionCarteraDelegado = new GenerarGestionCarteraDelegado($this, $sesion);
        $listaTiposSuscripciones = $generarGestionCarteraDelegado->obtenerTiposSuscripcion($idEmpresa);
        $listaDatos = $this->armarInfomacionComboTipoSuscripcion($listaTiposSuscripciones);
        $listaTiposDocumentos = $generarGestionCarteraDelegado->obtenerTipoDocumento();
        $listaDatosTiposDocumentos = $this->armarInfomacionComboTipoDocumentos($listaTiposDocumentos);
        $cicloActivos = $generarGestionCarteraDelegado->getCicloActivosPrograma();

        $lisParametros = array();
        $lisParametros['ciclos'] = $cicloActivos;
        $lisParametros["empresa"] = $sesion->get("empresa");
        $lisParametros["cmbTipoSuscripcion"] = Util::crearCombo("cmbTipoSuscripcion", $listaDatos);
        $lisParametros["cmbTipoDocumento"] = Util::crearCombo("cmbTipoDocumento", $listaDatosTiposDocumentos);
        $response = $this->render("LlanogasLlanogasBundle:Cartera:GenerarGestionCartera.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Consulta los documentos dependiendo por un tipo documento
     * @return json con los documentos
     */
    public function consultarDocumentosPorTipoDocumentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idTipoDocumento = $request->get("idtipodocumento");
            $generarGestionCarteraDelegado = new GenerarGestionCarteraDelegado($this, $sesion);
            $listaDocumentos = $generarGestionCarteraDelegado->obtenerDocumentosPorTipoDocumento($idTipoDocumento);
            $respuesta["codigoRespuesta"] = (empty($listaDocumentos) ? 0 : 1);
            $respuesta["datos"] = $listaDocumentos;
            $respuesta["mensaje"] = (empty($listaDocumentos)) ? "No hay documentos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consulta las suscripciones que se quiere realizar la gestion.
     * @return json con la información de las suscripciones.
     */
    public function consultarSuscripcionesAction() {
        try {
            set_time_limit(0);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $this->validarDatosRequeridos($request);
            $parametros = $this->getParametros($request);
            $parametros["idempresa"] = $sesion->get("idempresa");
            $generarGestionCarteraDelegado = new GenerarGestionCarteraDelegado($this, $sesion);
            $suscripciones = $generarGestionCarteraDelegado->obtenerSuscripcionesConSaldo($parametros);
            $respuesta["codigoRespuesta"] = (count($suscripciones) > 0) ? 1 : 0;
            $respuesta["datos"] = $suscripciones;
            $respuesta["mensaje"] = (empty($suscripciones)) ? "No se encontraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida la información antes de generar la gestión de la cartera.
     * @return type
     * @throws MyException
     */
    public function generarGestionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesStr = $request->get("suscripciones");
            //Arreglo que viene en string con todas las suscripciones que se van a generar cartera
            $suscripciones = json_decode($suscripcionesStr, true);
            if (count($suscripciones) == 0) {
                throw new MyException("Error, debe seleccionar una suscripción");
            }
            $generarGestionCarteraDelegado = new GenerarGestionCarteraDelegado($this, $sesion);
            $resultado = $generarGestionCarteraDelegado->generarGestionCartera($suscripciones);
            $respuesta["codigoRespuesta"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "Ocurrió un problema al generar gestión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene los párametros de búsqueda.
     * @return type
     */
    private function getParametros($request) {
        $idSuscripcion = $request->get("idsuscripcion");
        $idTipoSuscripcion = $request->get("idtiposuscripcion");
        $idTipoDocumento = $request->get("idtipodocumento");
        $idDocumento = $request->get("iddocumento");
        $morosidad = $request->get("morosidad");
        $morosidadDesde = $morosidad["desde"];
        $morosidadHasta = $morosidad["hasta"];
        $saldo = $request->get("saldo");
        $saldoDesde = $saldo["desde"];
        $saldoHasta = $saldo["hasta"];
        $offset = $request->get("offset");
        $idciclo = $request->get('idciclo');
        $idmunicipio = $request->get("idmunicipio");

        $parametros["idtiposuscripcion"] = $idTipoSuscripcion;
        $parametros["idtipodocumento"] = ($idTipoDocumento > 0 && $idTipoDocumento != null ) ? $idTipoDocumento : -1;
        $parametros["idsuscripcion"] = ($idSuscripcion > 0 || $idSuscripcion != null ) ? $idSuscripcion : -1;
        $parametros["iddocumento"] = ($idDocumento > 0 && $idDocumento != null ) ? $idDocumento : -1;
        $parametros["morosidaddesde"] = $morosidadDesde;
        $parametros["morosidadhasta"] = $morosidadHasta;
        $parametros["saldodesde"] = $saldoDesde;
        $parametros["saldohasta"] = $saldoHasta;
        $parametros["offset"] = $offset;
        $parametros["idciclo"] = $idciclo;
        $parametros["idmunicipio"] = $idmunicipio;
        return $parametros;
    }

    /**
     * Verifica los datos requeridos para la consulta de los documentos con saldo
     * @throws MyException Error en los criterios de búsqueda.
     */
    private function validarDatosRequeridos($request) {
        $morosidad = $request->get("morosidad");
        $morosidadDesde = $morosidad["desde"];
        $morosidadHasta = $morosidad["hasta"];
        if ($morosidadDesde > $morosidadHasta) {
            throw new MyException("Error, rango de morosidad inválido");
        }
        $saldo = $request->get("saldo");
        $saldoDesde = $saldo["desde"];
        $saldoHasta = $saldo["hasta"];
        if ($saldoDesde <= 0 || $saldoDesde >= $saldoHasta) {
            throw new MyException("Error, rango de saldos inválido");
        }
    }

    /**
     * Organiza la información para poder generar un combo html.
     * @param array $listaTiposSuscripciones Con el listado de tipos de suscripciones
     * @return array con la información organizada
     */
    private function armarInfomacionComboTipoSuscripcion($listaTiposSuscripciones) {
        $listaDatos = array();
        foreach ($listaTiposSuscripciones as $campos) {
            $listaDatos[$campos["idtiposuscripcion"]] = $campos["tiposuscripcion"];
        }
        return $listaDatos;
    }

    /**
     * Organiza la información para poder generar un combo html.
     * @param array $listaTiposDocumentos Con el listado de tipos de documentos
     * @return array con la información organizada
     */
    private function armarInfomacionComboTipoDocumentos($listaTiposDocumentos) {
        $listaDatos = array();
        $listaDatos["-1"] = "Seleccione";
        foreach ($listaTiposDocumentos as $campos) {
            $listaDatos[$campos["idtipodocumento"]] = $campos["tipodocumento"];
        }
        return $listaDatos;
    }

    /**
     * Consulta la informacion de los municipios para el contenido de un
     * autocomplete
     * @return json Resultado con informacion de los municipios
     * @throws MyException
     */
    public function getMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $suspensionesDelegado = new GenerarGestionCarteraDelegado($this, $sesion);
            $municipios = $suspensionesDelegado->getMunicipio($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
