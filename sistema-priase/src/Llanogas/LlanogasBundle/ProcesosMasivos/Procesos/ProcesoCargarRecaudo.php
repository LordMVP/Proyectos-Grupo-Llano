<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\CargarRecaudosModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar recaudos
 * @author Appfuture
 */
class ProcesoCargarRecaudo {

    private $idHilo;

    /**
     * información del registro del recaudo que está en la tabla temporal
     * @var array 
     */
    private $recaudo;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $cargarRecaudosModel;

    /**
     *
     * @var array 
     */
    private $infoSuscripcion;

    /**
     *
     * @var array 
     */
    private $cicloPeriodo;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;

    /**
     *
     * @var array 
     */
    private $convenio;

    function __construct($idEmpresa, $idUsuario, $idAcceso, $idProceso = 0) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
        $this->idHilo = $idProceso;
        $this->conexion = ConexionBD::getConexion();
        $this->cargarRecaudosModel = new CargarRecaudosModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }

    /**
     * Registra la ejecución del proceso de cargar recaudos y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_CARGAR_RECAUDOS;
            $proceso['idAcceso'] = $this->idAcceso;
            $proceso['idEmpresa'] = $this->idEmpresa;
            $proceso['idHilo'] = $this->idHilo;
            $this->idProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Cierra la ejecucion del proceso dejando al programa habilitado para una
     * nueva ejecución
     * @param int $idControlProceso
     */
    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /*
     * Consulta los recaudos que se van a procesar según el estado del registro
     */

    public function consultarRecaudosPendiente($inicio) {
        try {
            $this->escribeLog(" consultando los recaudos para procesar \n ");
            $listaRecaudos = $this->cargarRecaudosModel->getRecaudosPorProceso($this->idEmpresa, $this->idHilo, $inicio);
            if (empty($listaRecaudos)) {
                $this->escribeLog('No hay más recaudos por procesar');
                return;
            }
            return $listaRecaudos;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }

    /**
     * Inicia el procesamiento de los recaudos y va registrando en la tabla temporal
     * @param array $listaRecaudos - Información de los recaudos a procesar
     */
    public function iniciar($listaRecaudos) {
        foreach ($listaRecaudos as $registro) {
            try {
                $this->conexion->beginTransaction();
                $this->recaudo = $registro;
                print_r(" Informacion REcaudo inicial ");
                print_r($this->recaudo);
                if ($this->recaudo['idfinanciacion']==0 && $this->recaudo['idfactura'] == 0 )
                {
                    $this->procesarConvenios();
                }
                else
                {
                    $this->procesarRecaudos();
                }
               
                $this->cargarRecaudosModel->actualizarTemporalResumen($this->recaudo['idregistro'], $this->recaudo['fechapago'], 'A', 'Se cargó correctamente el recaudo y generó un anticipo');
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $this->cargarRecaudosModel->actualizarTemporalResumen($this->recaudo['idregistro'], $this->recaudo['fechapago'], 'F', $e->getMessage());
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $this->cargarRecaudosModel->actualizarTemporalResumen($this->recaudo['idregistro'], $this->recaudo['fechapago'], 'F', $e->getMessage());
            } finally {
                $this->aumentarCantidad();
            }
        }
    }

    /**
     * Aumenta la cantidad de registros procesados en la tabla de procesos (cpr_)
     */
    private function aumentarCantidad() {
        try {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            $this->conexion->beginTransaction();
            $this->procesoModel->aumentarCantidadRegistro($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->escribeLog($e->getMessage());
            $this->conexion->rollBack();
        }
    }

    /**
     * Valida la información de la suscripción y según la prioridad de pago registra el recaudo, 
     * en caso de saldar la deuda del suscriptor y que haya dinero adicional se carga en un anticipo
     * @return void
     * @throws MyException
     */
    private function procesarConvenios() {
        $listaConvenio = $this->cargarRecaudosModel->getPrioridadPagoConvenios($this->idEmpresa, $this->recaudo['idsuscripcion']);
        if (empty($listaConvenio)) {
            throw new MyException('La suscripción no tiene convenios asociados', -1);
        }
        /*
         * Prevalidación consistencia de las facturas de las  Suscripciones relacionadas 
         */
        foreach ($listaConvenio as $validaconvenio) {
            $parametros['idsuscripcion'] = $validaconvenio['idsuscripcion'];
            $parametros['idempresa'] = $validaconvenio['idempresa'];
            $this->cargarRecaudosModel->validarConsistenciaFacturas($parametros);
        }

        $valorRecaudoAplicados = 0;
        $idSuscripcionInicial = $this->recaudo['idsuscripcion'];
        foreach ($listaConvenio as $convenio) {
            $valorRecaudo = $this->recaudo['saldo'];
            if ($valorRecaudo <= 0) {
                return;
            }
            $this->convenio = $convenio;
            $this->recaudo['idsuscripcion'] = $convenio['idsuscripcion'];
            $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($convenio['idsuscripcion']);
            $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($this->infoSuscripcion['idciclo']);
            $listaFacturas = $this->cargarRecaudosModel->getFacturasSuscripcion($convenio['idsuscripcion'], $convenio['idempresa']);
            if (empty($listaFacturas)) {
                continue;
            }
            $saldoSuscripcion = $this->cargarRecaudosModel->getSaldoSuscripcion($convenio['idsuscripcion']);
            $valorRecaudoAplicados += $saldoSuscripcion;
            $this->procesarRecaudo($saldoSuscripcion, $listaFacturas);
        }
        $valorRecaudo = $this->recaudo['saldo'];
        if ($valorRecaudo <= 0) {
            return;
        }
        $this->registrarAnticipo($idSuscripcionInicial, $valorRecaudoAplicados, $valorRecaudo);
    }

    /**
     * Valida la información de la suscripción y según la prioridad de pago registra el recaudo, 
     * en caso de saldar la deuda del suscriptor y que haya dinero adicional se carga en un anticipo
     * @return void
     * @throws MyException
     */
    private function procesarRecaudos() {
        $listaConvenio = $this->cargarRecaudosModel->getPrioridadPagoConvenios($this->idEmpresa, $this->recaudo['idsuscripcion']);
        if (empty($listaConvenio)) {
            throw new MyException('La suscripción no tiene convenios asociados', -1);
        }
        /*
         * Prevalidación consistencia de las facturas de las  Suscripciones relacionadas 
         */
        foreach ($listaConvenio as $validaconvenio) {
            $parametros['idsuscripcion'] = $validaconvenio['idsuscripcion'];
            $parametros['idempresa'] = $validaconvenio['idempresa'];
            $this->cargarRecaudosModel->validarConsistenciaFacturas($parametros);
        }

        $valorRecaudoAplicados = 0;
        $idSuscripcionInicial = $this->recaudo['idsuscripcion'];
        
        /*
        * Procesa el recaudo para las facturas o financiaicon especifica 
        */
        foreach ($listaConvenio as $convenio) {
            if ($convenio['idsuscripcion'] != $idSuscripcionInicial)
            {
                continue;
            }
            $valorRecaudo = $this->recaudo['saldo'];
            if ($valorRecaudo <= 0) {
                return;
            }
            $this->convenio = $convenio;
            $this->recaudo['idsuscripcion'] = $convenio['idsuscripcion'];
            $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($convenio['idsuscripcion']);
            $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($this->infoSuscripcion['idciclo']);
            $listaFacturas = $this->cargarRecaudosModel->getFacturaSuscripcion($convenio['idsuscripcion'], $convenio['idempresa'] , $this->recaudo['idfinanciacion'], $this->recaudo['idfactura']);
            print_r("Número de recaudos a procesar " . count($listaFacturas) . " \n\n");
            if (empty($listaFacturas)) {
                continue;
            }
            $saldoSuscripcion = $this->cargarRecaudosModel->getSaldoFacturasSuscripcion($convenio['idsuscripcion'], $this->recaudo['idfinanciacion'], $this->recaudo['idfactura']);
            $valorRecaudoAplicados += $saldoSuscripcion;
            $this->procesarRecaudo($saldoSuscripcion, $listaFacturas);
        }
        
        $valorRecaudo = $this->recaudo['saldo'];
        if ($valorRecaudo <= 0) {
            return;
        }
        
        /*
         * Procesa recaudos Normales
         */
        foreach ($listaConvenio as $convenio) {
            $valorRecaudo = $this->recaudo['saldo'];
            if ($valorRecaudo <= 0) {
                return;
            }
            $this->convenio = $convenio;
            $this->recaudo['idsuscripcion'] = $convenio['idsuscripcion'];
            $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($convenio['idsuscripcion']);
            $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($this->infoSuscripcion['idciclo']);
            $listaFacturas = $this->cargarRecaudosModel->getFacturasSuscripcion($convenio['idsuscripcion'], $convenio['idempresa']);
            if (empty($listaFacturas)) {
                continue;
            }
            $saldoSuscripcion = $this->cargarRecaudosModel->getSaldoSuscripcion($convenio['idsuscripcion']);
            $valorRecaudoAplicados += $saldoSuscripcion;
            $this->procesarRecaudo($saldoSuscripcion, $listaFacturas);
        }
        $valorRecaudo = $this->recaudo['saldo'];
        if ($valorRecaudo <= 0) {
            return;
        }
        $this->registrarAnticipo($idSuscripcionInicial, $valorRecaudoAplicados, $valorRecaudo);
    }

    /**
     * Registra un anticipo de pago soble si no se aplicó el pago a saldos de factura 
     * con el mismo recaudo o en caso contrario Anticipo por saldo
     * @param number $idSuscripcionInicial - Id de la suscripción a la que se le genera una el anticipo 
     * @param number $valorRecaudoAplicados - Valor que se ha aplicado a otros recaudos 
     * @param number $valorRecaudo - Valor que se pagará 
     * @return void
     */
    private function registrarAnticipo($idSuscripcionInicial, $valorRecaudoAplicados, $valorRecaudo) {
        print_r(" Informacion REcaudo antes de procesar PD ");
        print_r($this->recaudo);
        $this->recaudo['idsuscripcion'] = $idSuscripcionInicial;
        $this->infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcionInicial);
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($this->infoSuscripcion['idciclo']);
        $saldoSuscripcion = $this->cargarRecaudosModel->getSaldoSuscripcion($idSuscripcionInicial);
        if ($saldoSuscripcion == 0 && $valorRecaudoAplicados == 0) {
            $this->procesarAnticipoPagoDoble();
            $this->escribeLog("Se hace un anticipo de tipo PD \n");
            return;
        }
        $this->recaudo['valorpago'] = $valorRecaudo;
        $this->procesarAnticipoSaldo();
    }

    /**
     * Inicia el procesamiento de un recaudo ya sea abono o pago de las facturas según el valor del recaudo contra el saldo
     * @param number $saldoSuscripcion - Saldo dela suscripción
     * @param Array $listaFacturas - Lista de factura con saldo
     * @return type
     */
    private function procesarRecaudo($saldoSuscripcion, $listaFacturas) {
        $valorRecaudo = $this->recaudo['saldo'];
        if ($valorRecaudo < $saldoSuscripcion) {
            $this->escribeLog("Se aplicarán abonos a las facturas \n");
            //$this->recaudo['saldo'] = 0;
            $this->procesarAbono('AB', $listaFacturas);
            return;
        }
        //$this->recaudo['saldo'] = 0;
        $this->recaudo['valorpago'] = $saldoSuscripcion;
        $this->procesarAbono('PA', $listaFacturas);
    }

    /**
     * Registra un abono para las facturas de la suscripción y actualiza el saldo de las facturas
     * @param char $documentoTipo - Tipo de documento que se genera (AB - Abono, PA - Pago) 
     * @param array $listaFacturas
     */
    private function procesarAbono($documentoTipo, $listaFacturas) {
        $valorInicial = $this->recaudo['valorpago'];
        $idDocumento = $this->cargarRecaudosModel->getDocumentoRecaudo($documentoTipo);
        $this->recaudo['iddocumentorecaudo'] = $idDocumento;
        $this->insertarRecaudo('A');
        $this->insertarDistribucionRecaudo();
        foreach ($listaFacturas as $factura) {
            $resultado = $this->procesarDetalleRecaudo($factura);
            if ($resultado == 0) {
                break;
            }
            $this->insertarFacturaRecaudo($factura);
            $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $factura['version']);
        }
        $valorFinal = $this->recaudo['valorpago'];
        $this->recaudo['valorpago'] = round($valorInicial, CANTIDAD_DECIMALES) - round($valorFinal, CANTIDAD_DECIMALES);
        $this->insertarFormaPago();
        $this->recaudo['valorpago'] = $valorFinal;
        $this->genericoDelegado->actualizarRecaudoSaldo($this->recaudo['recaudo']['idrecaudo'], 1, $this->infoSuscripcion['idsuscripcion']);
    }

    /**
     * Registra anticipo por pago doble
     */
    private function procesarAnticipoPagoDoble() {
        $this->recaudo['saldo'] = $this->recaudo['valorpago'];
        $this->procesarAnticipo('PD');
    }

    /**
     * Registra anticipo por saldo
     */
    private function procesarAnticipoSaldo() {
        $this->recaudo['saldo'] = $this->recaudo['valorpago'];
        $this->procesarAnticipo('AS');
    }

    /**
     * Registra en base de datos la información detallada de un anticipo
     * @param String $tipoAnticipo - (Tipo de anticipo que se inserta AS - PD)
     */
    private function procesarAnticipo($tipoAnticipo) {
        $nuevoDocumento = $this->cargarRecaudosModel->getDocumento($this->recaudo['idtipdocumento'], $this->recaudo['iddocumento'], $tipoAnticipo);
        $this->recaudo['anticipo']['idtipodocumento'] = $this->recaudo['idtipdocumento'];
        $this->recaudo['iddocumentorecaudo'] = $nuevoDocumento['iddocumento'];
        $this->insertarRecaudo('G');
        $this->insertarDistribucionRecaudo();
        $this->insertarFormaPago();
        $this->escribeLog("se incrementa registro en cpr y se cambia el estado del recaudo procesado " . $this->recaudo['recaudo']['idrecaudo'] . " \n");
    }

    /**
     * Construye objeto de recaudo y envía para que sea registrado en base de datos
     * @param string $estado - Estado con el que se registra el recaudo
     */
    private function insertarRecaudo($estado) {

        $recaudo['fecha'] = 'now()';
        $recaudo['estado'] = $estado;
        $recaudo['valorpagado'] = $this->recaudo['valorpago'];
        $recaudo['cambio'] = 0;
        $recaudo['ajuste'] = 0;
        $recaudo['valorreal'] = $this->recaudo['valorpago'];
        $recaudo['idmediopago'] = $this->recaudo['idmediopago'];
        $recaudo['idconvenio'] = 0;
        $recaudo['idempresa'] = $this->idEmpresa;
        $recaudo['idsuscriptor'] = $this->recaudo['idsuscriptor'];
        $recaudo['idtercero'] = $this->recaudo['idtercero'];
        $recaudo['iddocumento'] = $this->recaudo['iddocumentorecaudo'];
        $recaudo['fechapago'] = $this->recaudo['fechapago'];
        $recaudo['idsucursal'] = $this->recaudo['idsucursal'];
        $recaudo['idusuario'] = $this->idUsuario;
        $recaudo['version'] = 1;
        $recaudo['fechaaplicado'] = ($estado = 'A') ? 'now()' : NULL;
        $recaudo['idunificado'] = $this->recaudo['idregistro'];
        $this->cargarRecaudosModel->insertarRecaudo($recaudo);
        $this->recaudo['recaudo'] = $recaudo;
        $this->recaudo['valorpagoreal'] = $this->recaudo['valorpago'];
    }

    /**
     * Construye objeto de distribución y en caso de ser anticipo agrega atributos adicionales
     * y se envía al modelo para la inserción en base de datos
     */
    private function insertarDistribucionRecaudo() {
        print_r("\n Inserta Distribucion :");
        print_r($this->recaudo);
        $saldoRecaudo = $this->recaudo['saldo'];
        print_r("\n Empresa Sesion : ");
        print_r($this->idEmpresa);
        print_r("\n Info suscripcion : ");
        print_r($this->infoSuscripcion);
        if ($this->idEmpresa != $this->infoSuscripcion['idempresa']) {
            $saldoRecaudo = 0;
            print_r(" La empresa en Sesion no es igual a la empresa de la suscripcion");
        }
        $distribucion['valorrecaudo'] = $this->recaudo['valorpago'];
        $distribucion['saldorecaudo'] = $saldoRecaudo;
        $distribucion['idrecaudo'] = $this->recaudo['recaudo']['idrecaudo'];
        $distribucion['iddistribucionconvenio'] = 0;
        $distribucion['idsuscripcion'] = $this->infoSuscripcion['idsuscripcion'];
        $distribucion['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $distribucion['idciclo'] = $this->cicloPeriodo['idciclo'];
        $distribucion['idempresa'] = $this->infoSuscripcion['idempresa'];
        $distribucion['cicloanio'] = $this->cicloPeriodo['cicloanio'];
        $distribucion['idusuario'] = $this->idUsuario;
        $distribucion['version'] = 1;
        if (isset($this->recaudo['anticipo'])) {
            $distribucion['iddocumento'] = isset($this->recaudo['anticipo']['iddocumento']) ? $this->recaudo['anticipo']['iddocumento'] : null;
            $distribucion['idtipodocumento'] = isset($this->recaudo['anticipo']['idtipodocumento']) ? $this->recaudo['anticipo']['idtipodocumento'] : null;
            $distribucion['idconcepto'] = isset($this->recaudo['anticipo']['idconcepto']) ? $this->recaudo['anticipo']['idconcepto'] : null;
        }

        $this->cargarRecaudosModel->insertarDistribucionRecaudo($distribucion);
        $this->recaudo['distribucion'] = $distribucion;

        print_r("\n  Distribucion Despues de Insertar :");
        print_r($this->recaudo);
    }

    /**
     * Consulta los conceptos con saldo de una factura
     * @param array $factura - Información completa de una factura
     * @return int Cantidad de conceptos que fueron pagados
     */
    private function procesarDetalleRecaudo(array &$factura) {
        $listaDetalleFactura = $this->cargarRecaudosModel->getConceptosFactura($factura['idfactura']);
        $numeroFactura = 0;
        foreach ($listaDetalleFactura as $detalleFactura) {
            $resutlado = $this->insertarDetalleRecaudo($factura, $detalleFactura);
            if ($resutlado == -1) {
                return $numeroFactura;
            }
            $numeroFactura++;
        }
        return $numeroFactura;
    }

    /**
     * Inserta la información de la factura que fue afectada por el recaudo
     * @param array $factura - Información de la factura
     */
    private function insertarFacturaRecaudo(array &$factura) {
        $facturaRecaudo['idfactura'] = $factura['idfactura'];
        $facturaRecaudo['idsuscripcion'] = $this->recaudo['idsuscripcion'];
        $facturaRecaudo['iddistribucionrecaudo'] = $this->recaudo['distribucion']['iddistribucionrecaudo'];
        $facturaRecaudo['idemprea'] = $this->recaudo['idempresa'];
        $facturaRecaudo['idusuario'] = $this->idUsuario;
        $this->cargarRecaudosModel->insertarFacturaRecaudo($facturaRecaudo);
    }

    /**
     * Inserta los conceptos que fueron afectados por el recaudo 
     * @param array $factura Información de la factura
     * @param array $detalleFactura Información del detalle de factura (concepto)
     * @return int|void -  En caso de que no se haya saldado nada se devuelve -1
     */
    private function insertarDetalleRecaudo(array &$factura, array $detalleFactura) {
        $valorRecaudo = $this->recaudo['saldo'];
        $valorConcepto = $detalleFactura['saldo'];
        if ($valorRecaudo > $valorConcepto) {
            $this->recaudo['valorpago'] = ($valorRecaudo - $valorConcepto);
        } else {
            $valorConcepto = $valorRecaudo;
            $this->recaudo['valorpago'] = 0;
        }
        if ($valorConcepto <= 0) {
            return -1;
        }
        $detalleRecaudo['idrecaudo'] = $this->recaudo['recaudo']['idrecaudo'];
        $detalleRecaudo['valortotal'] = $valorConcepto;
        $detalleRecaudo['valorreal'] = $valorConcepto;
        $detalleRecaudo['fecha'] = 'now()';
        $detalleRecaudo['idfactura'] = $factura['idfactura'];
        $detalleRecaudo['idciclo'] = $this->cicloPeriodo['idciclo'];
        $detalleRecaudo['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $detalleRecaudo['iddocumento'] = $this->recaudo['recaudo']['iddocumento'];
        $detalleRecaudo['idtipodocumento'] = $factura['idtipodocumento'];
        $detalleRecaudo['iddetallefactura'] = $detalleFactura['iddetallefactura'];
        $detalleRecaudo['iddistribucionrecaudo'] = $this->recaudo['distribucion']['iddistribucionrecaudo'];
        $detalleRecaudo['cicloanio'] = $this->cicloPeriodo['cicloanio'];
        $detalleRecaudo['idusuario'] = $this->idUsuario;
        $detalleRecaudo['version'] = 1;
        $this->cargarRecaudosModel->insertarDetalleRecaudo($detalleRecaudo);
        $this->recaudo['saldo'] = $this->recaudo['saldo'] - $valorConcepto;
    }

    /**
     * Registra la forma de pago del recaudo
     */
    private function insertarFormaPago() {
        $formaPago['idrecaudo'] = $this->recaudo['recaudo']['idrecaudo'];
        $formaPago['idformapago'] = $this->recaudo['idformapago'];
        $formaPago['valorreal'] = $this->recaudo['valorpagoreal'];
        $formaPago['idusuario'] = $this->idUsuario;
        $this->cargarRecaudosModel->insertarFormasPago($formaPago);
    }

    /**
     * Valida si se debe imprimir el log y ejecutra print_r
     * @param type $mensaje
     */
    private function escribeLog($mensaje) {
        if ($this->imprimeLog) {
            print_r($mensaje);
        }
    }

    /**
     * Termina el control de ejecución del proceso
     */
    public function inactivarControlEjecucionProceso() {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_CARGAR_RECAUDOS;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }

    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_CARGAR_RECAUDOS;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }

}
