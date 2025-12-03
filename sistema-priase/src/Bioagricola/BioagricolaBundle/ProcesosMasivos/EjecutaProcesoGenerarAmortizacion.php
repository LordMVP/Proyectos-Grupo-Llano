<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de generar amortizaciones 
 * @author desarrollo1
 */
class EjecutaProcesoGenerarAmortizacion {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de generar amortizacion
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
     * Toma las financiaciones que se procesarán por este hilo y valida que no se esté presentando otra
     * ejecución con la misma empresa
     */
    public function run() {
        $procesoGenerarAmort = new Procesos\ProcesoGenerarAmortizacion($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoGenerarAmort->registrarProceso();

        $listaFinancamort = $procesoGenerarAmort->consultarFinanciaiconespendientes();
        print_r("Número de Financiaciones a procesar " . count($listaFinancamort) . " \n\n");
        while (!empty($listaFinancamort)) {
            $procesoGenerarAmort->iniciar($listaFinancamort,$this->idProceso );
            $listaFinancamort = $procesoGenerarAmort->consultarFinanciaiconespendientes();
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoGenerarAmort->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoGenerarAmort->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
                $procesoGenerarAmort->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso de Generar Financiaciones..") ;
        }

        $procesoGenerarAmort->finalizarProceso();
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
$procesoGenAmortiz = new EjecutaProcesoGenerarAmortizacion($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoGenAmortiz->run();
