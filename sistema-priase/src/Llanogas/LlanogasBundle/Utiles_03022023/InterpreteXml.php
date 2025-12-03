<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Utiles;

use Llanogas\LlanogasBundle\Delegado\ImportarFacturasDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of InterpreteXml
 *
 * @author Manuel Ernesto Bonilla Muñoz
 */
class InterpreteXml {

    private $interprete;
    private $archivoXml;
    private $importarDelegado;
    private $contenido;
    private $factura;
    private $facturasCargadas;
    private $facturasNoCargadas;
    private $totalFacturado;
    private $detalle;
    private $cicloSeleccionado;
    private $contador = 0;

    public function __construct(ImportarFacturasDelegado &$importarDelegado) {
        $this->importarDelegado = $importarDelegado;
        //crear interprete
        $this->interprete = xml_parser_create();
        $this->facturasCargadas = 0;
        $this->totalFacturado = 0;
        $this->inicializar();
    }

    public function cargarXml(&$archivoXml) {
        $this->archivoXml = $archivoXml;
    }

    /**
     * Inicializa el interprete de la clase establecido como atributo
     */
    private function inicializar() {
        // apuntar interprete a esta clase
        xml_set_object($this->interprete, $this);
        // asignacion de eventos handler para el procesamiento
        xml_set_element_handler($this->interprete, "iniciarEtiqueta", "finalizarEtiqueta");
        // evento para datos
        xml_set_character_data_handler($this->interprete, "datosEtiqueta");
    }

    /**
     * Inicia la lectura linea a linea del archivo xml
     * @throws MyException en caso de no encontrar archivo o de encontrar un error de sintaxis en el xml
     */
    public function interpretarXml($cicloSeleccionado) {
        $this->cicloSeleccionado = $cicloSeleccionado;
        if (!($file = fopen($this->archivoXml, "r"))) {
            throw new MyException("No se encuentra el archivo", -1);
        }
        while ($data = fread($file, 1024)) {
            if (!xml_parse($this->interprete, $data, feof($file))) {
                $errorCode = xml_get_error_code($this->interprete);
                switch ($errorCode) {
                    case ERROR_INVALID_SYNTAX_XML:
                    case XML_ERROR_INVALID_SYNTAX:
                        throw new MyException("La sintaxis del archivo XML es incorrecta!", $errorCode);
                    case XML_ERROR_INVALID_TOKEN:
                        throw new MyException("El contenido del archivo no corresponde a un XML", $errorCode);
                }
            }
        }
        xml_parser_free($this->interprete);
    }

    //Evento de apertura de etiqueta
    /**
     * Se encarga de evaluar con que etiqueta inicia la linea de xml que se esta procesado,
     * se invoca automaticamente al momendo de iniciar la lectura de archivo
     * @param mixed $interprete
     * @param string $nombre
     * @param array $atributos
     */
    private function iniciarEtiqueta($interprete, $nombre, $atributos) {
        $this->contenido = "";
        $minNombre = strtolower($nombre);
        //print_r($minNombre);
        switch ($minNombre) {
            case "facturas":
                break;
            case "factura":
                $this->factura = array();
                break;
            case "detalle":
                $this->detalle = array();
                break;
            case "detalles":
            case "uniconcepto":
            case "dfacvlrunitari":
            case "encabezado":
            case "facfecha":
            case "facfecvence":
            case "pcodigo":
            case "facsdoreal":
            case "numfactura":
            case "tipouso":
            case "suscripcion":
            case "conceptofinan":
            case "resumen":
            case "cantidadfacturas":
            case "valortotalfacturas":
                break;
            default:
                throw new MyException("Estructura de archivo XML inválida, no se reconoce la etiqueta " . $minNombre, -1);
        }
    }

    /**
     * Captura el valor de las etiquetas que esta leyendo el interprete
     * @param mixed $interprete
     * @param string $dato
     */
    private function datosEtiqueta($interprete, $dato) {
        if (trim($dato) != null || trim($dato) != '') {
            $this->contenido = trim($dato);
        }
    }

    /**
     * Establece logica de negocio para el evento en el que se cierra una etiqueda del
     * xml que se esta leyendo
     * @param mixed $interprete
     * @param string $nombre
     */
    private function finalizarEtiqueta($interprete, $nombre) {
        $minNombre = strtolower($nombre);
        //print_r($minNombre);
        switch ($minNombre) {
            case "facfecha":
                $this->factura["facfecha"] = $this->contenido;
                break;
            case "facfecvence":
                $this->factura["facfecvence"] = $this->contenido;
                break;
            case "pcodigo":
                $this->factura["pcodigo"] = $this->contenido;
                break;
            case "facsdoreal":
                $this->factura["facsdoreal"] = doubleval($this->contenido);
                break;
            case "numfactura":
                $this->factura["numfactura"] = $this->contenido;
                break;
            case "tipouso":
                $this->factura["tipouso"] = $this->contenido;
                break;
            case "suscripcion":
                $this->factura["suscripcion"] = $this->contenido;
                break;
            case "uniconcepto":
                $this->detalle["uniconcepto"] = intval($this->contenido);
                break;
            case "dfacvlrunitari":
                is_numeric($this->contenido) ? $this->detalle["dfacvlrunitari"] = doubleval($this->contenido) : $this->detalle["dfacvlrunitari"] = $this->contenido;
                break;
            case "detalle":
                $this->factura["detalles"][] = $this->detalle;
                $this->detalle = NULL;
                break;
            case "factura":
                $this->contador++;
                $this->importarDelegado->cargarInformacionTemporal($this->factura, $this->contador);
                $this->factura = NULL;
                break;
            case "conceptofinan":
                $this->factura["conceptofinan"] = $this->contenido;
                break;
            case "facturas":
            case "detalles":
            case "encabezado":
            case "resumen":
            case "cantidadfacturas":
            case "valortotalfacturas":
                break;
        }
        $this->contenido = NULL;
    }

    /**
     * retorna el valor de las facturas que fueron cargadas exitosamente desde el archivo
     * plano
     * @return int numero de facturas cargadas
     */
    public function obtenerFacturasCargadas() {
        return $this->facturasCargadas;
    }

    /**
     * Retorna un arreglo con los codigos anteriores de las sucripciones que no estan en la
     * base de datos principal pero que si existen dentro del xml
     * @return array
     */
    public function obtenerSuscripcionesNocargadas() {
        return $this->facturasNoCargadas;
    }

    public function obtenerValorFacturado() {
        return $this->totalFacturado;
    }

}
