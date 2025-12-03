<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use \Llanogas\LlanogasBundle\Models\GenericoModel;
use \Llanogas\LlanogasBundle\Models\ReunificarFinanciacionModel;
use Llanogas\LlanogasBundle\Models\FacturarFinanciacionModel;
use Llanogas\LlanogasBundle\Models\GenerarDocumentoPagoModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de la reunificacion de la financiacion
 * @author sergio vargas
 */
class ReunificarFinanciacionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ReunificarFinanciacionModel 
     */
    private $reunificarModel;

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
     *
     * @var Llanogas\LlanogasBundle\Models\GenerarDocumentoPagoModel 
     */
    private $documentoPago;
    
    /**
     *
     * @var Llanogas\LlanogasBundle\Models\GenerarDocumentoPagoModel 
     */
    private $facturarFinanciacionModel;

    // <editor-fold desc="Consultar suscripcion a refinanciables">  

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->reunificarModel = new ReunificarFinanciacionModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->documentoPago = new GenerarDocumentoPagoModel($this->conexion);
        $this->sesion = $sesion;
        $this->facturarFinanciacionModel = new FacturarFinanciacionModel($this->conexion, $this->sesion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Permite obtener la informacion de suscripciones 
     * @param type $idsuscripcion
     * @param type $documentotercero
     * @param type $codigoanterior
     * @return array obtiene el listado de 
     */
    public function obtenerSuscripcionReunificar($idsuscripcion, $documentotercero, $codigoanterior) {
        $empresa = $this->sesion->get('idempresa');
        $respuesta = $this->reunificarModel->filtrarSuscripcionesReunificarFinanciacionModel($idsuscripcion, $empresa, $documentotercero, $codigoanterior);
        if (empty($respuesta)) {
            throw new MyException('No se encontraron suscripciones', 0);
        }
        return $respuesta;
    }
    public function consultarReunificacionRealizadaPorSuscripcion($idsuscripcion){
        return $reunificacionesRealizadas =  $this->reunificarModel->consultarReunificacionRealizadasSuscripcion($idsuscripcion);
    }

    /**
     * permite listar los tipos de documentos validos para el programa de financiacion
     */
    public function obtenerTiposDocumento($idsuscripcion) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->reunificarModel->getTipoDocumentoPerfilSuscripcion($idsuscripcion, PROGRAMA_REUNIFICARFINANCIACION, $idusuario, $idempresa);
    }

    /**
     * permite listar los documentos validos para el programa de financiacion
     */
    public function obtenerDocumentos($idtipodocumento) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getDocumentoPerfil(PROGRAMA_REUNIFICARFINANCIACION, $idusuario, $idempresa, $idtipodocumento);
    }

    /**
     * Arma la informacion de la suscripcion
     * @param int $idsuscripcion
     * @return type
     */
    public function obtenerInformacionSuscripcion($idsuscripcion) {
        $documentoTipoDocumento = $this->reunificarModel->consultarDocumentoTipoDocumentoReunificarModel($idsuscripcion);
        $liquidacion = $this->reunificarModel->consultarLiquidacionFinanciacionModel();
        $respuesta["documentostipos"] = $documentoTipoDocumento;
        $respuesta["liquidaciones"] = $liquidacion;
        $respuesta["fechafinanciacion"] = Util::fechaActual();
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idsuscripcion);
        $respuesta['idciclo'] = $cicloPeriodo['idciclo'];
        $respuesta['ciclo'] = $cicloPeriodo['ciclo'];
        $respuesta['idperiodo'] = $cicloPeriodo['idperiodo'];
        $respuesta['periodo'] = $cicloPeriodo['periodo'];
        return $respuesta;
    }

// </editor-fold>    
    // <editor-fold desc="Crear Reunificación ">  

    /**
     * Actualiza el estado de la financiacion pasando los estados de la financiacion y de la amortización a U. con el fin de unificar las financiaciones seleccionadas
     * @param array $financiacionReunificar
     * @throws MyException  Error: No hay financiaciones a reunificar
     */
    private function actualizarEstadoFinanciacion($financiacionReunificar, $idfinanciacionNueva , $Intereses = 'no') {
        //revisa si hay financiaciones a unificar
        if (empty($financiacionReunificar['reunificar'])) {
            throw new MyException('Error, no hay financiaciones a reunificar');
        }
        foreach ($financiacionReunificar['reunificar'] as $financiacion) {
            //actualiza la finanaciacion actual marcandola con su estado a U en fin
            $this->reunificarModel->actualizarFinanciacion($financiacion['idfinanciacion'], $idfinanciacionNueva);
            //Consulta la amortización que este en estado Activo de una financiación.
            $amortizacionFinanciacion = $this->reunificarModel->consultarAmortizacionFinanciacion($financiacion['idfinanciacion']);
            if (empty($amortizacionFinanciacion)) {
               throw new MyException('Error, La Financiación no tiene un amfi activo...');
            }        
            //si se requiere el cobro de intereses, se llama la funcion que los calcula                 
            if ($Intereses == 'si' )
            {
                $objinteres['idsuscripcion']= $financiacionReunificar['idsuscripcion']  ;
                $objinteres['financiacion']= $financiacion  ;
                $objinteres['amfi']= $amortizacionFinanciacion  ;
                 //actualiza el saldo de los detalles de la financiacion
                $this->GenerarInteresReunificacion($objinteres);
                
            }  
            
            //Actualiza el estado de la amortización a U en amfi
            $this->reunificarModel->actualizarAmortizacionFinanciacion($amortizacionFinanciacion['idamortizacionfinanfiacion']);  

            //actualiza el saldo de los detalles de la financiacion
            $this->reunificarModel->actualizarDetalleFinanciacion($financiacion['idfinanciacion']);
        }
    }

    /**
     * 
     * @param array $parametros
     * @param \Llanogas\LlanogasBundle\Models\ReunificarFinanciacionModel $reunificarFinanciacionModel
     * @param array ciclo-periodo
     * @throws MyException
     */
    private function crearNuevaFinanciacion($financiacionReunificar) {
        $datosFinanciacion = $financiacionReunificar['financiacion'];
        $financiacion['capitalinicial'] = $datosFinanciacion['valortotalfinanciaciones'];
        $financiacion['saldocapital'] = $datosFinanciacion['valortotalfinanciaciones'];
        $financiacion['idsolicita'] = $datosFinanciacion['idsolicita'];
        $financiacion['idsuscripcion'] = $financiacionReunificar['idsuscripcion'];
        $financiacion['identidadfinanciera'] = $datosFinanciacion['identidadfinanciera'];
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($financiacionReunificar['idsuscripcion']);
        $financiacion['idciclo'] = $cicloPeriodo['idciclo'];
        $financiacion['idperiodo'] = $cicloPeriodo['idperiodo'];
        $financiacion['cicloanio'] = $cicloPeriodo['cicloanio'];
        $financiacion['idempresa'] = $this->sesion->get('idempresa');
        $financiacion['idusuario'] = $this->sesion->get('idusuario');
        //se construye una nueva financiacion que sera reunificada
        $idFinanciacion = $this->reunificarModel->insertarFinanciacion($financiacion);
        //se pasa al arreglo la nueva financiacion construida que servira para decirle a 
        //la amortización a que financiacion debera pertenecer
        $financiacion['idnuevafinanciacion'] = $idFinanciacion;
        $this->crearNuevaAmortizacion($financiacion, $datosFinanciacion);
        return $idFinanciacion;
    }

    /**
     * construye una nueva amortización 
     * @param array $financiacion contiene los datos de la financiacion cargada por identificador
     * @param array $datosFinanciacion contiene los datos de la financiacion de origen 
     */
    private function crearNuevaAmortizacion($financiacion, $datosFinanciacion) {
        //crear un nuevo registro en amfi para con el fin de  crear una nueva amortización
        $financiacion['cuotas'] = $datosFinanciacion['cuotas'];
        $financiacion['idliquidacion'] = $datosFinanciacion['idliquidacion'];
        //obtiene los documento y tipos de documento de la liquidacion 
        $documentosLiquidacion = $this->genericoModel->consultarDocumentosTiposPorLiquidacion($datosFinanciacion['idliquidacion']);
        $financiacion['iddocumento'] = $documentosLiquidacion['iddocumento'];
        $financiacion['idtipodocumento'] = $documentosLiquidacion['idtipodocumento'];
        $this->reunificarModel->insertarNuevaAmortizacion($financiacion);
    }

    /**
     * 
     * @param array $reunificacion información de interfaz con las financiaciones que se deben reunificar
     * @param int $idfinanciacionnueva nuevo idfinanciacion generado
     */
    private function crearDetallesNuevaFinanciacion($reunificacion, $idfinanciacionnueva, $idliquidacion, $idsuscripcion) {
        //se construye la nota como unidad de financiación
        $idnota = $this->insertarNota($idsuscripcion);
        //cancelar financiaciones existentes a través de una nota 
        $parametros['idnota'] = $idnota;
        $parametros['idfinanciacionnueva'] = $idfinanciacionnueva;
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['idliquidacion'] = $idliquidacion;
        //se consultan los conceptos a financiar teniendo encuenta que acumule los saldo 
        /* ejemplo 
         * |dfin   |dfact  |saldo  | fin
         * |1      |4      |50     | 1
         * |2      |5      |50     | 1
         * 
         * |dfin   |dfact  |saldo  | fin
         * |3      |6      |50     | 2
         * |4      |4      |25     | 2
         * 
         * nuevos campos de detalle financiacion luego de unificar 
         * 
         * |dfin   |dfact  |saldo  | fin
         * |5      |6      |50     | 3
         * |6      |5      |50     | 3 
         * |7      |4      |75     | 3   notese que acumulo los dos dfac en un solo saldo
         */
        $conceptosFinanciacion = $this->consultarConceptosDetalleFinanciacion($reunificacion);
        $this->insertarDetalleNotasFinanciacion($reunificacion, $parametros);
        $this->insertarNuevosDetallesFinanciacion($conceptosFinanciacion, $parametros);
        $this->actualizarFinanciacion($idfinanciacionnueva, $reunificacion);

        $this->genericoDelegado->actualizarFinanciacionSaldo($idfinanciacionnueva, 1);
    }

    private function insertarDetalleNotasFinanciacion($reunificacion, $parametros) {
        $idusuario = $this->sesion->get('idusuario');
        foreach ($reunificacion as $financiacion) {
            $detalleFinanciacion = $this->reunificarModel->obtenerFinanciacion($financiacion['idfinanciacion']);
            $detalleFinanciacion['idfinanciacionOrigen'] = $financiacion['idfinanciacion'];
            $detalleFinanciacion['idusuario'] = $idusuario;
            $idFinanciacionNota = $this->reunificarModel->insertarFinanciacionNota($detalleFinanciacion);
            $detalleFinanciaciones = $this->reunificarModel->obtenerDetalleFinanciacion($financiacion['idfinanciacion']);
            foreach ($detalleFinanciaciones as $detfinanaciacion) {
                $detfinanaciacion['idfinanciacionnota'] = $idFinanciacionNota;
                $detfinanaciacion['idusuario'] = $idusuario;
                $detfinanaciacion['iddetallefinanciacionOrigen'] = $detfinanaciacion['dfin_ideregistr'];
                $idDetalleNotaFinanciacion = $this->reunificarModel->insertarDetalleNotaFinanciacion($detfinanaciacion);
                //insertar nota financiacion 
                $notaFinanciacion['idnota'] = $parametros['idnota'];
                $notaFinanciacion['idfinanciacionOrigen'] = $detfinanaciacion['fin_ideregistro'];
                $notaFinanciacion['dfinIdOrigen'] = $detfinanaciacion['dfin_ideregistr'];
                $notaFinanciacion['idfinanciacionNotaNueva'] = $idFinanciacionNota;
                $notaFinanciacion['iddetallenotafinanciacion'] = $idDetalleNotaFinanciacion;
                $notaFinanciacion['idusuario'] = $idusuario;
                $this->reunificarModel->insertarNotaFinanciacion($notaFinanciacion);
            }
        }
    }

    /**
     * permite inluiir los detalles de financiacion por cada detalle de financiacion 
     * los saldo quedan iguales o sumados siempre y cuando tengan el mismo defact
     * ejemplo 
     * |dfin   |dfact  |saldo  | fin
     * |1      |4      |50     | 1
     * |2      |5      |50     | 1
     * 
     * |dfin   |dfact  |saldo  | fin
     * |3      |6      |50     | 2
     * |4      |4      |25     | 2
     * 
     * nuevos campos de detalle financiacion luego de unificar 
     * 
     * |dfin   |dfact  |saldo  | fin
     * |5      |6      |50     | 3
     * |6      |5      |50     | 3 
     * |7      |4      |75     | 3   notese que acumulo los dos dfac en un solo saldo
     * @param type $conceptosFinanciacion
     */
    private function insertarNuevosDetallesFinanciacion($conceptosFinanciacion, $parametros) {
        foreach ($conceptosFinanciacion as $conceptos) {
            $detalleFinanciacion['idfinanciacion'] = $parametros['idfinanciacionnueva'];
            $detalleFinanciacion['iddetallefactura'] = $conceptos['iddetallefactura'];
            $detalleFinanciacion['idfactura'] = $conceptos['idfactura'];
            $detalleFinanciacion['idsuscripcion'] = $parametros['idsuscripcion'];
            $detalleFinanciacion['idliquidacion'] = $parametros['idliquidacion'];
            $detalleFinanciacion['idconcepto'] = $conceptos['idconcepto'];
            //aqui se incluye el nuevo saldo para valorunitario
            $detalleFinanciacion['saldo'] = $conceptos['saldo'];
            $detalleFinanciacion['idempresa'] = $this->sesion->get('idempresa');
            $detalleFinanciacion['idusuario'] = $this->sesion->get('idusuario');
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($parametros['idsuscripcion']);
            $detalleFinanciacion['idciclo'] = $cicloPeriodo['idciclo'];
            $detalleFinanciacion['idperiodo'] = $cicloPeriodo['idperiodo'];
            $detalleFinanciacion['cicloanio'] = $cicloPeriodo['cicloanio'];
            $this->reunificarModel->insertarDetalleFinanciacion($detalleFinanciacion);
        }
    }

    /**
     * obtiene todas las facturas asociadas a la financiacion
     * @param array $financiacionReunificar
     * @return array
     */
    private function consultarConceptosDetalleFinanciacion($financiacionReunificar) {
        $lista = array();
        foreach ($financiacionReunificar as $financiacion) {
            $lista[] = $financiacion['idfinanciacion'];
        }
        $complemento = implode(',', $lista);

        return $this->reunificarModel->consultarConceptosDetalleFinanciacion($complemento);
    }

    /**
     * Crea una Nota de Reunificación
     * @param int $idsuscripcion
     * @return int Identificador de nota
     */
    private function insertarNota($idsuscripcion) {
        $nota['idsuscripcion'] = $idsuscripcion;
        $cicloperiodo = $this->genericoModel->getCicloPeriodoSuscripcion($idsuscripcion);
        $nota['idciclo'] = $cicloperiodo['idciclo'];
        $nota['idperiodo'] = $cicloperiodo['idperiodo'];
        $nota['cicloanio'] = $cicloperiodo['cicloanio'];
        $nota['idempresa'] = $this->sesion->get('idempresa');
        $nota['idusuario'] = $this->sesion->get('idusuario');
        return $this->reunificarModel->insertarNota($nota);
    }

    private function actualizarFinanciacion($idfinanciacionNueva, $reunificacion) {
        foreach ($reunificacion as $financiacion) {
            $idfinanciacion = $financiacion['idfinanciacion'];
            $this->reunificarModel->actualizarFinanciacionUnificacion($idfinanciacion, $idfinanciacionNueva);
        }
    }

    /**
     * Permite construir la reunificacion de una liquidacion 
     * @param array $financiacionReunificar parametros obtenidos de la peticion
     * @return type
     * @throws MyException Mensaje de error heredado
     */
    public function crearReunificacion($financiacionReunificar) {
        try {
            //inicia la transaccion para la generacion de la reunificacion 
            $this->conexion->beginTransaction();
            //se crea la nueva financiacion con los saldo acumulados en las facturas a reunificar, retornando elk nuevo identificador 
            //de la financiaicion 
            $idfinanciacionNueva = $this->crearNuevaFinanciacion($financiacionReunificar);
            //crear los detalles de financiacion con los conceptos acumulados, un dfin por cada concepto relacionado por dfac 
            $this->crearDetallesNuevaFinanciacion($financiacionReunificar['reunificar'], $idfinanciacionNueva, $financiacionReunificar['financiacion']['idliquidacion'], $financiacionReunificar['idsuscripcion']);

             /*
             * Se valida si para empresa aplica el cobro de inetreses para abono total de la 
             * financiacion y se genera factura con el valor de intereses correspondiente
             */
            $respuesta = $this->documentoPago->cobrar_interes_abono_financiacion($this->sesion->get('idempresa'));
            if (empty($respuesta)) {
                throw new MyException('No existen configuracion para el cobro de intereses', 0);
            }             
            //actualiza el estado de las financiacioines a U con el fin de notificar que se encuentran 
            //en proceso de reunificadas se actualiza la amortización siempre y cuando se haya modificado las cuotas
            $this->actualizarEstadoFinanciacion($financiacionReunificar, $idfinanciacionNueva, $respuesta['int_abon_total']);
                     
            $this->conexion->commit();
            return $idfinanciacionNueva;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }
    
    /**
     * Permite generar los intereses para las financiaciones que se van areunificar
     * @param array $financiacionReunificar parametros obtenidos de la peticion
     * @return type
     * @throws MyException Mensaje de error heredado
     */
    private function GenerarInteresReunificacion($objinteres ) {   
        /*
         * Genera la cuota 0 de la financiación, se generan únicamente intereses 
         */  
        $idamfi = $objinteres['amfi']['idamortizacionfinanfiacion'] ;
        $idliquidacion = $objinteres['amfi']['idliquidacion'] ;
        $idFinanciacion = $objinteres['financiacion']['idfinanciacion'] ;
        $saldofin = $objinteres['financiacion']['saldo'] ;
        $idsuscrpcion = $objinteres['idsuscripcion'];     
        $diasFacturar = $this->documentoPago->consultar_dias_interes($idamfi);
        if ($diasFacturar < 0) {
            throw new MyException("Error: la Fecha de la financiacion es posterior a hoy (" . $idFinanciacion . ")", -1);
        }         
        $saldoConceptos = $this->facturarFinanciacionModel->saldoConceptosBase($idliquidacion,$idFinanciacion );
        if ($saldoConceptos > 0 and $diasFacturar > 0  ) {
            $tasas_fin = $this->documentoPago->consultar_tasas_interes($idamfi) ;
            if (!empty($tasas_fin) and $tasas_fin['interes'] > 0 ) {
                $objfactura['idamfi'] = $idamfi ; 
                $objfactura['idsuscripcion'] = $idsuscrpcion ; 
                $objfactura['idfinanciacion'] = $idFinanciacion ; 
                $idfactura = $this->crearNuevaFacturaFinanciacion($objfactura);    
                $tasaInteres = $tasas_fin['interes'] ;                     
                $valorInteres = (($saldoConceptos * ($tasaInteres / 100)) / 30) * $diasFacturar;
                $tasaInteres = $tasas_fin['tasaivainteres'] ;                   
                $this->procesarOtrosConceptos($valorInteres, $tasas_fin , $idfactura )  ;  
                $valor_factura = $this->facturarFinanciacionModel->getValorFactura($idfactura, $this->sesion->get('idempresa'));
                $infoDocumentoFactura = $this->genericoModel->consultarFactura($idfactura);
                /*
                 * Se incluye validación de valor de los detalles generados por la cuota , si estos no superan el valor 0 
                 * no se actualiza el encabezado de la factura 
                 */
                if ($valor_factura > 0) {
                    $factura['fac_ideregistro'] = $idfactura;
                    $factura['fac_vlrreal'] = $valor_factura;
                    $factura['fac_sdoreal'] = $valor_factura;
                    $this->facturarFinanciacionModel->actualizar($factura, "fac_factura", "fac_ideregistro=:fac_ideregistro");
                }
                
                /*
         * Actualizar factura y  generar consecutivo de la nueva factura 
         */
        $infoDocumentoFactura['tipo'] = 'FA';
        $factura = $this->genericoModel->obtenerNumeroFactura($infoDocumentoFactura);
        $this->genericoModel->actualizarNumeroFactura($idfactura, $factura['numero']);
        $this->genericoModel->actualizarNumeroDisponible($factura['numero'], $factura['idnumero']);
        $this->genericoModel->actualizarEstadoFacturaElectronica($idfactura, 'T',0);
        
            }
        }
    }
    
    /**
     * permite construir la nueva factura a partir de la financaicion existente
     * @param array $documentopago informacion de documento de pago
     * @param int $idamortizacion identificador de la amortizacion 
     * @return int identificador de la nueva factura
     */
    private function crearNuevaFacturaFinanciacion($objfactura) {
        /*
         * obtiene la amortización vigente con el fin de obtener el documento y tipo de documento requeridos para crear una nueva factura 
         */
        $informacionAmortizacion = $this->documentoPago->obtenerAmortizacionFinanciacion($objfactura['idamfi']);
        /*
         * consulta el documento y tipo de docuemnto para la factura basada en un documento de pago
         */
        $datosDetalleDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($informacionAmortizacion['uni_documento'], $informacionAmortizacion['uni_tipdocument'], 'DF');
        $infoDocumentoFactura['iddocumento'] = $datosDetalleDocumento['iddocumento'];
        $infoDocumentoFactura['idtipodocumento'] = $informacionAmortizacion['uni_tipdocument'];
        /*
         * se carga el ciclo periodo basado en la suscripcion 
         */
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($objfactura['idsuscripcion']);
        $infoDocumentoFactura['idciclo'] = $cicloPeriodo['idciclo'];
        $infoDocumentoFactura['idperiodo'] = $cicloPeriodo['idperiodo'];
        $infoDocumentoFactura['cicloanio'] = $cicloPeriodo['cicloanio'];
        /*
         * se carga la informacion actual de la suscripcion con el fin de crear una nueva facturación 
         */
        $financiacionOriginal = $this->documentoPago->consultarSuscripcionSuscriptor($objfactura['idsuscripcion']);
        $infoDocumentoFactura['idsuscriptor'] = $financiacionOriginal['idsuscriptor'];
        $infoDocumentoFactura['idsuscripcion'] = $objfactura['idsuscripcion'];
        $infoDocumentoFactura['idtiposuscripcion'] = $financiacionOriginal['idtiposuscripcion'];
        $infoDocumentoFactura['idtipousosuscripcion'] = $financiacionOriginal['idtipousosuscripcion'];
        $infoDocumentoFactura['idtercero'] = $financiacionOriginal['idtercero'];
        $infoDocumentoFactura['idtipotercero'] = $financiacionOriginal['idtipotercero'];
        $infoDocumentoFactura['idtiposuscripcion'] = $financiacionOriginal['idtiposuscripcion'];
        $infoDocumentoFactura['idliquidacion'] = $informacionAmortizacion['uni_liquidacion'];
        $infoDocumentoFactura['valordocumento'] = 0 ;
        $infoDocumentoFactura['idempresa'] = $this->sesion->get('idempresa');
        $infoDocumentoFactura['idusuario'] = $this->sesion->get('idusuario');
        $infoDocumentoFactura['idfinanciacion'] = $objfactura['idfinanciacion'];
        /*
         * se calcula la fecha de suspension de la nueva factura 
         */
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($objfactura['idsuscripcion']);
        $fechas = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
        $infoDocumentoFactura['fechasuspension'] = $fechas['fechasuspension'];
        $infoDocumentoFactura['fechavencimiento'] = $fechas['fechavencimiento'];
        /*
         * se construye la nueva factura y se devuleve su identificador
         */
        $idNuevaFactura = $this->documentoPago->insertarFacturaDocumentoPago($infoDocumentoFactura);
        
        return $idNuevaFactura;
    }
    
     /**
     *  Se inserta el concepto de interés con el valor total
     * @param type $valorTotalInteres
     * @return type
     */
    public function procesarOtrosConceptos($valorTotalInteres, $tasas , $idfactura) {
        if ($tasas['interes'] == 0) {
            return;
        }     
      
        $detalleinteresPago['saldo'] = $valorTotalInteres ;
        $detalleinteresPago['idfactura'] = $idfactura;
        $detalleinteresPago['idusuario'] = $this->sesion->get('idusuario');
        $detalleinteresPago['idconcepto'] = $tasas['idconceptointeres']  ;
        $detalleinteresPago['iddetallefinanciacion'] = null;        
        $this->documentoPago->insertarDetalleFacturaDocumentoPago($detalleinteresPago);

        $historicoInteres['idfactura'] = $idfactura;
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
        $detalleIvainteres['idfactura'] = $idfactura;
        $detalleIvainteres['idusuario'] = $this->sesion->get('idusuario');
        $detalleIvainteres['idconcepto'] = $tasas['idconceptoivainteres']  ;
        $detalleIvainteres['iddetallefinanciacion'] = null;          
        $this->documentoPago->insertarDetalleFacturaDocumentoPago($detalleinteresPago);
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


}
