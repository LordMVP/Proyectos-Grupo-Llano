<?php

namespace Externo\FinanciacionesBundle\Delegado;

use Doctrine\DBAL\Connection;
use Externo\FinanciacionesBundle\Models\VentaExternoModel;
use Llanogas\LlanogasBundle\Delegado\FacturarSuscripcionDelegado;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\FacturarSuscripcionModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\RegistrarVentasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;
use Llanogas\LlanogasBundle\Utiles\Validacion;

/**
 * Description of SegutidadDelegado
 *
 * @author god
 */
class VentasExternoDelegado {

    /**
     * @var array
     */
    private $parametros;

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
     * Información del usuario que está en el sistema
     * @var array (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    private $sesion;

    /**
     *
     * @var VentaExternoModel 
     */
    private $ventaExternoModel;

    /**
     * Calse encargada de hacer validaciones de tipo de datos 
     * @var Validacion 
     */
    private $validacion;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var FacturarSuscripcionDelegado 
     */
    private $facturarSuscripcionDelegado;

    /**
     *
     * @var FacturarSuscripcionModel 
     */
    private $facturarSuscripcionModel;

    /**
     * Constructor de la clase 
     * @param Connection $conexion Conexión a la base de datos
     * @param int $idAcceso identificador de la tabla de acceso 
     */
    public function __construct(&$conexion, array $sesion, array $parametros = array()) {
        $this->sesion = $sesion;
        $this->validacion = new Validacion();
        $this->conexion = $conexion;
        $this->parametros = $parametros;
        $this->genericoModel = new GenericoModel($conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->ventaExternoModel = new VentaExternoModel($this->conexion, $this->sesion);
        $this->facturarSuscripcionModel = new FacturarSuscripcionModel($this->conexion);
        if (isset($sesion['idacceso']) && isset($parametros['idsuscripcion'])) {
            $this->facturarSuscripcionDelegado = new FacturarSuscripcionDelegado($this->conexion, $sesion['idacceso'], $parametros['idsuscripcion'], PROGRAMA_FINANCIACION_EXTERNA);
        }
    }

    /**
     * Consulta las empresas que prestan el servicio 
     * 
     * @return array 
     */
    public function consultarEmpresasServicio() {
        return $this->suscripcionModel->consultarEmpresas();
    }

    /**
     * Consulta las empresas que prestan el servicio y 
     * las empresas autorizadas para financiar
     * @return array( empresaservicio,empresafinancian) 
     */
    public function consultarEmpresas() {
        $suscripcionDelegado = new SuscripcionExternoDelegado($this->conexion, $this->sesion);
        $genericoDelgado = new GenericoDelegado($this->conexion);
        $financiacionExternoDelegado = new FinanciacionExternoDelegado($this->conexion, $this->sesion);
        $listaEmpresasServicio = $suscripcionDelegado->consultarEmpresasServicio();
        $empresa['idempresa'] = $this->sesion['idempresa'];
        $empresa['nombreempresa'] = $this->sesion['empresa'];
        $resultado['empresaservicio'] = $listaEmpresasServicio;
        $resultado['empresafinancian'][] = $empresa;
        $resultado['empresafirmainstaladora'] = $this->ventaExternoModel->consultarFirmasInstaladoras();
        $resultado['organismosinspeccion'] = $genericoDelgado->consultarTerceros(UNIDAD_ORGANISMOSINSPECCION, '');
        $resultado['parentescos'] = $financiacionExternoDelegado->consultarParentesco();
        $resultado['productosfinancieros'] = $financiacionExternoDelegado->consultarProductosFinancieros();
        return $resultado;
    }

    /**
     * Consulta los funcionarios dependiendo de una empresa clasificada
     * como firma instaladora
     * @param array $parametros (idfirmainstaladora)
     * @return array Lista de las firmas instaladoras
     */
    public function consultarFuncionarioFirma() {
        $this->validacion->validar($this->parametros, [
            "idfirmainstaladora" => "required|numeric"], 'Debe seleccionar una firma instaladora');
        $ventasModel = new RegistrarVentasModel($this->conexion);
        return $ventasModel->getFuncionarioFirma($this->parametros['idfirmainstaladora']);
    }

    /**
     * Consulta todos los tipos de documentos 
     * @param array $parametros (idsuscripcion) identificador de la suscripción
     * @return array Lista de tipos de documentos 
     */
    public function consultarTiposDocumentos() {
        //Se valida que los parámetros están lleguen correctamente
        $this->validacion->validar($this->parametros, [
            'idsuscripcion' => 'required|numeric',
            'idfirmainstaladora' => 'required|numeric'
        ]);
        return $this->ventaExternoModel->consultarTiposDocumentos($this->parametros['idsuscripcion'], $this->parametros['idfirmainstaladora']);
    }

    /**
     * Consulta todos los documentos dependiendo del tipo de documento
     * @param array $parametros (idtipodocumento) Identificador del tipo de documento
     * @return array Lista de documentos 
     */
    public function consultarDocumentos() {
        //Se valida que los parámetros están lleguen correctamente
        $this->validacion->validar($this->parametros, ['idtipodocumento' => 'required|numeric']);
        return $this->ventaExternoModel->consultarDocumentos($this->parametros);
    }

    /**
     * Consultar las liquidaciones de acuerdo a un tipo de documento y
     * documento 
     * @param array $parametros arreglo con la información de los parámetros 
     */
    public function consultarLiquidaciones() {
        //Se valida que los parámetros están lleguen correctamente
        $this->validacion->validar($this->parametros, [
            'idtipodocumento' => 'required|numeric',
            'idsuscripcion' => 'required|numeric',
            'iddocumento' => 'required|numeric'
        ]);
        return $this->ventaExternoModel->consultarLiquidaciones($this->parametros);
    }

    /**
     * Consulta los conceptos dependiendo de las 
     * liquidaciones seleccionadas 
     * @param string $liquidaciones
     * @param int $idPrograma identificador del programa de financiaciones 
     * @return array Lista de los conceptos
     */
    public function consultarConceptos() {
        //Se valida que los parámetros están lleguen correctamente
        $this->validacion->validar($this->parametros, [
            'liquidaciones' => 'required'
        ]);
        return $this->ventaExternoModel->consultarConceptos($this->parametros['liquidaciones']);
    }

    /**
     * Realiza todo el calculo de liquidación  de la venta 
     * @param array $listaConceptos
     * @param string $liquidaciones idntificadores de las liquidaciones separadas por coma
     * @return información de todos los conceptos liquidados
     */
    public function liquidarVenta() {
        $listaConceptos = json_decode($this->parametros['conceptos'], true);
        $liquidaciones = $this->parametros['liquidaciones'];
        $listaConceptosLiquidados = array();
        $conceptosOrdenados = $this->consultarConceptos();
        $this->validarConceptosEliminados($listaConceptos, $conceptosOrdenados, $listaConceptosLiquidados);
        $venta = array();
        foreach ($listaConceptos as $concepto) {
            $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($concepto['idconcepto']);
            $infoConcepto['editable'] = $concepto['editable'];
            $this->validarNumeroTotal($infoConcepto, $concepto);
            if (($infoConcepto['idprograma'] == PROGRAMA_FINANCIACION_EXTERNA && $infoConcepto['tipocalculo'] == 'V' ) || $concepto['eliminado'] == 'S') {
                $infoConcepto['valortotal'] = $concepto['valortotal'];
                $infoConcepto['cantidad'] = $concepto['cantidad'];
                $infoConcepto['valorunitario'] = $concepto['valorunitario'];
                $this->calcularValorConceptoRegistro($infoConcepto);
                $listaConceptosLiquidados[] = $infoConcepto;
            } else if ($infoConcepto['tipocalculo'] == 'V') {
                $this->facturarSuscripcionDelegado->setListaConceptosLiquidados($listaConceptosLiquidados);
                $infoConcepto = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $liquidaciones, $infoConcepto);
                $listaConceptosLiquidados[] = $infoConcepto;
            }
        }
        $valorVenta = 0;
        $conceptosVenta = array();
        foreach ($listaConceptos as $concepto) {
            if ($concepto['editable'] == 'N') {
                $infoConcepto['valortotal'] = NULL;
                $infoConcepto['cantidad'] = NULL;
                $infoConcepto['valorunitario'] = NULL;
            }
            $this->facturarSuscripcionDelegado->setListaConceptosLiquidados($listaConceptosLiquidados);
            $infoConcepto = $this->facturarSuscripcionDelegado->iniciarLiquidacionConcepto($concepto['idconcepto'], $liquidaciones);
            if (isset($concepto['seleccionado'])) {
                $infoConcepto['seleccionado'] = $concepto['seleccionado'];
            }
            $infoConcepto['eliminar'] = $concepto['eliminar'];
            $infoConcepto['eliminado'] = $concepto['eliminado'];
            $infoConcepto['idliquidacion'] = $concepto['idliquidacion'];
            $infoConcepto['editable'] = $concepto['editable'];
            ConceptosUtil::redondearConceptoVenta($infoConcepto);
            $conceptosVenta[] = $infoConcepto;
            $valorVenta += round($infoConcepto['valorreal'], CANTIDAD_DECIMALES);
        }
        $listaConceptosVenta = array();
        foreach ($conceptosOrdenados as $conceptoOrdenado) {
            foreach ($conceptosVenta as $conceptoVenta) {
                if ($conceptoVenta['idconcepto'] == $conceptoOrdenado['idconcepto']) {
                    //Se eliminan atributos que no son necesarions en la vista
                    unset($conceptoVenta['formula']);
                    unset($conceptoVenta['iniciovigencia']);
                    unset($conceptoVenta['finvigencia']);
                    unset($conceptoVenta['anticipo']);
                    unset($conceptoVenta['alias']);
                    unset($conceptoVenta['naturaleza']);
                    unset($conceptoVenta['abreviatura']);
                    unset($conceptoVenta['idusuarioregistra']);
                    unset($conceptoVenta['precision']);
                    unset($conceptoVenta['idfuncion']);
                    unset($conceptoVenta['metodo']);
                    unset($conceptoVenta['pagoprioridad']);
                    unset($conceptoVenta['idestructuraconcepto']);
                    unset($conceptoVenta['preliquidar']);
                    unset($conceptoVenta['idprograma']);
                    unset($conceptoVenta['condonable']);
                    unset($conceptoVenta['estado']);
                    unset($conceptoVenta['financiable']);
                    unset($conceptoVenta['preliquidar']);
                    $listaConceptosVenta[] = $conceptoVenta;
                    break;
                }
            }
        }
        $venta['conceptos'] = $listaConceptosVenta;
        $venta['valor'] = round($valorVenta, CANTIDAD_DECIMALES);
        return $venta;
    }

    /**
     * Valida que el usuario ingrese la información para los conceptos obligatorios 
     * @param arary $infoConcepto información del concepto como está en la 
     * base de datos 
     * @param array $concepto Información del concepto que el usuario ingreso 
     * @throws MyException Si el usuario no ingresa el valor del concepto 
     */
    private function validarNumeroTotal($infoConcepto, $concepto) {
        if ($concepto['editable'] == 'N') {
            return;
        }
        if (($infoConcepto['tipocalculo'] == 'V' && empty($concepto['valortotal']) && $concepto['editable'] == 'S') && $infoConcepto['valornulo'] == 'N') {
            throw new MyException('Debe ingresar la información del concepto ' . $concepto['idconcepto'] . '  ' . $concepto['concepto'], -1);
        }
    }

    /**
     * Se valida que los conceptos se puedan realizar la eliminación 
     * @param array $listaConceptos
     * @param array $conceptosOrdenados
     * @param array $listaConceptosLiquidados
     * @throws MyException
     */
    private function validarConceptosEliminados(array &$listaConceptos, array &$conceptosOrdenados, array &$listaConceptosLiquidados) {
        foreach ($conceptosOrdenados as $conceptoOrdenado) {
            $existe = FALSE;
            foreach ($listaConceptos as $conceptoInterfaz) {
                if ($conceptoInterfaz['idconcepto'] == $conceptoOrdenado['idconcepto']) {
                    //Se valida si el usuario ha eliminado ese concepto en la interfaz
                    $existe = ($conceptoInterfaz['eliminado'] == 'S') ? FALSE : TRUE;
                    break;
                }
            }
            if ($existe == FALSE && $conceptoOrdenado['eliminar'] == 'N') {
                throw new MyException('Error el concepto ' . $conceptoOrdenado['idconcepto'] . ' es obligatorio', -1);
            }
            if (!$existe) {
                $infoConcepto = $this->facturarSuscripcionModel->getConceptoInformacion($conceptoOrdenado['idconcepto']);
                $infoConcepto['cantidad'] = 1;
                $infoConcepto['valortotal'] = 0;
                $infoConcepto['valorreal'] = 0;
                $infoConcepto['eliminado'] = 'S';
                $infoConcepto['metodo'] = $conceptoOrdenado['metodo'];
                $infoConcepto['precision'] = $conceptoOrdenado['precision'];
                $listaConceptosLiquidados[] = $infoConcepto;
            }
        }
    }

    /**
     * Verifica si el concepto debe o no llevar valor real o si el concepto acepte nulos 
     * @param type $infoConcepto
     * @return type
     */
    private function calcularValorConceptoRegistro(&$infoConcepto) {
        $infoConcepto['valorreal'] = 0;
        if (empty($infoConcepto['valor']) && $infoConcepto['valornulo'] == 'S' && empty($infoConcepto['valortotal'])) {
            $infoConcepto['cantidad'] = 1;
            $infoConcepto['valorunitario'] = 0;
            $infoConcepto['valortotal'] = 0;
            return;
        }
        $infoConcepto['valortotal'] = $infoConcepto['valortotal'];
        $infoConcepto['cantidad'] = $infoConcepto['cantidad'];
        $infoConcepto['valorunitario'] = $infoConcepto['valorunitario'];
        $infoConcepto['valorreal'] = 0;
        if ($infoConcepto['operacion'] == 'S') {
            $infoConcepto['valorreal'] = $infoConcepto['valortotal'];
        }
    }

    /**
     * Método encargado de guardar toda la información de la venta 
     */
    public function guardar() {
        $this->parametros = json_decode($this->parametros['parametros'], true);
        try {
            $this->conexion->beginTransaction();
            if (isset($this->parametros['liquidacionventa']['numeroventa']) && !empty($this->parametros['liquidacionventa']['numeroventa'])) {
                $this->inicializarVenta();
            }
            $this->guardarSuscripcion();
            $this->guardarTercero();
            $this->guardarVenta();
            $this->guardarDetalleVenta();
            $this->guardarLiquidacionVenta();
            $this->guardarAdjuntos();
            $this->guardarConvenio();
            $this->guardarFinanciacion();
            $this->conexion->commit();
            return $this->parametros['liquidacionventa']['numeroventa'];
        } catch (\Externo\FinanciacionesBundle\ValidacionExcepcion $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), -1);
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
        }
    }

    /**
     * Borra los valores inicialmente establecidos en el registro anterior de la venta anterior
     */
    private function inicializarVenta() {
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $this->ventaExternoModel->inicializarVenta($idVenta);
    }

    /**
     * Edita la información de la suscripción 
     */
    private function guardarSuscripcion() {
        $suscripcion = $this->parametros['informacionbasica'];
        $this->validacion->validar($suscripcion, [
            'idsuscripcion' => 'required|numeric'
        ]);
        $this->ventaExternoModel->editarSuscripcion($suscripcion);
    }

    private function guardarTercero() {
        $this->validacion->validar($this->parametros['solicitante'], [
            'ter_fecnacimiento' => 'required|date',
            'documento' => 'required',
            'ter_correo' => 'required|email',
            'idparentesco' => 'required|numeric'
                ], 'La información del solicitante es obligatoria (correo (debe tener el formato de un correo válido),fecha nacimiento, parentesco, documento)');
        $documento = $this->parametros['solicitante']['documento'];
        $idTercero = $this->ventaExternoModel->consultarTercero($documento);
        //Se inserta el tercero y si existe se actualiza
        $idTercero = $this->ventaExternoModel->insertarSolicitante($this->parametros['solicitante'], $idTercero);
        $this->parametros['solicitante']['idtercero'] = $idTercero;
    }

    /**
     * Guarda específicamente la información en la tabla ven_venta  
     */
    private function guardarVenta() {
        $liquidacionVenta = $this->parametros['liquidacionventa'];
        $this->validacion->validar($liquidacionVenta, [
            'iddocumento' => 'required|numeric',
            'idtipodocumento' => 'required|numeric',
            'valorventa' => 'required|numeric',
                ], 'La información de la liquidación de la venta es obligatoria');
        $idSuscripcion = $this->parametros['informacionbasica']['idsuscripcion'];
        $firmaInstaladora = $this->parametros['firmainstaladora'];
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['iddocumento'] = $liquidacionVenta['iddocumento'];
        $parametros['idtipodocumento'] = $liquidacionVenta['idtipodocumento'];
        $parametros['idcompetenciafirma'] = $firmaInstaladora['idcompetenciafirma'];
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['valorventa'] = $liquidacionVenta['valorventa'];
        $parametros['idciclo'] = $cicloPeriodo['idciclo'];
        $parametros['idperiodo'] = $cicloPeriodo['idperiodo'];
        $parametros['cicloanio'] = $cicloPeriodo['cicloanio'];
        $parametros['idorganismoinspeccion'] = $firmaInstaladora['idorganismoinspeccion'];
        if (isset($liquidacionVenta['numeroventa'])) {
            $parametros['numeroventa'] = $liquidacionVenta['numeroventa'];
        }
        $idVenta = $this->ventaExternoModel->insertarVenta($parametros);
        $this->parametros['liquidacionventa']['numeroventa'] = $idVenta;
    }

    /**
     * Registra los conceptos que el usuario seleccionó
     */
    private function guardarDetalleVenta() {
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $liquidacionConceptos = $this->parametros['liquidacionventa']['conceptos'];
        $hayConceptos = false;
        foreach ($liquidacionConceptos as $concepto) {
            if ($concepto['eliminado'] == 'S') {
                continue;
            }
            $concepto['idventa'] = $idVenta;
            $this->ventaExternoModel->insertarDetalleVenta($concepto);
            $hayConceptos = true;
        }
        if (!$hayConceptos) {
            throw new MyException('Debe liquidar al menos un concepto', -1);
        }
    }

    /**
     * Vincula las liquidaciones con la venta
     * @throws Exception Se lanza un error si el usuario no ha seleccionado ninguna liquidación
     */
    private function guardarLiquidacionVenta() {
        $listaLiquidacionesVenta = $this->parametros['liquidacionventa']['liquidaciones'];
        if (empty(trim($listaLiquidacionesVenta))) {
            throw new MyException('Debe seleccionar una liquidación', -1);
        }
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $listaLiquidaciones = explode(',', $listaLiquidacionesVenta);
        foreach ($listaLiquidaciones as $idLiquidacion) {
            $this->ventaExternoModel->insertarLiquidacion($idLiquidacion, $idVenta);
        }
    }

    /**
     * Guarda el crédito y la información financiera 
     */
    private function guardarFinanciacion() {
        $financiacionExternoDelegado = new FinanciacionExternoDelegado($this->conexion, $this->sesion, $this->parametros);
        $financiacionExternoDelegado->guardar();
    }

    /**
     * Asocia los archivos adjuntos a la venta  
     */
    private function guardarAdjuntos() {
        $adjuntos = $this->parametros['adjuntos'];
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $listaArchivos = '';
        foreach ($adjuntos as $archivo) {
            $listaArchivos .= $archivo['idarchivo'] . ',';
            $this->ventaExternoModel->actualizarArchivo($archivo['idarchivo'], $idVenta);
        }
        $listaArchivos .= '-1';
        $this->ventaExternoModel->eliminarArchivos($idVenta, $listaArchivos);
    }

    /**
     * Registra el convenio de la venta
     */
    private function guardarConvenio() {
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $idSuscripcion = $this->parametros['informacionbasica']['idsuscripcion'];
        $this->ventaExternoModel->insertarConvenio($idSuscripcion, $idVenta);
    }

    /**
     * Inserta los archivos adjuntos en la tabla de ventas 
     * @param array $listaArchivos información de los archivo donde quedaron alojados 
     * @return array  Lista de información donde quedó la información
     * @throws MyException Error al momento de adjuntar los archivos 
     */
    public function adjuntarArchivos($listaArchivos) {
        if (empty($listaArchivos)) {
            throw new MyException('Error al adjuntar los archivos', -1);
        }
        $infoListaArchivos = array();
        foreach ($listaArchivos as $infoArchivo) {
            $idArchivo = $this->ventaExternoModel->insertarArchivo($infoArchivo);
            unset($infoArchivo['rutaarchivo']);
            $infoArchivo['idarchivo'] = $idArchivo;
            $infoListaArchivos[] = $infoArchivo;
        }
        return $infoListaArchivos;
    }

    /**
     * Busca una venta apartir de unos criterios
     * @return array Lista de ventas 
     */
    public function consultarVenta() {
        $this->validacion->validar($this->parametros, [
            'numeroventa' => 'numeric',
            'idsuscripcion' => 'numeric',
            'idempresaservicio' => 'required|numeric',
            'idfirmainstaladora' => 'numeric'
        ]);
        return $this->ventaExternoModel->consultarVenta($this->parametros);
    }

    public function consultarDetalleVenta() {
        $this->validacion->validar($this->parametros, [
            'numeroventa' => 'required|numeric'
        ]);
        $numeroVenta = $this->parametros['numeroventa'];
        $encabezadoVenta = $this->ventaExternoModel->consultarEncabezadoVenta($numeroVenta);
        $suscripcionDelegado = new SuscripcionExternoDelegado($this->conexion, $this->sesion);
        $venta = $suscripcionDelegado->consultarSuscripcion(['codigo' => $encabezadoVenta['idsuscripcion']]);
        $venta['liquidacionventa'] = $this->consultarLiquidacionVenta($encabezadoVenta);
        $venta['adjuntos'] = $this->ventaExternoModel->consultarAdjuntosVenta($numeroVenta);
        $venta['firmainstaladora'] = $this->ventaExternoModel->consultarFirmaInstaladora($numeroVenta);
        $infoVenta = array_merge($venta, $this->consultarFinanciacionVenta($numeroVenta, $encabezadoVenta['idsuscripcion']));
        return $infoVenta;
    }

    private function consultarLiquidacionVenta($encabezadoVenta) {
        $numeroVenta = $encabezadoVenta['numeroventa'];
        $infoLiquidacionVenta['numeroventa'] = $numeroVenta;
        $infoLiquidacionVenta['valorventa'] = $encabezadoVenta['valorventa'];
        $infoLiquidacionVenta['idtipodocumento'] = $encabezadoVenta['idtipodocumento'];
        $infoLiquidacionVenta['iddocumento'] = $encabezadoVenta['iddocumento'];
        $infoLiquidacionVenta['idempresafinancia'] = $this->ventaExternoModel->consultarEmpresaFinancia($numeroVenta);
        $listaLiquidaciones = $this->ventaExternoModel->consultarLiquidacionesVenta($numeroVenta);
        $liquidaciones = implode(',', $listaLiquidaciones);
        $infoLiquidacionVenta['liquidaciones'] = $liquidaciones;
        $infoLiquidacionVenta['conceptos'] = $this->consultarConceptosVenta($numeroVenta, $liquidaciones);
        return $infoLiquidacionVenta;
    }

    /**
     * Consulta todos los conceptos de una venta 
     * @param int $numeroVenta identificador de la venta 
     * @param string $liquidaciones identificador de la venta 
     * @return array Lista de conceptos 
     */
    private function consultarConceptosVenta($numeroVenta, $liquidaciones) {
        $this->parametros['liquidaciones'] = $liquidaciones;
        $listaConceptosLiquidacion = $this->consultarConceptos();
        $listaConceptosVenta = $this->ventaExternoModel->consultarDetalleVenta($numeroVenta);
        $infoConceptos = [];
        foreach ($listaConceptosLiquidacion as $conceptoLiquidacion) {
            $existe = false;
            foreach ($listaConceptosVenta as $conceptoVenta) {
                //Se valida si el concepto de la liquidación se encuentra en la venta 
                if ($conceptoLiquidacion['idconcepto'] == $conceptoVenta['idconcepto']) {
                    //Se pasa la información de la venta al concepto de la liquidación 
                    $infoConceptos[] = array_merge($conceptoLiquidacion, $conceptoVenta);
                    $existe = true;
                    break;
                }
            }
            if (!$existe) {
                $infoConceptos[] = $conceptoLiquidacion;
            }
        }
        return $infoConceptos;
    }

    /**
     * Consulta la información financiera del crédito
     * @param int $numeroVenta identificador de la venta
     * @param int $idSuscripcion identificador de la suscripción
     * @return array
     */
    private function consultarFinanciacionVenta($numeroVenta, $idSuscripcion) {
        $financiacionDelegado = new FinanciacionExternoDelegado($this->conexion, $this->sesion);
        return $financiacionDelegado->consultarFinanciacionVenta($numeroVenta, $idSuscripcion);
    }

}
