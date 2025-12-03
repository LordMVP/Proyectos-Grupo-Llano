<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoNotasAutomaticas;
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
class EjecutaProcesoNotasAutomaticas {

    /**
     * @var array
     */
    private $argumentos;

    public function __construct(array $argumentos) {

        $this->argumentos = $argumentos;
    }

    /**
     * Método encargado de iniciar el proceso
     */
    public function run() {
        $procesoNotasAutomaticas = new ProcesoNotasAutomaticas($this->argumentos);
        $procesoNotasAutomaticas->iniciar();
    }

}

$i = 1;
print_r($argv);
$argumentos['idempresa'] = $argv[$i++];
$argumentos['idacceso'] = $argv[$i++];
$argumentos['conceptos'] = $argv[$i++];
$argumentos['tiponota'] = $argv[$i++];
$argumentos['numeroproceso'] = $argv[$i++];
$argumentos['idliquidacion'] = $argv[$i++];
$argumentos['reclamacion'] = $argv[$i++];
$argumentos['tipoContabilidad'] = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoNotas = new EjecutaProcesoNotasAutomaticas($argumentos);
$procesoNotas->run();
