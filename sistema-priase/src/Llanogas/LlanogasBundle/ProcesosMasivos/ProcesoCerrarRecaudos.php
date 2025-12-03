<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoRecaudos;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProcesoConsolidado
 *
 * @author hrey
 */
class ProcesoCerrarRecaudos {

    private $idEmpresa;
    private $idAcceso;
    private $idCiclo;

    /**
     * Constructor de la clase
     * @param int $idEmpresa identificador de la empresa
     * @param int $idAcceso identificador de la sesión del usuario
     * @param int $idCiclo identificador del tipo de suscripción.
     */
    public function __construct($idEmpresa, $idAcceso, $idCiclo) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idCiclo = $idCiclo;
    }

    /**
     *  Inicia el proceso consolidado
     */
    public function run() {
        $this->iniciarProceso();
    }

    /**
     * Inicia proceso consolidado
     */
    public function iniciarProceso() {
        print_r("INICIA HILO CERRAR RECAUYDOS ");
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idprograma'] = COD_PROCESO_CERRAR_RECAUDOS;
        $parametros['idacceso'] = $this->idAcceso;
        $parametros['idciclo'] = $this->idCiclo;
        print_r("validando recaudo disponibles");
        print_r($parametros);
        $procesoRecaudos = new ProcesoRecaudos($parametros);
        $procesoRecaudos->vaciarTabla();
        $procesoRecaudos->crearTabla();
        $inicio = 0;
        $procesoRecaudos->registrarProceso(COD_PROCESO_CERRAR_RECAUDOS);
        $procesoRecaudos->quitarValor();
        $listaRecaudos = $procesoRecaudos->getRecaudosDisponibleCiclo($this->idCiclo, $inicio);
        while (!empty($listaRecaudos)) {
            $procesoRecaudos->iniciar($listaRecaudos);
            $inicio += 2000;
            $listaRecaudos = $procesoRecaudos->getRecaudosDisponibleCiclo($this->idCiclo, $inicio);
        }
        $procesoRecaudos->actualizarEstadoCartera();
        $procesoRecaudos->finalizarProceso();
    }

}

$i = 1;
$idEmpresa = $argv[$i++];
$idAcceso = $argv[$i++];
$idCiclo = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoConsolidado = new ProcesoCerrarRecaudos($idEmpresa, $idAcceso, $idCiclo);
$procesoConsolidado->run();
