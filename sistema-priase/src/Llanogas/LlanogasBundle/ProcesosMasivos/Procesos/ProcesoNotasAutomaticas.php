<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ProcesoFacturacionModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Delegado\FacturarSuscripcionDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\NotasAutomaticasDelegado;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class ProcesoNotasAutomaticas {

    /**
     * @var array
     */
    private $parametros;

    /**
     *
     * @var NotasAutomaticasDelegado 
     */
    private $notasDelegados;

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    public function __construct(array $parametros) {
        $this->parametros = $parametros;
        $this->conexion = ConexionBD::getConexion();
        $this->notasDelegados = new NotasAutomaticasDelegado($this->conexion, $parametros['idacceso'], PROGRAMA_NOTA_DIRECTA);
        $this->parametros['conceptos'] = json_decode($this->parametros['conceptos'], true);
    }

    /**
     * Inicia el proceso de notas automáticas 
     */
    public function iniciar() {
        try {
            //Se registra proceso en la tabla cpr_ 
            $this->notasDelegados->registrarProceso();
            $listaFacturas = $this->notasDelegados->getFacturasHilo($this->parametros['numeroproceso']);
            while (!empty($listaFacturas)) {
                $this->notasDelegados->procesarFacturas($this->parametros, $listaFacturas);
                $listaFacturas = $this->notasDelegados->getFacturasHilo($this->parametros['numeroproceso']);
            }
            //Se inactiva el proceso
            $this->notasDelegados->finalizarProceso();
        } catch (\Exception $e) {
            print_r($e);
            $this->conexion->rollBack();
        }
    }

}
