<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\NotasAutomaticasModel;
use Llanogas\LlanogasBundle\MyException;
use Doctrine\DBAL\Connection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Llanogas\LlanogasBundle\ValidacionException;

/**
 * Clase encargada de realizar las notas automáticas directas.
 *
 * @author LeonardoRey
 */
class NotasAutomaticasDelegado {

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
        $this->notasModel = new NotasAutomaticasModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->errores = array();
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->idSuscripcion = $idSuscripcion;
        $this->idPrograma = $idPrograma;
    }

    /**
     * Se invoca desde la interfaz
     * Obtiene ciclos de la empresa logueada
     * @return array 
     */
    public function getCiclos() {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->genericoModel->consultarCiclosActivos($idEmpresa);
    }

    /**
     * Consulta el tipo de afectación que se va a realizar si es suscripción específica o es masiva.
     * Obtiene ciclos de la empresa logueada
     * @return array 
     */
    public function getTipo() {
        $idEmpresa = $this->sesion['idempresa'];
        $idUsuario = $this->sesion['idusuario'];
        return $this->genericoModel->getInformacionUnidadPorClase(CLA_TIPO_AFECTACION, $idEmpresa, $this->idPrograma, $idUsuario);
    }

    /**
     * Se invoca desde la intergaz
     * Obtiene los tipos de documentos de las facturas filtradas
     * @return array $listaTipoDocumento
     * @throws MyException
     */
    public function getTiposDocumentos() {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $parametros['idsuscripcion'] = $this->idSuscripcion;
        $listaTipoDocumento = $this->notasModel->getTiposDocumentos($parametros);
        return $listaTipoDocumento;
    }

    /**
     * Se invoca desde la interfaz
     * Obtiene los documentos posibles de las facturas y tipos de documentos seleccionado
     * @param int $idTipoDocumento
     * @return arra $listaDocumentos
     * @throws MyException
     */
    public function getDocumentos($idTipoDocumento) {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $parametros['idsuscripcion'] = $this->idSuscripcion;
        $listaDocumentos = $this->notasModel->getDocumentos($parametros);
        if (empty($listaDocumentos)) {
            throw new MyException('No existen documentos para el tipo de documento', 0);
        }
        return $listaDocumentos;
    }

    /**
     * Se invoca desde la interfaz
     * Obtiene listado de liquidaciones de una empresa
     * @return array
     */
    public function getLiquidacion($idTipoDocumento, $idDocumento) {
        $parametros['iddocumento'] = $idDocumento;
        $parametros['idtipodocumento'] = $idTipoDocumento;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idsuscripcion'] = $this->idSuscripcion;
        $parametros['idprograma'] = $this->idPrograma;
        $listaLiq = $this->notasModel->getLiquidacion($parametros);
        if (empty($listaLiq)) {
            throw new MyException('No se encontraron liquidaciones', 0);
        }
        return $listaLiq;
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
     * Se invoca desde la interfaz
     * Obtiene listado de tipo de usos de una empresa
     * @return array
     */
    public function getTipoUso() {
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idprograma'] = $this->idPrograma;
        return $this->notasModel->getTipoUso($parametros);
    }

    /**
     * Se invoca desde la interfaz
     * Filtra facturas de una suscripción o según ciclo, tipo uso y/o municipio, barrio.
     * @param array $parametros
     * @return array $listaFactura
     * @throws MyException
     */
    public function getFacturas(array $parametros) {
        $idUsuario = $this->sesion['idusuario'];
        $parametros['idusuario'] = $idUsuario;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $variacion = $parametros['meses'];
        $mesactual = date("m");
        $anioactual = date("Y");
        for ($i = 0; $i <= $variacion; $i++) {
            if ($i !== 0) {
                $mesactual = $mesactual - 1;
            }
            if ($mesactual === 0) {
                $mesactual = 12;
                $anioactual = $anioactual - 1;
            }
        }
        $parametros['meses'] = $mesactual;
        $parametros['anio'] = $anioactual;
        /* if ($mesactual > $variacion) {
          $parametros['meses'] = $mesactual - $variacion;
          $parametros['anio'] = $anioactual;
          } else {
          $parametros['meses'] = $mesactual + ( 7 - ($variacion - 5));
          $parametros['anio'] = $anioactual - 1;
          } */
        $this->validarTrabajoActual();
        $listaFactura = $this->notasModel->getFacturas($parametros);
        if (empty($listaFactura)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFactura;
    }

    /**
     * Obtiene los detalles de una factura (conceptos)
     * @param int $idfactura
     * @return array $listaConceptos
     * @throws MyException
     */
    public function getDetalleFactura($idfactura) {
        $listaConceptos = $this->notasModel->getDetalleFactura($idfactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos de la factura', 0);
        }
        return $listaConceptos;
    }

    /**
     * Obtiene los conceptos de una liquidación
     * @param int $idLiquidacion
     * @param int $tipo
     * @return array $listaConceptos
     * @throws MyException
     */
    public function getConcepto($idLiquidacion, $tipo, $tipoLiquidacion) {
        $parametros['idliquidacion'] = $idLiquidacion;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $parametros['tipoliquidacion'] = $tipoLiquidacion;
        $listaConceptos = $this->notasModel->getConcepto($parametros, $tipo);
        if (empty($listaConceptos)) {
            throw new MyException('No hay conceptos relacionados', 0);
        }
        return $listaConceptos;
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
     * Filtra facturas según documento y tipodocumento
     * @param int $doc
     * @param int $tipodoc
     * @param itn $concepto
     * @return array $listaFacturas
     * @throws MyException
     */
    public function getFacturaConFiltro($concepto) {
        $usuario = $this->sesion['idusuario'];
        $listaFacturas = $this->notasModel->getFacturaConFiltro($usuario, $concepto);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFacturas;
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

    /**
     * Obtiene el listado de los conceptos que fueron afectados y 
     * se van a exportar a un archivo de excel
     * @return array Listado de conceptos a exportar
     */
    public function getConceptosAfectadosExportar() {
        $idUsuario = $this->sesion['idusuario'];
        return $this->notasModel->getConceptosAfectadosExportar($idUsuario);
    }

    public function getConceptosOriginales() {
        return $this->notasModel->getConceptosOriginales($this->sesion['idusuario']);
    }

    public function lanzarHilos(array $argumentos, ContainerInterface &$container) {
        $idUsuario = $this->sesion['idusuario'];
        //Se eliminan las tablas temporales sí existen
        $this->notasModel->eliminarTablasTemporal($idUsuario);
        $this->marcarFacturas($argumentos['facturas']);
        $idEmpresa = $this->sesion['idempresa'];
        $idAcceso = $this->sesion['idacceso'];
        if (empty($argumentos['conceptos'])) {
            throw new MyException('Debe seleccionar al menos un campo', -1);
        }
        $conceptos = json_encode(json_encode($argumentos['conceptos']));
        //Directa
        $tipoNota = 'D';
        $idLiquidacion = $argumentos['idliquidacion'];
        if (!is_numeric($idLiquidacion)) {
            throw new MyException('Error la liquidación es obligatoria', -1);
        }
        $this->consultarProceso();
        $reclamacion = $argumentos['reclamacion'];
        $tipocontabilidad = $argumentos['tipocontabilidad'];
        for ($i = 0; $i < NUMERO_HILOS_NOTAS_AUTOMATICAS_DIRECTA; $i++) {
            $parametros = "$idEmpresa $idAcceso $conceptos $tipoNota $i $idLiquidacion $reclamacion $tipocontabilidad " . RUTA_PRINCIPAL;
            $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoNotasAutomaticas.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/notas_automaticas_factura_$i.log &";
            \Llanogas\LlanogasBundle\Utiles\Util::ejecutarHilo($script);
        }
    }

    /**
     * Método invocado desde el proceso de notas automáticas
     * @param array $parametros
     * @return type Listado de errores que se han producido
     */
    public function procesarFacturas(array $parametros, array $listaFacturas) {
        $this->parametros = $parametros;
        $idUsuario = $this->sesion['idusuario'];
        $this->imprimirMensajePrint("Lista facturas");
        $this->imprimirMensajePrint($listaFacturas);
        //Se recorren las facturas que se quieren procesar
        foreach ($listaFacturas as $factura) {
            try {
                $this->conexion->beginTransaction();
                //Se consulta la información de la factura en la tabla temporal
                $infoFacturaTemporal = $this->notasModel->consultarPorFacturaTemporal($factura['idfactura'], $idUsuario);
                $infoFacturaTemporal['numeroproceso'] = $parametros['numeroproceso'];
                //Se valida que la factura exista
                if (empty($infoFacturaTemporal)) {
                    $mensaje = "Error la factura " . $factura['idfactura'] . " no se encuentra \n";
                    $this->marcarFacturas($factura['idfactura'], -1, $mensaje);
                    print($mensaje);
                    $this->conexion->rollBack();
                    continue;
                }
                //Se valida que tipo de nota se quiere procesar si es (Nota calculo) o (Nota Directa) 
                $this->validarNotaDirecta($parametros, $infoFacturaTemporal);
                $this->conexion->commit();
                $mensaje = 'Nota procesada correctamente';
                $this->marcarFacturas($factura['idfactura'], 2, $mensaje);
            } catch (\Exception $e) {
                $mensaje = "Error procesando la factura " . $factura['idfactura'] . ' ' . $e->getMessage();
                $this->imprimirMensajePrint($mensaje . "\n");
                $this->conexion->rollBack();
                $this->marcarFacturas($factura['idfactura'], -1, $mensaje);
            }
            $this->aumentarCantidadRegistro();
        }
        return $this->errores;
    }

    /**
     * Verifica el tipo de nota que se va a generar 
     * @param array $parametros Criterios del proceso que se envían desde la interfaz
     * @param type $infoFacturaTemporal información de la factura en la tabla temporal
     */
    private function validarNotaDirecta(array &$parametros, &$infoFacturaTemporal) {
        $idSuscripcion = $infoFacturaTemporal['idsuscripcion'];
        //Lista de conceptos que se quiere modificar se ingresan en la interfaz
        //Consultar información de una suscripción
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($idSuscripcion);
        //Se valida si el tipo de nota a generar es nota directa (D) o nota calculo (C)
        $listaConceptosNota = $parametros['conceptos'];
        print("Procesando tipo de nota directa\n");
        //Se procede crear las notas
        $this->procesarFacturaNota($infoFacturaTemporal, $listaConceptosNota, $infoSuscripcion);
    }

    /**
     * Se procesa la nota de acuerdo a los parámetros de entrada
     * @param array $infoFacturaTemporal Información de la factura que está en la tabla temporal
     * @param array $listaConceptosNota Lista de los conceptos a los que se le va hacer la nota 
     * (son los conceptos que sean seleccionado en la interfaz)
     * @param array $infoSuscripcion Toda la información de la suscripción
     * @throws MyException Si no se puede realizar la acción sobre el concepto
     */
    public function procesarFacturaNota(array &$infoFacturaTemporal, array &$listaConceptosNota, array &$infoSuscripcion) {
        $infoFacturaReal = $this->genericoModel->getFactura($infoFacturaTemporal['idfactura']);
        $listaConceptosFactura = $this->genericoModel->getConceptos($infoFacturaTemporal['idfactura']);
        //Se guardan los conceptos que van a pertenecer a una nota de tipo crédito
        $infoConceptosNotaCredito = array();
        //Se guardan los conceptos que van a pertenecer a una nota de tipo débito
        $infoConceptosNotaDebito = array();
        //Se guardan los conceptos que van a pertenecer a una nota de tipo saldo a favor
        $infoConceptosNotaSaldo = array();
        foreach ($listaConceptosNota as $conceptoNota) {
            $conceptoExiste = 0;
            //Se recorren los conceptos de la factura original
            foreach ($listaConceptosFactura as $conceptoFactura) {
                $idConcepto = $conceptoNota['idconcepto'];
                $idFactura = $conceptoFactura['idfactura'];
                //Si el concepto de la factura es diferente con respecto al concepto de la interfaz
                //Se continua con el siguiente concepto
                if ($conceptoNota['idconcepto'] != $conceptoFactura['idconcepto']) {
                    continue;
                }
                //Se verifica que si ingresaron conceptos informativos al concepto que se le va a generar una nota
                if (isset($conceptoNota['conceptosinformativos'])) {
                    $conceptoFactura['conceptosinformativos'] = $conceptoNota['conceptosinformativos'];
                }
                $conceptoExiste = 1;
                $conceptoFactura['existe'] = $conceptoExiste;
                $valorNota = round($conceptoNota['valor'], CANTIDAD_DECIMALES);
                //Se verifica que tipo de nota se va a generar si es positivo se genera una nota débito
                if ($valorNota > 0) {
                    $conceptoFactura['valornota'] = $valorNota;
                    $infoConceptosNotaDebito[] = $conceptoFactura;
                    continue;
                }
                //El valor nota en éste momento es un valor negativo
                //Por tal motivo se hace la operación de la suma
                $valorNotaSaldo = round($conceptoFactura['saldo'] + $valorNota, CANTIDAD_DECIMALES);
                $this->imprimirMensajePrint("Factura: $idFactura Concepto: $idConcepto Valor Nota: $valorNotaSaldo \n");

                /**
                 * De acuerdo a la última modificación para poder realizar una nota crédito saldo a favor
                 * el saldo del concepto debe estar en 0 para que se pueda distribuir los conceptos 
                 * informativos entre la nota crédito y la nota saldo a favor
                 */
                if ($valorNotaSaldo < 0 && $conceptoFactura['saldo'] > 0) {
                    throw new MyException('Para poder generar el saldo a favor el concepto no debe tener saldo ' . $conceptoFactura['idconcepto'] . ' ' . $conceptoFactura['concepto'], -1);
                }
                //Si el valor es menor significa que se va a generar una nota saldo a favor 
                if ($valorNotaSaldo < 0) {
                    $conceptoFactura['valornota'] = $valorNotaSaldo;
                    $infoConceptosNotaSaldo[] = $conceptoFactura;
                }
                //Se dice que la nota a generar es crédito
                $valorNota = ($valorNotaSaldo < 0) ? $conceptoFactura['saldo'] : $valorNota;
                if ($valorNota != 0) {
                    $conceptoFactura['valornota'] = abs($valorNota) * -1;
                    $infoConceptosNotaCredito[] = $conceptoFactura;
                }
            }
            if ($conceptoExiste == 0 && $conceptoNota['valor'] <= 0 && $this->parametros['reclamacion'] == 'S') {
                throw new MyException('Error no se puede quitar el concepto ' . $conceptoNota['idconcepto'] . ' factura: ' . $infoFacturaTemporal['idfactura'], -1);
            }
            //Se verifica que si la factura inicial contiene el concepto
            if ($conceptoExiste == 0 && $conceptoNota['valor'] >= 0) {
                $conceptoNota['idfactura'] = $infoFacturaTemporal['idfactura'];
                $conceptoNota['existe'] = $conceptoExiste;
                $conceptoNota['valornota'] = $conceptoNota['valor'];
                $infoConceptosNotaDebito[] = $conceptoNota;
                continue;
            }
            if ($conceptoExiste == 0) {
                $conceptoNota['idfactura'] = $infoFacturaTemporal['idfactura'];
                $conceptoNota['existe'] = $conceptoExiste;
                $conceptoNota['valornota'] = $conceptoNota['valor'];
                $infoConceptosNotaSaldo[] = $conceptoNota;
                continue;
            }
        }

        //Se crea la nota de saldo a favor cuando el concepto tiene un abono 
        if (!empty($infoConceptosNotaSaldo) && $this->parametros['reclamacion'] == 'N') {

            $tipoNota = $this->validarNotaCreditoSaldoFavor($infoConceptosNotaSaldo, $listaConceptosFactura, $this->parametros['tipoContabilidad']);

            $idTempFactura = $this->crearFacturaNotaTemporal($infoFacturaReal, $infoSuscripcion, $tipoNota);
            $this->generarConceptosInformativos($tipoNota, $idTempFactura, $infoConceptosNotaSaldo, $listaConceptosFactura, $infoFacturaReal);
            $this->crearDetalleNotaTemporal($tipoNota, $infoConceptosNotaSaldo, $idTempFactura);
            $infoFacturaReal['version'] = $infoFacturaReal['version'] + 1;
        }
        //Se crea la factura de nota Débito
        if (!empty($infoConceptosNotaDebito)) {

            $idTempFactura = $this->crearFacturaNotaTemporal($infoFacturaReal, $infoSuscripcion, 'ND');
            $this->generarConceptosInformativos('ND', $idTempFactura, $infoConceptosNotaDebito, $listaConceptosFactura, $infoFacturaReal);
            $this->crearDetalleNotaTemporal('ND', $infoConceptosNotaDebito, $idTempFactura);
            $infoFacturaReal['version'] = $infoFacturaReal['version'] + 1;
        }
        //Se crea la factura de nota Crédito
        if (!empty($infoConceptosNotaCredito)) {
            $tipoNota = ($this->parametros['reclamacion'] == 'S') ? "NR" : "NC";
            $idTempFactura = $this->crearFacturaNotaTemporal($infoFacturaReal, $infoSuscripcion, $tipoNota);
            $this->generarConceptosInformativos('NC', $idTempFactura, $infoConceptosNotaCredito, $listaConceptosFactura, $infoFacturaReal);
            $this->crearDetalleNotaTemporal('NC', $infoConceptosNotaCredito, $idTempFactura);
            $infoFacturaReal['version'] = $infoFacturaReal['version'] + 1;
        }
    }

    /**
     * Se agrega funcionalidad de incluirles conceptos informativos al momento de 
     * realizar una nota directa
     * @param type $tipo si es una nota 'NC','ND', 'NS'
     * @param type $idTempFactura idfactura de la tabla temporal
     * @param type $listaConceptosNota la lista de los conceptos de la nota que se va a registrar 
     * @param type $listaConceptosFactura lista de los conceptos de la factura original o inicla
     * @param type $infoFacturaReal información de la factura inicial u origial 
     */
    private function generarConceptosInformativos($tipo, $idTempFactura, $listaConceptosNota, $listaConceptosFactura, $infoFacturaReal) {
        foreach ($listaConceptosNota as $listaConceptoNotaInformativos) {
            if (!isset($listaConceptoNotaInformativos['conceptosinformativos'])) {
                continue;
            }
            print_r('Tipo ' . $tipo . "\n");
            print_r($listaConceptoNotaInformativos['conceptosinformativos']);
            foreach ($listaConceptoNotaInformativos['conceptosinformativos'] as $conceptoNota) {
                //Se valida que hayan conceptos informativos para el concepto
                $existe = 0;
                $infoConceptoFactura = array();
                foreach ($listaConceptosFactura as $conceptoFactura) {
                    /**
                     * Se valida que el concepto informativo exista en la factura real u original
                     */
                    if ($conceptoNota['idconcepto'] == $conceptoFactura['idconcepto'] && $conceptoFactura['operacion'] == 'I') {
                        $existe = 1;
                        $infoConceptoFactura = $conceptoFactura;
                        break;
                    }
                }
                $conceptoNota['iddetallefactura'] = null;
                /**
                 * Si el concepto existe se debe de asignar el dfac_idepadre y dfac_ideorigen
                 */
                if ($existe == 1) {
                    $conceptoNota['iddetallefactura'] = $infoConceptoFactura['iddetallefactura'];
                }
                $detalle["dfac_ideregistr"] = $conceptoNota['iddetallefactura'];
                $detalle["dfac_estado"] = 'A';
                $detalle["dfac_ideorigen"] = $conceptoNota['iddetallefactura'];
                $detalle["dfac_cantidad"] = 1;
                $detalle["dfac_vlrunitari"] = abs($conceptoNota['valor']);
                $detalle["dfac_vlrtotal"] = abs($conceptoNota['valor']);
                $detalle["dfac_vlrreal"] = 0;
                $detalle["dfac_sdoreal"] = 0;
                $detalle["fac_ideregistro"] = $infoFacturaReal['idfactura'];
                $detalle["uni_concepto"] = $conceptoNota['idconcepto'];
                $detalle["dfac_idepadre"] = $conceptoNota['iddetallefactura'];
                $detalle["usu_ideregistro"] = $this->sesion['idusuario'];
                $detalle["operacion"] = $tipo;
                $detalle["existe"] = $existe;
                $detalle["idtempfactura"] = $idTempFactura;
                //Se inserta el detalle en la tabla temporal
                $this->notasModel->insertar($detalle, 'temp_directa_detalle', NULL);
            }
        }
    }

    public function getFacturasHilo($idHilo) {
        return $this->notasModel->getFacturasHilo($idHilo, $this->sesion['idusuario']);
    }

    /**
     * Crea la factura temporal dependiendo de la información de la interfaz y
     * la factura almacenada
     * @param array $facturaOriginal información de la factura que se quiere afectar
     * @param array $infoSuscripcion información de la suscripción
     * @param type $tipoNota ND Nota débito o NC Nota crédito
     */
    private function crearFacturaNotaTemporal(array $facturaOriginal, array $infoSuscripcion, $tipoNota) {
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
        $factura['fac_idepadre'] = $facturaOriginal['idfactura'];
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
        $this->notasModel->insertar($factura, "temp_directa_factura", NULL);
        return $idTempFactura;
    }

    /**
     * @param type $tipoNota 
     * @param array $listaConceptos listados de conceptos que se quieren crear
     */
    private function crearDetalleNotaTemporal($tipoNota, array $listaConceptos, $idTempFactura) {
        $idUsuario = $this->sesion['idusuario'];
        foreach ($listaConceptos as $concepto) {
            $this->imprimirMensajePrint($concepto);
            /**
             * Si el concepto no existe se elimina los campos de dfac_idepadre y dfac_ideorigen
             */
            if ($concepto['existe'] === 0) {
                $concepto['iddetallefactura'] = NULL;
                $concepto['saldo'] = 0;
            }
            $valorNotas = $concepto['valornota'];
            if ($tipoNota == 'NS' || $tipoNota == 'SD' || $tipoNota == 'SC' || $tipoNota == 'SE') {
                $valorNotas = 0;
            }

            $detalle["dfac_ideregistr"] = $concepto['iddetallefactura'];
            $detalle["dfac_estado"] = 'A';
            $detalle["dfac_ideorigen"] = $concepto['iddetallefactura'];
            $detalle["dfac_cantidad"] = 1;
            $detalle["dfac_vlrunitari"] = abs($concepto['valornota']);
            $detalle["dfac_vlrtotal"] = abs($concepto['valornota']);
            $detalle["dfac_vlrreal"] = $valorNotas;
            $detalle["dfac_sdoreal"] = $valorNotas;
            $detalle["fac_ideregistro"] = $concepto['idfactura'];
            $detalle["uni_concepto"] = $concepto['idconcepto'];
            $detalle["dfac_idepadre"] = $concepto['iddetallefactura'];
            $detalle["usu_ideregistro"] = $idUsuario;
            $detalle["operacion"] = $tipoNota;
            $detalle["existe"] = $concepto['existe'];
            $detalle["idtempfactura"] = $idTempFactura;
            $this->notasModel->insertar($detalle, 'temp_directa_detalle', NULL);
        }
        $this->notasModel->actualizarSaldo($idUsuario, $idTempFactura);
    }

    /**
     * Se registra el proceso en la tabla cpr
     */
    public function registrarProceso() {
        $proceso['estado'] = 'A';
        $proceso['fechaInicio'] = 'now()';
        $proceso['idPrograma'] = $this->idPrograma;
        $proceso['idAcceso'] = $this->sesion['idacceso'];
        $proceso['idEmpresa'] = $this->sesion['idempresa'];
        $proceso['idHilo'] = 1;
        $this->idProceso = $this->procesoModel->insertarProceso($proceso);
    }

    /**
     * se inactiva el proceso 
     */
    public function finalizarProceso() {
        $this->procesoModel->finalizarProceso($this->idProceso);
    }

    /**
     * Se marca el registro en la tabla temporal 
     * @param type $facturas información del registro que se está procesando 
     * @param type $procesado 1= procesado , -2 hubo un error al realizar la nota
     * @param type $mensaje
     */
    public function marcarFacturas($facturas, $procesado = 1, $mensaje = '-') {
        try {
            $this->conexion->beginTransaction();
            $this->notasModel->marcarFacturas($facturas, $this->sesion['idusuario'], $procesado, $mensaje);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->imprimirMensajePrint($e);
            $this->conexion->rollBack();
        }
    }

    /**
     * Se aumenta los registros procesados en el cpr
     */
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

    /**
     * Método encargado de colocar en firme los campos que están en la tabla temporal
     * y pasarlos en la tablas de facturas y detalles de facturas
     * @param array $parametros llega el motivo, la descripción
     * @return type
     */
    public function aplicarNotas(array $parametros) {
        $this->parametros = $parametros;
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
                    $facturaNota = $this->crearFactura($infoFacturaNota);
                    $idNota = $this->notasModel->insertarNota($infoFacturaNota, $parametros);
                    $this->aplicarNotasDetalles($facturaNota, $detallesNota, $idNota);
                    $this->actualizarFacturas($facturaNota, $infoFacturaNota);
                    $this->notasModel->actualizarFacturaTemporal($infoFacturaNota['idtempfactura'], $idUsuario);
                
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
                    $error['idfactura'] = $infoFacturaNota['fac_ideregistro'];
                    $error['mensaje'] = $e->getMessage();
                    $this->listaErrores[] = $error;
                    $this->conexion->rollBack();
                    $this->notasModel->actualizarFacturaTemporal($infoFacturaNota['idtempfactura'], $idUsuario, 'E');
        }    
        $this->aplicarNotas($parametros);
    }

    /**
     * 
     * @param type $infoFacturaNota
     * @return type
     */
    private function crearFactura(&$infoFacturaNota) {
        try {
            $facturaOriginal = $this->genericoModel->getFactura($infoFacturaNota['fac_ideregistro']);
            $segundos = strtotime('now') - strtotime($facturaOriginal['fechavencimiento']);
            $diferenciaDia = intval($segundos / 60 / 60 / 24);
            /**
             * Se valida si la nota que se va a generar es débito 
             * y si la factura ya está vencida se genera un nuevo encabezado de facturas 
             */
            if (($infoFacturaNota['operacion'] == 'ND' && $diferenciaDia > 0) || ($infoFacturaNota['operacion'] == 'ND' && $facturaOriginal['fac_estado'] == 'F')) {
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
                $facturaOriginal['estado'] = 'A';
                $idFacturaEncabezado = $this->genericoModel->insertarFactura($facturaOriginal);
                /*
                 * Actualización de Facnumero de la nueva Factura
                 */

                $infoFacturaNota['fac_ideregistro'] = $idFacturaEncabezado;
                $infoFacturaNota['fac_version'] = 1;
                //Indica que se va  a crear un nuevo encabezado de factura para que cuando 
                //Se genere no salga la nota vencida y éste parámetro se valida al momento de generar 
                //Los detalles para generarlo al nuevo encabezado o a la factura inicial
                $this->parametros['nueva'] = TRUE;
            }
            $infoFacturaNota['fac_estado'] = ($infoFacturaNota['operacion'] == 'NR') ? "R" : "A";
            $facturaNota = $this->notasModel->crearFactura($infoFacturaNota);
            return $facturaNota;
        } catch (\Exception $exp) {
            print_r($exp);
            throw new MyException('Error, Comuniquese con personal Tecnico', -1);
        }
    }

    private function getFechaFactura($infoSuscripcion, $cicloPeriodo) {
        return $this->genericoDelegado->getFechaFactura($infoSuscripcion, $cicloPeriodo);
    }

    /**
     * Si el usuario vuelve a realizar una búsqueda se inicializa el estado de la nota 
     */
    public function reiniciarFacturasTemporales() {
        $idUsuario = $this->sesion['idusuario'];
        $this->actualizarFechaNotas();
        $this->notasModel->reiniciarFacturaTemporal($idUsuario, 'A');
    }

    /**
     * Aplica los detalles de la nota
     * @param array $facturaNota información de la nota 
     * @param array $detallesNota detalles de la nota que están en la tabla temporal
     * @param type $idNota
     */
    private function aplicarNotasDetalles(array &$facturaNota, array &$detallesNota, $idNota) {
        foreach ($detallesNota as $detalle) {
            // $this->parametros['nueva'] Indica que se va  a crear un nuevo encabezado de factura
            if ($detalle['existe'] == 0 || ($this->parametros['nueva'] && $detalle['operacion'] == 'ND')) {
                $detalleNuevo = $this->procesarDetalleNoExiste($detalle, $facturaNota);
                $detalle['dfac_ideorigen'] = $detalleNuevo['dfac_ideregistr'];
                $detalle['dfac_idepadre'] = $detalleNuevo['dfac_ideregistr'];
            }
            /**
             * Si la nota es saldo a favor se procede a generar el anticipo
             */
            if ($detalle['operacion'] == 'NS' || $detalle['operacion'] == 'SD' || $detalle['operacion'] == 'SC' || $detalle['operacion'] == 'SE') {
                $valorNota = $detalle['dfac_vlrtotal'];
                $infoConcepto = $this->notasModel->consultarInfoConcepto($detalle['uni_concepto']);
                //Se valida que el concepto a generar el anticipo no se informativo
                //Si es afirmativo se continua con el siguiente concepto
                if ($infoConcepto['operacion'] == 'S') {
                    $this->procesarRecaudoAnticipo($facturaNota, $valorNota);
                }
            }
            $detalle['fac_ideregistro'] = $facturaNota['fac_ideregistro'];
            $detalleNota = $this->notasModel->crearDetalleFactura($detalle);
            $this->notasModel->asignarNotaFactura($detalleNota, $idNota, $facturaNota['fac_idepadre']);
        }
    }

    /**
     * Si en la factura no existe el concepto, se procede a crear el concepto en 0
     * @param type $concepto información del concepto
     * @param type $facturaNota 
     * @return type
     */
    private function procesarDetalleNoExiste($concepto, &$facturaNota) {
        $tipoOperacion = $this->genericoModel->consultarTipoConcepto($concepto['uni_concepto']);
        $infoDetalle['dfac_cantidad'] = 1;
        $infoDetalle['dfac_vlrunitari'] = $tipoOperacion['operacion'] == 'I' ? $concepto['dfac_vlrunitari'] : 0 ;
        $infoDetalle['dfac_vlrtotal'] = 0 ;
        $infoDetalle['dfac_vlrreal'] = 0;
        $infoDetalle['dfac_sdoreal'] = 0;
        $infoDetalle['dfac_idepadre'] = null;
        $infoDetalle['dfac_ideorigen'] = null;
        $infoDetalle['fac_ideregistro'] = $facturaNota['fac_idepadre'];
        $infoDetalle['uni_concepto'] = $concepto['uni_concepto'];
        $infoDetalle['usu_ideregistro'] = $concepto['usu_ideregistro'];
        return $this->notasModel->crearDetalleFactura($infoDetalle);
    }

    /**
     * Consula los motivos por el cual se está realizando la nota
     * @return array Lista de los motivos
     */
    public function obtenerMotivos() {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->notasModel->obtenerMotivos($idEmpresa);
    }

    /**
     * Se genera el anticipo cuando el valor de la nota es superior 
     * al valor de la factura
     * @param array $facturaNota
     * @param type $valorTotalNota
     */
    public function procesarRecaudoAnticipo(array &$facturaNota, $valorTotalNota) {
        $valorNota = abs($valorTotalNota);
        $infoFacturaOriginal = $this->genericoModel->getFactura($facturaNota['fac_idepadre']);
        $infoSuscripcion = $this->genericoModel->consultarInformacionSuscripcion($infoFacturaOriginal['idsuscripcion']);
        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($infoFacturaOriginal['iddocumento'], $infoFacturaOriginal['idtipodocumento'], 'AF');
        $infoRecaudo['valorpagado'] = $valorNota;
        $infoRecaudo['idempresa'] = $infoFacturaOriginal['idempresa'];
        $infoRecaudo['idsuscriptor'] = $infoFacturaOriginal['idsuscriptor'];
        $infoRecaudo['idtercero'] = $infoFacturaOriginal['idtercero'];
        $infoRecaudo['iddocumento'] = $infoDocumento['iddocumento'];
        $infoRecaudo['idsucursal'] = $infoSuscripcion['idmunicipio'];
        $infoRecaudo['idusuario'] = $facturaNota['usu_ideregistro'];
        $idRecaudo = $this->notasModel->crearRecaudo($infoRecaudo);
        $idDistribucionRecaudo = $this->procesarDistribucion($idRecaudo, $infoSuscripcion, $facturaNota, $valorNota);
        //Se registra que factura que recaudo genera
        $this->asignarFacturaRecaudo($facturaNota, $idDistribucionRecaudo);
    }

    /**
     * Genera la distribución del anticipo cuando la factura se está haciendo una nota 
     * saldo a favor
     * @param type $idRecaudo identificador del recaudo
     * @param type $infoSuscripcion información de la suscripción 
     * @param type $facturaNota información de la nota 
     * @param type $valorNota valor del anticipo 
     * @return type resultado de la transacción
     */
    private function procesarDistribucion($idRecaudo, $infoSuscripcion, &$facturaNota, $valorNota) {
        $distribucion['dire_vlrrecaudo'] = $valorNota;
        $distribucion['dire_sdorecaudo'] = $valorNota;
        $distribucion['rec_ideregistro'] = $idRecaudo;
        $distribucion['dicn_ideregistr'] = 0;
        $distribucion['dsus_ideregistr'] = $infoSuscripcion['idsuscripcion'];
        $distribucion['uni_tipdocument'] = $facturaNota['uni_tipdocument'];
        $distribucion['per_ideregistro'] = $facturaNota['per_ideregistro'];
        $distribucion['cic_ideregistro'] = $facturaNota['cic_ideregistro'];
        $distribucion['emp_ideregistro'] = $facturaNota['emp_ideregistro'];
        $distribucion['cic_ano'] = $facturaNota['cic_ano'];
        $distribucion['usu_ideregistro'] = $facturaNota['usu_ideregistro'];
        return $this->notasModel->insertar($distribucion, 'dire_disrecaudo', 'sq_dire_ideregistr');
    }

    /**
     * Se asigna al anticipo generado de cuál factura se originó 
     * el recaudo
     * @param array $facturaNota información de la factura origen
     * @param type $idDistribucionRecaudo Número de la distribución
     */
    private function asignarFacturaRecaudo(array &$facturaNota, $idDistribucionRecaudo) {
        $facturaRecaudo['fac_ideregistro'] = $facturaNota['fac_ideregistro'];
        $facturaRecaudo['dsus_ideregistr'] = $facturaNota['dsus_ideregistr'];
        $facturaRecaudo['dire_ideregistr'] = $idDistribucionRecaudo;
        $facturaRecaudo['emp_ideregistro'] = $facturaNota['emp_ideregistro'];
        $facturaRecaudo['usu_ideregistro'] = $facturaNota['usu_ideregistro'];
        $facturaRecaudo['fare_movimiento'] = 'O';
        $this->notasModel->insertar($facturaRecaudo, 'fare_facrecaudo', 'sq_fare_ideregistr');
    }

    /**
     * Método encargado de asignarles el número de nota 
     * a la factura 
     * @param type $facturaNota
     * @param type $infoFacturaNota
     */
    public function actualizarFacturas($facturaNota, $infoFacturaNota) {

        $facturaNota['iddocumento'] = $facturaNota['uni_documento'];
        $facturaNota['idempresa'] = $facturaNota['emp_ideregistro'];
        $facturaNota['idtipodocumento'] = $facturaNota['uni_tipdocument'];
        $facturaNota['tipo'] = 'FA';





        /*
         * 1.  Se evalua si pertenece a factura electronica         * 
         */
        try {

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
                } else
                if ($this->parametros['nueva']) {
                    $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaNota['iddocumento'], $facturaNota['idtipodocumento'], 'XF');
                    $facturaNota['iddocumento'] = $infoDocumento['iddocumento'];
                    $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
                    $this->genericoModel->actualizarDocumentoEspejoFactura($facturaNota['fac_ideregistro'], $facturaNota['iddocumento']);
                    $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
                    $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
                    $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['fac_idepadre'], $infoFacturaNota['fac_version']);
                } else {
                    $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
                }
            } else {
                $this->actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota);
            }

            if ($this->parametros['nueva']) {
                $facturaOriginal = $this->genericoModel->consultarFactura($facturaNota['fac_idepadre']);
                $facturaOriginal['tipo'] = "FA";
                $facturaOriginal['fac_ideregistro'] = $facturaNota['fac_idepadre'];
                /*
                 * 1.  Se evalua si pertenece a factura electronica         * 
                 */
                $aplicaFelec = $this->genericoModel->getDataEvaluaFacturaElectronica($facturaOriginal, 1);
                //  print_r($facturaNuevaVencida);
                if (!empty($aplicaFelec['aplicafelec'])) { // pertenece a factura electronica
                    $this->genericoModel->actualizaVlrDetalleNewFactura($facturaNota['fac_idepadre']);
                    /*
                     * 1.1 si pertenece, se evalua si los conceptos de la nota que son de factura electronica la sumatoria es mayor a cero
                     * 1.1.1 si es igual a cero se pone el documento espejo y se actualiza factura numero segun el nudo
                     * 1.1.2 si es diferente o mayor se deja el proceso normal
                     */
                    $valorAplicaFelectronica = $this->genericoModel->getValorNotaFacturaElectronica($facturaOriginal, 1);
                    if ($valorAplicaFelectronica['totfac'] == 0 || empty($valorAplicaFelectronica['totfac'])) {
                        $infoDocumento = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['iddocumento'], $facturaOriginal['idtipodocumento'], 'XF');
                        $facturaOriginal['iddocumento'] = $infoDocumento['iddocumento'];
                        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaOriginal);
                        $this->genericoModel->actualizarDocumentoEspejoFactura($facturaOriginal['fac_ideregistro'], $facturaOriginal['iddocumento']);
                        $this->genericoModel->actualizarNumeroFactura($facturaOriginal['fac_ideregistro'], $infoNumero['numero']);
                        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
                    } else {
                        $this->actualizaFacturaSinDocumentoEspejoSinSaldo($facturaOriginal);
                    }
                } else {
                    $this->actualizaFacturaSinDocumentoEspejoSinSaldo($facturaOriginal);
                }
            }
        } catch (\Exception $e) {
            print_r($e->getMessage());
            $this->conexion->rollBack();
            throw new Exception($e->getMessage(), $e->getCode());
        }
    }

    public function actualizaFacturaSinDocumentoEspejo($facturaNota, $infoFacturaNota) {
        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
        $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
        $this->genericoDelegado->actualizarFacturaSaldo($facturaNota['fac_idepadre'], $infoFacturaNota['fac_version']);
    }

    public function actualizaFacturaSinDocumentoEspejoSinSaldo($facturaNota) {
        $infoNumero = $this->genericoModel->obtenerNumeroFactura($facturaNota);
        $this->genericoModel->actualizarNumeroFactura($facturaNota['fac_ideregistro'], $infoNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
    }

    /**
     * Método encargado de devolver la lista de errores para que sean mostradas
     * en la interfaz de usuario
     * @return array lista de errores que generó la ejecución del programa
     */
    public function getListaErrores() {
        return $this->listaErrores;
    }

    /**
     * Método encargado de validar si las notas generaron error
     * @return type
     * @throws MyException
     */
    public function getErroresNotas() {
        $idUsuario = $this->sesion['idusuario'];
        $listaErrores = $this->notasModel->getErroresNotas($idUsuario);
        if (empty($listaErrores)) {
            throw new MyException('Se generaron correctamente las notas', 0);
        }
        return $listaErrores;
    }

    /**
     * Se elimina la información de las tablas temporales 
     * del usuario que se encuentre en sesión
     */
    public function eliminarTablas() {
        try {
            $idUsuario = $this->sesion['idusuario'];
            $this->notasModel->eliminarTablas($idUsuario);
        } catch (\Exception $e) {
            $e->getMessage();
        }
    }

    /**
     * Método encargado de mostrar o imprimir el mensaje en el archivo 
     * log del hilo
     * @param String $mensaje
     */
    public function imprimirMensajePrint($mensaje) {
        //Se valida que la ejecución del programa genere log
        if ($this->imprimir == true) {
            print_r($mensaje);
        }
    }

    /**
     * Actualiza las fechas de las facturas en la tabla temporal del usuario
     */
    public function actualizarFechaNotas() {
        $data['fac_fecha'] = 'now()';
        $idUsuario = $this->sesion['idusuario'];
        $this->notasModel->actualizar($data, 'temp_directa_factura', 'usu_ideregistro=' . $idUsuario);
    }

    /**
     * Método encargado de validar si el usuario tiene un registro de facturas en la tabla temporal
     * Si es afirmativo se lanza una excepción con el error que se produjo
     */
    public function validarTrabajoActual() {
        $idUsuario = $this->sesion['idusuario'];
        $this->notasModel->validarInformacionTemporal($idUsuario);
    }

    /**
     * Consulta los conceptos realacionados 
     * @param int $idLiquidacion identificador de la liquidación que tiene la factura que se está generando la nota 
     * @param int $idConcepto identificador del concepto principal al que se le está haciendo la nota
     * @param string $idsConceptosVinculados ids de conceptos separados por comas
     * @return type
     */
    public function consultarConceptosRelacionados($idLiquidacion, $idConcepto, $idsConceptosVinculados, $idLiquidacionFactura) {
        $parametros['idprograma'] = PROGRAMA_NOTA_DIRECTA;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idliquidacion'] = $idLiquidacion;
        $parametros['idconcepto'] = $idConcepto;
        $parametros['idliquidacionfactura'] = $idLiquidacionFactura;
        $parametros['idsconceptosvinculados'] = $idsConceptosVinculados;
        return $this->notasModel->consultarConceptosRelacionados($parametros);
    }

    public function validarNotaCreditoSaldoFavor($infoConceptosNotaSaldo, $listaConceptosFactura, $claseContotableSaldoFavor = null) {

        $tipoNota = 'NS';
        $cambioEstrato = '';
        $errorLectura = '';
        if (!empty($claseContotableSaldoFavor)) {

            if ($claseContotableSaldoFavor == 'EL') {
                $tipoNota = 'SC';
            }
            if ($claseContotableSaldoFavor == 'CE') {
                foreach ($infoConceptosNotaSaldo as $listaConceptoNotaInformativos) {
                    print_r($listaConceptoNotaInformativos['conceptosinformativos']);
                    foreach ($listaConceptoNotaInformativos['conceptosinformativos'] as $conceptoNota) {

                        foreach ($listaConceptosFactura as $conceptoFactura) {

                            if ($conceptoNota['idconcepto'] == 36 && $conceptoNota['idconcepto'] == $conceptoFactura['idconcepto'] && $conceptoNota['valor'] != $conceptoFactura['valortotal']) {
                                $estratoFacturaSuscripcion = $this->notasModel->getEstratoFacturaSuscripcion($conceptoFactura['idfactura']);
                                if ($estratoFacturaSuscripcion['estrato_factura'] == 2 && $estratoFacturaSuscripcion['estrato_suscripcion'] == 1) {
                                    $tipoNota = 'SE'; // nota credito saldo a favor por estrato de cr_2_1 
                                    return $tipoNota;
                                }
                                $tipoNota = 'SD';
                                /*  $tipoNota = $conceptoNota['valor'] > $conceptoFactura['valortotal']  ? 'SD' : 'SC'; */
                                print_r($conceptoNota['valor'] . ' > ' . $conceptoFactura['valortotal'] . '\n');
                                print_r('Tipo ' . $tipoNota . "\n");
                                return $tipoNota;
                            }
                        }
                    }
                }
            }
        }
        print_r('Tipo ' . $tipoNota . "\n");
        return $tipoNota;
    }
    
    /**
     * Se invoca desde la intergaz
     * Obtiene los tipos de documentos de las facturas filtradas
     * @return array $listaTipoDocumento
     * @throws MyException
     */
    public function getPermisoComboContabilizacionDelegado() {
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idprograma'] = $this->idPrograma;
        $parametros['idestructura'] = ESTRUCTURA_PERMISOS_NOTA_CONTABILIZACION;
        $permisos = $this->notasModel->getPermisoComboContabilizacion($parametros);
        foreach ($permisos as $idPermisos){
            if($idPermisos['idunidad'] == UNIDAD_PERMISO_NOTA_CONTABILIZACION){
                $permisos = 1;
                break;
            }
             if($idPermisos['idunidad'] == UNIDAD_PERMISO_NOTA_CONTABILIZACION_MESES){
                $permisos = 1;
                break;
            }
        }
        return $permisos;
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
