<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos;

use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoGenerarPlanoFes;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;

/**
 * Description of ProcesoIniciaGenerarPlanoFes
 *
 * @author lmrubio
 */
class ProcesoIniciaGenerarPlanoFes {

    private $idProceso;
    private $idCiclo;
    private $idAcceso;
    private $idEmpresa;
    private $usuario;

    //put your code here

    public function __construct($idAcceso, $idEmpresa, $idCiclo, $idProceso,$usuario) {
        $this->idAcceso = $idAcceso;
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->idProceso = $idProceso;
        $this->usuario = $usuario;
    }

    public function run() {
        print_r('Inicio proceso');
        $parametros['idacceso'] = $this->idAcceso;
        $parametros['idciclo'] = $this->idCiclo;
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idproceso'] = $this->idProceso;
        $parametros['usuario'] = $this->usuario;
        print_r($parametros);
        $procesogeneraPlanoFes = new ProcesoGenerarPlanoFes($parametros);
        $procesogeneraPlanoFes->iniciar();
    }

}

$i = 1;
$idEmpresa = $argv[$i++];
$idAcceso = $argv[$i++];
$idCiclo = $argv[$i++];
$idProceso = $argv[$i++];
$usuario = $argv[$i++];
$rutaProyecto = $argv[$i++];
$ruta = $rutaProyecto . '/app/bootstrap.php.cache';
print_r($ruta);
$loader = require_once $ruta;
require_once $rutaProyecto . '/app/AppKernel.php';
$kernel = new \AppKernel('dev', true);
$procesoiniciaGeneracionPlanoFes= new ProcesoIniciaGenerarPlanoFes($idAcceso, $idEmpresa, $idCiclo, $idProceso ,$usuario);
$procesoiniciaGeneracionPlanoFes->run();

