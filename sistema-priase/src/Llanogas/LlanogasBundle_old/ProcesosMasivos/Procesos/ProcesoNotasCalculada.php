<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Delegado\GenerarFacturaSuscripcionDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\NotasCalculadaModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\NotasCalculadaDelegado;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Proceso Facturacion
 *
 * @author hrey
 */
class ProcesoNotasCalculada {

    /**
     * @var array
     */
    private $parametros;

    /**
     *
     * @var NotasCalculadaModel
     */
    private $notasCalculadaModel;

    /**
     *
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var array 
     */
    private $sesion;
    private $listaDebito = array();
    private $listaCredito = array();
    private $listaSaldo = array();
    private $listaConceptosInformativosCredito = array();
    private $listaConceptosInformativosDebito = array();

    /**
     *
     * @var ProcesoModel  
     */
    private $procesoModel;

    /**
     *
     * @var int 
     */
    private $idProceso;

    /**
     * Identificador del programa
     * @var int 
     */
    private $idPrograma = PROGRAMA_NOTA_CALCULADA;

    /**
     * Lista de conceptos de cómo quieren que se liquide las facturas
     * @var array 
     */
    private $listaConceptos;

    public function __construct(array $parametros, $conexion = null) {
        $this->listaConceptos = array();
        $this->conexion = $conexion;
        if (empty($this->conexion)) {
            $this->conexion = ConexionBD::getConexion();
        }
        if (isset($parametros['idprograma'])) {
            $this->idPrograma = $parametros['idprograma'];
        }
        $this->parametros = $parametros;
        $this->notasCalculadaModel = new NotasCalculadaModel($this->idPrograma, $this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($parametros['idacceso']);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->registrarProceso();
        /*
         * Comentarear las siguientes 4 lineas para recibir array asociativo directo y hacer debug del proceso 
         * una vez concluido el debug volver a habilitar las lineas 
         */
        if (isset($this->parametros['conceptos'])) {
            $this->parametros['conceptos'] = json_decode($this->parametros['conceptos'], true);
            $this->procesarConceptos();
        }
    }

    private function procesarConceptos() {
        $this->imprimeMensaje('procesando conceptos ');
        $this->imprimeMensaje($this->parametros['conceptos']);
        $this->listaConceptos = $this->parametros['conceptos'];
        if ($this->parametros['conceptos'] == -1) {
            $this->imprimeMensaje('Array vacío');
            $this->parametros['conceptos'] = array();
            $this->listaConceptos = array();
            $this->imprimeMensaje($this->listaConceptos);
        }
    }

    /**
     * Inicializa los arreglos cuando se pasa a otra factura 
     */
    private function inicializarArreglos() {
        $this->listaDebito = array();
        $this->listaCredito = array();
        $this->listaSaldo = array();
        $this->listaConceptosInformativosCredito = array();
        $this->listaConceptosInformativosDebito = array();
    }

    /**
     * Se inicia el proceso para generar las notas 
     * @return type
     */
    public function iniciar() {
        $listaFacturas = $this->notasCalculadaModel->getFacturasProceso($this->sesion['idusuario'], $this->parametros['idproceso']);
        if (empty($listaFacturas)) {
            return;
        }
        $this->listaConceptos = $this->procesarConceptosRelacionadosAfectados();
        foreach ($listaFacturas as $factura) {
            $this->procesarRegistro($factura);
        }
        $this->iniciar();
    }

    /**
     * Se procede a consultar todos los conceptos liquidados 
     * @return type
     */
    private function procesarConceptosRelacionadosAfectados() {
        $idsConceptos = $this->parametros['conceptos'];
        $listaConceptos = $this->notasCalculadaModel->conceptosIniciales($idsConceptos);
        $lista = $this->notasCalculadaModel->conceptosAfectados($idsConceptos, $this->parametros['idliquidacion']);
        $parametroConcepto = array();
        while (!empty($lista)) {
            $idsConceptos = "";
            foreach ($lista as $concepto) {
                $idsConceptos .= $concepto['idconcepto'] . ',';
                $listaConceptos[] = $concepto;
            }
            $idsConceptos .= '-1';
            $lista = $this->notasCalculadaModel->conceptosAfectados($idsConceptos, $this->parametros['idliquidacion']);
            if(empty($lista)){
                $parametroConcepto['idconcepto']=3224;
                $listaConceptos[] = $parametroConcepto;
            }
        }
        return $listaConceptos;
    }

    /**
     * Genera notas a una factura
     * @param type $parametros  ($idmotivo,$comentario,$idfactura(factura que se quiere hacer nota))
     */
    public function notaSuscripcion(&$parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $facturaOriginal = $this->crearTablasTemporales($parametros);
        $factura = $this->notasCalculadaModel->getFacturasId($idUsuario, $facturaOriginal['idfactura']);
        $this->parametros['idliquidacion'] = $facturaOriginal['idliquidacion'];
        $this->listaConceptos = $this->procesarConceptosRelacionadosAfectados();
        $this->procesarRegistroFactura($factura);
        $notasCalculadaDelegado = new NotasCalculadaDelegado($this->parametros['idacceso'], $this->idPrograma, $this->conexion);
        $notasCalculadaDelegado->aplicarNotaSuscripcion($parametros);
        $this->finalizarProceso();
    }

    public function finalizarProcesoUsuario($idUsuario, $idPrograma) {
        try {
            $this->procesoModel->finalizarProcesoUsuario($idUsuario, $idPrograma);
        } catch (\Exception $ex) {
            error_log($ex->getMessage());
        }
    }

    /**
     * Se crea las tablas temporales por cada usuario 
     * @param type $parametros
     * @return type
     */
    private function crearTablasTemporales(&$parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $conexionTemp = ConexionBD::getConexion();
        $notasCalculadaModel = new NotasCalculadaModel($this->idPrograma, $conexionTemp);
        $notasCalculadaModel->eliminarTablaConsulta($idUsuario);
        $notasCalculadaModel->eliminarTablasNotas($idUsuario);
        $notasCalculadaModel->crearTablasNotas($idUsuario);
        $facturaOriginal = $this->genericoModel->getFactura($parametros['idfactura']);
        $facturaOriginal['idusuario'] = $idUsuario;
        $notasCalculadaModel->getFacturas($facturaOriginal);
        $conexionTemp->close();
        return $facturaOriginal;
    }

    /**
     * Se procede a ejecutar las notas de una factura en específico 
     * @param type $factura
     */
    private function procesarRegistro(&$factura) {
        try {
            $idFactura = $factura['fac_ideregistro'];
            $this->conexion->beginTransaction();
            $this->procesarRegistroFactura($factura);
            $this->conexion->commit();
            $mensaje = 'Generación de notas correctamente';
            $estado = 'G';
        } catch (\Exception $e) {
            $this->imprimeMensaje($e->getTraceAsString());
            $this->conexion->rollBack();
            $estado = 'F';
            $mensaje = 'Error al generar la nota idsuscripcion ' . $factura['dsus_ideregistr'] . '  ' . $e->getMessage();
        }
        $this->marcarFacturas($idFactura, $estado, $mensaje);
    }

    /**
     * Se genera la liquidación parcial de acuerdo a los conceptos seleccioandos
     *  en la interfaz 
     * @param array $factura
     */
    private function procesarRegistroFactura($factura) {
        $factura['usu_ideregistro'] = $this->sesion['idusuario'];
        $idSuscripcion = $factura['dsus_ideregistr'];
        $generarFacturaSuscripcionDelegado = new GenerarFacturaSuscripcionDelegado($this->conexion, $this->parametros['idacceso'], $idSuscripcion, $this->idPrograma);
        $listaConceptoLiquidados = $generarFacturaSuscripcionDelegado->generarLiquidacionParcial($this->listaConceptos);
        $this->procesarDetalles($listaConceptoLiquidados, $factura);
        $this->generarNotas($factura);
        $this->inicializarArreglos();
    }

    /**
     * Se procede a insertar en la tabla temporal el tipo de nota 
     * de acuerdo a la liquidación y la diferencia de los coneptos que existan 
     * en la tabla
     * @param array $listaConceptoLiquidados
     * @param type $factura
     */
    private function procesarDetalles(array $listaConceptoLiquidados, $factura) {
        $listaConceptosFactura = $this->genericoModel->getConceptos($factura['fac_ideregistro']);
        foreach ($listaConceptoLiquidados as $conceptoLiquidado) {
            $existe = false;
            foreach ($listaConceptosFactura as $conceptoFactura) {
                if ($conceptoFactura['idconcepto'] !== $conceptoLiquidado['idconcepto']) {
                    continue;
                }
                $existe = true;
                $conceptoFactura['existe'] = $existe;
                $conceptoLiquidado['existe'] = $existe;
                /**
                 * Se valida si hay alguna diferencia entre el valor facturado y el valor liquidado
                 * si hay se procede a generar la nota de lo contrario se continua con el siguiente 
                 * concepto
                 */
                if ($conceptoFactura['valortotal'] !== $conceptoLiquidado['valortotal']) {
                    $this->generarNotaDetalle($conceptoFactura, $conceptoLiquidado);
                }
                break;
            }
            /**
             * Se valida si el concepto es informativo
             */
            if (!$existe && $conceptoLiquidado['operacion'] == 'I') {
                $conceptoLiquidado['existe'] = $existe;
                $this->listaConceptosInformativosDebito[] = $conceptoLiquidado;
                continue;
            }
            /**
             * Si el concepto suma
             */
            if (!$existe && $conceptoLiquidado['operacion'] == 'S') {
                $conceptoLiquidado['existe'] = $existe;
                $this->listaDebito[] = $conceptoLiquidado;
            }
        }
    }

    /**
     * Valida qué tipo de nota se va a generar 
     * @param type $conceptoFactura
     * @param type $conceptoLiquidado
     * @return type
     */
    private function generarNotaDetalle($conceptoFactura, $conceptoLiquidado) {
        if ($conceptoFactura['valortotal'] == $conceptoLiquidado['valortotal']) {
            return;
        }
        $conceptoFactura['iddetallepadre'] = $conceptoFactura['iddetallefactura'];
        /**
         * Si el concepto es informativo se procede a colocar el concepto en la nota 
         * correspondiente crédito o débito
         */
        if ($conceptoLiquidado['operacion'] === 'I') {
            $this->validarConceptoInformativo($conceptoFactura, $conceptoLiquidado);
            return;
        }
        $valor = $conceptoLiquidado['valorreal'] - $conceptoFactura['valorreal'];
        /**
         * Si el valor liquidado es mauor facturado se genera una nota débito
         */
        if ($valor > 0) {
            $conceptoFactura['valortotal'] = $valor;
            $conceptoFactura['valorreal'] = $valor;
            $this->listaDebito[] = $conceptoFactura;
            return;
        }
        /**
         * Se genera una nota saldo a favor si la nota crédito es superior 
         * al saldo del concepto
         */
        $valorNota = $conceptoFactura['saldo'] + $valor;
        if ($valorNota < 0) {
            $conceptoFactura['valortotal'] = $valorNota;
            $conceptoFactura['valorreal'] = $valorNota;
            $this->listaSaldo[] = $conceptoFactura;
        }
        /**
         * Si existe hay una nota saldo a favor se procede a generar la nota crédito por 
         * el saldo del concepto 
         */
        $valorNotaCredito = ($valorNota > 0) ? $conceptoFactura['saldo'] - $valorNota : $conceptoFactura['saldo'];
        if ($valorNotaCredito == 0) {
            return;
        }
        /**
         * Se asegura que el valor que se va a registrar sea negativo
         */
        $conceptoFactura['valortotal'] = abs($valorNotaCredito) * -1;
        $conceptoFactura['valorreal'] = abs($valorNotaCredito) * -1;
        $this->listaCredito[] = $conceptoFactura;
    }

    /**
     * Registra el concepto informativo en la nota correspondiente 
     * @param type $conceptoFactura
     * @param type $conceptoLiquidado
     * @return type
     */
    private function validarConceptoInformativo($conceptoFactura, $conceptoLiquidado) {
        $conceptoLiquidado['iddetallepadre'] = $conceptoFactura['iddetallefactura'];
        $conceptoLiquidado['existe'] = TRUE;
        $valor = $conceptoFactura['valortotal'] - $conceptoLiquidado['valortotal'];
        if ($valor < 0) {
            $conceptoLiquidado['valortotal'] = abs($valor);
            $this->listaConceptosInformativosDebito[] = $conceptoLiquidado;
            return;
        }
        $conceptoLiquidado['valortotal'] = $valor;
        $this->listaConceptosInformativosCredito[] = $conceptoLiquidado;
    }

    /**
     * Después de haber procesado las notas, se registran en las tablas temporales del usuario 
     * @param type $factura
     */
    public function generarNotas(&$factura) {
        $factura['fac_idepadre'] = $factura['fac_ideregistro'];
        $factura['fac_ideorigen'] = $factura['fac_ideregistro'];
        $idDocumentoFacturaPadre = $factura['uni_documento'];
        $this->generarNotasDebito($factura);
        $factura['uni_documento'] = $idDocumentoFacturaPadre;
        $this->generarNotasCredito($factura);
        $factura['uni_documento'] = $idDocumentoFacturaPadre;
        $this->generarNotasSaldoFavor($factura);
    }

    private function generarNotasDebito(&$factura) {
        if (empty($this->listaDebito) && empty($this->listaConceptosInformativosDebito)) {
            return;
        }
        /*
         * NOTA DEBIDO PARA LECTURAS NB 
         */
        switch ($this->idPrograma) {
            case PROGRAMA_MODIFICAR_LECTURAS :
                $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'NB');
                break;
            default :
                $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'ND');
                break;
        }

        $factura['uni_documento'] = $infoDocumento['iddocumento'];
        $factura['tipo'] = 'ND';
        $this->notasCalculadaModel->insertarFacturaTemporal($factura, $this->sesion['idusuario']);
        foreach ($this->listaDebito as $detalleDebito) {
            $detalleDebito['fac_ideregistro'] = $factura['fac_ideregistro'];
            $this->notasCalculadaModel->insertarDetalleTemporal($detalleDebito, $this->sesion['idusuario']);
        }
        foreach ($this->listaConceptosInformativosDebito as $detalleDebito) {
            $detalleDebito['fac_ideregistro'] = $factura['fac_ideregistro'];
            $this->notasCalculadaModel->insertarDetalleTemporal($detalleDebito, $this->sesion['idusuario']);
        }
    }

    /**
     * se genrar las notas crédito y se registran en las tablas temporales  
     * @param type $factura
     * @return type
     */
    private function generarNotasCredito(&$factura) {
        if (empty($this->listaCredito) && empty($this->listaConceptosInformativosCredito)) {
            return;
        }
        /*
         * NOTA CREDITO PARA LECTURAS NL 
         */
        switch ($this->idPrograma) {
            case PROGRAMA_MODIFICAR_LECTURAS :
                $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'NL');
                break;
            default :
                $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'NC');
                break;
        }

        $factura['uni_documento'] = $infoDocumento['iddocumento'];
        $factura['tipo'] = 'NC';
        $this->notasCalculadaModel->insertarFacturaTemporal($factura, $this->sesion['idusuario']);
        foreach ($this->listaCredito as $detalleCredito) {
            $detalleCredito['fac_ideregistro'] = $factura['fac_ideregistro'];
            $this->notasCalculadaModel->insertarDetalleTemporal($detalleCredito, $this->sesion['idusuario']);
        }
        foreach ($this->listaConceptosInformativosCredito as $detalleCredito) {
            $detalleCredito['fac_ideregistro'] = $factura['fac_ideregistro'];
            $this->notasCalculadaModel->insertarDetalleTemporal($detalleCredito, $this->sesion['idusuario']);
        }
    }

    /**
     * Se genera las notas saldo a favor en la tabla temporal
     * @param type $factura
     * @return type
     */
    private function generarNotasSaldoFavor(&$factura) {
        if (empty($this->listaSaldo)) {
            return;
        }
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['uni_documento'], $factura['uni_tipdocument'], 'NS');
        $factura['uni_documento'] = $infoDocumento['iddocumento'];
        $factura['tipo'] = 'NS';
        $this->notasCalculadaModel->insertarFacturaTemporal($factura, $this->sesion['idusuario']);
        foreach ($this->listaSaldo as $detalleSaldo) {
            $detalleSaldo['fac_ideregistro'] = $factura['fac_ideregistro'];
            $detalleSaldo['usu_ideregistro'] = $this->sesion['idusuario'];
            $this->notasCalculadaModel->insertarDetalleTemporal($detalleSaldo, $this->sesion['idusuario']);
        }
    }

    /**
     * Se marca la factura que ya se procesó para que no se vuelva a tomar 
     * @param type $facturas
     * @param type $estado
     * @param type $mensaje
     */
    private function marcarFacturas($facturas, $estado = 'P', $mensaje = '-') {
        try {
            $this->conexion->beginTransaction();
            $this->notasCalculadaModel->marcarFacturas($facturas, $this->sesion['idusuario'], $estado, $mensaje);
            $this->conexion->commit();
            $this->aumentarCantidadRegistro();
        } catch (\Exception $e) {
            $this->imprimeMensaje($e);
            $this->conexion->rollBack();
        }
    }

    public function registrarProceso() {
        $proceso['estado'] = 'A';
        $proceso['fechaInicio'] = 'now()';
        $proceso['idPrograma'] = $this->idPrograma;
        $proceso['idAcceso'] = $this->sesion['idacceso'];
        $proceso['idEmpresa'] = $this->sesion['idempresa'];
        $proceso['idHilo'] = 1;
        $this->idProceso = $this->procesoModel->insertarProceso($proceso);
    }

    public function finalizarProceso() {
        $this->procesoModel->finalizarProceso($this->idProceso);
    }

    public function aumentarCantidadRegistro() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->aumentarCantidadRegistro($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->imprimirMensajePrint($e);
            $this->conexion->rollBack();
        }
    }

    public function actualizarFacturasNotas() {
        $idUsuario = $this->sesion['idusuario'];
        $this->notasCalculadaModel->actualizarNotasFactura($idUsuario);
    }

    /**
     * Objeto que se quiere imprimir en el archivo de log
     * @param object $objMensaje
     */
    private function imprimeMensaje($objMensaje) {
        if ($this->idPrograma == PROGRAMA_NOTA_CALCULADA) {
            print_r($objMensaje);
            print_r("\n");
        }
    }

}
