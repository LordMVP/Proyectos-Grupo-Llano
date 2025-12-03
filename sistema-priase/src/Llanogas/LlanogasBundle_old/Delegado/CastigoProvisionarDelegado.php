<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\CastigoProvisionarModel;
use Llanogas\LlanogasBundle\Models\CastigoCastigarModel;

/**
 * Description of RecuperacionProvisionDelegado
 *
 * @author hrey
 */
class CastigoProvisionarDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * Información de la sesión
     * @var array
     */
    private $sesion;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var CastigoProvisionarModel 
     */
    private $castigoProvisionarModel;

    /**
     *
     * @var CastigoCastigarModel
     */
    private $castigoCastigarModel;

    /**
     *
     * @var array 
     */
    private $infoSuscripcion;

    public function __construct($idAcceso, &$conexion = null) {
        $this->conexion = $conexion;
        //Se verifica que la conexión sea nula y si es asi se realiza la conexión a la base de datos
        if (empty($conexion)) {
            $this->conexion = ConexionBD::getConexion();
        }
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->castigoProvisionarModel = new CastigoProvisionarModel($this->conexion, $this->sesion);
        $this->castigoCastigarModel = new CastigoCastigarModel($this->conexion, $this->sesion);
    }

    /**
     * Función encargada de consultar todas las facturas que cumplen el tiempo para 
     * realizar la provisión
     * @param type $idCiclo identificador del ciclo
     */
    public function provisionarFacturasCarteraNormal($idCiclo) {
        $listaFacturas = $this->castigoProvisionarModel->getFacturasCarteraNormal($idCiclo);
        //Finaliza el método si no hay facturas para provisionar
        if (empty($listaFacturas)) {
            return;
        }
        foreach ($listaFacturas as $factura) {
            $this->procesarFacturaNormal($factura);
        }
    }

    /**
     * Consulta todas las facturas de una suscripción específica 
     * que cumplen para realizar la provisión
     * @param type $idSuscripcion identificador de la suscripción
     */
    public function provisionarFacturasCarteraNormalSuscripcion($idSuscripcion) {
        $listaFacturas = $this->castigoProvisionarModel->getFacturasCarteraNormal(NULL, $idSuscripcion);
        //Finaliza el método si no hay facturas
        if (empty($listaFacturas)) {
            return;
        }
        foreach ($listaFacturas as $factura) {
            $this->procesarFacturaNormal($factura);
        }
    }

    /**
     * Método encargado de realizar la provisión de una factura
     * @param type $factura información de la factura a provisionar 
     * @throws MyException Error si la factura yo fue provisionada 
     */
    private function procesarFacturaNormal($factura) {
        try {
            $this->conexion->beginTransaction();
            $cantidad = $this->castigoProvisionarModel->validarProvisiones($factura['idfactura']);
            //Se valida que si la factura tiene 13 meses sólo debe tener una provisión 
            //y si la factura tiene 25 meses se valdia que tenga únicamente una  provisión
            //Si no se cumple se lanza una excepción 
            if (($factura['meses'] >= 13 && $cantidad > 0) || ($factura['meses'] >= 25 && $cantidad > 1)) {
                throw new MyException('Error la factura ya tiene una provisión ' . $factura['idfactura'], -3);
            }
            //Crea la factura de provisión de acuerdo a la factura original
            $this->crearFacturaCarteraNormal($factura);
            $this->insertarLog($factura['idfactura'], 'G', 'Se provisionó correctamente', NULL);
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            if ($ex->getCode() != -3) {
                $this->insertarLog($factura['idfactura'], 'F', $ex->getMessage(), NULL);
            }
        }
    }

    /**
     * Método encargado de crear la factura de provisión 
     * @param array $factura Información de la factura que se va a provisionar 
     */
    private function crearFacturaCarteraNormal($factura) {
        $infoFactura = $this->genericoModel->getFactura($factura['idfactura']);
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFactura['idsuscripcion']);
        $this->infoSuscripcion = $infoFactura;
        $this->infoSuscripcion = $infoSuscripcion;
        //Se generar el documento de tipo PR de acuerdo al documento y tipo de documento 
        //Que tenga la factura inicial u original
        $infoDocumentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($infoFactura['iddocumento'], $infoFactura['idtipodocumento'], 'PR');
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
        //Se consulta la fecha de vencimiento que tiene la ruta de la suscripción
        $fechas = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'P';
        $parametros['fecha'] = 'now()';
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = $fechas['fechavencimiento'];
        $parametros['idempresa'] = $infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $infoFactura['idliquidacion'];
        $parametros['idtercero'] = $infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoDocumentoProvision['iddocumento'];
        $parametros['idtipodocumento'] = $infoFactura['idtipodocumento'];
        $parametros['cicloano'] = $cicloPeriodo['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = 0;
        $parametros['idfacturaorigen'] = $infoFactura['idfactura'];
        $parametros['idtipotercero'] = $infoSuscripcion['idtipotercero'];
        $parametros['fechasuspende'] = $fechas['fechasuspension'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = 0;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        $parametros['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($parametros);
        //Se inicia a provisionar los detalles de la factura 
        $this->provisionarDetallesCarteraNormal($parametros);
        $this->genericoDelegado->actualizarFacturaSaldo($parametros['idfactura'], 1);
    }

    /**
     * Método encargado de realizar la provisión de los detalles de la factura
     * @param array $infoFacturaProvision  información de los detalles de provisión
     */
    private function provisionarDetallesCarteraNormal($infoFacturaProvision) {
        $listaDetalles = $this->genericoModel->getConceptosConSaldo($infoFacturaProvision['idfacturaorigen']);
        if (empty($listaDetalles)) {
            throw new MyException('Error la factura no tiene detalles', -1);
        }
        $cantidad = 0;
        foreach ($listaDetalles as $detalle) {
            //Se omite si el saldo del detalles es 0
            if ($detalle['saldo'] * PORCENTAJE_PROVISION == 0) {
                continue;
            }
            $detalleProvision['estado'] = 'A';
            $detalleProvision['iddetallefacturaorigen'] = $detalle['iddetallefactura'];
            $detalleProvision['cantidad'] = 1;
            //Este valor queda con todos los decimales 
            $detalleProvision['valorunitario'] = $detalle['saldo'] * PORCENTAJE_PROVISION;
            //El proceso de redondear se aplica sobre estos tres campos
            $detalleProvision['valortotal'] = $detalle['saldo'] * PORCENTAJE_PROVISION;
            $detalleProvision['valorreal'] = $detalle['saldo'] * PORCENTAJE_PROVISION;
            $detalleProvision['saldoreal'] = $detalle['saldo'] * PORCENTAJE_PROVISION;
            $detalleProvision['idfactura'] = $infoFacturaProvision['idfactura'];
            $detalleProvision['idconcepto'] = $detalle['idconcepto'];
            $detalleProvision['version'] = 1;
            $detalleProvision['idusuario'] = $this->sesion['idusuario'];
            $detalleProvision['idempresa'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($detalleProvision);
        }
    }

    /**
     * Método encargado de provisionar las facturas que provienen de una financiación 
     * @param type $idCiclo
     * @param type $idSuscripcion
     * @return type
     * @throws MyException
     */
    public function provisionarFacturasFinanciacion($idCiclo, $idSuscripcion = null) {
        $listaFinanciaciones = $this->castigoProvisionarModel->getFinanciacionProvisionar($idCiclo, $idSuscripcion);
        if (empty($listaFinanciaciones)) {
            return;
        }
        foreach ($listaFinanciaciones as $financiacion) {
            try {
                $this->conexion->beginTransaction();
                //Se consulta la información básica de la suscripción
                $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($financiacion['idsuscripcion']);
                $this->infoSuscripcion = $infoSuscripcion;
                //Se valida que la factura de amortización cumpla con 25 0 13 meses
                if ($financiacion['meses'] != 13 && $financiacion['meses'] != 25) {
                    throw new MyException('La financiación no cumple con el tiempo. id: ' . $financiacion['idfinanciacion'], -1);
                }
                //Se procede a procesar la financiación
                $this->procesarFinanciacion($financiacion);
                $this->insertarLog(NULL, 'G', 'Se provisionó correctamente la financiación', $financiacion['idfinanciacion']);
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $this->insertarLog(NULL, 'F', $e->getMessage(), $financiacion['idfinanciacion']);
            }
        }
    }

    /**
     * Método encargado de procesar la financiación 
     * @param type $financiacion financiación a generar provisión
     * @throws MyException
     */
    private function procesarFinanciacion($financiacion) {
        $infoFinanciacion = $this->castigoProvisionarModel->getInfoFinanciacion($financiacion['idsuscripcion'], $financiacion['idfinanciacion']);
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($financiacion['idsuscripcion']);
        //Se consultan todas las facturas que provienen de la financiación
        $listaFacturas = $this->castigoProvisionarModel->getFacturasFinanciacion($financiacion['idsuscripcion'], $financiacion['idfinanciacion']);
        if (empty($listaFacturas)) {
            throw new MyException('Error al provisionar la financiación ' . $financiacion['idfinanciacion'] . ' suscripción: ' . $financiacion['idsuscripcion'], -1);
        }
        foreach ($listaFacturas as $facturaOriginal) {
            //Se valida cuantas provisiones tiene la factura de provisión
            $cantidadProvision = $this->castigoProvisionarModel->validarProvisiones($facturaOriginal['idfactura']);
            //Si la cantidad es mayor a  0 significa que ya fue provisionada
            //Y no se puede provisionar hasta que alguna factura cumpla los 25 meses
            if ($cantidadProvision > 0 && $financiacion['meses'] != 25) {
                throw new MyException('La financiación ya fue provisionada ' . $financiacion['idfinanciacion'], -1);
            }
            //Crea la factura de provisión que surge de una financiación
            $facturaProvision = $this->crearFacturaCarteraFinanciacion($infoSuscripcion, $facturaOriginal);
            $this->crearDetalleCarteraFinanciacion($facturaProvision, $facturaOriginal, $infoFinanciacion);
            //La factura como se acaba de crear se asume que está en la versión 1 
            $this->genericoDelegado->actualizarFacturaSaldo($facturaProvision['idfactura'], 1);
        }
    }

    /**
     * Crea la factura de provisión 
     * @param type $infoSuscripcion información de la suscripción 
     * @param type $infoFactura información de la factura que se quiere provisionar 
     * @return array información de la factura provisionada
     */
    private function crearFacturaCarteraFinanciacion($infoSuscripcion, $infoFactura) {
        //Se consulta el documento de provisión para la factura 
        $infoDocumentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($infoFactura['iddocumento'], $infoFactura['idtipodocumento'], 'PR');
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
        $fechas = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'P';
        $parametros['fecha'] = 'now()';
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = $fechas['fechavencimiento'];
        $parametros['idempresa'] = $infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $infoFactura['idliquidacion'];
        $parametros['idtercero'] = $infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoDocumentoProvision['iddocumento'];
        $parametros['idtipodocumento'] = $infoFactura['idtipodocumento'];
        $parametros['cicloano'] = $cicloPeriodo['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = 0;
        $parametros['idfacturaorigen'] = $infoFactura['idfactura'];
        $parametros['idtipotercero'] = $infoSuscripcion['idtipotercero'];
        $parametros['fechasuspende'] = $fechas['fechasuspension'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = 0;
        $parametros['idfinanciacion'] = $infoFactura['idfinanciacion'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        $parametros['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($parametros);
        return $parametros;
    }

    private function crearDetalleCarteraFinanciacion($facturaProvision, $facturaOriginal, $infoFinanciacion) {
        //Detalles de la factura que tienen saldo 
        $listaDetalles = $this->genericoModel->getConceptosConSaldo($facturaOriginal['idfactura']);
        if (empty($listaDetalles)) {
            throw new MyException('Error la factura no tiene detalles ' . $facturaOriginal['idfactura'], -1);
        }
        //se saca el porcentaje que tiene la factura con respecto al valor total de la deuda de la financiación
        $porcentajeProvisionFactura = round($facturaOriginal['saldofactura'] / $infoFinanciacion['saldovencidas'], CANTIDAD_DECIMALES);
        //Se calcula el valor de provisión que le corresponde a la factura 
        $valorProvisionFactura = round($infoFinanciacion['valortotalfinanciacion'] * PORCENTAJE_PROVISION * $porcentajeProvisionFactura, CANTIDAD_DECIMALES);
        foreach ($listaDetalles as $detallesFacturaOriginal) {
            //Se saca el porcentaje que tiene el concepto respecto al valor de la deuda de la factura
            $porcentajeProvision = round($detallesFacturaOriginal['saldo'] / $facturaOriginal['saldofactura'], CANTIDAD_DECIMALES);
            //Se saca el valor a provisionar de la factura 
            $valorProvision = round(($valorProvisionFactura * $porcentajeProvision), CANTIDAD_DECIMALES);
            $detalleProvision['estado'] = 'A';
            $detalleProvision['iddetallefacturaorigen'] = $detallesFacturaOriginal['iddetallefactura'];
            $detalleProvision['cantidad'] = 1;
            //El valor unitario se registra con todos los decimales
            $detalleProvision['valorunitario'] = $detallesFacturaOriginal['saldo'] * PORCENTAJE_PROVISION;
            $detalleProvision['valortotal'] = $valorProvision;
            $detalleProvision['valorreal'] = $valorProvision;
            $detalleProvision['saldoreal'] = $valorProvision;
            $detalleProvision['idfactura'] = $facturaProvision['idfactura'];
            $detalleProvision['idconcepto'] = $detallesFacturaOriginal['idconcepto'];
            $detalleProvision['version'] = 1;
            $detalleProvision['iddetallefinanciacion'] = $detallesFacturaOriginal['iddetallefinanciacion'];
            $detalleProvision['idusuario'] = $this->sesion['idusuario'];
            $detalleProvision['idempresa'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($detalleProvision);
        }
    }

    /**
     * Método encargado de realizar y registrar el seguimiento del proceso 
     * en la tabla de log
     * @param type $idFactura
     * @param type $estado
     * @param type $descripcion
     * @param type $idFinanciacion
     */
    private function insertarLog($idFactura, $estado, $descripcion, $idFinanciacion) {
        $infoLog['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $infoLog['idfactura'] = $idFactura;
        $infoLog['programa'] = '2- Provisión Cartera';
        $infoLog['estado'] = $estado;
        $infoLog['idfinanciacion'] = $idFinanciacion;
        $infoLog['descripcion'] = $descripcion;
        $this->castigoCastigarModel->insertarLog($infoLog, $this->sesion['idempresa']);
    }

}
