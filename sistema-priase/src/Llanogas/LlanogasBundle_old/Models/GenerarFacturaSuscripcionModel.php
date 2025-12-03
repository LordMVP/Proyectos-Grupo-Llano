<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar los procesos. 
 *
 * @author hrey
 */
class GenerarFacturaSuscripcionModel extends AuditoriaServices {

    /**
     * @var GenericoModel 
     */
    private $genericoModel;

    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function getLiquidacionSuscripcion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "select dsus.uni_liquidacion idliquidacion from dsus_detsuscrip dsus where dsus.dsus_ideregistr=:idsuscripcion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['idliquidacion'];
    }

    public function getConceptosLiquidacion($idLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $sql = "select coli.uni_concepto idconcepto from coli_conliquida coli where coli.uni_liquidacion=:idliquidacion";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException("Error la liquidación $idLiquidacion no tiene conceptos asociados ", -1);
        }
        return $resultado;
    }

}
