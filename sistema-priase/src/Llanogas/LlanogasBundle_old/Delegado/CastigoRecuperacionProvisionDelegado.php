<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\CastigoRecuperacionProvisionModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\CastigoCastigarModel;

/**
 * Description of RecuperacionProvisionDelegado
 *
 * @author hrey
 */
class CastigoRecuperacionProvisionDelegado {

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
     * @var  CastigoRecuperacionProvisionModel
     */
    private $recuperacionProvisonModel;

    /**
     *
     * @var array información del periodo de una suscripcion 
     */
    private $cicloPeriodo;

    /**
     *
     * @var array información de la suscripcion que se está procesando 
     */
    private $infoSuscripcion;
    private $cantidadFacturasRecuperadas;

    /**
     *
     * @var  CastigoCastigarModel
     */
    private $castigoCastigarModel;

    public function __construct(Connection $conexion, $idAcceso) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->recuperacionProvisonModel = new CastigoRecuperacionProvisionModel($this->conexion, $this->sesion);
        $this->castigoCastigarModel = new CastigoCastigarModel($conexion, $this->sesion);
    }

    /**
     * Método encargado de realizar las recuperaciones de una suscripción
     * @param int $idSuscripcion identificador de la suscripción
     */
    public function generarRecuperacion($idSuscripcion) {
        $this->cantidadFacturasRecuperadas = 0;
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $listaDetallesProvisionados = $this->recuperacionProvisonModel->getDetallesProvisionados($idSuscripcion);
        if (empty($listaDetallesProvisionados)) {
            return;
        }
        $idFactura = $listaDetallesProvisionados[0]['idfacturaoriginal'];
        $listaDetallesRecuperacion = array();
        foreach ($listaDetallesProvisionados as $registroProvision) {
            /**
             * Si la factura de provisión es diferente a la factuera que estamos evaluando 
             * significa que los detalles son de una nueva factura y se procede a generar las recuperaciones 
             */
            if ($idFactura !== $registroProvision['idfacturaoriginal']) {
                $this->procesarRecuperacion($listaDetallesRecuperacion);
                $idFactura = $registroProvision['idfacturaoriginal'];
                $listaDetallesRecuperacion = array();
            }
            /**
             * Se valida que el procentaje de recuperación sea diferente de 0
             * para poder generar el documento de recuperación a la factura inicial
             */
            if (($registroProvision['porcentajerecuperacion'] / 1) != 0) {
                $listaDetallesRecuperacion[] = $registroProvision;
                continue;
            }
            $listaDetallesRecuperacion = array();
        }
        $this->procesarRecuperacion($listaDetallesRecuperacion);
        return $this->cantidadFacturasRecuperadas;
    }

    /**
     * Consulta todas las suscripciones provisionadas de un ciclo
     * @param type $idCiclo
     * @param type $idSuscripcion
     * @return type
     */
    public function getSuscripcionesProvisionadas($idCiclo, $idSuscripcion = null) {
        return $this->recuperacionProvisonModel->getSuscripciones($idCiclo, $idSuscripcion);
    }

    /**
     * Método encargado de generar la recuperación 
     * @param array $listaDetallesRecuperacion lista de detalles de la recuperación 
     * @return type
     */
    private function procesarRecuperacion(array $listaDetallesRecuperacion) {
        if (empty($listaDetallesRecuperacion)) {
            return;
        }
        $idFactura = $listaDetallesRecuperacion[0]['idfacturaoriginal'];
        try {
            $this->conexion->beginTransaction();
            $detalleRecuperacion = $listaDetallesRecuperacion[0];
            $infoFacturaProvision = $this->genericoModel->getFactura($detalleRecuperacion['idfacturaprovision']);
            $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaProvision['idsuscripcion']);
            /**
             * Se genera la nota de recuperación a la factura de provisión
             */
            $facturaRecuperacion = $this->crearFacturaRecuperacion($infoFacturaProvision);
            $this->crearDetallesRecuperacion($listaDetallesRecuperacion, $facturaRecuperacion);
            $facturaRecuperacion['tipo'] = 'FA';
            $this->genericoDelegado->actualizarNumeroFactura($facturaRecuperacion);
            $this->genericoDelegado->actualizarFacturaSaldo($facturaRecuperacion['idfactura'], 1, 'NT');
            $this->genericoDelegado->actualizarFacturaSaldo($infoFacturaProvision['idfactura'], $infoFacturaProvision['version']);
            $this->conexion->commit();
            $this->insertarLog($idFactura, 'G', 'Se generó correctamente la recuperación');
            $this->cantidadFacturasRecuperadas++;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            $this->insertarLog($idFactura, 'F', $e->getMessage());
        }
    }

    /**
     * Se crea la factura de recuperación a la factura de provisión 
     * @param array $infoFacturaProvision
     * @return type
     */
    private function crearFacturaRecuperacion(array $infoFacturaProvision) {
        $documentoRecuperacion = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($infoFacturaProvision['iddocumento'], $infoFacturaProvision['idtipodocumento'], 'RP');
        $factura ['metodogenera'] = 'P';
        $factura ['estado'] = 'P';
        $factura ['fecha'] = 'now()';
        $factura ['idfacturapadre'] = $infoFacturaProvision['idfactura'];
        $factura ['fechaaprobacion'] = 'now()';
        $factura ['fechavencimiento'] = 'now()';
        $factura ['idempresa'] = $infoFacturaProvision['idempresa'];
        $factura ['idsuscriptor'] = $this->infoSuscripcion['idsuscriptor'];
        $factura ['idsuscripcion'] = $infoFacturaProvision['idsuscripcion'];
        $factura ['idtiposuscripcion'] = $this->infoSuscripcion['idtiposuscripcion'];
        $factura ['idtipousosuscripcion'] = $this->infoSuscripcion['idtipousosuscripcion'];
        $factura ['idliquidacion'] = $infoFacturaProvision['idliquidacion'];
        $factura ['idtercero'] = $this->infoSuscripcion['idtercero'];
        $factura ['idciclo'] = $this->cicloPeriodo['idciclo'];
        $factura ['cicloano'] = $this->cicloPeriodo['cicloanio'];
        $factura ['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $factura ['idtipodocumento'] = $infoFacturaProvision['idtipodocumento'];
        $factura ['idfinanciacion'] = $infoFacturaProvision['idfinanciacion'];
        $factura ['iddocumento'] = $documentoRecuperacion['iddocumento'];
        $factura ['idhistoricoliquidacion'] = 0;
        $factura ['saldofactura'] = 0;
        $factura ['idfacturaorigen'] = $infoFacturaProvision['idfactura'];
        $factura ['idtipotercero'] = $this->infoSuscripcion['idtipotercero'];
        $factura ['fechasuspende'] = 'now()';
        $factura ['version'] = 1;
        $factura ['valortotal'] = 0;
        $factura ['idusuario'] = $this->sesion['idusuario'];
        $factura['idfactura'] = $this->genericoModel->insertarFactura($factura);
        return $factura;
    }

    /**
     * Se crean los detalles del documento de recuperación
     * @param array $listaDetalles lista de detalles provisionados 
     * @param array $facturaRecuperacion información de la nueva factura 
     * @throws MyException Si le hicieron una nota a la factura inicial, no 
     * se puede generar la recuperación 
     */
    private function crearDetallesRecuperacion(array $listaDetalles, array $facturaRecuperacion) {
        foreach ($listaDetalles as $detalle) {
            /**
             * Si a la factura inicial le generan una nota débito 
             * se genera un error ya que no puede aumentar el valor de la 
             * factura inicial
             */
            if ($detalle['porcentajerecuperacion'] < 0) {
                throw new MyException('La factura ' . $detalle['idfacturaoriginal'] . ' ha aumentado el valor ', -1);
            }
            $detalleRecuperacion['estado'] = 'A';
            $detalleRecuperacion['iddetallefacturaorigen'] = $detalle['iddetalleprovision'];
            $detalleRecuperacion['valorunitario'] = abs($detalle['saldoprovisionreal'] * $detalle['porcentajerecuperacion']);
            $detalleRecuperacion['valortotal'] = $detalle['saldoprovision'] * $detalle['porcentajerecuperacion'];
            $detalleRecuperacion['valorunitario'] = ($detalleRecuperacion['valorunitario'] <= 0) ? $detalleRecuperacion['valortotal'] : $detalleRecuperacion['valorunitario'];
            $detalleRecuperacion['cantidad'] = $detalleRecuperacion['valortotal'] / (($detalleRecuperacion['valorunitario'] <= 0) ? 1 : $detalleRecuperacion['valorunitario']);
            $detalleRecuperacion['valorreal'] = abs($detalle['saldoprovision'] * $detalle['porcentajerecuperacion']) * -1;
            $detalleRecuperacion['saldoreal'] = abs($detalle['saldoprovision'] * $detalle['porcentajerecuperacion']) * -1;
            $detalleRecuperacion['idfactura'] = $facturaRecuperacion['idfactura'];
            $detalleRecuperacion['idconcepto'] = $detalle['idconcepto'];
            $detalleRecuperacion['iddetallefacturapadre'] = $detalle['iddetalleprovision'];
            $detalleRecuperacion['version'] = 1;
            $detalleRecuperacion['idusuario'] = $this->sesion['idusuario'];
            $detalleRecuperacion['idempresa'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($detalleRecuperacion);
        }
    }

    /**
     * Genera el log en la tabla de seguimiento del proceso
     * @param type $idFactura
     * @param type $estado
     * @param type $descripcion
     */
    private function insertarLog($idFactura, $estado, $descripcion) {
        $infoLog['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $infoLog['idfactura'] = $idFactura;
        $infoLog['programa'] = '1- Recuperación Cartera';
        $infoLog['estado'] = $estado;
        $infoLog['descripcion'] = $descripcion;
        $this->castigoCastigarModel->insertarLog($infoLog, $this->sesion['idempresa']);
    }

}
