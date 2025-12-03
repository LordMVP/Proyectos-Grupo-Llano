<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoRecaudos;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Description of ProcesoConsolidado
 *
 * @author hrey
 */
class ProcesoAplicarRecaudos {

    private $idEmpresa;
    private $idAcceso;
    private $idTipoSuscripcion;

    /**
     * Constructor de la clase
     * @param int $idEmpresa identificador de la empresa
     * @param int $idAcceso identificador de la sesión del usuario
     * @param int $idTipoSuscripcion identificador del tipo de suscripción.
     */
    public function __construct($idEmpresa, $idAcceso, $idTipoSuscripcion) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idTipoSuscripcion = $idTipoSuscripcion;
    }

    /**
     *  Inicia el proceso consolidado
     */
    public function run() {
        $this->iniciarProceso();
    }

    /**
     * Inicia proceso consolidado
     */
    public function iniciarProceso() {
        try {
            ConceptosUtil::$idEmpresa = $this->idEmpresa;
            $parametros['idempresa'] = $this->idEmpresa;
            $parametros['idacceso'] = $this->idAcceso;
            $parametros['idtiposuscripcion'] = $this->idTipoSuscripcion;
            $parametros['idprograma'] = COD_PROCESO_APLICAR_RECAUDOS;

            $proceso = new ProcesoRecaudos($parametros);
            $proceso->vaciarTabla();
            $proceso->crearTabla();
            $inicio = 0;
            $proceso->registrarProceso(COD_PROCESO_APLICAR_RECAUDOS);
            $listaRecaudos = $proceso->getRecaudosDisponibleTipoSuscripcion($this->idTipoSuscripcion, $inicio);
            print_r("Número de recaudos a procesar " . count($listaRecaudos) . " \n\n");
            while (!empty($listaRecaudos)) {
                $proceso->iniciar($listaRecaudos);
                $inicio += 100;
                $listaRecaudos = $proceso->getRecaudosDisponibleTipoSuscripcion($this->idTipoSuscripcion, $inicio);
            }
            print_r("Se finalizó el proceso \n");
            $proceso->finalizarProceso();
        } catch (\Exception $e) {
            print_r($e->getTraceAsString());
        }
    }

}

print_r("Inicia proceso de aplicar recaudos");
$i = 1;
$idEmpresa = $argv[$i++];
$idAcceso = $argv[$i++];
$idTipoSuscripcion = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoConsolidado = new ProcesoAplicarRecaudos($idEmpresa, $idAcceso, $idTipoSuscripcion);
$procesoConsolidado->run();
