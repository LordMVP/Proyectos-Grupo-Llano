<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Controller;

use Externo\FinanciacionesBundle\Delegado\FinanciacionExternoDelegado;

/**
 * Description of FinanciacionExternoController
 *
 * @author god
 */
class FinanciacionExternoController extends GenericoController {

    private $financiacionExternoDelegado;

    private function init() {
        $this->financiacionExternoDelegado = new FinanciacionExternoDelegado($this->conexion, $this->getSesion(), $this->parametros);
    }

    /**
     * Se consulta las liquidaciones que aplican al producto financiero seleccionado
     * @return json Respuesta estándar con las liquidaciones 
     */
    public function consultarLiquidacionesCreditoAction() {
        try {
            $this->init();
            $listaLiquidaciones = $this->financiacionExternoDelegado->consultarLiquidacionesCredito();
            return $this->construyeRespuesta($listaLiquidaciones);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta las variables de acuerdo con el producto financiero 
     * seleccionado y la empresa que financia
     * @return type
     */
    public function consultarVariablesCalificacionAction() {
        try {
            $this->init();
            $listaVariables = $this->financiacionExternoDelegado->consultarVariablesCalificacion();
            return $this->construyeRespuesta($listaVariables);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Permite realizar la calificación 
     * @return json Lista de variables con su respectivo valor
     */
    public function calificarAction() {
        try {
            $this->init();
            $listaCalificacion = $this->financiacionExternoDelegado->calificar();
            return $this->construyeRespuesta($listaCalificacion);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    /**
     * Consulta todos los terceros 
     * @return JSON 
     */
    public function consultarTerceroAction() {
        try {
            $this->init();
            $listaTerceros = $this->financiacionExternoDelegado->consultarTercero();
            return $this->construyeRespuesta($listaTerceros);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    public function consultarTerceroPorDocumentoAction() {
        try {
            $this->init();
            $respuesta = $this->financiacionExternoDelegado->consultarTerceroPorDocumento();
            return $this->construyeRespuesta($respuesta);
        } catch (\Exception $e) {
            return $this->construyeRespuestaError($e);
        }
    }

    public function consultarCiudadesExpedicionDocumentoAction() {
        try {
            $this->init();
            $respuesta = $this->financiacionExternoDelegado->consultarCiudadesExpedicionDocumento();
            return $this->construyeRespuesta($respuesta);
        } catch (\Exception $ex) {
            return $this->construyeRespuesta($ex);
        }
    }

    public function consultarTiposDocumentoAction() {
        try {
            $this->init();
            $respuesta = $this->financiacionExternoDelegado->consultarTiposDocumento();
            return $this->construyeRespuesta($respuesta);
        } catch (\Exception $ex) {
            return $this->construyeRespuesta($ex);
        }
    }

    /**
     * Consulta los tipos de tercero disponibles 
     * @return array Lista 
     */
    public function consultarTiposTerceroAction() {
        try {
            $this->init();
            $respuesta = $this->financiacionExternoDelegado->consultarTiposTercero();
            return $this->construyeRespuesta($respuesta);
        } catch (\Exception $ex) {
            return $this->construyeRespuesta($ex);
        }
    }

}
