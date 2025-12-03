<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoSuspensiones;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Proceso de suspensiones y reconexiones.
 *
 * @author mebonilla
 */
class ProcesoSuspension {

    private $idEmpresa;
    private $tipoDeUso;
    private $desde;
    private $hasta;
    private $fechaIni;
    private $fechaFin;
    private $idAcceso;
    private $idUsuario;
    private $idMunicipio;

    /**
     * Constructor de la clase
     * @param int $idMotivoSuspension identificador del motivo de la suspensión.
     * @param int $idEmpresa identificador de la empresa
     * @param int $idAcceso identificador de la sesión del usuario.
     */
    function __construct($idEmpresa, $tipoDeUso, $desde, $hasta, $fechaIni, $fechaFin, $idAcceso, $idUsuario, $municipios) {
        $this->idEmpresa = $idEmpresa;
        $this->tipoDeUso = $tipoDeUso;
        $this->desde = $desde;
        $this->hasta = $hasta;
        $this->fechaIni = $fechaIni;
        $this->fechaFin = $fechaFin;
        $this->idAcceso = $idAcceso;  
        $this->idUsuario = $idUsuario;
        $this->idMunicipio = $municipios;
    }

    /**
     * Ejecuta el proceso de suspensiones y reconexiones.
     */
    public function run() {
        //ConceptosUtil::$idEmpresa = $this->idEmpresa;
        $this->iniciarProcesoConsolidado();
    }

    /**
     * Ejecuta el proceso de suspensiones y el de reconexiones
     */
    public function iniciarProcesoConsolidado() {
        print_r(" $this->idEmpresa $this->idAcceso COD_PROCESO_SUSPENSIONES $this->tipoDeUso $this->desde $this->hasta $this->fechaIni $this->fechaFin $this->idUsuario  $this->idmunicipio");
        $hiloSuspensiones = new ProcesoSuspensiones($this->idEmpresa, $this->idAcceso, COD_PROCESO_SUSPENSIONES, $this->tipoDeUso, $this->desde, $this->hasta, $this->fechaIni, $this->fechaFin, $this->idUsuario, $this->idMunicipio);
        $hiloSuspensiones->iniciar();
    }

}

$idEmpresa = $argv[1];
$idtipoUso = $argv[2];
$desde = $argv[3];
$hasta = $argv[4];
$fechaIni = $argv[5];
$fechaFin = $argv[6];
$idAcceso = $argv[7];
$idUsuario = $argv[8];
$rutaProyecto = $argv[9];
$municipios = $argv[10];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
require_once $rutaProyecto . '/config.php';
$kernel = new \AppKernel('dev', true);
$kernel->loadClassCache();
$procesoSuspension = new ProcesoSuspension($idEmpresa, $idtipoUso, $desde, $hasta, $fechaIni, $fechaFin, $idAcceso, $idUsuario, $municipios);
$procesoSuspension->run();
