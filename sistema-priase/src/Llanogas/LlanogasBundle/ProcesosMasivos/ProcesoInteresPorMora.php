<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoInteresMora;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;


/**
 * Description of ProcesoInteresPorMora
 *
 * @author mebonilla
 */
class ProcesoInteresPorMora {
    
    private $idEmpresa;
    private $idCiclo;
    private $idActividad;
    private $idAcceso;
    private $idUsuario;
    
    /**
     * Constructor de la clase
     * @param type $idEmpresa
     * @param type $idCiclo
     * @param type $idActividad
     * @param type $idAcceso
     * @param type $idUsuario
     */
    function __construct($idEmpresa,$idProceso, $idCiclo, $idActividad, $idAcceso, $idUsuario) {
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->idProceso = $idProceso;
        $this->idActividad = $idActividad;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
    }
    
    /**
     * Ejecuta el proceso de Interes por mora por Ciclos
     */
    public function run(){
        ConceptosUtil::$idEmpresa = $this->idEmpresa;
        $this->iniciarProcesoConsolidado();
    }

    private function iniciarProcesoConsolidado() {
        
        
        $hiloInteresMora = new ProcesoInteresMora($this->idEmpresa, $this->idCiclo, $this->idActividad, $this->idAcceso, $this->idUsuario, $this->idProceso);
        $hiloInteresMora->registrarProceso();
        $hiloInteresMora->generarInteresMora();
        $hiloInteresMora->finalizarProceso();
    }
}
$idEmpresa = $argv[1];
$idProceso = $argv[2];
$idCiclo = $argv[3];
$idActividad = $argv[4];
$idAcceso = $argv[5];
$idUsuario = $argv[6];
$rutaProyecto = $argv[7];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
require_once $rutaProyecto . '/config.php';
$kernel = new \AppKernel('dev', true);
$kernel->loadClassCache();
$procesoInteresMora = new ProcesoInteresPorMora($idEmpresa, $idProceso, $idCiclo, $idActividad, $idAcceso, $idUsuario);
$procesoInteresMora->run();
