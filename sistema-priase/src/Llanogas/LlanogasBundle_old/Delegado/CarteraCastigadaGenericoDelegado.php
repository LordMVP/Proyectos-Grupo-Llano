<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Llanogas\LlanogasBundle\Models\ProcesoModel;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas
 * fecha  : 23-09-2015
 * 
 */
class CarteraCastigadaGenericoDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

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
     * @var \Llanogas\LlanogasBundle\Models\CarteraCastigadaGenericoModel
     */
    private $CarteraCastigadaModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\SuspensionModel
     */
    private $SuspensionModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProcesoModel 
     */
    private $procesoModel;
    private $idsuscripcion;
    private $idempresa;
    private $idusuario;
    private $idproceso;
    private $idciclo;

    /**
     *
     * @var int filasafectadas
     */
    private $filasAfectadas;

    /**
     *
     * @var \Doctrine\DBAL\Connection conexión para controlar el resumen del proceso 
     */
    private $conexionLog;

    /**
     *
     * @var CastigoRecuperacionProvisionDelegado 
     */
    private $recuperacionProvisionDelegado;

    /**
     *
     * @var CastigoReclasificacionProvisionDelegado 
     */
    private $reclasificacionDelegado;

    /**
     * Constructor de la clase 
     * @param int idAcceso identificador de la sesión 
     */
    public function __construct($idAcceso) {
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->CarteraCastigadaModel = new CarteraCastigadaGenericoModel($this->conexion);
        $this->SuspensionModel = new SuspensionModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->recuperacionProvisionDelegado = new CastigoRecuperacionProvisionDelegado($this->conexion, $idAcceso);
        $this->reclasificacionDelegado = new CastigoReclasificacionProvisionDelegado($idAcceso, $this->conexion);
        $this->conexionLog = ConexionBD::getConexion();
    }

    /**
     * Listado de ciclos activos
     * @return Array listado de ciclos activos
     */
    public function obtenerCiclosActivos($idempresa) {
        return $this->genericoModel->consultarCiclosActivos($idempresa);
    }

    /**
     * Permite filtrar suscripciones 
     * @param int $idsuscripcion
     * @param int $codigoAnterior
     */
    public function filtrarSuscripciones($idsuscripcion, $codigoAnterior, $idempresa, $idusuario) {
        $parametros['idsuscripcion'] = $idsuscripcion;
        $parametros['codigoanterior'] = $codigoAnterior;
        $parametros['estado'] = "'E'";
        $parametros['idempresa'] = $idempresa;

        $suscripcion = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($suscripcion)) {
            throw new MyException("No se encontraron resultados para la suscripción", -1);
        }
        return $suscripcion;
    }

// <editor-fold desc="Procesos genericos">
    /**
     * permite actualizar el número de la factura
     * @param int $idfactura idenbtificador de la factura 
     * @param int $numero numero de consecutivo de la factura
     * @param int $idnumero id del npumero generado para actualizar nudo
     */
    private function actualizarNumeroFactura($idfactura, $numero, $idnumero) {
        /* actualiza los consecutivos  de la facturación */
        $this->genericoModel->actualizarNumeroDisponible($numero, $idnumero);
        $this->genericoModel->actualizarNumeroFactura($idfactura / 1, $numero / 1);
    }

    /**
     * permite obtener el consecutivo de la factura
     * @param int $iddocumento documento a revisar
     * @param int $idtipodocumento tipo de documento a evaluar
     * @return int número de facturación
     */
    private function obtenerNumeroFactura($iddocumento, $idtipodocumento) {
        $infoFactura['idempresa'] = $this->idempresa;
        $infoFactura['iddocumento'] = $iddocumento;
        $infoFactura['idtipodocumento'] = $idtipodocumento;
        $infoFactura['tipo'] = "FA";
        return $this->genericoModel->obtenerNumeroFactura($infoFactura);
    }

    /**
     * permite provisionar una factura al  33% de su saldo
     * @param array $factura informacion de la factura a provisionar
     * @param float valor real de la provisión. usado solamente cuando queda saldfo en la financiacion sin generar factura
     */
    private function provisionarFacturas($factura, $reclasificar = 0, $valorprovision = null, $valoramortizacion = null) {
        /* obtener documento de tipo PR para generar la nueva provisión */
        $documentoPR = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['documento'], $factura['tipodocumento'], 'PR');
        /* obtener Factura a aprovisionar desde el origen */
        $provisionFactura = $this->CarteraCastigadaModel->obtenerFacturaModel($factura['idfactura']);
        $provisionFactura['uni_documento'] = $documentoPR['iddocumento'];
        $provisionFactura['uni_tipdocument'] = $factura['tipodocumento'];

        $provisionFactura['fac_sdoreal'] = 0;
        $provisionFactura['fac_vlrreal'] = 0;
        $provisionFactura['fac_ideorigen'] = $factura['idfactura'];
        $provisionFactura['usu_ideregistro'] = $this->idusuario;

        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($provisionFactura['dsus_ideregistr']);
        $provisionFactura['cic_ideregistro'] = $periodo['idciclo'];
        $provisionFactura['per_ideregistro'] = $periodo['idperiodo'];
        $provisionFactura['cic_ano'] = $periodo['cicloanio'];
        $provisionFactura['fac_fecaprobada'] = 'now()';

        /* se construye la factura provisionada */
        $idFacturaProvisionada = $this->CarteraCastigadaModel->crearProvisionFacturaModel($provisionFactura);
        /**
         * Obtiene el número de consecutivo que le pertenece a la factura construida
         */
        $numeroFacturacion = $this->obtenerNumeroFactura($documentoPR['iddocumento'], $factura['tipodocumento'], $this->idempresa);
        /* se cargan los detalles de la factura de origen para construir los detalles de la provisión */

        $detallesFactura = $this->CarteraCastigadaModel->obtenerDetalleFacturaModel($factura['idfactura']);

        $sumatoriaConceptosProvisionados = 0;
        /* se recorren los detalles para generar una provisión por cada uno de ellos basados en la factura ya provisionada */
        foreach ($detallesFactura as $dfactura) {
            if ($dfactura['dfac_vlrreal'] <= 0) {
                continue;
            }

            /* se le notifica que su factura de origen es la factura original */
            $dfactura['dfac_ideorigen'] = $dfactura['dfac_ideregistr'];
            /* se aprovisiona con el 33%  de su saldo original */
            if (!empty($valorprovision)) {
                /* Si existe un valor de provision. se debe tener encuenta inflar el valor de la provision 
                 * con respecto a la financiacion
                 */
                $valorProvisionDetalleFactura = $dfactura["dfac_sdoreal"] * 0.33;
                $provisionPorcentaje = ($dfactura["dfac_sdoreal"] / $valoramortizacion) * $valorprovision;
                /* Se mantiene una provision normal para efectos de calculo de la recuperación de las facturas */
                $dfactura['dfac_vlrunitari'] = $valorProvisionDetalleFactura;
                $sumatoriaConceptosProvisionados = $sumatoriaConceptosProvisionados + $provisionPorcentaje;
            } else {
                $provisionPorcentaje = $dfactura['dfac_sdoreal'] * 0.33;
                $dfactura['dfac_vlrunitari'] = $provisionPorcentaje;
                $sumatoriaConceptosProvisionados = $sumatoriaConceptosProvisionados + $provisionPorcentaje;
            }
            $dfactura['dfac_sdoreal'] = $provisionPorcentaje;
            $dfactura['dfac_vlrreal'] = $provisionPorcentaje;
            $dfactura['dfac_vlrtotal'] = $provisionPorcentaje;
            if ($dfactura['dfac_vlrunitari'] <= 0) {
                $dfactura['dfac_vlrunitari'] = $dfactura['dfac_vlrtotal'];
            }
            $dfactura['dfac_cantidad'] = $dfactura['dfac_vlrtotal'] / abs($dfactura['dfac_vlrunitari']);
            /* se le notifica que es hija de la  factura generada como encabezado */
            $dfactura['fac_ideregistro'] = $idFacturaProvisionada;
            /* usuario que genero el proceso */
            $dfactura['usu_ideregistro'] = $this->idusuario;
            /* se construye el detalle de la factura aprovisionada */
            $this->CarteraCastigadaModel->crearDetalleProvisionModel($dfactura);
        }
        /* actualiza los consecutivos  de la facturación */
        $this->actualizarNumeroFactura($idFacturaProvisionada, $numeroFacturacion['numero'], $numeroFacturacion['idnumero']);
        $this->actualizarSaldosProvisionModel($idFacturaProvisionada);

        if ($reclasificar > 0) {
            /* Permite realizar la reclasificación de la factura provisionad en el mes final (25) */
            $this->reclasificacionDelegado->generarReclasificacion($provisionFactura['dsus_ideregistr']);
        }
        return 1;
    }

//</editor-fold>
// <editor-fold desc="Recuperarcion de provision ">  
    /**
     * se limpia la factura original adaptandola a la provisión
     * @param array $facturaOriginal factura original de provisión
     * @return array
     */
    private function limpiarFacturaProvisionar($facturaOriginal) {
        unset($facturaOriginal['fac_numero']);
        unset($facturaOriginal['fac_ideregistro']);
        unset($facturaOriginal['fac_ideactual']);
        unset($facturaOriginal['fac_feceliminad']);
        unset($facturaOriginal['fac_fecfinancia']);
        unset($facturaOriginal['fac_feccastigad']);
        unset($facturaOriginal['fac_fecsuspens']);
        unset($facturaOriginal['fin_ideregistro']);
        unset($facturaOriginal['mvi_ideregistro']);
        return $facturaOriginal;
    }

    /**
     * Permite actualizar el saldo de las facturas
     * @param type $idfactura identificador de la factura
     */
    private function actualizarSaldosProvisionModel($idfactura) {
        //Se modifica el encabezado de las facturas, ya que estaban con decimales.
        $sql = "UPDATE fac_factura
              SET fac_sdoreal = (SELECT sum(dfac.dfac_sdoreal) FROM dfac_detfactura dfac  where dfac.fac_ideregistro=$idfactura),
               fac_vlrreal = (SELECT sum(dfac.dfac_vlrreal) FROM dfac_detfactura dfac  where dfac.fac_ideregistro=$idfactura)
              WHERE fac_ideregistro=$idfactura";
        $this->CarteraCastigadaModel->executeQuery($sql);
    }

// <editor-fold desc="proceso principal">  
    public function generarRecuperacionProvision() {
        $listaSuscripciones = $this->recuperacionProvisionDelegado->getSuscripcionesProvisionadas($this->idciclo, $this->idsuscripcion);
        $facturasRecuperadas = 0;
        foreach ($listaSuscripciones as $suscripcion) {
            $facturasRecuperadas += $this->recuperacionProvisionDelegado->generarRecuperacion($suscripcion['idsuscripcion']);
        }
        return $facturasRecuperadas;
    }

//</editor-fold>    
//</editor-fold>
// <editor-fold desc="provision de facturas">
    /**
     * Aprovisiona las facturas que no son financiables 
     */
    public function FacturasAPrimeraProvision() {
//se listan las facturas que seran aprovisionadas con el 33% del saldo de la factura actual 
        $facturasAprovisionar = $this->CarteraCastigadaModel->ObtenerFacturasAProvisonarModel($this->idempresa, $this->idciclo, $this->idsuscripcion);
        $i = 0;
        $idsuscripcionLog = 0;
        $respuesta = 0;
        foreach ($facturasAprovisionar as $factura) {
            try {
                $idsuscripcionLog = $factura['idsuscripcion'];

                /* validar que la provisión ya no este aplicada */
                $validarProvisionFactura = $this->CarteraCastigadaModel->validarProvisionFactura($factura['idfactura']);
                if ($validarProvisionFactura > 0) {
                    continue;
                }

                $respuesta = $this->provisionarFacturas($factura);
            } catch (\Exception $ex) {
                $this->escribirLog("Error al realizar la primera provisión " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getMessage());
                } else {
                    throw new MyException($ex->getMessage(), -1);
                }
            }
            if ($respuesta > 0) {
                $i++;
            }
        }
        return $i;
    }

//</editor-fold>
// <editor-fold desc="Castigar Facturas">

    /**
     * Permite listar las facturas aprovisionadas
     */
    private function cargarFacturasCastigar() {

        return $this->CarteraCastigadaModel->cargarFacturasParaCastigarModel($this->idempresa, $this->idciclo, $this->idsuscripcion);
    }

    /**
     * Pemrite reclasificar  las facturas con provision del primer 33%  
     */
    private function reclasificarFacturasProvisionadas() {
        if (!empty($this->idsuscripcion)) {
            $this->reclasificacionDelegado->generarReclasificacion($this->idsuscripcion);
            return 1;
        }
        $listaSuscripcion = $this->CarteraCastigadaModel->obtenerFacturasRecalsificarModel();
        $i = 0;
        foreach ($listaSuscripcion as $suscripcion) {
            $this->reclasificacionDelegado->generarReclasificacion($suscripcion['idsuscripcion']);
        }
        return $i;
    }

    /**
     * provisiona el mes 25 de las facturas  con el otro 33% luego de provisionar se genera el RC correspondiente
     */
    private function provisionarFacturasMesFinal() {
        /* carga las facturas con edad de 25 meses o más para generar una provisión de cartera */
        $facturasProvisionar = $this->CarteraCastigadaModel->obtenerFacturasProvisionarUltimaEtapaModel($this->idsuscripcion);
        $i = 0;
        foreach ($facturasProvisionar as $factura) {
            $idsuscripcionLog = 0;
            try {

                $facturaProvision = $this->CarteraCastigadaModel->obtenerFacturaModel($factura['idfactura']);

                $parametros['idfactura'] = $factura['idfactura'];
                $parametros['saldo'] = $factura['saldo'];
                $parametros['documento'] = $facturaProvision['uni_documento'];
                $parametros['tipodocumento'] = $facturaProvision['uni_tipdocument'];
                $i = $i + $this->provisionarFacturas($parametros, 1);
            } catch (\Exception $ex) {
                $facturaErrorLog = $factura['idfactura'];
                $this->escribirLog("Error al provisionar factura $facturaErrorLog mes 25 " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getTraceAsString());
                } else {
                    throw new MyException($ex->getMessage(), -1);
                }
            }
        }
        return $i;
    }

    /**
     * permite castigar el restante del porcentaje de la factura, con provisión 34% 
     */
    private function castigarFacturasMesFinal() {
        if (!empty($this->idsuscripcion)) {
            $facturasCastigar = $this->CarteraCastigadaModel->obtenerFacturaSuscripcionCastigoMesFinalModel($this->idsuscripcion);
        } else {
            /* carga las facturas con edad de 25 meses o más para generar una provisión de cartera */
            $facturasCastigar = $this->CarteraCastigadaModel->obtenerFacturasCastigoUltimaEtapaModel();
        }
        $i = 0;
        $facturaRevisarReclasificacion = 0;
        $idsuscripcionLog = 0;
        $facturasRevisarReclasificaciones = array();
        $facturaRevisarRecalsificaiconesPendientes = 0;

        foreach ($facturasCastigar as $factura) {
            try {

                $facturaOriginal = $this->CarteraCastigadaModel->obtenerFacturaModel($factura['idfactura']);
                $idsuscripcionLog = $facturaOriginal['dsus_ideregistr'];


                /* Se garantiza que solo halla un ingreso a verificar facturas base de financiación por suscripción */
                if ($facturaRevisarReclasificacion != $factura['idsuscripcion']) {
                    $i = $i + $this->generarFacturaBaseFinanciacion($factura['idsuscripcion']);
                    $facturaRevisarReclasificacion = $factura['idsuscripcion'];
                }

                /* se consulta el documento de la factura para generar la provision */
                $documentoCC = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['uni_documento'], $facturaOriginal['uni_tipdocument'], 'CC');
                $facturaOriginal['uni_documento'] = $documentoCC['iddocumento'];

                $saldoFacturaProvisionadaCastigo = $this->CarteraCastigadaModel->obtenerSaldoRealCastigoModel($facturaOriginal['fac_ideregistro']);

                if ($saldoFacturaProvisionadaCastigo > 0) {
                    $saldoFacturaProvisionadaCastigo = abs($saldoFacturaProvisionadaCastigo) * -1;
                }



                /* se calcula el saldo de la factura de acuerda a las provisiones existentes */
                $facturaOriginal['fac_vlrreal'] = $saldoFacturaProvisionadaCastigo;
                $facturaOriginal['fac_sdoreal'] = $saldoFacturaProvisionadaCastigo;
                $facturaOriginal['fac_estado'] = 'C';

                $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($facturaOriginal['dsus_ideregistr']);
                $facturaOriginal['cic_ideregistro'] = $periodo['idciclo'];
                $facturaOriginal['per_ideregistro'] = $periodo['idperiodo'];
                $facturaOriginal['cic_ano'] = $periodo['cicloanio'];

                $facturaOriginal['usu_ideregistro'] = $this->idusuario;
                $facturaOriginal['emp_ideregistro'] = $this->idempresa;


                $facturaOriginal['fac_ideorigen'] = $facturaOriginal['fac_ideregistro'];


                /* se construye la factura provisionada */
                $idFacturaCastigada = $this->CarteraCastigadaModel->crearNotaCastigoFacturaModel($facturaOriginal);
                /* calcula el numero de la factura */
                $numeroFacturacionCC = $this->obtenerNumeroFactura($documentoCC['iddocumento'], $facturaOriginal['uni_tipdocument']);
                /* actualiza los consecutivos  de la facturación */
                $this->actualizarNumeroFactura($idFacturaCastigada, $numeroFacturacionCC['numero'], $numeroFacturacionCC['idnumero']);
                /* se cargan los detalles de la factura de origen para construir los detalles de la provisión */
                $detallesFactura = $this->CarteraCastigadaModel->obtenerDetalleFacturaModel($facturaOriginal['fac_ideregistro']);
                /* se recorren los detalles para generar una provisión por cada uno de ellos basados en la factura ya provisionada */
                foreach ($detallesFactura as $dfactura) {
                    /* se le notifica que su factura de origen es la factura original */
                    $dfactura['dfac_ideorigen'] = $facturaOriginal['fac_ideregistro'];
                    $castigoPonderado = 0;

                    if ($dfactura['dfac_sdoreal'] > 0) {

                        $saldoDetalleFacturaProvisionadaCastigo = $this->CarteraCastigadaModel->obtenerSaldoRealCastigoDetalleFacturaModel($dfactura['dfac_ideregistr']);
                        $saldoDetalleConceptoProvision = $saldoDetalleFacturaProvisionadaCastigo / abs($saldoFacturaProvisionadaCastigo);
                        $castigoPonderado = abs($saldoDetalleConceptoProvision) * $saldoDetalleFacturaProvisionadaCastigo;
                    }

                    /* se aprovisiona con el 33%  de su saldo original */
                    $dfactura['dfac_sdoreal'] = abs($castigoPonderado) * -1;
                    $dfactura['dfac_vlrunitari'] = abs($castigoPonderado) * -1;
                    $dfactura['dfac_vlrreal'] = abs($castigoPonderado) * -1;
                    $dfactura['dfac_vlrtotal'] = abs($castigoPonderado);
                    $dfactura['dfac_cantidad'] = 1;
                    /* se le notifica que es hija de la  factura generada como encabezado */
                    $dfactura['fac_ideregistro'] = $idFacturaCastigada;
                    /* usuario que genero el proceso */
                    $dfactura['usu_ideregistro'] = $this->idusuario;
                    /* se construye el detalle de la factura aprovisionada */
                    $this->CarteraCastigadaModel->crearDetalleProvisionModel($dfactura);
                }

                /* Cancela las provisiones existentes */
                $this->CarteraCastigadaModel->actualizarSaldoFacturaProvisionCastigoModel($facturaOriginal['fac_ideregistro'], $facturaOriginal['dsus_ideregistr']);
                /* se cambia el estado de la factura a C que significa castigo */
                $this->CarteraCastigadaModel->castigarFacturaModel($facturaOriginal['fac_ideregistro'], $this->idusuario);

                /* Se garantiza que solo halla un ingreso a verificar facturas por suscripción */
                if ($facturaRevisarRecalsificaiconesPendientes != $factura['idsuscripcion']) {
                    $facturaRevisarRecalsificaiconesPendientes = $factura['idsuscripcion'];
                    $facturasRevisarReclasificaciones[] = $factura['idsuscripcion'];
                }

                $i++;
            } catch (\Exception $ex) {
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getMessage());
                    return;
                }

                $facturaErrorLog = $factura['idfactura'];
                $this->escribirLog("Error al castigar factura $facturaErrorLog " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                throw new MyException($ex->getMessage(), -1);
            }
        }

        /* Reclasifica las facturas pendientes por la suscripción que contengan provisiones */
        foreach ($facturasRevisarReclasificaciones as $idsuscripcion) {
            $this->idsuscripcion = $idsuscripcion;
            $this->reclasificarFacturasProvisionadas();
            $this->idsuscripcion = null;
        }

        return $i;
    }

    /**
     * procesar facturas aprovisionadas para ser castigadas
     */
    private function castigarCarteraAprovisionar() {
        $i = 0;
        try {
            $this->cargarFacturasCastigar();

            /* se reclasifican las facturas aprovisionadas */
            /* provisiona el mes 25 de las facturas  con el otro 33% luego de provisionar se genera el RC correspondiente */
            $i = $i + $this->provisionarFacturasMesFinal();
            /* Evalua facturas financiadas para mes 25 */
            $i = $i + $this->generarProvisionFinanciacion(false);
            /* castigar facturas provisionadas  con el 34% del vlr total de las facturas */
            $i = $i + $this->castigarFacturasMesFinal();

            return $i;
        } catch (\Exception $ex) {
            if (empty($this->idsuscripcion)) {
                print_r($ex->getTraceAsString());
            }
            throw new MyException($ex->getMessage(), -1);
        }
    }

//</editor-fold>
// <editor-fold desc="castigar facturas sin provision">
    /**
     * procesa los detalles de la factura asignandoles una nota con el vlr_real en 0 y el origen del original
     * @param int $idfacturaOriginal identificador de factura original
     * @param int $idfacturaNotaCastigada identificadort de factura creada de ntipo castigo
     */
    private function procesarDetallesFactura($idfacturaOriginal, $idfacturaNotaCastigada) {
        /*
         * listado de los detalles de la factura asociada, se reciben con el fin de procesar sus notas 
         */
        $detallesFacturas = $this->CarteraCastigadaModel->obtenerDetalleFacturaModel($idfacturaOriginal);
        /*
         * se recorren los detalles de las facturas asociadas con el fin de crear una nueva nota con el saldo vlr_real en 0  y el id origen de la consultada
         */
        foreach ($detallesFacturas as $dfactura) {
            $dfactura['dfac_sdoreal'] = abs($dfactura['dfac_vlrreal']) * -1;
            $dfactura['dfac_vlrunitari'] = abs($dfactura['dfac_vlrreal']) * -1;
            $dfactura['dfac_vlrreal'] = abs($dfactura['dfac_vlrreal']) * -1;
            $dfactura['dfac_vlrtotal'] = abs($dfactura['dfac_vlrtotal']);

            $dfactura['dfac_ideorigen'] = $dfactura['dfac_ideregistr'];
            $dfactura['fac_ideregistro'] = $idfacturaNotaCastigada;
            $dfactura['usu_ideregistro'] = $this->idusuario;

            unset($dfactura['dfac_ideregistr']);
            unset($dfactura['dfac_idepadre']);
            /* construye la nota de la factura asociada como castigada */
            $this->CarteraCastigadaModel->generarNotaDetalleFacturaModel($dfactura);
        }
    }

    private function castigarFacturaSinProvision($idfactura) {
        /* cargar factura de encabezado para generar la nueva nota */
        $facturaOriginal = $this->CarteraCastigadaModel->obtenerFacturaModel($idfactura);

        /* se establece el ideorigen de la factura con el ideregistro de la factura original,  esto con el fin de saber que se encuentra 
         * una nota asociada pero que no se contabiliza 
         */
        $facturaOriginal['fac_ideorigen'] = $facturaOriginal['fac_ideregistro'];

        /* se solicita un documento de tipo CC para decirle a la nota que se creara un castigo */
        $documentoTipo = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($facturaOriginal['uni_documento'], $facturaOriginal['uni_tipdocument'], 'CC');
        $facturaOriginal['uni_documento'] = $documentoTipo['iddocumento'];


        $saldoFacturaProvisionadaCastigo = $this->CarteraCastigadaModel->obtenerSaldoRealCastigoModel($facturaOriginal['fac_ideregistro']);
        if ($saldoFacturaProvisionadaCastigo > 0) {
            $saldoFacturaProvisionadaCastigo = abs($saldoFacturaProvisionadaCastigo) * -1;
        }
        /* se calcula el saldo de la factura de acuerda a las provisiones existentes */
        $facturaOriginal['fac_vlrreal'] = $saldoFacturaProvisionadaCastigo;
        $facturaOriginal['fac_sdoreal'] = $saldoFacturaProvisionadaCastigo;

        $facturaOriginal['fac_metgenera'] = 'P';
        $facturaOriginal['fac_fecaprobada'] = 'now()';
        $facturaOriginal['fac_fecha'] = 'now()';
        $facturaOriginal['fac_fecvence'] = 'now()';
        unset($facturaOriginal['fac_fecfinancia']);

        $facturaOriginal['usu_ideregistro'] = $this->idusuario;
        /* elimina una posición del arreglo ideregistro y el idpadre. porque en la inserción la secuencia puede fallar, 
         * y el ide padre debe ser nulo para no amarrar la factura de nota a contabilización ya que se encuentra en castigo */
        unset($facturaOriginal['fac_ideregistro']);
        unset($facturaOriginal['fac_idepadre']);
        /* Se genera número de factura  para el documento y tipo documento asociado revisión que se genera en tido */
        $numFactura = $this->obtenerNumeroFactura($facturaOriginal['uni_documento'], $facturaOriginal['uni_tipdocument']);
        /* Se prepara la factura original para reemplazar los campos requeridos 
         * para generar una nota a travéz de la información original 
         */
        //se le reemplaza el número de factura generado por tido 
        $facturaOriginal['fac_numero'] = $numFactura['numero'];
        $facturaOriginal['fac_estado'] = 'C';
        $facturaOriginal['fac_fecaprobada'] = 'now()';
        /*
         * genera una nueva factura con documento de tipo Castigo CC y asociado en el idOrigen a la factura original que debe quedar en estado C
         */
        $idfacturaNotaCastigada = $this->CarteraCastigadaModel->generarNotaFacturaModel($facturaOriginal);
        /*
         *    se procesan los detalles de la factura para generar sus notas correspondientes a los saldos
         */
        $this->procesarDetallesFactura($idfactura, $idfacturaNotaCastigada);
        /* se cambia el estado de la factura a C que significa castigo */
        $this->CarteraCastigadaModel->castigarFacturaModel($idfactura, $this->idusuario);
        /* actualiza el número de factura disponible para permitir decirle a tido que se ocupo esa facturación */
        $this->actualizarNumeroFactura($idfacturaNotaCastigada, $numFactura['numero'], $numFactura['idnumero']);
    }

    private function CancelarSuscripcion() {

        /*
         * carga el listado de las facturas que serán suspendidas
         */
        $listadoFacturasSuspender = array();
        if (empty($this->idsuscripcion)) {
            //$listadoFacturasSuspender = $this->CarteraCastigadaModel->obtenerFacturaSuscripcionSuspenderModel($this->idsuscripcion);
            //} else {
            $listadoFacturasSuspender = $this->CarteraCastigadaModel->obtenerSuscripcionesCancelarModel();
        }
        $i = 0;
        $idsuscripcionLog = 0;
        /*
         * recorre el listado de las facturas que serán suspendidas con el fin de realizar su proceso
         */
        if (!empty($this->idsuscripcion)) {
            try {
                $i++;
                $this->conexion->beginTransaction();
                $this->CarteraCastigadaModel->suspenderSuscripcion($this->idsuscripcion, $this->idusuario);
                $this->conexion->commit();
            } catch (\Exception $ex) {
                $this->conexion->rollBack();
                $this->escribirLog("Error al generar la eliminación " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getTraceAsString());
                }
            }
        }

        foreach ($listadoFacturasSuspender as $lfacturasSuspender) {
            try {
                $this->conexion->beginTransaction();
                $idsuscripcionLog = $lfacturasSuspender['idsuscripcion'];
                //realiza la suspension de la suscripción activa , notificando el usuario que lanzo el proceso de suspensión
                $this->CarteraCastigadaModel->suspenderSuscripcion($lfacturasSuspender['idsuscripcion'], $this->idusuario);
                $this->conexion->commit();
                $i++;
            } catch (\Exception $ex) {
                $this->conexion->rollBack();
                $this->escribirLog("Error al generar la eliminación " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getTraceAsString());
                }
                //throw new MyException($ex->getMessage(), -1);
            }
        }
        return $i;
    }

//</editor-fold>
// <editor-fold desc="FInanciaciones con saldo">

    /**
     * Permite construir una provisión  a la financiacion en el més 13 , si no se recibe la suscripcion se realizara de manera global
     */
    private function generarProvisionFinanciacion($primeraProvision = true) {
        $reclasificar = 0;
        if ($primeraProvision == true) {
            $financiacionProvisionar = $this->CarteraCastigadaModel->ObtenerFacturasFinanciacionProvisionarModel($this->idempresa, $this->idciclo, $this->idsuscripcion);
        } else {
            $financiacionProvisionar = $this->CarteraCastigadaModel->ObtenerFacturasFinanciacionProvisionarMesFinalModel($this->idempresa, $this->idciclo, $this->idsuscripcion);
            $reclasificar = 1;
        }

        $i = 0;
        $idsuscripcionLog = 0;
        foreach ($financiacionProvisionar as $financiacion) {
            $facturasProvisionar = $this->CarteraCastigadaModel->ObtenerFacturasAProvisonarFinanciacionModel($financiacion['idfinanciacion'], $financiacion['idsuscripcion']);
            foreach ($facturasProvisionar as $factura) {
                $idsuscripcionLog = $factura['idsuscripcion'];
                try {
                    if ($primeraProvision == true) {
                        /* validar que la provisión ya no este aplicada */
                        $validarProvisionFactura = $this->CarteraCastigadaModel->validarProvisionFactura($factura['idfactura']);
                        if ($validarProvisionFactura > 0) {
                            continue;
                        }
                    }
                    $this->provisionarFacturas($factura, $reclasificar, $financiacion['valorprovision'], $financiacion['valoramortizacion']);
                } catch (\Exception $ex) {
                    $this->escribirLog("error al provisionar la suscripcion $idsuscripcionLog " . $ex->getMessage(), $i, $idsuscripcionLog, true);
                    if (empty($this->idsuscripcion)) {
                        print_r($ex->getTraceAsString());
                    }

                    throw new MyException($ex->getMessage(), -1);
                }
            }
            $i++;
        }
        return $i;
    }

    /**
     * Permite construir una factura a partir del saldo de una financiación;  además de castigar dicha factura construida
     * @param type $financiacion información de la financiación   
     */
    private function crearCastigarFacturaFinanciacion($financiacion) {
        /* Evita que se cree una factura con saldos en 0 para castigo */
        if ($financiacion['fin_sdocapital'] <= 0) {
            return;
        }

        /* se obtiene el ciclo periodo actual */
        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($financiacion['dsus_ideregistr']);
        $factura['cic_ano'] = $periodo['cicloanio'];
        $factura['cic_ideregistro'] = $periodo['idciclo'];
        $factura['per_ideregistro'] = $periodo['idperiodo'];
        /*
         * consulta el documento y tipo de docuemnto para la factura basada en una financiación 
         */
        $datosDetalleDocumento = $this->genericoModel->consultarLiquidacionFinanciacionModel($financiacion['fin_ideregistro']);
        $factura['uni_documento'] = $datosDetalleDocumento['iddocumento'];
        $factura['uni_tipdocument'] = $datosDetalleDocumento['idtipodocumento'];
        $factura['uni_liquidacion'] = $datosDetalleDocumento['idliquidacion'];

        /* se obtiene el número de la factura a procesar en la factura. */
        $numeroFactura = $this->obtenerNumeroFactura($factura['uni_documento'], $factura['uni_tipdocument']);

        /* /*identificador de usuario */
        $factura['emp_ideregistro'] = $financiacion['emp_ideregistro'];
        $factura['dsus_ideregistr'] = $financiacion['dsus_ideregistr'];
        $parametros['idsuscripcion'] = $financiacion['dsus_ideregistr'];
        $identificadorSuscriptor = $this->genericoModel->getSuscripcion($parametros, $this->idusuario);
        $factura['sus_ideregistro'] = $identificadorSuscriptor[0]['idsuscriptor'];
        $factura['uni_tipsuscripc'] = $identificadorSuscriptor[0]['idtiposuscripcion'];
        $factura['uni_tipusosuscr'] = $identificadorSuscriptor[0]['idtipousosuscripcion'];
        $factura['ter_ideregistro'] = $identificadorSuscriptor[0]['idtercero'];
        $factura['uni_tiptercero'] = $identificadorSuscriptor[0]['idtipotercero'];
        $factura['fac_vlrreal'] = $financiacion['fin_sdocapital'];
        $factura['fac_sdoreal'] = $financiacion['fin_sdocapital'];
        $factura['hliq_ideregistr'] = 0;
        $factura['usu_ideregistro'] = $this->idusuario;

        /* se aplica la factura que se genero a partir de la financiación. */
        $idfactura = $this->CarteraCastigadaModel->crearFacturaSaldoFinanciacionModel($factura);
        /* se actualiza el número de la factura */
        $this->actualizarNumeroFactura($idfactura, $numeroFactura['numero'], $numeroFactura['idnumero']);

        $detFinanciacion = $this->CarteraCastigadaModel->obtenerDetalleFinanciacionModel($financiacion['fin_ideregistro']);
        $facturaGenerada = $this->CarteraCastigadaModel->obtenerFacturaModel($idfactura);
        foreach ($detFinanciacion as $dtFinanciacion) {
            $dFactura['dfac_vlrunitari'] = $facturaGenerada['fac_sdoreal'];
            $dFactura['dfac_vlrtotal'] = abs($facturaGenerada['fac_sdoreal']);
            $dFactura['dfac_vlrreal'] = $facturaGenerada['fac_vlrreal'];
            $dFactura['dfac_sdoreal'] = $facturaGenerada['fac_sdoreal'];
            $dFactura['dfac_cantidad'] = 1;
            $dFactura['fac_ideregistro'] = $idfactura;
            $dFactura['uni_concepto'] = $dtFinanciacion['uni_concepto'];
            $dFactura['dfac_version'] = 1;
            $dFactura['usu_ideregistro'] = $this->idusuario;
            /* Se construye el detalle de la factura a partir del detalle de la financiación */
            $this->CarteraCastigadaModel->crearDetalleProvisionModel($dFactura);
        }
        /* se procede al castigo de la cartera */
        $this->castigarFacturaSinProvision($idfactura);
    }

    private function generarNuevaAmortizacion($financiacion, $idusuario) {

        $amortizacionActiva = $this->CarteraCastigadaModel->obtenerArmotizacionActivaModel($financiacion['fin_ideregistro'], 'A');

        $amortizacion['amfi_ideregistr'] = $amortizacionActiva['amfi_ideregistr'];
        $amortizacion['amo_estado'] = 'C';
        $amortizacion['amo_fecha'] = 'now()';
        $amortizacion['amo_cuoamortiz'] = $amortizacionActiva['amfi_cuoamortiz'];
        $amortizacion['fin_ideregistro'] = $amortizacionActiva['fin_ideregistro'];
        $amortizacion['uni_liquidacion'] = $amortizacionActiva['uni_liquidacion'];
        $amortizacion['uni_documento'] = $amortizacionActiva['uni_documento'];
        $amortizacion['uni_tipdocument'] = $amortizacionActiva['uni_tipdocument'];
        $amortizacion['emp_ideregistro'] = $amortizacionActiva['emp_ideregistro'];
        $amortizacion['usu_ideregistro'] = $idusuario;

        /* se obtiene el ciclo periodo actual */
        $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($financiacion['dsus_ideregistr']);
        $amortizacion['cic_ano'] = $periodo['cicloanio'];
        $amortizacion['cic_ideregistro'] = $periodo['idciclo'];
        $amortizacion['per_ideregistro'] = $periodo['idperiodo'];

        $amortizacion['amo_ideregistro'] = $this->CarteraCastigadaModel->insertarAmortizacionFactura($amortizacion);
        return $amortizacion;
    }

    private function generarDetalleAmortizacion($detalleFinanciacion, $idamortizacion, $idusuario) {
        foreach ($detalleFinanciacion as $dfinanciacion) {
            $damortizacion['dfac_vlrtotal'] = $dfinanciacion['dfac_vlrtotal'];
            $damortizacion['damo_vlrreal'] = $dfinanciacion['dfin_vlrreal'];
            $damortizacion['amo_ideregistro'] = $idamortizacion['amo_ideregistro'];
            $damortizacion['dfin_ideregistr'] = $dfinanciacion['dfin_ideregistr'];
            $damortizacion['dsus_ideregistr'] = $dfinanciacion['dsus_ideregistr'];
            $damortizacion['emp_ideregistro'] = $dfinanciacion['emp_ideregistro'];
            $damortizacion['fac_ideregistro'] = $dfinanciacion['fac_ideregistro'];
            $damortizacion['dfac_ideregistr'] = $dfinanciacion['dfac_ideregistr'];
            $damortizacion['uni_liquidacion'] = $dfinanciacion['uni_liquidacion'];
            $damortizacion['uni_concepto'] = $dfinanciacion['uni_concepto'];
            $damortizacion['uni_documento'] = $idamortizacion['uni_documento'];
            $damortizacion['uni_tipdocument'] = $idamortizacion['uni_tipdocument'];
            $damortizacion['dfac_vlrtotal'] = $dfinanciacion['dfac_vlrtotal'];
            $damortizacion['dfac_vlrtotal'] = $dfinanciacion['dfac_vlrtotal'];

            /* se obtiene el ciclo periodo actual */
            $periodo = $this->genericoModel->getCicloPeriodoSuscripcion($dfinanciacion['dsus_ideregistr']);
            $damortizacion['cic_ano'] = $periodo['cicloanio'];
            $damortizacion['cic_ideregistro'] = $periodo['idciclo'];
            $damortizacion['per_ideregistro'] = $periodo['idperiodo'];

            $damortizacion['usu_ideregistro'] = $idusuario;

            $this->CarteraCastigadaModel->insertarDetalleAmortizacionFactura($damortizacion);
        }
    }

    /**
     * Permite realizar el castigo de la financiación actual 
     * @param int $idfinanciacion identificador de la financiación 
     */
    public function CastigarFinanciacion($idfinanciacion) {
        $financiacion = $this->CarteraCastigadaModel->consultarFinanciacion($idfinanciacion);
        /* Se actualizan los saldos         */
        $this->genericoDelegado->actualizarFinanciacionSaldo($idfinanciacion, $financiacion['fin_version']);
        /* Cambia el estado de la financiación a castigo */
        $this->CarteraCastigadaModel->castigarFinanciacionModel($idfinanciacion);
    }

    /**
     * 
     * @param int $idsuscripcion identificador de la suscripción 
     */
    public function generarFacturaBaseFinanciacion($idsuscripcion) {
        /* lista las financiaciones que contienen saldo con el fin de generar una nueva factura  */
        $obtenerFinanciacionesFacturar = $this->CarteraCastigadaModel->ObtenerSaldoFinanciacionGenerarNuevaFactura($this->idempresa, $this->idciclo, $idsuscripcion);
        $i = 0;
        /* se recorren las financiaciones a facturar */
        foreach ($obtenerFinanciacionesFacturar as $financiacionesFacturar) {
            try {
                /* Crear Factura con base en los saldo de la financiacion y se procede a realizar un castigo por su saldo generado. Sin Provisión */
                $this->crearCastigarFacturaFinanciacion($financiacionesFacturar);

                $idamortizacion = $this->generarNuevaAmortizacion($financiacionesFacturar, $this->idusuario);
                $detalleFinanciacion = $this->CarteraCastigadaModel->consultarDetalleFinanciacion($financiacionesFacturar['fin_ideregistro']);
                $this->generarDetalleAmortizacion($detalleFinanciacion, $idamortizacion, $this->idusuario);

                /* realiza el castigo de la financiacion */
                $this->CastigarFinanciacion($financiacionesFacturar['fin_ideregistro']);

                /* Cambia el estado de la amortización que es marcada temporalmente con X */
                $amortizacionModificada = $this->CarteraCastigadaModel->obtenerArmotizacionActivaModel($financiacionesFacturar['fin_ideregistro'], 'A');
                /* Cambia el estado de la amortización activa como castgada */
                $this->CarteraCastigadaModel->actualizarAmortizacionFinanciacion($amortizacionModificada['amfi_ideregistr'], 'C');

                $i++;
            } catch (\Exception $ex) {
                $this->escribirLog("error al generar la provision " . $ex->getMessage(), $i, 'MODULO GENERAR BASE FINANCIACION', true);
                if (empty($this->idsuscripcion)) {
                    print_r($ex->getTraceAsString());
                }

                throw new MyException($ex->getMessage(), -1);
            }
        }
        return $i;
    }

//</editor-fold>

    /**
     * permite validar el estado en el que se encuentra el proceso
     */
    public function obtenerEstado($idEmpresa) {

        return $this->CarteraCastigadaModel->ObtenerEstado($idEmpresa);
    }

    /**
     * permite validar si el susuario se encuentra al día 
     * @param type $idsuscripcion
     */
    public function validarUsuario($idsuscripcion) {

        $respuesta = $this->CarteraCastigadaModel->validarUsuarioModel($idsuscripcion);

        if ($respuesta['count'] > 0) {
            $respuesta['codigoRespuesta'] = 0;
            return $respuesta;
        }

        $respuesta['codigoRespuesta'] = 1;
        return $respuesta;
    }

    private function verificarProcesoEjecucion($idempresa, $idacceso) {
        $parametros['idAcceso'] = $idacceso;
        $parametros['idPrograma'] = COD_PROCESO_CARTERA_CASTIGADA;
        $parametros['estado'] = 'A';
        $parametros['idEmpresa'] = $idempresa;
        $parametros['idHilo'] = 1;
        $parametros['fechaInicio'] = 'now()';
        return $this->procesoModel->insertarProceso($parametros);
    }

    public function obtenerEjecucionActual($idempresa) {
        $response = $this->CarteraCastigadaModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_CARTERA_CASTIGADA, $idempresa);
        if (!empty($response)) {
            return $response;
        }
        return null;
    }

    /**
     * Permite lanzar un proceso de segundo plano
     * @param int $idCiclo  identificador de ciclo
     * @param ContainerInterface $container
     * @param int $idsuscripcion identificador de suscripción
     * @return type
     */
    public function lanzarProcesoSegundoPlano($idCiclo, ContainerInterface &$container, $idempresa, $idusuario, $idacceso) {
        /* lanza excepción si el programa ya ha sido ejecutado anteriormente */
        $actividad = $this->genericoDelegado->validarPrograma(COD_PROCESO_CARTERA_CASTIGADA, $idCiclo, $idempresa);
        if ($actividad['idactividad'] != 0) {
            $genericoModel = new GenericoModel($this->conexion);
            $genericoModel->actualizarActividad($actividad, 'C');
        }
        $ejecucionactual = $this->obtenerEjecucionActual($idempresa);

        if (!empty($ejecucionactual)) {
            if ($ejecucionactual['estado'] != 'I') {
                $respuesta['estado'] = $ejecucionactual;
                return $respuesta;
            }
        }

        $respuesta['suscripcionessaldo'] = $this->CarteraCastigadaModel->obtenerRecaudosConSaldoAplicarModel($idempresa, $idCiclo, null, true);
        if (!empty($respuesta['suscripcionessaldo'])) {
            return $respuesta;
        }
        $codigoProceso = $this->verificarProcesoEjecucion($idempresa, $idacceso);
        $idactividad = $actividad['idactividad']; 
        $parametros = "$idempresa $idusuario $idCiclo $idacceso $codigoProceso $idactividad " . RUTA_PRINCIPAL;
        $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoCarteraCastigada.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cartera_castigada.log &";
        \Llanogas\LlanogasBundle\Utiles\Util::ejecutarHilo($script);
    }

    /**
     * Permite validar el ciclo a ejecutar
     * @return type
     */
    private function validarCiclo() {
        $ciclo = $this->genericoModel->getCicloPeriodoSuscripcion($this->idsuscripcion);
        $idciclo = $ciclo['idciclo'];
        return $idciclo;
    }

    /**
     * permite realizar el proceso de castigo de una cartera a una suscripción 
     * @param int $parametros recibe la suscripción, el ciclo, la empresa, el usuario y el proceso a validar y castigar
     */
    public function castigarSuscripciones($parametros) {
        if (empty($parametros['idsuscripcion'])) {
            $this->idsuscripcion = null;
        } else {
            $this->idsuscripcion = $parametros['idsuscripcion'];
        }

        $this->idempresa = $parametros['idempresa'];
        $this->idusuario = $parametros['idusuario'];

        if (empty($parametros['idproceso'])) {
            $this->idproceso = -1;
        } else {
            $this->idproceso = $parametros['idproceso'];
        }

        if (!empty($parametros['idciclo'])) {
            $this->idciclo = $parametros['idciclo'];
        } else {
            $this->idciclo = $this->validarCiclo();
        }
        try {
            $this->CarteraCastigadaModel->CrearTablaLogModel();
            $this->escribirLog('Total Facturas Recuperadas ', $this->generarRecuperacionProvision(), 'Ejecución Masiva');
            $this->conexion->beginTransaction();
            $this->escribirLog('Total Facturas con Financiación Provisionadas', $this->generarProvisionFinanciacion(), 'Ejecución Masiva');
            $this->escribirLog('Total Facturas sin Financiación Provisionadas', $this->FacturasAPrimeraProvision(), 'Ejecución Masiva');
            $this->escribirLog('Total Facturas Castigadas', $this->castigarCarteraAprovisionar(), 'Ejecución Masiva');
            $this->conexion->commit();
            $this->escribirLog('Total Suscripciones Eliminadas', $this->CancelarSuscripcion(), 'Ejecución Masiva');
            $this->reclasificarFacturasProvisionadas();
            /* Finaliza el proceso en segundo plano, Cuando su ejecución es por suscripción este proceso es omitido */
            return;
        } catch (MyException $e) {
            $this->escribirLog($e->getMessage(), null, '', true);
            $this->conexion->rollBack();
            if (empty($this->idsuscripcion)) {
                print_r($e->getMessage());
            } else {
                throw new MyException($e->getMessage(), -1);
            }
        } finally {
            $this->finalizarProceso();
        }
    }

    private function finalizarProceso() {
        $this->conexionLog->beginTransaction();
        try {
            $carteraCastigadaModel = new CarteraCastigadaGenericoModel($this->conexionLog);
            if ($this->idproceso > 0) {
                $carteraCastigadaModel->finalizarProcesoModel($this->idproceso, $this->idusuario);
            }
        } catch (\Exception $e) {
            $this->conexionLog->rollBack();
            if (empty($this->idsuscripcion)) {
                print_r($e->getTraceAsString());
            }
        } finally {
            if ($this->conexionLog->isTransactionActive()) {
                $this->conexionLog->commit();
            }
            $this->conexionLog->close();
            $this->conexionLog = null;
        }
    }

    public function validarSuscripcionesConSaldo($idempresa, $idsuscripcion) {
        return $this->CarteraCastigadaModel->obtenerRecaudosConSaldoAplicarModel($idempresa, null, $idsuscripcion, false);
    }

    private function escribirLog($descripcion, $filasafectadas = null, $idsuscripcion = '', $eserror = false) {
        if ($this->idproceso < 0) {
            return;
        }

        $this->conexionLog->beginTransaction();
        try {
            $carteraCastigadaModel = new CarteraCastigadaGenericoModel($this->conexionLog);

            if ($eserror) {

                if ($this->conexionLog->isTransactionActive()) {
                    $this->conexionLog->rollBack();
                    $this->conexionLog->close();
                    $this->conexionLog->beginTransaction();
                }

                $carteraCastigadaModel->InsertarLogModel($descripcion . " Error al procesar la factura ", 'Cartera Castigada', 'ERROR', $idsuscripcion, 0);
                return;
            }

            if ($filasafectadas < 0 && !$eserror) {
                $carteraCastigadaModel->InsertarLogModel($descripcion . " No se encontraron facturas a procesar ", 'Cartera Castigada', 'COMPLETADO', $idsuscripcion, 0);
                return;
            }
            $carteraCastigadaModel->InsertarLogModel($descripcion, 'Cartera Castigada', 'COMPLETADO', $idsuscripcion, $filasafectadas);

            $this->filasAfectadas = $this->filasAfectadas + $filasafectadas;
            $carteraCastigadaModel->actualizarFilasAfectadasProcesoModel($this->idproceso, $this->filasAfectadas);
        } catch (\Exception $e) {
            $this->conexionLog->rollBack();
            if (empty($this->idsuscripcion)) {
                print_r($e->getTraceAsString());
            }
        } finally {
            if ($this->conexionLog->isTransactionActive()) {
                $this->conexionLog->commit();
            }
        }
    }

}
