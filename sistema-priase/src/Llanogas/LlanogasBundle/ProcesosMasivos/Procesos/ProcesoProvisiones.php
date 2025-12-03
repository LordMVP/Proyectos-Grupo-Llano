<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProvisionesModel;

/**
 * Description of ProcesoAplicarRecaudos
 *
 * @author hrey
 */
class ProcesoProvisiones {

    /**
     *
     * \Llanogas\LlanogasBundle\Models\GenericoModel
     */
    private $genericoModel;
    private $idEmpresa;
    private $idCiclo;
    private $cicloPeriodo;

    /**
     *
     * @var  \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProvisionesModel 
     */
    private $provisionesModel;
    private $actividad;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\FinanciacionModel
     */
    private $financiacionModel;
    private $fechaProvision;

    /**
     * Constructor de la clase 
     * @param int $idEmpresa identificador de la empresa.
     * @param int $idCiclo identificador del ciclo.
     */
    public function __construct($idEmpresa, $idCiclo) {
        $this->conexion = ConexionBD::getConexion();
        $this->conexion->beginTransaction();
        $this->genericoModel = new GenericoModel();
        $this->genericoModel->setConexion($this->conexion);
        $this->provisionesModel = new ProvisionesModel();
        $this->provisionesModel->setConexion($this->conexion);
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($idCiclo);
        $this->financiacionModel = new FinanciacionModel();
        $this->financiacionModel->setConexion($this->conexion);
        $this->fechaProvision = $this->provisionesModel->consultarFechaInicioPeriodo($this->cicloPeriodo['idperiodo']);
    }

    /**
     * Inicia el proceso de generar provisionamiento.
     */
    public function run() {
        $this->recuperarProvision();
        $this->recuperarProvisionFinanciacion();
        $this->provisionar();
        $this->provisionarFinanciacion();
        $this->reclasificar();
    }

    /**
     * Verifica la actividad 
     * @throws MyException Error la actividad ya se ejecutó.
     */
    public function validarActividad() {
        $actividad = $this->genericoModel->consultarActividad($this->idCiclo, PROGRAMA_PROVISIONES);
        if ($actividad['bloquea'] == 'S' && !(Util::fechaEntreRango($actividad['fechainicio'], $actividad['fechacierre'], $actividad['fechaactual']))) {
            throw new MyException('Error al ejecutar la actividad, (verifique fechas del proceso en el periodo)');
        }
        $this->actividad = $actividad;
    }

    /**
     * Actualiza el estado de la actividad.
     * @throws MyException Error al inciar la actividad.
     */
    public function iniciarActividad() {
        $actualizo = $this->genericoModel->actualizarActividad($this->actividad, 'X');
        if ($actualizo == 0) {
            throw new MyException('Error al inciar el proceso');
        }
    }

    /**
     * Consulta las facturas a provisionar.
     */
    public function provisionar() {
        $listaFacturas = $this->provisionesModel->filtrarFacturasConSaldoProvisionar($this->idEmpresa, $this->fechaProvision);
        $this->provisionarFactura($listaFacturas, '0.33', 'PR');
    }

    /**
     * Recupera la provisión.
     */
    public function recuperarProvision() {
        $listaFacturas = $this->provisionesModel->pagosFacturasRecuperarProvision($this->fechaProvision);
        foreach ($listaFacturas as $factura) {
            $factura['valorprovisionar'] = abs($factura['abonoprovision'] * 0.33) * -1;
            $documentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['iddocumento'], $factura['idtipodocumento'], 'PR');
            $nuevaFactura = $this->provisionarFactura($factura, $documentoProvision);
            $this->recuperarDetalleProvision($factura, $nuevaFactura);
            $this->actualizarNumero($nuevaFactura);
        }
    }

    /**
     * Reclasifica las factuas de acuerdo a las fechas de vencimiento.
     */
    public function reclasificar() {
        $listaFacturas = $this->provisionesModel->consultarFacturasReclasificacion($this->fechaProvision, $this->idEmpresa);
        $this->provisionarFactura($listaFacturas, '0.66', 'RC');
        $this->provisionarFactura($listaFacturas, '0.34', 'CC');
        $this->castigarFacturasProvisionadas($listaFacturas);
        $this->castigarFacturasSinProvisionar($listaFacturas);
    }

    /**
     * Lista de facturas
     * @param array $listaFacturas Lista de facturas 
     */
    public function castigarFacturasProvisionadas($listaFacturas) {
        foreach ($listaFacturas as $factura) {
            $facturasCastigada = $this->provisionesModel->consultarFacturasProvisionadasParaCastigar($factura['idsuscripcion'], $this->fechaProvision);
            $this->provisionarFactura($facturasCastigada, '0.33', 'RC');
            $this->provisionarFactura($facturasCastigada, '0.67', 'CC');
            $this->actualizarEstado($facturasCastigada);
        }
    }

    /**
     * Castiga la facturas si necesidad que cumpla el tiempo.
     * @param array $listaFacturas Listado de facturas
     */
    public function castigarFacturasSinProvisionar($listaFacturas) {
        foreach ($listaFacturas as $factura) {
            $facturasCastigada = $this->provisionesModel->consultarFacturasSinProvisionarParaCastigar($factura['idsuscripcion'], $this->fechaProvision);
            $this->provisionarFactura($facturasCastigada, '1', 'CC');
            $this->actualizarEstado($facturasCastigada);
        }
    }

    /**
     * Se actualiza el estado a las facturas a castigada y el estado de la suscripción pasa a eliminado.
     * @param type $facturasCastigada
     */
    public function actualizarEstado($facturasCastigada) {
        foreach ($facturasCastigada as $factura) {
            $this->genericoModel->actualizarEstadoFactura($factura['idfactura'], 'C');
            $this->genericoModel->actualizarEstadoSuscripcion($factura['idsuscripcion'], 'E');
        }
    }

    /**
     * Provisiona las factuas
     * @param array $listaFacturas Lista de facturas a provisionar.
     * @param double $porcentaje porcentaje que se quiere provisionar de la factura.
     * @param string $tipoClasifica Tipo de clasificación de provisionamiento.
     */
    public function provisionarFactura($listaFacturas, $porcentaje, $tipoClasifica) {
        foreach ($listaFacturas as $factura) {
            $factura['valorprovisionar'] = ($factura['valortotal'] - $factura['valorpagado']) * $porcentaje;
            $documentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['iddocumento'], $factura['idtipodocumento'], $tipoClasifica);
            $nuevaLiquidacion = $this->genericoModel->getLiquidacion($documentoProvision['iddocumento'], $factura['idtipodocumento']);
            $nuevaFactura = $this->crearFactura($nuevaLiquidacion, $documentoProvision, $factura);
            $this->provisionarDetalleFactura($factura, $nuevaFactura, $porcentaje);
            $this->actualizarNumero($nuevaFactura);
        }
    }

    /**
     * Provisona el detalle de una factura
     * @param array $factura Información de la factura que se quiere aprovisionar
     * @param array $nuevaFactura  Información de la factura generada.
     * @param double $porcentaje Valor del porcentaje que se provisionó.
     */
    public function provisionarDetalleFactura($factura, $nuevaFactura, $porcentaje) {
        $conceptosFactura = $this->provisionesModel->consultarConceptosConSaldo($factura['idfactura']);
        foreach ($conceptosFactura as $concepto) {
            $concepto['valorunitario'] = $porcentaje;
            $concepto['valorprovisionar'] = ($concepto['valor'] - $concepto['valorpagado']) * $porcentaje;
            $this->crearDetalleFactura($nuevaFactura, $concepto);
        }
    }

    /**
     * Se crea la nueva factura.
     * @param array $nuevaLiquidacion información de la nueva liquidación que se procesó
     * @param array $documentoProvision información de la factura que se provisionó.
     * @param array $facturaActual Información de la factura actual.
     * @return type
     */
    public function crearFactura($nuevaLiquidacion, $documentoProvision, $facturaActual) {
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'A';
        $factura['fecha'] = 'now()';
        $factura['fechaaprobada'] = NULL;
        $factura['fechavence'] = NULL;
        $factura['idempresa'] = $facturaActual['idempresa'];
        $factura['idsuscriptor'] = $facturaActual['idsuscriptor'];
        $factura['idsuscripcion'] = $facturaActual['idsuscripcion'];
        $factura['idtiposuscripcion'] = $facturaActual['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $facturaActual['idtipousosuscripcion'];
        $factura['idliquidacion'] = $nuevaLiquidacion['idliquidacion'];
        $factura['idtercero'] = $facturaActual['idtercero'];
        $factura['idciclo'] = $this->cicloPeriodo['idciclo'];
        $factura['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $factura['iddocumento'] = $documentoProvision['iddocumento'];
        $factura['idtipodocumento'] = $facturaActual['idtipodocumento'];
        $factura['idestructuraliquidacion'] = $nuevaLiquidacion['idestructuraliquidacion'];
        $factura['idestructuratipousosuscripcion'] = $facturaActual['idestructuratipousosuscripcion'];
        $factura['historicoliquidacion'] = 0;
        $factura['idestructuradocumento'] = $documentoProvision['idestructuradocumento'];
        $factura['idestructuratipodocumento'] = $facturaActual['idestructuratipodocumento'];
        $factura['idestructuratiposuscripcion'] = $facturaActual['idestructuratiposuscripcion'];
        $factura['idtipotercero'] = $facturaActual['idtipotercero'];
        $factura['fechasuspension'] = NULL;
        $factura['idfacturaorigen'] = $facturaActual['idfactura'];
        $factura['saldoreal'] = $facturaActual['valorprovisionar'];
        $factura['idfactura'] = $this->genericoModel->insertarFactura($factura);
        return $factura;
    }

    /**
     * Genera un nuevo detalla de factura
     * @param array $nuevaFactura Información de la nueva factura.
     * @param array $concepto información del nuevo concepto.
     */
    public function crearDetalleFactura($nuevaFactura, $concepto) {
        $infoUnidadConcepto = $this->genericoModel->consultarEstructuraPorIdUnidad($concepto['idconcepto']);
        $detalleFactura['estado'] = 'A';
        $detalleFactura['iddetalleorigen'] = $concepto['iddetallefactura'];
        $detalleFactura['cantidad'] = 1;
        $detalleFactura['valorunitario'] = $concepto['valorunitario'];
        $detalleFactura['valortotal'] = $concepto['valorprovisionar'];
        $detalleFactura['valorreal'] = 0;
        $detalleFactura['saldoreal'] = 0;
        $detalleFactura['idfactura'] = $nuevaFactura['idfactura'];
        $detalleFactura['idsuscripcion'] = $nuevaFactura['idsuscripcion'];
        $detalleFactura['idtiposuscripcion'] = $nuevaFactura['idtiposuscripcion'];
        $detalleFactura['idliquidacion'] = $nuevaFactura['idliquidacion'];
        $detalleFactura['idconcepto'] = $concepto['idconcepto'];
        $detalleFactura['iddocumento'] = $nuevaFactura['iddocumento'];
        $detalleFactura['idtipodocumento'] = $nuevaFactura['idtipodocumento'];
        $detalleFactura['iddetalleamortizacion'] = NULL;
        $detalleFactura['idestructuratiposuscripcion'] = $nuevaFactura['idestructuratiposuscripcion'];
        $detalleFactura['idestructuraliquidacion'] = $nuevaFactura['idestructuraliquidacion'];
        $detalleFactura['idestructuraconcepto'] = $infoUnidadConcepto['idestructura'];
        $detalleFactura['idestructuradocumento'] = $nuevaFactura['idestructuradocumento'];
        $detalleFactura['idestructuratipodocumento'] = $nuevaFactura['idestructuratipodocumento'];
        $detalleFactura['idciclo'] = $this->cicloPeriodo['idcilo'];
        $detalleFactura['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $detalleFactura['iddetallefacturapadre'] = NULL;
        $detalleFactura['iddetallefinanciacion'] = NULL;
        $this->genericoModel->insertarDetalleFactura($detalleFactura);
    }

    /**
     * Actualiza el nuemero de la factura que se aprovisionó.
     * @param array $facturaProvision información de la factura.
     */
    public function actualizarNumero($facturaProvision) {
        $infoFactura['iddocumento'] = $facturaProvision['iddocumento'];
        $infoFactura['idtipodocumento'] = $facturaProvision['idtipodocumento'];
        $infoFactura['idEmpresa'] = $this->idEmpresa;
        $informacionNumero = $this->financiacionModel->obtenerNumeroFactura($infoFactura);
        $this->genericoModel->actualizarNumeroFactura($facturaProvision['idfactura'], $informacionNumero['numero']);
        $this->financiacionModel->actualizarNumeroDisponible($informacionNumero['numero'], $informacionNumero['idnumero']);
    }

    /**
     * Detalle de aprovisionamiento.
     * @param array $factura información de la factura.
     * @param array $nuevaFactura información de la nueva factura.
     */
    public function recuperarDetalleProvision($factura, $nuevaFactura) {
        $conceptosFactura = $this->provisionesModel->consultarAbonoConcepto($factura['idfactura'], $this->fechaProvision);
        foreach ($conceptosFactura as $concepto) {
            $concepto['valorunitario'] = '0.33';
            $concepto['valorprovisionar'] = abs($concepto['valorpagado'] * 0.33) * -1;
            $this->crearDetalleFactura($nuevaFactura, $concepto);
        }
    }

    /**
     * Provisiona factura
     * @param type $porcentaje procentaje de aprovisionamiento.
     */
    public function provisionarFinanciacion($porcentaje = 0.33) {
        $listaFinanciaciones = $this->provisionesModel->consultarFinanciacionesProvisionar($this->idEmpresa, $this->fechaProvision);
        foreach ($listaFinanciaciones as $financiacion) {
            $factura = $this->getFacturaFinanciacion($financiacion, $porcentaje);
            $documentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['iddocumento'], $factura['idtipodocumento'], 'PR');
            $nuevaLiquidacion = $this->genericoModel->getLiquidacion($documentoProvision['iddocumento'], $factura['idtipodocumento']);
            $nuevaFactura = $this->crearFactura($nuevaLiquidacion, $documentoProvision, $factura);
            $this->conceptosFinanciacionProvisionar($financiacion, $nuevaFactura, $porcentaje);
            $this->actualizarNumero($nuevaFactura);
        }
    }

    /**
     * Obtiene la información de la factura de acuerdo a una financiación.
     * @param array $financiacion información de la financiación.
     * @param double $porcentaje valor de aprovisionamiento 
     * @return array Información de la nueva factura con el aprovisionamiento.
     */
    public function getFacturaFinanciacion($financiacion, $porcentaje) {
        $factura = $this->provisionesModel->consultarInformacionFinanciacion($financiacion['idfinanciacion']);
        $factura['idfactura'] = null;
        $factura['valorprovisionar'] = ($financiacion['saldofinanciacion']) * $porcentaje;
        return $factura;
    }

    /**
     * Listado de conceptos a provisionar de acuerdo a una factura de financiación.
     * @param array $financiacion información de financiación.
     * @param array $nuevaFactura nueva factura q
     * @param double $porcentaje porcentaje de aprovisionamiento.
     */
    public function conceptosFinanciacionProvisionar($financiacion, $nuevaFactura, $porcentaje) {
        $listaConceptos = $this->provisionesModel->consultarConceptosFinanciacionProvisionar($financiacion['idfinanciacion']);
        foreach ($listaConceptos as $concepto) {
            $concepto['iddetallefactura'] = null;
            $concepto['valorunitario'] = $porcentaje;
            $concepto['valorprovisionar'] = $concepto['saldoconcepto'];
            $this->crearDetalleFactura($nuevaFactura, $concepto);
        }
    }

    /**
     * Devuleve el provisionamiento de una financiación.
     */
    public function recuperarProvisionFinanciacion() {
        $listaFinanciaciones = $this->provisionesModel->consultarFinanciacionesRecuperarProvision($this->idEmpresa, $this->fechaProvision);
        $porcentaje = 0.33;
        foreach ($listaFinanciaciones as $financiacion) {
            $factura = $this->getFacturaFinanciacion($financiacion, $porcentaje);
            $documentoProvision = $this->genericoModel->consultarDocumentoPorDocumentoyTipoDocumento($factura['iddocumento'], $factura['idtipodocumento'], 'PR');
            $nuevaLiquidacion = $this->genericoModel->getLiquidacion($documentoProvision['iddocumento'], $factura['idtipodocumento']);
            $nuevaFactura = $this->crearFactura($nuevaLiquidacion, $documentoProvision, $factura);
            $this->conceptosFinanciacionRecuperarProvision($financiacion, $nuevaFactura, $porcentaje);
            $this->actualizarNumero($nuevaFactura);
        }
    }

    /**
     * Devulve el aprovisionamiento de financiación.s
     * @param array $financiacion información de financiación.
     * @param array $nuevaFactura información de la nueva lectura.
     * @param double $porcentaje porcentaje de provisionamiento.
     */
    public function conceptosFinanciacionRecuperarProvision($financiacion, $nuevaFactura, $porcentaje) {
        $listaConceptos = $this->provisionesModel->consultarConceptosFinanciacionRecuperarProvision($financiacion['idfinanciacion'], $this->fechaProvision);
        foreach ($listaConceptos as $concepto) {
            $concepto['iddetallefactura'] = null;
            $concepto['valorunitario'] = $porcentaje;
            $concepto['valorprovisionar'] = $concepto['saldoconcepto'];
            $this->crearDetalleFactura($nuevaFactura, $concepto);
        }
    }

    /**
     * Provisiona y reclasifica las facturas ya aprovisionadas.
     */
    public function reclasificarFinanciacion() {
        $listaFinanciaciones = $this->provisionesModel->financiacionesParaReclasificar($this->fechaProvision, $this->idEmpresa);
        $this->provisionarFactura($listaFinanciaciones, '0.66', 'RC');
        $this->provisionarFactura($listaFinanciaciones, '0.34', 'CC');
    }

}
