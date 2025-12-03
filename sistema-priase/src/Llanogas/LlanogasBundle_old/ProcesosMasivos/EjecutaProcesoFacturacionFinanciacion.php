<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFacturarFinanciacion;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class EjecutaProcesoFacturacionFinanciacion {

    private $parametros;

    public function __construct($parametros) {
        $this->parametros = $parametros;
    }

    public function run() {
        try {
            print_r("Parámetros para iniciar el proceso \n");
            print_r($this->parametros);
            ConceptosUtil::$idEmpresa = $this->parametros['idempresa'];
            print_r("Variable global inicializada\n");
            $procesoFacturacion = new ProcesoFacturarFinanciacion($this->parametros['idacceso'], $this->parametros['idciclo']);
            print_r("Registrando proceso\n");
            $procesoFacturacion->registrarProceso($this->parametros['idproceso']);
            print_r("Iniciando proceso\n");
            $procesoFacturacion->iniciar($this->parametros['idproceso']);
            print_r("Finalizando proceso\n");
            $procesoFacturacion->finalizarProceso();
        } catch (\Exception $e) {
            print_r($e->getTraceAsString());
        }
    }

}

$i = 1;
$parametros['idacceso'] = $argv[$i++];
$parametros['idciclo'] = $argv[$i++];
$parametros['idproceso'] = $argv[$i++];
$parametros['idempresa'] = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoFacturacion = new EjecutaProcesoFacturacionFinanciacion($parametros);
$procesoFacturacion->run();
