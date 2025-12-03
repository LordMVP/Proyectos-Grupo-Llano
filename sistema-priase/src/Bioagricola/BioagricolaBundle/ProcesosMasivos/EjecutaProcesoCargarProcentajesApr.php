<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de cargar Porcentajes e Aprovechamiento
 * @author desarrollo1
 */
class EjecutaProcesoCargarProcentajesApr {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de cargue de Porcentajes de Aprovechamiento
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
    }

    /**
     * Toma los pagos que se procesarán por este hilo y valida que no se esté presentando otra
     * ejecución con la misma empresa
     */
    public function run() {
        $procesoPorAprFinanc = new Procesos\ProcesoCargarProcentajesApr($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoPorAprFinanc->registrarProceso();

        $listaResgistroProc = $procesoPorAprFinanc->consultarRegistrospendientes();
        print_r("Número de Porcentajes a procesar " . count($listaResgistroProc) . " \n\n");
        while (!empty($listaResgistroProc)) {
            $procesoPorAprFinanc->iniciar($listaResgistroProc);
            $listaResgistroProc = $procesoPorAprFinanc->consultarRegistrospendientes();
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoPorAprFinanc->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoPorAprFinanc->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
            $procesoPorAprFinanc->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso Cargar Porcentajes Aprovechamiento") ;
        }

        $procesoPorAprFinanc->finalizarProceso();
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
$procesoPorAprsFinanc = new EjecutaProcesoCargarProcentajesApr($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoPorAprsFinanc->run();
