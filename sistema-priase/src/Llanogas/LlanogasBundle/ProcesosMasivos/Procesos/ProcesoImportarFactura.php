<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Delegado\ImportarFacturasDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ImportarFacturasModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Description of ImportarFacturas
 *
 * @author Oscar Baquero
 */
class ProcesoImportarFactura {
    /**
     * Constructor de la clase
     * @param int $idproceso identificador del proceso
     * @param String $cicloseleccionado identificador del Front-end
     */

    /**
     *
     * @var array 
     */
    private $sesion;

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
     * @var int 
     */
    private $idControlProceso;

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
     * @var ProcesoModel 
     */
    private $procesoModel;

    /**
     *
     * @var int 
     */
    private $idempresa;

    /**
     *
     * @var int 
     */
    private $idusuario;

    /**
     *
     * @var int 
     */
    private $idproceso;

    /**
     *
     * @var String 
     */
    private $cicloSeleccionado;

    public function __construct($parametros) {
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($parametros['idacceso']);
        $this->importarFacturasModel = new ImportarFacturasModel($this->conexion, $this->sesion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->idproceso = $parametros['idproceso'];
        $this->cicloSeleccionado = $parametros['cicloSeleccionado'];
        $this->idempresa = $parametros['idempresa'];
        $this->idusuario = $parametros['idusuario'];
    }

//  OTRA  FORMA DE HACERLO RECURSIVIDAD A LA CLASE
//    public function procesarFacturas() {
//
//        try {
//            ///  aqui va toda la logica de Negocio 
//            $listaFactura = $this->importarFacturasModel->leerTablaTemporal($this->idproceso);
//            while (!empty($listaFactura)) {
//                //  ejecuto un for para la lectura 
//                foreach ($listaFactura as $factura) {
//                    
//                }
//                $listaFactura = $this->importarFacturasModel->leerTablaTemporal($this->idproceso);
//            }
//        } catch (\Exception $ex) {
//            throw new MyException('Error consultando tabal Temporal ', -1);
//        }
//    }

    public function procesarFacturas() {
        
        /**
         * 
         * Se realiza validación de las facturas que  pertenezcan a periodos anteriores, ya procesados; Estas no se procesaran
         * "Factura cargada en periodos anteriores"
         * 
         */
        if ($this->cicloSeleccionado != 'S') {
            $this->importarFacturasModel->validaFacturasProcesadasPeriodosAnteriores($this->idempresa, $this->idusuario, $this->idproceso);
        }
        


        /*
         * 0. Valida las suscripciones de GAS que esten Activas De lo contrario se cambia estado
         */

        $this->importarFacturasModel->validaEstadoGasModelo($this->idusuario, $this->idproceso);

        /* 1.  VALIDAR LOS CODIGOS DE GAS QUE NO EXISTEN EN LLANOGAS Y CAMBIAR EL ESTADO */

        $this->importarFacturasModel->UsuarioGasNoExistenPrisma($this->idusuario, $this->idproceso);



        /*
         * 
         * 3. validar si las suscripciones de "BioAgricola ó AceSeguros" pertenecen a la de la empresa que inicio SeSSion
         */

        $this->importarFacturasModel->validaEmpresaSuscripcionSession($this->idempresa, $this->idproceso, $this->idusuario);
        /*
         * 4.   validar los suscripciones que no pertenecen al ciclo selecionado
         * 
         */
        // $this->importarFacturasModel->validarCicloSeleccionado($this->cicloSeleccionado, $this->idusuario,$this->idempresa, $this->idproceso);

        /*
         * 5.
         * Validar si Exixten los ciclos en el sistema para un periodo activo 
         * 
         */
        $this->importarFacturasModel->validarCiclosActivos($this->idusuario, $this->idempresa, $this->idproceso);

        /*
         * 2.  VALIDAR LOS USUARIOS DE BIOAGRICOLA ó ACE QUE NO EXISTAN EN PRISMA Y QUE EL ESTADO DE GAS, ESTE ACTIVO. CREAR PROPIEDADES, SUSCRIPCION Y RUTAS .
         *              */

        $this->creaSuscripcionesHomologadas($this->idproceso);
        if($this->idempresa == CODIGO_BIOAGRICOLA){
            $this->cuentaSuscriptoresParaDeshomologar($this->idproceso);
        }
        $this->idempresa == CODIGO_ACESEGUROS  || $this->idempresa == CODIGO_SERFULLANOS  ? $this->importarFacturasModel->actualizaClienteDesHomologadoTemporal($this->idusuario, $this->idempresa, $this->idproceso) : $this->importarFacturasModel->actualizaClienteDesHomologado($this->idusuario, $this->idempresa, $this->idproceso);
        $this->importarFacturasModel->actualizaClienteDesHomologadoDefenitivo($this->idusuario, $this->idempresa, $this->idproceso);


        sleep(4);
        $this->procesarTablaTemporal();
    }

    public function procesarTablaTemporal() {
        $listaFactura = $this->importarFacturasModel->leerTablaTemporal($this->idproceso, $this->idempresa, $this->idusuario);
        if (empty($listaFactura)) {
            return;
        }
        //  ejecuto un for para la factura 
        foreach ($listaFactura as $factura) {
            $this->procesarFactura($factura);
        }
        $this->procesarTablaTemporal();
    }

    private function procesarFactura($factura) {
        try {
            $this->conexion->beginTransaction();
            print_r("\nSe inicia transacion Nro. " . $factura['ipfe_ideregistr'] . " para factura Nro " . $factura['numfactura'] . "\n");
            $this->registrarFactura($factura, $this->cicloSeleccionado);
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            $estado = 'E'; //Fallo cargue
            $mensaje = $ex->getMessage();
            $this->actualizarRegistro($factura['ipfe_ideregistr'], $estado, $mensaje);
            $this->procesarTablaTemporal();
        }
    }

    /**
     * Registra una nueva factura con la informacion extraida de un archivo 
     * adjunto xml  el cual se carga a la tabla temp_impfactura_enc
     * @param array $factura informacion de la factura a registrar
     * @throws MyException
     */
    public function registrarFactura($factura, $cicloSeleccionado) {

        try {
            $idusuario = $this->idusuario;
            $parametro["codigoanteriorbio"] = $factura["pcodigo_bio"];
            $parametro["idsuscripcion_bio"] = $factura["idsuscripcion_bio"];
            $parametrosGas["codigoanteriorgas"] = $factura["codigoanteriorgas"];

            print_r($parametrosGas);
            if ($this->cicloSeleccionado != 'S') {
                $cicperiodo = $this->importarFacturasModel->getCicloPeriodoPcodigo($parametrosGas["codigoanteriorgas"]);

                if (empty($cicperiodo)) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, No se encontró el ciclo y periodo para la suscripción ');
                    return;
                }
                if ($cicloSeleccionado != $cicperiodo['idciclo']) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, La suscripción no pertenece al ciclo Seleccionado');
                    return;
                }
                $idePeriodo = $cicperiodo["idperiodo"];
            } else {
                $cicperiodo = $this->importarFacturasModel->getCicloPeriodoAnteriorPcodigo($factura["codigoanteriorgas"]);
                if (empty($cicperiodo)) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, No se encontró el ciclo y periodo para la suscripción ');
                    return;
                }
                $idePeriodo = $cicperiodo["idperiodo"];
            }

            /*
             * validarFactura($parametro, $factura["numfactura"])
             * @param array $parametro identificador del codigo_OtraEmpresa
             * @param array $factura  datos de la factura
             * Se valida si el Cliente tiene ya creado un número de Factura.
             * SI ya tiene asignado esa factura; y el fac_saldo es igual al fac_vlrreal, se Elimina 
             * la Factura quedando en Fac_Factura el estado en 'E'
             */
            $this->validarFactura($parametro["idsuscripcion_bio"], $factura["numfactura"]);

            /*
             * validaFacturaSuscripcionPeriodo($suscripcion, $cicperiodo['idCiclo'], $cicperiodo['idperiodo'])
             * Valida si la suscripcion de la "EMPRESA Sessión" ya tiene una factura cargada 
             * para el mismo periodo, ciclo, empresa que este en estado = 'A' 
             * 
             */
            if ($this->cicloSeleccionado != 'S') {
                $resultado = $this->validaFacturaSuscripcionPeriodo($parametro["idsuscripcion_bio"], $cicperiodo['idciclo'], $cicperiodo['idperiodo']);
                if ($resultado['cantidad'] > 0) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'La suscripción ya tiene cargada una factura para el periodo actual');
                    return;
                }
            }

            $this->actualizaConvenio($factura["idsuscriptor"], $factura['ipfe_ideregistr']);

            $liquidacion = $this->importarFacturasModel->consultarInfoLiquidacion($factura["idliquidacion_bio"]);
            if (empty($liquidacion)) {
                $this->conexion->rollback();
                $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, no se encontro la liquidacion de la suscripcion');
                return;
            }
            //$this->consultarNumeroFactura($suscripcion["idempresa"], $liquidacion["iddocumento"], $liquidacion["idtipodocumento"]);
            $factura["facnumero"] = $factura["numfactura"];
            $factura["facmetgenera"] = "P";
            $factura["facestado"] = "A";
            // la fecha estandar de la tabla ya esta incluida
            // la fecha de vencimiento esta incluida se convierte en timestamp
            if ($this->idempresa == CODIGO_ACESEGUROS || $this->idempresa == CODIGO_SERFULLANOS) {
                $factura["facfecvence"] = 'now()';
            }
            $factura["empideregistro"] = $this->idempresa;
            $factura["susideregistro"] = $factura["idsuscriptor"];
            $factura["dsusideregistr"] = $factura["idsuscripcion_bio"];
            $factura["unitipsuscripc"] = $factura["idtiposuscripcion"];
            $factura['unitipusosuscr'] = $factura["tipouso"];
            $factura["uniliquidacion"] = $factura["idliquidacion_bio"];
            $factura["terideregistro"] = $factura["idtercero"];
            // se obtiene el ciclo periodo actual de la suscripcion
            $factura["cicideregistro"] = $cicperiodo['idciclo'];
            $factura["perideregistro"] = $idePeriodo;
            $factura["unidocumento"] = $liquidacion["iddocumento"];
            $factura["unitipdocument"] = $liquidacion["idtipodocumento"];
            $factura["cicano"] = $cicperiodo["cicloanio"];
            $factura["unitiptercero"] = $factura["idtipotercero"];
            $factura["usuideregistro"] = $this->idusuario;
            $factura["facvlrreal"] = $factura["facsdoreal"];
            $factura["facfecaprobada"] = 'now()';
            $factura['empresa'] = $this->idempresa;

            $idFactura = $this->importarFacturasModel->insertarFactura($factura);
            print_r("\n Se inserto Nueva Factura Nro  \n");
            print_r($idFactura);
            if (!is_numeric($idFactura) || $idFactura <= 0) {
                print_r("Error, No se inserto Nueva Factura  ==>  " . $idFactura);
                $this->conexion->rollback();
                $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, La suscripción ya tiene un número de factura, documento y tipo de documento para la empresa ');
                return;
            }
            if (!empty($factura['conceptofinan'])) {
                if ($factura["conceptofinan"] <> null || $factura["conceptofinan"] <> '') {
                    $tipTipifica = $this->importarFacturasModel->consultarTipInformacion(1118)[0];
                    $parametros["idfactura"] = $idFactura;
                    $parametros["idtipodato"] = $tipTipifica["idtipodato"];
                    $parametros["idinformacion"] = $tipTipifica["idinformacion"];
                    $parametros["idtipvlr"] = $factura["conceptofinan"];
                    $parametros["idusuario"] = $this->idusuario;
                    $resultadoTip = $this->importarFacturasModel->insertarInformacionAdicionalFactura($parametros);
                }
            }
            $valorConceptoSuma = 0;
            $factura["detalleson"] = json_decode($factura["detalles"], true);

            foreach ($factura["detalleson"] as $detalle) {
                if (!is_numeric($detalle["dfacvlrunitari"])) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, El valor del concepto No. ' . $detalle['uniconcepto'] . ' debe ser Númerico');
                    return;
                }
                $valor = "";
                $detalle["dfacestado"] = "A";
                $detalle["dfaccantidad"] = 1;
                $tipoConcepto = $this->importarFacturasModel->consultarTipoConcepto($detalle["uniconcepto"]);
                if (empty($tipoConcepto)) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, El Id ' . $detalle["uniconcepto"] . ' del concepto no se encontro en la parametrización');
                    return;
                }
                if ($tipoConcepto["operacion"] == "S") {
                    $valor = $detalle["dfacvlrunitari"];
                    $valorConceptoSuma = $valorConceptoSuma + $detalle["dfacvlrunitari"];
                }
                if ($tipoConcepto["operacion"] == "I") {
                    $valor = 0.000000;
                }
                $detalle["estado"] = "A";
                $detalle["cantidad"] = 1;
                $detalle["valortotal"] = $detalle["dfacvlrunitari"];
                $detalle["valorunitario"] = $detalle["dfacvlrunitari"];
                $detalle["valorreal"] = $valor;
                $detalle["saldoreal"] = $valor;
                $detalle["idfactura"] = $idFactura;
                $detalle["idconcepto"] = $detalle["uniconcepto"];
                $detalle["version"] = $detalle["dfacversion"];
                $detalle["idusuario"] = $this->idusuario;
                $detalle["idempresa"] = $this->idempresa;
                $idDetalleFactura = $this->genericoModel->insertarDetalleFactura($detalle);
                if (!is_numeric($idDetalleFactura) || $idDetalleFactura <= 0) {
                    $this->conexion->rollback();
                    $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, Creando detalles; Verifique los conceptos Parametrizables');
                    return;
                }
            }
            // $this->actualizarNumeroFactura($numeroFactura["numero"], $numeroFactura["idnumero"]);  
            if ($valorConceptoSuma != $factura['facsdoreal']) {
                $this->conexion->rollback();
                $this->actualizarRegistro($factura['ipfe_ideregistr'], 'E', 'Error, La sumatoria de los concepto  ' . $valorConceptoSuma . '  No es igual al Encabezado  ' . round($factura['facsdoreal']));
                return;
            }
            $totalFacturado [] = $factura['facsdoreal'];
            $estado = 'I';
            $mensaje = 'Factura Importada Correctamente';

            $this->actualizarRegistro($factura['ipfe_ideregistr'], $estado, $mensaje);


            $this->conexion->commit();
        } catch (\Exception $exc) {
            throw new MyException($exc->getMessage(), $exc->getCode());
        }
    }

    private function validaFacturaSuscripcionPeriodo($idSuscripcion_bio, $idciclo, $idperiodo) {
        $parametros['idsuscripcion'] = $idSuscripcion_bio;
        $parametros['idempresa'] = $this->idempresa;
        $parametros['idciclo'] = $idciclo;
        $parametros['idperiodo'] = $idperiodo;
        $parametros['estado'] = 'A';

        return $this->importarFacturasModel->validarFacturaSuscripcionPeriodo($parametros);
    }

    private function validarFactura($idSuscripcion_bio, $factura) {
        $parametros['idsuscripcion'] = $idSuscripcion_bio;
        $parametros['idempresa'] = $this->idempresa;
        $parametros['idusuario'] = $this->idusuario;
        $parametros['facnumero'] = $factura;
        $this->importarFacturasModel->validarFactura($parametros);
    }

    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_IMPORTAR_FACTURA_BIO_ACE;
            $proceso['idAcceso'] = $this->sesion['idacceso'];
            $proceso['idEmpresa'] = $this->idempresa;
            $proceso['idHilo'] = $this->idproceso;
            $this->idControlProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function actualizarRegistro($idtemporal, $estado, $mensaje) {
        try {
            $this->conexion->beginTransaction();
            $this->importarFacturasModel->actualizarRegistroProceso($idtemporal, $estado, $mensaje);
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            $this->conexion->commit();
        } catch (Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Finalizar proceso
     */
    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idControlProceso);
            $this->conexion->commit();
        } catch (Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    public function creaSuscripcionesHomologadas($idProceso) {
        $resultado = $this->importarFacturasModel->buscaSuscripcionesHomologar($this->idusuario, $idProceso);
        print_r($resultado);
        if (!empty($resultado)) {
            foreach ($resultado AS $datos) {
                print_r("\nSe crea Nueva suscripciones ==>  ");
                print_r($datos);
                $this->conexion->beginTransaction();
                $this->idempresa == CODIGO_ACESEGUROS || $this->idempresa ==  CODIGO_SERFULLANOS ? $this->registrarSuscripcion($datos, $idusuario, $idProceso) : $this->registrarPropiedad($datos, $idProceso);
            }
        }
    }

    public function registrarPropiedad($datos, $idProceso) {
        $idTercero = $datos["idtercero"];
        $numeroPropiedad = $datos["numeropropiedad"];
        $datosPropiedad = $this->importarFacturasModel->consultarPropiedad($idTercero, $numeroPropiedad);
        $datosPropiedad["descripcionpropiedad"] = "nuevo";
        $datosPropiedad["prodigitos"] = 0;
        $datosPropiedad["usuideregistro"] = $this->idusuario;
        $datosPropiedad["idtercero"] = $datos["idtercero"];

        $resultado = $this->importarFacturasModel->insertarPropiedadSuscripcion($datosPropiedad);

        if (!is_numeric($resultado) || $resultado < 0) {
            print_r("\nError, No se creo la propiedad  ==>  " . $resultado . " Transacion No. -->" . $datos['ipfe_ideregistr'] . "n");
            $this->conexion->rollBack();
            $this->actualizarRegistro($datos['ipfe_ideregistr'], 'E', 'La Propiedad no se pudo Insertar ');
            return;
        }

        $suscripcion = $this->registrarSuscripcion($datos, $datosPropiedad, $idProceso);
        return $suscripcion;
    }

    public function registrarSuscripcion($datos, $idPropiedad, $idProceso) {
        $idusuario = $this->idusuario;
        $parametros['estadosuscripcion'] = $datos['estadosuscripcion'];
        if ($this->idempresa == CODIGO_ACESEGUROS || $this->idempresa ==  CODIGO_SERFULLANOS) {
            $parametros["descripciontiposuscripcion"] = 'UsoSeguros';
            $parametros["idtipousosuscripcion"] = ESTRUCTURA_UNIDAD_TIPO_USO_ACE;
            $parametros["idesttipouso"] = ESTRUCTURA_TIPOUSOACE;
            $parametros["idtiposuscripcion"] = ESTRUCTURA_UNIDAD_TIPOSUSCRIPCIONACE;
            $parametros["idesttipsuscripcion"] = ESTRUCTURA_TIPOSUSCRIPCIONACE;
            $parametros["idestliquidacion"] = ESTRUCTURA_LIQUIDACION_SEGUROS;
            $parametros["idliquidacion"] = ESTRUCTURA_UNIDAD_LIQUIDACION_ACE;
        }

        if ($this->idempresa == CODIGO_BIOAGRICOLA) {
            $parametros["descripciontiposuscripcion"] = 'UsoBio';
            $parametros["idtipousosuscripcion"] = $datos["tipouso"];
            $parametros["idesttipouso"] = ESTRUCTURA_TIPOUSOBIO;
            $parametros["idtiposuscripcion"] = ESTRUCTURA_UNIDAD_TIPOSUSCRIPCIONBIO;
            $parametros["idesttipsuscripcion"] = ESTRUCTURA_TIPOSUSCRIPCIONBIO;
            $parametros["idestliquidacion"] = ESTRUCTURA_LIQUIDACION_ASEO;
            $parametros["idliquidacion"] = ESTRUCTURA_UNIDAD_LIQUIDACION_BIO;
        }

        $parametros["codigoanterior"] = $datos["dsus_pcodigo_bio"];
        $parametros["idsuscriptor"] = $datos["idsuscriptor"];
        $parametros["idtercero"] = $datos["idtercero"];
        $this->idempresa == CODIGO_ACESEGUROS  || $this->idempresa ==  CODIGO_SERFULLANOS ? $parametros["numeropropiedad"] = $datos["idpropied"] : $parametros["numeropropiedad"] = $idPropiedad["numeropropiedad"];
        $parametros["idmunicipio"] = $datos["idmunicipio"];
        $parametros["idbarrio"] = $datos["idbarrio"];
        $parametros["idempresa"] = $this->idempresa;
        $parametros["idciclo"] = $datos["idciclo"];
        $parametros["fecinicio"] = 'NOW()';
        $parametros["estrato"] = $datos["estrato"];
        $parametros["idfactor"] = 0;
        $parametros["usuideregistro"] = $this->idusuario;
        $resultado = $this->importarFacturasModel->insertarSuscripcion($parametros);
        if (!is_numeric($resultado) || $resultado <= 0) {
            print_r("\nError, No se creo la Suscripcion  ==>  " . $resultado . " Transacion No. -->" . $datos['ipfe_ideregistr']);
            $this->conexion->rollBack();
            $this->actualizarRegistro($datos['ipfe_ideregistr'], 'E', 'Error, Insertando la Suscripcion ');
            return;
        }
        $parametros["idsuscripcion"] = $resultado;
        $parametros["idruta"] = $datos["idruta"];
        $parametros["idsecuencia"] = $datos["idsecuencia"];

        $respuestaRuta = $this->importarFacturasModel->insertarRelacionRuta($parametros);
        if (!is_numeric($respuestaRuta) || $respuestaRuta <= 0) {
            print_r("\nError, Insertando la Relacion de la Ruta y la Suscripción   ==>  " . $respuestaRuta . " Transacion No. -->" . $datos['ipfe_ideregistr']);
            $this->conexion->rollBack();
            $this->actualizarRegistro($datos['ipfe_ideregistr'], 'E', 'Error, Insertando la Relacion de la Ruta y la Suscripción ');
            return;
        }
        $idConvenio = $this->obtenerNuevoConvenio($datos["idconvenio"]);
        if (empty($idConvenio) || $idConvenio < 0) {
            print_r("\nError, Id del convenio no actualizado  ==>  " . $idConvenio . " Transacion No. -->" . $datos['ipfe_ideregistr']);
            $this->conexion->rollBack();
            $this->actualizarRegistro($datos['ipfe_ideregistr'], 'E', 'Error, Id del convenio no actualizado ');
            return;
        }
        $respuestaConvenio = $this->importarFacturasModel->actualizaConvenio($parametros["idsuscriptor"], $idConvenio);
        //actualizar el convenio del suscriptor}

        if (empty($respuestaConvenio)) {
            print_r("\nError, No se Actualizo el Convenio  ==>  " . $respuestaConvenio . " Transacion No. -->" . $datos['ipfe_ideregistr']);
            $this->conexion->rollBack();
            $this->actualizarRegistro($datos['ipfe_ideregistr'], 'E', 'Error, No se Actualizo el Convenio');
            return;
        }
        $parametros["idtipotercero"] = $datos["idtipotercero"];
        $this->conexion->commit();
        return $parametros;
    }

    public function obtenerNuevoConvenio($idConvenioActual) {
        return $this->importarFacturasModel->getConvenioHomologar($idConvenioActual, $this->idempresa);
    }

    public function cuentaSuscriptoresParaDeshomologar($idProceso) {
        $this->idempresa;
        $this->idusuario;
        $idsuscripcionesDesHomologar = $this->importarFacturasModel->cuentaSuscriptores($this->idusuario, $this->idempresa, $idProceso);
        print_r("\nsuscripcionesDesHomologar ==>  \n");
        print_r($idsuscripcionesDesHomologar);
        foreach ($idsuscripcionesDesHomologar as $suscripcion) {
            $parametros['tercero'] = $suscripcion['idtercero'];
            $parametros['idconvenio'] = $this->idempresa == CODIGO_ACESEGUROS ? 4 : 3;
            $parametros['sus_modconvenio'] = "N";
            $parametros['sus_descripcion'] = "proceso de Importación";
            $parametros['idusuario'] = $this->idusuario;
            print_r("\nCreando suscriptor ==>  \n");
            $idSuscriptorNuevo = $this->importarFacturasModel->crearSuscriptorNuevo($parametros);
            print_r("\nsuscriptor ==>  \n" . $idSuscriptorNuevo);
            $this->importarFacturasModel->actualizarSuscripcion($suscripcion, $idSuscriptorNuevo);
            //  $this->insertarClienteDeshomologado($suscripcion, $idSuscriptorNuevo);
        }
    }

    public function insertarClienteDeshomologado($suscripcion, $idSuscriptorNuevo) {
        print_r("\nCreando  Cliente Deshomologado ==>  \n   " . $suscripcion['idsuscripciones'] . "   ______ \n");
        $parametros = array();
        $parametros['idsuscripcion'] = $suscripcion['idsuscripciones'];
        $parametros['idsuscriptor'] = $idSuscriptorNuevo;
        $parametros['idusuario'] = $this->idusuario;
        $idtemporal = $this->importarFacturasModel->insertarClienteDeshomologadoTemporal($parametros);
        print_r("\n id  ==>  " . $idtemporal);
    }

    public function actualizaConvenio($idSuscriptor, $ipfeIderegistr) {
        $datos = $this->importarFacturasModel->buscaConvenioActual($idSuscriptor);
        $idConvenio = $this->obtenerNuevoConvenio($datos["idconvenio"]);
        if (empty($idConvenio)  || $idConvenio < 0) {
            print_r("\nError, Id del convenio no actualizado  ==>  " . $idConvenio . " Suscriptor No. -->" . $idSuscriptor);
            $this->conexion->rollBack();
            $this->actualizarRegistro($ipfeIderegistr, 'E', 'Error, Id del convenio no actualizado ');
            return;
        }
        $respuestaConvenio = $this->importarFacturasModel->actualizaConvenio($idSuscriptor, $idConvenio);
        //actualizar el convenio del suscriptor}
    }

}
