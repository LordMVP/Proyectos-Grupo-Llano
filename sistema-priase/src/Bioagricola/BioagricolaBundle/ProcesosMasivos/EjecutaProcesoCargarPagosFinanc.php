<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de cargar las financiaciones
 * @author desarrollo1
 */
class EjecutaProcesoCargarPagosFinanc {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de Aplicacion de pagos
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
        $procesoPagFinanc = new Procesos\ProcesoCargarPagosFinanc($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoPagFinanc->registrarProceso();

        $listaPagos = $procesoPagFinanc->consultarPagospendientes();
        print_r("Número de Pagos a procesar " . count($listaPagos) . " \n\n");
        while (!empty($listaPagos)) {
            $procesoPagFinanc->iniciar($listaPagos,$this->idProceso);
            $listaPagos = $procesoPagFinanc->consultarPagospendientes();
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoPagFinanc->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoPagFinanc->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
                $procesoPagFinanc->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso Cargar Financiaciones") ;
        }

        $procesoPagFinanc->finalizarProceso();
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
$procesoPagosFinanc = new EjecutaProcesoCargarPagosFinanc($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoPagosFinanc->run();
