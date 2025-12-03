<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\InteresMoraModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of InteresMoraDelegado
 *
 * @author mebonilla
 */
class InteresMoraDelegado {

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
     * @var InteresMoraModel
     */
    private $interesMoraModel;

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
    private $cicloPeriodo;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->interesMoraModel = new InteresMoraModel($this->conexion, $sesion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta en la base de datos por coincidencia de caracteres los municipios
     * que se encuentran asignados al programa de interes por mora
     * @param string $municipio
     * @return array informacion de los municipios
     * @throws MyException
     */
    public function obtenerMunicipios($municipio) {
        $municipios = $this->interesMoraModel->consultarMunicipios($municipio);
        if (empty($municipios)) {
            throw new MyException("Error, No se encontraron municipios", 0);
        }
        return $municipios;
    }

    /**
     * Permite filtrar suscripciones 
     * @param int $idMunicipio id del municipio
     * @param int $idsuscripcion id de la suscripcion
     * @param int $codigoAnterior id del codigo anterior
     */
    public function filtrarSuscripciones($idMunicipio, $idsuscripcion, $codigoAnterior) {
        $parametros["idmunicipio"] = $idMunicipio;
        $parametros["idsuscripcion"] = $idsuscripcion;
        $parametros["codigoanterior"] = $codigoAnterior;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron resultados para la suscripción", 0);
        }
        return $suscripcion;
    }

    /**
     * Consulta si existen documentos de interes por mora para una respectiva
     * suscripcion ó las suscripciones de un respectivo ciclo
     * @param string $accion accion de la ejecucion del proceso "s" para 
     * suscripcion ó "c" para las suscripciones de un ciclo
     * @param array $parametros
     * @return array
     * @throws MyException
     */
    public function consultarDocumentosInteresMora($accion, $parametros) {
        $documentos = $this->interesMoraModel->consultarDocumentosPreview($accion, $parametros);
        $accion = strtoupper($accion);
        if (empty($documentos)) {
            switch ($accion) {
                case "S":
                    throw new MyException("No se encontró documento de interés por mora para la suscripción", 0);
                case "C":
                    throw new MyException("No se encontraron documentos de interés por mora para las suscripciones del ciclo seleccionado", 0);
            }
        }
        // convertir documentos y tipos de documentos en strings separados por coma
        $documentosTiposDocumentos = $this->implotarDocumentos($documentos);
        // consultar liquidaciones de los documentos de interes por mora y tipos de documento
        $liquidaciones = $this->interesMoraModel->consultarLiquidacionPorDocumentoMoraPreview($documentosTiposDocumentos["docs"], $documentosTiposDocumentos["tips"]);
        // convertir liquidaciones en strings separados por coma
        $idsLiquidaciones = $this->implotarLiquidaciones($liquidaciones);
        $conceptos = $this->interesMoraModel->consultarConceptosPorLiquidacionPreview($idsLiquidaciones);
        // convertir conceptos en strings separados por coma
        $idsConceptos = $this->implotarConceptos($conceptos);
        // consultar conceptos que no hacen base para interes por mora
        $conceptosNoBase = $this->interesMoraModel->consultarConceptosNoBasePreview($idsConceptos, $accion, $parametros);
        $datos["documentos"] = $documentos;
        $datos["conceptosnobase"] = $conceptosNoBase;
        return $datos;
    }

    private function implotarDocumentos($documentos) {
        $docsInteres = array();
        $tipsDocumentos = array();
        foreach ($documentos as $documento) {
            if (!empty($documento["iddocumentomora"])) {
                $docsInteres[] = $documento["iddocumentomora"];
            }
            if (!empty($documento["idtipdocumento"])) {
                $tipsDocumentos[] = $documento["idtipdocumento"];
            }
        }
        $resultado["docs"] = implode(",", $docsInteres);
        $resultado["tips"] = implode(",", $tipsDocumentos);
        return $resultado;
    }

    private function implotarLiquidaciones($liquidaciones) {
        $liquid = array();
        foreach ($liquidaciones as $liquidacion) {
            $liquid[] = $liquidacion["ideliquidacion"];
        }
        return implode(",", $liquid);
    }

    private function implotarConceptos($conceptos) {
        $concep = array();
        foreach ($conceptos as $concepto) {
            $concep[] = $concepto["idconcepto"];
        }
        return implode(",", $concep);
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
    public function generarInteresMora($parametros) {
        try {
            $diasVencimiento = null;
            $idFacturasGeneradas = 0;
            $this->conexion->beginTransaction();
            $idempresa = $this->sesion->get("idempresa");
            // se consultan las facturas que tienen documentos de interes por mora
            $facturas = $this->interesMoraModel->consultarDocumentosInteresMora($parametros);
            if (empty($facturas)) {
                throw new MyException("No se encontraron facturas para aplicar interés por mora", 0);
            }
            $this->cicloPeriodo = $this->interesMoraModel->getCicloPeriodo($facturas[0]["idsuscripcion"]);
            if (empty($this->cicloPeriodo)) {
                throw new MyException("La suscripción no tiene un ciclo período activo", -1);
            }

            foreach ($facturas as $factura) {
                $validacion = $this->validarInformacionParaGenerarInteres($factura);
                if (!$validacion) {
                    continue;
                }
                if (isset($validacion['diasvencimiento'])) {
                    $diasVencimiento = $validacion['diasvencimiento'];
                }
                $documentoMora = $factura["iddocumentomora"];
                $conceptosRelacionados = $this->interesMoraModel->consultarConceptosInteresMora($documentoMora, $factura["idtipdocumento"], $idempresa);
                foreach($conceptosRelacionados as $conceptoBase){
                    $idFacturasGeneradas = $this->registrarFacturasyDetalles($factura, $documentoMora, $conceptoBase, $diasVencimiento);
                }
//                $objetoCadenaDeIds = $this->extraerCadenasDeIds($conceptosRelacionados);
            }
            $this->conexion->commit();
            return $idFacturasGeneradas;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
    }

    private function validarInformacionParaGenerarInteres($factura) {
        if (empty($factura)) {
            throw new MyException("No se encontraron facturas para aplicar interés por mora", 0);
        }
        $documentoMora = $factura["iddocumentomora"];
        if (!isset($documentoMora)) {
            //throw new MyException("No se encuentra parametrizado el documento para generar interés por mora", -1);
            return false;
        }
        $dataFactura = $this->obtenerUltimaFacturaInteresMora($factura["idfacturaoriginal"]);
        if (empty($dataFactura)) {
            $resultadoFacturas = true;
        } else {
            $diasVencimiento = intval($dataFactura["dias"]);
            $resultadoFacturas = ($diasVencimiento > 0 ? true : false);
        }
        if (!$resultadoFacturas) {
            return false;
            //throw new MyException("La suscripción ya tiene una factura de interés por mora de hoy", 0);
        }
        if (!empty($diasVencimiento)) {
            return array('diasvencimiento' => $diasVencimiento);
        }
        return true;
    }

    private function extraerCadenasDeIds($conceptosRelacionados) {
        $cadenas = array();
        $cadenas['conceptosRelacionados'] = $this->interesMoraModel->extraerConceptosBaseInteresMora($conceptosRelacionados);
        $cadenas['idLiquidacionMora'] = $this->interesMoraModel->extraerLiquidacionMora($conceptosRelacionados);
        $cadenas['idConceptoMora'] = $this->interesMoraModel->extraerConceptoInteresMora($conceptosRelacionados);
        return $cadenas;
    }

    private function registrarFacturasyDetalles($factura, $documentoMora, $objetoConCadenasDeId, $diasVencimiento = null) {
        $idFactura = $factura["idfacturaoriginal"];
        $idConceptoMora = $objetoConCadenasDeId['idconceptomora'];
        $idLiquidacionMora = $objetoConCadenasDeId['idliquidacionmora'];
        $conceptosRelacionados = $objetoConCadenasDeId['conceptosrelacionados'];

        $infoFactura = $this->interesMoraModel->consultarInfoAdicionalFactura($idFactura);
        $factura['idempresa'] = $infoFactura['idempresa'];
        if (empty($diasVencimiento)) {
            $diasVencimiento = $infoFactura['diasvencimiento'];
        }
        $valorPorcentual = $this->obtenerValorFinalInteresMora($idConceptoMora, $diasVencimiento);

        if (floatval($valorPorcentual["valorencabezado"]) <= 0) {
            return false;
        }
        //Se empieza a registrar la factura de interés por mora fac_factura
        $valorResultadoEncabezado = $this->interesMoraModel->obtenerValorResultadoInteresMora($idFactura, $conceptosRelacionados, $valorPorcentual["valorencabezado"]);
        $dataEncabezado = $this->generarInfoFacturaInteresMora($idFactura, $infoFactura, $idLiquidacionMora, $documentoMora, $valorResultadoEncabezado);
        $idFacturaInteresMora = $this->interesMoraModel->insertarEncabezadoInteresMora($dataEncabezado);

        //Se empieza a registrar el detalle factura de interés por mora dfac_detfactura
        $valorResultadoDetalle = $this->interesMoraModel->obtenerValorResultadoInteresMora($idFactura, $conceptosRelacionados, $valorPorcentual["valordetalle"]);
        $dataDetalle = $this->generarInfoDetalleInteresMora($idFacturaInteresMora, $valorResultadoDetalle, $idConceptoMora);

        $this->interesMoraModel->insertarHistoricoInteres($idFacturaInteresMora, $idConceptoMora, $valorPorcentual['tasainteres'], $this->sesion->get('idusuario'));
        //Se empieza a registrar el detalle factura de iva interés dfac_detfactura
        $conceptoIva = $this->interesMoraModel->consultarConceptoIvaInteresMora($idConceptoMora);
        if (!empty($conceptoIva)) {
            $conceptosMoraRelacionados = $this->interesMoraModel->consultarConceptoRelacionadoInteresMora($idConceptoMora);
            foreach ($conceptosMoraRelacionados as $concepto) {
                $valConcepto = $this->interesMoraModel->extraerValorConcepto($concepto["formula"]);
                $valorResultadoIva = $valorResultadoDetalle * $valConcepto;
                $dataDetalle = $this->generarInfoDetalleInteresMora($idFacturaInteresMora, $valorResultadoIva, $conceptoIva["idconcepto"]);
            }
        }

        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaInteresMora, $dataEncabezado["fac_version"]);
        return $idFacturaInteresMora;
    }

    /**
     * Consulta, calcula y genera los valores utilizados para computar los 
     * resultados de pago de la factura de interes por mora segun un concepto
     * de interes por mora
     * @param string $accion accion si se ejecuto por ciclo o suscripcion
     * @param int $idConcepto id del concepto de  interes por mora
     * @param int $idLiquidacionMora id de liquidacion
     * @return array valores reales de el encabezado de la factura, detalle de
     * factura y detalle de factura de interes por mora si existe
     */
    private function obtenerValorFinalInteresMora($idConcepto, $diasVencimiento) {
        $valorInfoConcepto = $this->interesMoraModel->consultarValorConceptoInteresMora($idConcepto);
        $conceptosMoraRelacionados = $this->interesMoraModel->consultarConceptoRelacionadoInteresMora($idConcepto);

        $valorPorcentual = array();
        $valorFinal = $valorInfoConcepto;
        if (empty($conceptosMoraRelacionados)) {
            $valorPorcentual["tasainteres"] = $valorFinal;
            $valorPorcentual["valorencabezado"] = (($valorFinal / 100) / 30) * $diasVencimiento;
            $valorPorcentual["valordetalle"] = (($valorFinal / 100) / 30) * $diasVencimiento;
            return $valorPorcentual;
        }

        $valorIva = 0.0;
        foreach ($conceptosMoraRelacionados as $concepto) {
            $valConcepto = $this->interesMoraModel->extraerValorConcepto($concepto["formula"]);
            $valorIva += $valorFinal * ($valConcepto / 100);
        }
        $valorPorcentual["valorencabezado"] = ((($valorFinal + $valorIva ) / 100) / 30) * $diasVencimiento;
        $valorPorcentual["valordetalle"] = (($valorFinal / 100) / 30) * $diasVencimiento;
        $valorPorcentual["tasainteres"] = $valorFinal;
        $valorPorcentual["valoriva"] = $valorIva;
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
        $fechaVence = "";
        $diasAdicion = 0.0;
        $parametros["fac_ideorigen"] = $idFacturaOrigen;
        $parametros["sus_ideregistro"] = $infoFactura["susideregistro"];
        $parametros["dsus_ideregistr"] = $infoFactura["dsusideregistr"];
        $parametros["uni_tipsuscripc"] = $infoFactura["unitipsuscripc"];
        $parametros["uni_tipusosuscr"] = $infoFactura["unitipusosuscr"];
        $parametros["uni_liquidacion"] = $idLiquidacionMora;
        $parametros["ter_ideregistro"] = $infoFactura["terideregistro"];

        $parametros["cic_ideregistro"] = $this->cicloPeriodo["idciclo"];
        $parametros["per_ideregistro"] = $this->cicloPeriodo["idperiodo"];

        $parametros["uni_documento"] = $documentoMora;
        $parametros["uni_tipdocument"] = $infoFactura["unitipdocument"];
        $parametros["cic_ano"] = $this->cicloPeriodo["cicloanio"];
        $parametros["hliq_ideregistr"] = $infoFactura["hliqideregistr"];
        $parametros["uni_tiptercero"] = $infoFactura["unitiptercero"];
        $parametros["fac_vlrreal"] = $valorResultado;
        //$parametros["fac_numero"] = $numeroFactura;
        $parametros["fac_version"] = 1;
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFactura["dsusideregistr"]);
        $fecha = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $this->cicloPeriodo);
        $parametros["fac_fecvence"] = $fecha['fechavencimiento'];
        $parametros["fac_fecsuspens"] = $fecha['fechasuspension'];
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
        $parametros["idempresa"] = $this->sesion->get("idempresa");
        $this->interesMoraModel->insertarDetalleInteresMora($parametros, $this->sesion->get("idusuario"));
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
    private function consultarNumeroFactura($infoFactura) {
        $infoFactura['idtipodocumento'] = $infoFactura['idtipdocumento'];
        $infoFactura['tipo'] = "FA";
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
            print_r($exc->getTraceAsString());
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
    public function registrarProceso($accion) {
        $idControl = NULL;
        if ($accion == "C" || $accion == "c") {
            try {
                $this->conexion->beginTransaction();
                $proceso['estado'] = 'A';
                $proceso['fechaInicio'] = 'now()';
                $proceso['idPrograma'] = PROGRAMA_FACTURAR_INTERESES_MORA;
                $proceso['idAcceso'] = $this->sesion->get("idacceso");
                $proceso['idEmpresa'] = $this->sesion->get("idempresa");
                $proceso['idHilo'] = 1;
                $idControl = $this->procesoModel->insertarProceso($proceso);
                $this->conexion->commit();
            } catch (\Exception $exc) {
                print_r($exc->getTraceAsString());
                $this->conexion->rollBack();
            }
        }
        return $idControl;
    }

    /**
     * Bloquea el proceso.
     */

    /**
     * Cierra la ejecucion del proceso dejando al programa habilitado para una
     * nueva ejecución
     * @param int $idControlProceso
     */
    public function finalizarProceso($idControlProceso) {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /*
     * Realiza la actualizacion en base de datos que representa la aprobacion
     * de las facturas de interes por mora
     */

    public function lanzarAprobarLiquidacionInteresMora() {
        $facturas = $this->interesMoraModel->consultarFacturasSinNumero($this->sesion->get('idempresa'));
        $i = 0;
        foreach ($facturas as $factura) {
            try {
                $this->conexion->beginTransaction();
                $factura['tipo'] = 'FA';
                $this->genericoDelegado->actualizarNumeroFactura($factura);
                $this->interesMoraModel->aprobarLiquidacionInteresMora($factura['idfactura']);
                $this->conexion->commit();
                $i++;
            } catch (\Exception $exc) {
                //print_r($exc->getTraceAsString());
                print_r($exc->getMessage());

                $this->conexion->rollBack();
            }
        }
        $this->interesMoraModel->vaciarTablaResumen($this->sesion->get('idempresa'));
        return $i;
    }

    private function obtenerUltimaFacturaInteresMora($idFactura) {
        $factura = $this->interesMoraModel->consultarUltimaFacturaInteresMora($idFactura);
        if (!empty($factura)) {
            return $factura;
        }
        return NULL;
    }

    /**
     * Cuenta las facturas de interés por mora que no se han aprobado
     * @return int
     */
    public function obtenerFacturasSinAprobar($idEmpresa) {
        $factura = $this->interesMoraModel->consultarFacturasSinAprobar($idEmpresa);
        if (!empty($factura)) {
            return $factura;
        }
        return 0;
    }

}
