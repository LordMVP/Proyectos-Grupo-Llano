<?php

namespace Externo\FinanciacionesBundle;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ValidacionExcepcion
 *
 * @author jhon1
 */
class ValidacionExcepcion extends \Exception {

    private $codigo;
    private $mensaje;
    private $datos;

    public function __construct($codigo, $mensaje, $datos) {
        parent::__construct($mensaje, $codigo);
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
