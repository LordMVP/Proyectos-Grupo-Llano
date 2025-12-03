<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Genera una financiación, Reestructura
 *
 * @author hrey
 */
class MovimientosContablesModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Construye un movimiento en estado Generado = G
     * @param int $idempresa identificador de la empresa
     * @param int $idusuario identificador del usuario
     * @return int identificador del movimiento
     */
    public function crearMovimiento($idempresa, $idusuario, $idciclo, $idperiodo, $cicloanio, $idperiodoCerrado) {
        $data['mvi_fecha'] = 'now()';
        $data['mvi_estado'] = 'G';
        $data['emp_ideregistro'] = $idempresa;
        $data['usu_ideregistro'] = $idusuario;
        $data['cic_ideregistro'] = $idciclo;
        $data['per_ideregistro'] = $idperiodoCerrado != 0 ? $idperiodoCerrado : $idperiodo ;
        $data['cic_ano'] = $cicloanio;
        return $this->insertar($data, 'mvi_movimiento', 'sq_mvi_ideregistro');
    }

    /**
     * permite procesar la causión contable
     * @param int $idmovimiento identificador de movimiento para la transacción
     * @param int $idusuario identificador del usuario
     * @return int consecutivo de ultima factura procesada
     */
    public function procesarMovimientoContable($idmovimiento, $idusuario, $idproceso, $idempresa, $idperiodoCerrado) {
        $parametros['idmovimiento'] = $idmovimiento;
        $parametros['idusuario'] = $idusuario;
        $parametros['idproceso'] = $idproceso;
        $parametros['idempresa'] = $idempresa;
        $parametros['idperiodocerrado'] = $idperiodoCerrado;
        print_r("llama desde el modelo a la funcion ...");
        print_r($parametros);
        $sql = "SELECT FX_GENERAR_MOVIMIENTOS_CONTABLES registrosafectados FROM FX_GENERAR_MOVIMIENTOS_CONTABLES (:idmovimiento,:idusuario, :idproceso, :idempresa, :idperiodocerrado);";
        $respuesta = $this->executeQuery($sql, $parametros);
        if ($respuesta[0]['registrosafectados'] == 0) {
            return null;
        }
        return $respuesta[0];
    }

}
