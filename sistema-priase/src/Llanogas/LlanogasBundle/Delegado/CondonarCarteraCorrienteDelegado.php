<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\CondonarCarteraCorrienteModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\GenerarFinanciacionModel;
use Llanogas\LlanogasBundle\Models\ImportarFacturasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of CondonarCarteraCorrienteDelegado
 *
 * @author mebonilla
 */
class CondonarCarteraCorrienteDelegado {

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
     * @var ImportarFacturasModel 
     */
    private $importarFacturasModel;

    /**
     *
     * @var CondonarCarteraCorrienteModel
     */
    private $condonarCarteraModel;

    /**
     *
     * @var FinanciacionModel
     */
    private $financiacionModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->condonarCarteraModel = new CondonarCarteraCorrienteModel($this->conexion, $sesion);
        $this->importarFacturasModel = new ImportarFacturasModel($this->conexion, $sesion);
        $this->financiacionModel = new GenerarFinanciacionModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Obtiene la lista de municipios permitidos al usuario en el programa
     * ejecutado
     * @param string $municipio texto del municipio
     * @return array arreglo de municipios
     * @throws MyException
     */
    public function obtenerMunicipios($municipio) {
        $municipios = $this->condonarCarteraModel->consultarMunicipios($municipio);
        if (empty($municipios)) {
            throw new MyException("Error, No se encontraron municipios", 0);
        }
        return $municipios;
    }

    /**
     * Permite filtrar suscripciones 
     * @param int $idMunicipio id del municipio de la suscripcion
     * @param int $idsuscripcion id de la suscripcion
     * @param int $codigoAnterior codigo anterior de la suscripcion
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
	$segmentos = $this->financiacionModel->consultarSegmentosModel($idsuscripcion);
        if (empty($segmentos)) {
            throw new MyException("No se encontraron segmentos disponibles para la suscripci�n.", 0);
        }
        $suscripcion[0]["segmentos"] = $segmentos;
        return $suscripcion;
    }

    /**
     * consulta la informacion de las facturas de la suscripcion 
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de las facturas con conceptos condonables y no
     * condonables
     * @throws MyException
     */
    public function obtenerFacturasCarteraCorriente($idSuscripcion, $idsegmento) {
        $facturas = $this->condonarCarteraModel->consultarFacturasCarteraCorriente($idSuscripcion, $idsegmento);
        if (empty($facturas)) {
            throw new MyException("Error, no se encontraron facturas", 0);
        }
        for ($i = 0; $i < count($facturas); $i++) {
            $facturas[$i]["conceptoscondonables"] = $this->obtenerConceptosCondonables($facturas[$i]["idfactura"]);
            $facturas[$i]["conceptosnocondonables"] = $this->obtenerConceptosNoCondonables($facturas[$i]["idfactura"]);
        }
        return $facturas;
    }

    /**
     * Consulta el arreglo de motivos disponibles para notas segun una estructura
     * @return array arreglo de motivos para notas
     * @throws MyException
     */
    public function obtenerMotivosNota() {
        $motivos = $this->condonarCarteraModel->consultarMotivosNota();
        if (empty($motivos)) {
            throw new MyException("Error, no se encontraron motivos de nota", 0);
        }
        return $motivos;
    }

    /**
     * Obtiene los conceptos condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos condonables de una
     * factura
     */
    public function obtenerConceptosCondonables($idFactura) {
        $conceptosCondonables = $this->condonarCarteraModel->consultarConceptosCondonables($idFactura);
        return $conceptosCondonables;
    }

    /**
     * Obtiene los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos no condonables de
     * una factura
     */
    public function obtenerConceptosNoCondonables($idFactura) {
        $conceptosNoCondonables = $this->condonarCarteraModel->consultarConceptosNoCondonables($idFactura);
        return $conceptosNoCondonables;
    }

    /**
     * Genera la condonacion de cartera de una suscripcion 
     * @param array $suscripcion informacion de la suscripcion
     * @param int $idMotivo id del motivo de la condonacion
     * @param string $descripcion texto de la descripcion de la condonacion
     * @return int id del registro
     * @throws MyException
     */
    public function generarCondonacion($suscripcion, $idMotivo, $descripcion) {
        try {
            $this->conexion->beginTransaction();
            $infoSuscrip = $this->obtenerInformacionSuscripcion($suscripcion["idsuscripcion"]);
            $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($infoSuscrip["idsuscripcion"]);
            $idNota = $this->registrarNotaCondonacion($idMotivo, $descripcion, $cicloPeriodo, $infoSuscrip);
            $this->procesarPorFactura($infoSuscrip, $cicloPeriodo, $suscripcion, $idNota);
            $this->conexion->commit();
        } catch (MyException $exc) {
            $this->conexion->rollBack();
            throw new MyException($exc->getMessage(), -1);
        }
        return $idNota;
    }

    /**
     * Procesa por factura la condonacion y la recuperacion de la cartera de una
     * suscripcion
     * @param array $suscripcion informacion de la suscripcion
     * @param array $cicloPeriodo informacion del ciclo y periodo activo de la 
     * suscripcion
     * @param array $facturas informacion de las facturas de la suscripcion
     * @param int $idNota id de la nota de la condonacion
     */
    private function procesarPorFactura($infoSuscrip, $cicloPeriodo, $suscripcion, $idNota) {
        foreach ($suscripcion["facturas"] as $factura) {
            
            $infoFactura = $this->obtenerInformacionFactura($factura["idfactura"]);
            $liquidacion = $this->condonarCarteraModel->consultarInfoLiquidacion($infoFactura["idliquidacion"]);
            $numeroFactura = $this->consultarNumeroFactura($infoSuscrip["idempresa"], $liquidacion["iddocumento"], $liquidacion["idtipodocumento"]);
            $documento = $this->obtenerIdDocumentoCondonacion($infoFactura["iddocumento"], $infoFactura["idtipodocumento"]);
            $idNotaFactura = $this->registrarNotaFactura($suscripcion,$infoSuscrip, $infoFactura, $documento, $cicloPeriodo, $numeroFactura, $factura["conceptos"], "C");
            $this->procesarPorConceptos($suscripcion,$idNotaFactura, $factura["conceptos"], $factura["idfactura"], $idNota);
            $this->actualizarNumeroFactura($numeroFactura["numero"], $numeroFactura["idnumero"]);
            $facturaProvision = $this->consultarFacturaProvision($infoFactura["idfactura"]);
//            if (!empty($facturaProvision)) {
//                $numeroFac = $this->consultarNumeroFactura($suscripcion["idempresa"], $liquidacion["iddocumento"], $liquidacion["idtipodocumento"]);
//                $this->registrarRecuperacionFactura($suscripcion, $factura["conceptos"], $facturaProvision, $numeroFac, $cicloPeriodo, $idNota);
//                $this->actualizarNumeroFactura($numeroFac["numero"], $numeroFac["idnumero"]);
//            }
            $this->actualizarSaldoFactura($infoFactura["idfactura"], $infoFactura["version"]);
        }
    }

    /**
     * Procesa la nota del detalle de una factura y realiza la respectiva vinculacion del detalle
     * en la tabla nofa_notfactura
     * @param int $idNotaFactura id de la nota de la factura
     * @param array $conceptos informacion de los conceptos
     * @param id $idFacOriginal id de la factura original
     * @param int $idNota id de la nota de la condonacion
     */
    private function procesarPorConceptos($suscripcion,$idNotaFactura, $conceptos, $idFacOriginal, $idNota) {
        foreach ($conceptos as $concepto) {
            $infoConcepto = $this->obtenerInformacionConcepto($concepto["idconcepto"]);
            $idNotaConcepto = $this->registrarNotaConcepto($suscripcion,$infoConcepto, $idNotaFactura, "C");
            $this->registrarNotaNofa($idNotaFactura, $idNotaConcepto, $idFacOriginal, $idNota, $concepto["idconcepto"]);
        }
    }

    /**
     * Registra una nota de condonacion para una suscripcion
     * @param int $idMotivo id del motivo de la nota de la condonacion
     * @param string $descripcion descripcion de la condonacion
     * @param array $cicloPeriodo informacion del ciclo y periodo de la
     * suscripcion
     * @param array $suscripcion informacion de la suscripcion
     * @return int id de la nota creada
     */
    private function registrarNotaCondonacion($idMotivo, $descripcion, $cicloPeriodo, $suscripcion) {
        $parametros["descripcion"] = $descripcion;
        $parametros["idmotivo"] = $idMotivo;
        $parametros["idsuscripcion"] = $suscripcion["idsuscripcion"];
        $parametros["idciclo"] = $cicloPeriodo["idciclo"];
        $parametros["idperiodo"] = $cicloPeriodo["idperiodo"];
        $parametros["cicanio"] = $cicloPeriodo["cicloanio"];
        return $this->condonarCarteraModel->registrarNotaCondonacion($parametros);
    }

    /**
     * Obtiene el id del documento usado para la nota de factura condonacion
     * @param type $idDocumento id del documento de la suscripcion
     * @param type $idTipoDocumento id del tipo de documento de la suscripcion
     * @return array informacion del documento de la condonacion
     * @throws MyException
     */
    private function obtenerIdDocumentoCondonacion($idDocumento, $idTipoDocumento) {
        $documento = $this->condonarCarteraModel->consultarIdDocumentoCondonacion($idDocumento, $idTipoDocumento);
        if (empty($documento)) {
            throw new MyException("Error, no se encontró documento para la condonación", 0);
        }
        return $documento;
    }

    /**
     * Obtiene el id del documento usado para la nota de factura de recuperacion
     * @param type $idDocumento id del documento de la suscripcion
     * @param type $idTipoDocumento id del tipo de documento de la suscripcion
     * @return array informacion del documento de recuperacion
     * @throws MyException
     */
    private function obtenerIdDocumentoRecuperacion($idDocumento, $idTipoDocumento) {
        $documento = $this->condonarCarteraModel->consultarIdDocumentoRecuperacion($idDocumento, $idTipoDocumento);
        if (empty($documento)) {
            throw new MyException("Error, no se encontró documento para la recuperación", 0);
        }
        return $documento;
    }

    /**
     * Recupera la informacion de una suscripcion segun su id de suscripcion
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de la suscripcion
     */
    private function obtenerInformacionSuscripcion($idSuscripcion) {
        $parametros["idsuscripcion"] = $idSuscripcion;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $infoSuscripcion = $this->genericoModel->getSuscripcion($parametros, $this->sesion->get("idusuario"));
        return $infoSuscripcion[0];
    }

    /**
     * Recupera la informacion de una factura sefun su id de factura
     * @param int $idFactura id de la factura
     * @return array informacion de la factura
     */
    private function obtenerInformacionFactura($idFactura) {
        $infoFactura = $this->genericoModel->consultarFactura($idFactura);
        return $infoFactura;
    }

    /**
     * Recupera la informacion del concepto (dfac) segun su id de concepto
     * @param type $idConcepto id del concepto
     * @return array informacion del concepto
     */
    private function obtenerInformacionConcepto($idConcepto) {
        $infoConcepto = $this->genericoModel->getConceptosPorId($idConcepto);
        return $infoConcepto;
    }

    /**
     * Realiza la sumatoria de los valores de los conceptos condonables como 
     * numero negativo para la nota de la factura
     * @param array $conceptos informacion de los conceptos
     * @return number sumatoria del valor real de los conceptos
     */
    private function obtenerSumatoriaConceptosFactura(array $conceptos) {
        $valorConceptos = 0;
        foreach ($conceptos as $concepto) {
            $infoConcepto = $this->genericoModel->getConceptosPorId($concepto["idconcepto"]);
            $valorConceptos += $infoConcepto["valorreal"];
        }
        return $valorConceptos;
    }

    /**
     * Realiza la sumatoria de los valores de los conceptos condonables como 
     * numero negativo para la nota de la factura
     * @param array $conceptos informacion de los conceptos con provision
     * @return number sumatoria del valor real de los conceptos
     */
    private function obtenerSumatoriaConceptosProvision(array $conceptos) {
        $valorConceptos = 0;
        foreach ($conceptos as $concepto) {
            $infoConcepto = $this->genericoModel->getConceptosPorId($concepto["iddetallefactura"]);
            $valorConceptos += $infoConcepto["valorreal"];
        }
        return $valorConceptos;
    }

    /**
     * Consulta el numero de factura para una nueva factura
     * @param int $idEmpresa id de la empresa de la suscripcion
     * @param int $idDocumento id del documento de la liquidacion de la
     * suscripcion
     * @param int $idTipoDocumento id del tipo de documento de la liquidacion
     * @return array
     * @throws MyException
     */
    private function consultarNumeroFactura($idEmpresa, $idDocumento, $idTipoDocumento) {
        $infoFactura["idempresa"] = $idEmpresa;
        $infoFactura["iddocumento"] = $idDocumento;
        $infoFactura["idtipodocumento"] = $idTipoDocumento;
        $infoFactura['tipo'] = "FA";
        $numeroFactura = $this->genericoModel->obtenerNumeroFactura($infoFactura);
        if (empty($numeroFactura)) {
            throw new MyException("Error, número de factura no encontrado", -1);
        }
        return $numeroFactura;
    }

    /**
     * Actualiza el numero de factura disponible despues de solicitarse un nuevo
     * numero
     * @param int $numero numero de la factura
     * @param int $idNumero id del registro del numero de la factura
     */
    private function actualizarNumeroFactura($numero, $idNumero) {
        $this->genericoModel->actualizarNumeroDisponible($numero, $idNumero);
    }

    /**
     * Registra una nota a nivel de factura de una factura original cuyos
     * conceptos van a ser condonados
     * @param int $suscripcion id de la suscripcion
     * @param array $infoFactura informacion de la factura
     * @param int $documento id del tipo de documento de condonacion
     * @param type $cicloPeriodo informacion del ciclo y periodo de la
     * suscripcion
     * @param int $numeroFactura numero de la factura
     * @param array $conceptos informacion de los conceptos
     * @return int id de la nota de la factura
     */
    private function registrarNotaFactura($suscripcion,$infoSuscrip, $infoFactura, $documento, $cicloPeriodo, $numeroFactura, $conceptos, $opc) {
        $factura["facnumero"] = $numeroFactura["numero"];
        $factura["facmetgenera"] = "P";
        $factura["facestado"] = "A";
        $factura["facfecha"] = "now()";
        $factura["empideregistro"] = $infoSuscrip["idempresa"];
        $factura["susideregistro"] = $infoSuscrip["idsuscriptor"];
        $factura["dsusideregistr"] = $infoSuscrip["idsuscripcion"];
        $factura["unitipsuscripc"] = $infoSuscrip["idtiposuscripcion"];
        $factura["unitipusosuscr"] = $infoSuscrip["idtipousosuscripcion"];
        $factura["uniliquidacion"] = $infoSuscrip["idliquidacion"];
        $factura["terideregistro"] = $infoSuscrip["idtercero"];
        $factura["cicideregistro"] = $cicloPeriodo["idciclo"];
        $factura["perideregistro"] = $cicloPeriodo["idperiodo"];
        $factura["unidocumento"] = $documento["iddocumento"];
        $factura["unitipdocument"] = $infoFactura["idtipodocumento"];
        $factura["cicano"] = $cicloPeriodo["cicloanio"];
        $factura["unitiptercero"] = $infoSuscrip["idtipotercero"];
        $factura["usuideregistro"] = $this->sesion->get("idusuario");
        $valorConceptos = null;
        switch ($opc) {
            case "C":
                $valorConceptos = $this->obtenerSumatoriaConceptosFactura($conceptos);
                $factura["facidepadre"] = $infoFactura["idfactura"];
                break;
            case "R":
                $valorConceptos = $this->obtenerSumatoriaConceptosProvision($conceptos);
                break;
        }
        $tipo_restriccion = $suscripcion["tipo_restriccion"];
        $restriccion = $suscripcion["restriccion"];
        $porcentaje = intval($restriccion["luspu_limiteporcentaje"]);
        $monto = intval($restriccion["luspu_limitemonto"]);

        if($tipo_restriccion == "ambos" || $tipo_restriccion == "porcentaje"){
            $factura["facsdoreal"] = floatval($valorConceptos-($valorConceptos*($porcentaje/100)));
            $factura["facvlrreal"] = floatval(($valorConceptos*($porcentaje/100))*-1);
        }else{
            $valorMonto = 0;
            if($monto > $valorConceptos){
                $valorMonto = $valorConceptos;
            }else{
                $valorMonto = $monto;
            }
            $factura["facsdoreal"] = floatval($valorConceptos-$valorMonto);
            $factura["facvlrreal"] = floatval(($valorMonto)*-1);
        }

        $factura["facideorigen"] = $infoFactura["idfactura"];
        return $this->importarFacturasModel->insertarFactura($factura);
    }

    /**
     * Registra una nota a nivel de concepto
     * @param array $infoConcepto informacion del concepto
     * @param int $idFactura id de la nota de condonacion
     * @param string $opc
     */
    private function registrarNotaConcepto($suscripcion,$infoConcepto, $idFactura, $opc) {
        $tipo_restriccion = $suscripcion["tipo_restriccion"];
        $restriccion = $suscripcion["restriccion"];
        $porcentaje = intval($restriccion["luspu_limiteporcentaje"]);
        $monto = intval($restriccion["luspu_limitemonto"]);

        $valorConcepto = $infoConcepto["valorreal"];
        if($tipo_restriccion == "ambos" || $tipo_restriccion == "porcentaje"){
            $detalle["dfacvlrtotal"] = floatval(abs($valorConcepto*($porcentaje/100)));
            $detalle["dfacvlrreal"] = floatval(($valorConcepto*($porcentaje/100))*-1);
            $detalle["dfacvlrunitari"] = floatval(($valorConcepto*($porcentaje/100))*-1);
            $detalle["dfacsdoreal"] = floatval($valorConcepto-($valorConcepto*($porcentaje/100)));
        }else{
            $valorMonto = 0;
            if($monto > $valorConcepto){
                $valorMonto = $valorConcepto;
            }else{
                $valorMonto = $monto;
            }
            $detalle["dfacvlrtotal"] = floatval(abs($valorMonto));
            $detalle["dfacvlrreal"] = floatval(($valorMonto)*-1);
            $detalle["dfacvlrunitari"] = floatval(($valorMonto)*-1);
            $detalle["dfacsdoreal"] = floatval($valorConcepto-$valorMonto);
        }
        $detalle["dfacestado"] = "A";
        $detalle["dfaccantidad"] = 1;
        $detalle["facideregistro"] = $idFactura;
        $detalle["uniconcepto"] = $infoConcepto["idconcepto"];
        $detalle["dfacideorigen"] = $infoConcepto["iddetallefactura"];
        if ($opc == "C") {
            $detalle["dfacidepadre"] = $infoConcepto["iddetallefactura"];
        }
        $detalle["usuideregistro"] = $this->sesion->get("idusuario");
        $resultado =  $this->importarFacturasModel->insertarDetalleFactura($detalle);
        return $resultado;
    }

    /**
     * Registra una nota en la tabla nofa para la condonacion actual
     * @param type $idNotaFactura id de la nota de factura
     * @param type $idNotaConcepto id de la nota del concepto
     * @param type $idFacOriginal id de la factura original
     * @param type $idNota id de la nota de la condonacion
     * @param type $idConcepto id del concepto
     */
    private function registrarNotaNofa($idNotaFactura, $idNotaConcepto, $idFacOriginal, $idNota, $idConcepto) {
        $infofactura['idusuario'] = $this->sesion->get('idusuario');
        $infofactura['idfacturanota'] = $idNotaFactura;
        $infofactura['iddetallefacturanota'] = $idNotaConcepto;
        $infofactura['idfacturaoriginal'] = $idFacOriginal;
        $infofactura['iddetallefacturaoriginal'] = $idConcepto;
        $infofactura['idnota'] = $idNota;
        $this->condonarCarteraModel->crearNotaModel($infofactura);
    }

    /**
     * Consulta si una factura tiene una provision
     * @param int $idFactura id de la factura
     * @return array informacion de la factura provisionada
     */
    private function consultarFacturaProvision($idFactura) {
        $complemento = "WHERE fac.fac_ideorigen=:idfactura AND fac.fac_estado = 'P'";
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->genericoModel->getFacturasInformacion($complemento, $parametros);
        if (empty($resultado)) {
            return $resultado;
        }
        return $resultado[0];
    }

    private function registrarRecuperacionFactura($suscripcion, $conceptos, $facturaProvision, $numeroFactura, $cicloPeriodo, $idNota) {
        // obtiene los conceptos condonables de la provision
        $conceptosCondonablesProv = $this->condonarCarteraModel->consultarConceptosCondonables($facturaProvision["idfactura"]);
        // obtiene el id del documento para recuperacion segun a informacion de la factura provisionada
        $documento = $this->obtenerIdDocumentoRecuperacion($facturaProvision["iddocumento"], $facturaProvision["idtipodocumento"]);
        // genera la nota de recuperacion de la factura provisionada
        $idNotaFacturaRec = $this->registrarNotaFactura($suscripcion, $facturaProvision, $documento, $cicloPeriodo, $numeroFactura, $conceptosCondonablesProv, "R");
        // recorre los conceptos de la factura condonada
        foreach ($conceptos as $concepto) {
            $infoConcepto = $this->obtenerInformacionConcepto($concepto["idconcepto"]);
            $conceptoRec = $this->condonarCarteraModel->consultarConceptoRecuperacion($facturaProvision["idfactura"], $infoConcepto["iddetallefactura"]);
            if (empty($infoConcepto["valorreal"]) || empty($conceptoRec["valorreal"])) {
                throw new MyException("Error, el concepto condonado o el concepto provisonado no tienen valor real (Inconsistencia de datos encontrada)", -1);
            }
            $valorRecuperacion = ($infoConcepto["valorreal"] / ($conceptoRec["valorreal"] / 0.33)) * $conceptoRec["valorreal"];
            $conceptoRec["valorreal"] = $valorRecuperacion;           
            $idNotaConceptoRec = $this->registrarNotaConcepto($conceptoRec, $idNotaFacturaRec, "R");
            $this->registrarNotaNofa($idNotaFacturaRec, $idNotaConceptoRec, $facturaProvision["idfactura"], $idNota, $conceptoRec["iddetallefactura"]);
        }
    }

    /**
     * Actualiza el saldo de la factura original
     * @param type $idFactura id de la factura original
     * @param type $version version de la factura
     */
    private function actualizarSaldoFactura($idFactura, $version) {
        $this->genericoDelegado->actualizarFacturaSaldo($idFactura, $version);
    }

    /**
     * Despliega un combo en html con los motivos
     * @return html combo con motivos para nota de condonacion
     */
    public function cargarComboDb() {
        $codTipo = "cmbMotivosNota";
        $resultado = $this->obtenerMotivosNota();
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearCombo($codTipo, $listaDatos);
    }

    /**
     * Obtiene los conceptos no condonables de una factura
     * @param int $idFactura id de la factura
     * @return array arreglo de informacion de los conceptos no condonables de
     * una factura
     */
    public function consultarPermisosBotonesFacturas() {
        $parametros['idusuario']=$this->sesion->get('idusuario') ;
        $parametros['idempresa']=$this->sesion->get('idempresa') ;
        $parametros['idestructura']= 141 ;
        $parametros['ideprograma']= PROGRAMA_CONDONAR_CARTERA_CORRIENTE;

        return $this->condonarCarteraModel->consultarPermisosBotonesFacturas($parametros);
    }

     /**
     * consulta la informacion de las facturas de la suscripcion 
     * @param int $idSuscripcion id de la suscripcion
     * @return array informacion de las facturas con conceptos condonables y no
     * condonables
     * @throws MyException
     */
    public function obtenerFacturasCarteraIntCorriente($idSuscripcion, $idsegmento) {    
        $facturas = $this->condonarCarteraModel->consultarFacturasCarteraIntCorriente($idSuscripcion, $idsegmento);

        if (empty($facturas)) {
            throw new MyException("Error, no se encontraron facturas", 0);
        }
        for ($i = 0; $i < count($facturas); $i++) {
            $facturas[$i]["conceptoscondonables"] = $this->obtenerConceptosCondonables($facturas[$i]["idfactura"]);
            $facturas[$i]["conceptosnocondonables"] = $this->obtenerConceptosNoCondonables($facturas[$i]["idfactura"]);
        }
        return $facturas;
    }

    /**
     * Permite consultar la restricción del monto de acuerdo a limite parametrizado
     * @param int $porcentaje
     * @param int $monto
     * @return booelan flag
     */
    public function consultarRestriccion($idSuscripcion, $opcion_sel) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        return $this->condonarCarteraModel->consultarRestriccionModel($parametros, $opcion_sel);
    }

    /**
     * consulta la informacion de las facturas condonadas segun la nota de una suscripcion 
     * @param Object parametros con la informacion de las facturas condonadas.
     * @return array informacion de las facturas condonadas.
     * @throws MyException
     */
    public function obtenerFacturasCondonadas($parametros) {
        $parametros["idEmpresa"] = $this->sesion->get('idempresa');
        $facturas = $this->condonarCarteraModel->consultarFacturasCondonadasModel($parametros);
        if (empty($facturas)) {
            throw new MyException("Error, no se encontraron facturas condonadas.", 0);
        }
        return $facturas;
    }
}
