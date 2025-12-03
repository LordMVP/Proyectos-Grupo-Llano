<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

//use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de cargar las financiaciones
 * @author desarrollo1
 */
class EjecutaProcesoCargarFinanciacion {

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
        //ConceptosUtil::$idEmpresa = $idEmpresa;
    }

    /**
     * Toma las financiaciones que se procesarán por este hilo y valida que no se esté presentando otra
     * ejecución con la misma empresa
     */
    public function run() {
        $inicio = 0;
        $procesoCargarFinanciacion = new Procesos\ProcesoCargarFinanciacion($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoCargarFinanciacion->registrarProceso();

        $listaFinanciaciones = $procesoCargarFinanciacion->consultarFinanciacionesPendiente($inicio);
        print_r("Número de Financiaciones a procesar " . count($listaFinanciaciones) . " \n\n");
        while (!empty($listaFinanciaciones)) {
            $inicio += 1000;
            $procesoCargarFinanciacion->iniciar($listaFinanciaciones);
            $listaFinanciaciones = $procesoCargarFinanciacion->consultarFinanciacionesPendiente($inicio);
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoCargarFinanciacion->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoCargarFinanciacion->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
            $procesoCargarFinanciacion->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso Cargar Financiaciones") ;
        }

        $procesoCargarFinanciacion->finalizarProceso();
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
$procesoCargarFinanciaciones = new EjecutaProcesoCargarFinanciacion($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoCargarFinanciaciones->run();
