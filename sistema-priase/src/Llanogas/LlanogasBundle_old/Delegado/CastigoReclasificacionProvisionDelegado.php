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
use Llanogas\LlanogasBundle\Models\CastigoReclasificacionProvisionModel;
use Llanogas\LlanogasBundle\Models\CastigoCastigarModel;

/**
 * Description of RecuperacionProvisionDelegado
 * 
 * Clase encargada de realizar la reclasificación de una factura 
 * el valor de la reclasificación es el saldo de la factura 
 * que no se encuentra provisionado
 *
 * @author hrey
 */
class CastigoReclasificacionProvisionDelegado {

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
     * @var array información del periodo de una suscripcion 
     */
    private $cicloPeriodo;

    /**
     *
     * @var array información de la suscripcion que se está procesando 
     */
    private $infoSuscripcion;

    /**
     *
     * @var CastigoReclasificacionProvisionModel 
     */
    private $reclasificacionModel;

    /**
     *
     * @var  CastigoCastigarModel
     */
    private $castigoCastigarModel;

    public function __construct($idAcceso, $conexion) {
        $this->conexion = $conexion;
        if (empty($conexion)) {
            $this->conexion = ConexionBD::getConexion();
        }
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->reclasificacionModel = new CastigoReclasificacionProvisionModel($this->conexion, $this->sesion);
        $this->castigoCastigarModel = new CastigoCastigarModel($conexion, $this->sesion);
    }

    /**
     * Método encargado de generar la reclasificación de las facturas que se encuentran 
     * provisionadas
     * @param type $idSuscripcion
     * @return type
     */
    public function generarReclasificacion($idSuscripcion) {
        /**
         * Se consultan todas las provisiones que se hicieron a las facturas de la suscripción
         */
        $listaProvisiones = $this->reclasificacionModel->getFacturasProvision($idSuscripcion);
        if (empty($listaProvisiones)) {
            return;
        }
        $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        foreach ($listaProvisiones as $provision) {
            try {
                $this->conexion->beginTransaction();
                $factura = $this->generarFacturaReclasificacion($provision);
                $this->generarDetallesFacturaReclasificacion($factura, $provision);
                $this->genericoDelegado->actualizarFacturaSaldo($provision['idfacturaprovision'], $provision['version']);
                $this->insertarLog(NULL, 'G', 'Se generó correctamente la recuperación');
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $this->insertarLog(NULL, 'F', $e->getMessage());
            }
        }
    }

    /**
     * Genera el documento de reclasificación 
     * @param type $provision información de la provisión a reclasificar
     * @return array información del nuevo documento de factura 
     */
    private function generarFacturaReclasificacion($provision) {
        $infoDocumentoReclasificacion = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($provision['iddocumentoprovision'], $provision['idtipodocumentoprovision'], 'RC');
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'P';
        $parametros['fecha'] = 'now()';
        $parametros['idfacturapadre'] = $provision['idfacturaprovision'];
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = 'now()';
        $parametros['idempresa'] = $this->infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $this->infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $this->infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $this->infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $this->infoSuscripcion['idliquidacion'];
        $parametros['idtercero'] = $this->infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $this->cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoDocumentoReclasificacion['iddocumento'];
        $parametros['idtipodocumento'] = $provision['idtipodocumentoprovision'];
        $parametros['idamortizacion'] = $provision['idamortizacion'];
        $parametros['cicloano'] = $this->cicloPeriodo['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = $provision['saldoprovision'] * -1;
        $parametros['idfacturaorigen'] = $provision['idfacturaprovision'];
        $parametros['idtipotercero'] = $this->infoSuscripcion['idtipotercero'];
        $parametros['idfinanciacion'] = $provision['idfinanciacion'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = $provision['saldoprovision'] * -1;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        $parametros['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($parametros);
        return $parametros;
    }

    /**
     * Genera los detalels de la reclasificación  de acuerdo a los detalles 
     * de la provisión 
     * @param type $facturaReclasificacion Nueva factura
     * @param type $provision información de la provisión 
     * @throws MyException Si la provisión no tiene detalles 
     */
    private function generarDetallesFacturaReclasificacion($facturaReclasificacion, $provision) {
        $listaDetallesProvision = $this->genericoModel->getConceptos($provision['idfacturaprovision']);
        if (empty($listaDetallesProvision)) {
            throw new MyException('Error al generar la reclasificacion - idprovision  ' . $provision['idfacturaprovision'], -1);
        }
        foreach ($listaDetallesProvision as $detalleProvison) {
            $parametros['estado'] = 'A';
            $parametros['iddetallefacturaorigen'] = $detalleProvison['iddetallefactura'];
            $parametros['cantidad'] = 1;
            $parametros['valorunitario'] = abs($detalleProvison['valorunitario']) * -1;
            $parametros['valortotal'] = abs($detalleProvison['valorreal']);
            $parametros['valorreal'] = abs($detalleProvison['valorreal']) * -1;
            $parametros['saldoreal'] = abs($detalleProvison['valorreal']) * -1;
            $parametros['idfactura'] = $facturaReclasificacion['idfactura'];
            $parametros['idconcepto'] = $detalleProvison['idconcepto'];
            $parametros['iddetalleamortizacion'] = $detalleProvison['iddetalleamortizacion'];
            $parametros['iddetallefacturapadre'] = $detalleProvison['iddetallefactura'];
            $parametros['iddetallefinanciacion'] = $detalleProvison['iddetallefinanciacion'];
            $parametros['version'] = 1;
            $parametros['idusuario'] = $this->sesion['idusuario'];
            $parametros['idempresa'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($parametros);
            $parametros = array();
        }
    }

    /**
     * Consulta todas las suscripciones que hayan 25 meses de mora 
     * para realizar la reclasificación 
     * @param type $idCiclo
     * @return array lista de suscripciones 
     */
    public function getSuscripcionesReclasificar($idCiclo) {
        return $this->reclasificacionModel->getSuscripcionesReclasificar($idCiclo);
    }

    /**
     * Realiza la inserción del log en la tabla de seguimiento del proceso
     * @param type $idFactura
     * @param type $estado
     * @param type $descripcion
     */
    private function insertarLog($idFactura, $estado, $descripcion) {
        $infoLog['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $infoLog['idfactura'] = $idFactura;
        $infoLog['programa'] = '3- Reclasificación provisión Cartera';
        $infoLog['estado'] = $estado;
        $infoLog['descripcion'] = $descripcion;
        $this->castigoCastigarModel->insertarLog($infoLog, $this->sesion['idempresa']);
    }

}
