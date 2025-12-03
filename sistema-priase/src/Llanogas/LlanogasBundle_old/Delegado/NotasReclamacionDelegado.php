<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\NotasReclamacionModel;
use Llanogas\LlanogasBundle\MyException;
use Doctrine\DBAL\Connection;

/**
 * Clase encargada de Aplicar las Notas en reclamacion.
 *
 * @author LeonardoRey
 */
class NotasReclamacionDelegado {

    private $idPrograma;
    private $idSuscripcion;

    /**
     * Conexión a la base de datos
     * @var  Connection
     */
    private $conexion;

    /**
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * @var NotasAutomaticasModel
     */
    private $notasModel;

    /**
     * @var array
     */
    private $sesion;

    /**
     * @var array 
     */
    private $errores;

    /**
     * @var ProcesoModel 
     */
    private $procesoModel;

    /**
     * Identificador del proceso en la tabla cpr
     * @var int 
     */
    private $idProceso;
    private $listaErrores = array();

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;
    private $imprimir = true;
    private $parametros;

    public function __construct(Connection &$conexion, $idAcceso, $idPrograma, $idSuscripcion = null) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->notasModel = new NotasReclamacionModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->errores = array();
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->idSuscripcion = $idSuscripcion;
        $this->idPrograma = $idPrograma;
    }

      /**
     * Se invoca desde la interfaz
     * Buscar Notas Reclamacion de una suscripción.
     * @param array $parametros
     * @return array $listaNotasReclamacion 
     * @throws MyException
     */
    public function getNotasReclamacion(array $parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $this->sesion['idempresa'];

        $this->eliminarTablas();
        $listaFactura = $this->notasModel->getNotasReclamacion($parametros);
        if (empty($listaFactura)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFactura;
    }
    
    /**
    * Elimina la Informacion de las Tablas temporales o crea las tablas temporales si estas no existen.
    **/
    
    public function eliminarTablas() {
        try {
            $idUsuario = $this->sesion['idusuario'];
            $this->notasModel->eliminarTablas($idUsuario);
        } catch (\Exception $e) {
            $e->getMessage();
        }
    }

    /**
     * Obtiene conceptos para autocomplete en vistas
     * @return array $listaConceptos
     * @throws MyException
     */
    public function getConceptoAutocomplete() {
        $parametros['usuario'] = $this->sesion['idusuario'];
        $listaConceptos = $this->notasModel->getConceptoAutocomplete($parametros);
        if (empty($listaConceptos)) {
            throw new MyException('No hay conceptos relacionados', 0);
        }
        return $listaConceptos;
    }
    
    
    /**
     * Obtiene los detalles de una factura (conceptos)
     * @param int $idfactura
     * @return array $listaConceptos
     * @throws MyException
     */
    public function getDetalleNotaR($idfactura) {
        $listaConceptos = $this->notasModel->getDetalleNotaR($idfactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos de la Nota en Reclamacion '. $idfactura, 0);
        }
        return $listaConceptos;
    }
    
    /**
     * Método invocado desde el proceso de notas automáticas
     * @param array $parametros
     * @return type Listado de errores que se han producido
     */
  
    public function ProcesarNotasR(array $argumentos) {
        $idUsuario = $this->sesion['idusuario'];
        //Se eliminan las tablas temporales sí existen
        $this->notasModel->eliminarTablasTemporal($idUsuario);
        if (empty($argumentos['conceptos'])) {
            throw new MyException(' Debe seleccionar al menos un campo ', -1);
        }
        $idEmpresa = $this->sesion['idempresa'];
        $idAcceso = $this->sesion['idacceso'];
        $this->marcarNotasR($argumentos['notasr']);
        $listaNotasR =  $this->getNotasRProcesadas() ;
        $conceptos = json_encode(json_encode($argumentos['conceptos']));
        $this->parametros = $argumentos;
        //Se recorren las facturas que se quieren procesar
        foreach ($listaNotasR as $factura) {
            try {
                $this->conexion->beginTransaction();
               //Se consulta la información de la factura en la tabla temporal
                $infoNotasRTemporal = $this->notasModel->consultarPorNotaRTemporal($factura['idfactura'], $idUsuario);
                //Se valida que la factura exista
                if (empty($infoNotasRTemporal)) {
                    $mensaje = "Error la Nota en Reclamacion " . $factura['idfactura'] . " no se encuentra \n";
                    $this->marcarNotasR($factura['idfactura'], -1, $mensaje);
                    $this->conexion->rollBack();
                    continue;
                }
                $this->procesarNotaR( $infoNotasRTemporal,$argumentos['conceptos'] );
                $this->conexion->commit();
                $mensaje = 'Nota procesada correctamente';
                $this->marcarNotasR($factura['idfactura'], 2, $mensaje);
            } catch (\Exception $e) {
                $mensaje = "Error procesando la factura " . $factura['idfactura'] . ' ' . $e->getMessage();
                $this->conexion->rollBack();
               // $this->marcarFacturas($factura['idfactura'], -1, $mensaje);
                 throw new MyException($e->getMessage(),-1);
            }
        }
        return $this->errores;
    }
    public function marcarNotasR($facturas, $procesado = 1, $mensaje = '-') {
        try {
            $this->conexion->beginTransaction();
            $this->notasModel->marcarNotasR($facturas, $this->sesion['idusuario'], $procesado, $mensaje);
            $this->conexion->commit();
        } catch (\Exception $e) {
            //$this->imprimirMensajePrint($e);
            $this->conexion->rollBack();
        }
    }
    public function getNotasRProcesadas() {
            return $this->notasModel->getNotasRProcesadas( $this->sesion['idusuario']);
    }
  /**
     *  Método encargado de realizar la nota a una factura cuando es una nota
     *  ( Se invoca desde el subproceso )
     * @param array $infoFacturaTemporal información de la factura que se quiere realizar la nota 
     * @param array $conceptos información de los conceptos como deben quedar 
     */
    public function procesarNotaR($infoFacturaTemporal,$listaConceptosNota) 
        { 
        $idSuscripcion = $infoFacturaTemporal['idsuscripcion'];
        //Consultar información de una suscripción
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        // se trae la Nora en Reclamacion desde el Sistema
        $infoNotaRReal = $this->genericoModel->getFactura($infoFacturaTemporal['idfactura']);
        // se trae la informacion de los conceptos de esa nota desde el sistema factura Padre     
        $listaConceptosNotaR = $this->notasModel->getConceptos($infoFacturaTemporal['idfactura']);        
       //Se guardan los conceptos que van a pertenecer a una nota de tipo crédito
        $infoConceptosNotaCredito = array();
        //Se guardan los conceptos que van a pertenecer a una nota de tipo débito
        $infoConceptosNotaDebito = array();
        foreach ($listaConceptosNotaR as $conceptoNotar) {
            $conceptoExiste = 0;
            //Se recorren los conceptos de la factura original
            foreach ($listaConceptosNota as $conceptoNota) {
                $idConcepto = $conceptoNota['iddetallefactura'];
                $idFactura = $conceptoNota['idfactura'];
                if ($conceptoNota['iddetallefactura'] != $conceptoNotar['iddetallefactura']) {
                    continue;
                }  
                $conceptoExiste = -1;
                // credito
                if ((double)$conceptoNota['vlrcredito'] < 0 && (double)$conceptoNota['vlrcredito'] >= (double)$conceptoNotar['saldo'] )
                {                 
                    $conceptoFactura['dfac_idepadre'] = $conceptoNotar['iddetallepade'] ;
                    $conceptoFactura['dfac_id'] = $conceptoNotar['iddetallefactura'] ;
                    $conceptoFactura['notaid'] = $infoNotaRReal['idfactura'] ;
                    $conceptoFactura['uni_concepto'] = $conceptoNotar['idconcepto'] ;
                    $conceptoFactura['valorTotal'] = ($conceptoNota['vlrcredito'] * -1) ;
                    $conceptoFactura['valorReal'] = 0 ;
                    $conceptoFactura['existe'] = 1 ;
                    $infoConceptosNotaCredito[] = $conceptoFactura;                    
                    $conceptoExiste = 1;                    
                }                
               // Debito
                if ((double)$conceptoNota['vlrdebito'] < 0 && (double)$conceptoNota['vlrdebito'] >= (double)$conceptoNotar['saldo']  )
                {                 
                    $conceptoFactura['dfac_idepadre'] = $conceptoNotar['iddetallepade'] ;
                    $conceptoFactura['dfac_id'] = $conceptoNotar['iddetallefactura'] ;
                    $conceptoFactura['notaid'] = $infoNotaRReal['idfactura'] ;
                    $conceptoFactura['uni_concepto'] = $conceptoNotar['idconcepto'] ;
                    $conceptoFactura['valorTotal'] = ($conceptoNota['vlrdebito'] * -1) ;
                    $conceptoFactura['valorReal'] = ($conceptoNota['vlrdebito'] * -1) ;
                    $conceptoFactura['existe'] = 1 ;
                    $infoConceptosNotaDebito[] = $conceptoFactura ;   
                    $conceptoExiste = 1;
                }
            }
            //Se verifica que si la factura inicial contiene el concepto
            if ($conceptoExiste == 0 ) {
                throw new MyException('Error no se Proceso la Nota en Reclamacion ' . $infoFacturaTemporal['idfactura'] .'El concepto: '. $listaConceptosNotaR['idconcepto'] . ' no se proceso '  , -1);
            }           
            if ($conceptoExiste == -1 ) {
                throw new MyException('Error no se Proceso la Nota en Reclamacion ' . $infoFacturaTemporal['idfactura'] .'El concepto: '. $listaConceptosNotaR['idconcepto'] . ' proceso por un valor > al Saldo '  , -1);
            }           
        }        
//        //Se crea la factura de nota Débito
        if (!empty($infoConceptosNotaDebito)) {
            $idtempfactura = $this->crearFacturaNotaTemporal($infoNotaRReal, $infoSuscripcion, 'UD');          
            $this->crearDetalleNotaTemporal('UD', $infoConceptosNotaDebito, $idtempfactura );
            $infoNotaRReal['version'] = (int)$infoNotaRReal['version'] + 1;
        }
        //Se crea la factura de nota Crédito
        if (!empty($infoConceptosNotaCredito)) {
            $idtempfactura = $this->crearFacturaNotaTemporal($infoNotaRReal, $infoSuscripcion, 'UC');
            $this->crearDetalleNotaTemporal('UC', $infoConceptosNotaCredito, $idtempfactura);
            $infoNotaRReal['version'] = $infoNotaRReal['version'] + 1;
        }
    }
    /**
     * Consulta el listado de conceptos afectados por el proceso
     * @param int $idfactura identificador de la factura
     * @return array Listado de los conceptos que se hicieron notas
     */
    public function getConceptosAfectados($idfactura) {
        $idUsuario = $this->sesion['idusuario'];
        $resultado = $this->notasModel->getConceptosAfectados($idfactura, $idUsuario);
        if (empty($resultado)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $resultado;
    }
    
    public function reiniciarFacturasTemporales() {
        $idUsuario = $this->sesion['idusuario'];
        $this->actualizarFechaNotas();
        $this->notasModel->reiniciarFacturaTemporal($idUsuario, 'A');
    }
     /**
     * Crea la factura temporal dependiendo de la información de la interfaz y
     * la factura almacenada
     * @param array $facturaOriginal información de la factura que se quiere afectar
     * @param array $infoSuscripcion información de la suscripción
     * @param type $tipoNota ND Nota débito o NC Nota crédito
     */
    private function crearFacturaNotaTemporal($facturaOriginal, $infoSuscripcion, $tipoNota) {
        $idUsuario = $this->sesion['idusuario'];
        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($infoSuscripcion['idsuscripcion']);
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['iddocumento'], $facturaOriginal['idtipodocumento'], $tipoNota);
        $idTempFactura = $this->notasModel->getIdTemporal($idUsuario);
        $factura['idtempfactura'] = $idTempFactura;
        $factura['per_ideregistro'] = $periodo['idperiodo'];
        $factura['uni_documento'] = $infoDocumento['iddocumento'];
        $factura['cic_ano'] = $periodo['cicloanio'];
        $factura['fac_ideregistro'] = $facturaOriginal['idfactura'];
        $factura['fac_metgenera'] = 'P';
        $factura['fac_estado'] = 'A';
        $factura['fac_fecha'] = 'now()';
        $factura['fac_idepadre'] = $facturaOriginal['idfacturapadre'];
        $factura['fac_fecaprobada'] = 'now()';
        $factura['fac_fecvence'] = 'now()';
        $factura['emp_ideregistro'] = $infoSuscripcion['idempresa'];
        $factura['sus_ideregistro'] = $infoSuscripcion['idsuscriptor'];
        $factura['dsus_ideregistr'] = $infoSuscripcion['idsuscripcion'];
        $factura['uni_tipsuscripc'] = $infoSuscripcion['idtiposuscripcion'];
        $factura['uni_tipusosuscr'] = $infoSuscripcion['idtipousosuscripcion'];
        $factura['uni_liquidacion'] = $facturaOriginal['idliquidacion'];
        $factura['ter_ideregistro'] = $infoSuscripcion['idtercero'];
        $factura['cic_ideregistro'] = $infoSuscripcion['idciclo'];
        $factura['uni_tipdocument'] = $facturaOriginal['idtipodocumento'];
        $factura['hliq_ideregistr'] = 0;
        $factura['fac_sdoreal'] = 0;
        $factura['fac_ideorigen'] = $facturaOriginal['idfactura'];
        $factura['uni_tiptercero'] = $infoSuscripcion['idtipotercero'];
        $factura['fac_fecsuspens'] = 'now()';
        $factura['fac_vlrreal'] = 0;
        $factura['operacion'] = $tipoNota;
        $factura['fac_version'] = $facturaOriginal['version'];
        $factura['usu_ideregistro'] = $idUsuario;
        $this->notasModel->insertar($factura, "temp_reclamacion_factura", NULL);
        return $idTempFactura;
    }

    /**
     * @param type $tipoNota 
     * @param array $listaConceptos listados de conceptos que se quieren crear
     */
    private function crearDetalleNotaTemporal($tipoNota, $listaConceptos, $idTempFactura) {
        $idUsuario = $this->sesion['idusuario'];
        foreach ($listaConceptos as $concepto) {
            $detalle["dfac_ideregistr"] = $concepto['dfac_id'];
            $detalle["dfac_estado"] = 'A';
            $detalle["dfac_ideorigen"] = $concepto['dfac_idepadre'];
            $detalle["dfac_cantidad"] = 1;
            $detalle["dfac_vlrunitari"] = abs($concepto['valorTotal']);
            $detalle["dfac_vlrtotal"] = abs($concepto['valorTotal']);
            $detalle["dfac_vlrreal"] = abs($concepto['valorReal']);
            $detalle["dfac_sdoreal"] = abs($concepto['valorReal']);
            $detalle["fac_ideregistro"] = $concepto['notaid'];
            $detalle["uni_concepto"] = $concepto['uni_concepto'];
            $detalle["dfac_idepadre"] = $concepto['dfac_idepadre'];
            $detalle["usu_ideregistro"] = $idUsuario;
            $detalle["operacion"] = $tipoNota;
            $detalle["existe"] = $concepto['existe'];
            $detalle["idtempfactura"] = $idTempFactura;
            $this->notasModel->insertar($detalle, 'temp_reclamacion_detalle', NULL);
        }
        $this->notasModel->actualizarSaldo($idUsuario, $idTempFactura);
    }
    public function aplicarNotas($parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $listaFacturaNotas = $this->notasModel->getFacturaNotas($idUsuario);
        if (empty($listaFacturaNotas)) {
            return;
        }
        try {
            $this->conexion->beginTransaction();
            foreach ($listaFacturaNotas as $infoFacturaNota) {
                $this->parametros['nueva'] = FALSE;
                $detallesNota = $this->notasModel->getDetallesFacturaNotas($idUsuario, $infoFacturaNota['fac_ideregistro'], $infoFacturaNota['idtempfactura']);
                if (empty($detallesNota)) {
                    $error['idfactura'] = $infoFacturaNota['fac_ideregistro'];
                    $error['mensaje'] = 'La factura no tiene detalles';
                    $this->listaErrores[] = $error;
                    continue;
                }
                $factura1 = null ;
                    $facturaNota = $this->crearFactura($infoFacturaNota);
                    $idNota = $this->notasModel->insertarNota($infoFacturaNota, $parametros);
                    $this->aplicarNotasDetalles($facturaNota, $detallesNota, $idNota);
                    $this->actualizarFacturas($facturaNota, $infoFacturaNota);
                    $this->notasModel->actualizarFacturaTemporal($infoFacturaNota['idtempfactura'], $idUsuario);
                    $this->notasModel->actualizarEstadoFactura($infoFacturaNota['fac_ideregistro']);               
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
                $error['idfactura'] = $infoFacturaNota['fac_ideregistro'];
                $error['mensaje'] = $e->getMessage();
                $this->listaErrores[] = $error;
                $this->conexion->rollBack();
                $this->notasModel->actualizarFacturaTemporal($infoFacturaNota['idtempfactura'], $idUsuario, 'E');
            }
       //$this->aplicarNotas($parametros);
//        return $facturaNota ;        
    }
     private function crearFactura(&$infoFacturaNota) {
        $facturaOriginal = $this->genericoModel->getFactura($infoFacturaNota['fac_idepadre']);
        $segundos = strtotime('now') - strtotime($facturaOriginal['fechavencimiento']);
        $diferenciaDia = intval($segundos / 60 / 60 / 24);
        $infoFacturaNota['fac_version'] =  $facturaOriginal['version'] ;
        if ($infoFacturaNota['operacion'] == 'UD' && $diferenciaDia > 0) {
            $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($facturaOriginal['idsuscripcion']);
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($suscripcion['idciclo']);
            $fechas = $this->getFechaFactura($facturaOriginal, $cicloPeriodo);
            $facturaOriginal['fecha'] = $infoFacturaNota['fac_fecha'];
            $facturaOriginal['fechaaprobacion'] = 'now()';
            $facturaOriginal['cicloano'] = $cicloPeriodo['cicloanio'];
            $facturaOriginal['fechasuspende'] = $fechas['fechasuspension'];
            $facturaOriginal['fechavencimiento'] = $fechas['fechavencimiento'];
            $facturaOriginal['idfacturaorigen'] = $facturaOriginal['idfactura'];
            $facturaOriginal['idciclo'] = $cicloPeriodo['idciclo'];
            $facturaOriginal['idperiodo'] = $cicloPeriodo['idperiodo'];
            $facturaOriginal['version'] = 1;
            $facturaOriginal['idmovimiento'] = 0;
            unset($facturaOriginal['numero']);
            unset($facturaOriginal['idfactura']);
            unset($facturaOriginal['idfacturapadre']);
            $idFacturaEncabezado = $this->genericoModel->insertarFactura($facturaOriginal);
            
              /*
             * MT 1053
             * Actualización de Facnumero de la nueva Factura
             */
     
            $infoFacturaNota['fac_idepadre'] = $idFacturaEncabezado;
            $infoFacturaNota['fac_version'] = 1;
            //Indica que se va  a crear un nuevo encabezado
            $this->parametros['nueva'] = TRUE;
        }
        $infoFacturaNota['fac_estado'] = "A";
        $facturaNota = $this->notasModel->crearFactura($infoFacturaNota);
        return $facturaNota;
    }
    private function getFechaFactura($infoSuscripcion, $cicloPeriodo) {
        return $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
    }
    private function aplicarNotasDetalles(&$facturaNota, &$detallesNota, $idNota) {
        foreach ($detallesNota as $detalle) {
            // $this->parametros['nueva'] Indica que se va  a crear un nuevo encabezado de factura
            if ($detalle['existe'] == 0 || ($this->parametros['nueva'] && $detalle['operacion'] == 'UD')) {
                $detalleNuevo = $this->procesarDetalleNoExiste($detalle, $facturaNota);
                $detalle['dfac_ideorigen'] = $detalleNuevo['dfac_ideregistr'];
                $detalle['dfac_idepadre'] = $detalleNuevo['dfac_ideregistr'];
            }
//            if ($detalle['operacion'] == 'NS') {
//                $valorNota = $detalle['dfac_vlrtotal'];
//                $this->procesarRecaudoAnticipo($facturaNota, $valorNota);
//            }
            $detalle['fac_ideregistro'] = $facturaNota['fac_ideregistro'];
            $detalleNota = $this->notasModel->crearDetalleFactura($detalle);
            $this->notasModel->asignarNotaFactura($detalleNota, $idNota, $facturaNota['fac_idepadre']);
        }
    }

    private function procesarDetalleNoExiste($concepto, $facturaNota) {
        $tipoOperacion = $this->genericoModel->consultarTipoConcepto($concepto['uni_concepto']);
        $infoDetalle['dfac_cantidad'] = 1;
        $infoDetalle['dfac_vlrunitari'] = $tipoOperacion['operacion'] == 'I' ? $concepto['dfac_vlrunitari'] : 0 ;
        $infoDetalle['dfac_vlrtotal'] =  $tipoOperacion['operacion'] == 'I' ? $concepto['dfac_vlrtotal'] : 0 ;
        $infoDetalle['dfac_vlrreal'] = 0;
        $infoDetalle['dfac_sdoreal'] = 0;
        $infoDetalle['dfac_idepadre'] = null;
        $infoDetalle['dfac_ideorigen'] = null;
        $infoDetalle['fac_ideregistro'] = $facturaNota['fac_idepadre'];
        $infoDetalle['uni_concepto'] = $concepto['uni_concepto'];
        $infoDetalle['usu_ideregistro'] = $concepto['usu_ideregistro'];
        return $this->notasModel->crearDetalleFactura($infoDetalle);
    }
    public function actualizarFacturas($facturaNota, $infoFacturaNota) {
        $facturaNota['iddocumento'] = $facturaNota['uni_documento'];
        $facturaNota['idempresa'] = $facturaNota['emp_ideregistro'];
        $facturaNota['idtipodocumento'] = $facturaNota['uni_tipdocument'];
        $facturaNota['tipo'] = "FA";
        
        
        try{
            if ($infoFacturaNota['operacion'] == 'NC') {
                $aplicaFelec = $this->genericoModel->getDataEvaluaFacturaElectronica($facturaNota, 0);
                if (!empty($aplicaFelec['aplicafelec'])) { // pertenece a factura electronica
                    /*
                     * 1.1 si pertenece, se evalua si los conceptos de la nota que son de factura electronica la sumatoria es mayor a cero
                     * 1.1.1 si es igual a cero se pone el documento espejo y se actualiza factura numero segun el nudo
                     * 1.1.2 si es diferente o mayor se deja el proceso normal
                     */
                    $valorAplicaFelectronica = $this->genericoModel->getValorNotaFacturaElectronica($facturaNota, 0);
                    $facturaOriginalnota = $this->genericoModel->getFactura($facturaNota['fac_idepadre']);
                    $infoFacturaNota['fac_version'] = $facturaOriginalnota['version'];

                    if ($valorAplicaFelectronica['totfac'] == 0 || empty($valorAplicaFelectronica['totfac'])) {
                        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaNota['iddocumento'], $facturaNota['idtipodocumento'], 'XF');
                        $facturaNota['iddocumento'] = $infoDocumento['iddocumento'];
                        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
                        $this->genericoModel->actualizarDocumentoEspejoFactura($facturaNota['fac_ideregistro'], $facturaNota['iddocumento']);
                        $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
                        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
                        $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['fac_idepadre'], $infoFacturaNota['fac_version']);
                        return;
                    } else {
                        $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
                        return;
                    }
                } else {
                    $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
                    return;
                }
            }
         $aplicaFelec = $this->genericoModel->getDataEvaluaFacturaElectronica($facturaNota, 0);
            if(!empty($aplicaFelec['aplicafelec'])){ // pertenece a factura electronica
                /*
                 * 1.1 si pertenece, se evalua si los conceptos de la nota que son de factura electronica la sumatoria es mayor a cero
                 * 1.1.1 si es igual a cero se pone el documento espejo y se actualiza factura numero segun el nudo
                 * 1.1.2 si es diferente o mayor se deja el proceso normal
                 */
                $valorAplicaFelectronica = $this->genericoModel->getValorNotaFacturaElectronica($facturaNota,0);
                if($valorAplicaFelectronica['totfac'] == 0 || empty($valorAplicaFelectronica['totfac'])){
                   
                    $facturaOriginalnota = $this->genericoModel->getFactura($facturaNota['fac_idepadre']);
                    $infoFacturaNota['fac_version'] = $facturaOriginalnota['version'];
                  
                    $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaNota['iddocumento'], $facturaNota['idtipodocumento'], 'XF');
                    $facturaNota['iddocumento'] = $infoDocumento['iddocumento'];
        
                    $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
                    $this->genericoModel->actualizarDocumentoEspejoFactura($facturaNota['fac_ideregistro'], $facturaNota['iddocumento']);
                    $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
                    $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
                    $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['fac_idepadre'], $infoFacturaNota['fac_version']);   
        }
                else{
                    $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
                }
            }
            else{
                $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
            }
            
            if($this->parametros['nueva'] ){
                $facturaOriginal = $this->genericoModel->consultarFactura($facturaNota['fac_idepadre']);
                $facturaOriginal['tipo'] = "FA";
                $facturaOriginal['fac_ideregistro'] = $facturaNota['fac_idepadre'];
                 /*
             * 1.  Se evalua si pertenece a factura electronica         * 
             */
               $aplicaFelec = $this->genericoModel->getDataEvaluaFacturaElectronica($facturaOriginal, 1);
                  //  print_r($facturaNuevaVencida);
                if(!empty($aplicaFelec['aplicafelec'])){ // pertenece a factura electronica
                $this->genericoModel->actualizaVlrDetalleNewFactura($facturaNota['fac_idepadre']);
                    /*
                     * 1.1 si pertenece, se evalua si los conceptos de la nota que son de factura electronica la sumatoria es mayor a cero
                     * 1.1.1 si es igual a cero se pone el documento espejo y se actualiza factura numero segun el nudo
                     * 1.1.2 si es diferente o mayor se deja el proceso normal
                     */
                    $valorAplicaFelectronica = $this->genericoModel->getValorNotaFacturaElectronica($facturaOriginal, 1);
                        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['iddocumento'], $facturaOriginal['idtipodocumento'], 'XF');
                        $facturaOriginal['iddocumento'] = $infoDocumento['iddocumento'];
                        $this->genericoModel->actualizarDocumentoEspejoFactura($facturaOriginal['fac_ideregistro'], $facturaOriginal['iddocumento']);
                    if($valorAplicaFelectronica['totfac'] == 0 || empty($valorAplicaFelectronica['totfac'])){
                        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaOriginal);
                        $this->genericoModel->actualizarNumeroFactura($facturaOriginal['fac_ideregistro'], $infoNumero['numero']);
                        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
                   }
                    else{
                        $this->actualizaFacturaSinDocumentoEspejoSinSaldo($facturaOriginal);
                    }
                }
                else{
                    $this->actualizaFacturaSinDocumentoEspejoSinSaldo($facturaOriginal);
                }
            }
        }catch(\Exception $e){
          //  print_r($e->getMessage());
            $this->conexion->rollBack();
            throw new Exception($e->getMessage(), $e->getCode());
        }
        
        
        
        
    }
    
     public function  actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota){
        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
        $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
        $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['fac_idepadre'], $infoFacturaNota['fac_version']);
    }
    public function  actualizaFacturaSinDocumentoEspejoSinSaldo($facturaNota){
        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
        $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
    }
    
    public function getListaErrores() {
        return $this->listaErrores;
    }
    /**
     * Se invoca desde la interfaz
     * Obtiene municipios, según la empresa, usuario logueado y programa para autocomplete
     * @param string $municipio cadena con nombre a comparar
     * @return array
     */
    public function getMunicipios($municipio) {
        $idEmpresa = $this->sesion['idempresa'];
        $idUsuario = $this->sesion['idusuario'];
        return $this->genericoModel->consultarMunicipios($municipio, $idEmpresa, $idUsuario, $this->idPrograma);
    } 
    
    
    /**
     * Filtra facturas según documento y tipodocumento
     * @param int $doc
     * @param int $tipodoc
     * @param itn $concepto
     * @return array $listaFacturas
     * @throws MyException
     */
    public function getNotasRConFiltro($concepto) {
        $usuario = $this->sesion['idusuario'];
        $listaFacturas = $this->notasModel->getNotasRConFiltro($usuario, $concepto);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFacturas;
    }
    
    public function actualizarFechaNotas() {
        $data['fac_fecha'] = 'now()';
        $idUsuario = $this->sesion['idusuario'];
        $this->notasModel->actualizar($data, 'temp_directa_factura', 'usu_ideregistro=' . $idUsuario);
    }
    
  
}

/*Script en dado caso que se elimine las tablas de notas*/
/*  CREATE  SEQUENCE sq_temp_directa_factura;
  CREATE TABLE temp_directa_factura AS(
  SELECT 
    0::bigint idtempfactura, *,0::integer proceso,''::character varying as operacion
  FROM fac_factura LIMIT 0);
CREATE TABLE temp_directa_detalle AS
   SELECT *,1::boolean as existe,''::character varying as operacion,0::bigint idtempfactura 
   FROM dfac_detfactura LIMIT 0;*/