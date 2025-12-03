<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\AprobacionVentaModel;
use Llanogas\LlanogasBundle\Models\FinanciarVentaModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RegistrarVentasModel;
use Llanogas\LlanogasBundle\Models\ConstructorasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class AprobacionVentaDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var  AprobacionVentaModel
     */
    private $aprobacionVentaModel;

    /**
     *
     * @var RegistrarVentasModel
     */
    private $registrarVentasModel;

    /**
     *
     * @var FinanciarVentasDelegado 
     */
    private $financiarVentaDelegado;

    /**
     *
     * @var FinanciarVentaModel
     */
    private $financiarVentaModel;

    /**
     *
     * @var SuscripcionesDelegado 
     */
    private $suscripcionesDelegado;

    /**
     *
     * @var GenerarDocumentoPagoDelegado
     */
    private $documentoDelegado;

    /**
     * 
     * @var GenerarFinanciacionDelegado 
     */
    private $generarFinanciacionDelegado;

    /**
     *
     * @var ConstructorasModel 
     */
    private $constructoraModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->aprobacionVentaModel = new AprobacionVentaModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->registrarVentasModel = new RegistrarVentasModel($this->conexion);
        $this->financiarVentaModel = new FinanciarVentaModel($this->conexion);
        $this->documentoDelegado = new GenerarDocumentoPagoDelegado($control, $sesion);
        $this->financiarVentaDelegado = new FinanciarVentasDelegado($control, $sesion);
        $this->suscripcionesDelegado = new SuscripcionesDelegado($control, $sesion);
        $this->generarFinanciacionDelegado = new GenerarFinanciacionDelegado($control, $sesion);
        $this->sesion = $sesion;
        $this->constructoraModel = new ConstructorasModel($this->conexion, $sesion);
    }

    /**
     * Consulta las agendas que tiene asignadas a las liquidaciones 
     * de una venta en específico
     * @param int $idVenta
     * @return array lista de las agendas
     * @throws MyException
     */
    public function getListaAgendas($idVenta) {
        $idempresa = $this->sesion->get('idempresa');
        $resultado = $this->aprobacionVentaModel->getListaAgendas($idVenta, $idempresa);
        if (empty($resultado)) {
            throw new MyException('No se encontraron agendas ', 0);
        }
        return $resultado;
    }

    //Valida que si la venta tiene el método de pago Financiada
    //y no tiene asociada una financiación se muestra un mensaje de error
    public function validarFinanciacionVenta($venta) {
        $financiacion = $this->financiarVentaDelegado->getFinanciacion($venta['idventa']);
        if ($venta['metodopago'] == 'F' && empty($financiacion)) {
            throw new MyException('La venta no tiene registrada una financiación ', -1);
        }
    }

    /**
     * Método encargado de aprobar venta 
     * @param int $idVenta
     * @param array $agenda información de la agenda que el usuario seleccionó
     * @param string $observacion Observación de la venta que se quiere tener
     * @throws MyException
     */
    public function aprobarVenta($idVenta, array $agenda, $observacion) {
        if (empty($agenda)) {
            throw new MyException('Debe seleccionar una agenda', -1);
        }
        try {
            $this->conexion->beginTransaction();
            //Se consulta toda la información de la venta de acuerdo a un identificador

            /*
             * factura Electronica 18/08/2018
             * metodo -> getVentas
             * validar consulta que trae los datos de la venta para modificar la tabla uni_unidad por la de Tido_tipdocumen
             * y agregar campos necesarios ademas incluir la tabla doti
             */
            $listaVenta = $this->registrarVentasModel->getVentas(array('idventa' => $idVenta, 'idusuario' => $this->sesion->get('idusuario'), 'idempresa' => $this->sesion->get('idempresa')));
            if (empty($listaVenta)) {
                throw new MyException('No se encontró la venta con número ' . $idVenta, -1);
            }
            $venta = $listaVenta[0];
            //Se valida que la venta no esté mni aprobada ni facturada 
            if ($venta['estado'] == 'A' || $venta['estado'] == 'F') {
                //Si la venta está aprobada se genera un error al momento de realizar las modificaciones
                throw new MyException('La venta ya fue aprobada y no se puede modificar', -1);
            }
            //Se valida que la venta tenga al menos un adjunto y/o soportes
            if ($listaVenta[0]['venclasifica'] != 'PV') {
                $adjuntos = $this->registrarVentasModel->getAdjuntosVenta($idVenta);
                if (empty($adjuntos)) {
                    throw new MyException('No se encontraron soportes de la venta número ' . $idVenta, -1);
                }
            }
            /*
             * factura Electronica
             * abrir un nuevo metodo para la logica de Factura electronica
             * 
             * 
             */
            if ($listaVenta[0]['aplicafelec'] == 'S') {
                $this->facturaElectronica($listaVenta[0], $observacion, $agenda);
                $this->conexion->commit();
                return;
            }

            if ($listaVenta[0]['venclasifica'] == 'PV') {
                $this->consultaAgendaTecsoftPV($listaVenta[0]);
                $this->conexion->commit();
                return;
            }
            if ($listaVenta[0]['venclasifica'] == 'CM') {
                $this->consultaAgendaTecsoftCM($listaVenta[0], $observacion);
                $this->conexion->commit();
                return;
            }





            //Se valida que la venta tenga financiación si el método de pago es F=Financiada
            $this->validarFinanciacionVenta($venta);
            $idempresa = $this->sesion->get('idempresa');
            //Se asigna la agenta y se cambia el estado a la venta
            $this->actualizarVenta('A', $idVenta, 'A', $observacion, $agenda['idagenda']);
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($venta['idsuscripcion']);
            //Se valida que la suscripción no se haya eliminado
            if ($detalleSuscripcion['suscripcion']['estado'] === 'E') {
                throw new MyException('La suscripción se encuentra eliminada');
            }
            $codigoEmpresa = $this->aprobacionVentaModel->getCodigoEmpresa($idempresa);
            $codigoAnterior = $detalleSuscripcion['propiedad']['codigoanterior'] + $codigoEmpresa;
            $clienteExiste = $this->aprobacionVentaModel->consultarClientePorCodigoAnterior($codigoAnterior);
            //Se valida si la suscripción está en estado pendiente 
            //Se crea la venta y el cliente en TECSOFT
            if ($detalleSuscripcion['suscripcion']['estado'] === 'P') {
                $cliente = $this->registrarCliente($venta, $agenda, $detalleSuscripcion);
                $this->registrarVenta($venta, $cliente);
            }
            /*
             * Actualización de Sigue Actividades en Tecsoft 
             */
            if (!empty($clienteExiste)) {

                $parametros['idagenda'] = $agenda['idagenda'];
                $parametros['sigue_codsus'] = $codigoAnterior;
                $parametros['sigue_codemp'] = $codigoEmpresa;
                $this->actualizarAgendaActividades($parametros);
            }
            /**
             * Si la suscripción está activa se procede a crear la factura y las 
             * financiaciones si es el caso
             */
            $this->procesarVenta($venta, $detalleSuscripcion);
            $this->conexion->commit();
//            $this->conexion->rollBack();
        } catch (MyException $ex) {
            $this->conexion->rollBack();
            throw $ex;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('No se pudo aprobar la venta', -1);
        }
    }

    /**
     * Se crea el cliente en TECSOFT 
     * @param arrar $venta información de la venta,suscripción, tercero
     * @param type $agenda información de la agenda de TECSOFT
     * @param type $detalleSuscripcion información detallada de la suscripción
     * @return type
     */
    private function registrarCliente($venta, $agenda, $detalleSuscripcion) {
        $parametros['idsuscripcion'] = $venta['idsuscripcion'];
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $resultadoSuscripcion = $this->genericoModel->getSuscripcion($parametros, $this->sesion->get('idusuario'));
        $infoSuscripcion = $resultadoSuscripcion[0];

        $codigoEmpresa = $this->aprobacionVentaModel->getCodigoEmpresa($this->sesion->get('idempresa'));
        $codigoAnterior = $infoSuscripcion['codigoanterior'] . $codigoEmpresa;


        $asesor = $this->genericoModel->getTerceroInfo($venta['idasesor']);
        $barrio = $this->aprobacionVentaModel->getBarrio($detalleSuscripcion['propiedad']['idbarrio']);
        $codigoAgenda = $this->aprobacionVentaModel->getAliasAgenda($agenda['idagenda']);
        $cliente['cliente_fecven'] = $venta['fecha'];
        $cliente['cliente_numpag'] = $venta['idventa'];
        $cliente['ven_ideregistro'] = $venta['idventa'];
        $cliente['cliente_nomsus'] = $detalleSuscripcion['tercero']['nombretercero'];
        $cliente['cliente_dirsus'] = $detalleSuscripcion['propiedad']['direccion'];
        $cliente['cliente_telsus'] = $detalleSuscripcion['tercero']['telefonofijo'];
        $cliente['cliente_celsus'] = substr($detalleSuscripcion['tercero']['telefonocelular'], 0, 10);
        $cliente['cliente_obs'] = $venta['observacion'];
        $cliente['cliente_tipsus'] = 'COMPLETA';
        $cliente['cliente_codbar'] = $barrio['codigobarrio'];
        $cliente['cliente_estsus'] = $infoSuscripcion['estrato'];
        $cliente['cliente_codsus'] = $infoSuscripcion['codigoanterior'];
        $cliente['cliente_est'] = $this->aprobacionVentaModel->getCodigoServicio($agenda['codigoagenda'], $venta['idsuscripcion'], $this->sesion->get('idempresa'));
        $cliente['cliente_fecvis'] = null;
        $cliente['cliente_codage'] = $codigoAgenda['codigoalias'];
        $cliente['cliente_codemp'] = $codigoEmpresa;
        $cliente['cliente_tipins'] = $this->aprobacionVentaModel->getTipoinscripcion($venta['idsuscripcion']);
        $cliente['cliente_fecgra'] = 'now()';
        $cliente['cliente_usugra'] = $this->aprobacionVentaModel->getCodigoUsuario($this->sesion->get('idusuario'));
        $cliente['cliente_swtgen'] = 'f';
        $cliente['cliente_nummed'] = null;
        $cliente['cliente_estfac'] = null;
        $cliente['cliente_nomven'] = $asesor['nombretercero'];
        $cliente['cliente_swtala'] = 'f';
        $cliente['cliente_rep'] = 'f';
        $cliente['cliente_llacom'] = $codigoAnterior;
        $cliente['cliente_nit'] = $infoSuscripcion['documentotercero'];
        $resultado = $this->constructoraModel->getClienteTecsoft($infoSuscripcion['codigoanterior'], $this->sesion->get('idempresa'));
        /**
         * Se valida que no exista el cliente en tecsoft para crearlo 
         */
        if ($resultado == 0) {
            $this->aprobacionVentaModel->insertar($cliente, 'clientes', NULL);
        } else {
            /**
             * Se actualiza el cliente en dado caso que exista
             */
            $condicion = " cliente_codsus ='" . $cliente['cliente_codsus'] . "' and cliente_codemp = '" . $cliente['cliente_codemp'] . "'";
            $resultado = $this->aprobacionVentaModel->actualizar($cliente, 'clientes', $condicion);
        }
        $cliente['cliente_codage'] = $codigoAgenda['codigoagenda'];
        $cliente['codigoanterior'] = $infoSuscripcion['codigoanterior'];
        return $cliente;
    }

    /**
     * Método encargado de registrar la venta en TECSOFT
     * @param array $venta
     * @param array $cliente
     */
    public function registrarVenta($venta, $cliente) {
        $infoVenta['venta_fecven'] = $venta['fecha'];
        $infoVenta['venta_numpag'] = $venta['idventa'];
        $infoVenta['venta_codsus'] = $cliente['cliente_codsus'];
        $infoVenta['venta_obs'] = $venta['observacion'];
        $infoVenta['venta_tipins'] = $cliente['cliente_tipins'];
        $infoVenta['venta_estsus'] = $cliente['cliente_estsus'];
        $infoVenta['venta_est'] = null;
        $infoVenta['venta_fecvis'] = null;
        $infoVenta['venta_aliage'] = $cliente['cliente_codage'];
        $infoVenta['venta_tipsus'] = 'INCOMPLETA';
        $infoVenta['venta_rep'] = 'f';
        $infoVenta['venta_codemp'] = $cliente['cliente_codemp'];
        $infoVenta['venta_fecgra'] = 'now()';
        $infoVenta['venta_usugra'] = $cliente['cliente_usugra'];
        $infoVenta['venta_empcon'] = null;
        $infoVenta['venta_usuact'] = null;
        $infoVenta['venta_fecact'] = null;
        $infoVenta['venta_ordtra'] = null;
        $infoVenta['venta_swteje'] = 'f';
        $infoVenta['venta_swtala'] = 'f';
        $infoVenta['venta_llacom'] = $cliente['cliente_llacom'];
        $resultado = $this->constructoraModel->getVentaTecsoft($cliente['cliente_codsus'], $this->sesion->get('idempresa'));
        if ($resultado == 0) {
            $this->aprobacionVentaModel->insertar($infoVenta, 'ventas', NULL);
            return;
        }
//        $condicion = " venta_llacom ='" . $cliente['cliente_llacom'] . "'";
        $condicion = " venta_codsus ='" . $cliente['cliente_codsus'] . "'   and venta_codemp ='" . $cliente['cliente_codemp'] . "'";
        $this->aprobacionVentaModel->actualizar($infoVenta, 'ventas', $condicion);
    }

    /**
     * Actualiza el estado de la venta y las observaciones
     * @param type $estado 'A' o 'E'
     * @param type $idVenta identificador de la venta
     * @param type $accion E='Eliminar' o A='Aprobar'
     * @param type $observacion descripción que el usuario ingresa
     * @param type $idAgenda identificador de la agenda con la cuál quedó registrado en TECSOFT
     */
    private function actualizarVenta($estado, $idVenta, $accion, $observacion, $idAgenda = null) {
        if ($accion == 'E') {
            $parametros['fechaeliminacion'] = 'now()';
        } else {
            $parametros['fechaaprobacion'] = 'now()';
            $parametros['idagenda'] = $idAgenda;
        }
        $parametros['estado'] = $estado;
        $parametros['idventa'] = $idVenta;
        $parametros['observacion'] = $observacion;
        $this->aprobacionVentaModel->actualizarVenta($parametros);
    }

    /**
     * Método encargado de eliminar una venta 
     * @param type $accion Eliminar
     * @param type $idVenta identificador venta 
     * @param type $estado 'E'
     * @param type $observacion Descripción del funcionario
     * @throws MyException Error si no se encontró la venta, o la venta ya fue aprobada
     */
    public function eliminarVenta($accion, $idVenta, $estado, $observacion) {
        try {
            $listaVenta = $this->registrarVentasModel->getVentas(array('idventa' => $idVenta, 'idusuario' => $this->sesion->get('idusuario'), 'idempresa' => $this->sesion->get('idempresa')));
            $this->conexion->beginTransaction();
            if (empty($listaVenta)) {
                throw new MyException('No se encontró la venta con número ' . $idVenta, -1);
            }
            $venta = $listaVenta[0];
            if ($venta['estado'] == 'A') {
                throw new MyException('La venta ya fue aprobada y no se puede modificar', -1);
            }
            if ($venta['venclasifica'] == 'PV') {
                $this->getRadicadoCliente($venta);
            }
            $this->actualizarVenta($estado, $idVenta, $accion, $observacion);
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error, no se puede eliminar la venta', -1);
        }
    }

    /**
     * Método de crear la factura y las financiaciones 
     * cuando el estado de la suscripción está Activa
     * @param array $venta
     * @param array $detalleSuscripcion
     * @return type
     */
    private function procesarVenta(array $venta, array $detalleSuscripcion) {
        if ($detalleSuscripcion['suscripcion']['estado'] == 'P') {
            return;
        }
        $idventa = $venta['idventa'];
        $idempresa = $this->sesion->get('idempresa');
        $financiaciones = $this->financiarVentaDelegado->getFinanciaciones($idventa);
        $conceptoNoFinanciado['conceptos'] = $this->aprobacionVentaModel->getConceptosNoFinanciadosVenta($idventa);
        if (!empty($conceptoNoFinanciado['conceptos'])) {
            $venta['idliquidacionfactura'] = $conceptoNoFinanciado['conceptos'][0]['idliquidacion'];
            $conceptoNoFinanciado['valorfinanciable'] = 0;
            $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $conceptoNoFinanciado);
        }
        //Se valida que la venta tenga financiaciones y se procede a diligenciar las notas correspondientes (NF,SF,FF)
        if (!empty($financiaciones) && $venta['metodopago'] == 'F') {
            foreach ($financiaciones as $financiacion) {
                $idLiquidacion = $this->aprobacionVentaModel->getIdLiquidacionPorTipoDocumento($idventa, $financiacion['idliquidacion'], $idempresa);

                $financiacion['valorfinanciable'] = 0;
                $venta['idliquidacionfactura'] = $idLiquidacion;
                $financiacion['idfinanciacion'] = $venta['idfinanciacion'];
                $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $financiacion);
                $financiacion['archivos'] = $this->financiarVentaModel->getAdjuntosVenta($venta['idfinanciacion'], $idventa);
                $this->crearFinanciacionFactura($venta, $detalleSuscripcion['suscripcion'], $financiacion, $factura);
            }
        }
    }

    /**
     * Método de crear la factura y las financiaciones 
     * cuando el estado de la suscripción está Activa
     * @param array $venta
     * @param array $detalleSuscripcion
     * @return type
     */
    private function procesarVentaCompraCartera(array $venta, array $detalleSuscripcion) {
        if ($detalleSuscripcion['suscripcion']['estado'] == 'P') {
            return;
        }
        $idventa = $venta['idventa'];
        $idempresa = $this->sesion->get('idempresa');
        $financiaciones = $this->financiarVentaDelegado->getFinanciaciones($idventa);
        $conceptoNoFinanciado['conceptos'] = $this->aprobacionVentaModel->getConceptosVentaCompraCartera($idventa);
     /*   if (!empty($conceptoNoFinanciado['conceptos'])) {
            $venta['idliquidacionfactura'] = $conceptoNoFinanciado['conceptos'][0]['idliquidacion'];
            $conceptoNoFinanciado['valorfinanciable'] = 0;
            $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $conceptoNoFinanciado);
        }
      */
        //Se valida que la venta tenga financiaciones y se procede a diligenciar las notas correspondientes (NF,SF,FF)
        if (!empty($financiaciones) && $venta['metodopago'] == 'F') {
            foreach ($financiaciones as $financiacion) {
                $idLiquidacion = $this->aprobacionVentaModel->getIdLiquidacionPorTipoDocumento($idventa, $financiacion['idliquidacion'], $idempresa);

                $financiacion['valorfinanciable'] = 0;
                $venta['idliquidacionfactura'] = $idLiquidacion;
                $financiacion['idfinanciacion'] = $venta['idfinanciacion'];
                $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $financiacion, $conceptoNoFinanciado);
                $financiacion['archivos'] = $this->financiarVentaModel->getAdjuntosVenta($venta['idfinanciacion'], $idventa);
                $this->crearFinanciacionFactura($venta, $detalleSuscripcion['suscripcion'], $financiacion, $factura);
            }
        }
    }

    /**
     * Crea una factura con sus respectivos conceptos y actualiza la venta a estado 'F'
     * @param array $venta Información de la venta a la que se le crea la factura
     * @param array $detalleSuscripcion Información de la suscripción
     * @param array $financiacion Información de los conceptos de la venta
     * @return array Información final de la factura creada
     */
    private function crearFacturaVenta(array $venta, array $detalleSuscripcion, $financiacion, $conceptoCompraCartera = null) {
        $idFactura = $this->armarObjetoFactura($venta, $detalleSuscripcion, $venta['idliquidacionfactura']);
        foreach ($financiacion['conceptos'] as $concepto) {
            $this->armarObjetoDetalleFactura($concepto, $idFactura);
            $financiacion['valorfinanciable'] += intval($concepto['valortotal']);
        }
        if (!empty($conceptoCompraCartera)){
            foreach ($conceptoCompraCartera['conceptos'] as $concepto) {
                $this->armarObjetoDetalleFactura($concepto, $idFactura);
            }
        }
        $factura = $this->genericoModel->getFactura($idFactura);
        $factura['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($factura);
        $this->genericoDelegado->actualizarFacturaSaldo($idFactura, $factura['version']);
        $facturaActualizada = $this->genericoModel->getFactura($idFactura);

        $venta['estado'] = 'F';
        $venta['idfactura'] = $idFactura;
        $venta['fechafacturada'] = 'now()';
        $this->aprobacionVentaModel->actualizarVenta($venta);
        return $facturaActualizada;
    }

    /**
     * Crea una factura con sus respectivos conceptos y actualiza la venta a estado 'F'
     * @param array $venta Información de la venta a la que se le crea la factura
     * @param array $detalleSuscripcion Información de la suscripción
     * @param array $financiacion Información de los conceptos de la venta
     * @return array Información final de la factura creada
     */
    private function crearFacturaVentaElectronica(array $venta, array $detalleSuscripcion, $financiacion) {
        $idFactura = $this->armarObjetoFacturaElectronica($venta, $detalleSuscripcion, $venta['idliquidacionfactura']);
        foreach ($financiacion['conceptos'] as $concepto) {
            $this->armarObjetoDetalleFacturaElectronica($concepto, $idFactura);
            $financiacion['valorfinanciable'] += intval($concepto['valortotal']);
        }

        $factura = $this->genericoModel->getFactura($idFactura);
        $factura['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($factura);
        $this->genericoDelegado->actualizarFacturaSaldo($idFactura, $factura['version']);
        $facturaActualizada = $this->genericoModel->getFactura($idFactura);

        return $facturaActualizada;
    }

    /**
     * Arma un objeto para guardar una factura según la venta, suscripción y liquidación enviada
     * @param object $venta - Información de la venta que se está guardando
     * @param object $detalleSuscripcion - Información de la suscripción de la venta (tercero, propiedad, suscripción, conceptos)
     * @param int $idliquidacion - Liquidación con la que se guardará la factura
     */
    private function armarObjetoFactura($venta, $detalleSuscripcion, $idliquidacion) {
        $parametros = Array();
        $fecha = date('Y-m-j');
        $tercero = $detalleSuscripcion['tercero'];
        $suscripcion = $detalleSuscripcion['suscripcion'];
        $infoLiquidacion = $this->aprobacionVentaModel->getInformacionLiquidacion($idliquidacion);
        $nuevafecha = date('Y-m-j', strtotime('+' . $infoLiquidacion['diavencimiento'] . 'day', strtotime($fecha)));
        if(empty($suscripcion['fechavenciminto'])){
            $suscripcion['fechavenciminto'] = $nuevafecha;
        }
        if(empty($suscripcion['fechasuspension'])){
            $suscripcion['fechasuspension'] = $nuevafecha;
        }


        $parametros['estado'] = 'A';
        $parametros['fecha'] = 'now()';
        $parametros['saldofactura'] = 0;
        $parametros['metodogenera'] = 'P';
        $parametros['versionfactura'] = 1;
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['fechavencimiento'] = $suscripcion['fechavenciminto']; 
        $parametros['fechasuspension'] = $suscripcion['fechasuspension'];
        $parametros['idliquidacion'] = $idliquidacion;
        $parametros['idempresa'] = $venta['idempresa'];
        $parametros['valorreal'] = $venta['valortotal'];
        $parametros['idciclo'] = $suscripcion['idciclo'];
        $parametros['idtercero'] = empty($venta['tersolicita']) ? $tercero['idtercero'] : $venta['tersolicita'];
        $parametros['iddocumento'] = $venta['iddocumento'];
        $parametros['cicloanio'] = $suscripcion['cicloanio'];
        $parametros['idperiodo'] = $suscripcion['idperiodo'];
        $parametros['idsuscriptor'] = $tercero['idsuscriptor'];
        $parametros['tipotercero'] = $tercero['idtipotercero'];
        $parametros['idsuscripcion'] = $tercero['idsuscripcion'];
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idtipodocumento'] = $venta['idtipodocumento'];
        $parametros['idtiposuscripcion'] = $suscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $suscripcion['idtipousosuscripcion'];
        $parametros['fechafinanciacion'] = $venta['metodopago'] == 'F' ? 'now()' : null;
        return $this->aprobacionVentaModel->insertarFacturaVenta($parametros);
    }

    /**
     * Arma un objeto para guardar una factura según la venta, suscripción y liquidación enviada
     * @param object $venta - Información de la venta que se está guardando
     * @param object $detalleSuscripcion - Información de la suscripción de la venta (tercero, propiedad, suscripción, conceptos)
     * @param int $idliquidacion - Liquidación con la que se guardará la factura
     */
    private function armarObjetoFacturaElectronica($venta, $detalleSuscripcion, $idliquidacion) {
        $parametros = Array();
        $fecha = date('Y-m-j');
        $tercero = $detalleSuscripcion['tercero'];
        $suscripcion = $detalleSuscripcion['suscripcion'];
        $infoLiquidacion = $this->aprobacionVentaModel->getInformacionLiquidacion($idliquidacion);
        $nuevafecha = date('Y-m-j', strtotime('+' . $infoLiquidacion['diavencimiento'] . 'day', strtotime($fecha)));

        if(empty($suscripcion['fechavenciminto'])){
            $suscripcion['fechavenciminto'] = $nuevafecha;
        }
        if(empty($suscripcion['fechasuspension'])){
            $suscripcion['fechasuspension'] = $nuevafecha;
        }
        $parametros['estado'] = 'T';
        $parametros['fecha'] = 'now()';
        $parametros['saldofactura'] = 0;
        $parametros['metodogenera'] = 'P';
        $parametros['versionfactura'] = 1;
        $parametros['fechaaprobacion'] = 'now()';
        $parametros['idhistoricoliquidacion'] = 0;
        $parametros['fechavencimiento'] = $suscripcion['fechavenciminto']; 
        $parametros['fechasuspension'] = $suscripcion['fechasuspension'];
        $parametros['idliquidacion'] = $idliquidacion;
        $parametros['idempresa'] = $venta['idempresa'];
        $parametros['valorreal'] = $venta['valortotal'];
        $parametros['idciclo'] = $suscripcion['idciclo'];
        $parametros['idtercero'] = empty($venta['tersolicita']) ? $tercero['idtercero'] : $venta['tersolicita'];
        $parametros['iddocumento'] = $venta['iddocumento'];
        $parametros['cicloanio'] = $suscripcion['cicloanio'];
        $parametros['idperiodo'] = $suscripcion['idperiodo'];
        $parametros['idsuscriptor'] = $tercero['idsuscriptor'];
        $parametros['tipotercero'] = $tercero['idtipotercero'];
        $parametros['idsuscripcion'] = $tercero['idsuscripcion'];
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idtipodocumento'] = $venta['idtipodocumento'];
        $parametros['idtiposuscripcion'] = $suscripcion['idtiposuscripcion'];
        $parametros['idtipousosuscripcion'] = $suscripcion['idtipousosuscripcion'];
        $parametros['fechafinanciacion'] = null;
        return $this->aprobacionVentaModel->insertarFacturaVenta($parametros);
    }

    /**
     * Se crea un detalle de factura 
     * @param type $concepto información del concepto de la venta que se quiere 
     * registrar
     * @param type $idfactura identificador de la factura que se creó para asignarles 
     * los detalles
     */
    private function armarObjetoDetalleFactura($concepto, $idfactura) {
        $parametros = array();
        $parametros['saldo'] = 0;
        $parametros['version'] = 1;
        $parametros['estado'] = 'A';
        $parametros['idfactura'] = $idfactura;
        $parametros['cantidad'] = $concepto['cantidad'];
        $parametros['valorreal'] = $concepto['valorreal'];
        $parametros['idconcepto'] = $concepto['idconcepto'];
        $parametros['valortotal'] = $concepto['valortotal'];
        $parametros['valorunitario'] = $concepto['valorunitario'];
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $this->aprobacionVentaModel->insertarDetalleFactura($parametros);
    }

    /**
     * Se crea un detalle de factura 
     * @param type $concepto información del concepto de la venta que se quiere 
     * registrar
     * @param type $idfactura identificador de la factura que se creó para asignarles 
     * los detalles
     */
    private function armarObjetoDetalleFacturaElectronica($concepto, $idfactura) {
        $parametros = array();
        $parametros['saldo'] = 0;
        $parametros['version'] = 1;
        $parametros['estado'] = 'A';
        $parametros['idfactura'] = $idfactura;
        $parametros['cantidad'] = $concepto['cantidad'];
        $parametros['valorreal'] = $concepto['valorreal'];
        $parametros['idconcepto'] = $concepto['idconcepto'];
        $parametros['valortotal'] = $concepto['valortotal'];
        $parametros['valorunitario'] = $concepto['valorunitario'];
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $this->aprobacionVentaModel->insertarDetalleFactura($parametros);
    }

    /**
     * Genera el registro en fin_financiacio 
     * @param type $venta
     * @param type $suscripcion
     * @param type $financiacion
     * @param array $factura
     * @return type
     */
    private function crearFinanciacionFactura($venta, $suscripcion, $financiacion, $factura) {
        $parametros = array();
        $infoDocumento = $this->genericoModel->getDocumentoLiquidacion($financiacion['idliquidacion']);
        $factura['valorfinanciar'] = $financiacion['valorfinanciar'];

        $parametros['facturas'][] = $factura;

        $parametros['idciclo'] = $suscripcion['idciclo'];
        $parametros['cicloanio'] = $suscripcion['cicloanio'];
        $parametros['idperiodo'] = $suscripcion['idperiodo'];
        $parametros['iddocumento'] = $infoDocumento['iddocumento'];
        $parametros['numerocuotas'] = $financiacion['numerocuota'];
        $parametros['idempresa'] = $this->sesion->get("idempresa");
        $parametros['idusuario'] = $this->sesion->get("idusuario");
        $parametros['idtipodocumento'] = $infoDocumento['idtipodocumento'];
        $parametros['idparentesco'] = $financiacion['idparentesco'];
        $parametros['idsuscripcion'] = $suscripcion['idsuscripcion'];
        $parametros['idliquidacion'] = $financiacion['idliquidacion'];
        $parametros['identidad'] = $financiacion['identidadfinanciera'];
        $parametros['numerofinanciacion'] = $financiacion['idfinanciacion']; //Es el número del pagaré
        $parametros['valorfinanciable'] = $financiacion['valorfinanciable'];
        $parametros['valortotalfinanciar'] = $financiacion['valorfinanciar'];
        $parametros['idfinanciacion'] = $this->aprobacionVentaModel->getSecuenciaFinanciacion();
        $parametros['idsolicita'] = $this->genericoModel->getTerceroInfo($financiacion['idsolicitante']);

        $numfinanciacion = $this->generarFinanciacionDelegado->procesarFinanciacion($parametros);
        $this->crearAdjuntoFinanciacion($financiacion['archivos'], $numfinanciacion);
        return $numfinanciacion;
    }

    /**
     * Asigna los adjuntos de ventas a la nueva financiación
     * @param type $archivos
     * @param type $numfinanciacion
     */
    private function crearAdjuntoFinanciacion($archivos, $numfinanciacion) {
        if (!empty($numfinanciacion)) {
            foreach ($archivos as $archivo) {
                $archivo['idfinanciacion'] = $numfinanciacion;
                $this->aprobacionVentaModel->insertarAdjuntoFinanciacion($archivo);
            }
        }
    }

    public function consultaHistoricoVenta($idVenta) {
        return $this->aprobacionVentaModel->consultaHistoricoVentaModelo($idVenta);
    }

    public function actualizarAgendaActividades($parametros) {
        $codigoAgenda = $this->aprobacionVentaModel->getAliasAgenda($parametros['idagenda']);
        $parametros['sigue_codage'] = $codigoAgenda['codigoagenda'];
        $this->aprobacionVentaModel->actualizarAgendaActividad($parametros);
    }

    /*
     * Factura Electronica...
     * 18/08/2018
     */

    public function facturaElectronica($dataVenta, $observacion, $agenda) {
        try {
             if ($dataVenta['estadosuscripcion'] == 'E'){
                 throw new MyException('La suscripción se encuentra eliminada', -1);
            }
            if ($dataVenta['venclasifica'] == "VE") {
                if($dataVenta['estadosuscripcion'] == 'P'){
                $this->consultaAgendaTecsoftVEElectronica($dataVenta, $observacion, $agenda);
                return;
                }
                 $this->consultaAgendaVentaElectronicaSuscripcionAprobada($dataVenta, $observacion, $agenda);
                 return;
            }
            if ($dataVenta['venclasifica'] == "PV") {
                $this->consultaAgendaTecsoftPVElectronica($dataVenta, $observacion);
                return;
            }
            if ($dataVenta['venclasifica'] == "CM") {
                $this->consultaAgendaTecsoftCMElectronica($dataVenta, $observacion);
                return;
            }
            throw new MyException('Error, El documento no puede ser Procesado', -1);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }
    
     public function consultaAgendaVentaElectronicaSuscripcionAprobada($dataVenta, $observacion, $agenda) {
        try {

            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($dataVenta['idsuscripcion']);
            $detalleSuscripcion['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $getConceptos['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($dataVenta['idventa']);
            $dataVenta['idliquidacionfactura'] = $getConceptos['conceptos'][0]['idliquidacion'];
            $getConceptos['valorfinanciable'] = 0;
            $resultadoFactura = $this->crearFacturaVentaElectronica($dataVenta, $detalleSuscripcion, $getConceptos);

            $parametros['estado'] = 'F';
            $parametros['idfactura'] = $resultadoFactura['idfactura'];
            $parametros['fechafacturada'] = 'now()';
            $parametros['idventa'] = $dataVenta['idventa'];
            $parametros['observacion'] = $observacion;
            $this->aprobacionVentaModel->actualizarVenta($parametros);
            
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultaAgendaTecsoftVEElectronica($dataVenta, $observacion, $agenda) {
        try {
            /*
             * consulta el tipo de agenda para saber si se debe enviar
             * la programacion de agenda en el area tecnica
             * solo cuando esta sea diferente de cero
             */

            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($dataVenta['idsuscripcion']);
            if ($agenda['idagenda'] != 0) {
                $cliente = $this->registrarCliente($dataVenta, $agenda, $detalleSuscripcion);
                $this->registrarVenta($dataVenta, $cliente);
                //----  OJOOOO....   //  se debe actualizar la venta y esta debe quedar en estado  ven_estado = 'A' --
                $this->actualizarVenta('A', $dataVenta['idventa'], 'A', $dataVenta['observacion'], $agenda['idagenda']);
                return;
            }

            //  validar la tabla ven_venta el campo fac_ideregistro is null 
            if ($dataVenta['idfactura'] == null) {
                throw new MyException('Error, la venta ya tiene asignada una factura', -1);
                return;
            }
            $getConceptos['valorfinanciable'] = 0;
            $getConceptos['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($dataVenta['idventa']);
            $dataVenta['idliquidacionfactura'] = $getConceptos['conceptos'][0]['idliquidacion'];
            $resultadoFactura = $this->crearFacturaVentaElectronica($dataVenta, $detalleSuscripcion, $getConceptos);
            //  se debe actualizar la venta y esta debe quedar en estado  ven_estado = 'F' --


            /*
             * Consumo de Web Services
             */
            //  si la respuesta  del web service es positivo se actualiza la venta
            $parametros['estado'] = 'F';
            $parametros['idfactura'] = $resultadoFactura['idFactura'];
            $parametros['fechafacturada'] = 'now()';
            $parametros['idventa'] = $dataVenta['idventa'];
            $parametros['observacion'] = $dataVenta['observacion'] . " - " . $observacion;
            $this->aprobacionVentaModel->actualizarVenta($parametros);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultaAgendaTecsoftPVElectronica($dataVenta, $observacion) {
        try {

            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($dataVenta['idsuscripcion']);
            $detalleSuscripcion['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $getConceptos['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($dataVenta['idventa']);
            $dataVenta['idliquidacionfactura'] = $getConceptos['conceptos'][0]['idliquidacion'];
            $getConceptos['valorfinanciable'] = 0;
            $resultadoFactura = $this->crearFacturaVentaElectronica($dataVenta, $detalleSuscripcion, $getConceptos);
            /*
             * Consumo de Web Services
             */
            /*
             * tener encuenta la actualizacion de la venta debe quedar en estado  ven_estado = 'F' --
             */

            $parametros['estado'] = 'F';
            $parametros['idfactura'] = $resultadoFactura['idfactura'];
            $parametros['fechafacturada'] = 'now()';
            $parametros['idventa'] = $dataVenta['idventa'];
            $parametros['observacion'] = $observacion;
            $this->aprobacionVentaModel->actualizarVenta($parametros);
            $parametros1['facturausu_est'] = 'Aprobada';
            $parametros1['facturausu_fecact'] = 'now()';
            $parametros1['facturausu_usuact'] = $detalleSuscripcion['usuarionit']['usuarionit'];
            $parametros1['facturausu_numven'] = $dataVenta['idventa'];
            $this->aprobacionVentaModel->actualizaOrdenServicio($parametros1);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultaAgendaTecsoftPV(array $venta) {
        try {
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($venta['idsuscripcion']);
            $idventa = $venta['idventa'];
            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $detalleSuscripcion['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $financiaciones = $this->financiarVentaDelegado->getFinanciaciones($idventa);
            $conceptoNoFinanciado['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($idventa);
            if (!empty($conceptoNoFinanciado['conceptos'])) {
                $venta['idliquidacionfactura'] = $conceptoNoFinanciado['conceptos'][0]['idliquidacion'];
                $conceptoNoFinanciado['valorfinanciable'] = 0;
                $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $conceptoNoFinanciado);
            }
            //Se valida que la venta tenga financiaciones y se procede a diligenciar las notas correspondientes (NF,SF,FF)
            if (!empty($financiaciones) && $venta['metodopago'] == 'F') {
                foreach ($financiaciones as $financiacion) {
                    $idLiquidacion = $this->aprobacionVentaModel->getIdLiquidacionPorTipoDocumento($idventa, $financiacion['idliquidacion'], $idempresa);

                    $financiacion['valorfinanciable'] = 0;
                    $venta['idliquidacionfactura'] = $idLiquidacion;
                    $financiacion['idfinanciacion'] = $venta['idfinanciacion'];
                    $factura = $this->crearFacturaVenta($venta, $detalleSuscripcion, $financiacion);
                    $financiacion['archivos'] = $this->financiarVentaModel->getAdjuntosVenta($venta['idfinanciacion'], $idventa);
                    $this->crearFinanciacionFactura($venta, $detalleSuscripcion['suscripcion'], $financiacion, $factura);
                }
            }
            $parametros['facturausu_est'] = 'Aprobada';
            $parametros['facturausu_fecact'] = 'now()';
            $parametros['facturausu_usuact'] = $detalleSuscripcion['usuarionit']['usuarionit'];
            $parametros['facturausu_numven'] = $idventa;
            $this->aprobacionVentaModel->actualizaOrdenServicio($parametros);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultaAgendaTecsoftCMElectronica($dataVenta, $observacion) {
        try {
            /*
             * consulta el tipo de agenda para saber si se debe enviar
             * la programacion de agenda en el area tecnica
             * solo cuando esta sea diferente de cero
             */
            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $idCedula = $this->sesion->get('cedula');
            $getConceptos['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($dataVenta['idventa']);
            $getConceptosCertificacion = $this->aprobacionVentaModel->getConceptoCertificacion($dataVenta['idventa']);
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($dataVenta['idsuscripcion']);
            $detalleSuscripcion['solicitante'] = $this->aprobacionVentaModel->getDetalleSolicitante($dataVenta['idventa']);
            $detalleSuscripcion['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $codigoEmpresa = $this->aprobacionVentaModel->getCodigoEmpresa($idempresa);
            $detalleSuscripcion['codigoEmpresa'] = $codigoEmpresa;
            if ($getConceptosCertificacion > 0) {
                $codigoAnterior = $detalleSuscripcion['propiedad']['codigoanterior'] + $codigoEmpresa;
                $clienteExiste = $this->aprobacionVentaModel->consultarClientePorCodigoAnterior($codigoAnterior);
                if (empty($clienteExiste)) {
                    throw new MyException('Se cancela Transacción, Cliente no creado en Tecsoft', -1);
                }
                $this->cargarPQRTecsoft($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);
                $this->actualizarVenta('A', $dataVenta['idventa'], 'A', $observacion, null);
                return;
            }

            $this->cargarPQRTecsoft($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);

            //ANALISAR CUANDO SALGA LA INFORMACION DEL SISTEMA DE VEPOS
            /* if ($dataVenta['ideagenda'] != 0) {
              $cliente = $this->registrarCliente($dataVenta, $dataVenta['ideagenda'], $detalleSuscripcion);
              $this->registrarVenta($dataVenta, $cliente);
              } */
            $dataVenta['idliquidacionfactura'] = $getConceptos['conceptos'][0]['idliquidacion'];
            $getConceptos['valorfinanciable'] = 0;
            $resultadoFactura = $this->crearFacturaVentaElectronica($dataVenta, $detalleSuscripcion, $getConceptos);
            /*
             * Consumo de Web Services
             */
            /*
             * tener encuenta la actualizacion de la venta debe quedar en estado  ven_estado = 'F' --
             */

            $parametros['estado'] = 'F';
            $parametros['idfactura'] = $resultadoFactura['idFactura'];
            $parametros['fechafacturada'] = 'now()';
            $parametros['idventa'] = $dataVenta['idventa'];
            $parametros['observacion'] = $dataVenta['observacion'];
            $this->aprobacionVentaModel->actualizarVenta($parametros);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function consultaAgendaTecsoftCM($dataVenta, $observacion) {
        try {
            /*
             * consulta el tipo de agenda para saber si se debe enviar
             * la programacion de agenda en el area tecnica
             * solo cuando esta sea diferente de cero
             */
            $idempresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $idCedula = $this->sesion->get('cedula');
            $getConceptos['conceptos'] = $this->aprobacionVentaModel->getConceptosVenta($dataVenta['idventa']);
            $getConceptosCertificacion = $this->aprobacionVentaModel->getConceptoCertificacion($dataVenta['idventa']);
            $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($dataVenta['idsuscripcion']);
            $detalleSuscripcion['solicitante'] = $this->aprobacionVentaModel->getDetalleSolicitante($dataVenta['idventa']);
            $detalleSuscripcion['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $codigoEmpresa = $this->aprobacionVentaModel->getCodigoEmpresa($idempresa);
            $detalleSuscripcion['codigoEmpresa'] = $codigoEmpresa;

            if (empty($detalleSuscripcion['solicitante'])) {
                throw new MyException(' no se obtubo informacion del solicitante');
            }
            if ($getConceptosCertificacion > 0) {
                $codigoAnterior = $detalleSuscripcion['propiedad']['codigoanterior'] . $codigoEmpresa;
                $clienteExiste = $this->aprobacionVentaModel->consultarClientePorCodigoAnterior($codigoAnterior);
                if (empty($clienteExiste)) {
                    throw new MyException('Se cancela Transacción, Cliente no creado en Tecsoft', -1);
                }
                $this->cargarPQRTecsoft($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);
                $this->actualizarVenta('A', $dataVenta['idventa'], 'A', $observacion, null);
                
            }

            $this->cargarPQRTecsoft($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);
                $this->actualizarVenta('A', $dataVenta['idventa'], 'A', $observacion, null);

            //ANALIZAR CUANDO SALGA LA INFORMACION DEL SISTEMA DE VEPOS
            /* if ($dataVenta['ideagenda'] != 0) {
              $cliente = $this->registrarCliente($dataVenta, $dataVenta['ideagenda'], $detalleSuscripcion);
              $this->registrarVenta($dataVenta, $cliente);
              } */
            $dataVenta['idliquidacionfactura'] = $getConceptos['conceptos'][0]['idliquidacion'];
            $this->procesarVentaCompraCartera($dataVenta, $detalleSuscripcion);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function cargarPQRTecsoft($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion) {
        try {

            if ($detalleSuscripcion['solicitante']['nombrecompleto'] == '' || $detalleSuscripcion['solicitante']['nombrecompleto'] == null) {
                throw new MyException('Error, No se Obtuvo el nombre el Solicitante', -1);
            }
            if ($detalleSuscripcion['solicitante']['correo'] == '' || $detalleSuscripcion['solicitante']['correo'] == null) {
                throw new MyException('Error, No se Obtuvo el correo del Solicitante', -1);
            }
            if ($detalleSuscripcion['solicitante']['documento'] == '' || $detalleSuscripcion['solicitante']['documento'] == null) {
                throw new MyException('Error, No se Obtuvo el documento del Solicitante', -1);
            }
            if ($detalleSuscripcion['solicitante']['celular'] == '' || $detalleSuscripcion['solicitante']['celular'] == null) {
                throw new MyException('Error, No se Obtuvo el celular del Solicitante', -1);
            }
            $resultadoFirma = $this->aprobacionVentaModel->getFirmaInstaladora($dataVenta['idcompetenciafirma']);
            $dataVenta['nitfirmainstaladora'] = $resultadoFirma[0]['documentofirma'];
            $idNumeroPQR = $this->grabarReclamo($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);
            $this->grabarVisitaDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR);
            $this->grabarDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR, $observacion);
            return;
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarReclamo($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion) {
        try {
            return $this->construyeReclamo($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $observacion);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarVisitaDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR) {
        try {
            $this->construyeVisitaDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function grabarDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR, $observacion) {
        try {
            $this->construyeDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR, $observacion);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function construyeReclamo($dataVenta, $getConceptosCertificacion, array $detalleSuscripcion, $observacion) {
        try {
            $codrec = 649;
            if ($getConceptosCertificacion > 0) {
                $codrec = 650;
            }
            $fechaListado = $this->aprobacionVentaModel->getFechaHabil(16);
            $parametros = array();
            $parametros['reclamo_tipsol'] = '001';
            $parametros['reclamo_fecsol'] = 'now()';
            $parametros['reclamo_nomsol'] = $detalleSuscripcion['solicitante']['nombrecompleto'];
            $parametros['reclamo_idsol'] = $detalleSuscripcion['solicitante']['documento'];
            $parametros['reclamo_codsus'] = $detalleSuscripcion['propiedad']['codigoanterior'];
            $parametros['reclamo_telsol'] = $detalleSuscripcion['solicitante']['telfijo'];
            $parametros['reclamo_celsol'] = $detalleSuscripcion['solicitante']['celular'];
            $parametros['reclamo_email'] = $detalleSuscripcion['solicitante']['correo'];
            $parametros['reclamo_codsec'] = '001';
            $parametros['reclamo_obssol'] = $observacion;
            $parametros['reclamo_est'] = '0030';
            $parametros['reclamo_codemp'] = $detalleSuscripcion['codigoEmpresa'];
            $parametros['reclamo_tipate'] = '001';
            $parametros['reclamo_tipnot'] = '001';
            $parametros['reclamo_codrec'] = $codrec;
            $parametros['reclamo_codage'] = '009'; // $dataVenta['ideagenda'];
            $parametros['reclamo_codpro'] = substr($detalleSuscripcion['propiedad']['codigoanterior'], 0, 2);
            $parametros['reclamo_usugra'] = $detalleSuscripcion['usuarionit']['usuarionit'];
            $parametros['reclamo_fecgra'] = 'now()';
            $parametros['reclamo_sus'] = 'No';
            $parametros['reclamo_empcon'] = $dataVenta['nitfirmainstaladora'];
            $parametros['reclamo_feclis'] = $fechaListado[0]['fecha'];
            $parametros['ven_ideregistro'] = $dataVenta['idventa'];

            $secuencia = null;
            if ($this->sesion->get('idempresa') == LLANOGAS_IDPROYCTO) {
                $secuencia = 'reclamo_numpqr1';
            }
            if ($this->sesion->get('idempresa') == 319) {
                $secuencia = 'reclamo_numpqr2';
            }
            return $this->aprobacionVentaModel->insertarReclamo($parametros, $secuencia);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function construyeVisitaDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR) {
        try {
            $parametros = array();
            $parametros['visitadau_codsus'] = $detalleSuscripcion['propiedad']['codigoanterior'];
            $parametros['visitadau_fecvis'] = 'now()';
            $parametros['visitadau_est'] = 'Visita';
            $parametros['visitadau_codemp'] = $detalleSuscripcion['codigoEmpresa'];
            $parametros['visitadau_fecgra'] = 'now()';
            $parametros['visitadau_usugra'] = $detalleSuscripcion['usuarionit']['usuarionit'];
            $parametros['visitadau_numpqr'] = $idNumeroPQR;
            $parametros['visitadau_empcon'] = $dataVenta['nitfirmainstaladora']; // validar que empresa va aca

            return $this->aprobacionVentaModel->insertarVisitaDau($parametros);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function construyeDau($dataVenta, $getConceptosCertificacion, $detalleSuscripcion, $idNumeroPQR, $observacion) {
        $codrec = 'COMPRA DE CARTERA SIN CERTIFICACION';
        if ($getConceptosCertificacion > 0) {
            $codrec = 'COMPRA DE CARTERA CON CERTIFICACION';
        }
        try {
            $parametros = array();
            $parametros['dau_codsus'] = $detalleSuscripcion['propiedad']['codigoanterior'];
            $parametros['dau_numpqr'] = $idNumeroPQR;
            $parametros['dau_fecsol'] = 'now()';
            $parametros['dau_tipate'] = 'PERSONAL';
            $parametros['dau_sec'] = 'POSTVENTA';
            $parametros['dau_descser'] = $codrec;
            $parametros['dau_obser'] = $observacion;
            $parametros['dau_fecgra'] = 'now()';
            $parametros['dau_codemp'] = $detalleSuscripcion['codigoEmpresa'];
            $parametros['dau_swtpro'] = 'TRUE';
            $parametros['dau_swtact'] = 'FALSE';
            $parametros['dau_tipsol'] = 'SERVICIO';
            $parametros['dau_nomsol'] = $detalleSuscripcion['solicitante']['nombrecompleto'];
            $parametros['dau_tel'] = $detalleSuscripcion['solicitante']['telfijo'];
            $parametros['dau_cel'] = $detalleSuscripcion['solicitante']['celular'];
            $parametros['dau_empcon'] = $dataVenta['nitfirmainstaladora'];
            $parametros['dau_fecpro'] = 'now()';
            $parametros['dau_fecact'] = 'now()';
            $parametros['dau_usuact'] = $detalleSuscripcion['usuarionit']['usuarionit'];

            return $this->aprobacionVentaModel->insertarDau($parametros);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function getRadicadoCliente($venta) {
        try{
            $idEmpresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $radicadoCliente = $this->aprobacionVentaModel->getRadicadoCliente($venta['idventa'], $idEmpresa);
            $radicadoCliente['usuarionit'] = $this->aprobacionVentaModel->getDocumentoColaborador($idusuario);
            $idNumeroPQR = $this->construyeReclamoRechazo($venta, $radicadoCliente);
            $this->construyeDauRechazo($venta, $radicadoCliente, $idNumeroPQR);
            $this->construyeVisitaDauRechazo($venta, $radicadoCliente, $idNumeroPQR);
            $parametros['facturausu_est'] = 'Rechazada';
            $parametros['facturausu_fecact'] = 'now()';
            $parametros['facturausu_usuact'] = $radicadoCliente['usuarionit']['usuarionit'];
            $parametros['facturausu_numven'] = $venta['idventa'];
            $this->aprobacionVentaModel->actualizaOrdenServicio($parametros);
        } catch (\Exception $e){
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    public function construyeReclamoRechazo($dataVenta, $radicadoCliente) {
        try {
            $codrec = 648;
            $estado = "0030";
            $codigoSeccion = "001";
            $codage = "009";
            if ($radicadoCliente[0]['reclamo_codsec'] == '008') {
                $codrec = 489;
                $codigoSeccion = "023";
                $estado = "0037";
                $codage = "012";
            }
            if ($radicadoCliente[0]['reclamo_codsec'] == '002') {
                $codigoSeccion = "002";
            }

            $fechaListado = $this->aprobacionVentaModel->getFechaHabil(16);
            $parametros = array();
            $parametros['reclamo_tipsol'] = '001';
            $parametros['reclamo_fecsol'] = 'now()';
            $parametros['reclamo_nomsol'] = $radicadoCliente[0]['reclamo_nomsol'];
            $parametros['reclamo_idsol'] = $radicadoCliente[0]['reclamo_idsol'];
            $parametros['reclamo_codsus'] = $radicadoCliente[0]['reclamo_codsus'];
            $parametros['reclamo_telsol'] = $radicadoCliente[0]['reclamo_telsol'];
            $parametros['reclamo_celsol'] = $radicadoCliente[0]['reclamo_celsol'];
            $parametros['reclamo_email'] = $radicadoCliente[0]['reclamo_email'];
            $parametros['reclamo_codsec'] = $codigoSeccion;
            $parametros['reclamo_obssol'] = "Viene del radicado " . $radicadoCliente[0]['reclamo_numpqr'] . " por rechazo en la orden de servicio";
            $parametros['reclamo_est'] = $estado;
            $parametros['reclamo_codemp'] = $radicadoCliente[0]['reclamo_codemp'];
            $parametros['reclamo_tipate'] = '001';
            $parametros['reclamo_tipnot'] = '001';
            $parametros['reclamo_codrec'] = $codrec;
            $parametros['reclamo_codage'] = $codage; // $dataVenta['ideagenda'];
            $parametros['reclamo_codpro'] = $radicadoCliente[0]['reclamo_codpro'];
            $parametros['reclamo_usugra'] = $radicadoCliente['usuarionit']['usuarionit'];
            $parametros['reclamo_fecgra'] = 'now()';
            $parametros['reclamo_sus'] = $radicadoCliente[0]['reclamo_sus'];
            $parametros['reclamo_feclis'] = $fechaListado[0]['fecha'];
            $parametros['reclamo_nomter'] = $radicadoCliente[0]['reclamo_nomter'];
            $parametros['reclamo_empcon'] = $radicadoCliente[0]['reclamo_empcon'];
            $parametros['reclamo_cedter'] = $radicadoCliente[0]['reclamo_cedter'];
            $parametros['reclamo_telter'] = $radicadoCliente[0]['reclamo_telter'];
            $parametros['reclamo_corter'] = $radicadoCliente[0]['reclamo_corter'];

            $secuencia = null;
            if ($this->sesion->get('idempresa') == LLANOGAS_IDPROYCTO) {
                $secuencia = 'reclamo_numpqr1';
            }
            if ($this->sesion->get('idempresa') == 319) {
                $secuencia = 'reclamo_numpqr2';
            }
            return $this->aprobacionVentaModel->insertarReclamo($parametros, $secuencia);
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    public function construyeDauRechazo($dataVenta, $radicadoCliente, $idNumeroPQR) {
        $codrec = 'VALIDACIÓN SERVICIO EJECUTADO';
        if ($radicadoCliente[0]['reclamo_codsec'] == '001' || $radicadoCliente[0]['reclamo_codsec'] == '002') {
            try {
                $parametros = array();
                $parametros['dau_codsus'] = $radicadoCliente[0]['reclamo_codsus'];
                $parametros['dau_numpqr'] = $idNumeroPQR;
                $parametros['dau_fecsol'] = 'now()';
                $parametros['dau_tipate'] = 'PERSONAL';
                $parametros['dau_sec'] = 'POSTVENTA';
                $parametros['dau_descser'] = $codrec;
                $parametros['dau_obser'] = "Viene del radicado " . $radicadoCliente[0]['reclamo_numpqr'] . " por rechazo en la orden de servicio";
                $parametros['dau_fecgra'] = 'now()';
                $parametros['dau_codemp'] = $radicadoCliente[0]['reclamo_codemp'];
                $parametros['dau_swtpro'] = 'TRUE';
                $parametros['dau_swtact'] = 'FALSE';
                $parametros['dau_tipsol'] = 'SERVICIO';
                $parametros['dau_nomsol'] = $radicadoCliente[0]['reclamo_nomsol'];
                $parametros['dau_tel'] = $radicadoCliente[0]['reclamo_telsol'];
                $parametros['dau_cel'] = $radicadoCliente[0]['reclamo_celsol'];
                $parametros['dau_empcon'] = $radicadoCliente[0]['reclamo_empcon'];
                $parametros['dau_fecpro'] = 'now()';
                $parametros['dau_fecact'] = 'now()';
                $parametros['dau_usuact'] = $radicadoCliente['usuarionit']['usuarionit'];

                return $this->aprobacionVentaModel->insertarDau($parametros);
            } catch (\Exception $ex) {
                throw new MyException($ex->getMessage(), $ex->getCode());
            }
        }
    }

    public function construyeVisitaDauRechazo($dataVenta, $radicadoCliente, $idNumeroPQR) {
        if ($radicadoCliente[0]['reclamo_codsec'] == '001' || $radicadoCliente[0]['reclamo_codsec'] == '002') {
            try {
                $parametros = array();
                $parametros['visitadau_codsus'] = $radicadoCliente[0]['reclamo_codsus'];
                $parametros['visitadau_fecvis'] = 'now()';
                $parametros['visitadau_est'] = 'Visita';
                $parametros['visitadau_codemp'] = $radicadoCliente[0]['reclamo_codemp'];
                $parametros['visitadau_fecgra'] = 'now()';
                $parametros['visitadau_usugra'] = $radicadoCliente['usuarionit']['usuarionit'];
                $parametros['visitadau_numpqr'] = $idNumeroPQR;
                $parametros['visitadau_empcon'] = $radicadoCliente[0]['reclamo_empcon']; // validar que empresa va aca

                return $this->aprobacionVentaModel->insertarVisitaDau($parametros);
            } catch (\Exception $ex) {
                throw new MyException($ex->getMessage(), $ex->getCode());
            }
        }
    }

}
