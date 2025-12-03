<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle;

/**
 * Description of HashException
 *
 * @author jhon1
 */
class HashException extends \Exception {

    private $codigo;
    private $mensaje;
    private $datos;

    function __construct($codigo, $mensaje, $datos) {
        $this->codigo = $codigo;
        $this->mensaje = $mensaje;
        $this->datos = $datos;
    }

    function getCodigo() {
        return $this->codigo;
    }

    function getMensaje() {
        return $this->mensaje;
    }

    function getDatos() {
        return $this->datos;
    }

    function setCodigo($codigo) {
        $this->codigo = $codigo;
    }

    function setMensaje($mensaje) {
        $this->mensaje = $mensaje;
    }

    function setDatos($datos) {
        $this->datos = $datos;
    }

}
