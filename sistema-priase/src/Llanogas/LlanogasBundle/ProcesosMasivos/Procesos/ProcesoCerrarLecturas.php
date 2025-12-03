<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Proceso de aplicar recaudos.
 *
 * @author hrey
 */
class ProcesoCerrarLecturas {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idUsuario;
    private $idEmpresa;
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Delegado\CerrarLecturasGenericoDelegado
     */
    private $cerrarLecturasDelegado;

    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $codigoProceso) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->codigoProceso = $codigoProceso;
    }

    /**
     * Inicia el proceso de cerrar lecturas  
     */
    public function iniciar() {
        $this->cerrarLecturasDelegado = new \Llanogas\LlanogasBundle\Delegado\CerrarLecturasGenericoDelegado();
        $this->cerrarLecturasDelegado->procesarEncabezado($this->idCiclo, $this->idEmpresa, $this->codigoProceso, $this->idUsuario);
    }

}
