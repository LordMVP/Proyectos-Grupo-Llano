<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\NotasCalculadaModel;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\Utiles\Util;
Use Llanogas\LlanogasBundle\ProcesosMasivos\EjecutaProcesoNotaCalculada;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class NotasCalculadaDelegado {

    private $idPrograma;

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var array
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var NotasAutomaticasDelegado 
     */
    private $notasAutomaticasDelegado;

    /**
     *
     * @var NotasCalculadaModel 
     */
    private $notaCalculadaModel;

    /**
     * Lista de errores que ocurrieron al momento de aplicar las notas
     * @var array 
     */
    private $listaErrores = array();

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var Connection 
     */
    private $conexionLog;

    /**
     * Identificador de acceso
     * @param int $idAcceso
     */
    public function __construct($idAcceso, $idPrograma, &$conexion = null) {
        $this->conexion = $conexion;
        if (empty($this->conexion)) {
            $this->conexion = ConexionBD::getConexion();
        }
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->notasAutomaticasDelegado = new NotasAutomaticasDelegado($this->conexion, $idAcceso, $idPrograma);
        $this->notaCalculadaModel = new NotasCalculadaModel($idPrograma, $this->conexion);
        $this->idPrograma = $idPrograma;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Eliminan las tablas temporales físicas 
     */
    public function eliminarTablas() {
        $idUsuario = $this->sesion['idusuario'];
        $this->notaCalculadaModel->eliminarTablasNotas($idUsuario);
        $this->notaCalculadaModel->eliminarTablaConsulta($idUsuario);
    }

    /**
     * Consulta los tipos de documentos asociados una suscripción
     * en las facturas 
     * @param type $idSuscripcion
     * @return type
     */
    public function getTiposDocumentos($idSuscripcion = null) {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;

        if (isset($idSuscripcion)) {
            $parametros['idsuscripcion'] = $idSuscripcion;
        }
        return $this->notaCalculadaModel->getTiposDocumentos($parametros);
    }

    /**
     * Se consulta los documentos de una suscripción
     * @param type $idTipoDocumento
     * @param type $idSuscripcion
     * @return type
     * @throws MyException
     */
    public function getDocumentos($idTipoDocumento, $idSuscripcion) {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $listaDocumentos = $this->notaCalculadaModel->getDocumentos($parametros);
        if (empty($listaDocumentos)) {
            throw new MyException('No se encontraron documentos', 0);
        }
        return $listaDocumentos;
    }

    /**
     * Consulta las liquidaciones que tiene asignadas el programa 
     * el usuario y la suscripción
     * @param type $parametros
     * @return type
     * @throws MyException
     */
    public function getLiquidaciones($parametros) {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $listaLiquidaciones = $this->notaCalculadaModel->getLiquidacion($parametros);
        if (empty($listaLiquidaciones)) {
            throw new MyException('No se encontraron liquidaciones', 0);
        }
        return $listaLiquidaciones;
    }

    /**
     * Se realiza la consulta de la última factura liquidada del periodo anterior al activo
     * @param type $parametros
     * @return type
     * @throws MyException
     */
    public function getFacturas($parametros) {
        if (!isset($parametros['idciclo']) || !is_numeric($parametros['idciclo'])) {
            throw new MyException('Error el ciclo es obligatorio', -1);
        }
        $this->notaCalculadaModel->validarInformacionDetalleTemporal($this->sesion['idusuario']);
        $periodo = $this->genericoModel->periodoAnterior($parametros['idciclo']);
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idperiodo'] = $periodo['idperiodo'];
        $listaFacturas = $this->notaCalculadaModel->getFacturas($parametros);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFacturas;
    }

    /**
     * Inicia los procesos para ejecutar las notas en segundo plano
     * @param type $argumentos
     * @param ContainerInterface $container
     * @throws MyException
     */
    public function procesar($argumentos, ContainerInterface &$container) {
        $idUsuario = $this->sesion['idusuario'];
        //Se eliminan las tablas temporales sí existen
        $this->notaCalculadaModel->eliminarTablasNotas($idUsuario);
        //Se crean las tablas temporales para ser llenadas con las notas que se quieren registrar
        $this->notaCalculadaModel->crearTablasNotas($idUsuario);
        $this->notaCalculadaModel->inicializarFacturas($idUsuario);
        $this->marcarFacturas($argumentos['facturas']);
        $idAcceso = $this->sesion['idacceso'];
        if (empty($argumentos['conceptos'])) {
            throw new MyException('Debe seleccionar al menos un concepto', -1);
        }
        $conceptos = json_encode(json_encode($argumentos['conceptos']));
        $idLiquidacion = $argumentos['idliquidacion'];
        if (!is_numeric($idLiquidacion)) {
            throw new MyException('Error la liquidación es obligatoria', -1);
        }
        /* Habilitar esta sección para poder hacer debug  no olvidar el mensaje al final de este bloque de comentario
          $argumentosProceso['idacceso'] = $idAcceso;
          $argumentosProceso['conceptos'] = $argumentos['conceptos'];
          $argumentosProceso['idliquidacion'] = $idLiquidacion;
          $argumentosProceso['idproceso'] = 0;
          $proceso = new EjecutaProcesoNotaCalculada($argumentosProceso);
          $proceso->run();
         * Comentarear las siguientes 5 lineas para no lanzar proceso en hilos y poder hacer Debug
         */
        for ($i = 0; $i < NUMERO_HILOS_NOTAS_AUTOMATICAS_CALCULADA; $i++) {
            $parametros = "$idAcceso $conceptos $idLiquidacion $i " . RUTA_PRINCIPAL;
            $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoNotaCalculada.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/notas_calculada_$i.log &";
            Util::ejecutarHilo($script);
        }
    }

    /**
     * Marca las facturas ya procesadas 
     * @param type $facturas
     * @param type $estado
     * @param type $mensaje
     */
    private function marcarFacturas($facturas, $estado = 'P', $mensaje = '-') {
        try {
            $this->conexion->beginTransaction();
            $this->notaCalculadaModel->marcarFacturas($facturas, $this->sesion['idusuario'], $estado, $mensaje);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->imprimirMensajePrint($e);
            $this->conexion->rollBack();
        }
    }

    /**
     *  Consulta la información de un concepto que se está ejecutando
     * @return array información del concepto que se está ejecutando.
     */
    public function consultarProceso() {
        $idEmpresa = $this->sesion['idempresa'];
        $resultado = $this->procesoModel->getProcesoEjecucionHilos($idEmpresa, $this->idPrograma);
        if (empty($resultado)) {
            return;
        }
        $validacionException = new ValidacionException('Hay un proceso en ejecución', -3);
        $validacionException->setData($resultado[0]);
        throw $validacionException;
    }

    public function getErrores() {
        $idUsuario = $this->sesion['idusuario'];
        return $this->notaCalculadaModel->getErroresNotas($idUsuario);
    }

    /**
     * Verifica los cambios 
     * @param type $idFactura
     * @return type
     */
    public function verificarCambios($idFactura) {
        $idUsuario = $this->sesion['idusuario'];
        return $this->notaCalculadaModel->getCambiosFactura($idFactura, $idUsuario);
    }

    /**
     * Consulta los conceptos informativos que se van aplicar en la nota 
     * @param type $idFactura
     * @return type
     */
    public function verConceptosInformativosNota($idFactura) {
        $idUsuario = $this->sesion['idusuario'];
        return $this->notaCalculadaModel->conceptosInformativos($idFactura, $idUsuario);
    }

    public function exportarFacturasOriginales() {
        $objPHPExcel = new \PHPExcel();

        $objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Facturas procesadas")
                ->setSubject("Facturas y conceptos")
                ->setDescription("Facturas con sus respectivos conceptos procesados")
                ->setKeywords("facturas conceptos")
                ->setCategory("Facturas");

        $this->crearHojaOriginal($objPHPExcel);
        return $objPHPExcel;
    }

    private function crearEncabezadoOriginal($i, &$objPHPExcel) {
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, 'iddetallefactura')
                ->setCellValue('B' . $i, 'idfactura')
                ->setCellValue('C' . $i, 'numerofactura')
                ->setCellValue('D' . $i, 'idconcepto')
                ->setCellValue('E' . $i, 'concepto')
                ->setCellValue('F' . $i, 'cantidad')
                ->setCellValue('G' . $i, 'valorunitario')
                ->setCellValue('H' . $i, 'valortotal')
                ->setCellValue('I' . $i, 'valorpagado')
                ->setCellValue('J' . $i, 'saldo')
                ->setCellValue('K' . $i, 'operacion');
    }

    private function crearHojaOriginal(&$objPHPExcel) {
        $i = -1;
        $idUsuario = $this->sesion['idusuario'];
        $listaConceptosOriginales = $this->notaCalculadaModel->getConceptosOriginales($idUsuario);
        if (empty($listaConceptosOriginales)) {
            return;
        }
        $idFactura = -1;
        foreach ($listaConceptosOriginales as $registro) {
            if ($idFactura != $registro['idfactura']) {
                $idFactura = $registro['idfactura'];
                $i += 2;
                $this->crearEncabezadoOriginal($i++, $objPHPExcel);
            }
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('A' . $i, $registro['iddetallefactura'])
                    ->setCellValue('B' . $i, $registro['idfactura'])
                    ->setCellValue('C' . $i, $registro['numerofactura'])
                    ->setCellValue('D' . $i, $registro['idconcepto'])
                    ->setCellValue('E' . $i, $registro['concepto'])
                    ->setCellValue('F' . $i, $registro['cantidad'])
                    ->setCellValue('G' . $i, $registro['valorunitario'])
                    ->setCellValue('H' . $i, $registro['valortotal'])
                    ->setCellValue('I' . $i, $registro['valorpagado'])
                    ->setCellValue('J' . $i, $registro['saldo'])
                    ->setCellValue('K' . $i, ($registro['operacion'] == 'I') ? 'Informativo' : 'Suma');
            $i++;
        }
    }

    public function exportarFacturasNotas() {
        $objPHPExcel = new \PHPExcel();

        $objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Facturas procesadas")
                ->setSubject("Facturas y conceptos")
                ->setDescription("Facturas con sus respectivos conceptos procesados")
                ->setKeywords("facturas conceptos")
                ->setCategory("Facturas");
        $this->crearHojaNotas($objPHPExcel);
        return $objPHPExcel;
    }

    private function crearEncabezadoNotas($i, &$objPHPExcel) {
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, 'cod. Factura Inicial ')
                ->setCellValue('B' . $i, 'cod. cocepto')
                ->setCellValue('C' . $i, 'concepto')
                ->setCellValue('D' . $i, 'valor')
                ->setCellValue('E' . $i, 'valor nota')
                ->setCellValue('F' . $i, 'tipo concepto')
                ->setCellValue('G' . $i, 'tipo nota');
    }

    private function crearHojaNotas(&$objPHPExcel) {
        $i = -1;
        $idUsuario = $this->sesion['idusuario'];
        $listaConceptosNotas = $this->notaCalculadaModel->getConceptosNotas($idUsuario);
        if (empty($listaConceptosNotas)) {
            return;
        }
        $idFactura = -1;
        foreach ($listaConceptosNotas as $registro) {
            if ($idFactura != $registro['idfacturainicial']) {
                $idFactura = $registro['idfacturainicial'];
                $i += 2;
                $this->crearEncabezadoNotas($i++, $objPHPExcel);
            }
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('A' . $i, $registro['idfacturainicial'])
                    ->setCellValue('B' . $i, $registro['idconcepto'])
                    ->setCellValue('C' . $i, $registro['concepto'])
                    ->setCellValue('D' . $i, $registro['valor'])
                    ->setCellValue('E' . $i, $registro['valornota'])
                    ->setCellValue('F' . $i, $registro['tipoconcepto'])
                    ->setCellValue('G' . $i, $registro['tiponota']);
            $i++;
        }
    }

    /**
     * Guarda las notas que están en la tabla temporal en 
     * las tablas de facturas y detalles de facturas 
     * @param array $parametros
     * @throws MyException
     */
    public function aplicarNotas(array $parametros) {
        $this->iniciarlizarFacturasNotasTemp();
        try {
            $this->conexion->beginTransaction();
            $this->procesarNotasTemp($parametros);
            if (!empty($this->listaErrores)) {
                throw new MyException('Error al aplicar las notas ', -1);
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
        }
    }

    /**
     * Se inicia el proceso de aplicar las notas que se encuentran 
     * en la tabla temporal
     * @param array $parametros
     * @throws ValidacionException
     */
    public function aplicarNotaSuscripcion(array $parametros) {
        $this->procesarNotasTemp($parametros);
        if (!empty($this->listaErrores)) {
            $validacion = new ValidacionException('Error al aplicar las notas ', -3);
            $validacion->setData($this->listaErrores);
            throw $validacion;
        }
    }

    private function procesarNotasTemp($parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $listaFacturaNotas = $this->notaCalculadaModel->getFacturasNota($idUsuario);
        if (empty($listaFacturaNotas)) {
            return;
        }
        foreach ($listaFacturaNotas as $facturaTemp) {
            try {
                $this->registrarFacturaNota($facturaTemp, $parametros);
            } catch (\Exception $e) {
                $error['idfactura'] = $facturaTemp['fac_idepadre'];
                $error['tipo'] = $facturaTemp['tipo'];
                $error['mensaje'] = $e->getMessage();
                $this->listaErrores[] = $error;
                if ($this->idPrograma == PROGRAMA_MODIFICAR_LECTURAS) {
                    throw $e;
                }
            } finally {
                $this->marcarFacturaTemp($facturaTemp);
            }
        }
        $this->procesarNotasTemp($parametros);
    }

    private function registrarFacturaNota(array $facturaTemp, $parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $cantidadDetalles = $this->notaCalculadaModel->validacionDetallesFacturasNota($idUsuario, $facturaTemp['fac_ideregistro']);
        if ($cantidadDetalles == 0) {
            return;
        }
        $infoDocumento = $this->notaCalculadaModel->infoDocumento($facturaTemp['uni_documento']);
        $infoFacturaOriginal = $this->notaCalculadaModel->getFacturaOriginal($facturaTemp['fac_idepadre'], $idUsuario);
        $segundos = strtotime('now') - strtotime($infoFacturaOriginal['fac_fecvence']);
        $diferenciaDia = intval($segundos / 60 / 60 / 24);
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($facturaTemp['dsus_ideregistr']);
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoId($infoSuscripcion['idciclo']);
        $fechas = $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
        $facturaTemp['fac_fecvence'] = $fechas['fechavencimiento'];
        $facturaTemp['fac_fecsuspens'] = $fechas['fechasuspension'];
        /**
         * Se valida que si la nota que se va a generar es una nota débito 
         * y que la factura esté vencida se procede a crear un encabezado 
         */
        if ($diferenciaDia > 0 && $infoDocumento['doc_tipo'] == 'ND') {
            $infoFacturaOriginal['fac_fecvence'] = $fechas['fechavencimiento'];
            $infoFacturaOriginal['fac_fecsuspens'] = $fechas['fechasuspension'];
            $infoFacturaOriginal['per_ideregistro'] = $cicloPeriodo['idperiodo'];
            $infoFacturaOriginal['cic_ideregistro'] = $cicloPeriodo['idciclo'];
            $infoFacturaOriginal['cic_ano'] = $cicloPeriodo['cicloanio'];
            $infoFacturaOriginal['fac_ideorigen'] = $infoFacturaOriginal['fac_ideregistro'];

            $idNuevaFactura = $this->notaCalculadaModel->insertarNuevaFactura($infoFacturaOriginal);
            /*
             * Cambio requerido por factura ción en MT 1053 para generar fac_numero a la nueva factura que se insera
             * cuando hay nota debito
             * Actualización de Facnumero de la nueva Factura
             */
            $infofacnumero['idempresa'] = $infoFacturaOriginal['emp_ideregistro'];
            $infofacnumero['iddocumento'] = $infoFacturaOriginal['uni_documento'];
            $infofacnumero['idtipodocumento'] = $infoFacturaOriginal['uni_tipdocument'];
            $infofacnumero['tipo'] = "FA";
            $infoNumero = $this->genericoModel->obtenerNumeroFactura($infofacnumero);

            $this->genericoModel->actualizarNumeroFactura($idNuevaFactura, $infoNumero['numero']);
            $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);

            $this->notaCalculadaModel->actualizarDetallesNuevaFactura($idUsuario, $facturaTemp['fac_ideregistro']);
            $facturaTemp['fac_idepadre'] = $idNuevaFactura;
            $facturaTemp['fac_ideorigen'] = $idNuevaFactura;
            $argumentos['fac_version'] = $infoFacturaOriginal['fac_version'];
        } else {
            $argumentos['fac_version'] = $infoFacturaOriginal['fac_version'] + 1;
        }
        $facturaTemp['per_ideregistro'] = $cicloPeriodo['idperiodo'];
        $facturaTemp['cic_ideregistro'] = $cicloPeriodo['idciclo'];
        $facturaTemp['cic_ano'] = $cicloPeriodo['cicloanio'];
        $infoFacturaNota = $this->notaCalculadaModel->insertarFacturaNota($facturaTemp);
        $argumentos['fac_ideregistro'] = $infoFacturaOriginal['fac_ideregistro'];
        $idNota = $this->notaCalculadaModel->insertarNota($facturaTemp, $parametros);
        /*
         * Se almanecena la sumatoria del saldoreal de la nota NS para posteriormente generar el
         * anticipo en Recaudos MT 1100
         */
        $valorAnticipo = $this->registrarDetallesFacturaNota($idNota, $infoFacturaNota['fac_ideregistro'], $facturaTemp);
        $this->genericoDelegado->actualizarFacturaSaldo($facturaTemp['fac_idepadre'], $infoFacturaOriginal['fac_version']);
        $this->notaCalculadaModel->actualizarFacturaConsultaTemp($argumentos, $idUsuario);
        $this->actualizarNumero($infoFacturaNota);
        $this->genericoDelegado->actualizarFacturaSaldo($infoFacturaNota['fac_ideregistro'], 1, 'NT');
        /**
         * Se procede a generar el anticipo de acuerdo a la información de la nota saldo a favor
         */
        if ($facturaTemp['tipo'] == 'NS' && $valorAnticipo != 0) {
            $facturaTemp['fac_vlrreal'] = $valorAnticipo;
            $this->procesarAnticipo($facturaTemp);
        }
    }

    /**
     * Registra los detalles de la nota 
     * @param type $idNota
     * @param type $idFacturaNota
     * @param type $facturaTemp
     * @return type
     * @throws MyException
     */
    private function registrarDetallesFacturaNota($idNota, $idFacturaNota, $facturaTemp) {
        $valorAnticipo = 0;
        $idUsuario = $this->sesion['idusuario'];
        $idFacturaPadre = $facturaTemp['fac_idepadre'];
        $listaDetalles = $this->notaCalculadaModel->getDetallesFacturasNota($idUsuario, $facturaTemp['fac_ideregistro']);
        if (empty($listaDetalles)) {
            throw new MyException('Error la nota no tiene detalles idfactura: ' . $facturaTemp['fac_idepadre'], -1);
        }
        foreach ($listaDetalles as $detalle) {
            /**
             * Se valida que el concepto exista si no existe se continua con el
             * siguiente registro
             */
            if ($detalle['existe'] == 'N' && $detalle['dfac_vlrtotal'] == 0) {
                continue;
            }
            if ($detalle['existe'] == 'N') {
                $detalleTemp['usu_ideregistro'] = $idUsuario;
                $detalleTemp['fac_ideregistro'] = $facturaTemp['fac_idepadre'];
                $detalleTemp['uni_concepto'] = $detalle['uni_concepto'];
                $idDetallePadre = $this->notaCalculadaModel->insertarDetallePadre($detalleTemp);
                $detalle['dfac_idepadre'] = $idDetallePadre;
                $detalle['dfac_ideorigen'] = $idDetallePadre;
            }
            if ($facturaTemp['tipo'] == 'NS') {
                //$this->procesarAnticipo($facturaTemp);
                $valorAnticipo += $detalle['dfac_sdoreal'];
                $detalle['dfac_vlrreal'] = 0;
                /*
                 * Cambio sugerido por Ing. Sandro Rosero (2017/03/15), para que no pase a 0 el valortotal del concepto
                 */
//                $detalle['dfac_vlrtotal'] = 0;
            }
            $detalle['fac_ideregistro'] = $idFacturaNota;
            $idDetalleNota = $this->notaCalculadaModel->insertarDetalleFacturaNota($detalle);
            $detalle['dfac_ideregistr'] = $idDetalleNota;
            $this->vincularNotaConFactura($detalle, $idNota, $idFacturaPadre);
        }
        return $valorAnticipo;
    }

    /**
     * Se registra la nota con las facturas que se vieron afectados
     * en el proceso 
     * @param array $detalleNota
     * @param type $idNota
     * @param type $idFacturaPadre
     */
    public function vincularNotaConFactura(array $detalleNota, $idNota, $idFacturaPadre) {
        $parametros['not_ideregistro'] = $idNota;
        $parametros['fac_ideregistro'] = $detalleNota['fac_ideregistro'];
        $parametros['fac_ideorigen'] = $idFacturaPadre;
        $parametros['dfac_ideorigen'] = $detalleNota['dfac_idepadre'];
        $parametros['dfac_ideregistr'] = $detalleNota['dfac_ideregistr'];
        $parametros['usu_ideregistro'] = $detalleNota['usu_ideregistro'];
        $this->notaCalculadaModel->insertar($parametros, 'nofa_notfactura', 'sq_nofa_ideregistr');
    }

    /**
     * Se procede a generar el anticipo 
     * @param type $facturaTemp
     * @return type
     */
    public function procesarAnticipo($facturaTemp) {
        if ($facturaTemp['fac_vlrreal'] == 0) {
            return;
        }
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($facturaTemp['dsus_ideregistr']);
        $infoFactura = $this->genericoModel->getFactura($facturaTemp['fac_idepadre']);
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($infoFactura['iddocumento'], $infoFactura['idtipodocumento'], 'AF');
        $infoRecaudo['valorpagado'] = abs($facturaTemp['fac_vlrreal']);
        $infoRecaudo['idempresa'] = $facturaTemp['emp_ideregistro'];
        $infoRecaudo['idsuscriptor'] = $facturaTemp['sus_ideregistro'];
        $infoRecaudo['idtercero'] = $facturaTemp['ter_ideregistro'];
        $infoRecaudo['iddocumento'] = $infoDocumento['iddocumento'];
        $infoRecaudo['idsucursal'] = $infoSuscripcion['idmunicipio'];
        $infoRecaudo['idusuario'] = $facturaTemp['usu_ideregistro'];
        $idRecaudo = $this->notaCalculadaModel->crearRecaudo($infoRecaudo);
        $infoRecaudo['idrecaudo'] = $idRecaudo;
        $this->procesarDistribucion($infoRecaudo, $facturaTemp);
    }

    /**
     * Se crea la distriución del nuevo anticipo 
     * @param type $infoRecaudo
     * @param type $facturaTemp
     * @return type
     */
    private function procesarDistribucion($infoRecaudo, $facturaTemp) {
        $distribucion['dire_vlrrecaudo'] = abs($infoRecaudo['valorpagado']);
        $distribucion['dire_sdorecaudo'] = abs($infoRecaudo['valorpagado']);
        $distribucion['rec_ideregistro'] = $infoRecaudo['idrecaudo'];
        $distribucion['dicn_ideregistr'] = 0;
        $distribucion['dsus_ideregistr'] = $facturaTemp['dsus_ideregistr'];
        $distribucion['uni_tipdocument'] = $facturaTemp['uni_tipdocument'];
        $distribucion['per_ideregistro'] = $facturaTemp['per_ideregistro'];
        $distribucion['cic_ideregistro'] = $facturaTemp['cic_ideregistro'];
        $distribucion['emp_ideregistro'] = $facturaTemp['emp_ideregistro'];
        $distribucion['cic_ano'] = $facturaTemp['cic_ano'];
        $distribucion['usu_ideregistro'] = $facturaTemp['usu_ideregistro'];
        return $this->notaCalculadaModel->insertar($distribucion, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Se marca la tabla temporal para que el registro 
     * sólo sea procesado una vez
     * @param type $facturaTemp
     */
    public function marcarFacturaTemp($facturaTemp) {
        if (empty($this->conexionLog)) {
            $this->conexionLog = ConexionBD::getConexion();
        }
        try {
            $this->conexionLog->beginTransaction();
            $this->notaCalculadaModel->marcarFacturaTemp($facturaTemp['fac_ideregistro'], $facturaTemp['usu_ideregistro']);
            $this->conexionLog->commit();
        } catch (\Exception $ex) {
            $this->conexionLog->rollBack();
        }
    }

    /**
     * Se deja los registros en A=Activa para que se vuelva a procesar los registros 
     * Si el usuario le da otra vez clic en procesar
     */
    private function iniciarlizarFacturasNotasTemp() {
        $idUsuario = $this->sesion['idusuario'];
        $this->notaCalculadaModel->inicializarFacturasNotasTemp($idUsuario);
    }

    /**
     * Actualiza el fac_numero de la nota que se está generando 
     * @param type $facturaNota
     */
    public function actualizarNumero($facturaNota) {
        $infoFactura['iddocumento'] = $facturaNota['uni_documento'];
        $infoFactura['idtipodocumento'] = $facturaNota['uni_tipdocument'];
        $infoFactura['idfactura'] = $facturaNota['fac_ideregistro'];
        $infoFactura['idempresa'] = $facturaNota['emp_ideregistro'];
        $infoFactura['tipo'] = 'FA';
        $this->genericoDelegado->actualizarNumeroFactura($infoFactura);
    }

    public function getErroresAplicarNota() {
        return $this->listaErrores;
    }

}
