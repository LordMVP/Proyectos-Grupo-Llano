<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\InteresMoraModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Description of ProcesoInteresMora
 *
 * @author mebonilla
 */
class ProcesoInteresMora {

    private $idEmpresa;
    private $idCiclo;
    private $idActividad;
    private $idAcceso;
    private $idUsuario;

    /**
     *
     * @var Connection
     */
    private $conexion;

    /**
     *
     * @var InteresMoraModel
     */
    private $interesMoraModel;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoModel
     */
    private $procesoModel;

    /**
     *
     * @var GenericoDelegado
     */
    private $genericoDelegado;
    private $imprimeLog;
    private $idProceso;
    private $cicloPeriodo;
    private $idHilo;
    private $facturasGeneradas;

    /**
     *
     * @var ConceptosUtil 
     */
    private $conceptoUtil;

    /**
     * Constructor de la clase
     * @param type $idEmpresa id de la empresa enviada al hilo por el controller
     * @param type $idCiclo id del ciclo a aplicar facturacion de interes por
     * mora enviado por el controller
     * @param type $idActividad id de la actividad que se va a ejecutar para el 
     * proceso enviado por el controller
     * @param type $idAcceso id del acceso que uso el usuario para ejecutar el 
     * proceso
     * @param type $idUsuario id del usuario que ejecuta el proceso
     */
    function __construct($idEmpresa, $idCiclo, $idActividad, $idAcceso, $idUsuario, $idProceso = null) {
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->idActividad = $idActividad;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
        $this->idHilo = $idProceso;
        $this->facturasGeneradas = 0;
        $this->conexion = ConexionBD::getConexion();
        $this->interesMoraModel = new InteresMoraModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->conceptoUtil = new ConceptosUtil($this->conexion);
        $this->imprimeLog = true;

        $this->cicloPeriodo = $this->interesMoraModel->getPeriodoPorCiclo($this->idCiclo);
        if (empty($this->cicloPeriodo)) {
            throw new MyException("Error el ciclo no tiene un período activo \n", -1);
        }
    }

    public function cargarFacturasInteresMora() {
        $this->vaciarTablaResumen();

        $parametros["idciclo"] = $this->idCiclo;
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        $parametros["numeroprocesos"] = NUMERO_HILOS_INTERES_MORA;
        $parametros['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $this->interesMoraModel->cargarFacturasInteresMora($parametros);
    }

    public function cantidadFacturas() {
        $parametros["idciclo"] = $this->idCiclo;
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        return $this->interesMoraModel->consultarCantidadFacturas($parametros);
    }

    /**
     * Realiza el proceso de registro de facturas de interes por mora para una
     * suscripcion ó suscripciones de un ciclo
     * @param string $accion accion de la ejecucion del proceso "s" para 
     * suscripcion ó "c" para las suscripciones de un ciclo
     * @param array $parametros informacion de la suscripcion o suscripciones
     * de un ciclo
     * @return array conjunto de ids de la factura generada
     */
    public function generarInteresMora() {
        try {
            $this->escribeLog(" consultando las facturas y documentos de interés por mora \n ");
            $listaFacturas = $this->interesMoraModel->consultarFacturasPorProceso($this->idEmpresa, $this->idHilo);
            if (empty($listaFacturas)) {
                print_r("No hay más facturas para procesar");
                $this->cerrarActividad($this->idActividad);
                return;
            }
            // cantidad de facturas a procesar
            $this->escribeLog("Cantidad de facturas a procesar: " . count($listaFacturas) . " \n \n \n");
            $this->procesarFacturas($listaFacturas);
        } catch (\Exception$exc) {
            $this->escribeLog($exc->getMessage());
        } finally {
            $this->cerrarActividad($this->idActividad);
        }
        $this->generarInteresMora();
    }

    private function procesarFacturas($facturas) {
        foreach ($facturas as $factura) {
            $this->conexion->beginTransaction();
            try {
                if (!isset($factura['iddocumentomora'])) {
                    throw new MyException("La suscripción no tiene parametrizado el documento y tipo documento para generar interés mora " . $factura["idsuscripcion"] . "\n  ", -1);
                }
                $this->escribeLog($factura);
                $this->escribeLog("se consultan los conceptos que están relacionados a un concepto de interés por mora, el concepto de interés por mora y la respectiva liquidación \n");
                $conceptosRelacionados = $this->interesMoraModel->consultarConceptosInteresMora($factura["iddocumentomora"], $factura["idtipdocumento"], $this->idEmpresa);

             //   $this->escribeLog("Se separan por coma los id conceptos relacionados, id liquidaciones y id conceptos de interés por mora (si hay más de uno) en el string correspondiente \n");
             //   $objetoConCadenasDeId = $this->extraerCadenasDeIds($conceptosRelacionados);
                foreach($conceptosRelacionados as $conceptoBase){
    
                    $this->registrarFacturayDetalle($factura, $conceptoBase);
                }
                
            } catch (\Exception $exc) {
                $this->escribeLog($exc->getMessage());
                $this->conexion->rollBack();
                //$this->conexion->beginTransaction();
                $this->registrarResumen('N', $factura, $exc->getMessage());
            } finally {
                if ($this->conexion->isTransactionActive()) {
                    $this->conexion->commit();
                }
            }
        }
    }

    private function extraerCadenasDeIds($conceptosRelacionados) {
        $cadenas = array();
        $cadenas['conceptosRelacionados'] = $this->interesMoraModel->extraerConceptosBaseInteresMora($conceptosRelacionados);
        $cadenas['idLiquidacionMora'] = $this->interesMoraModel->extraerLiquidacionMora($conceptosRelacionados);
        $cadenas['idConceptoMora'] = $this->interesMoraModel->extraerConceptoInteresMora($conceptosRelacionados);
        return $cadenas;
    }

    private function registrarFacturayDetalle($factura, $objetoConCadenasDeId) {
        $idConceptoMora = $objetoConCadenasDeId['idconceptomora'];
        $idLiquidacionMora = $objetoConCadenasDeId['idliquidacionmora'];
        $conceptosRelacionados = $objetoConCadenasDeId['conceptosrelacionados'];


        $this->escribeLog("Se consulta toda la información sobre la factura sobre la que se generará interés por mora \n");
        $infoFactura = $this->interesMoraModel->consultarInfoAdicionalFactura($factura["idfactura"]);


        $this->escribeLog(" ======= se empieza el cálculo del valor de la nueva factura ========= \n");
        $documentoMora = $factura["iddocumentomora"];
        $valorPorcentual = $this->obtenerValorFinalInteresMora($idConceptoMora, $idLiquidacionMora);

        $this->escribeLog("Se calcula el valor fac y dfac ( saldo * porcentaje del concepto IM) \n");
        $valorResultadoEncabezado = $this->interesMoraModel->obtenerValorResultadoInteresMora($factura["idfactura"], $conceptosRelacionados, $valorPorcentual["valorencabezado"]);
        $valorResultadoDetalle = $this->interesMoraModel->obtenerValorResultadoInteresMora($factura["idfactura"], $conceptosRelacionados, $valorPorcentual["valordetalle"]);
        $valorResultadoDetalle = $this->conceptoUtil->redondearValor($idConceptoMora, $valorResultadoDetalle);
        $this->escribeLog("Se consulta el número de la factura nudo y guarda la nueva factura en fac \n");
        /*
          Se agrega control para evitar que existan facturas con saldo 0
         */
        if ($valorResultadoDetalle <= 0) {
            $this->escribeLog("El encabezado a generar no tiene valor");
            $this->registrarResumen('NS', $factura, 0);
            return;
        }
        //Sólo se comprobará que exista la parametrización y cuando aprueben las facturas se le asignará el número correspondiente
        //$numeroFactura = $this->consultarNumeroFactura($infoFactura["idempresa"], $factura["iddocumento"], $factura["idtipdocumento"]);
        $dataEncabezado = $this->generarInfoFacturaInteresMora($factura["idfactura"], $infoFactura, $idLiquidacionMora, $documentoMora, $valorResultadoEncabezado);
        $idFacturaInteresMora = $this->interesMoraModel->insertarEncabezadoInteresMoraProceso($dataEncabezado, $this->idEmpresa, $this->idUsuario);
        //$this->actualizarNumeroFactura($numeroFactura["numero"], $numeroFactura["idnumero"]);

        $this->escribeLog("Se guarda el nuevo detalle de la factura en dfac con el concepto de interés por mora, valor $valorResultadoDetalle \n");
        $dataDetalle = $this->generarInfoDetalleInteresMora($idFacturaInteresMora, $valorResultadoDetalle, $idConceptoMora);
        $dataDetalle['idempresa'] = $this->idEmpresa;
        $this->interesMoraModel->insertarDetalleInteresMoraProceso($dataDetalle, $this->idUsuario);
        $this->interesMoraModel->insertarHistoricoInteres($idFacturaInteresMora, $idConceptoMora, $valorPorcentual['tasainteres'], $this->idUsuario);

        $conceptoIva = $this->interesMoraModel->consultarConceptoIvaInteresMora($idConceptoMora);
        if (!empty($conceptoIva)) {
            $this->escribeLog("La factura se aplicará iva, se calcula el valor del dfac del concepto de iva \n");
            $valorResultadoIva = $this->interesMoraModel->obtenerValorResultadoInteresMora($factura["idfactura"], $conceptosRelacionados, $valorPorcentual["valoriva"]);

            $this->escribeLog("se guarda un nuevo detalle de factura de iva de interes por mora segun los valores relacion al interes");
            $dataDetalle = $this->generarInfoDetalleInteresMora($idFacturaInteresMora, $valorResultadoIva, $conceptoIva["idconcepto"]);
            $dataDetalle['idempresa'] = $this->idEmpresa;
            $this->interesMoraModel->insertarDetalleInteresMora($dataDetalle, $this->idUsuario);
        }
        $idFacturasGeneradas[] = $idFacturaInteresMora;
        $this->escribeLog("Actualizando los saldos de las facturas \n");
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaInteresMora, $dataEncabezado["facversion"]);
        $this->facturasGeneradas++;
        $this->registrarResumen('G', $factura, $idFacturaInteresMora);
    }

    private function registrarResumen($tipo, $factura, $idFacturaIM) {

        switch ($tipo) {
            case 'G':
                $mensaje = MENSAJE_FACTURA_CREADA;
                break;
            case 'N':
                $mensaje = MENSAJE_FACTURA_NO_CREADA;
                if (strlen($idFacturaIM) <= 118) {
                    $mensaje .= ' ' . $idFacturaIM;
                }
                $idFacturaIM = null;
                break;
            case 'NS':
                $mensaje = MENSAJE_FACTURA_NO_CREADA_POR_VALOR;
                $idFacturaIM = null;
                break;
        }
        $this->escribeLog("se incrementa registro en cpr y se agrega al resumen al generar la factura  " . $idFacturaIM . " \n");
        $this->procesoModel->aumentarCantidadRegistro($this->idProceso);
        $idMunicipio = $this->interesMoraModel->consultarMunicipioFacturaOriginal($factura["idfactura"]);
        $this->interesMoraModel->insertarResumenProcesoInteresMora($idMunicipio['idmunicipio'], $factura["idfactura"], $idFacturaIM, $mensaje, $tipo);
    }

    /**
     * Consulta, calcula y genera los valores utilizados para computar los 
     * resultados de pago de la factura de interes por mora segun un concepto
     * de interes por mora
     * @param int $idConcepto id del concepto de  interes por mora
     * @param int $idLiquidacionMora id de liquidacion
     * @return array valores reales de el encabezado de la factura, detalle de
     * factura y detalle de factura de interes por mora si existe
     */
    private function obtenerValorFinalInteresMora($idConcepto, $idLiquidacionMora) {

        $valorIvaMora = 0.0;
        $valorPorcentual = array();
        $valorInfoConcepto = $this->interesMoraModel->consultarValorConceptoInteresMora($idConcepto);
        //$valorInfoConcepto = $this->interesMoraModel->extraerValorConcepto($infoConcepto["formula"]);
        $conceptosMoraRelacionados = $this->interesMoraModel->consultarConceptoRelacionadoInteresMora($idConcepto);
        $this->escribeLog(" Se obtiene el valor porcentual del concepto de interés por mora $valorInfoConcepto \n");
        $valorFinal = $valorInfoConcepto;

        if (empty($conceptosMoraRelacionados)) {
            $valorPorcentual['tasainteres'] = $valorFinal;
            $valorPorcentual["valorencabezado"] = ($valorFinal / 100);
            $valorPorcentual["valordetalle"] = ($valorFinal / 100);
            return $valorPorcentual;
        }

        foreach ($conceptosMoraRelacionados as $concepto) {
            $this->escribeLog("El concepto tiene conceptos relacionados (se calculará valor iva) \n");
            $valConcepto = $this->interesMoraModel->extraerValorConcepto($concepto["formula"]);
            $valorIvaMora += $valorFinal * ($valConcepto / 100);
        }
        $valorPorcentual['tasainteres'] = $valorFinal;
        $valorPorcentual["valorencabezado"] = (($valorFinal + $valorIvaMora) / 100);
        $valorPorcentual["valordetalle"] = ($valorFinal / 100);
        $valorPorcentual["valoriva"] = $valorIvaMora;
        return $valorPorcentual;
    }

    /**
     * 
     * @param type $accion accion de la ejecucion del proceso "s" para 
     * suscripcion ó "c" para las suscripciones de un ciclo
     * @param type $idFacturaOrigen id de la factura original a la que se le
     * genera el interes por mora
     * @param type $infoFactura informacion que va a ser cargada en la nueva
     * factura
     * @param type $cicloPeriodo ciclo y periodo activo de la suscripcion de la
     * suscripcion
     * @param type $idLiquidacionMora id de liquidacion por mora
     * @param type $documentoMora id del documento de interes por mora
     * @param type $valorResultado valor de resultado del encabezado de factura
     * @param type $numeroFactura numero de la factura a generar
     * @return array informacion de la factura
     */
    private function generarInfoFacturaInteresMora($idFacturaOrigen, $infoFactura, $idLiquidacionMora, $documentoMora, $valorResultado) {
        $this->escribeLog("Se construye objeto para guardar la nueva factura \n");
        $parametros["facideorigen"] = $idFacturaOrigen;
        $parametros["susideregistro"] = $infoFactura["susideregistro"];
        $parametros["dsusideregistr"] = $infoFactura["dsusideregistr"];
        $parametros["unitipsuscripc"] = $infoFactura["unitipsuscripc"];
        $parametros["unitipusosuscr"] = $infoFactura["unitipusosuscr"];
        $parametros["idliquidacionmora"] = $idLiquidacionMora;
        $parametros["terideregistro"] = $infoFactura["terideregistro"];

        $parametros["idciclo"] = $this->cicloPeriodo["idciclo"];
        $parametros["idperiodo"] = $this->cicloPeriodo["idperiodo"];

        $parametros["iddocumentomora"] = $documentoMora;
        $parametros["unitipdocument"] = $infoFactura["unitipdocument"];
        $parametros["cicloanio"] = $this->cicloPeriodo["cicloanio"];
        $parametros["hliqideregistr"] = $infoFactura["hliqideregistr"];
        $parametros["unitiptercero"] = $infoFactura["unitiptercero"];
        $parametros["valorresultado"] = $valorResultado;
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFactura["dsusideregistr"]);
        $fecha = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $this->cicloPeriodo);
        $parametros["fechavencimiento"] = $fecha['fechavencimiento'];
        $parametros["fechasuspension"] = $fecha['fechasuspension'];
        $parametros["facversion"] = 1;
        return $parametros;
    }

    /**
     * Registra un detalle de factura para conceptos de interes por mora e iva
     * de interes por mora
     * @param int $idFacturaInteresMora id de la factura de interes por mora
     * @param int $valorResultado valor del resultado del detalle de la factura
     * @param int $idConceptoMora id del concepto de interes por mora
     * @return type
     */
    private function generarInfoDetalleInteresMora($idFacturaInteresMora, $valorResultado, $idConceptoMora) {
        $parametros["valorresultado"] = $valorResultado;
        $parametros["idfactura"] = $idFacturaInteresMora;
        $parametros["conceptomora"] = $idConceptoMora;
        return $parametros;
    }

    /**
     * consulta el numero de factura para una nueva factura
     * @param int $idEmpresa id de la empresa de la suscripcion
     * @param int $idDocumento id del documento de la liquidacion de la suscripcion
     * @param int $idTipoDocumento id del tipo de documento de la liquidacion
     * @return array informacion del numero de factura generado
     * @throws MyException
     */
    private function consultarNumeroFactura($idEmpresa, $idDocumento, $idTipoDocumento) {
        $infoFactura["idempresa"] = $idEmpresa;
        $infoFactura["iddocumento"] = $idDocumento;
        $infoFactura["idtipodocumento"] = $idTipoDocumento;
        $numeroFactura = $this->interesMoraModel->obtenerNumeroFactura($infoFactura);
        $numeroFactura = $this->genericoModel->obtenerNumeroFactura($infoFactura);
        if (empty($numeroFactura)) {
            throw new MyException("Error, numero de factura no encontrado", -1);
        }
        return $numeroFactura;
    }

    /**
     * Actualiza el valor del numero disponible de la factura
     * @param int $numero numero de la factura registrada
     * @param int $idNumero id del registro de numero de factura
     */
    private function actualizarNumeroFactura($numero, $idNumero) {
        $this->genericoModel->actualizarNumeroDisponible($numero, $idNumero);
    }

    /**
     * Cierra la ejecucion del programa para el ciclo ejecutado
     * @param int $idActividad id de la actividad registrada en dper_detperiodo
     * @return int numero de filas afectadas despues de la actualización
     */
    public function cerrarActividad($idActividad) {
        $this->conexion->beginTransaction();
        try {
            $actividad["idactividad"] = $idActividad;
            $resultado = $this->genericoModel->actualizarActividad($actividad, "C");
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            $this->escribeLog($exc->getTraceAsString());
        }
    }

    /**
     * Se registró el procesó.
     */

    /**
     * Realiza la insersion de un proceso activo en la tabla cpr_ctrproceso
     * bloqueando cualquier intento de una nueva ejecucion del programa mientras
     * se esta ejecutando
     * @param string $accion
     * @return int id del proceso
     */
    public function registrarProceso() {
        $this->conexion->beginTransaction();
        try {
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_FACTURAR_INTERESES_MORA;
            $proceso['idAcceso'] = $this->idAcceso;
            $proceso['idEmpresa'] = $this->idEmpresa;
            $proceso['idHilo'] = 1;
            $this->idProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Bloquea el proceso.
     */

    /**
     * Cierra la ejecucion del proceso dejando al programa habilitado para una
     * nueva ejecución
     * @param int $idControlProceso
     */
    public function finalizarProceso() {
        $this->conexion->beginTransaction();
        try {
            if ($this->facturasGeneradas == 0) {
                $this->interesMoraModel->insertarResumenSinResultados(MENSAJE_SIN_FACTURAS);
            }

            $this->procesoModel->finalizarProceso($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /*
     * Realiza la actualizacion en base de datos que representa la aprobacion
     * de las facturas de interes por mora
     */

    public function lanzarAprobarLiquidacionInteresMora() {
        $this->conexion->beginTransaction();
        try {
            $resultado = $this->interesMoraModel->aprobarLiquidacionInteresMora();
            $this->conexion->commit();
            return count($resultado);
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function vaciarTablaResumen() {
        $this->conexion->beginTransaction();
        try {
            $tablaExiste = $this->interesMoraModel->validarExisteTablaProceso();

            if ($tablaExiste > 0) {
                $this->interesMoraModel->vaciarTablaResumen($this->idEmpresa);
            } else {
                $this->interesMoraModel->crearTablaResumenInteresMora();
            }
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function escribeLog($objMensaje) {
        if ($this->imprimeLog) {
            print_r($objMensaje);
        }
    }

}
