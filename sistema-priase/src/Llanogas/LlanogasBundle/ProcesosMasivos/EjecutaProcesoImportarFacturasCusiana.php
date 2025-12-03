<?php
namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoImportarFacturaCusiana;
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
class EjecutaProcesoImportarFacturasCusiana {

    private $parametros;

    public function __construct($parametros) {
        $this->parametros = $parametros;
    }

    public function run() {
        $ProcesoImportarFactura = new Procesos\ProcesoImportarFacturaCusiana($this->parametros);
        try {
            print_r("Parámetros para iniciar el proceso \n");
            print_r($this->parametros);
            ConceptosUtil::$idEmpresa = $this->parametros['idempresa'];
                print_r("Registrar Proceso");
            $ProcesoImportarFactura->registrarProceso();
                print_r("Se inicia proceso de importar facturas");
            $ProcesoImportarFactura->procesarFacturas();
        } catch (\Exception $e) {
            print_r($e->getTraceAsString());
        } finally {
            $ProcesoImportarFactura->finalizarProceso();
        }
    }

}////  para correr sin hilos se debe comentariar estas lines hacia abajo


$i = 1;
$parametros['idacceso'] = $argv[$i++];
$parametros['idusuario'] = $argv[$i++];
$parametros['idproceso'] = $argv[$i++];
$parametros['idempresa'] = $argv[$i++];
$parametros['cicloSeleccionado'] = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoFacturacion = new EjecutaProcesoImportarFacturasCusiana($parametros);
$procesoFacturacion->run();

