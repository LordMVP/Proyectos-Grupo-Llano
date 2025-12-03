<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoGenerarMovimientoContable;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class EjecutaProcesoMovimientoContable {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idPeriodo;
    private $cicloanio;
    private $idUsuario;
    private $idEmpresa;
    private $idperidoCerrado;

    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idPeriodo, $cicloanio, $idAcceso, $codigoProceso, $idperiodoCerrado) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idPeriodo = $idPeriodo;
        $this->cicloanio = $cicloanio;
        $this->idAcceso = $idAcceso;
        $this->codigoProceso = $codigoProceso;
        $this->idperidoCerrado = $idperiodoCerrado;
    }

    public function run() {
        $procesoGenerarMovimientoContable = new ProcesoGenerarMovimientoContable($this->idEmpresa, $this->idUsuario, $this->idCiclo, $this->idPeriodo, $this->cicloanio, $this->idAcceso, $this->codigoProceso, $this->idperidoCerrado);
        $procesoGenerarMovimientoContable->iniciar();
    }

}

$i = 1;
$idEmpresa = $argv[$i++];
$idUsuario = $argv[$i++];
$idCiclo = $argv[$i++];
$idPeriodo = $argv[$i++];
$cicloanio = $argv[$i++];
$idAcceso = $argv[$i++];
$idProceso = $argv[$i++];
$idperiodoCerrado = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoMovimientoContables = new EjecutaProcesoMovimientoContable($idEmpresa, $idUsuario, $idCiclo, $idPeriodo, $cicloanio, $idAcceso, $idProceso , $idperiodoCerrado);
$procesoMovimientoContables->run();
