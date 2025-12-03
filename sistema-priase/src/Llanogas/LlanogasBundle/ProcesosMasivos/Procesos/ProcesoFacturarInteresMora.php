<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\FinanciacionModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\InteresMoraModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\ValidacionException;

/**
 * Description of ProcesoAplicarRecaudos
 *
 * Clase encargada de procesar las facturas que se van a generar interés 
 * por ciclo
 * @author hrey
 */
class ProcesoFacturarInteresMora {

    /**
     *
     * \Llanogas\LlanogasBundle\Models\GenericoModel
     */
    private $genericoModel;

    /**
     *
     * @var InteresMoraModel 
     */
    private $interesMoraModel;
    private $idEmpresa;
    private $idCiclo;

    /**
     *
     * @var string de id facturas separados por coma 
     */
    private $facturas;

    /**
     *
     * @var array de las nuevas liquidaciones 
     */
    private $liquidacionIntereses;
    private $cicloPeriodo;
    private $idHistorialLiquidacion;

    /**
     *
     * @var FinanciacionModel 
     */
    private $financiacionModel;
    private $actividad;

    /**
     *
     * @var  Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoDelegado
     */
    private $genericoDelegado;

    /**
     * Constructor de la clase
     * @param int $idEmpresa  identificador de la empresa
     * @param int $idCiclo identificador del ciclo.
     */
    public function __construct($idEmpresa, $idCiclo) {
        $this->conexion = ConexionBD::getConexion();
        $this->conexion->beginTransaction();
        $this->interesMoraModel = new InteresMoraModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->idEmpresa = $idEmpresa;
        $this->idCiclo = $idCiclo;
        $this->facturas = $this->interesMoraModel->consultarFacturasConSaldoVencidas($idCiclo, $idEmpresa);
        $this->liquidacionIntereses = $this->interesMoraModel->consultarLiquidacionesInteresPorDocumentoYTipoDocumento($this->facturas);
        $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($idCiclo);
        $this->financiacionModel = new FinanciacionModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * Devuelve los cambios que se tengan pendiente.
     */
    public function __destruct() {
        $this->conexion->rollBack();
    }

    /**
     * Verifica que si la actividad se puede ejecutar
     * @throws MyException Error la actividad ya se ejecutó.
     */
    public function validarActividad() {
        $actividad = $this->genericoModel->consultarActividad($this->idCiclo, PROGRAMA_FACTURAR_INTERESES_MORA);
        if ($actividad['bloquea'] == 'S' && !(Util::fechaEntreRango($actividad['fechainicio'], $actividad['fechacierre'], $actividad['fechaactual']))) {
            throw new MyException('Error al ejecutar la actividad, (verifique fechas del proceso en el periodo)');
        }
        $this->actividad = $actividad;
    }

    /**
     * Inicia el proceso de facturar interés por mora.
     * @throws MyException No se pudo ejecutar la tarea.
     */
    public function procesar() {
        try {
            $this->iniciarActividad();
            $this->generarFacturacionInteresMora();
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al facturar los intereses por mora ' . $ex->getMessage(), -1);
        }
    }

    /**
     * Actualiza el estado de la tarea.
     * @throws MyException Error al actualizar el estado
     */
    public function iniciarActividad() {
        $actualizo = $this->genericoModel->actualizarActividad($this->actividad, 'X');
        if ($actualizo == 0) {
            throw new MyException('Error al inciar el proceso');
        }
    }

    /**
     * Valida los conceptos repetidos.
     */
    public function validarConceptosRepetidosBase() {
        foreach ($this->liquidacionIntereses as $documento) {
            $idLiquidacion = $documento['idliquidacion'];
            $listaConceptos = $this->interesMoraModel->consultarConceptosRepetidosEnBase($idLiquidacion);
            if (!empty($listaConceptos)) {
                $respuesta['codigoRespuesta'] = -1;
                $respuesta['mensajeRespuesta'] = 'Existen conceptos que se encuentran en dos liquidaciones';
                $respuesta['conceptos'] = $listaConceptos;
                $this->lanzarError($respuesta);
            }
        }
    }

    /**
     * Se validan que conceptos no hacen base para realizar la liquidación de interés 
     * por mora 
     */
    public function validarConceptoQueNoHacenBase() {
        foreach ($this->liquidacionIntereses as $documento) {
            $idLiquidacion = $documento['idliquidacion'];
            $listaConceptos = $this->interesMoraModel->consultarConceptosFacturasNoBase($this->facturas, $idLiquidacion);
            if (!empty($listaConceptos)) {
                $respuesta['codigoRespuesta'] = -3;
                $respuesta['mensajeRespuesta'] = 'Existen conceptos que no hacen base';
                $respuesta['conceptos'] = $listaConceptos;
                $this->lanzarError($respuesta);
            }
        }
    }

    /**
     * Genera la facturas de interés por mora.
     * @return null Si no hay facturas. 
     */
    public function generarFacturacionInteresMora() {
        $listaFacturas = explode(',', $this->facturas);
        if (empty($listaFacturas)) {
            return;
        }
        foreach ($listaFacturas as $idFactura) {
            $facturaActual = $this->genericoModel->consultarFactura($idFactura);
            $facturaInteres = $this->crearFactura($facturaActual);
            foreach ($this->liquidacionIntereses as $liquidacion) {
                $detallesFacturas = $this->interesMoraModel->consultarDetallesFactura($liquidacion['idconceptointeres'], $idFactura);
                $this->crearDetalleFactura($facturaInteres, $detallesFacturas, $liquidacion);
            }
            $infoFactura = $this->genericoModel->consultarFactura($facturaInteres['idfactura']);
            $this->genericoDelegado->actualizarFacturaSaldo($facturaInteres['idfactura'], $infoFactura['version']);
            $facturaInteres['tipo'] = 'FA';
            $this->genericoDelegado->actualizarNumeroFactura($facturaInteres);
        }
    }

    /**
     * Crea una nueva factura.
     * @param array $facturaActual Información de la nueva factura.
     * @return int identificador de la nueva factura.
     */
    public function crearFactura($facturaActual) {
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'A';
        $factura['fecha'] = 'now()';
        $factura['fechaaprobacion'] = 'now()';
        $factura['fechavencimiento'] = 'now()';
        $factura['idempresa'] = $this->idEmpresa;
        $factura['idsuscriptor'] = $facturaActual['idsuscriptor'];
        $factura['idsuscripcion'] = $facturaActual['idsuscripcion'];
        $factura['idtiposuscripcion'] = $facturaActual['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $facturaActual['idtipousosuscripcion'];
        $factura['idliquidacion'] = $this->liquidacionIntereses[0]['idliquidacionnueva'];
        $factura['idtercero'] = $facturaActual['idtercero'];
        $factura['idciclo'] = $this->cicloPeriodo['idciclo'];
        $factura['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $factura['iddocumento'] = $this->liquidacionIntereses[0]['iddocumentonuevo'];
        $factura['idtipodocumento'] = $facturaActual['idtipodocumento'];
        $factura['idhistoricoliquidacion'] = $this->idHistorialLiquidacion;
        $factura['saldoreal'] = 0;
        $factura['idtipotercero'] = $facturaActual['idtipotercero'];
        $factura['idfacturaorigen'] = $facturaActual['idfactura'];
        $factura['version'] = 1;
        $idFactura = $this->genericoModel->insertarFactura($factura);
        $factura['idfactura'] = $idFactura;
        return $factura;
    }

    /**
     * Genera detalle de la factura.
     * @param array $facturaInteres Información factura de interés
     * @param array $detallesFacturas Información de detalles de factura
     * @param array $liquidacion información de la liquidación.
     * @return null si el detalle llega vacío.
     */
    public function crearDetalleFactura($facturaInteres, $detallesFacturas, $liquidacion) {
        if (empty($detallesFacturas)) {
            return;
        }
        foreach ($detallesFacturas as $detalle) {
            $detalleFactura['estado'] = 'A';
            $detalleFactura['cantidad'] = 1;
            $detalleFactura['valorunitario'] = $liquidacion['tasainteres'];
            $detalleFactura['valortotal'] = $detalle['saldoconcepto'];
            $detalleFactura['valorreal'] = $detalle['saldoconcepto'] * $liquidacion['tasainteres'];
            $detalleFactura['saldoreal'] = $detalle['saldoconcepto'] * $liquidacion['tasainteres'];
            $detalleFactura['idfactura'] = $facturaInteres['idfactura'];
            $detalleFactura['idconcepto'] = $liquidacion['idconceptointeres'];
            $detalleFactura['idciclo'] = $facturaInteres['idciclo'];
            $detalleFactura['idperiodo'] = $facturaInteres['idperiodo'];
            $this->genericoModel->insertarDetalleFactura($detalleFactura);
        }
    }

    /**
     * Devulve un error con datos de validación.
     * @param array $respuesta información de la excepción 
     * @throws ValidacionException Los conceptos que no hacen base para la liquidación de interés.
     */
    public function lanzarError($respuesta) {
        $error = new ValidacionException();
        $error->setData($respuesta);
        throw $error;
    }

}
