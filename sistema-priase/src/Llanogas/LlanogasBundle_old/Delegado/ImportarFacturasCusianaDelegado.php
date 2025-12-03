<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\ImportarFacturasCusianaModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\InterpreteXmlCusiana;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Description of ImportarFacturasDelegado
 *
 * @author mebonilla9
 */
class ImportarFacturasCusianaDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var ImportarFacturasCusianaModel
     */
    private $importarFacturasCusianaModel;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->importarFacturasCusianaModel = new ImportarFacturasCusianaModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Genera un select de html con la informacion necesaria para su funcionalidad
     * @param int $codTipo id del tipo de combo
     * @return html combo de selección
     */
    public function cargarComboDb($codTipo) {
        switch ($codTipo) {
            case 'cmbEmpresas':
                $resultado = $this->obtenerOtrasEmpresas();
                break;
        }
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['idempresa']] = $campos['empresa'];
        }
        return Util::crearCombo($codTipo, $listaDatos);
    }

    /**
     * Consulta la informacion de otras empresas diferentes a con la cual el
     * usuario se ha logueado
     * @return array información de las otras empresas
     * @throws MyException
     */
    private function obtenerOtrasEmpresas() {
        $empresas = $this->importarFacturasCusianaModel->consultarOtrasEmpresas();
        if (empty($empresas)) {
            throw new MyException("Error, No se encontraron registros", 0);
        }
        return $empresas;
    }

    /**
     * Inicia el proceso de carga de facturas escritas en xml de un archivo adjunto
     * @param array $listaArchivos informacion de los archivos cargados al
     * servidor
     * @return array información de las facturas cargadas y no cargadas
     */
    public function importarFacturas($listaArchivos, $cicloSeleccionado) {

        try {
            $this->conexion->beginTransaction();
            $interprete = new InterpreteXmlCusiana($this);
            foreach ($listaArchivos as $archivo) {
                $interprete->cargarXml($archivo["rutaarchivo"]);
                $interprete->interpretarXml($cicloSeleccionado);
            }
            $this->conexion->commit();
        } catch (\Exception $exc) {
            //  $facturasCargadas = -1;
            $this->conexion->rollBack();
            throw new MyException("Error, " . $exc->getMessage(), -1);
        }
    }

    /**
     * consulta el numero de factura para una nueva factura
     * @param int $idEmpresa id de la empresa de la suscripcion
     * @param int $idDocumento id del documento de la liquidacion de la suscripcion
     * @param int $idTipoDocumento id del tipo de documento de la liquidacion
     * @return array informacion del numero de factura
     * @throws MyException
     */
    private function consultarNumeroFactura($idEmpresa, $idDocumento, $idTipoDocumento) {
        $infoFactura["idempresa"] = $idEmpresa;
        $infoFactura["iddocumento"] = $idDocumento;
        $infoFactura["idtipodocumento"] = $idTipoDocumento;
        $infoFactura["tipo"] = "FA";
        $numeroFactura = $this->genericoModel->obtenerNumeroFactura($infoFactura);
        if (empty($numeroFactura)) {
            throw new MyException("Error, nÚmero de factura no encontrado", -1);
        }
        return $numeroFactura;
    }

    /**
     * Actualiza el valor del numero disponible de la factura
     * @param int $numero numero de la factura
     * @param int $idNumero id del numero del registro de la factura
     */
    private function actualizarNumeroFactura($numero, $idNumero) {
        $this->genericoModel->actualizarNumeroDisponible($numero, $idNumero);
    }

    /**
     * Actualiza el numero de la factura 
     * @param int $codigoAnterior codigo anterior de la suscripcion a buscar
     * @return array suscripciones encontradas segun los parametros de busqueda
     */
    public function obtenerInformacionSuscripcion($codigoAnterior, $suscripcionGas) {
        $parametros["codigoanterior"] = $codigoAnterior["codigoanterior"];
        if (array_key_exists('tipouso', $codigoAnterior)) {
            $parametros["tipouso"] = $codigoAnterior["tipouso"];
        }

        $parametros["idempresa"] = $this->sesion->get('idempresa');
        try {
            $idusuario = $this->sesion->get("idusuario");
            $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario)[0];
        } catch (\Exception $e) {

            $parametrosGas["codigoanterior"] = $suscripcionGas;
            $idusuario = $this->sesion->get("idusuario");
            $this->sesion->get('idempresa') == CODIGO_ACESEGUROS ? $suscripcion = $this->registrarSuscripcion($parametrosGas, $idusuario, $parametros) : $suscripcion = $this->registrarPropiedad($parametrosGas, $idusuario, $parametros);
        }
        return $suscripcion;
    }

    /**
     * Registra una nueva factura con la informacion extraida de un archivo 
     * adjunto xml
     * @param array $factura informacion de la factura a registrar
     * @param array $facturasNoCargadas almacena los codigos anteriores de las
     * facturas que no pudieron ser cargadas
     * @return int "1" si fue insertado, "0" si no pudo ser insertado
     * @throws MyException
     */
    public function registrarFactura($factura, array &$facturasNoCargadas, array &$totalFacturado, $cicloSeleccionado) {
        $this->conexion->beginTransaction();

        try {
            if (!array_key_exists('suscripcion', $factura)) {
                throw new MyException('Error, No existe la etiqueta <suscripcion> de gas en el archivo', -1);
            }
            $parametro["codigoanterior"] = $factura["pcodigo"];
            if (array_key_exists('tipouso', $factura)) {
                $parametro["tipouso"] = $factura["tipouso"];
            }


////////////////////////////////////////////////////////////////////////////////////////////////     

            $idusuario = $this->sesion->get("idusuario");
            $parametrosGas["codigoanterior"] = $factura["suscripcion"];

            $validaSuscripcionGas = $this->genericoModel->getSuscripcion($parametrosGas, $idusuario)[0];

            if ($validaSuscripcionGas["estadosuscripcion"] != 'A') {
                throw new MyException('Error, El estado de la suscripcion gas ' . $parametrosGas["codigoanterior"] . ' no esta activa', -1);
            }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
            //Consultar la existencia de la suscripcion segun el codigo anterior recibido
            //  $suscripcion = $this->obtenerInformacionSuscripcion($parametro, $factura["suscripcion"]);
            if ($cicloSeleccionado != 'S') {
                $cicperiodo = $this->genericoModel->getCicloPeriodoPcodigo($factura["suscripcion"]);
                if ($cicloSeleccionado != $cicperiodo['idCiclo']) {
                    throw new MyException('Error, La suscripción no pertenece al ciclo Seleccionado');
                }
                $idePeriodo = $cicperiodo["idperiodo"];
            } else {
                $cicperiodo = $this->importarFacturasModel->getCicloPeriodoAnteriorPcodigo($factura["suscripcion"]);
                $idePeriodo = $cicperiodo["idperiodo"];
            }

            $suscripcion = $this->validaHomologacion($parametro, $idusuario, $validaSuscripcionGas);

            $this->validarFactura($suscripcion, $factura["numfactura"]);

            /* Valida si la suscripcion ya tiene una factura cargada para el mismo periodo, ciclo empresa que este en estado = 'A' */
            if ($cicloSeleccionado != 'S') {
                $this->validaFacturaSuscripcionPeriodo($suscripcion, $cicperiodo['idCiclo'], $cicperiodo['idperiodo']);
            }

            $liquidacion = $this->importarFacturasModel->consultarInfoLiquidacion($suscripcion["idliquidacion"]);
            //$this->consultarNumeroFactura($suscripcion["idempresa"], $liquidacion["iddocumento"], $liquidacion["idtipodocumento"]);
            $factura["facnumero"] = $factura["numfactura"];
            $factura["facmetgenera"] = "P";
            $factura["facestado"] = "A";
            // la fecha estandar de la tabla ya esta incluida
            // la fecha de vencimiento esta incluida se convierte en timestamp
            if ($this->sesion->get('idempresa') == 300) {
                $factura["facfecvence"] = 'now()';
            }
            $factura["empideregistro"] = $suscripcion["idempresa"];
            $factura["susideregistro"] = $suscripcion["idsuscriptor"];
            $factura["dsusideregistr"] = $suscripcion["idsuscripcion"];
            $factura["unitipsuscripc"] = $suscripcion["idtiposuscripcion"];
            if (array_key_exists('tipouso', $factura)) {
                $factura['unitipusosuscr'] = $factura["tipouso"];
            } else {
                $factura['unitipusosuscr'] = $suscripcion["idtipousosuscripcion"];
            }
            $factura["uniliquidacion"] = $suscripcion["idliquidacion"];
            $factura["terideregistro"] = $suscripcion["idtercero"];
            // se obtiene el ciclo periodo actual de la suscripcion
            $factura["cicideregistro"] = $cicperiodo["idciclo"];
            $factura["perideregistro"] = $idePeriodo;
            $factura["unidocumento"] = $liquidacion["iddocumento"];
            $factura["unitipdocument"] = $liquidacion["idtipodocumento"];
            $factura["cicano"] = $cicperiodo["cicloanio"];
            $factura["unitiptercero"] = $suscripcion["idtipotercero"];
            $factura["usuideregistro"] = $this->sesion->get("idusuario");
            $factura["facvlrreal"] = $factura["facsdoreal"];
            $factura["facfecaprobada"] = 'now()';
            $factura['empresa'] = $this->sesion->get('empresa');

            $idFactura = $this->importarFacturasModel->insertarFactura($factura);
            if (!is_numeric($idFactura) || $idFactura <= 0) {
                //$this->conexion->rollBack();
                throw new MyException("Error, la factura no ha sido registrada", -1);
            }
            if (array_key_exists('conceptofinan', $factura)) {
                if ($factura["conceptofinan"] <> null || $factura["conceptofinan"] <> '') {
                    $tipTipifica = $this->importarFacturasModel->consultarTipInformacion(1118)[0];
                    $parametros["idfactura"] = $idFactura;
                    $parametros["idtipodato"] = $tipTipifica["idtipodato"];
                    $parametros["idinformacion"] = $tipTipifica["idinformacion"];
                    $parametros["idtipvlr"] = $factura["conceptofinan"];
                    $resultadoTip = $this->importarFacturasModel->insertarInformacionAdicionalFactura($parametros);
                }
            }
            $valorConceptoSuma = 0;
            foreach ($factura["detalles"] as $detalle) {
                if (!is_numeric($detalle["dfacvlrunitari"])) {
                    throw new MyException('Error, El valor del concepto No. ' . $detalle['uniconcepto'] . ' debe ser Númerico', -1);
                }
                $valor = "";
                $detalle["dfacestado"] = "A";
                $detalle["dfaccantidad"] = 1;
                $tipoConcepto = $this->importarFacturasModel->consultarTipoConcepto($detalle["uniconcepto"]);
                if ($tipoConcepto["operacion"] == "S") {
                    $valor = $detalle["dfacvlrunitari"];
                    $valorConceptoSuma = $valorConceptoSuma + $detalle["dfacvlrunitari"];
                }
                if ($tipoConcepto["operacion"] == "I") {
                    $valor = 0.000000;
                }
                $detalle["dfacvlrtotal"] = $detalle["dfacvlrunitari"];
                $detalle["dfacvlrunitari"] = $detalle["dfacvlrunitari"];
                $detalle["dfacvlrreal"] = $valor;
                $detalle["dfacsdoreal"] = $valor;
                $detalle["facideregistro"] = $idFactura;
                $detalle["uniconcepto"] = $detalle["uniconcepto"];
                $detalle["usuideregistro"] = $this->sesion->get("idusuario");
                $this->importarFacturasModel->insertarDetalleFactura($detalle);
            }
            // $this->actualizarNumeroFactura($numeroFactura["numero"], $numeroFactura["idnumero"]);  
            if ($valorConceptoSuma != $factura['facsdoreal']) {
                throw new MyException('Error, La sumatoria de los concepto  ' . $valorConceptoSuma . '  No es igual al Encabezado  ' . $factura['facsdoreal'], -1);
            }
            $totalFacturado [] = $factura['facsdoreal'];

            $this->conexion->commit();

            return 1;
        } catch (\Exception $exc) {
            //print_r($exc->getMessage());
            if (!array_key_exists('suscripcion', $factura)) {
                $factura['suscripcion'] = 'Error';
            }
            $error = [];
            $error['codigo'] = $factura["pcodigo"];
            $error['suscripcion'] = $factura["suscripcion"];
            $error['mensaje'] = $exc->getMessage();
            $facturasNoCargadas [] = $error;
            $this->conexion->rollBack();
            return 0;
        }
    }

    /**
     * Valida si la factura ya fue registrada anteriormente
     * @param type $suscripcion informacion de la suscripcion
     * @param type $cicloPeriodo informacion del ciclo y el periodo activo de la
     * suscripcion
     */
    private function validarFactura($suscripcion, $factura) {
        $parametros['idsuscripcion'] = $suscripcion['idsuscripcion'];
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['facnumero'] = $factura;
        $this->importarFacturasModel->validarFactura($parametros);
    }

    public function ActualizaFacturasPeriodoAnterior($cicloSeleccionado) {

        $parametros = array();
        if ($this->sesion->get('idempresa') == LLANOGAS_IDPROYCTO) {
            throw new MyException(' Debe iniciar sesión con una empresa Diferente a  ' . $this->sesion->get('empresa'));
        }
        if ($cicloSeleccionado == -1) {
            return;
        }
        $parametros['idempresa'] = $this->sesion->get('idempresa');
        $parametros['estadoactual'] = 'A';  //  se modifica el estado de las facturas ya que no se eliminaran 
        $parametros['idciclo'] = $cicloSeleccionado;
        $resultado = $this->importarFacturasModel->actulizaFacturaPeriodoAnteriorNoRecaudo($parametros);
        return $resultado;
    }

    public function consultarCiclosActivos($idEmpresa) {
        return $this->genericoModel->getCiclosActivosPrograma($idEmpresa, PROGRAMA_IMPORTAR_FACTURA_BIO_ACE);
    }

    public function getTipo() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        return $this->genericoModel->getInformacionUnidadPorClase(CLA_TIPO_AFECTACION, $idEmpresa, 563, $idUsuario);
    }

    public function validaHomologacion($parametro, $idusuario, $validaSuscripcionGas) {
        try {
            $idusuario = $this->sesion->get("idusuario");
            $suscripcion = $this->genericoModel->getSuscripcion($parametro, $idusuario)[0];
        } catch (\Exception $ex) {
            $parametrosGas["codigoanterior"] = $validaSuscripcionGas['codigoanterior'];
            //  Se define con el Ing Leonardo Que no se cree la propiedad par Ace Seguros  300
            $this->sesion->get('idempresa') == CODIGO_ACESEGUROS ? $suscripcion = $this->registrarSuscripcion($parametrosGas, $idusuario, $parametro) : $suscripcion = $this->registrarPropiedad($parametrosGas, $idusuario, $parametro);
        }
        $parametro['idsuscripcion'] = $suscripcion['idsuscripcion'];
        if ($validaSuscripcionGas["idsuscriptor"] != $suscripcion["idsuscriptor"]) {
            //  kelly dice que se debe actualizar el suscriptor de la homologacion si este es diferente al de gas 2017/03/26
            $this->importarFacturasModel->actualizaSuscripcion($parametro, $idusuario, $validaSuscripcionGas);
            //  throw new MyException('Error,El suscriptor gas ' . $validaSuscripcionGas["idsuscriptor"] . '; Es diferente suscriptor  ' . $this->sesion->get('empresa') . ' ' . $suscripcion["idsuscriptor"]. 'No se actualiza; se controla desde Cambio Propietario' , -1);
        } elseif ($validaSuscripcionGas["idciclo"] != $suscripcion["idciclo"]) {
            $this->importarFacturasModel->actualizaSuscripcion($parametro, $idusuario, $validaSuscripcionGas);
        }
        return $suscripcion;
    }

    /*     * ************   NUEVO   ***************** */

    public function cargarInformacionTemporal($factura, $contador) {

        $factura["emp_ideregistro"] = $factura["emp_ideregistro"];
        $factura["felec_sistema"] = $factura["felec_sistema"];
        $factura["felec_idefactura"] = $factura["felec_idefactura"];
        $factura["uni_documento"] = $factura["uni_documento"];
        $factura["uni_tipdocument"] = $factura["uni_tipdocument"];
        $factura["uni_tipusosuscr"] = $factura["uni_tipusosuscr"];
        $factura["fac_fech"] = $factura["fac_fech"];
        $factura["fac_fecf"] = $factura["fac_fecf"];
        $factura["fac_vato"] = $factura["fac_vato"];
        $factura["fac_desc"] = $factura["fac_desc"];
        $factura["cli_noco"] = $factura["cli_noco"];
        $factura["TipoPersona"] = $factura["tipopersona"];
        $factura["cli_coda"] = $factura["cli_coda"];
        $factura["cli_nomb"] = $factura["cli_nomb"];
        $factura["cli_apel"] = $factura["cli_apel"];
        $factura["aplicafel"] = $factura["aplicafel"];
        $factura["dcl_mail"] = $factura["dcl_mail"];
        $factura["arb_nomb"] = $factura["arb_nomb"];
        $factura["dcl_dire"] = $factura["dcl_dire"];
        $factura["dcl_ntel"] = $factura["dcl_ntel"];
        $factura["mediopago"] = $factura["mediopago"];
        $factura["nitfacturadorelectro"] = $factura["nitfacturadorelectro"];
        $factura["idusuariocus"] = $factura["idusuario"];
        $factura["ordendeservicio"] = $factura["ordendeservicio"];
        $factura["tipocompra"] = $factura["tipocompra"];
        $factura["observaciones"] = $factura["observaciones"];
        $factura["ipfeestado"] = "A";
        $factura["ipfefecha"] = 'now()';
        $factura['idempresa'] = $this->sesion->get('idempresa');
        $factura['idusuario'] = $this->sesion->get('idusuario');
        $factura['idproceso'] = $contador % NUMERO_HILOS_CARGAR_IMPORTAR_FACTURA;
        $factura['detallado'] = json_encode($factura['detalles']);

        $idEncabezado = $this->importarFacturasCusianaModel->insertarFacturaEncabezado($factura);
    }

    public function existeTablaTemporalEncabezado() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $idusuario = $this->sesion->get('idusuario');
            $this->importarFacturasCusianaModel->vaciarTablaTempEncabezado($idEmpresa, $idusuario);
        } catch (\Exception $exc) {

            throw new MyException('Error al crear la tabla temporal Encabezado', -1);
        }
    }

    public function validarEstadoGas() {
        $idusuario = $this->sesion->get('idusuario');
        $this->importarFacturasModel->validaEstadoGasModelo($idusuario);
    }

    public function validaUsuarioGasNoExistenPrisma() {
        $idusuario = $this->sesion->get('idusuario');
        $this->importarFacturasModel->UsuarioGasNoExistenPrisma($idusuario);
    }

    public function creaSuscripcionesHomologadas($idProceso) {
        $idusuario = $this->sesion->get('idusuario');
        $resultado = $this->importarFacturasModel->buscaSuscripcionesHomologar($idusuario, $idProceso);
        if (!empty($resultado)) {
            foreach ($resultado AS $datos) {
                $this->sesion->get('idempresa') == CODIGO_ACESEGUROS ? $this->registrarSuscripcion($datos, $idusuario) : $this->registrarPropiedad($datos);
            }
        }
    }

    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $resultado['resumencorrectos'] = $this->importarFacturasCusianaModel->consultarResumen($idUsuario, $idEmpresa);
        $resultado['resumenconerrores'] = $this->importarFacturasCusianaModel->consultarResumenErrores($idUsuario, $idEmpresa);
        return $resultado;
    }

    public function cancelarImportacion() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $resultado = $this->importarFacturasModel->cancelarFacturacionActionUser($idUsuario, $idEmpresa);
        return $resultado;
    }

    public function setNumeroFactura(array $facturas) {
        $this->conexion->beginTransaction();
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $genericodelegado = new GenericoDelegado($this->conexion);
        try {
            foreach ($facturas['facturas'] as $factura) {
                $factura['tipo'] = "FA";
                $factura['idfactura'] = $factura['fac_ideregistro'];
                $factura['idempresa'] = 319;
                $factura['iddocumento'] = $factura['uni_documento'];
                $factura['idtipodocumento'] = $factura['uni_tipdocument'];
                $genericodelegado->actualizarNumeroFacturaCusiana($factura);
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al actualizar el número de factura', -1);
        }
        return 1;
    }

}
