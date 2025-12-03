<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoAplicarRecaudos;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoSuspensiones;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoReconexiones;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase sin aparente uso
 *
 * @author hrey
 */
class ProcesoConsolidado {

    private $idEmpresa;
    private $idMotivoSuspension;
    private $idAcceso;
    private $idTipoSuscripcion;

    /**
     * Constructor de la clase
     * @param int $idMotivoSuspension identificador del motivo de suspensión
     * @param int $idEmpresa identificador de la empresa
     * @param int $idAcceso identificador del acceso de la empresa
     * @param int $idTipoSuscripcion identificador del tipo de suspensión.
     */
    public function __construct($idMotivoSuspension, $idEmpresa, $idAcceso, $idTipoSuscripcion) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idMotivoSuspension = $idMotivoSuspension;
        $this->idTipoSuscripcion = $idTipoSuscripcion;
    }

    /**
     * Ejecuta el proceso consolidado
     */
    public function run() {
        $this->iniciarProcesoConsolidado();
    }

    /**
     * inicia el proceso consolidado. 
     */
    public function iniciarProcesoConsolidado() {
        $hiloAplicarRecaudos = new ProcesoAplicarRecaudos($this->idEmpresa, COD_PROCESO_APLICAR_RECAUDOS, $this->idAcceso, $this->idTipoSuscripcion);
        $hiloAplicarRecaudos->iniciar();
        if ($this->idMotivoSuspension != -1) {
            $hiloSuspensiones = new ProcesoSuspensiones($this->idEmpresa, $this->idMotivoSuspension, $this->idAcceso, COD_PROCESO_APLICAR_RECAUDOS);
            $hiloSuspensiones->iniciar();
            $hiloReconexiones = new ProcesoReconexiones($this->idEmpresa, $this->idAcceso, COD_PROCESO_APLICAR_RECAUDOS);
            $hiloReconexiones->iniciar();
        }
    }

}

$idEmpresa = $argv[1];
$idMotivoSuspension = $argv[2];
$idAcceso = $argv[3];
$rutaProyecto = $argv[4];
$idTipoSuscripcion = $argv[5];

$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoConsolidado = new ProcesoConsolidado($idMotivoSuspension, $idEmpresa, $idAcceso, $idTipoSuscripcion);
$procesoConsolidado->run();
