<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\GenerarDocumentoPagoModel;
use Llanogas\LlanogasBundle\Models\FacturarFinanciacionModel;

/**
 * Este delegado permite la validación y construcción de documentos de pago. 
 *
 * @author Sergio andrés vargas
 * @date 11 / ago / 2015
 * 
 * 
 */
class GenerarDocumentoPagoDelegado {
    // <editor-fold desc="variables ">  

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var Llanogas\LlanogasBundle\Models\GenerarDocumentoPagoModel 
     */
    private $documentoPago;

    /**
     *
     * @var Llanogas\LlanogasBundle\Delegado\GenericoDelegado 
     */
    private $genericoDelegado;
    
    /**
     *
     * @var FacturarFinanciacionModel 
     */
    private $facturarFinanciacionModel;

// </editor-fold>  
    // <editor-fold desc="constructor">  

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->documentoPago = new GenerarDocumentoPagoModel($this->conexion);
        $this->facturarFinanciacionModel = new FacturarFinanciacionModel($this->conexion, $this->sesion);
        $this->sesion = $sesion;
    }

// </editor-fold>
    // <editor-fold desc="Generar Amortización">  
    /**
     * @deprecated since version 1.0.0 se calcula por base de datos
     * valida los saldo y las cuotas de la amortización 
     * @param type $detalleAmortizacion
     */
    /*
      private function obtenerSaldoFinanciacion($detalleAmortizacion) {
      $sumaTotalDetalleFinanciacion = 0;
      foreach ($detalleAmortizacion as $infoDetalleFinanciacion) {
      $saldo = 0;
      if (isset($infoDetalleFinanciacion['saldo'])) {
      $saldo = $infoDetalleFinanciacion['saldo'];
      }
      $sumaTotalDetalleFinanciacion += $saldo;
      }
      return $sumaTotalDetalleFinanciacion;
      } */

    /**
     * procesar una amortización dependiendo del valor de documento de pago se actualiza o construye una nueva
     * @param type $documentoPago
     * @param type $sumaTotalDetalleFinanciacion
     * @param type $amortizacionOrigen
     * @param type $financiaciones
     * @throws MyException El número de cuotas no pueden ser 0 
     */
    private function procesarAmortizacion($documentoPago, $sumaTotalDetalleFinanciacion, $amortizacionOrigen) {
        $valorRealFinanciacion = ($sumaTotalDetalleFinanciacion - $documentoPago['valordocumento']);
        /*
         *  actualizar amortización actual a estado C para finalizar la amortización
         */
        if ($valorRealFinanciacion == 0) {

            $this->documentoPago->actualizarAmortizacionFinanciacion($documentoPago['idamortizacionfinanciacion'], 'C');
        }
        /* se crea una amortización siempre y cuando cumpla con la restriccion de cuotas
          pendientes sobre las nuevas cuotas para ello se le incluye en el array
          amortizacionFinanaciacion las nuevas cuotas , además del identificador de la amortización
          para poder realizar su actualización en dado caso que se cumpla las restricciones antes nombradas
         */
        if ($valorRealFinanciacion > 0) {
            //se crea una amortización siempre y cuando cumpla con la restriccion de cuotas
            //pendientes sobre las nuevas cuotas 
            $this->documentoPago->actualizarAmortizacionFinanciacion($documentoPago['idamortizacionfinanciacion'], 'R');
            //se construye una nueva amortización teniendo en cuenta el nuevo saldo y las nuevas cuotas 
            //se carga la información de la financiacion amortizada

            $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($documentoPago['idsuscripcion']);
            $amortizacionOrigen['cic_ano'] = $periodo['cicloanio'];
            $amortizacionOrigen['cic_ideregistro'] = $periodo['idciclo'];
            $amortizacionOrigen['per_ideregistro'] = $periodo['idperiodo'];
            $amortizacionOrigen['amfi_estado'] = 'A';
            $amortizacionOrigen['amfi_fecha'] = 'now()';
            $amortizacionOrigen['amfi_numcuotas'] = $documentoPago['nuevascuotas'] + $amortizacionOrigen['amfi_cuoamortiz'];
            $amortizacionOrigen['usu_ideregistro'] = $this->sesion->get('idusuario');
            $documentoPago['idamortizacionfinanciacion'] = $this->documentoPago->insertarAmortizacionFinanciacion($amortizacionOrigen);
        }
        return $documentoPago['idamortizacionfinanciacion'];
    }

    /**
     * permite validar la amortización realizando una revisión de los parámetros para proceder con el proceso de pago
     * @param DocumentoPago $documentoPago
     * @return  información detallada de la amortización 
     */
    private function generarAmortizacion($documentoPago) {

        $amortizacionOrigen = $this->documentoPago->obtenerAmortizacionFinanciacion($documentoPago['idamortizacionfinanciacion']);
        //se mantiene el identificador de la financiación
        $idfinanciacion = $amortizacionOrigen['fin_ideregistro'];
        //se carga el detalle de la amortización para revisar su saldo y procesar las cuotas 
        $detalleAmortizacion = $this->documentoPago->obtenerSaldoTotalFinanciacionModel($idfinanciacion);
        $detalleAmortizacion['idsuscripcion'] = $documentoPago['idsuscripcion'];
        //se valida el saldo de la financiación 
        $sumaTotalDetalleFinanciacion = $detalleAmortizacion['saldo'];
        /*
         * evalua los estado de la amortización con el fin de actualizar o almacenar una nueva si el saldo es afectado
         */
        $idamortizacion = $this->procesarAmortizacion($documentoPago, $sumaTotalDetalleFinanciacion, $amortizacionOrigen);

        /* si no hay excepción controlada del saldo de la financiación se retorna el 
         * contenido valido de la amortización 
         */
        $respuesta['idfinanciacion'] = $idfinanciacion;
        $respuesta['idamortizacion'] = $idamortizacion;

        return $respuesta;
    }

    //</editor-fold>
    // <editor-fold desc="Procesamiento de documento de pago">  

    /**
     * permite crear una nota rep´resentada como documento de pago 
     * @param int $idsuscripcion identificador de la suscripcion 
     */
    private function crearNota($idsuscripcion) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        return $this->documentoPago->insertarNotaModel($parametros);
    }

    /**
     * Permite actualizar el saldo de la financiacion 
     * @param int $idfinanciacion identificador de la financiacion a actualizar 
     * @param float $valordocumento valor de documento a descontar de la financiacion 
     */
    /*
      private function actualizarSaldoFinanciacionOriginal($idfinanciacion, $valordocumento) {
      $saldoActualFinanciacion = $this->documentoPago->obtenerFinanciacion($idfinanciacion);
      $saldoreal = floatval($saldoActualFinanciacion['fin_sdocapital']) - floatval($valordocumento);
      $this->documentoPago->actualizarSaldoFinanciacion($idfinanciacion, $saldoreal);
      $respuesta['saldoreal'] = $saldoreal;
      $respuesta['saldoOrigen'] = $saldoActualFinanciacion['fin_sdocapital'];
      return $respuesta;
      } */

    /**
     * Permite obtner la fecha de suspencion que se genera al realizar el documento de pago
     * @param type $informacionAmortizacion
     * @throws MyException
     */
    public function obtenerFechaSuspencion($informacionAmortizacion) {
        $aplicasuspencion = $this->documentoPago->obtenerTipoDocumentoValidoSuspencionModel($informacionAmortizacion['uni_tipdocument']);
        if ($aplicasuspencion['suspension'] == 'S') {
            $diassuspension = $this->documentoPago->obtenerDiasSuspensionModel($informacionAmortizacion['uni_liquidacion']);
            return $diassuspension['dias'];
        }
        return 0;
    }

    /**
     * permite construir la nueva factura a partir de la financaicion existente
     * @param array $documentopago informacion de documento de pago
     * @param int $idamortizacion identificador de la amortizacion 
     * @param float $saldoreal saldo calculado de la financiacion actualizada
     * @return int identificador de la nueva factura
     */
    private function crearNuevaFacturaFinanciacion($documentopago, $valordocumento) {
        /*
         * obtiene la amortización vigente con el fin de obtener el documento y tipo de documento requeridos para crear una nueva factura 
         */
        $informacionAmortizacion = $this->documentoPago->obtenerAmortizacionFinanciacion($documentopago['idamortizacion']);
        /*
        * consulta el documento y tipo de docuemnto para la factura basada en un documento de pago para la DIAN
        * caso potenza
        */
       $datosDetalleDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($informacionAmortizacion['uni_documento'], $informacionAmortizacion['uni_tipdocument'], 'DF');
       $infoDocumentoFactura['iddocumento'] = $datosDetalleDocumento['iddocumento'];
       $infoDocumentoFactura['idtipodocumento'] = $informacionAmortizacion['uni_tipdocument'];
        
        /*
         * se carga el ciclo periodo basado en la suscripcion 
         */
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($documentopago['idsuscripcion']);
        $infoDocumentoFactura['idciclo'] = $cicloPeriodo['idciclo'];
        $infoDocumentoFactura['idperiodo'] = $cicloPeriodo['idperiodo'];
        $infoDocumentoFactura['cicloanio'] = $cicloPeriodo['cicloanio'];
        /*
         * se carga la informacion actual de la suscripcion con el fin de crear una nueva facturación 
         */
        $financiacionOriginal = $this->documentoPago->consultarSuscripcionSuscriptor($documentopago['idsuscripcion']);
        $infoDocumentoFactura['idsuscriptor'] = $financiacionOriginal['idsuscriptor'];
        $infoDocumentoFactura['idsuscripcion'] = $documentopago['idsuscripcion'];
        $infoDocumentoFactura['idtiposuscripcion'] = $financiacionOriginal['idtiposuscripcion'];
        $infoDocumentoFactura['idtipousosuscripcion'] = $financiacionOriginal['idtipousosuscripcion'];
        $infoDocumentoFactura['idtercero'] = $financiacionOriginal['idtercero'];
        $infoDocumentoFactura['idtipotercero'] = $financiacionOriginal['idtipotercero'];
        $infoDocumentoFactura['idtiposuscripcion'] = $financiacionOriginal['idtiposuscripcion'];
        $infoDocumentoFactura['idliquidacion'] = $informacionAmortizacion['uni_liquidacion'];
        $infoDocumentoFactura['valordocumento'] = $valordocumento;
        $infoDocumentoFactura['idempresa'] = $this->sesion->get('idempresa');
        $infoDocumentoFactura['idusuario'] = $this->sesion->get('idusuario');
        $infoDocumentoFactura['idfinanciacion'] = $documentopago['idfinanciacion'];
        /*
         * se calcula la fecha de suspension de la nueva factura 
         */
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($documentopago['idsuscripcion']);
        $fechas = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
        $infoDocumentoFactura['fechasuspension'] = $fechas['fechasuspension'];
        $infoDocumentoFactura['fechavencimiento'] = $fechas['fechavencimiento'];
        $infoDocumentoFactura['fac_ctrlfelec'] = 1 ;
        /*
         * se construye la nueva factura y se devuleve su identificador
         */
        $idNuevaFactura = $this->documentoPago->insertarFacturaDocumentoPago($infoDocumentoFactura);
        
        
//        /*
//         * Actualizar factura y  generar consecutivo de la nueva factura 
//         */
//        $infoDocumentoFactura['tipo'] = 'FA';
//        $factura = $this->genericoModel->obtenerNumeroFactura($infoDocumentoFactura);
//        $this->genericoModel->actualizarNumeroFactura($idNuevaFactura, $factura['numero']);
//        $this->genericoModel->actualizarNumeroDisponible($factura['numero'], $factura['idnumero']);
        
        /*
         * se constuye la nueva financiacion para nota definida como negativa 
         */
        $infoDocumentoFactura['financiacionOrigen'] = $documentopago['idfinanciacion'];
        $infoDocumentoFactura['documentoPago'] = $documentopago['valordocumento'];
        $idfinanciacionNuevaNota = $this->documentoPago->insertarFinanciacionParaNota($infoDocumentoFactura);
        $respuesta['idfinanciacionnuevanota'] = $idfinanciacionNuevaNota;
        $respuesta['idnuevafactura'] = $idNuevaFactura ;
        $respuesta['iddocumento'] = $infoDocumentoFactura['iddocumento'] ;
        $respuesta['idtipodocumento'] = $infoDocumentoFactura['idtipodocumento'] ; 
        return $respuesta;
    }

    /**
     * permite evaluar si hay que saldar los conceptos 
     * @param type $documentoPago
     * @return type
     */
    private function insertarDetalleFacturaPorConcepto($documentoPago, $nuevaFacturaDocuemntoPago) {
        /*
         * Variable que guardara el valor de capital que aplica para generar interes de financiación  
         */
        $capital_base = 0 ;
        /*
         * evalua si existen conceptos a generar pago, si no existen conceptos seleccionados se ponderan
         */
        if (!isset($documentoPago['concepto'])) {
            return -1 ;
        }
        /*
         * se cargan los conceptos seleccionados a cancelar
         */
        $conceptos = $documentoPago['concepto'];

        /*
         * se filtran los conceptos seleccionados a cancelar con el objetivo de construir un detalle de factura
         * solo por mlos conceptos seleccionados a facturar en el documento de pago
         */
        foreach ($conceptos as $dconcepto) {
            /*
             * se calcula la ponderacion del saldo en una regla de 3 simple
             */
            $dfinanciacion = $this->documentoPago->obtenerDetalleFinanciacion($dconcepto['iddetallefinanciacion']);
            $dfinanciacion['saldo'] = $dconcepto['saldo'];
            $dfinanciacion['idfacturaOriginal'] = $dfinanciacion['idfactura'];
            $dfinanciacion['idfactura'] = $nuevaFacturaDocuemntoPago['idnuevafactura'];
            $dfinanciacion['idusuario'] = $this->sesion->get('idusuario');
            /*
             * se construye el detalle de la factura procesada
             */
            $this->documentoPago->insertarDetalleFacturaDocumentoPago($dfinanciacion);
            
            $con_base = $this->documentoPago->val_concepto_base($dfinanciacion['idconcepto'],$documentoPago['idamortizacionfinanciacion']);
           // si el concepto es base se acumula el capital
            if ($con_base > 0 )
            {
                $capital_base = $capital_base + $dfinanciacion['saldo'] ;
            } 
            /*
             * se construye la nota para el detalle de la financiacion
             */
            $dfinanciacion['idfinanciacionnota'] = $nuevaFacturaDocuemntoPago['idfinanciacionnuevanota'];
            $dfinanciacion['iddetallefinanciacion'] = $dconcepto['iddetallefinanciacion'];
            $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($documentoPago['idsuscripcion']);
            $dfinanciacion['idciclo'] = $periodo['idciclo'];
            $dfinanciacion['idperiodo'] = $periodo['idperiodo'];
            $dfinanciacion['cicloanio'] = $periodo['cicloanio'];
            $idDetalleFinanciacionNota = $this->documentoPago->insertarDetalleFinanciacionParaNota($dfinanciacion);
            /*
             * se actualiza el registro en nofi para enlazar las notas con la finanaciación construida
             */
            $notaFinanciacion['idnotadocumentopago'] = $documentoPago['idnota'];
            $notaFinanciacion['idfinanciacion'] = $documentoPago['idfinanciacion'];
            $notaFinanciacion['idfinanciacionnota'] = $nuevaFacturaDocuemntoPago['idfinanciacionnuevanota'];
            $notaFinanciacion['iddetallefinanciacion'] = $dconcepto['iddetallefinanciacion'];
            $notaFinanciacion['iddetallefinanciacionnota'] = $idDetalleFinanciacionNota;
            $notaFinanciacion['idusuario'] = $dfinanciacion['idusuario'];
            $this->documentoPago->insertarNotaFinanciacion($notaFinanciacion);
        }
        return $capital_base ;
    }

    /**
     * Calcula el porcentaje que se va a pagar un concepto específico.
     * @param double $valorDocumento valo total del documento
     * @param double $valorTotal valor total a pagar
     * @param double $valorConcepto valor del concepto
     * @return double valor que le corresponde a ese concepto dependiendo del pago.
     */
    private function calcularPonderacionDocumentoPago($valorDocumento, $valorTotal, $valorConcepto) {
        $porcentajeDetalle = ($valorConcepto * 100) / $valorTotal;
        $valorConceptoAbono = ($porcentajeDetalle * $valorDocumento) / 100;
        return $valorConceptoAbono;
    }

    /**
     * permite construir un detalle de factura 
     * @param array $documentoPago informacion de documento de pago
     * @param int $nuevaFacturaDocuemntoPago nueva factura de documento de pago
     */
    private function crearDetalleFactura($documentoPago, $nuevaFacturaDocuemntoPago) {

        /*
         * permite evaluar los saldo de conceptos y cancelarlos en caso que fuese necesario 
         * si el el valor de retorno es nulo significa que no aplica para facturar por 
         * concepto con esta bandera se notifica que se debe facturar de manera ponderada 
         */
        $saldoConceptos = $this->insertarDetalleFacturaPorConcepto($documentoPago, $nuevaFacturaDocuemntoPago);
        //si no se saldan los conceptos se ponderan a cada uno de ellos el saldo 
        if ( $saldoConceptos == -1 ) {
            $saldoConceptos =  $this->insertarDetalleFacturaPonderada($documentoPago, $nuevaFacturaDocuemntoPago);
        }
        /* Si hay capital para cobro de interes se procede a consultar los dias 
         * y la taza de interes y con estos valores calcular el valor del interes
         */   
        $parametros = $this->consultar_aplica_interes($this->sesion->get('idempresa'));
        $financiacion = $this->documentoPago->obtenerFinanciacion($documentoPago['idfinanciacion']) ;     
        $sdo_financiacion = $financiacion['fin_sdocapital'] ;
        $apl_interes = $this ->validaAplicaInteres($parametros, $sdo_financiacion, $documentoPago['valordocumento']);
        if ( $apl_interes > 0  )   
        { 
            /* Si hay capital para cobro de interes se procede a consultar los dias 
             * y la taza de interes y con estos valores calcular el valor del interes
             */
            $idamfi = $documentoPago['idamortizacionfinanciacion'] ;
            $diasFacturar = $this->documentoPago->consultar_dias_interes($idamfi);
            if ($diasFacturar < 0) {
                throw new MyException("Error: la Fecha de la financiacion es posterior a hoy (" . $documentoPago['idfinancicaion'] . ")", -1);
            }        
            if ($diasFacturar > 30) {
                throw new MyException("Error: la financiacion no se ha facturado hace mas de 30 dias (" . $documentoPago['idfinancicaion'] . ")", -1);
            }
            if ($saldoConceptos > 0 and $diasFacturar > 0  ) {
                $tasas_fin = $this->documentoPago->consultar_tasas_interes($idamfi) ;
                if (!empty($tasas_fin) and $tasas_fin['interes'] > 0 ) {
                       $tasaInteres = $tasas_fin['interes'] ;                     
                       $valorInteres = (($saldoConceptos * ($tasaInteres / 100)) / 30) * $diasFacturar;
                       $tasaInteres = $tasas_fin['tasaivainteres'] ;                
                       $this->procesarOtrosConceptos($valorInteres, $tasas_fin , $nuevaFacturaDocuemntoPago )  ;   
                    }
            } 
        }
    }
    
     /**
     *  Se inserta el concepto de interés con el valor total
     * @param type $valorTotalInteres
     * @return type
     */
    public function procesarOtrosConceptos($valorTotalInteres, $tasas , $factura) {
        if ($tasas['interes'] == 0) {
            return;
        }     
      
        $detalleinteresPago['saldo'] = $valorTotalInteres ;
        $detalleinteresPago['idfactura'] = $factura['idnuevafactura'];
        $detalleinteresPago['idusuario'] = $this->sesion->get('idusuario');
        $detalleinteresPago['idconcepto'] = $tasas['idconceptointeres']  ;
        $detalleinteresPago['iddetallefinanciacion'] = null;        
        $this->documentoPago->insertarDetalleFacturaDocumentoPago($detalleinteresPago);

        $historicoInteres['idfactura'] = $factura['idnuevafactura'];
        $historicoInteres['idconcepto'] = $tasas['idconceptointeres']  ;
        $historicoInteres['tasainteres'] = $tasas['interes'] ;
        $historicoInteres['idusuario'] = $this->sesion->get('idusuario');
        $this->facturarFinanciacionModel->insertarHistoricoInteres($historicoInteres);   
         
        /*
         *  Se valida si aplica iva y crea el detalle del interes del iva
         */
        if ($tasas ['idconceptoivainteres'] == 0) {
            return;
        }
        
        $detalleIvainteres['saldo'] = $valorTotalInteres * ($tasas ['tasaivainteres']) ;
        $detalleIvainteres['idfactura'] = $factura['idnuevafactura'];
        $detalleIvainteres['idusuario'] = $this->sesion->get('idusuario');
        $detalleIvainteres['idconcepto'] = $tasas['idconceptoivainteres']  ;
        $detalleIvainteres['iddetallefinanciacion'] = null;          
        $this->documentoPago->insertarDetalleFacturaDocumentoPago($detalleinteresPago);
    }

    /**
     * permite insertar el detalle de factura pero ponderados los conceptos 
     * @param DocumentoPago $documentoPago
     */
    private function insertarDetalleFacturaPonderada($documentoPago, $nuevaFacturaDocuemntoPago) {
        /*
         * carga la información de los detalles de financiacion y la financiacion para evaluar los saldos a ponderar 
         */
        $detallesFinanciacion = $this->documentoPago->obtenerDetallesFinanciaciones($documentoPago['idfinanciacion']);
        $financiacion = $this->documentoPago->obtenerFinanciacion($documentoPago['idfinanciacion']);

        $saldocalculado = 0;        
        
        /*
         * Variable que guardara el valor de capital que aplica para generar interes de financiación  
        */
        $capital_base = 0 ;
        
        /*
         * se recorren los detalles de las financiaocnes existentes para construir a la par un detalle de factura 
         * con los nuevos saldos ponderados para el documento de pago 
         */
        for ($i = 0; $i < count($detallesFinanciacion); $i++) {
            $dfinanciacion = $detallesFinanciacion[$i];

            $saldo = $documentoPago['valordocumento'];

            if (count($detallesFinanciacion) - 1 == $i && count($detallesFinanciacion) > 1) {
                $valorFinanciacion = $this->documentoPago->consultarValorActualFinanciacion($nuevaFacturaDocuemntoPago['idfinanciacionnuevanota']);
                $saldofinal = $saldo - abs($valorFinanciacion);
                $saldo = round($saldofinal, CANTIDAD_DECIMALES);
            } else {
                /*
                 * se calcula la ponderacion del saldo en una regla de 3 simple verificando que sea una totalizacion del documento
                 */
                if (floatval($financiacion['fin_sdocapital']) > 0 && count($detallesFinanciacion) > 1) {
                    $saldoponderacion = $this->calcularPonderacionDocumentoPago($documentoPago['valordocumento'], $financiacion['fin_sdocapital'], $dfinanciacion['saldo']);
                    $saldocalculado = $saldocalculado + $saldoponderacion;
                    $saldo = round($saldoponderacion, CANTIDAD_DECIMALES);
                }
            }
            
            $con_base = $this->documentoPago->val_concepto_base($dfinanciacion['idconcepto'],$documentoPago['idamortizacionfinanciacion']);
           // si el concepto es base se acumula el capital
            if ($con_base > 0 )
            {
                $capital_base = $capital_base + $saldo  ;
            }

            $dfinanciacion['saldo'] = $saldo;
            $dfinanciacion['idfacturaOriginal'] = $dfinanciacion['idfactura'];
            $dfinanciacion['idfactura'] = $nuevaFacturaDocuemntoPago['idnuevafactura'];
            $dfinanciacion['idusuario'] = $this->sesion->get('idusuario');
            $this->documentoPago->insertarDetalleFacturaDocumentoPago($dfinanciacion);
            /*
             * se construye la nota para el detalle de la financiacion
             */
            $dfinanciacion['idfinanciacionnota'] = $nuevaFacturaDocuemntoPago['idfinanciacionnuevanota'];
            $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($documentoPago['idsuscripcion']);
            $dfinanciacion['idciclo'] = $periodo['idciclo'];
            $dfinanciacion['idperiodo'] = $periodo['idperiodo'];
            $dfinanciacion['cicloanio'] = $periodo['cicloanio'];
            $idDetalleFinanciacionNota = $this->documentoPago->insertarDetalleFinanciacionParaNota($dfinanciacion);
            /*
             * se actualiza el registro en nofi para enlazar las notas con la finanaciación construida
             */
            $notaFinanciacion['idnotadocumentopago'] = $documentoPago['idnota'];
            $notaFinanciacion['idfinanciacion'] = $documentoPago['idfinanciacion'];
            $notaFinanciacion['idfinanciacionnota'] = $nuevaFacturaDocuemntoPago['idfinanciacionnuevanota'];
            $notaFinanciacion['iddetallefinanciacion'] = $dfinanciacion['iddetallefinanciacion'];
            $notaFinanciacion['iddetallefinanciacionnota'] = $idDetalleFinanciacionNota;
            $notaFinanciacion['idusuario'] = $dfinanciacion['idusuario'];
            $this->documentoPago->insertarNotaFinanciacion($notaFinanciacion);
        }
        return  $capital_base ; 
    }

    /**
     * Recibe las financiacinones a las cuales se les generara un documento de pago 
     * @param Array $financiaciones
     */
    private function procesarDocumentosPago($financiaciones ) {
        
        foreach ($financiaciones as $documentoPago) {
            $amortizacion = $this->generarAmortizacion($documentoPago);
            // se incluye el identificador de la amortización que fue modificada o creada como nueva
            $documentoPago['idamortizacion'] = $amortizacion['idamortizacion'];
            $documentoPago['idfinanciacion'] = $amortizacion['idfinanciacion'];            
             /*
            * se trae la informacion de la amortización para consultar el docuemnto que aplica a la  Factura
            */            
            $amortizacion = $this->documentoPago->obtenerAmortizacionFinanciacion($documentoPago['idamortizacion']);
            $documentoPago['idfinancicaion'] = $amortizacion['fin_ideregistro'] ;
             /*
             * se realiza la regla de negocio que permite crear el documento de pago
             */ 
            $infoDocFactura = $this->procesarDocumentoPago($documentoPago);
            
            /*
            * se trae la informacion de la amortización para consultar el docuemnto que aplica a la  Factura
            */            
             $amortizacion = $this->documentoPago->obtenerAmortizacionFinanciacion($documentoPago['idamortizacion']);
       
            
            /*
             * valida si cambia el unidocumento y lo actualiza
             */
            $parametros = $this->consultar_aplica_interes($this->sesion->get('idempresa'));
            $infoDocFactura['idempresa'] = $this->sesion->get('idempresa') ;           
            $vlr_concep_felec = $this->genericoModel->sumatoriaConceptosFelec($infoDocFactura) ;         
            if ($vlr_concep_felec > 0) 
            {
                /*
                * consulta el documento y tipo de docuemnto para la factura basada en un documento de pago para la DIAN
                * caso potenza
                */            
               $datosDetalleDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($amortizacion['uni_documento'], $amortizacion['uni_tipdocument'], $parametros['tip_doc_felec']);              
            }
            else
            {
                /*
                * consulta el documento y tipo de docuemnto para la factura basada en un documento de pago 
                * caso potenza
                */
               $datosDetalleDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($amortizacion['uni_documento'], $amortizacion['uni_tipdocument'], $parametros['tip_doc_no_felec']);
            }         
            $infoDocFactura['iddocumento'] = $datosDetalleDocumento['iddocumento'];     
            $infoDocFactura['idtipodocumento'] = $amortizacion['uni_tipdocument'];   
            /*
            * Actualizar factura: valida y actualiza el uni_documento 
            * y  generar consecutivo de la nueva factura 
            */ 
            $this->actualizarValorFactura($infoDocFactura['idnuevafactura'],$infoDocFactura['idempresa'] );
            
            $fac_act['fac_ideregistro'] = $infoDocFactura['idnuevafactura'] ;
            $fac_act['uni_documento']   = $infoDocFactura['iddocumento'] ;
            $fac_act['fac_ctrlfelec']   = 0 ;
            $infoDocFactura['tipo'] = 'FA';
            $factura = $this->genericoModel->obtenerNumeroFactura($infoDocFactura);
            $fac_act['fac_numero'] = $factura['numero'] ;
            $this->genericoModel->actualizarFactura($fac_act);
            $this->genericoModel->actualizarNumeroDisponible($factura['numero'], $factura['idnumero']);
            
            /*
             * se incluye la financiación original para calcular su nuievo saldo 
             */
            $saldoFinanciacion = $this->genericoDelegado->actualizarFinanciacionSaldo($documentoPago['idfinanciacion'], $documentoPago['version']);

            /* Se valida el saldo de la financiación para evitar actualizaciones de saldo en negativo */
            if ($saldoFinanciacion < 0) {
                throw new MyException("Error: No se puede generar documento. El saldo no corresponde con el valor a pagar. Financiación (" . $documentoPago['idfinanciacion'] . ")", -1);
            }
        }
    }
    
     /**
     * Se actualiza el valor de la factura en el encabezado
     * @return type
     */
    private function actualizarValorFactura($idfactura , $idempresa=0) {
        if (empty($idfactura)) {
            return;
        }
        
        $valor = $this->facturarFinanciacionModel->getValorFactura($idfactura , $idempresa);
        /*
         * Se incluye validación de valor de los detalles generados por la cuota , si estos no superan el valor 0 
         * no se actualiza el encabezado de la factura 
         */
        if ($valor > 0) {
            $factura['fac_ideregistro'] = $idfactura;
            $factura['fac_vlrreal'] = $valor;
            $factura['fac_sdoreal'] = $valor;
            $this->facturarFinanciacionModel->actualizar($factura, "fac_factura", "fac_ideregistro=:fac_ideregistro");
        }
    }
     /**
     * Permite calcular el interes para el capital a abonar a cada financiacion seleccionada
     * @param array $financiaciones contiene la información de l as financiaiones seleccionadas 
     * @param string $apl_int que indica si aplica cobro de interes sobre el capital abonado 
     * @param string $apl_int_iva que indica si aplica cobro de iva interes sobre el capital abonado 
     * @throws MyException generado por excepciones hijas controladas
     */
    public function generarIntCapitalPago( $financiaciones ) {
        
        $interes_total = 0 ; 
        $capital_total = 0 ;
        
        foreach ($financiaciones as $documentoPago) { 
            $inter = 0 ;
            /*
             * se realiza la regla de negocio que validar cada detalle y 
             * generar el valor del interes para el capital a abonar
             */    
            //error_log ("\n", 3, "d://my-errors.log");
            $dato = $this->ValidarDetalleFinanciacion($documentoPago );  
            $interes_total =  $interes_total  + $dato['interes'] ;
            $capital_total =  $capital_total  + $dato['capital'] ;           
        }
          $datos['valor_interes'] = $interes_total ; 
          $datos['valor_capital'] = $capital_total ; 
        return $datos ;
    }
    
     /**
     * permite validar los detalles de la financiacion y generar el valor del interes
     * si aplica 
     * @param array $documentoPago informacion de documento de pago
     * @throws MyException si los dias a corbrar son mayores 30 o menores a 0
     */
    private function ValidarDetalleFinanciacion($documentoPago) {        
        $total_interes = 0 ; 
        $datos['capital'] = $documentoPago['valordocumento'] ;
        $datos['interes'] = 0 ;
        /*
         * valida la cantidad de dias que se cobrarian de interes, si es igual a cero retorna cero
         * si es menor a cero o mayo a 30 retorna un error
         */
        $idamfi = $documentoPago['idamortizacionfinanciacion'] ;
        $diasFacturar = $this->documentoPago->consultar_dias_interes($idamfi);
        $diasAmortizacion = $this->documentoPago->consultaDiasAmortizacion($this->sesion->get('idempresa'));
      
        if ($diasFacturar < 0) {
            throw new MyException("Error: la Fecha de la financiacion es posterior a hoy (" . $documentoPago['idfinancicaion'] . ")", -1);
        }

        if ($diasFacturar > $diasAmortizacion) {
            throw new MyException("Error: la financiacion no se ha facturado hace mas de " . $diasAmortizacion . " dias (" . $documentoPago['idfinancicaion'] . ")", -1);
        }
        if ($diasFacturar == 0 ) {
            return $datos ; 
        }  
        /*
        *se valida si aplica interes y si aplica para pago total o parcial
        * la funcion retorna 1 si aplica total, 2 si aplica parcial y 0 sino aplica
        * si no aplica retorna 0
        */
        $parametros = $this->consultar_aplica_interes($this->sesion->get('idempresa'));
        $financiacion = $this->documentoPago->obtenerFinanciacion($documentoPago['idfinancicaion']);       
        $sdo_financiacion = $financiacion['fin_sdocapital'] ;
        
        $apl_interes = $this ->validaAplicaInteres($parametros, $sdo_financiacion, $documentoPago['valordocumento']);
        
        if ($apl_interes == 0 ) {
             return $datos ; 
        }  
        /*
         * se consultan las tasas de interes y de iva al inetres
         * **/
        $tasaInteres = 0 ;
        $tasaIva = 0 ;
        $tasas_fin = $this->documentoPago->consultar_tasas_interes($idamfi) ;
        if (!empty($tasas_fin) and $tasas_fin['interes'] > 0 ) {            
            $tasaInteres = $tasas_fin['interes'] ; 
            /*
             * valida la alicacion del iva al interes
             */                 
            if($tasas_fin['idconceptoivainteres'] != 0 )
            {
               $tasaIva = $tasas_fin['tasaivainteres'] ;     
            }
        }    
        /*
         * permite evaluar si se genera el documento por conceptos o 
         * si el el valor de retorno es -1 significa que no aplica para facturar por 
         * concepto con esta bandera se notifica que se debe facturar de manera ponderada 
         */
        $saldoConceptos = $this->GenCapitalPorConcepto($documentoPago);
        
        /*si no se saldan los conceptos se ponderan a cada uno de ellos el saldo
         * y se consulta el capital para el que si aplica el cobro de interes
         */
        if ( $saldoConceptos  == -1 ) 
        {
           /*
            * se toma los datos de la financiacion para obtener el saldo....
            * */
            $financiacion = $this->documentoPago->obtenerFinanciacion($documentoPago['idfinancicaion']);
            $Vlr_base = $this->documentoPago->obtenerSaldoConceptosBase($documentoPago['idfinancicaion']) ;
            if ($apl_interes == 2)
            {
                $valorInteres = (($Vlr_base * ($tasaInteres / 100)) / 30) * $diasFacturar;
                $sdototal = $financiacion['fin_sdocapital'] + $valorInteres  + ($valorInteres * $tasaIva );
                $saldoponderacion = $this->calcularPonderacionDocumentoPago($documentoPago['valordocumento'], $sdototal , $Vlr_base);
                $saldoConceptos = round($saldoponderacion, CANTIDAD_DECIMALES);
                $valorInteres = (($saldoConceptos * ($tasaInteres / 100)) / 30) * $diasFacturar;
                $total_interes = $valorInteres  + ($valorInteres * $tasaIva );                
                $datos['capital'] = $documentoPago['valordocumento']  -  round($total_interes, CANTIDAD_DECIMALES) ;
                $datos['interes'] = round($total_interes, CANTIDAD_DECIMALES) ;            
                return $datos ;
            }
            else 
            {
                $saldoConceptos = $this->GenCapitalPonderado($documentoPago, $financiacion['fin_sdocapital'] );  
            }
        
        }        
        /* Si hay capital para cobro de interes se procede a calcular 
         * el valor del interes
         **/  
  
        if ($saldoConceptos > 0 ) {                
            $valorInteres = (($saldoConceptos * ($tasaInteres / 100)) / 30) * $diasFacturar;
            $total_interes = $valorInteres  + ($valorInteres * $tasaIva );
        } 
        $datos['interes'] = $total_interes ;
        return $datos;   
    }    
    
    
    /**
     * permite validar si aplica para generar interes, evaluando los parametros de la empresa
     * y el saldo de la factura 
     * @param parametros 
     * @param sdo_financiacion
     * @param vlr_documento
     *  $documentoPago
     */
    private function validaAplicaInteres ($parametros , $sdo_financiacion , $vlr_documento ) {
        /*
         * carga la información de los detalles de financiacion y la financiacion para evaluar los saldos a ponderar 
         */        
        if ( $parametros['int_abon_total'] != 'si' and  $parametros['abono_parcial'] != 'si' )
        {
            return 0 ;  
        }
        if ( $parametros['int_abon_total'] == 'si' and  $sdo_financiacion == $vlr_documento )
        {
            return 1 ;             
        }
        if ( $parametros['abono_parcial'] == 'si' and  $vlr_documento < $sdo_financiacion  )
        {
            return 2 ;            
        }  
        Return 0 ;   
    }
    
    
    /**
     * permite validar los conceptos a procesar pero ponderados 
     * @param DocumentoPago $documentoPago
     */
    private function GenCapitalPonderado ($documentoPago , $sdo_total) {
        /*
         * carga la información de los detalles de financiacion y la financiacion para evaluar los saldos a ponderar 
         */
        $detallesFinanciacion = $this->documentoPago->obtenerDetallesFinanciaciones($documentoPago['idfinancicaion']);
        $financiacion = $this->documentoPago->obtenerFinanciacion($documentoPago['idfinancicaion']);

        $valorcapital = 0 ; 
        $valorcapinteres = 0 ; 
        /*
         * se recorren los detalles de las financiaocnes existentes para construir a la par un detalle de factura 
         * con los nuevos saldos ponderados para el documento de pago 
         */
        for ($i = 0; $i < count($detallesFinanciacion); $i++) {
            $dfinanciacion = $detallesFinanciacion[$i];

            $saldo = $documentoPago['valordocumento'];

            if (count($detallesFinanciacion) - 1 == $i && count($detallesFinanciacion) > 1) {
                $saldofinal = $saldo - $valorcapital ;
                $saldo = round($saldofinal, CANTIDAD_DECIMALES);
            } else {
                /*
                 * se calcula la ponderacion del saldo en una regla de 3 simple verificando que sea una totalizacion del documento
                 */
                if (floatval($sdo_total) > 0 && count($detallesFinanciacion) > 1) {
                    $saldoponderacion = $this->calcularPonderacionDocumentoPago($documentoPago['valordocumento'], $sdo_total, $dfinanciacion['saldo']);
                    $saldo = round($saldoponderacion, CANTIDAD_DECIMALES);
                }
            }
            $valorcapital = $valorcapital + $saldo ;
            $con_base = $this->documentoPago->val_concepto_base($dfinanciacion['idconcepto'],$documentoPago['idamortizacionfinanciacion']);
           // si el concepto es base se acumula el capital
            if ($con_base > 0 )
            {
                $valorcapinteres = $valorcapinteres + $saldo ;
            }              
        }
        return $valorcapinteres ; 
    }
    
     /**
     * permite evaluar si se van a saldar conceptos y generar el valor de interes si aplica
     * @param type $documentoPago
     * @return type
     */
    private function GenCapitalPorConcepto($documentoPago) {
        /*
         * evalua si existen conceptos a generar pago, si no existen conceptos seleccionados se ponderan
         */       
        if (!isset($documentoPago['concepto'])) {
            return -1 ;
        }
        /*
         * se cargan los conceptos seleccionados a cancelar
         */
        $conceptos = $documentoPago['concepto'] ;
        $total_capital = 0 ;
        /*
         * se filtran los conceptos seleccionados a cancelar con el objetivo de evaluar si aplican
         * para generar interes y se suman para luego generar el valor del interes       
         * solo pora los conceptos seleccionados a facturar en el documento de pago
         */
        foreach ($conceptos as $dconcepto) {
            /*
             * se valida si el concepto es base 
             */   
            $con_base = $this->documentoPago->val_concepto_base($dconcepto['idconcepto'],$documentoPago['idamortizacionfinanciacion']);
           // si el concepto es base se acumula el capital
            if ($con_base > 0 )
            {
                $total_capital = $total_capital + $dconcepto['saldo'] ;
            }            
        }
        return $total_capital;
    }
    
    /**
     * se procesa el documento de pago 
     * @param array $documentoPago
     * @throws MyException
     */
    private function procesarDocumentoPago($documentoPago) {
        /*
         * construye la nota  notificando que es de Documento de pago
         */
        $idnota = $this->crearNota($documentoPago['idsuscripcion']);
        $documentoPago['idnota'] = $idnota;
         /*
         * valdia la financiacion para ver si aplica interes y si podera el capital
         */
        $documentoPago['interes'] = 0 ;   
        $dato = $this->ValidarDetalleFinanciacion($documentoPago );  
        $interes  =  $dato['interes'] ;
        $capital  =  $dato['capital'] ; 
      
        if ($interes > 0 ) 
        {
            $documentoPago['valordocumento'] = $capital ;      
        } 
        /*
         * permite insertar la nueva factura a través de la financiacion para generar un nuevo documento de pago, retornando el nuevo
         * identificador de la factura generada. 
         */
        $nuevaFacturaDocumentoPago = $this->crearNuevaFacturaFinanciacion($documentoPago, $documentoPago['valordocumento']);
        /*
         * construir un dfac por cada dfin encontrado en la financiacion por concepto 
         */
        $this->crearDetalleFactura($documentoPago, $nuevaFacturaDocumentoPago);

        return $nuevaFacturaDocumentoPago;
    }

    /**
     * Permite procesar un nuevo documento de pago
     * @param array $financiaciones contiene la información de l as financiaiones a procesar documentos de pago
     * @throws MyException generado por excepciones hijas controladas
     */
    public function generarDocumentoPago($financiaciones ) {
        try {
            //inicia la transacción de proceso de generacion de documentos de pago
            $this->conexion->beginTransaction();
            /* envia las financiacinones a las cuales se les generara un documento de pago, estas con la 
             * configuración del usuario, con respecto a la parámetrización de saldo de conceptos, validando 
             * que este apto para amortizar, en caso de que no cumpla con las restricciones requeridas arrojara una excepcion controlada 
             * expuesta al usuario
             */
            $this->procesarDocumentosPago($financiaciones );
            //procesa toda la actualización generada en el proceso de documento de pago
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Obtiene la in formacón de conceptos  de la finanaciación 
     * @param int $idfinanciacion  identificador de la financiación
     * @return Array carga la información de los conceptos financiables 
     * @throws MyException 'Error al obtener conceptos el archivo'
     */
    public function obtenerConceptosFinanciables($idfinanciacion) {
        $respuesta = $this->documentoPago->obtenerConceptosFinanciablesModel($idfinanciacion);
        if (empty($respuesta)) {
            throw new MyException('Error al obtener conceptos financiables', -1);
        }

        return $respuesta;
    }

    /**
     * permite filtrar las suscrpción que contengan financiaciones
     * @param int $documento identficador de documento
     * @param int $codanterior código anterior 
     * @param int $suscripcion identificador de la suscripción 
     * @return array 
     * @throws MyException no existen suscripciones con financiación
     */
    public function obtenerSuscripcionesFinanciables($documento, $codanterior, $suscripcion) {
        $respuesta = $this->documentoPago->filtrarSuscripcionesFinanciablesModel($documento, $codanterior, $suscripcion);
        if (empty($respuesta)) {
            throw new MyException('No existen suscripciones con financiación', 0);
        }

        return $respuesta;
    }
    /**
     * permite consultar si para la empresa aplica el cobro de intereses para abonos a capital
     * @param int $ideempresa identficador de la empresa
     * @return array 
     * @throws MyException no existen parametrizacion para abonos
     */
    public function consultar_aplica_interes($idempresa) {
        $respuesta = $this->documentoPago->cobrar_interes_abono_financiacion($idempresa);
        if (empty($respuesta)) {
            throw new MyException('No existen configuracion para el cobro de intereses', 0);
        }
        return $respuesta;
    }

    public function consultarTablaFinanciacion($idsuscripcion) {
        return $this->documentoPago->consultarTablaFinanciacion($idsuscripcion);
    }

}
