<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoReconexiones;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Description of ProcesoReconexion
 *
 * @author mebonilla
 */
class ProcesoReconexion {

    private $idEmpresa;
    private $tipoDeUso;
    private $idAcceso;
    private $idUsuario;
    private $idMunicipio;
    private $idSuscripcion ; 

    /**
     * 
     * @param type $idEmpresa id de la empresa en sesion
     * @param type $tipoDeUso id del tipo de uso de las suscripciones que van a
     * ser procesadas
     * @param type $idAcceso id de acceso del usuario en sesion
     * @param type $idUsuario id del usuario en sesion que lanza el proceso
     */
    public function __construct($idEmpresa, $tipoDeUso, $idAcceso, $idUsuario, $municipios) {
        $this->idEmpresa = $idEmpresa;
        $this->tipoDeUso = $tipoDeUso;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
        $this->idMunicipio = $municipios;
    }
    
    /**
     * Funcion que asigna la variable $idsuscripcion 
     * **/
    
    public function setIdesuscripcion ($idsuscripcion)
    {
        $this->idSuscripcion = $idsuscripcion ; 
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
        $hiloSuspensiones = new ProcesoReconexiones($this->idEmpresa, $this->idAcceso, COD_PROCESO_RECONEXIONES, $this->tipoDeUso, $this->idUsuario, $this->idMunicipio);
        if ($this->idSuscripcion != null)
        {
             $hiloSuspensiones->iniciar($this->idSuscripcion );
        }    
        else
        {
            $hiloSuspensiones->iniciar();
        }        
    }

}

$idEmpresa = $argv[1];
$idtipoUso = $argv[2];
$idAcceso = $argv[3];
$idUsuario = $argv[4];
$rutaProyecto = $argv[5];
$idMunicipio = $argv[6];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
require_once $rutaProyecto . '/config.php';
$kernel = new \AppKernel('dev', true);
$kernel->loadClassCache();
$procesoSuspension = new ProcesoReconexion($idEmpresa, $idtipoUso, $idAcceso, $idUsuario,$idMunicipio);
$procesoSuspension->run();
