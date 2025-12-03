<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use \Llanogas\LlanogasBundle\Models\GenericoModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class AnularDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\AnularModel 
     */
    private $anularModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase
     * @param Controller $control
     * @param SessionInterface $sesion
     * @param \Doctrine\DBAL\Connection  $conexion
     */
    public function __construct(Controller &$control, SessionInterface $sesion, $conexion = null) {
        $this->conexion = $conexion;
        if ($this->conexion == null) {
            $this->conexion = Util::getConexion($control);
        }
        $this->anularModel = new AnularModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Método encargado de buscar el recaudoF
     * @param integer $idRegistro
     * @param integer $idSuscriptor
     * @param integer $idSuscripcion
     * @param date $fechaInicio
     * @param date $fechaFin
     * @param string $codAnterior
     * @return type
     * @throws MyException
     */
    public function buscarRecaudo($idRegistro, $idSuscriptor, $idSuscripcion, $fechaInicio, $fechaFin, $codAnterior) {
        $idEmpresa = $this->sesion->get('idempresa');
        $recaudos = $this->anularModel->buscarRecaudos($idRegistro, $idSuscriptor, $idSuscripcion, $fechaInicio, $fechaFin, $codAnterior, $idEmpresa);
        if (empty($recaudos)) {
            throw new MyException('No se encontraron registros ', 0);
        }
        return $recaudos;
    }

    /**
     * Obtiene los detalles del recaudo que se quiere anularF
     * @param integer $idRecaudo
     * @return array
     */
    public function getDetallesRecaudos($idRecaudo) {
        $detalleRecaudo = array();
        $detalleRecaudo["formas"] = 'Formas de pago no encontradas';
        $detalleRecaudo['facturas'] = 'Facturas no encontradas';
        $detalleRecaudo['conceptosFacturas'] = 'Conceptos por facturas no encontrados';
        $listaSuscripcion = $this->anularModel->buscarSuscripcionesRecaudo($idRecaudo);
        $detalleRecaudo["suscripciones"] = empty($listaSuscripcion) ? 'Suscripciones no encontradas' : $listaSuscripcion;
        $listaFacturas = $this->anularModel->buscarFacturasRecaudo($idRecaudo);
        $listaFormasPago = $this->anularModel->buscarFormasPago($idRecaudo);
        $listaDistribucion = $this->anularModel->getDistribucion($idRecaudo);
        $detalleRecaudo['distribucion'] = $listaDistribucion;
        if (!empty($listaFormasPago)) {
            $detalleRecaudo["formas"] = $listaFormasPago;
        }
        if (!empty($listaFacturas)) {
            $detalleRecaudo["facturas"] = $listaFacturas;
            $listaConceptos = $this->anularModel->buscarConceptosFacturasRecaudos($idRecaudo);
            $detalleRecaudo["conceptosFacturas"] = $listaConceptos;
        }
        if (!empty($listaFormasPago)) {
            foreach ($listaFormasPago as &$formaPago) {
                $informacionAdicional = $this->anularModel->buscarInfoAdicional($formaPago['idformapago']);
                $formaPago['informacion'] = $informacionAdicional;
            }
        }
        return $detalleRecaudo;
    }

    /**
     * Anulación del recaudo.
     * @param array $parametros información de los recaudos que se quieren anular.
     * @throws MyException Error al actualizar el estado del recaudos
     */
    public function anularRecaudo(array $parametros) {
        try {
            $this->conexion->beginTransaction();
            $this->procesarAnulacion($parametros);
            $this->conexion->commit();
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), -1);
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
        }
    }

    /**
     * Ejecuta la acción de generar las notas para la anulación de un recaudo.
     * @param array $parametros Información de los del ciclo,periodo y suscripción que se quiere
     * realizar la elimianción del recaudo.
     * @param array $detalleDocumentosTipos tipos de documentos y documentos que se quieren generar las notas e ingresar
     * la nueva distribución.
     */
    public function procesarRecaudo($parametros, $detalleDocumentosTipos) {
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        foreach ($detalleDocumentosTipos as $documentosTipos) {
            $detalleNuevoDocumentoNota = $this->anularModel->consultarDocumentoNota($documentosTipos['iddocumento'], $documentosTipos['idtipodocumento']);
            $idDocumentoRecaudo = $this->anularModel->crearDocumentoRecaudo($parametros, $documentosTipos, $detalleNuevoDocumentoNota);
            $listaDetallesRecaudoAntiguo = $this->anularModel->consultarDetallesRecaudo($documentosTipos);
            $parametros['idsuscripcion'] = $documentosTipos['idsuscripcion'];
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($parametros['idsuscripcion']);
            $parametros['idciclo'] = $cicloPeriodo['idciclo'];
            $parametros['cicloanio'] = $cicloPeriodo['cicloanio'];
            $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
            $parametros['idusuario'] = $this->sesion->get('idusuario');
            $idNuevaNota = $this->anularModel->insertarNota($parametros);
            $idDistribucionNuevo = $this->anularModel->insertarDistribucionNuevoDocumento($documentosTipos, $idDocumentoRecaudo, $parametros, $documentosTipos['iddistribucion']);
            foreach ($listaDetallesRecaudoAntiguo as $detalleRecaudoAntiguo) {
                $detalleNuevoDocumentoNota['idusuario'] = $this->sesion->get('idusuario');
                $idNuevoDetalleRecaudoDocumento = $this->anularModel->crearDocumentoDetalleRecaudo($detalleRecaudoAntiguo, $idDocumentoRecaudo, $detalleNuevoDocumentoNota, $parametros, $idDistribucionNuevo);
                $datos['idnota'] = $idNuevaNota;
                $datos['iddetallerecaudoantiguo'] = $detalleRecaudoAntiguo['drec_ideregistr'];
                $datos['idrecaudoantiguo'] = $parametros['idrecaudo'];
                $datos['idrecaudo'] = $idDocumentoRecaudo;
                $datos['iddetallerecaudo'] = $idNuevoDetalleRecaudoDocumento;
                $datos['idusuario'] = $this->sesion->get('idusuario');
                $this->anularModel->insertarNotaRecaudo($datos);
            }
        }
    }

    /**
     * Método encargado al registrar la anulación, si el recaudo está registrado en una consignación 
     * no se permite y/o si la factura que afectó está provisionada, se debe realizar la anulación
     * por medio de las notas 
     * @param array $parametros
     * @throws MyException Si el recuado está consignado y/o factura provisionada
     */
    public function procesarAnulacion($parametros) {
        $idRecaudo = $parametros['idrecaudo'];
        $listaFacturasEstado = $this->anularModel->getFacturasRecaudo($idRecaudo);
        foreach ($listaFacturasEstado as $factura) {
            if($factura['estado'] == 'F'){
                 throw new MyException('Error al anular el recaudo  '. $idRecaudo.', Factura Financiada, idfactura  '.$factura['idfactura']   , -1);
            }
        }
        $infoRecaudo = $this->genericoModel->getRecaudo($idRecaudo);
        $infoRecaudo['version'] = $parametros['version'];
        //Se valida que el recaudo se pueda eliminar
        //Realizando la validación con la consignación
        $elimino = $this->anularModel->actualizarEstadoRecaudo($idRecaudo, 'E');
        if (!$elimino) {
            throw new MyException('Error al anular el recaudo ' . $idRecaudo, -1);
        }
        $distribuciones = $this->anularModel->consultarDistribucionPorRecaudo($parametros['idrecaudo']);
        $modificacion = 0;
        foreach ($distribuciones as $distribucion) {
            $parametros['idsuscripcion'] = $distribucion['idsuscripcion'];
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($parametros['idsuscripcion']);
            $parametros['idciclo'] = $cicloPeriodo['idciclo'];
            $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
            $detalleDocumentosTipos = $this->anularModel->consultarDocumentoTipoDocumentoPorRecaudo($parametros['idrecaudo'], $parametros['idsuscripcion']);
            if (!empty($detalleDocumentosTipos)) {
                $this->procesarRecaudo($parametros, $detalleDocumentosTipos);
            }
            $this->genericoDelegado->actualizarRecaudoSaldo($idRecaudo, $infoRecaudo['version'] + $modificacion, $parametros['idsuscripcion']);
            $modificacion++;
        }
        //Se consulta cuales facturas fueron afectadas por el recuado
        $listaFacturas = $this->anularModel->getFacturasRecaudo($idRecaudo);
        if (empty($listaFacturas)) {
            return;
        }
        foreach ($listaFacturas as $factura) {
            //Se vuelve a actualizar el saldo de la factura sin el pago
            $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $factura['version']);
        }
    }

}
