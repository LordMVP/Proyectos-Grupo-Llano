<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoNotasCalculada;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class EjecutaProcesoNotaCalculada {

    /**
     * @var array
     */
    private $argumentos;

    public function __construct(array $argumentos) {
        $this->argumentos = $argumentos;
    }

    public function run() {
        try {
            $this->argumentos['idprograma'] = PROGRAMA_NOTA_CALCULADA;
            $procesoNotasAutomaticas = new ProcesoNotasCalculada($this->argumentos);
            $procesoNotasAutomaticas->iniciar();
            $procesoNotasAutomaticas->actualizarFacturasNotas();
            sleep(10);
        } catch (\Exception $e) {
            print_r($e);
            print_r($e->getTraceAsString());
        }
        $procesoNotasAutomaticas->finalizarProceso();
    }

}
/*
 * Comentarear todas las siguientes lineas para poder habilitar el Debug del proceso 
 * Una vez concluido el debug volver a dejar todo habilitado 
 */
$i = 1;
print_r($argv);
print_r("\n");
$argumentos['idacceso'] = $argv[$i++];
$argumentos['conceptos'] = $argv[$i++];
$argumentos['idliquidacion'] = $argv[$i++];
$argumentos['idproceso'] = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
print_r($ruta . "\n");
$loader = require_once $ruta;
$rutaAppKernel = $rutaProyecto . '/app/AppKernel.php';
print_r($rutaAppKernel . "\n");
require_once $rutaAppKernel;
$kernel = new \AppKernel('dev', true);
$procesoNotas = new EjecutaProcesoNotaCalculada($argumentos);
$procesoNotas->run();
