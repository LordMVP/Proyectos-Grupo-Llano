<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoCierresSuspensionesReconexiones;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Description of ProcesoCierre
 *
 * @author mebonilla9
 */
class ProcesoCierreSuspensionesReconexiones {
    
    private $idEmpresa;
    private $idAcceso;
    private $idCiclo;
    private $idUsuario;
    
    /**
     * Constructor de la clase 
     * @param type $idEmpresa id de la empresa del usuario en sesion
     * @param type $idAcceso id de acceso del usuario en sesion
     * @param type $idCiclo id del ciclo del proceso
     * @param type $idUsuario id del usuario en sesion que lanza el proceso
     */
    public function __construct($idEmpresa, $idAcceso, $idCiclo, $idUsuario) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idCiclo = $idCiclo;
        $this->idUsuario = $idUsuario;
    }
    
    /**
     * Ejecuta el proceso de suspensiones y reconexiones.
     */
    public function run() {
        ConceptosUtil::$idEmpresa = $this->idEmpresa;
        $this->iniciarProcesoConsolidado();
    }

    /**
     * Ejecuta el proceso de suspensiones y el de reconexiones
     */
    public function iniciarProcesoConsolidado() {
        $hiloCierre = new ProcesoCierresSuspensionesReconexiones($this->idCiclo, $this->idEmpresa, $this->idAcceso, COD_PROCESO_CERRAR_SYR, $this->idUsuario);
        $hiloCierre->iniciar();
    }

}

$idEmpresa = $argv[1];
$idAcceso = $argv[2];
$rutaProyecto = $argv[3];
$idCiclo = $argv[4];
$idUsuario = $argv[5];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
require_once $rutaProyecto . '/config.php';
$kernel = new \AppKernel('dev', true);
$kernel->loadClassCache();
$procesoCierre = new ProcesoCierreSuspensionesReconexiones($idEmpresa, $idAcceso, $idCiclo, $idUsuario);
$procesoCierre->run();
