<?php

namespace Externo\FinanciacionesBundle\Delegado;

use Externo\FinanciacionesBundle\Models\SeguridadModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Hash;
use Llanogas\LlanogasBundle\Utiles\Validacion;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SegutidadDelegado
 *
 * @author god
 */
class SeguridadDelegado {

    private $conexion;

    /**
     *
     * @var SeguridadModel 
     */
    private $seguridadModel;
    private $validacion;

    public function __construct(&$conexion) {
        $this->conexion = $conexion;
        $this->seguridadModel = new SeguridadModel($conexion);
        $this->validacion = new Validacion();
    }

    public function consultarEmpresasFinancian() {
        return $this->seguridadModel->consultarEmpresasFinancian();
    }

    public function autenticacion($parametros) {
        $this->validacion->validar($parametros, [
            "usuario" => "required",
            "clave" => "required",
            "idempresa" => "required|numeric"
        ]);
        $usuario = trim($parametros['usuario']);
        $clave = trim($parametros['clave']);
        $idEmpresa = $parametros['idempresa'];
        $ip = trim($parametros['ip']);
        $usuario = $this->seguridadModel->autenticar($usuario, $clave, $idEmpresa, $ip);
        $this->guardarAcceso($usuario);
        //Se cifra la respuesta.
        $token = Hash::encrypt($usuario, CLAVE_CIFRADO);
        return $token;
    }

    /**
     * Guarda en la tabla de acceso
     * @param array $usuario
     */
    private function guardarAcceso(&$usuario) {
        $idAcceso = $this->seguridadModel->guardarAcceso($usuario);
        $usuario['idacceso'] = $idAcceso;
    }

}
