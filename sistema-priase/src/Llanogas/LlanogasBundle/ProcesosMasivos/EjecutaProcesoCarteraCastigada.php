<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class EjecutaProcesoCarteraCastigada {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idUsuario;
    private $idEmpresa;
    private $idActividad;

    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $codigoProceso,$idactividad) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->codigoProceso = $codigoProceso;
        $this->idActividad = $idactividad; 
        
        ConceptosUtil::$idEmpresa = $idEmpresa;
    }

    public function run() {
        $procesoCarteraCastigada = new Procesos\ProcesoCarteraCastigada($this->idEmpresa, $this->idUsuario, $this->idCiclo, $this->idAcceso, $this->codigoProceso, $this->idActividad);
        $procesoCarteraCastigada->iniciar();
    }

}

$i = 1;
$idEmpresa = $argv[$i++];
$idUsuario = $argv[$i++];
$idCiclo = $argv[$i++];
$idAcceso = $argv[$i++];
$idProceso = $argv[$i++];
$idActividad = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoCarteraCastigada = new EjecutaProcesoCarteraCastigada($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $idProceso, $idActividad);
$procesoCarteraCastigada->run();
