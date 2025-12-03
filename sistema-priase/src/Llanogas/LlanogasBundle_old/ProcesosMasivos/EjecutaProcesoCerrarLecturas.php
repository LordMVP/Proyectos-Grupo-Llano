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
class EjecutaProcesoCerrarLecturas {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idUsuario;
    private $idEmpresa;
    

    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $codigoProceso) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->codigoProceso = $codigoProceso;
    }

    public function run() {
        $ProcesoCerrarLecturas = new Procesos\ProcesoCerrarLecturas($this->idEmpresa, $this->idUsuario, $this->idCiclo, $this->idAcceso, $this->codigoProceso);
        $ProcesoCerrarLecturas->iniciar();
    }

}
$i = 1;
$idEmpresa = $argv[$i++];
$idUsuario = $argv[$i++];
$idCiclo = $argv[$i++];
$idAcceso = $argv[$i++];
$idProceso = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$ejecutaProcesoCerrarLecturas = new EjecutaProcesoCerrarLecturas($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $idProceso);
$ejecutaProcesoCerrarLecturas->run();
