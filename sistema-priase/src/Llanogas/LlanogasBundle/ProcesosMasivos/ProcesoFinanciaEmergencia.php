<?php


namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFinanciarEmergencias;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;


/**
 * Descripcion ProcesoFinanciaEmergencia
 *
 * @author oabaquero
 */
class ProcesoFinanciaEmergencia {
    
    private $idEmpresa;
    private $idCiclo;
    private $idActividad;
    private $idAcceso;
    private $idUsuario;
    private $sesion;
    
    /**
     * Constructor de la clase
     * @param type $idEmpresa
     * @param type $idCiclo
     * @param type $idActividad
     * @param type $idAcceso
     * @param type $idUsuario
     */
    function __construct($idEmpresa,$idProceso, $idCiclo, $idAcceso, $idUsuario) {
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->idProceso = $idProceso;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
    }
    
    /**
     * Ejecuta el proceso de Financiacion emergencia por Ciclos
     */
    public function run(){
        ConceptosUtil::$idEmpresa = $this->idEmpresa;
        $this->iniciarProcesoConsolidado();
    }

    private function iniciarProcesoConsolidado($idsuscripcion = null) {
        if(!empty($idsuscripcion)){
            //  hace algo aca
            return;
        }
        
        $hiloEmergencia = new ProcesoFinanciarEmergencias($this->idEmpresa, $this->idCiclo, $this->idAcceso, $this->idUsuario, $this->idProceso);
        $hiloEmergencia->registrarProceso();
        $hiloEmergencia->generarFinanciacion();
        $hiloEmergencia->finalizarProceso();
    }
}
$idEmpresa = $argv[1];
$idProceso = $argv[2];
$idCiclo = $argv[3];
$idAcceso = $argv[4];
$idUsuario = $argv[5];
$rutaProyecto = $argv[6];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
require_once $rutaProyecto . '/config.php';
$kernel = new \AppKernel('dev', true);
$kernel->loadClassCache();
$rocesoFinanciaEmergencia = new ProcesoFinanciaEmergencia($idEmpresa, $idProceso, $idCiclo, $idAcceso, $idUsuario);
$rocesoFinanciaEmergencia->run();
