<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\MovimientosContablesModel;

/**
 * Proceso de aplicar recaudos.
 *
 * @author hrey
 */
class ProcesoGenerarMovimientoContable {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idPeriodo;
    private $cicloanio;
    private $idUsuario;
    private $idEmpresa;
    private $idperiodoCerrado;
    private $conexion;
    private $movimientosContablesModel;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;

    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idPeriodo, $cicloanio, $idAcceso, $codigoProceso, $idperiodoCerrado) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->cicloanio = $cicloanio;
        $this->idPeriodo = $idPeriodo;
        $this->idperiodoCerrado = $idperiodoCerrado;
        $this->conexion = ConexionBD::getConexion();
        $this->movimientosContablesModel = new MovimientosContablesModel($this->conexion);
        $this->codigoProceso = $codigoProceso;
        $this->procesoModel = new ProcesoModel($this->conexion);
    }

    /**
     * Inicia el proceso de generar el movimiento contable
     */
    public function iniciar() {
        $identificadorMovimiento = $this->crearMovimiento();
        try {            print_r("llama a la funcion");
            $this->generarMovimientosContables($identificadorMovimiento, $this->idUsuario);
        } catch (\Exception $e) {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            print_r($e->getMessage());
            $this->procesoModel->finalizarProceso($this->codigoProceso);
            $this->insertarErrorMovimiento($identificadorMovimiento, $e->getMessage());
        }
    }

    /**
     * construye el movimiento contable 
     * @return int identificador del movimiento contable a procesar
     */
    private function crearMovimiento() {

        return $this->movimientosContablesModel->crearMovimiento($this->idEmpresa, $this->idUsuario, $this->idCiclo, $this->idPeriodo, $this->cicloanio, $this->idperiodoCerrado);
    }

    /**
     * permite realizar la carga de procesamiento de las causiones contables
     * @param type $identificadorMovimiento
     */
    public function generarMovimientosContables($identificadorMovimiento, $idusuario) {
        $this->movimientosContablesModel->procesarMovimientoContable($identificadorMovimiento, $idusuario, $this->codigoProceso, $this->idEmpresa, $this->idperiodoCerrado);
    }

    private function insertarErrorMovimiento($idMovimiento, $comentario) {
        $datos['mvi_ideregistro'] = $idMovimiento;
        $datos['mver_fecha'] = 'now()';
        $datos['emp_ideregistro'] = $this->idEmpresa;
        $datos['usu_ideregistro'] = $this->idUsuario;
        $datos['cic_ideregistro'] = $this->idCiclo;
        $datos['per_ideregistro'] = $this->idPeriodo;
        $datos['mver_comentario'] = $comentario;
        $this->movimientosContablesModel->insertar($datos, 'mver_moverrores', null);
    }

}
