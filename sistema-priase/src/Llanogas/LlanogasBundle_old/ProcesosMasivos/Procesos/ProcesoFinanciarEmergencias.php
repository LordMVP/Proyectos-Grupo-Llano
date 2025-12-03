<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoFinanciaEmergenciaModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\ConceptosUtil;

/**
 * Description of ProcesoFinanciarEmergencias
 *
 * @author oabaquero
 */
class ProcesoFinanciarEmergencias {

    private $idEmpresa;
    private $idCiclo;
    private $idAcceso;
    private $idUsuario;

    /**
     *
     * @var Connection
     */
    private $conexion;

    /**
     *
     * @var procesoFinanciaEmergenciaModel
     */
    private $procesoFinanciaEmergenciaModel;

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
     * @var type integer
     */
    private $cantidadProcesosActivos;

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
     * Constructor de la clase
     * @param type $idEmpresa id de la empresa enviada al hilo por el controller
     * @param type $idCiclo id del ciclo a aplicar financiacion emergencia
     * enviado por el controller
     * @param type $idActividad id de la actividad que se va a ejecutar para el 
     * proceso enviado por el controller
     * @param type $idAcceso id del acceso que uso el usuario para ejecutar el 
     * proceso
     * @param type $idUsuario id del usuario que ejecuta el proceso
     */
    function __construct($idEmpresa, $idCiclo, $idAcceso, $idUsuario, $idProceso = null) {
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
        $this->idHilo = $idProceso;
        $this->facturasGeneradas = 0;
        $this->conexion = ConexionBD::getConexion();
        $this->procesoFinanciaEmergenciaModel = new ProcesoFinanciaEmergenciaModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }

    public function cargarSuscripcionesFinanciar($idSuscripcion = null) {
        $this->vaciarTablaResumen();
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idtipodocumentos'] = TIPODOCUMENTOEMERGENCIA;
        $parametros['iddocumentos'] = DOCUMENTOEMERGENCIA;
        $parametros['estrato'] = ESTRATOEMERGENCIA;
        $parametros['tipusosuscr'] = TIPOUSOEMERGENCIA;
        $parametros['numerocuotas'] = CUOTAEMERGENCIA;
        $parametros['saldobaseemergencia'] = SALDOBASEEMERGENCIA;
        $parametros['liquidacionemergancia'] = LIQUIDACIONEMERGENCIA;
        $parametros["idciclo"] = $this->idCiclo;
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        $parametros["numeroprocesos"] = NUMERO_HILOS_FINANCIA_EMERGENCIA;
        $this->procesoFinanciaEmergenciaModel->cargarSuscripcionesFinanciar($parametros);
    }

    public function cargarSuscripcionesFinanciarPotenza($idSuscripcion = null) {
        $this->vaciarTablaResumenPotenza();
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        $parametros["numeroprocesos"] = NUMERO_HILOS_FINANCIA_EMERGENCIA;
        $this->procesoFinanciaEmergenciaModel->cargarSuscripcionesFinanciarPotenza($parametros);
    }

    public function consultarCantidadSuscripciones() {
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        return $this->procesoFinanciaEmergenciaModel->consultarCantidadSuscripciones($parametros);
    }

    public function consultarCantidadSuscripcionesPotenza() {
        $parametros['idempresa'] = $this->idEmpresa;
        $parametros['idusuario'] = $this->idUsuario;
        return $this->procesoFinanciaEmergenciaModel->consultarCantidadSuscripcionesPotenza($parametros);
    }

    // <editor-fold desc="suscripcion">  

    /**
     * Permite listar las facturas de una suscripcion asociadas al documetno
     * @param int $idSuscripcion
     * @param int $idDocumento
     * @param int $idTipoDocumento
     * @return Array Facturas
     */
    public function consultarFacturasSuscripcionDocumento($idSuscripcion, $idDocumento, $idTipoDocumento, $idconceptodescarte) {
        return $this->procesoFinanciaEmergenciaModel->consultarFacturasPorSuscripcionDocumentoModel($idSuscripcion, $idDocumento, $idTipoDocumento, $idconceptodescarte);
    }

    /*
     * Se procesaran los tipos de documentos y tipos de documentosde las suscripciones cargadas
     * 
     */

    private function procesarSuscripciones($suscripciones) {
        try {
            if ($this->idHilo != 1) {
                print_r("Recorriendo las suscripciones a financiar\n");
            }
            foreach ($suscripciones as $Suscripcion) {
                if ($this->idHilo != 1) {
                    print_r($Suscripcion['idsuscripcion']);
                }
                $valorFinanciar = 0;
                $this->conexion->beginTransaction();
                $financiacion = array();
                $financiacion['idsuscripcion'] = $Suscripcion['idsuscripcion'];
                $financiacion['idsolicitante'] = $Suscripcion['ter_idesolicita'];
                $financiacion['identidad'] = $Suscripcion['identidadfinanciera'];
                $financiacion['numcuotas'] = $Suscripcion['numerocuotas'];
                $financiacion['archivos'] = '';
                $financiacion['idparentesco'] = '';
                $financiacion['personanatural'] = '';
                $financiacion['personajuridica'] = '';
                $financiacion['tipocaso'] = $Suscripcion['tipocaso'];

                $Suscripcion['idtipodocumentos'] = $Suscripcion['idtipdocument'];
                // Se arma la estructura para la financiacion para estarato 1,2 con tipoCaso = 0 
                // ya que esta se financia el valor de consumo basico en el concepto 42 
                // y el consumo superior en el concepto 3137
                $financiacion['dataestrato12'] = "";
                $financiacion['dataestrato12']['valores'] = "";
                $financiacion['dataestrato12']['valores']['error'] = 0;
                if ($Suscripcion['tipocaso'] == 0) {
                    if ($this->idHilo != 1) {
                        print_r("\nSuscripcion del tipocaso 0 \n");
                    }
                    $financiacion['dataestrato12'] = $this->getValorFinanciar($Suscripcion);
                }
                if ($financiacion['dataestrato12']['valores']['error'] == 1) {
                    throw new MyException('Error al crear la financiación de la suscripcion, No hay valor a Financiar ' . $Suscripcion['idsuscripcion'], -1);
                }

                $valorFinanciar = ($Suscripcion['totalconsumo'] + $Suscripcion['tarifabasica']);
                if ($valorFinanciar == 0) {
                    $Suscripcion['estado'] = 'E';
                    $Suscripcion['mensaje'] = 'El valor de totalconsumo mas tarifabasica es igual a cero';
                    $this->procesoFinanciaEmergenciaModel->setTemporalEstado($Suscripcion);
                    $this->conexion->commit();
                    continue;
                }
                $factura = array();
                $Suscripcion['iddocumentos'] = DOCUMENTOEMERGENCIA;
                $financiacion['valorTotalFinanciar'] = $valorFinanciar;
                $financiacion['valorfinanciable'] = $valorFinanciar;
                $factura['idfactura'] = $Suscripcion['fac_ideregistro'];
                $factura['valorfinanciar'] = $financiacion['valorfinanciable'];
                $factura['version'] = $Suscripcion['fac_version'];
                $financiacion['idtipodocumento'] = $Suscripcion['idtipdocument'];
                $financiacion['idtipodocumentoemergencia'] = $Suscripcion['idtipdocument'];
                $financiacion['idempresa'] = $Suscripcion['emp_ideregistro'];
                //$financiacion['idliquidacion'] = $this->procesoFinanciaEmergenciaModel->getLiquidacionEmergencia($financiacion);
                $financiacion['idliquidacion'] = $Suscripcion['idliquidacion'];
                $financiacion['facturas'] = $factura;
                $this->CrearNuevaFinanciacion($financiacion);
                $Suscripcion['estado'] = 'G';
                $Suscripcion['mensaje'] = 'Generada Correctamente';
                $this->procesoFinanciaEmergenciaModel->setTemporalEstado($Suscripcion);
                $this->conexion->commit();
            }
            if ($this->idHilo != 1) {
                print_r("\nTermina recorrido de las suscripciones y se inicia validacion de control proceso \n");
            }
            if ($this->idHilo == 1) {
                $listaFacturas = $this->procesoFinanciaEmergenciaModel->consultarSuscripcionesPorProceso($this->idEmpresa, $this->idHilo);
                if (!empty($listaFacturas)) {
                    return;
                }

                $this->consultarProcesoActivo();
                while ($this->cantidadProcesosActivos > 0) {
                    $this->consultarProcesoActivo();
                    sleep(5);
                }
                $facturasNotasSaldos = $this->procesoFinanciaEmergenciaModel->getFacturasNotasSaldo($this->idEmpresa);
                foreach ($facturasNotasSaldos as $facturaNota) {
                    $this->conexion->beginTransaction();
                    $this->actualizarNumeroDisponible($facturaNota['idfactura'], $facturaNota['iddocumento'], $facturaNota);
                    $this->conexion->commit();
                }
            }
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getMessage());
            $this->conexion->rollBack();
            $this->conexion->beginTransaction();
            $Suscripcion['mensaje'] = $exc;
            $Suscripcion['estado'] = 'E';
            $this->procesoFinanciaEmergenciaModel->setTemporalEstado($Suscripcion);
            $this->conexion->commit();
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->commit();
            }
        }
    }

    public function getValorFinanciar($Suscripcion) {
        if ($Suscripcion['subsidoalcaldia'] > 0) {
            $Suscripcion['valorfinanciar'] = ($Suscripcion['valorfinanciar'] - ($Suscripcion['valorfinanciar'] * ($Suscripcion['porcentaje'] / 100)));
            $Suscripcion['valorfinanciar'] = round($Suscripcion['valorfinanciar']);
        }

        if ($Suscripcion['totalconsumosuperior'] > 0 && ($Suscripcion['totalconsumo'] > $Suscripcion['valorfinanciar'] )) {
            $Suscripcion['totalconsumosuperior'] = ($Suscripcion['totalconsumo'] - $Suscripcion['valorfinanciar']);
        }
        // este dato $Suscripcion['valorfinanciar'] es IGUAL  al valor de la ((tarifa basica * total consumo ) - el susbsidio)
        if ($Suscripcion['totalconsumo'] == ( $Suscripcion['valorfinanciar'] + $Suscripcion['totalconsumosuperior'] )) {
            $listaValores['valores']['totalconsumobasico'] = $Suscripcion['valorfinanciar'];
            $listaValores['valores']['totalconsumosuperior'] = $Suscripcion['totalconsumosuperior'];
            $listaValores['valores']['error'] = 0;
            return $listaValores;
        }
        // 5 < (15 + 5)
        if ($Suscripcion['totalconsumo'] < ( $Suscripcion['valorfinanciar'] + $Suscripcion['totalconsumosuperior'] )) {
            if ($Suscripcion['totalconsumo'] < $Suscripcion['valorfinanciar']) {
                $listaValores['valores']['totalconsumobasico'] = $Suscripcion['totalconsumo'];
                $listaValores['valores']['totalconsumosuperior'] = 0;
                $listaValores['valores']['error'] = 0;
                return $listaValores;
            }
            if ($Suscripcion['totalconsumo'] <= $Suscripcion['valorfinanciar']) {
                $listaValores['valores']['totalconsumobasico'] = $Suscripcion['totalconsumo'];
                $listaValores['valores']['totalconsumosuperior'] = 0;
                $listaValores['valores']['error'] = 0;
                return $listaValores;
            }
        }
        return $listaValores['valores']['error'] = 1;
    }

    public function generarFinanciacion() {
        try {
            if ($this->idEmpresa == 325) {
                $this->generarFinanciacionPotenza();
                return;
            }
            $listaFacturas = $this->procesoFinanciaEmergenciaModel->consultarSuscripcionesPorProceso($this->idEmpresa, $this->idHilo);
            if (empty($listaFacturas)) {
                return;
            }
            // cantidad de facturas a procesar
            $this->procesarSuscripciones($listaFacturas);
        } catch (\Exception$exc) {
            $this->escribeLog($exc->getMessage());
        }
        $this->generarFinanciacion();
    }

    public function generarFinanciacionPotenza() {
        try {
            $listaFacturas = $this->procesoFinanciaEmergenciaModel->consultarSuscripcionesPorProcesoPotenza($this->idEmpresa, $this->idHilo);
            if (empty($listaFacturas)) {
                return;
            }
            // cantidad de facturas a procesar
            $this->procesarSuscripcionesPotenza($listaFacturas);
        } catch (\Exception$exc) {
            $this->escribeLog($exc->getMessage());
        }
        $this->generarFinanciacionPotenza();
    }

    private function procesarSuscripcionesPotenza($suscripciones) {
        try {
            foreach ($suscripciones as $Suscripcion) {
                $this->conexion->beginTransaction();
                $financiacion = array();
                $financiacion['idsuscripcion'] = $Suscripcion['idsuscripcion'];
                $financiacion['idsolicitante'] = $Suscripcion['ter_idesolicita'];
                $financiacion['identidad'] = $Suscripcion['identidadfinanciera'];
                $financiacion['numcuotas'] = $Suscripcion['numerocuotas'];
                $financiacion['archivos'] = '';
                $financiacion['idparentesco'] = '';
                $financiacion['personanatural'] = '';
                $financiacion['personajuridica'] = '';
                $financiacion['tipocaso'] = $Suscripcion['tipocaso'];

                $Suscripcion['idtipodocumentos'] = $Suscripcion['idtipodocumento'];

                $factura = array();
                $Suscripcion['iddocumentos'] = DOCUMENTOEMERGENCIA;
                $financiacion['valorTotalFinanciar'] = $Suscripcion['valorfinanciar'];
                $financiacion['valorfinanciable'] = $Suscripcion['valorfinanciar'];
                if ($Suscripcion['fac_sdoreal'] < $financiacion['valorfinanciable']) {
                    throw new MyException('Error al crear la financiación de la suscripcion, No hay valor a Financiar Factura' . $Suscripcion['fac_ideregistro'], -1);
                    return;
                }

                $factura['idfactura'] = $Suscripcion['fac_ideregistro'];
                $factura['valorfinanciar'] = $financiacion['valorfinanciable'];
                $factura['version'] = $Suscripcion['fac_version'];
                $financiacion['idtipodocumento'] = $Suscripcion['idtipodocumento'];
                $financiacion['idempresa'] = $Suscripcion['emp_ideregistro'];
                $financiacion['idliquidacion'] = $Suscripcion['idliquidacion'];
                $financiacion['idcaso'] = $Suscripcion['tipocaso'];
                $financiacion['facturas'] = $factura;
                $this->CrearNuevaFinanciacion($financiacion);
                $Suscripcion['estado'] = 'G';
                $Suscripcion['mensaje'] = 'Generada Correctamente';
                $this->procesoFinanciaEmergenciaModel->setTemporalEstadoPotenza($Suscripcion);
                $this->conexion->commit();
            }
            if ($this->idHilo == 1) {
                $this->consultarProcesoActivo();
                while ($this->cantidadProcesosActivos > 0) {
                    $this->consultarProcesoActivo();
                    sleep(5);
                }
                $facturasNotasSaldos = $this->procesoFinanciaEmergenciaModel->getFacturasNotasSaldo($this->idEmpresa);
                foreach ($facturasNotasSaldos as $facturaNota) {
                    $this->conexion->beginTransaction();
                    $this->actualizarNumeroDisponible($facturaNota['idfactura'], $facturaNota['iddocumento'], $facturaNota);
                    $this->conexion->commit();
                }
            }
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getMessage());
            $this->conexion->rollBack();
            $this->conexion->beginTransaction();
            $Suscripcion['mensaje'] = $exc;
            $Suscripcion['estado'] = 'E';
            $this->procesoFinanciaEmergenciaModel->setTemporalEstadoPotenza($Suscripcion);
            $this->conexion->commit();
        }
    }

    /**
     * Permite construir una nueva financiación
     * @param financiaciones $financiacion
     * @return int número generado de financiación
     */
    public function CrearNuevaFinanciacion($financiacion) {
        $financiacionArmada = $this->armarFinanciacion($financiacion);
        $numfinanciacion = $this->procesarFinanciacion($financiacionArmada);

        return $numfinanciacion;
    }

    /**
     * permite armar una financiacion
     * @param financiacion $financiacion
     * @return Array Financiacion Armada
     */
    private function armarFinanciacion($financiacion) {
        /*
         * Verificar si la fecha actual es mayor  ó igual de la fecha de liquidacion 
         * 
         * return  True ó False 
         */
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($financiacion['idsuscripcion']);
        $idEmpresa = $this->idEmpresa;
        $armarFinanciacion['idempresa'] = $idEmpresa;
        $armarFinanciacion['idciclo'] = $cicloPeriodo['idciclo'];
        $armarFinanciacion['cicloanio'] = $cicloPeriodo['cicloanio'];
        $armarFinanciacion['idperiodo'] = $cicloPeriodo['idperiodo'];
        $armarFinanciacion['facturas']['facturas'] = $financiacion['facturas'];
        $armarFinanciacion['idsuscripcion'] = $financiacion['idsuscripcion'];
        $armarFinanciacion['idtipodocumento'] = $financiacion['idtipodocumento'];
        $armarFinanciacion['idsolicita'] = $financiacion['idsolicitante'];
        $armarFinanciacion['idparentesco'] = IDPARENTESCOEMERGENCIA;
        $armarFinanciacion['identidad'] = $financiacion['identidad'];
        $armarFinanciacion['numerocuotas'] = $financiacion['numcuotas'];
        $armarFinanciacion['idliquidacion'] = $financiacion['idliquidacion'];
        $armarFinanciacion['valortotalfinanciar'] = $financiacion['valorTotalFinanciar'];
        $armarFinanciacion['idusuario'] = $this->idUsuario;
        $iddocumento = $this->genericoModel->getDocumentoLiquidacion($financiacion['idliquidacion']);
        $armarFinanciacion['iddocumento'] = $iddocumento['iddocumento'];
        $armarFinanciacion['valorfinanciable'] = $financiacion['valorfinanciable'];
        $armarFinanciacion['tipocaso'] = $financiacion['tipocaso'];
        if (empty($armarFinanciacion['idfinanciacion'])) {
            $idfinanciacion = $this->obtenerSecuenciaFinanciacion();
            $armarFinanciacion['idfinanciacion'] = $idfinanciacion['idfinanciacion'];
        }
        if ($financiacion['tipocaso'] == 0) {
            $armarFinanciacion['dataestrato12'] = $financiacion['dataestrato12'];
            $armarFinanciacion['tipocaso'] = $financiacion['tipocaso'];
        }
        return $armarFinanciacion;
    }

    /**
     * Genera el proceso de guardado en base de datos de la financiación. teniendo en cuenta sus reglas de negocio
     * @param financiacion $financiacion
     */
    public function procesarFinanciacion(&$financiacion) {
        $financiacion['idusuario'] = $this->idUsuario;
        $this->crearFinanciacion($financiacion);
        $this->procesarNotas($financiacion);
        return $financiacion['idfinanciacion'];
    }

    /**
     * Inicial el proceso de generar una nueva financiación
     * @param type $financiacion
     */
    private function crearFinanciacion(&$financiacion) {
        if (empty($financiacion['idfinanciacion'])) {
            $financiacion['idfinanciacion'] = $this->procesoFinanciaEmergenciaModel->obtenerSecuenciaFinanciacion();
        }
        $this->procesoFinanciaEmergenciaModel->insertarFinanciacionModel($financiacion);
        $financiacion['cuotasamortizadas'] = 0;
        $financiacion['estado'] = 'A';
        $idAmortizacionFinanciacion = $this->procesoFinanciaEmergenciaModel->insertarAmortizacionFinanciacionModel($financiacion);
        $financiacion['idamortizacionfinanciacion'] = $idAmortizacionFinanciacion;
    }

    /**
     * permite procesar las notas de la financiación
     * @param array $financiacion
     */
    private function procesarNotas(&$financiacion) {
        foreach ($financiacion['facturas'] as $factura) {
            $infoFacturaInicial = $this->obtenerFacturaInicial($factura['idfactura']);
            $infoFacturaInicial['valorfinanciar'] = $factura['valorfinanciar'];
            $infoFacturaInicial['version'] = $factura['version'];
            //NF   Nota financiación => Es lo que se le resta a la factura que fue financiada (VALOR FINANCIADO, negativa) 
            $this->procesarNotaFactura($infoFacturaInicial, $financiacion);
            $infoFacturaInicialActualizada['version'] = $factura['version'];
            if (($infoFacturaInicial['saldofactura'] - $factura['valorfinanciar']) > 0) {
                //SF   Saldo financiacion => Es el resultado (SALDO LUEGO FINANCIACIÓN, negativa)
                $infoFacturaInicialActualizada = $this->procesarNotasSaldos($financiacion, $infoFacturaInicial);
                //FF Factura financiada => Esta es la factura que queda para que el usuario pague el saldo de la financiación
                $this->procesarFacturasSaldos($infoFacturaInicialActualizada, $financiacion, $infoFacturaInicial);
            }
            $this->actualizarFacturaFinanciada($factura['idfactura'], $financiacion['idfinanciacion']);
            $this->genericoDelegado->actualizarFacturaSaldo($factura['idfactura'], $infoFacturaInicialActualizada['version']);
        }
    }

    /**
     * Méotod encargado de realizar la nota de financiación  la NF 
     * @param type $infoFacturaInicial
     * @param array $financiacion
     */
    private function procesarNotaFactura(&$infoFacturaInicial, &$financiacion) {
        $idNota = $this->procesoFinanciaEmergenciaModel->insertarNotaModel($financiacion);
        $financiacion['idnotanueva'] = $idNota;
        $infoNotaTipo = $this->procesoFinanciaEmergenciaModel->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicial['iddocumento'], $infoFacturaInicial['idtipodocumento'], 'NF');
        $idFacturaNF = $this->procesoFinanciaEmergenciaModel->insertarFacturaNotaModel($infoFacturaInicial, $infoNotaTipo, $financiacion);
        $this->insertarDetalleNotaFactura($financiacion, $idFacturaNF, $infoFacturaInicial);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaNF, 1, 'NT');
    }

    /**
     * Permite actualizar un nuevo numero disponible para procesar las nuevas notas
     * @param array $infoFacturaNotas recibe los siguientes parámetros requeridos de la factura idinfofactura, factura creada , iddocumento , idtipodocumento ,idempresa
     */
    private function actualizarNumeroDisponible($idFactura, $idDocumento, &$infoFacturaInicial) {
        $infoFactura['idempresa'] = $infoFacturaInicial['idempresa'];
        $infoFactura['iddocumento'] = $idDocumento;
        $infoFactura['idtipodocumento'] = $infoFacturaInicial['idtipodocumento'];
        $infoFactura['tipo'] = 'FA';
        $infoNumero = $this->procesoFinanciaEmergenciaModel->obtenerNumeroFacturaModel($infoFactura);
        $parametros['fac_numero'] = $infoNumero['numero'];
        $parametros['fac_ideregistro'] = $idFactura;
        $parametros['fac_estado'] = 'A';
        $this->procesoFinanciaEmergenciaModel->actualizarFacturaModel($parametros);
        $this->genericoModel->actualizarNumeroDisponible($infoNumero['numero'], $infoNumero['idnumero']);
    }

    /**
     * Genera los detalles de una nota ya sea por la nota NF o SF
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleNotaFactura(&$financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->procesoFinanciaEmergenciaModel->consultarDetalleFacturaSaldoModel($infoFacturaInicial['idfactura'], $this->idEmpresa);
        $valorFinanciableNoFinanciable = $this->procesoFinanciaEmergenciaModel->getValorFinanciableNoFinanciable($infoFacturaInicial['idfactura'], $this->idEmpresa);
        $contador = 1;
        $acumuladoPagoRealConcepto = 0;
        foreach ($listaDetallesFactura as $detalleFactura) {
            /**
             * Realiza el redondeo de los detalles de financiación
             */
            $pagorealconcepto = Util::ponderarConcepto($detalleFactura['saldo'], $valorFinanciableNoFinanciable['valorfinanciable'], $infoFacturaInicial['valorfinanciar']);
            $pagorealconcepto = $this->redondearValor($detalleFactura, $pagorealconcepto);
            $acumuladoPagoRealConcepto = $acumuladoPagoRealConcepto + $pagorealconcepto;
            if ($contador++ == count($listaDetallesFactura)) {
                $pagorealconcepto = $infoFacturaInicial['valorfinanciar'] - ($acumuladoPagoRealConcepto - $pagorealconcepto);
            }
            $detalleFactura['idempresa'] = $financiacion['idempresa'];
            $detalleFactura['idfinanciacion'] = $financiacion['idfinanciacion'];
            $detalleFactura['saldo'] = abs($pagorealconcepto) * -1;
            $detalleFactura['valortotal'] = abs($pagorealconcepto);
            $detalleFactura['valorunitario'] = $pagorealconcepto;
            $detalleFactura['valorreal'] = ($pagorealconcepto) * -1;
            $detalleFactura['idfactura'] = $idFacturaNota;
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->idUsuario;
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $idDetalleFacturaNota = $this->procesoFinanciaEmergenciaModel->insertarDetalleFacturaNotaModel($detalleFactura, 'NF');
            $this->procesoFinanciaEmergenciaModel->insertarNotaFacturaModel($financiacion['idnotanueva'], $idDetalleFacturaNota, $detalleFactura, $infoFacturaInicial['idfactura']);
            if ($financiacion['tipocaso'] == 0 && $detalleFactura['idconcepto'] == 42 && $financiacion['dataestrato12']['valores']['totalconsumosuperior'] > 0) {
                $detalleFactura['saldo'] = abs($financiacion['dataestrato12']['valores']['totalconsumobasico']) * -1;
                $detalleFactura['valortotal'] = abs($financiacion['dataestrato12']['valores']['totalconsumobasico']);
                $detalleFactura['valorunitario'] = $financiacion['dataestrato12']['valores']['totalconsumobasico'];
                $detalleFactura['valorreal'] = ($financiacion['dataestrato12']['valores']['totalconsumobasico']) * -1;
                $this->insertarDetalleFinanciacion($detalleFactura, $financiacion, $infoFacturaInicial);
                $detalleFactura['saldo'] = abs($financiacion['dataestrato12']['valores']['totalconsumosuperior']) * -1;
                $detalleFactura['valortotal'] = abs($financiacion['dataestrato12']['valores']['totalconsumosuperior']);
                $detalleFactura['valorunitario'] = $financiacion['dataestrato12']['valores']['totalconsumosuperior'];
                $detalleFactura['valorreal'] = ($financiacion['dataestrato12']['valores']['totalconsumosuperior']) * -1;
                $detalleFactura['idconcepto'] = 3137;
                $this->insertarDetalleFinanciacion($detalleFactura, $financiacion, $infoFacturaInicial);
            } else {
                $this->insertarDetalleFinanciacion($detalleFactura, $financiacion, $infoFacturaInicial);
            }
        }
    }

    /**
     * Genera los detalles de financiación con toda la información de las facturas 
     * que se vieron involucradas en el proceso de la financiación
     * @param array $detalleFactura
     * @param array $financiacion
     * @param type $infoFacturaInicial
     */
    public function insertarDetalleFinanciacion(array $detalleFactura, array $financiacion, &$infoFacturaInicial) {
        $detalleFinanciacion['idfinanciacion'] = $financiacion['idfinanciacion'];
        $detalleFinanciacion['iddetallefactura'] = $detalleFactura['iddetallefactura'];
        $detalleFinanciacion['fac_ideregistro'] = $infoFacturaInicial['idfactura'];
        $detalleFinanciacion['idsuscripcion'] = $detalleFactura['idsuscripcion'];
        $detalleFinanciacion['idliquidacion'] = $financiacion['idliquidacion'];
        $detalleFinanciacion['idconcepto'] = $detalleFactura['idconcepto'];
        $detalleFinanciacion['valortotal'] = abs($detalleFactura['valortotal']);
        $detalleFinanciacion['valorunitario'] = abs($detalleFactura['valortotal']);
        $detalleFinanciacion['saldo'] = abs($detalleFactura['saldo']);
        $detalleFinanciacion['valorreal'] = abs($detalleFactura['saldo']);
        $detalleFinanciacion['idciclo'] = $financiacion['idciclo'];
        $detalleFinanciacion['idperiodo'] = $financiacion['idperiodo'];
        $detalleFinanciacion['idempresa'] = $this->idEmpresa;
        $detalleFinanciacion['idusuario'] = $this->idUsuario;
        $detalleFinanciacion['cic_ano'] = $financiacion['cicloanio'];
        $this->procesoFinanciaEmergenciaModel->insertarDetalleFinanciacionModel($detalleFinanciacion);
    }

    public function redondearValor($infoConcepto, $valor) {
        //   print_r($infoConcepto['metodo']);

        if ($infoConcepto['metodo'] === 'T') {
            return int($valor);
        }
        if ($infoConcepto['metodo'] === 'R') {
            return round($valor, $infoConcepto['precision']);
        }
        return $valor;
    }

    /**
     * permite procesar las notas de la financiación
     * @param array $financiacion
     */
    private function procesarNotasSaldos($financiacion, &$infoFacturaInicial) {
        $idNota = $this->procesoFinanciaEmergenciaModel->insertarNotaModel($financiacion);
        $financiacion['idnotanueva'] = $idNota;
        $this->genericoDelegado->actualizarFacturaSaldo($infoFacturaInicial['idfactura'], $infoFacturaInicial['version']);
        $infoFacturaInicialActualizada = $this->obtenerFacturaInicial($infoFacturaInicial['idfactura']);
        $infoFacturaInicialActualizada['valorfinanciar'] = $infoFacturaInicialActualizada['saldofactura'];
        $infoNotaTipo = $this->procesoFinanciaEmergenciaModel->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicialActualizada['iddocumento'], $infoFacturaInicialActualizada['idtipodocumento'], 'SF');
        $idFacturaSF = $this->procesoFinanciaEmergenciaModel->insertarFacturaNotaModel($infoFacturaInicialActualizada, $infoNotaTipo, $financiacion);
        $this->insertarDetalleNotaFacturaSaldo($financiacion, $idFacturaSF, $infoFacturaInicialActualizada);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaSF, 1, 'NT');
        return $infoFacturaInicialActualizada;
    }

    /**
     * Genera la nota de la parte que el usuario no financió
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleNotaFacturaSaldo($financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->genericoModel->getConceptos($infoFacturaInicial['idfactura']);
        foreach ($listaDetallesFactura as $detalleFactura) {
            if ($detalleFactura['saldo'] <= 0) {
                continue;
            }
            $detalleFactura['cantidad'] = 1;
            $detalleFactura['valortotal'] = $detalleFactura['saldo'];
            $detalleFactura['valorreal'] = $detalleFactura['saldo'] * -1;
            $detalleFactura['valorunitario'] = $detalleFactura['saldo'];
            $detalleFactura['idfactura'] = $idFacturaNota;
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->idUsuario;
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $detalleFactura['saldo'] = $detalleFactura['saldo'] * -1;
            $idDetalleFacturaNota = $this->procesoFinanciaEmergenciaModel->insertarDetalleFacturaNotaModel($detalleFactura, 'SF');
            $this->procesoFinanciaEmergenciaModel->insertarNotaFacturaModel($financiacion['idnotanueva'], $idDetalleFacturaNota, $detalleFactura, $infoFacturaInicial['idfactura']);
            $detalleFactura = array();
        }
    }

    /**
     * Permite actualizar la factura para dejarla como financiada
     * @param int $idfactura
     */
    private function actualizarFacturaFinanciada($idfactura, $idfinanciacion) {
        $parametros['fac_estado'] = 'F';
        $parametros['fac_fecfinancia'] = 'now()';
        $parametros['fac_ideregistro'] = $idfactura;
//$parametros['fin_ideregistro'] = $idfinanciacion;
        $this->procesoFinanciaEmergenciaModel->actualizarFacturaModel($parametros);
    }

    /**
     * Método encargado de generar la nueva factura con el saldo 
     * que el usuario no financió
     * @param type $infoFacturaInicialActualizada
     * @param type $financiacion
     * @param type $infoFacturaInicial
     */
    private function procesarFacturasSaldos($infoFacturaInicialActualizada, $financiacion, &$infoFacturaInicial) {
        $tipoDocumentoFacturaSaldo = $this->procesoFinanciaEmergenciaModel->consultarDetalleDocumentoTipoDocumentoModel($infoFacturaInicial['iddocumento'], $infoFacturaInicial['idtipodocumento'], 'FF');
        $idFacturaFF = $this->procesoFinanciaEmergenciaModel->insertarFacturaSaldoModel($infoFacturaInicial, $infoFacturaInicialActualizada, $tipoDocumentoFacturaSaldo, $financiacion);
        $this->insertarDetalleFacturaSaldo($financiacion, $idFacturaFF, $infoFacturaInicial);
        $this->genericoDelegado->actualizarFacturaSaldo($idFacturaFF, 1);
    }

    /**
     * Inserta los de talles de la nota de financiación que el usuario financió
     * @param type $financiacion
     * @param type $idFacturaNota
     * @param type $infoFacturaInicial
     */
    private function insertarDetalleFacturaSaldo($financiacion, $idFacturaNota, &$infoFacturaInicial) {
        $listaDetallesFactura = $this->genericoModel->getConceptos($infoFacturaInicial['idfactura']);
        foreach ($listaDetallesFactura as $detalleFactura) {
            $detalleFactura['valortotal'] = $detalleFactura['saldo'];
            $detalleFactura['valorreal'] = $detalleFactura['saldo'];
            $detalleFactura['cic_ano'] = $financiacion['cicloanio'];
            $detalleFactura['idusuario'] = $this->idUsuario;
            $detalleFactura['fac_ideregistro'] = $idFacturaNota;
            $detalleFactura['idciclo'] = $financiacion['idciclo'];
            $detalleFactura['idperiodo'] = $financiacion['idperiodo'];
            $this->procesoFinanciaEmergenciaModel->insertarDetalleFacturaNotaModel($detalleFactura, 'FF');
        }
    }

    /**
     * obtiene las facturas configurando el nuevo padre
     * @param int $idfactura
     * @param array $parametros
     * @param int $valorfinanciar
     * @return array Infofacturaspadre
     */
    private function obtenerFacturaInicial($idfactura) {
        return $this->procesoFinanciaEmergenciaModel->consultarFacturaModel($idfactura);
    }

    /**
     * permite obtener la secuencia de la financiacion
     * @return int secuencia financiacion
     */
    public function obtenerSecuenciaFinanciacion() {
        $respuesta = $this->procesoFinanciaEmergenciaModel->obtenerSecuenciaFinanciacion();
        return $respuesta;
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
            $proceso['idPrograma'] = PROGRAMA_FINANCIA_EMERGENCIA;
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
            $this->procesoModel->finalizarProceso($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function vaciarTablaResumen() {
        $this->conexion->beginTransaction();
        try {
            $tablaExiste = $this->procesoFinanciaEmergenciaModel->validarExisteTablaProceso();

            if ($tablaExiste > 0) {
                $this->procesoFinanciaEmergenciaModel->vaciarTablaResumen($this->idEmpresa);
            } else {
                $this->procesoFinanciaEmergenciaModel->crearTablaResumenFinanciaEmergencia();
            }
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function vaciarTablaResumenPotenza() {
        $this->conexion->beginTransaction();
        try {
            $tablaExiste = $this->procesoFinanciaEmergenciaModel->validarExisteTablaProcesoPotenza();

            if ($tablaExiste > 0) {
                $this->procesoFinanciaEmergenciaModel->vaciarTablaResumenPotenza($this->idEmpresa);
            } else {
                $this->procesoFinanciaEmergenciaModel->crearTablaResumenFinanciaEmergenciaPotenza();
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

    public function consultarProcesoActivo() {
//        $conexion = ConexionBD::getConexion();
        $objProcesoModel = new ProcesoModel($this->conexion);
        $proceso['idPrograma'] = PROGRAMA_FINANCIA_EMERGENCIA;
        $proceso['idAcceso'] = $this->idAcceso;
        $proceso['idEmpresa'] = $this->idEmpresa;
        $proceso['idproceso'] = $this->idHilo;
        $this->cantidadProcesosActivos = $objProcesoModel->getCantidadProcesosActivos($proceso);
//        $conexion->close();
    }

}
