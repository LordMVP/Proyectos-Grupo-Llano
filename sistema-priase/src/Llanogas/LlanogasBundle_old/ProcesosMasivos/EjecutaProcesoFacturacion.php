<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFacturacion;
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
class EjecutaProcesoFacturacion {

    private $parametros;

    public function __construct($parametros) {
        $this->parametros = $parametros;
    }

    public function run() {
        ConceptosUtil::$idEmpresa = $this->parametros['idempresa'];
        $procesoFacturacion = new ProcesoFacturacion($this->parametros);
        $procesoFacturacion->iniciar();
    }

}

print_r(exec('php -v'));
$i = 1;
$parametros['idempresa'] = $argv[$i++];
$parametros['idacceso'] = $argv[$i++];
$parametros['idciclo'] = $argv[$i++];
$parametros['idproceso'] = $argv[$i++];
$parametros['preliquidar'] = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoFacturacion = new EjecutaProcesoFacturacion($parametros);
$procesoFacturacion->run();
