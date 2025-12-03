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
use Llanogas\LlanogasBundle\Models\CastigoCastigarModel;

/**
 * Description of RecuperacionProvisionDelegado
 * Clase encargada de realizar el castigo y la eliminación de la suscripción
 * @author hrey
 */
class CastigoCastigarDelegado {

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
     * @var CastigoCastigarModel 
     */
    private $castigoCastigarModel;

    public function __construct($idAcceso, &$conexion = null) {
        $this->conexion = $conexion;
        if (empty($conexion)) {
            $this->conexion = ConexionBD::getConexion();
        }
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->castigoCastigarModel = new CastigoCastigarModel($this->conexion, $this->sesion);
    }

    /**
     * Método encargado de ejecutar el castigo y eliminación de una suscripción 
     * @param type $idSuscripcion identificador de la suscripción que se quiere eliminar 
     */
    public function eliminarSuscripcion($idSuscripcion) {
        try {
           $this->conexion->beginTransaction(); 
            $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
            $this->infoSuscripcion = $infoSuscripcion;
            $this->castigoCastigarModel->eliminarSuscripcion($idSuscripcion);
            $idEmpresa = $this->sesion['idempresa'];
            $empresaNit = $this->genericoModel->getEmpresa($idEmpresa);
            $fechaSistema = $this->genericoModel->fechaSistema();
            $infoSuscripcion['nit'] = $empresaNit['nit'];
            $infoSuscripcion['fechasistema'] = $fechaSistema['fechasistema'];
            $this->castigoCastigarModel->actualizaClienteTecsoft($infoSuscripcion);
            $this->conexion->commit();
            $this->conexion->beginTransaction();
            $this->castigoCastigarModel->eliminarFacturas($idSuscripcion);
            $this->insertarLog(NULL, 'G', 'Se eliminó correctamente', '5- Eliminación Suscripción');
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            $this->insertarLog(NULL, 'F', $e->getMessage(), '5- Eliminación Suscripción');
        }
    }

    /**
     * Método encargado de realizar el castigo de una suscripción en específico  
     * @param type $idSuscripcion identificador de la suscripción 
     */
    public function castigarCarteraNormal($idSuscripcion) {
        //Se consulta la información de la suscripción
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        $this->infoSuscripcion = $infoSuscripcion;
        //Se consultan todas las facturas que se van a castigar que sean por consumo
        $listaFacturasOrigen = $this->castigoCastigarModel->getFacturasCastigarNormal($idSuscripcion);
        foreach ($listaFacturasOrigen as $facturaOrigen) {
            try {
                $this->conexion->beginTransaction();
                $facturaCastigada = $this->procesarFacturaNormal($infoSuscripcion, $facturaOrigen);
                $this->procesarDetallesNormal($facturaCastigada);
                $this->genericoDelegado->actualizarFacturaSaldo($facturaCastigada['idfactura'], $facturaCastigada['version'], 'NT');
                $this->insertarLog($facturaOrigen['idfactura'], 'G', 'Se castigó correctamente', '4- Cartera Normal');
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $this->insertarLog($facturaOrigen['idfactura'], 'F', $e->getMessage());
                throw new MyException("Error al procesar castigo cartera Normal " . $e->getMessage() , -1);
            }
        }
    }

    /**
     * Método encargado de generar el documento de castigo
     * @param type $infoSuscripcion información de la suscripción
     * @param type $facturaOrigen $factura a realizar el castigo
     * @return type
     */
    private function procesarFacturaNormal($infoSuscripcion, $facturaOrigen) {
        //Se consulta el documento de castigo que le pertenece a la factura
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOrigen['iddocumento'], $facturaOrigen['idtipodocumento'], 'CC');
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'C';
        $parametros['fecha'] = 'now()';
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = 'now()';
        $parametros['idempresa'] = $infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $infoSuscripcion['idliquidacion'];
        $parametros['idtercero'] = $infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoDocumento['iddocumento'];
        $parametros['idtipodocumento'] = $facturaOrigen['idtipodocumento'];
        $parametros['cicloano'] = $cicloPeriodo['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = 0;
        $parametros['idfacturaorigen'] = $facturaOrigen['idfactura'];
        $parametros['idtipotercero'] = $infoSuscripcion['idtipotercero'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = 0;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $idFactura = $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        if(empty($idFactura)){
            throw new MyException("Error al crear el documento de castigo de la factura  # " .  $facturaOrigen['idfactura'] , -1);
        }
        $parametros['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($parametros);
        return $parametros;
    }

    /**
     * Método encargado de realizar el castigo de los detalles
     * @param type $facturaCastigada
     */
    private function procesarDetallesNormal($facturaCastigada) {
        $listaDetalles = $this->castigoCastigarModel->getDetallesCastigarNormal($facturaCastigada['idfacturaorigen'], $facturaCastigada['idsuscripcion']);
        foreach ($listaDetalles as $detalle) {
            //El valor de la reclasificación es el valor que no está provisionado
            $valorCastigo = $detalle['saldodetalleoriginal'] - abs($detalle['valorreclasificacion']);
            $parametros['estado'] = 'A';
            $parametros['iddetallefacturaorigen'] = $detalle['iddetalleoriginal'];
            $parametros['cantidad'] = 1;
            $parametros['valorunitario'] = abs($valorCastigo) * -1;
            $parametros['valortotal'] = abs($valorCastigo);
            $parametros['valorreal'] = abs($valorCastigo) * -1;
            $parametros['saldoreal'] = abs($valorCastigo) * -1;
            $parametros['idfactura'] = $facturaCastigada['idfactura'];
            $parametros['idconcepto'] = $detalle['idconceptooriginal'];
            $parametros['version'] = 1;
            $parametros['idusuario'] = $this->sesion['idusuario'];
            $parametros['idempresa'] = $this->sesion['idempresa'];
            $idFacturaDetalle = $this->genericoModel->insertarDetalleFactura($parametros);
            if(empty($idFacturaDetalle)){
            throw new MyException("Error al crear el detalle del documento de castigo de la factura  # " +  $facturaOrigen['idfactura'] , -1);
        }
            $parametros = array();
        }
    }

    /**
     * Método encargado de realizar el castigo de una factura 
     * de amortización 
     * @param type $idSuscripcion identificador de la suscripción que se quiere castigar
     * @return type
     */
    public function castigarCarteraFinanciada($idSuscripcion) {
        try {
            /**
             * Consulta las facturas de una financiación para realizar el proceso de 
             * castigo
             */
            $listaFinanciaciones = $this->castigoCastigarModel->getFinanciacionCastigar($idSuscripcion);
            if (empty($listaFinanciaciones)) {
                        return;
                    }
            foreach ($listaFinanciaciones as $financiacion) {
                if ($financiacion['cantidadfacturas'] == 0) {
                    continue;
                }
                try {
                    $this->conexion->beginTransaction();
                    $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
                    /**
                     * Métode encargado de ejecutar el proceso de castigo para 
                     * una financiación
                     */
                    $this->procesarFinanciacion($financiacion, $idSuscripcion);
                    $this->castigoCastigarModel->eliminarFinanciacion($financiacion['idfinanciacion']);
                    $this->insertarLog(NULL, 'G', 'Se generó correctamente');
                    $this->conexion->commit();
                } catch (\Exception $ex) {
                    $this->conexion->rollBack();
                    $this->insertarLog(NULL, 'F', $ex->getMessage());
                    throw new MyException($ex->getMessage() , -1);
                }
            }
        } catch (MyException $e) {
            print_r($e);
        } catch (\Exception $e) {
            print_r($e);
        }
    }

    /**
     * Método que realiza el castigo de una financiación
     * @param type $financiacion información de la financiación 
     * @param type $idSuscripcion identificador de la suscripción
     */
    private function procesarFinanciacion(&$financiacion, $idSuscripcion) {
        try{
            $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
            /**
             * Se valida que el saldo de la financiación sea mayor a 0, si es correcto 
             * se debe de generar una factura con el saldo de la financiación para 
             * después poder realizar el castigo
             */
            if ($financiacion['saldofinanciacion'] > 0) {
                $this->generarCuotaAmortizacion($financiacion, $cicloPeriodo);
                $this->genericoDelegado->actualizarFinanciacionSaldo($financiacion['idfinanciacion'], $financiacion['version']);
                //Se aumenta la cantidad de facturas con la nueva amortización que se puede 
                if($financiacion['cantidadfacturas'] == 999999999){
                    $financiacion['cantidadfacturas'] = 0;
                }
                    $financiacion['cantidadfacturas'] ++;
            }
            $valorReclasificado = $this->castigoCastigarModel->valorReclasificacionFinanciacion($financiacion['idfinanciacion'], $idSuscripcion);
            $saldoFinanciacion = $this->castigoCastigarModel->valorSaldoFinanciacion($financiacion['idfinanciacion'], $idSuscripcion);
            /**
             * Se calcula el valor del documento de castigo de acuerdo a la cantidad de facturas que
             * tenga la financiación
             */
            $valorCastigar = ($saldoFinanciacion - abs($valorReclasificado)) / $financiacion['cantidadfacturas'];
            /**
             * Se procede a castigar la financiación
             */
            $this->castigarFinanciacion($financiacion, $infoSuscripcion, $valorCastigar);
        } catch (\Exception $e) {
            throw new MyException($e->getMessage() , -1);
        }
    }

    /**
     * Si la financiación tiene algún saldo se debe de generar la amortización
     * @param array $financiacion consulta la información de financiación 
     * @param type $cicloPeriodo informaición del ciclo activo
     * @return type
     */
    private function generarCuotaAmortizacion($financiacion, $cicloPeriodo) {
        /**
         * Se consulta el dfin de la financiación
         */
        $listaDetallesFinanciacion = $this->castigoCastigarModel->getDetallesFinanciacion($financiacion['idfinanciacion']);
        if (empty($listaDetallesFinanciacion)) {
            return;
        }
        /**
         * Se consulta la iformación de la amortización
         */
        $infoAmortizacionFinanciacion = $this->castigoCastigarModel->getInfoAmotizacionFinanciacion($financiacion['idfinanciacion']);
        /**
         * Se inserta en amo la nueva amortización por el saldo
         */
        $infoAmortizacion = $this->castigoCastigarModel->insertarAmoritzacion($infoAmortizacionFinanciacion, $cicloPeriodo, $financiacion);
        $infoAmortizacion['idsuscripcion'] = $infoAmortizacionFinanciacion['idsuscripcion'];
        /**
         * Se genera el documento de amortización en fac_factura
         */
        $infoFactura = $this->insertarFacturaAmortizacion($infoAmortizacion);
        foreach ($listaDetallesFinanciacion as $detalleFinanciacion) {
            /**
             * Se crean los detalles 
             */
            $this->generarDetalleCuotaAmortizacion($infoAmortizacion, $detalleFinanciacion, $infoFactura);
        }
        $this->genericoDelegado->actualizarFacturaSaldo($infoFactura['idfactura'], 1);
    }

    /**
     * Crea la factura con el saldo de la financiación 
     * @param type $infoAmortizacion
     * @return type
     */
    public function insertarFacturaAmortizacion($infoAmortizacion) {
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoAmortizacion['idsuscripcion']);
        $parametros['metodogenera'] = 'A';
        $parametros['estado'] = 'A';
        $parametros['fecha'] = 'now()';
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = 'now()';
        $parametros['idempresa'] = $infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $infoAmortizacion['idliquidacion'];
        $parametros['idtercero'] = $infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $infoAmortizacion['idciclo'];
        $parametros['idperiodo'] = $infoAmortizacion['idperiodo'];
        $parametros['iddocumento'] = $infoAmortizacion['iddocumento'];
        $parametros['idtipodocumento'] = $infoAmortizacion['idtipodocumento'];
        $parametros['cicloano'] = $infoAmortizacion['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = 0;
        $parametros['idtipotercero'] = $infoSuscripcion['idtipotercero'];
        $parametros['fechasuspende'] = 'now()';
        $parametros['version'] = 1;
        $parametros['valortotal'] = 0;
        $parametros['idfinanciacion'] = $infoAmortizacion['idfinanciacion'];
        $parametros['idamortizacion'] = $infoAmortizacion['idamortizacion'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        return $parametros;
    }

    /**
     * Se crea los detalles de la factura con la información que se encuentra en 
     * los dfin
     * @param type $infoAmortizacion información de la amortización creada 
     * @param type $detalleFinanciacion información del dfin
     * @param type $infoFactura información de la nueva factura que se crea apartir del saldo de la financiación
     */
    private function generarDetalleCuotaAmortizacion($infoAmortizacion, $detalleFinanciacion, $infoFactura) {
        $detalleAmortizacion['valordetallefactura'] = $detalleFinanciacion['valordetallefactura'];
        $detalleAmortizacion['valorconcepto'] = $detalleFinanciacion['saldoconcepto'];
        $detalleAmortizacion['idamortizacion'] = $infoAmortizacion['idamortizacion'];
        $detalleAmortizacion['iddetallefinanciacion'] = $detalleFinanciacion['iddetallefinanciacion'];
        $detalleAmortizacion['idsuscripcion'] = $infoFactura['idsuscripcion'];
        $detalleAmortizacion['idciclo'] = $infoAmortizacion['idciclo'];
        $detalleAmortizacion['idperiodo'] = $infoAmortizacion['idperiodo'];
        $detalleAmortizacion['idempresa'] = $infoFactura['idempresa'];
        $detalleAmortizacion['idfactura'] = $detalleFinanciacion['idfactura'];
        $detalleAmortizacion['iddetallefactura'] = $detalleFinanciacion['iddetallefactura'];
        $detalleAmortizacion['idliquidacion'] = $infoAmortizacion['idliquidacion'];
        $detalleAmortizacion['idconcepto'] = $detalleFinanciacion['idconcepto'];
        $detalleAmortizacion['iddocumento'] = $infoAmortizacion['iddocumento'];
        $detalleAmortizacion['idtipodocumento'] = $infoAmortizacion['idtipodocumento'];
        $detalleAmortizacion['cicloanio'] = $infoAmortizacion['cicloanio'];
        $detalleAmortizacion['idusuario'] = $this->sesion['idusuario'];
        $detalleAmortizacion['iddetalleamortizacion'] = $this->castigoCastigarModel->insertarDetalleAmortizacion($detalleAmortizacion);
        $this->insertarDetallesFactura($detalleAmortizacion, $infoFactura);
    }

    /**
     * Método encargado de insertar en la tabla de dfac_
     * @param type $detalleAmortizacion
     * @param type $infoFactura
     */
    private function insertarDetallesFactura($detalleAmortizacion, $infoFactura) {
        $detalleProvision['estado'] = 'A';
        $detalleProvision['cantidad'] = 1;
        $detalleProvision['valorunitario'] = $detalleAmortizacion['valorconcepto'];
        $detalleProvision['valortotal'] = $detalleAmortizacion['valorconcepto'];
        $detalleProvision['valorreal'] = $detalleAmortizacion['valorconcepto'];
        $detalleProvision['saldoreal'] = $detalleAmortizacion['valorconcepto'];
        $detalleProvision['idfactura'] = $infoFactura['idfactura'];
        $detalleProvision['idconcepto'] = $detalleAmortizacion['idconcepto'];
        $detalleProvision['version'] = 1;
        $detalleProvision['idusuario'] = $this->sesion['idusuario'];
        $detalleProvision['idempresa'] = $this->sesion['idempresa'];
        $detalleProvision['iddetallefinanciacion'] = $detalleAmortizacion['iddetallefinanciacion'];
        $detalleProvision['iddetalleamortizacion'] = $detalleAmortizacion['iddetalleamortizacion'];
        $this->genericoModel->insertarDetalleFactura($detalleProvision);
    }

    /**
     * Recorre todas las facturas de financiación y genera el documento de castigo
     * @param type $financiacion información de la financiación 
     * @param type $infoSuscripcion información de la suscripción 
     * @param type $valorCastigar valor que le corresponde a la factura que se va a castigar
     */
    public function castigarFinanciacion($financiacion, $infoSuscripcion, $valorCastigar) {
        $listaFacturas = $this->castigoCastigarModel->getFacturasFinanciacion($financiacion['idfinanciacion'], $infoSuscripcion['idsuscripcion']);
        foreach ($listaFacturas as $facturaOrigen) {
            try{
                $infoFacturaCastigo = $this->procesarFacturaFinanciacionCastigo($infoSuscripcion, $facturaOrigen);
                $this->procesarDetallesFacturaFinanciacionCastigo($infoFacturaCastigo, $valorCastigar, $facturaOrigen);
                $this->genericoDelegado->actualizarFacturaSaldo($infoFacturaCastigo['idfactura'], 1, 'NT');
            } catch (\Exception $e) {
                $this->insertarLog($facturaOrigen['idfactura'], 'F', $e->getMessage());
                throw new MyException("Error al procesar castigo cartera Financiada " . $e->getMessage() , -1);
            }
        }
    }

    /**
     * Inserta el documento de castigo de una factura 
     * que proviene de una financiación 
     * @param type $infoSuscripcion información de la suscripción 
     * @param type $facturaOrigen información de la factura origen 
     * @return type retorna la información del documento de castigo
     */
    private function procesarFacturaFinanciacionCastigo($infoSuscripcion, $facturaOrigen) {
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOrigen['iddocumento'], $facturaOrigen['idtipodocumento'], 'CC');
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
        $parametros['metodogenera'] = 'P';
        $parametros['estado'] = 'C';
        $parametros['fecha'] = 'now()';
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['fechavencimiento'] = 'now()';
        $parametros['idempresa'] = $infoSuscripcion['idempresa'];
        $parametros['idsuscriptor'] = $infoSuscripcion['idsuscriptor'];
        $parametros['idsuscripcion'] = $infoSuscripcion['idsuscripcion'];
        $parametros['idtiposuscripcion'] = $infoSuscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $infoSuscripcion['idtipousosuscripcion'];
        $parametros['idliquidacion'] = $infoSuscripcion['idliquidacion'];
        $parametros['idtercero'] = $infoSuscripcion['idtercero'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['iddocumento'] = $infoDocumento['iddocumento'];
        $parametros['idtipodocumento'] = $facturaOrigen['idtipodocumento'];
        $parametros['cicloano'] = $cicloPeriodo['cicloanio'];
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['saldofactura'] = 0;
        $parametros['idfacturaorigen'] = $facturaOrigen['idfactura'];
        $parametros['idtipotercero'] = $infoSuscripcion['idtipotercero'];
        $parametros['version'] = 1;
        $parametros['valortotal'] = 0;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $idFactura = $parametros['idfactura'] = $this->genericoModel->insertarFactura($parametros);
        if(empty($idFactura)){
            throw new MyException("Error al crear el documento de castigo de la factura Financiada  # " .  $facturaOrigen['idfactura'] , -1);
        }
        $parametros['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($parametros);
        return $parametros;
    }

    /**
     * Genera los detalles del documento de castigo
     * @param type $facturaCastigada información de la factura castigada
     * @param type $valorCastigar valor a castigar de la factura
     * @param type $facturaOriginal informaicón de la factura inicial
     */
    private function procesarDetallesFacturaFinanciacionCastigo($facturaCastigada, $valorCastigar, $facturaOriginal) {
        $listaDetalles = $this->castigoCastigarModel->getDetallesCastigarNormal($facturaCastigada['idfacturaorigen'], $facturaCastigada['idsuscripcion']);
        foreach ($listaDetalles as $detalle) {
            $valorCastigoDetalle = (($detalle['saldodetalleoriginal'] / $facturaOriginal['saldofactura']) * $valorCastigar);
            $parametros['estado'] = 'A';
            $parametros['iddetallefacturaorigen'] = $detalle['iddetalleoriginal'];
            $parametros['cantidad'] = 1;
            $parametros['valorunitario'] = abs($valorCastigoDetalle) * -1;
            $parametros['valortotal'] = abs($valorCastigoDetalle);
            $parametros['valorreal'] = abs($valorCastigoDetalle) * -1;
            $parametros['saldoreal'] = abs($valorCastigoDetalle) * -1;
            $parametros['idfactura'] = $facturaCastigada['idfactura'];
            $parametros['idconcepto'] = $detalle['idconceptooriginal'];
            $parametros['version'] = 1;
            $parametros['idusuario'] = $this->sesion['idusuario'];
            $parametros['idempresa'] = $this->sesion['idempresa'];
            $this->genericoModel->insertarDetalleFactura($parametros);
            $parametros = array();
        }
    }

    /**
     * Método encargado de crear la tabla temporal del proceso
     */
    public function crearTablaLog() {
        $this->castigoCastigarModel->crearTablaLog($this->sesion['idempresa']);
    }

    /**
     * Se registra el log en la tabla temporal 
     * @param type $idFactura identificador de la factura 
     * @param type $estado 
     * @param type $descripcion mensaje 
     * @param type $programa programa que está registrando el log
     */
    private function insertarLog($idFactura, $estado, $descripcion, $programa = '4- Castigar Cartera') {
        $infoLog['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $infoLog['idfactura'] = $idFactura;
        $infoLog['programa'] = $programa;
        $infoLog['estado'] = $estado;
        $infoLog['descripcion'] = $descripcion;
        $this->castigoCastigarModel->insertarLog($infoLog, $this->sesion['idempresa']);
    }
    
}
