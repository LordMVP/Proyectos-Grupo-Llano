<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de cargar las financiaciones
 * @author desarrollo1
 */
class EjecutaProcesoAplicarDxD {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de Aplicacion de cambios DxD
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
        $procesoAplicarDxD = new Procesos\ProcesoAplicarDxD($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoAplicarDxD->registrarProceso();

        $listaDxDaplicar = $procesoAplicarDxD->consultarCambiosDxDpendiente();
        print_r("Número de DxD a procesar " . count($listaDxDaplicar) . " \n\n");
        while (!empty($listaDxDaplicar)) {
            $procesoAplicarDxD->iniciar($listaDxDaplicar);
            $listaDxDaplicar = $procesoAplicarDxD->consultarCambiosDxDpendiente();
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoAplicarDxD->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoAplicarDxD->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
                $procesoAplicarDxD->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso Cargar Financiaciones") ;
        }

        $procesoAplicarDxD->finalizarProceso();
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
$procesoAplicarDxDes = new EjecutaProcesoAplicarDxD($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoAplicarDxDes->run();
