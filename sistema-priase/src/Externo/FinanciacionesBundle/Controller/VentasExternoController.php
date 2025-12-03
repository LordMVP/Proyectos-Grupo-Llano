<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Controller;

use Externo\FinanciacionesBundle\Delegado\VentasExternoDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Clase encargada de realizar la liquidación de las ventas, consulta 
 * de conceptos, documento, tipo de documentos, organismos de control y 
 * firmas instaladoras 
 * 
 * El control va a ser invocado desde el servicio de financiaciones 
 *
 * @author god
 */
class VentasExternoController extends GenericoController {

    /**
     *
     * @var VentasExternoDelegado 
     */
    private $ventaExternoDelegado;

    /**
     * Inicializa los parámetros necesarios para 
     * el controlador de ventas
     */
    private function init() {
        $this->ventaExternoDelegado = new VentasExternoDelegado($this->conexion, $this->getSesion(), $this->parametros);
    }

    /**
     * Consulta las empresas prestadoras de servicio y 
     * las empresas autorizadas para financiar
     * @return json
     */
    public function consultarEmpresasAction() {
        try {
            $this->init();
            $resultado = $this->ventaExternoDelegado->consultarEmpresas();
            return $this->construyeRespuesta($resultado);
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

    /**
     * Consulta todos los funcionarios de 
     * una firma de instaladoras
     * @return json Lista de funcionarios
     */
    public function consultarFuncionarioFirmaAction() {
        try {
            $this->init();
            $listaFuncionarios = $this->ventaExternoDelegado->consultarFuncionarioFirma();
            return $this->construyeRespuesta($listaFuncionarios);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta todos los tipos de documentos de acuerdo al identificador de la suscripción
     * @return json Respuesta estándar de la petición 
     */
    public function consultarTiposDocumentosAction() {
        try {
            $this->init();
            $listaTiposDocumentos = $this->ventaExternoDelegado->consultarTiposDocumentos();
            return $this->construyeRespuesta($listaTiposDocumentos);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta todos los documentos dependiendo del tipo de documento
     * array $parametros (idtipodocumento) Identificador del tipo de documento
     * @return json Lista de documentos 
     */
    public function consultarDocumentosAction() {
        try {
            $this->init();
            $listaDocumentos = $this->ventaExternoDelegado->consultarDocumentos();
            return $this->construyeRespuesta($listaDocumentos);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Adjunta un archivo y lo coloca en la carpeta de archivos del sistema
     * @return json Con la información de los archivos 
     * cargados correctamente
     */
    public function adjuntarArchivoAction() {
        try {
            $this->init();
            $request = $this->getRequest();
            $sesion = $this->getSesion();
            $listaAdjuntos = Util::subirAdjunto($request, $sesion['idusuario'], 'FinanciacionExterna');
            $listaArchivos = $this->ventaExternoDelegado->adjuntarArchivos($listaAdjuntos);
            return $this->construyeRespuesta($listaArchivos);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta todas las liquidaciones 
     * @return json Respuesta con toda la información 
     */
    public function consultarLiquidacionesAction() {
        try {
            $this->init();
            $listaLiquidaciones = $this->ventaExternoDelegado->consultarLiquidaciones();
            return $this->construyeRespuesta($listaLiquidaciones);
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

    /**
     * Consulta todos los conceptos dependiendo de las liquidaciones 
     * seleccionadas 
     * @return json 
     */
    public function consultarConceptosAction() {
        try {
            $this->init();
            $listaConceptos = $this->ventaExternoDelegado->consultarConceptos();
            return $this->construyeRespuesta($listaConceptos);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * función encargado de realizar la liquidación de las ventas 
     * 
     * @return json Información de la liquidación 
     */
    public function liquidarAction() {
        try {
            $this->init();
            $liquidacionVenta = $this->ventaExternoDelegado->liquidarVenta();
            return $this->construyeRespuesta($liquidacionVenta);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Guarda una venta 
     * @return json Devuelve el resultado de la ejecución del json
     */
    public function guardarAction() {
        try {
            $this->init();
            Util::validarPeticion($this);
            $resultado = $this->ventaExternoDelegado->guardar();
            return $this->construyeRespuesta($resultado, "Se guardó correctamente la solicitud de venta número " . $resultado);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Busca una venta apartir de unos criterios
     * @return json Respuesta estándar con la  Lista de ventas 
     */
    public function consultarVentaAction() {
        try {
            $this->init();
            $listaVentas = $this->ventaExternoDelegado->consultarVenta();
            return $this->construyeRespuesta($listaVentas);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta toda la información de una venta en específico 
     * @return json 
     */
    public function consultarDetalleVentaAction() {
        try {
            $this->init();
            $venta = $this->ventaExternoDelegado->consultarDetalleVenta();
            return $this->construyeRespuesta($venta);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

}
