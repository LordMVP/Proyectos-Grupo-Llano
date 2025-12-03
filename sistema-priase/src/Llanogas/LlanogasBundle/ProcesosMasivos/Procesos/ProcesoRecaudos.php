<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoRecaudosModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoRemoverValorSuspensionReconexion;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class ProcesoRecaudos {

    /**
     * @var array
     */
    private $parametros;

    /**
     * 
     * @var int identificador del proceso que se está ejecutando 
     */
    private $idProceso;

    /**
     * Información de la sesión
     * @var array 
     */
    private $sesion;

    /**
     *
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoRecaudosModel 
     */
    private $procesoRecaudosModel;

    /**
     *
     * @var ProcesoSuspensionModel 
     */
    private $procesoSuspensionModel;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;
    private $recaudosAplicados = 0;

    /**
     *
     * @var ProcesoRemoverValorSuspensionReconexion 
     */
    private $procesoRemoverValorSuspensionReconexion;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * @var array
     */
    private $informacionVersionRecaudo;

    public function __construct(array $parametros) {
        $this->idCiclo = -1;
        $this->parametros = $parametros;
        $this->recaudosAplicados = 0;
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoRecaudosModel = new ProcesoRecaudosModel($this->conexion);
        $this->procesoSuspensionModel = new ProcesoSuspensionModel($this->conexion);
        $this->procesoRemoverValorSuspensionReconexion = new ProcesoRemoverValorSuspensionReconexion($parametros);
        $this->sesion = $this->genericoModel->getInfoSesion($parametros['idacceso']);
        if (isset($parametros['idciclo'])) {
            $this->idCiclo = $parametros['idciclo'];
        }
        $this->idprograma = $parametros['idprograma'];
    }

    public function getRecaudosDisponibleTipoSuscripcion($idTipoSuscripcion, $inicio) {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->procesoRecaudosModel->getRecaudosDisponibleTipoSuscripcion($idTipoSuscripcion, $idEmpresa, $inicio);
    }

    public function getRecaudosDisponibleCiclo($idCiclo, $inicio) {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->procesoRecaudosModel->getRecaudosDisponibleCiclo($idCiclo, $idEmpresa, $inicio);
    }

    public function iniciar(array &$listaRecaudos) {
        foreach ($listaRecaudos as $recaudo) {
            /*
             * Se valida si el mismo idRecaudo esta distribuido en varios dire se toma el valor de la versión
             * que almacena el array global de la información del rec_ideregisro y rec_version que se va asignando 
             * al recaudo en la medida que se va aplicando .
             */
            if (!empty($this->informacionVersionRecaudo) && $this->informacionVersionRecaudo['rec_ideregistro'] == $recaudo['idrecaudo']) {
                $recaudo['version'] = $this->informacionVersionRecaudo['rec_version'];
            }

            $this->procesarRecaudoPorProceso($recaudo);
        }
        $this->quitarValor();
    }

    /**
     * Método encargado de quitar el valor de reconexion y/o suspesión cuando 
     * el usuario paga antes de ejecutar 
     */
    public function quitarValor() {
        try {
            print_r(" Se inician a quitar valores de suspensiones");
            $this->procesoRemoverValorSuspensionReconexion->iniciar($this->idCiclo);
        } catch (\Exception $e) {
            print_r($e->getMessage());
        }
    }

    /**
     * Se actualizan todas las gestiones de la cartera a estado cerrado 'C'
     * solo en el proceso de cierre recaudos.
     */
    public function actualizarEstadoCartera() {
        $this->procesoSuspensionModel->actualizarEstadoGestionCartera($this->idCiclo);
    }

    private function procesarRecaudoPorProceso(&$recaudo) {
        try {
            $recaudo['idusuario'] = $this->sesion['idusuario'];
            switch ($this->idprograma) {
                case COD_PROCESO_APLICAR_RECAUDOS:
                    if ($recaudo['tiporecaudo'] == 'AN') {
                        $this->procesarRecaudoAnticipo($recaudo);
                        break;
                    }
                    $this->procesarRecaudo($recaudo);
                    break;
                case COD_PROCESO_CERRAR_RECAUDOS:
                    $this->procesarRecaudo($recaudo);
                    break;
            }
        } catch (\Exception $e) {
            print_r($e->getTraceAsString());
        }
        $this->actualizarRegistros();
    }

    private function procesarRecaudo(array &$infoRecaudo) {
        $mensaje_Temporal = '';
        try {
            $infoRecaudo['cicloperiodo'] = $this->genericoModel->getCicloPeriodoSuscripcion($infoRecaudo['idsuscripcion']);
            $mensaje_Temporal = ' Ciclo' . $infoRecaudo['cicloperiodo']['ciclo'] . ' Periodo ' . $infoRecaudo['cicloperiodo']['periodo'];
            $listaFacturas = $this->genericoModel->getFacturasConSaldo($infoRecaudo['idsuscripcion']);
            if (empty($listaFacturas)) {
                $this->insertarTemporal($infoRecaudo, 'N', 'No hay facturas para aplicar recaudo: ' . $mensaje_Temporal);
                print_r($infoRecaudo['idrecaudo'] . " No hay facturas para aplicar recaudo \n");
                return;
            }
            $this->conexion->beginTransaction();
            foreach ($listaFacturas as $factura) {
                $listaConceptos = $this->genericoModel->getConceptos($factura['idfactura']);
                $this->procesarConceptos($infoRecaudo, $factura, $listaConceptos);
                $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $factura['version']);
            }
            /*
             * Se ajusta la siguiente Linea porque cuando hay multiples distribuciones de los anticipos este 
             * metodo solo retorna el primer dire que encuentra y sobre ese modifica el saldo y la versión 
             * Metodo antes usando  $this->genericoDelegado->actualizarRecaudoSaldo($infoRecaudo['idrecaudo'], $infoRecaudo['version'], $infoRecaudo['idsuscripcion']);
             */
            $this->informacionVersionRecaudo = $this->genericoDelegado->actualizarRecaudoDistribucionSaldo($infoRecaudo['iddistribucion'], $infoRecaudo['version'], $infoRecaudo['idrecaudo']);
            $this->conexion->commit();
            $mensaje = 'Se procesó correctamente el recaudo: ' . $mensaje_Temporal;
            $estado = 'G';
        } catch (\Exception $e) {
            print_r("Error al procesar el recaudo " . $infoRecaudo['idrecaudo'] . "\n");
            print_r($e->getMessage() . "\n");
            $this->conexion->rollBack();
            $mensaje = $e->getMessage();
            $estado = 'F';
        }
        $this->insertarTemporal($infoRecaudo, $estado, $mensaje);
    }

    private function procesarRecaudoAnticipo(array &$infoRecaudo) {
        $mensaje_Temporal = '';
        try {
            $versionRecaudo = $this->procesoRecaudosModel->getVersionRecaudo($infoRecaudo['idrecaudo']);
            $infoRecaudo['cicloperiodo'] = $this->genericoModel->getCicloPeriodoSuscripcion($infoRecaudo['idsuscripcion']);
            $mensaje_Temporal = ' Ciclo' . $infoRecaudo['cicloperiodo']['ciclo'] . ' Periodo ' . $infoRecaudo['cicloperiodo']['periodo'];
            $listaDistribucionRecaudo = $this->genericoModel->getDistribucionPorId($infoRecaudo['iddistribucion']);
            foreach ($listaDistribucionRecaudo as $distribucionRecaudo) {
                $this->conexion->beginTransaction();
                if (!is_numeric($distribucionRecaudo['idtipodocumento'])) {
                    throw new MyException('Error, el tipo de documento es obligatorio idsuscripcion:' . $infoRecaudo['idsuscripcion'], -1);
                }
                $listaFacturas = $this->procesoRecaudosModel->getFacturasConSaldoAnticipo($distribucionRecaudo);
                if (empty($listaFacturas)) {
                    if ($this->conexion->isTransactionActive()) {
                        $this->conexion->rollBack();
                    }
                    $this->insertarTemporal($infoRecaudo, 'N', 'No hay facturas para procesar : ' . $mensaje_Temporal);
                    print_r("Suscripción: " . $infoRecaudo['idsuscripcion'] . " -----  " . $infoRecaudo["idrecaudo"] . " No hay facturas para procesar \n");
                    continue;
                }
                foreach ($listaFacturas as $factura) {
                    $distribucionRecaudo['idfactura'] = $factura['idfactura'];
                    print_r("Distribucion recaudo \n");
                    print_r($distribucionRecaudo);
                    $listaConceptos = $this->procesoRecaudosModel->getConceptosSaldoAnticipos($distribucionRecaudo);
                    print_r($listaConceptos);
                    $this->procesarConceptos($infoRecaudo, $factura, $listaConceptos);
                    $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $factura['version']);
                }
                /*
                 * Se adiciona variable global para ir tomando la versión del recaudo que se va a actualizando 
                 * en la medida que se va aplicando el recaudo .
                 */
                $this->informacionVersionRecaudo = $this->genericoDelegado->actualizarRecaudoDistribucionSaldo($infoRecaudo['iddistribucion'], $versionRecaudo, $infoRecaudo['idrecaudo']);
                $this->procesoRecaudosModel->actualizarFechaAplicacion($infoRecaudo['idrecaudo']);
                $this->conexion->commit();
                $mensaje = 'Se procesó correctamente el recaudo ' . $mensaje_Temporal;
                $estado = 'G';
                $infoRecaudo['version'] ++;
                $this->insertarTemporal($infoRecaudo, $estado, $mensaje);
            }
        } catch (\Exception $e) {
            print_r("Error al procesar el recaudo " . $infoRecaudo['idrecaudo'] . "\n");
            print_r($e->getMessage() . "\n");
            $this->conexion->rollBack();
            $mensaje = $e->getMessage() . ' ' . $mensaje_Temporal;
            $estado = 'F';
            $this->insertarTemporal($infoRecaudo, $estado, $mensaje);
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
        }
    }

    private function procesarConceptos(array &$infoRecaudo, array &$factura, array $listaConceptos) {
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos para aplicar recaudos ' . $factura['idfactura'], -1);
        }
        foreach ($listaConceptos as $concepto) {
            if ($infoRecaudo['disponible'] == 0) {
                return;
            }
            if ($concepto['saldo'] == 0) {
                continue;
            }
            $saldo = round($infoRecaudo['disponible'] - $concepto['saldo'], CANTIDAD_DECIMALES);
            $valorPagar = ($saldo < 0) ? $infoRecaudo['disponible'] : $concepto['saldo'];
            $concepto['valorpagar'] = $valorPagar;
            $infoRecaudo['disponible'] = $infoRecaudo['disponible'] - $valorPagar;
            $this->procesoRecaudosModel->insertarDetalleRecaudo($infoRecaudo, $concepto, $factura);
            $this->procesoRecaudosModel->insertarFacturaRecaudo($infoRecaudo, $factura);
        }
    }

    private function actualizarRegistros() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->aumentarCantidadRegistro($this->idProceso);
            $this->conexion->commit();
            print_r("Actualizando registros del proceso \n");
        } catch (\Exception $e) {
            print_r($e->getMessage() . " \n");
            $this->conexion->rollBack();
        }
    }

    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            if ($this->recaudosAplicados == 0 || empty($this->recaudosAplicados)) {
                $this->insertarTemporal(null, 'T', MENSAJE_SIN_FACTURAS);
            }

            $this->procesoModel->finalizarProceso($this->idProceso);
            $this->conexion->commit();
            print_r("Se finaliza el proceso " . $this->idProceso . " \n");
        } catch (\Exception $e) {
            print_r($e->getMessage() . " \n");
            $this->conexion->rollBack();
        }
    }

    public function registrarProceso($idPrograma) {
        $proceso['estado'] = 'A';
        $proceso['fechaInicio'] = 'now()';
        $proceso['idPrograma'] = $idPrograma;
        $proceso['idAcceso'] = $this->sesion['idacceso'];
        $proceso['idEmpresa'] = $this->sesion['idempresa'];
        $proceso['idHilo'] = 1;
        $this->idProceso = $this->procesoModel->insertarProceso($proceso);
    }

    public function vaciarTabla() {
        $this->procesoRecaudosModel->vaciarTabla($this->sesion['idempresa']);
    }

    public function crearTabla() {
        $this->procesoRecaudosModel->crearTabla($this->sesion['idempresa']);
    }

    public function insertarTemporal($infoRecaudo, $estado, $mensaje) {
        try {
            $this->conexion->beginTransaction();
            $registro['iddistribucion'] = $infoRecaudo['iddistribucion'];
            $registro['idrecaudo'] = $infoRecaudo['idrecaudo'];
            $registro['idsuscripcion'] = $infoRecaudo['idsuscripcion'];
            $registro['estado'] = $estado;
            $registro['mensaje'] = $mensaje;
            $registro['idusuario'] = $this->sesion['idusuario'];
            $this->recaudosAplicados++;

            $this->procesoRecaudosModel->insertarTablaTemporal($registro, $this->sesion['idempresa']);
            $this->conexion->commit();
            print_r("Insertando en tabla temporal \n");
        } catch (\Exception $e) {
            print_r($e->getMessage());
            $this->conexion->rollBack();
        }
    }

}
