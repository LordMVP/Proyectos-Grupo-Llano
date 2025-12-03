<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de cargar los recaudos 
 * @author desarrollo1
 */
class EjecutaProcesoCargarRecaudo {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de cargue del archivo
     * @param number $idEmpresa - Id de la empresa actual
     * @param number $idUsuario - Id del usuario que ejecutóoo   el proceso
     * @param number $idAcceso - Id del acceso a la plataforma
     * @param number $idProceso - Cantidad de procesos ejecturados
     */
    public function __construct($idEmpresa, $idUsuario, $idAcceso, $idProceso) {
        $this->idAcceso = $idAcceso;
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idProceso = $idProceso;
        ConceptosUtil::$idEmpresa = $idEmpresa;
    }

    /**
     * Toma los recaudos que se procesarán por este hilo y valida que no se esté presentando otra
     * ejecución con la misma empresa
     */
    public function run() {
        $inicio = 0;
        $procesoCargarRecaudo = new Procesos\ProcesoCargarRecaudo($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoCargarRecaudo->registrarProceso();

        $listaRecaudos = $procesoCargarRecaudo->consultarRecaudosPendiente($inicio);
        print_r("Número de recaudos a procesar " . count($listaRecaudos) . " \n\n");
        while (!empty($listaRecaudos)) {
            $inicio += 1000;
            $procesoCargarRecaudo->iniciar($listaRecaudos);
            $listaRecaudos = $procesoCargarRecaudo->consultarRecaudosPendiente($inicio);
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoCargarRecaudo->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoCargarRecaudo->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
                $procesoCargarRecaudo->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso Cargar Recaudos") ;
        }

        $procesoCargarRecaudo->finalizarProceso();
    }

}
/**
 * Se recibe la información enviada para la ejecución del proceso
 */

$i = 1;
$idEmpresa = $argv[$i++];
$idProceso = $argv[$i++];
$idAcceso = $argv[$i++];
$idUsuario = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoCargarRecaudos = new EjecutaProcesoCargarRecaudo($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoCargarRecaudos->run();
