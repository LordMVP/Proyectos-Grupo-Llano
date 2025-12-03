<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\FacturarFinanciacionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\ValidacionException;

/**
 * Description of ProcesoAplicarRecaudos
 *
 * @author hrey
 */
class ProcesoFacturarFinanciacion {
    /**
     * Constructor de la clase
     * @param int $idCiclo identificador del ciclo
     * @param int $idTipoSuscripcion identificador del tipo de suscripción.
     * @param int $idEmpresaSesion identificador de la sesión del usuario.
     */

    /**
     *
     * @var array 
     */
    private $sesion;

    /**
     *
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
     * @var int 
     */
    private $idCiclo;

    /**
     *
     * @var int 
     */
    private $idControlProceso;

    /**
     *
     * @var FacturarFinanciacionModel 
     */
    private $facturarFinanciacionModel;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;

    /**
     * Información del ciclo periodo
     * @var array 
     */
    private $cicloPeriodo;

    /**
     *
     * @var array 
     */
    private $financiacion;

    /**
     *
     * @var array 
     */
    private $amortizacion;

    /**
     *
     * @var array 
     */
    private $factura;

    public function __construct($idAcceso, $idCiclo) {
        $this->idCiclo = $idCiclo;
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $this->genericoModel->getInfoSesion($idAcceso);
        $this->facturarFinanciacionModel = new FacturarFinanciacionModel($this->conexion, $this->sesion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        if ($idCiclo != -1) {
            $this->cicloPeriodo = $this->genericoModel->getCicloPeriodoId($idCiclo);
        }
    }

    /**
     * Carga todas las financiaciones en la tabla temporal para ser 
     * liquidadas
     */
    public function cargarFinanciaciones() {
        $this->facturarFinanciacionModel->vaciarTabla();
        $this->facturarFinanciacionModel->cargarFinanciaciones($this->idCiclo);
    }

    /**
     * Cuenta cuantas financiaciones se van a facturar 
     * @return type
     */
    public function cantidadFacturasFinanciadas() {
        return $this->facturarFinanciacionModel->consultarCantidadFacturas($this->idCiclo);
    }

    /**
     * Procesa masivamente las financiaciones y les establece una tasa de interés 
     */
    public function actualizarTasaInteres() {
        $this->facturarFinanciacionModel->actualizarTasaInteres();
    }

    /**
     * Valida los conceptos de liquidaciones.
     * @return array Listado de financiaciones.
     */
    public function validarConceptosDeLiquidaciones() {
        $financiaciones = $this->genericoModel->validarConceptosDeLiquidaciones($this->idCiclo, -1);
        if (!empty($financiaciones)) {
            $validacion = new ValidacionException('Hay conceptos que no hacen base', -3);
            $validacion->setData($financiaciones);
            throw $validacion;
        }
    }

    /**
     * Inicia el proceso de liquidar las financiaciones y de a 500 registros
     * @param type $numeroProceso
     * @return type
     * @throws MyException
     */
    public function iniciar($numeroProceso) {
        $listaFinanciaciones = $this->facturarFinanciacionModel->getFinanciacionesProceso($numeroProceso);
        print_r('Procesando financiaciones');
        print_r($listaFinanciaciones);
        if (empty($listaFinanciaciones)) {
            return;
        }
        foreach ($listaFinanciaciones as $financiacion) {
            try {
                $this->conexion->beginTransaction();
                $estado = 'G';
                $mensaje = 'Financiacion generada correctamente';
                /**
                 * Se valida que la fecha de finalización del periodo y la fecha 
                 * de la financiación no sea negativa
                 */
                if ($financiacion['diasfacturar'] <= 0) {
                    throw new MyException('No se puede facturar la financiación, cantidad de días a facturar ' . $this->financiacion['diasfacturar'], -1);
                }
                $this->procesarFinanciacion($financiacion);
                $this->inicializarArreglos();
                $this->conexion->commit();
            } catch (\Exception $ex) {
                $estado = 'F';
                $mensaje = $ex->getMessage();
                $this->conexion->rollBack();
            } finally {
                $this->actualizarRegistro($financiacion['idfinanciacion'], $estado, $mensaje);
            }
        }
        $this->iniciar($numeroProceso);
    }

    /**
     * Procesa una financiación en específico 
     * @param array $financiacion información de la financiación que se va a procesar 
     * @throws MyException
     */
    private function procesarFinanciacion(array &$financiacion) {
        $this->financiacion = $financiacion;
        if ($financiacion['tipocuota'] == 'N') {
            throw new MyException('Error en la parametrización de la liquidación ' . $financiacion['idliquidacion'], -1);
        }
        /**
         * Se valida que la financiación no esté liquidada 
         */
        $this->facturarFinanciacionModel->validarFacturaCicloPeriodoActual($this->financiacion, $this->cicloPeriodo, $this->financiacion['idfinanciacion']);
        try {
            $this->crearAmortizacion();
            $this->crearFactura();
            /**
             * Se valida el tipo de cuota V=Variable o F=Fija
             */
            if ($financiacion['tipocuota'] == 'F') {
                $this->procesarCuotaFija();
                return;
            }
            $this->procesarCuotaVariable();
        } finally {
            $this->actualizarValorFactura();
            $this->actualizarAmortizacionFinanciacion();
            $saldoFinanciacion = $this->genericoDelegado->actualizarFinanciacionSaldo($this->financiacion['idfinanciacion'], $this->financiacion['fin_version']);
            if ($saldoFinanciacion < 1) {
                $this->facturarFinanciacionModel->cerrarSaldoFinanciacionModel($this->financiacion['idfinanciacion']);
            }
        }
    }

    /**
     * Inicializa los arreglos para la siguiente financiación
     */
    private function inicializarArreglos() {
        $this->financiacion = null;
        $this->factura = null;
        $this->amortizacion = null;
    }

    /**
     * Valida que tipo de cuota se va a generar si una cuota 0 o la cuota de 30 días  
     * @return type
     */
    private function procesarCuotaVariable() {
        if ($this->financiacion['diasfacturar'] == 30) {
            $this->procesarCuotaVariableCompleta();
            return;
        }
        $this->procesarCuotaCero();
    }

    /**
     * Genera la cuota variable completa 
     * @throws MyException
     */
    private function procesarCuotaVariableCompleta() {
        /**
         * Genera la cuota para los conceptos que no generan interés 
         */
        $noBase = $this->procesarConceptosNoBaseCuota();
        $base = $this->procesarConceptosBaseCuotaVariable();
        if (empty($noBase) && empty($base)) {
            throw new MyException('Error la financiación no tiene detalles ' . $this->financiacion['idfinanciacion'], -1);
        }
    }

    /**
     * Procesa los conceptos que generan interés en una 
     * cuota variable
     * @return int
     */
    private function procesarConceptosBaseCuotaVariable() {
        $listaConceptos = $this->facturarFinanciacionModel->consultarConceptos($this->financiacion['idliquidacion'], $this->financiacion['idfinanciacion']);
        if (empty($listaConceptos)) {
            return;
        }
        $valorTotalInteres = 0;
        foreach ($listaConceptos as $concepto) {
            $saldoConcepto = $concepto['saldo'];
            $tasaInteres = $this->financiacion['tasainteres'] / 100;
            $valorInteres = $saldoConcepto * $tasaInteres;
            $valorTotalInteres += $valorInteres;
            $conceptoAbonoCapital = $saldoConcepto / $this->financiacion['cuotasfaltantes'];
            /**
             * Se valida que sea la última cuota 
             * si es así se toma el saldo del concepto financiado
             */
            if ($this->financiacion['numerocuotas'] - $this->amortizacion['cuotasamortizadas'] == 0) {
                $conceptoAbonoCapital = $saldoConcepto;
            }
            $concepto['valorconceptocuota'] = $conceptoAbonoCapital;
            $detalleAmortizacion = $this->insertarDetalleAmortizacion($concepto);
            $this->insertarDetalleFactura($detalleAmortizacion);
        }
        $this->procesarOtrosConceptos($valorTotalInteres);
        return 1;
    }

    /**
     * Valida que tipo de cuota va  a generar si la cuota 0 o la cuota completa 
     * @return type
     */
    private function procesarCuotaFija() {
        if ($this->financiacion['diasfacturar'] == 30) {
            $this->procesarCuotaFijaCompleta();
            return;
        }
        $this->procesarCuotaCero();
    }

    /**
     * Genera la cuota 0 de la financiación, se generan únicamente intereses 
     */
    private function procesarCuotaCero() {
        $tasaInteres = $this->financiacion['tasainteres'];
        $saldoFinanciacion = $this->facturarFinanciacionModel->saldoConceptosBase($this->financiacion['idliquidacion'], $this->financiacion['idfinanciacion']);
        $diasFacturar = $this->financiacion['diasfacturar'];
        /**
         * Se calcula el valor de los intereses de acuerdo a la cantidad de días 
         */
        $valorTotalInteres = (($saldoFinanciacion * ($tasaInteres / 100)) / 30) * $diasFacturar;
        $this->procesarOtrosConceptos($valorTotalInteres);
    }

    /**
     * Genera la cuota completa  
     * @throws MyException
     */
    private function procesarCuotaFijaCompleta() {
        /**
         * Genera los detalles de los conceptos que no generan interés 
         */
        $noBase = $this->procesarConceptosNoBaseCuota();
        /**
         * Genera los conceptos que tienen un interés asociado
         */
        $base = $this->procesarConceptosBaseCuotaFija();
        if (empty($noBase) && empty($base)) {
            throw new MyException('Error la financiación no tiene detalles ' . $this->financiacion['idfinanciacion'], -1);
        }
    }

    /**
     * Se realiza la división del saldo por la cantidad de cuotas faltantes  
     * @return int
     */
    private function procesarConceptosNoBaseCuota() {
        $listaConceptos = $this->facturarFinanciacionModel->consultarConceptos($this->financiacion['idliquidacion'], $this->financiacion['idfinanciacion'], 'NOT');
        if (empty($listaConceptos)) {
            return;
        }
        foreach ($listaConceptos as $concepto) {
            /**
             * Se valida que si la cuota faltante es la última se 
             * toma el saldo de la financiación
             */
            if ($this->financiacion['cuotasfaltantes'] === 1) {
                $concepto['valorconceptocuota'] = $concepto['saldo'];
            } else {
                $concepto['valorconceptocuota'] = $concepto['saldo'] / $this->financiacion['cuotasfaltantes'];
            }
            $detalleAmortizacion = $this->insertarDetalleAmortizacion($concepto);
            $this->insertarDetalleFactura($detalleAmortizacion);
        }
        return 1;
    }

    /**
     * Se procede a generar los conceptos que hacen base 
     * @return int
     */
    private function procesarConceptosBaseCuotaFija() {
        $listaConceptos = $this->facturarFinanciacionModel->consultarConceptos($this->financiacion['idliquidacion'], $this->financiacion['idfinanciacion']);
        if (empty($listaConceptos)) {
            return;
        }
        $valorTotalInteres = 0;
        foreach ($listaConceptos as $concepto) {
            $saldoConcepto = $concepto['saldo'];
            /**
             * Se saca el valor de la tasa de interés ya que ne la vase de datos se guarda 1.2%
             */
            $tasaInteres = $this->financiacion['tasainteres'] / 100;
            $valorInteres = $saldoConcepto * $tasaInteres;
            $valorTotalInteres += $valorInteres;
            $numeroCuota = $this->financiacion['numerocuotas'] - $this->financiacion['cuotasamortizadas'];
            $valorCuotaConcepto = $this->calcularCuotaDeConceptoBaseFija($saldoConcepto, $tasaInteres, $numeroCuota);
            /**
             * Se valida que se va a generar la última cuota y si es afirmativo se toma 
             * el saldo
             */
            if ($this->financiacion['cuotasfaltantes'] === 1) {
                $conceptoAbonoCapital = $saldoConcepto;
            } else {
                $conceptoAbonoCapital = $valorCuotaConcepto - $valorInteres;
            }
            $concepto['valorconceptocuota'] = $conceptoAbonoCapital;
            $detalleAmortizacion = $this->insertarDetalleAmortizacion($concepto);
            $this->insertarDetalleFactura($detalleAmortizacion);
        }
        $this->procesarOtrosConceptos($valorTotalInteres);
        return 1;
    }

    /**
     *  Se inserta el concepto de interés con el valor total
     * @param type $valorTotalInteres
     * @return type
     */
    public function procesarOtrosConceptos($valorTotalInteres) {
        if ($this->financiacion['idconceptointeres'] == 0) {
            return;
        }
        $concepto['valorconceptocuota'] = $valorTotalInteres;
        $concepto['idconcepto'] = $this->financiacion['idconceptointeres'];
        $concepto['iddetallefinanciacion'] = null;
        $concepto['iddetalleamortizacion'] = null;
        $this->insertarDetalleFactura($concepto);

        $historicoInteres['idfactura'] = $this->factura['idfactura'];
        $historicoInteres['idconcepto'] = $this->financiacion['idconceptointeres'];
        $historicoInteres['tasainteres'] = $this->financiacion['tasainteres'];
        $historicoInteres['idusuario'] = $this->sesion['idusuario'];
        $this->facturarFinanciacionModel->insertarHistoricoInteres($historicoInteres);

        if ($this->financiacion['idconceptoivainteres'] == 0) {
            return;
        }
        $concepto['valorconceptocuota'] = $valorTotalInteres * ($this->financiacion['tasaivainteres']);
        $concepto['idconcepto'] = $this->financiacion['idconceptoivainteres'];
        $concepto['iddetallefinanciacion'] = null;
        $concepto['iddetalleamortizacion'] = null;
        $this->insertarDetalleFactura($concepto);
    }

    /**
     * Se agrega la amortización en la base de datos 
     */
    private function crearAmortizacion() {
        $amortizacion['estado'] = 'A';
        $amortizacion['fecha'] = 'now()';
        $amortizacion['idamortizacionfinanciacion'] = $this->financiacion['idamortizacionfinanciacion'];
        $amortizacion['cuotasamortizadas'] = $this->financiacion['cuotasamortizadas'] + 1;
        $amortizacion['idfinanciacion'] = $this->financiacion['idfinanciacion'];
        $amortizacion['idliquidacion'] = $this->financiacion['idliquidacion'];
        $amortizacion['iddocumento'] = $this->financiacion['iddocumento'];
        $amortizacion['idtipodocumento'] = $this->financiacion['idtipodocumento'];
        $amortizacion['idciclo'] = $this->cicloPeriodo['idciclo'];
        $amortizacion['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $amortizacion['idempresa'] = $this->sesion['idempresa'];
        $amortizacion['cicloanio'] = $this->cicloPeriodo['cicloanio'];
        $amortizacion['idusuario'] = $this->sesion['idusuario'];
        if ($this->financiacion['diasfacturar'] == 30) {
            $this->facturarFinanciacionModel->insertarAmortizacion($amortizacion);
        }
        $this->amortizacion = $amortizacion;
    }

    /**
     * Ingresa un nuevo detalle de amortización.
     * @param array $concepto detalle de amortización
     * @param array $financiacion Detalle de financiación.
     * @return int identificador del nuevo registro.
     */
    private function insertarDetalleAmortizacion($concepto) {
        $detalleAmortizacion['iddetalleamortizacion'] = NULL;
        $detalleAmortizacion['valortotal'] = $concepto['facturavalortotal'];
        $detalleAmortizacion['valorreal'] = $concepto['valorconceptocuota'];
        $detalleAmortizacion['idamortizacion'] = $this->amortizacion['idamortizacion'];
        $detalleAmortizacion['iddetallefinanciacion'] = $concepto['iddetallefinanciacion'];
        $detalleAmortizacion['idsuscripcion'] = $this->financiacion['idsuscripcion'];
        $detalleAmortizacion['idciclo'] = $this->cicloPeriodo['idciclo'];
        $detalleAmortizacion['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $detalleAmortizacion['cicloanio'] = $this->cicloPeriodo['cicloanio'];
        $detalleAmortizacion['idusuario'] = $this->sesion['idusuario'];
        $detalleAmortizacion['idempresa'] = $this->sesion['idempresa'];
        $detalleAmortizacion['idfactura'] = $concepto['idfactura'];
        $detalleAmortizacion['iddetallefactura'] = $concepto['iddetallefactura'];
        $detalleAmortizacion['idliquidacion'] = $this->financiacion['idliquidacion'];
        $detalleAmortizacion['idconcepto'] = $concepto['idconcepto'];
        $detalleAmortizacion['iddocumento'] = $this->financiacion['iddocumento'];
        $detalleAmortizacion['idtipodocumento'] = $this->financiacion['idtipodocumento'];
        $idDetalleAmortizacion = $this->facturarFinanciacionModel->insertarDetalleAmortizacion($detalleAmortizacion);
        $detalleAmortizacion['iddetalleamortizacion'] = $idDetalleAmortizacion;
        $detalleAmortizacion['valorconceptocuota'] = $concepto['valorconceptocuota'];
        return $detalleAmortizacion;
    }

    /**
     * Se genera la factura  
     */
    private function crearFactura() {
        $suscripcion = $this->genericoModel->consultarInformacionSuscripcion($this->financiacion['idsuscripcion']);
        $fechas = $this->getFechasFactura();
        $factura['metodogenera'] = 'P';
        $factura['estado'] = 'X';
        $factura['fecha'] = 'now()';
        $factura['fechaaprobacion'] = 'now()';
        $factura['fechavencimiento'] = $fechas['fechavencimiento'];
        $factura['idempresa'] = $this->sesion['idempresa'];
        $factura['idsuscriptor'] = $suscripcion['idsuscriptor'];
        $factura['idsuscripcion'] = $this->financiacion['idsuscripcion'];
        $factura['idtiposuscripcion'] = $suscripcion['idtiposuscripcion'];
        $factura['idtipousosuscripcion'] = $suscripcion['idtipousosuscripcion'];
        $factura['idliquidacion'] = $this->amortizacion['idliquidacion'];
        $factura['idtercero'] = $suscripcion['idtercero'];
        $factura['idciclo'] = $this->cicloPeriodo['idciclo'];
        $factura['idperiodo'] = $this->cicloPeriodo['idperiodo'];
        $factura['iddocumento'] = $this->amortizacion['iddocumento'];
        $factura['idtipodocumento'] = $this->amortizacion['idtipodocumento'];
        $factura['idamortizacion'] = $this->amortizacion['idamortizacion'];
        $factura['cicloano'] = $this->cicloPeriodo['cicloanio'];
        $factura['idhistoricoliquidacion'] = 0;
        $factura['saldofactura'] = 0;
        $factura['idtipotercero'] = $suscripcion['idtipotercero'];
        $factura['fechasuspende'] = $fechas['fechasuspension'];
        $factura['idfinanciacion'] = $this->financiacion['idfinanciacion'];
        $factura['valortotal'] = 0;
        $factura['idusuario'] = $this->sesion['idusuario'];
        $factura['idfactura'] = $this->genericoModel->insertarFactura($factura);
        $this->factura = $factura;
    }

    /**
     * Se obtienen las fechas de vencimiento de acuerdo a la ruta 
     * @return type
     */
    private function getFechasFactura() {
        $idSuscripcion = $this->financiacion['idsuscripcion'];
        $infoSuscripcion ['idsuscripcion'] = $idSuscripcion;
        $infoSuscripcion ['idliquidacion'] = $this->amortizacion['idliquidacion'];
        return $this->genericoDelegado->getFechaFactura($infoSuscripcion, $this->cicloPeriodo);
    }

    private function insertarDetalleFactura($detalle) {
        $detalleFactura['estado'] = 'A';
        $detalleFactura['cantidad'] = 1;
        $detalleFactura['valorunitario'] = $detalle['valorconceptocuota'];
        $detalleFactura['valortotal'] = $detalle['valorconceptocuota'];
        $detalleFactura['valorreal'] = $detalle['valorconceptocuota'];
        $detalleFactura['saldoreal'] = $detalle['valorconceptocuota'];
        $detalleFactura['idfactura'] = $this->factura['idfactura'];
        $detalleFactura['idconcepto'] = $detalle['idconcepto'];
        $detalleFactura['iddetalleamortizacion'] = $detalle['iddetalleamortizacion'];
        $detalleFactura['iddetallefinanciacion'] = $detalle['iddetallefinanciacion'];
        $detalleFactura['idusuario'] = $this->sesion['idusuario'];
        $detalleFactura['idempresa'] = $this->sesion['idempresa'];
        $this->genericoModel->insertarDetalleFactura($detalleFactura);
    }

    /**
     * Se actualiza el valor de la factura en el encabezado
     * @return type
     */
    private function actualizarValorFactura() {
        if (empty($this->factura)) {
            return;
        }
        
        $valor = $this->facturarFinanciacionModel->getValorFactura($this->factura['idfactura'], $this->sesion['idempresa']);
        /*
         * Se incluye validación de valor de los detalles generados por la cuota , si estos no superan el valor 0 
         * no se actualiza el encabezado de la factura 
         */
        if ($valor > 0) {
            $factura['fac_ideregistro'] = $this->factura['idfactura'];
            $factura['fac_vlrreal'] = $valor;
            $factura['fac_sdoreal'] = $valor;
            $this->facturarFinanciacionModel->actualizar($factura, "fac_factura", "fac_ideregistro=:fac_ideregistro");
        }
    }

    /**
     * Actualiza el número de cuota amortizada en la tabla amfi_
     * @return type
     */
    private function actualizarAmortizacionFinanciacion() {
        if ($this->financiacion['diasfacturar'] != 30) {
            return;
        }
        $data['amfi_ideregistr'] = $this->financiacion['idamortizacionfinanciacion'];
        $data['amfi_cuoamortiz'] = $this->financiacion['cuotasamortizadas'] + 1;
        $this->facturarFinanciacionModel->actualizar($data, 'amfi_amofinanci', 'amfi_ideregistr=:amfi_ideregistr');
    }

    /**
     * Calcula la cuota de la financiación.
     * @param dpuble $capitalInicial capital inicial
     * @param double $tasaInteres interés
     * @param int $numeroCuotas número de cuotas.
     * @return double valor de la cuota.
     */
    private function calcularCuotaDeConceptoBaseFija($capitalInicial, $tasaInteres, $numeroCuotas) {
        if ($tasaInteres == 0) {
            return round(($capitalInicial / $numeroCuotas), CANTIDAD_DECIMALES);
        }
        $p = $capitalInicial;
        $i = $tasaInteres;
        $n = $numeroCuotas;
        $numerador = ($p * $i);
        $denominador = 1 - (pow(1 + $i, -$n));
        return round(($numerador / $denominador), CANTIDAD_DECIMALES);
    }

    public function registrarProceso($numeroProceso) {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_FACTURAR_FINANCIACION;
            $proceso['idAcceso'] = $this->sesion['idacceso'];
            $proceso['idEmpresa'] = $this->sesion['idempresa'];
            $proceso['idHilo'] = $numeroProceso;
            $this->idControlProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
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
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function actualizarRegistro($idFinanciacion, $estado, $mensaje) {
        try {
            $this->conexion->beginTransaction();
            $this->facturarFinanciacionModel->actualizarRegistroProceso($idFinanciacion, $estado, $mensaje);
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    public function validarProcesoEjecucion() {
        $resultado = $this->procesoModel->getProcesoEjecucionFinanciacion($this->sesion['idempresa'], PROGRAMA_FACTURAR_FINANCIACION);
        if (empty($resultado)) {
            return;
        }
        if ($resultado == -4) {
            return;
        }
        $validacionException = new ValidacionException('Hay un proceso en ejecución', -3);
        $validacionException->setData($resultado);
        throw $validacionException;
    }

    public function getErrores() {
        return $this->facturarFinanciacionModel->getErrores();
    }

    public function getSatisfactorios() {
        return $this->facturarFinanciacionModel->getSatisfactorios();
    }

    /**
     * Aprueba las facturas que se generaron después de la aprobación.
     * @return array Lista de errores 
     * @throws MyException Error si no hay facturas por aprobar
     */
    public function aprobarFacturacion() {
        $listaErrores = array();
        $listaFacturas = $this->facturarFinanciacionModel->consultarFacturasGeneradas();
        $this->facturarFinanciacionModel->vaciarTabla();
        $idEmpresa = $this->sesion['idempresa'];
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas para aprobar', 0);
        }
        
        /*
        *  Valida Parametro CORREO_AUTOMATICO_EXTRACTO para la empresa en Sesión 
        */
        
        $validaExtractoAutomatico = $this->genericoDelegado->consultarParametroExtractoAutomatico($this->sesion['idempresa']);
        
        if ($validaExtractoAutomatico[0]['valor'] == "TRUE") {
            $listacicloperodos = $this->facturarFinanciacionModel->consultarCicloPeriodosFactGeneradas();
        
             /* Guarda la informacion del ciclo y el periodo en la tabla de control */
            foreach ($listacicloperodos as $cicloperiodo) {
                try {
                    $this->conexion->beginTransaction();             

                    $tcec_date['cic_ideregistro'] = $cicloperiodo['idciclo'] ;
                    $tcec_date['per_ideregistro'] = $cicloperiodo['idperiodo'] ;
                    $tcec_date['tcec_fecliquidacion'] = 'now()' ;
                    $tcec_date['usu_ideregistro'] = $this->sesion['idusuario'] ;
                    $tcec_date['emp_ideregistro'] = $cicloperiodo['idempresa'] ;
                    $id_tcec = $this->genericoModel->insertarTcec_ControExtrAutimatico($tcec_date);
                    $this->conexion->commit();
                } catch (\Exception $e) {
                    $this->conexion->rollBack();
                    $error['idfactura'] = "Ciclo: " . $cicloperiodo['idciclo'] ;
                    $error['mensaje'] = $e->getMessage();
                    $listaErrores[] = $error;
                }
            } 
        } 
        /*
        *  finaliza valida Parametro CORREO_AUTOMATICO_EXTRACTO para la empresa en Sesión 
        */
        $infoPrograma = $this->genericoDelegado->validarPrograma(PROGRAMA_FACTURAR_FINANCIACION, $this->idCiclo, $idEmpresa);
        if ($infoPrograma['idactividad'] != 0) {
            $this->genericoModel->actualizarActividad($infoPrograma, 'C');
        }
        foreach ($listaFacturas as $factura) {
            try {
                 $this->conexion->beginTransaction();
                $this->genericoModel->actualizarEstadoFactura($factura['idfactura'], 'A');
                $factura['tipo'] = 'FA';
                $this->genericoDelegado->actualizarNumeroFactura($factura);
                $facturafelec['fac_ctrlfelec'] = 0;
                $facturafelec['fac_ideregistro'] = $factura['idfactura'];
                $this->genericoModel->actualizarFactura($facturafelec);
                $this->conexion->commit();
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $error['idfactura'] = $factura['idfactura'];
                $error['mensaje'] = $e->getMessage();
                $listaErrores[] = $error;
            }
        }     
        
        return $listaErrores;
    }

}
