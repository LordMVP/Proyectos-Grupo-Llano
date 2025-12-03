<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos;

/**
 * Clase que permite ejecutar multi-hilos para el proceso de generar Informe Aprovechamiento
 * @author desarrollo1
 */
class EjecutaProcesoGenerarInformeApr {

    private $idProceso;
    private $idAcceso;
    private $idUsuario;
    private $idEmpresa;

    /**
     * Inicializa la clase que ejecuta el  proceso de Generacion de Informe de Aprovechamiento
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
     * Toma los registros a procesar por este hilo y valida que no se esté presentando otra
     * ejecución con la misma empresa
     */
    public function run() {
        $procesoGenInfApr = new Procesos\ProcesoGenerarInformeApr($this->idEmpresa, $this->idUsuario, $this->idAcceso, $this->idProceso);
        $procesoGenInfApr->registrarProceso();

        $listaGenInfApr = $procesoGenInfApr->consultarRegistrosAprPendientes();
        print_r("Número de Registros a procesar " . count($listaGenInfApr) . " \n\n");
        while (!empty($listaGenInfApr)) {
            $cantidad = $procesoGenInfApr->iniciar($listaGenInfApr , $this->idProceso);
            if ( $cantidad > 0 )
            {
                $listaGenInfApr = $procesoGenInfApr->consultarRegistrosAprPendientes();
            }
            else
            {
                $listaGenInfApr = null ;
            }
        }
        /*
         * Control de Ejecución de Proceso para no permitir concurrencia en la misma empresa 
         */
        if ($this->idProceso ==0) {
            $HilosActivos = $procesoGenInfApr->getCantidadHilosActivosPrograma(0);
            while ($HilosActivos > 0) {
                print_r("\n Hilos Activos Bucle:" . $HilosActivos);
                $HilosActivos = $procesoGenInfApr->getCantidadHilosActivosPrograma($this->idProceso);
                sleep(5);
            }
            $procesoGenInfApr->inactivarControlEjecucionProceso();
            print_r("\nFinaliza Proceso de Aplicar Financiaicones") ;
        }

        $procesoGenInfApr->finalizarProceso();
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
$procesoGenInfApres = new EjecutaProcesoGenerarInformeApr ($idEmpresa, $idUsuario, $idAcceso, $idProceso);
$procesoGenInfApres->run();
