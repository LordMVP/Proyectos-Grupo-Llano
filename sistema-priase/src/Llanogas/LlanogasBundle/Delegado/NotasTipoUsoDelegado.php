<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\NotasAutomaticasModel;
use Llanogas\LlanogasBundle\Models\NotasTipoUsoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of SuspensionesDelegado
 *
 * @author LeonardoRey
 */
class NotasTipoUsoDelegado {

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
     *
     * @var NotasTipoUsoModel
     */
    private $notasTipoUsoModel;

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->notasTipoUsoModel = new NotasTipoUsoModel($this->conexion);
        $this->sesion = $sesion;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Obtiene municipios, según la empresa, usuario logueado y programa para autocomplete
     * @param string $municipio cadena con nombre a comparar
     * @return array
     */
    public function getMunicipios($municipio) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        return $this->genericoModel->consultarMunicipios($municipio, $idEmpresa, $idUsuario, PROGRAMA_NOTAS_TIPO_USO);
    }

    /**
     * 
     * @param array $parametros criterios de búsqueda
     * @return array
     * @throws MyException
     */
    public function consultarSuscripcion($parametros) {
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $parametros["idusuario"] = $this->sesion->get('idusuario');
        $parametros["idprograma"] = PROGRAMA_NOTAS_TIPO_USO;
        $listaSuscripciones = $this->notasTipoUsoModel->consultarSuscripcion($parametros);
        if (empty($listaSuscripciones)) {
            throw new MyException('No se encontraron suscripciones ', 0);
        }
        return $listaSuscripciones;
    }

    /**
     * Obtiene la última factura que se liquidó del servicio 
     * @param type $idSuscripcion
     * @return type
     */
    public function getFacturas($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $periodo = $this->genericoModel->periodoAnterior($infoSuscripcion['idciclo']);
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idperiodo'] = $periodo['idperiodo'];
        return $this->notasTipoUsoModel->getFacturas($parametros);
    }

    /**
     * Elimina las tablas temporales del usuario 
     */
    public function eliminarTablas() {
        $idUsuario = $this->sesion->get('idusuario');
        $this->notasTipoUsoModel->eliminarTablasTemporal($idUsuario);
    }

    /**
     * Se procede a generar la nota, el sistema lo que hace es cancelar 
     * la factura actual y liquida la suscripción con el nueva tipo de uso 
     * @param type $idSuscripcion
     * @param type $idFactura
     * @return type
     * @throws MyException
     */
    public function procesarNota($idSuscripcion, $idFactura) {
        $idUsuario = $this->sesion->get('idusuario');
        $this->notasTipoUsoModel->validarInformacionTemporal($idUsuario);
        try {
            $this->conexion->beginTransaction();
            /**
             * Se valida que la factura no tenga recaudos, ya que si tiene 
             * un pago, la factura no se le generan notas por tipo de uso 
             * si es el caso se debe realizar por notas directas 
             */
            $this->notasTipoUsoModel->validarRecaudos($idFactura);
            $idAcceso = $this->sesion->get('idacceso');
            $generarFacturaSuscripcionDelegado = new GenerarFacturaSuscripcionDelegado($this->conexion, $idAcceso, $idSuscripcion, PROGRAMA_NOTAS_TIPO_USO);
            $listaConceptosLiquidados = $generarFacturaSuscripcionDelegado->generarLiquidacion();
            $factura = $this->generarFacturaTemporal($idSuscripcion, $idFactura);
            $listaDetalles = $this->generarDetalleTemporal($factura, $listaConceptosLiquidados);
            $this->conexion->commit();
            return $listaDetalles;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * Se genera la información de la nota en la tabla temporal 
     * @param type $idSuscripcion
     * @param type $idFactura factura inicial o padre 
     * @return type
     */
    public function generarFacturaTemporal($idSuscripcion, $idFactura) {
        $idUsuario = $this->sesion->get('idusuario');
        $facturaInicial = $this->genericoModel->getFactura($idFactura);
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $cicloPeriodo = $this->genericoModel->getCicloPeridoAnterior($idSuscripcion);
        $liquidacion = $this->genericoModel->getLiquidacionID($suscripcion['idliquidacion'])[0];
        $fechaFacturas = $this->getFechasFactura($cicloPeriodo, $suscripcion);
        $factura['idfactura'] = $this->notasTipoUsoModel->getIdFacturaTemporal($idUsuario);
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'A';
        $factura['fecha'] = 'now()';
        $factura['version'] = 1;
        $factura['fechaaprobacion'] = 'now()';
        $factura['valortotal'] = 0;
        $factura['idhistoricoliquidacion'] = 0;
        $factura['iddocumento'] = $liquidacion['iddocumento'];
        $factura['idtipodocumento'] = $liquidacion['idtipodocumento'];
        $factura['fechavencimiento'] = $fechaFacturas['fechavencimiento'];
        $factura['fechasuspende'] = $fechaFacturas['fechasuspension'];
        $factura['idempresa'] = $suscripcion['idempresa'];
        $factura['idsuscriptor'] = $suscripcion['idsuscriptor'];
        $factura['idsuscripcion'] = $idSuscripcion;
        $factura['idtiposuscripcion'] = $suscripcion['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $suscripcion['idtipousosuscripcion'];
        $factura['idliquidacion'] = $suscripcion['idliquidacion'];
        $factura['idtercero'] = $facturaInicial['idtercero'];
        $factura['saldofactura'] = 0;
        $factura['idciclo'] = $cicloPeriodo['idciclo'];
        $factura['idperiodo'] = $cicloPeriodo['idperiodo'];
        $factura['cicloano'] = $cicloPeriodo['cicloanio'];
        $factura['idtipotercero'] = $suscripcion['idtipotercero'];
        $factura['idfacturaorigen'] = $idFactura;
        $factura['idusuario'] = $idUsuario;
        $this->notasTipoUsoModel->insertarFacturaTemporal($factura, $idUsuario);
        return $factura;
    }

    /**
     * Se genera los detalles de la nota  con los nuevos valores 
     * @param array $facturaTemporal
     * @param array $listaConceptosLiquidados
     * @return array
     */
    public function generarDetalleTemporal(array $facturaTemporal, array $listaConceptosLiquidados) {
        $idFactura = $facturaTemporal['idfactura'];
        $idUsuario = $this->sesion->get('idusuario');
        $listaConceptos = array();
        foreach ($listaConceptosLiquidados as $concepto) {
            $detalle['estado'] = 'A';
            $detalle['version'] = 1;
            $detalle['idfactura'] = $idFactura;
            $detalle['idusuario'] = $idUsuario;
            $detalle['valorunitario'] = $concepto['valorunitario'];
            $detalle['cantidad'] = $concepto['cantidad'];
            $detalle['valorreal'] = $concepto['valorreal'];
            $detalle['valortotal'] = $concepto['valortotal'];
            $detalle['idconcepto'] = $concepto['idconcepto'];
            $detalle['concepto'] = $concepto['concepto'];
            $this->notasTipoUsoModel->insertarDetalleFactura($detalle, $idUsuario);
            $listaConceptos[] = $detalle;
        }
        return $listaConceptos;
    }

    private function getFechasFactura($cicloPeriodo, $infoSuscripcion) {
        return $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
    }

    /**
     * Se pone en firme los cambios de la nota 
     * @param type $parametros
     * @throws \Exception
     */
    public function aplicarNotas($parametros) {
        $idSuscripcion = $parametros['idsuscripcion'];
        $idFacturaInicial = $parametros['idfactura'];
        $this->notasTipoUsoModel->validarInformacionDetalleTemporal($this->sesion->get('idusuario'));
        try {
            $this->conexion->beginTransaction();
            $facturaInicial = $this->genericoModel->getFactura($idFacturaInicial);
            $facturaNota = $this->aplicarNotaCredito($idFacturaInicial, $idSuscripcion, $facturaInicial);
            $nota = $this->crearNota($facturaNota, $parametros);
            /**
             * Se procede a cancelar todos los detalles de la factura padre
             */
            $this->aplicarNotaCreditoDetalles($facturaNota, $idFacturaInicial, $nota);
            $facturaNota['tipo'] = 'FA';
            $this->genericoDelegado->actualizarNumeroFactura($facturaNota);
            $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['idfactura'], 1, 'NT');
            $this->genericoDelegado->actualizarFacturaSaldo($idFacturaInicial, $facturaInicial['version']);
            $this->crearNuevaFactura($idFacturaInicial);
            $this->notasTipoUsoModel->actualizarEstado($idFacturaInicial, 'N');
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw $e;
        }
    }

    /**
     * Genera la nota crédito anulando la factura existente
     * @param type $idFacturaInicial
     * @param type $idSuscripcion
     * @param type $facturaInicial
     * @return type
     */
    public function aplicarNotaCredito($idFacturaInicial, $idSuscripcion, $facturaInicial) {
        $idUsuario = $this->sesion->get('idusuario');
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaInicial['iddocumento'], $facturaInicial['idtipodocumento'], 'NU');
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'A';
        $factura['fecha'] = 'now()';
        $factura['version'] = 1;
        $factura['fechaaprobacion'] = 'now()';
        $factura['valortotal'] = $facturaInicial['saldofactura'] * -1;
        $factura['idhistoricoliquidacion'] = 0;
        $factura['iddocumento'] = $infoDocumento['iddocumento'];
        $factura['idtipodocumento'] = $facturaInicial['idtipodocumento'];
        $factura['fechavencimiento'] = 'now()';
        $factura['fechasuspende'] = 'now()';
        $factura['idfacturapadre'] = $idFacturaInicial;
        $factura['idfacturaorigen'] = $idFacturaInicial;
        $factura['idempresa'] = $suscripcion['idempresa'];
        $factura['idsuscriptor'] = $suscripcion['idsuscriptor'];
        $factura['idsuscripcion'] = $idSuscripcion;
        $factura['idtiposuscripcion'] = $facturaInicial['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $facturaInicial['idtipousosuscripcion'];
        $factura['idliquidacion'] = $facturaInicial['idliquidacion'];
        $factura['idtercero'] = $facturaInicial['idtercero'];
        $factura['saldofactura'] = $facturaInicial['saldofactura'] * -1;
        $factura['idciclo'] = $cicloPeriodo['idciclo'];
        $factura['idperiodo'] = $cicloPeriodo['idperiodo'];
        $factura['cicloano'] = $cicloPeriodo['cicloanio'];
        $factura['idtipotercero'] = $suscripcion['idtipotercero'];
        $factura['idusuario'] = $idUsuario;
        $factura['idfactura'] = $this->genericoModel->insertarFactura($factura);
        return $factura;
    }

    /**
     * Se procede anular los detalles de una nota 
     * @param type $facturaCredito
     * @param type $idFacturaInicial
     * @param type $nota
     * @throws MyException
     */
    public function aplicarNotaCreditoDetalles($facturaCredito, $idFacturaInicial, $nota) {
        $listaConceptos = $this->genericoModel->getConceptos($idFacturaInicial);
        if (empty($listaConceptos)) {
            throw new MyException('La factura ' . $idFacturaInicial . ' no tiene conceptos', -1);
        }
        foreach ($listaConceptos as $concepto) {
            $detalle = Array();
            $detalle['estado'] = 'A';
            $detalle['iddetallefacturaorigen'] = $concepto['iddetallefactura'];
            $detalle['cantidad'] = 1;
            $detalle['valorunitario'] = $concepto['valorunitario'];
            $detalle['valortotal'] = $concepto['operacion'] == 'S' ? $concepto['saldo'] : $concepto['valortotal'];
            $detalle['valorreal'] = abs($concepto['saldo']) * -1;
            $detalle['saldoreal'] = abs($concepto['saldo']) * -1;
            $detalle['idfactura'] = $facturaCredito['idfactura'];
            $detalle['idconcepto'] = $concepto['idconcepto'];
            $detalle['iddetallefacturapadre'] = $concepto['iddetallefactura'];
            $detalle['version'] = 1;
            $detalle['idusuario'] = $this->sesion->get('idusuario');
            $idDetalleFactura = $this->genericoModel->insertarDetalleFactura($detalle);
            $detalle['iddetallefactura'] = $idDetalleFactura;
            $this->vincularNotaFactura($concepto, $detalle, $nota);
        }
    }

    /**
     * Se crea una nueva factura 
     * @param type $idFacturaInicial
     */
    public function crearNuevaFactura($idFacturaInicial) {
        $idFactura = $this->notasTipoUsoModel->getIdFactura();
        $idUsuario = $this->sesion->get('idusuario');
        $this->notasTipoUsoModel->crearNuevaFactura($idUsuario, $idFactura, $idFacturaInicial);
        $this->notasTipoUsoModel->crearNuevaFacturaDetalle($idUsuario, $idFactura);
        $factura = $this->genericoModel->getFactura($idFactura);
        $factura['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($factura);
        $this->genericoDelegado->actualizarFacturaSaldo($idFactura, 1);
    }

    /**
     * Se crea la nota 
     * @param type $facturaNota
     * @param type $parametros
     * @return type
     */
    private function crearNota($facturaNota, $parametros) {
        $parametrosNota['fecha'] = 'now()';
        $parametrosNota['comentario'] = $parametros['comentario'];
        $parametrosNota['idmotivonota'] = $parametros['idmotivo'];
        $parametrosNota['idsuscripcion'] = $facturaNota['idsuscripcion'];
        $parametrosNota['idciclo'] = $facturaNota['idciclo'];
        $parametrosNota['idperiodo'] = $facturaNota['idperiodo'];
        $parametrosNota['idestructuranota'] = ESTRUCTURA_NOTA;
        $parametrosNota['cicloanio'] = $facturaNota['cicloano'];
        $parametrosNota['idempresa'] = $facturaNota['idempresa'];
        $parametrosNota['idusuario'] = $this->sesion->get('idusuario');
        return $this->notasTipoUsoModel->insertarNota($parametrosNota);
    }

    /**
     * Se realiza la vinculación de la nota con la factura de crédito 
     * que se creó
     * @param type $conceptoOrigen
     * @param type $conceptoNota
     * @param type $nota
     */
    private function vincularNotaFactura($conceptoOrigen, $conceptoNota, $nota) {
        $notaFactura['idnota'] = $nota['idnota'];
        $notaFactura['idfactura'] = $conceptoNota['idfactura'];
        $notaFactura['iddetallefactura'] = $conceptoNota['iddetallefactura'];
        $notaFactura['idfacturaorigen'] = $conceptoOrigen['idfactura'];
        $notaFactura['iddetallefacturaorigen'] = $conceptoOrigen['iddetallefactura'];
        $notaFactura['idusuario'] = $this->sesion->get('idusuario');
        $this->notasTipoUsoModel->insertarNotaFactura($notaFactura);
    }

    public function getDetalleFacturas($idFactura) {
        return $this->genericoModel->getConceptos($idFactura);
    }

}
