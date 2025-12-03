<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ProcesoFacturacionModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Delegado\FacturarSuscripcionDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class ProcesoFacturacion {

    /**
     * @var array
     */
    private $parametros;

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var ProcesoFacturacionModel 
     */
    private $procesoFacturacionModel;

    /**
     *
     * @var FacturarSuscripcionDelegado 
     */
    private $facturarSuscripcionDelegado;

    /**
     *
     * @var array 
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var array información del ciclo que se quiere procesar  
     */
    private $cicloPeriodo;

    /**
     *
     * @var ProcesoModel
     */
    private $procesoModel;

    /**
     *
     * @var int 
     */
    private $idControlProceso;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Delegado\GenericoDelegado 
     */
    private $GenericoDelegado;
    
    /**
     *
     * @var array información del Conceptos de Marcacion 
     */
    private $conceptosMarcacionAseo;

    public function __construct(array $parametros) {
        $this->parametros = $parametros;
        $this->conexion = ConexionBD::getConexion();
        $this->procesoFacturacionModel = new ProcesoFacturacionModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($parametros['idacceso']);
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($parametros['idciclo']);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->GenericoDelegado = new GenericoDelegado($this->conexion);
        $this->conceptosMarcacionAseo = $this->genericoModel->getProcesosMarcacionAseo($parametros['idempresa']);
        $this->registrarProceso();
    }

    public function iniciar() {
        try {
            /**
             * Se consultan todas las liquidaciones que le pertenecen al proceso que se está ejecutando
             */
            $this->cargarLiquidaciones();
            $this->procesarSuscripciones();
        } catch (MyException $e) {
            print_r('Se procede a finalizar el proceso ' . $this->idControlProceso);
            if ($e->getCode() == -4) {
                $this->actualizarRegistroProceso('F', $e->getMessage());
            }
            print_r($e);
        } catch (\Exception $e) {
            print_r($e);
            $this->conexion->rollBack();
        } finally {
            $this->finalizarProceso();
        }
    }

    /**
     * Consulta todas las liquidaciones para generar la liquidación
     * ésta información va a estar en memoria y se hace para no estar
     * consultando por cada suscripción la liquidación que le pertenece
     * @throws MyException
     */
    private function cargarLiquidaciones() {
        $listaLiquidaciones = $this->procesoFacturacionModel->getLiquidaciones($this->parametros['idproceso'], $this->sesion['idempresa']);
        if (empty($listaLiquidaciones)) {
            throw new MyException('No se encontraron liquidaciones ', -4);
        }
        foreach ($listaLiquidaciones as $liquidacion) {
            $this->cargarInformacionLiquidacion($liquidacion);
        }
    }

    /**
     * Se carga la información de una liquidación
     * @param type $idLiquidacion
     * @throws MyException
     */
    public function cargarLiquidacion($idLiquidacion) {
        $resultado = $this->procesoFacturacionModel->getLiquidacion($idLiquidacion);
        if (empty($resultado)) {
            throw new MyException('Error al liquidar la suscripción', -1);
        }
        $this->cargarInformacionLiquidacion($resultado[0]);
    }

    /**
     * Consulta todos los conceptos que se encuentran en la liquidación
     * @param array $liquidacion
     */
    private function cargarInformacionLiquidacion($liquidacion) {
        $liquidacion['conceptos'] = $this->procesoFacturacionModel->getConceptosLiquidacion($liquidacion['idliquidacion']);
        $this->listaLiquidaciones[] = $liquidacion;
    }

    /**
     * Se procede a liquidar todas las suscripciones del proceso
     * @return type
     */
    private function procesarSuscripciones() {
        $listaSuscripciones = $this->procesoFacturacionModel->getSuscripcionPorProceso($this->parametros['idproceso'], $this->sesion['idempresa']);
        if (empty($listaSuscripciones)) {
            print_r('No hay más suscripciones que procesar ' . $this->parametros['idproceso'] . "\r");
            return;
        }
        foreach ($listaSuscripciones as $suscripcion) {
            try {
                print_r('Procesando suscripcion ' . $suscripcion['idsuscripcion'] . "\n");
                $this->facturarSuscripcion($suscripcion);
            } catch (\Exception $e) {
                print_r($e->getMessage());
            }
        }
        $this->procesarSuscripciones();
    }

    /**
     * Método encargado de generar la factura de servicio de una suscripción
     * @param array $suscripcion
     * @return type
     * @throws \Exception
     */
    public function facturarSuscripcion(array &$suscripcion) {
        try {
            $estado = 'G';
            $mensaje = 'Factura generada correctamente ';
            $liquidacion = $this->buscarLiquidacion($suscripcion['idliquidacion']);
            $infoFactura['suscripcion'] = $suscripcion;
            $infoFactura['cicloperiodo'] = $this->cicloPeriodo;
            $infoFactura['liquidacion'] = $liquidacion;
            $this->conexion->beginTransaction();
            /**
             * Se valida si la suscripción ya tiene una factura 
             * para el ciclo periodo actual si es así ya no se liquida
             */
            $factura = $this->procesoFacturacionModel->getFacturaCicloPeriodoActual($infoFactura);
            if (empty($factura)) {
                $this->liquidarSuscripcion($infoFactura);
                /**
                 * Se genera el emitido en las tablas de faca_ dfcs_ dfci
                 */
                $this->generarSaldoCartera($suscripcion);
            } else {
                $estado = 'N';
                $mensaje = 'La suscipción ya fue liquidada';
            }
            $this->conexion->commit();
            /**
             * Actualiza la tabla temporal para que no vuelva a procesar la misma suscripción
             */
            $this->actualizarRegistro($suscripcion, $estado, $mensaje);
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            $estado = 'F';
            $mensaje = $e->getMessage();
            $this->actualizarRegistro($suscripcion, $estado, $mensaje);
            throw $e;
        }
        return $infoFactura;
    }

    /**
     * Registra la información de las facturas que van a salir para 
     * FES en la tabla del emitido faca_ dcsi
     * @param type $suscripcion
     * @return type
     */
    private function generarSaldoCartera(&$suscripcion) {
        $listaFacturasConSaldo = $this->procesoFacturacionModel->consultarFacturasConSaldo($suscripcion['idsuscripcion'], $suscripcion['idciclo']);
        if (empty($listaFacturasConSaldo)) {
            return;
        }
        foreach ($listaFacturasConSaldo as $factura) {
            $factura['idsuscripcion'] = $suscripcion['idsuscripcion'];
            $factura['idusuario'] = $this->sesion['idusuario'];
            $factura['idperiodo'] = $this->cicloPeriodo['idperiodo'];
            $factura['idciclo'] = $this->cicloPeriodo['idciclo'];
            $factura['cicloanio'] = $this->cicloPeriodo['cicloanio'];
            $this->procesoFacturacionModel->insertarFacturaCartera($factura);
            $this->procesoFacturacionModel->insertarDetallesInformativos($factura);
            $this->procesoFacturacionModel->insertarDetallesSuma($factura);
        }
    }

    /**
     * Método encargado de invocar el método genérico de liquidación 
     * @param array $infoFactura
     */
    private function liquidarSuscripcion(array &$infoFactura) {
        $this->facturarSuscripcionDelegado = new FacturarSuscripcionDelegado($this->conexion, $this->parametros['idacceso'], $infoFactura['suscripcion']['idsuscripcion'], PROGRAMA_FACTURAR_PERIODO);
        foreach ($infoFactura['liquidacion']['conceptos'] as $concepto) {
            /**
             * *Si los conceptos están parametrizados de que no preliquidar significa que lo liquida el sistema
             * * Si el concepto dice que preliquida está condicionado a lo que el usuario escoja en la interfaz,
             *   si se escoge que si el sistema lo preliquida de lo contrario se registra el concepto en 0
             */
            if (($concepto['preliquidar'] == 'S' && $this->parametros['preliquidar'] == 'S') || $concepto['preliquidar'] == 'N') {
                $conceptoLiquidado = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $infoFactura['liquidacion']['idliquidacion']);
            } else {
                /**
                 * Registra el concepto vació
                 */
                $conceptoLiquidado = $this->getConceptoSinPreliquidar($concepto);
            }
            $infoFactura['conceptos'][] = $conceptoLiquidado;
        }
        $this->crearFactura($infoFactura);


        switch ($this->sesion['idempresa']) {
            case 317 :
                $this->procesarDetallesFacturasAseo($infoFactura);
                break;
            default :
                $this->procesarDetallesFacturas($infoFactura);
                break;
        }
        $this->actualizarValorFactura($infoFactura['factura']['idfactura']);
        $this->facturarSuscripcionDelegado = null;
    }

    /**
     * Suma los detalles de la factura
     * @param type $idFactura
     */
    private function actualizarValorFactura($idFactura) {
        $valor = $this->procesoFacturacionModel->getValorFactura($idFactura);
        $factura['fac_ideregistro'] = $idFactura;
        $factura['fac_vlrreal'] = $valor;
        $factura['fac_sdoreal'] = $valor;
        $this->procesoFacturacionModel->actualizar($factura, "fac_factura", "fac_ideregistro=:fac_ideregistro");
    }

    /**
     * Busca en memoria la liquidación 
     * @param type $idLiquidacion
     * @return type
     * @throws MyException
     */
    private function buscarLiquidacion($idLiquidacion) {
        foreach ($this->listaLiquidaciones as $liquidacion) {
            if ($liquidacion['idliquidacion'] == $idLiquidacion) {
                return $liquidacion;
            }
        }
        throw new MyException('No se encontró la liquidación ' . $idLiquidacion, -1);
    }

    /**
     * Diligencia los conceptos que no se van a liquidar por el 
     * sistema
     * @param type $concepto
     * @return int
     */
    private function getConceptoSinPreliquidar($concepto) {
        $concepto['valorunitario'] = 0;
        $concepto['valortotal'] = 0;
        $concepto['valorreal'] = 0;
        $concepto['cantidad'] = 1;
        return $concepto;
    }

    /**
     * Registra la factura 
     * @param array $infoFactura
     */
    private function crearFactura(array &$infoFactura) {
        $fechaFacturas = $this->getFechasFactura($infoFactura);
        $valorTotal = 0;
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'G';
        $factura['fecha'] = 'now()';
        $factura['fechavencimiento'] = $fechaFacturas['fechavencimiento'];
        $factura['idempresa'] = $infoFactura['suscripcion']['idempresa'];
        $factura['idsuscriptor'] = $infoFactura['suscripcion']['idsuscriptor'];
        $factura['idsuscripcion'] = $infoFactura['suscripcion']['idsuscripcion'];
        $factura['idtiposuscripcion'] = $infoFactura['suscripcion']['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $infoFactura['suscripcion']['idtipousosuscripcion'];
        $factura['idliquidacion'] = $infoFactura['liquidacion']['idliquidacion'];
        $factura['idtercero'] = $infoFactura['suscripcion']['idtercero'];
        $factura['idciclo'] = $infoFactura['cicloperiodo']['idciclo'];
        $factura['idperiodo'] = $infoFactura['cicloperiodo']['idperiodo'];
        $factura['iddocumento'] = $infoFactura['liquidacion']['iddocumento'];
        $factura['idtipodocumento'] = $infoFactura['liquidacion']['idtipodocumento'];
        $factura['cicloano'] = $infoFactura['cicloperiodo']['cicloanio'];
        $factura['idhistoricoliquidacion'] = 0;
        $factura['saldofactura'] = $valorTotal;
        $factura['idtipotercero'] = $infoFactura['suscripcion']['idtipotercero'];
        $factura['fechasuspende'] = $fechaFacturas['fechasuspension'];
        $factura['version'] = 1;
        $factura['valortotal'] = $valorTotal;
        $factura['fechaaprobacion'] = 'now()';
        $factura['idusuario'] = $this->sesion['idusuario'];
        $factura['idfactura'] = $this->genericoModel->insertarFactura($factura);
        $infoFactura['factura'] = $factura;
    }

    /**
     * Inserta los detalles de factura 
     * @param type $infoFactura
     */
    private function procesarDetallesFacturas(&$infoFactura) {
        foreach ($infoFactura['conceptos'] as $concepto) {
            $detalleFactura['estado'] = 'A';
            $detalleFactura['cantidad'] = $concepto['cantidad'];
            $detalleFactura['valorunitario'] = $concepto['valorunitario'];
            $detalleFactura['valortotal'] = $concepto['valortotal'];
            $detalleFactura['valorreal'] = $concepto['valorreal'];
            $detalleFactura['saldoreal'] = $concepto['valorreal'];
            $detalleFactura['idfactura'] = $infoFactura['factura']['idfactura'];
            $detalleFactura['idconcepto'] = $concepto['idconcepto'];
            $detalleFactura['version'] = 1;
            $detalleFactura['idusuario'] = $this->sesion['idusuario'];
            $detalleFactura['idempresa'] = $this->sesion['idempresa'];
            $detalleFactura['emp_ideregistro'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($detalleFactura);
            $infoFactura['detalle'][] = $detalleFactura;
        }
    }

    /**
     * Se consultan las fechas de vencimiento y de suspensión de acuerdo 
     * a la tabla rupe
     * @param type $infoFactura
     * @return type
     */
    private function getFechasFactura(&$infoFactura) {
        return $this->GenericoDelegado->getFechaFactura($infoFactura['suscripcion'], $infoFactura['cicloperiodo']);
    }

    /**
     * Ingresa un registro en la tabla cpr_
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_FACTURAR_PERIODO;
            $proceso['idAcceso'] = $this->parametros['idacceso'];
            $proceso['idEmpresa'] = $this->parametros['idempresa'];
            $proceso['idHilo'] = $this->parametros['idproceso'];
            $this->idControlProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Finalizar proceso
     */
    public function finalizarProceso() {
        try {
            $this->finalizarTransaccion();
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Aumenta la cantidad de registros procesados por el hilo
     * @param type $suscripcion
     * @param type $estado
     * @param type $mensaje
     */
    private function actualizarRegistro($suscripcion, $estado, $mensaje) {
        try {
            $this->finalizarTransaccion();
            $this->conexion->beginTransaction();
            $this->procesoFacturacionModel->actualizarRegistroProceso($suscripcion['idsuscripcion'], $estado, $mensaje, $this->sesion['idempresa']);
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function actualizarRegistroProceso($estado, $mensaje) {
        try {
            $this->finalizarTransaccion();
            $this->conexion->beginTransaction();
            $this->procesoFacturacionModel->actualizarRegistroMasivo($this->parametros['idproceso'], $estado, $mensaje, $this->sesion['idempresa']);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Se finaliza el proceso 
     */
    public function finalizarTransaccion() {
        if ($this->conexion->isTransactionActive()) {
            $this->conexion->rollBack();
        }
    }

    private function consultaConceptoLiquidado($concepto, $infoFactura) {
        foreach ($infoFactura['conceptos'] as $conceptoliquidado) {
            if ($conceptoliquidado['idconcepto'] == $concepto['idconcepto']) {
                return $conceptoliquidado;
            }
        }
    }

    public function depuracionConceptosAseo($concepto, $infoFactura) {
        foreach ($this->conceptosMarcacionAseo as $conceptoMarcacion) {
            $liquidacionConceptoMarcacion = $this->consultaConceptoLiquidado($conceptoMarcacion, $infoFactura);
            print_r("\n ConceptoMarcacion Liquidado");
            print_r($liquidacionConceptoMarcacion);
            if (empty($liquidacionConceptoMarcacion || $concepto['valortotal'] == 0)) {
            print_r("\n No Aplica Marcacion Retornando Concepto ");                  
                return $concepto;
            }

            if ($conceptoMarcacion['deshabitado'] == 'S' && $concepto['deshabitado'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['puertapuerta'] == 'S' && $concepto['puertapuerta'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['aforadoaseo'] == 'S' && $concepto['aforadoaseo'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['noaforado'] == 'S' && $concepto['aforadoaseo'] == 'X') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['aplicadinc'] == 'S' && $concepto['aplicadinc'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['noaplicadinc'] == 'S' && $concepto['aplicadinc'] == 'X') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['homogasaseo'] == 'S' && $concepto['homologacion'] == 'A') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['homoenergia'] == 'S' && $concepto['homologacion'] == 'E') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['tarifaplena'] == 'S' && $concepto['tarifaplena'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
            if ($conceptoMarcacion['aforadotercero'] == 'S' && $concepto['aforadotercero'] == 'S') {
                $concepto = $this->aplicarDepuracionConceptosAseo($concepto, $liquidacionConceptoMarcacion);
                continue;
            }
        }

        print_r("\n Concepto Depurado Final");
        print_r($concepto);
        return $concepto;
    }

    /**
     * Inserta los detalles de factura 
     * @param type $infoFactura
     */
    private function procesarDetallesFacturasAseo(&$infoFactura) {
        foreach ($infoFactura['conceptos'] as $concepto) {
            $concepto = $this->depuracionConceptosAseo($concepto, $infoFactura);
            $detalleFactura['estado'] = 'A';
            $detalleFactura['cantidad'] = $concepto['cantidad'];
            $detalleFactura['valorunitario'] = $concepto['valorunitario'];
            $detalleFactura['valortotal'] = $concepto['valortotal'];
            $detalleFactura['valorreal'] = $concepto['valorreal'];
            $detalleFactura['saldoreal'] = $concepto['valorreal'];
            $detalleFactura['idfactura'] = $infoFactura['factura']['idfactura'];
            $detalleFactura['idconcepto'] = $concepto['idconcepto'];
            $detalleFactura['version'] = 1;
            $detalleFactura['idusuario'] = $this->sesion['idusuario'];
            $detalleFactura['idempresa'] = $this->sesion['idempresa'];
            $detalleFactura['emp_ideregistro'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($detalleFactura);
            $infoFactura['detalle'][] = $detalleFactura;
        }
    }

    private function aplicarDepuracionConceptosAseo($conceptoDepurar, $conceptoMarcacionLiquidado) {
        $conceptoDepurar['valorunitario'] = $conceptoDepurar['valorunitario'] * $conceptoMarcacionLiquidado['valortotal'];
        $conceptoDepurar['valortotal'] = $conceptoDepurar['valortotal'] * $conceptoMarcacionLiquidado['valortotal'];
        $conceptoDepurar['valorreal'] = $conceptoDepurar['valorreal'] * $conceptoMarcacionLiquidado['valortotal'];
        print_r("\n Concepto Marcacion Que Aplica");
        print_r($conceptoMarcacionLiquidado);
        
        print_r("\n Concepto Depurado");
            print_r($conceptoDepurar);
        return $conceptoDepurar;
    }

}
