<?php

namespace Libranza\LibranzaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Libranza\LibranzaBundle\Models\RegistroCreditoModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Libranza\LibranzaBundle\Models\FuncionesCreditoModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class FuncionesCreditoDelegado {

    /**
     *  Conexión a la base de datos 
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * permite capturar el generico model
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var Array sesion
     */
    private $sesion;

    /**
     *
     * @var FuncionesCreditoModel 
     */
    private $funcionesCredito;

    /**
     *
     * @var int  identificador de crédito
     */
    private $idcredito;
    private $diasPrima = 0;
    private $diasCesantias = 0;
    private $mesGarantia = 0;
    private $valorAuxlTrasporte = 0;
    private $garantia_2 = 0;

    public function __construct($idcredito) {
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->idcredito = $idcredito;
        $this->funcionesCredito = new FuncionesCreditoModel($this->conexion);
    }

    /**
     * permite calcular edad
     * @param array $parametros
     */
    public function calcular_edad(array $parametros) {
        $edad = $this->funcionesCredito->obtenerEdad($this->idcredito);
        $unidad = 0;
        if ($edad >= 26 && $edad <= 55) {
            $unidad = 1.5;
        }
        if ($edad >= 23 && $edad <= 25) {
            $unidad = 1;
        }
        if ($edad < 23) {
            $unidad = 0;
        }
        if ($edad > 65) {
            $unidad = 0;
        }
        $respuesta['valorvariable'] = $edad;
        $respuesta['scoring'] = $unidad;

        return $respuesta;
    }

    /**
     * 
     * @param type $capitalInicial
     * @param type $tasaInteres
     * @param type $numeroCuotas
     * @return type
     */
    private function calcularCuota($capitalInicial, $tasaInteres, $numeroCuotas) {
        if ($tasaInteres == 0) {
            return round(($capitalInicial / $numeroCuotas), CANTIDAD_DECIMALES);
        }
        $p = $capitalInicial;
        $i = $tasaInteres / 100;
        $n = $numeroCuotas;
        $numerador = $p;
        $denominador = (1 - (pow(1 + $i, -$n))) / $i;
        return round($numerador / $denominador, CANTIDAD_DECIMALES);
    }

    public function relacion_liquido(array $parametros) {

        if (empty($parametros)) {
            $respuesta['valorvariable'] = 0;
            $respuesta['scoring'] = 0;
            return $respuesta;
        }

        $datoscredito = $this->funcionesCredito->obtenerCuota($this->idcredito);
        $cuota = $this->calcularCuota($datoscredito['monto'], $parametros['tasainteres'], $datoscredito['plazo']);
        $ingresos = $datoscredito['ingresos_auxtrasporte'];
        $liquido = $ingresos - $datoscredito['dednomina'] - $cuota;
        $porcentaje = round(($liquido / $ingresos) * 100, 2);

        $unidad = 0;
        if ($porcentaje >= 70) {
            $unidad = 31.5;
        }
        if ($porcentaje >= 60 && $porcentaje <= 69.99) {
            $unidad = 28.35;
        }
        if ($porcentaje >= 50 && $porcentaje <= 59.99) {
            $unidad = 25.515;
        }

        $respuesta['valorvariable'] = $porcentaje . '%';
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    /**
     * Se valida el porcentaje del capital
     * @param array $parametros
     * @return real
     */
    public function capital(array $parametros) {

        if (empty($parametros)) {
            $respuesta['valorvariable'] = 0;
            $respuesta['scoring'] = 0;
            return $respuesta;
        }

        $porcentajeCapital = $this->funcionesCredito->obtenerPorcentajeCapital($this->idcredito);
        $unidad = 0;
        if ($porcentajeCapital <= 35) {
            $unidad = 7;
        }
        if ($porcentajeCapital >= 36 && $porcentajeCapital <= 50) {
            $unidad = 5.25;
        }

        $respuesta['valorvariable'] = $porcentajeCapital . '%';
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    /**
     * Se valida el valor que se ingresa desde la interfaz, 
     * que sea acorde a los permitidos
     * @param array $parametros
     * @return real
     */
    public function datacredito(array $parametros) {
        $valor = 0;
        $param = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
            if ($valor > 750) {
                $param = 7.5;
            }
            if ($valor >= 550 && $valor <= 750) {
                $param = 3.75;
            }
        }
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = $param;
        return $respuesta;
    }

    /**
     * Se almacena los dias de prima en la variable global 
     * @param array $parametros
     */
    public function dias_prima(array $parametros) {
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
        }
        $this->diasPrima = $valor;
        $respuesta['scoring'] = 0;
        $respuesta['valorvariable'] = $valor;
        return $respuesta;
    }

    /**
     * Se almacena los dias de cesantias en la variable global 
     * @param array $parametros
     */
    public function dias_cesantias(array $parametros) {
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
        }
        $this->diasCesantias = $valor;
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = 0;
        return $respuesta;
    }

    public function meses_garantia(array $parametros) {
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
        }
        $this->mesGarantia = $valor;
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = 0;
        return $respuesta;
    }

    public function valor_auxilio_transporte(array $parametros) {
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
        }
        $this->valorAuxlTrasporte = $valor;
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = 0;
        return $respuesta;
    }

    /**
     * Calculo de garantias por meses contratos
     * @param array $parametros
     */
    public function garantia_por_meses_contrato(array $parametros) {
        if (empty($parametros)) {
            $respuesta['valorvariable'] = 0;
            $respuesta['scoring'] = 0;
            return $respuesta;
        }

        $datoscredito = $this->funcionesCredito->obtenerCuota($this->idcredito);
        $valorSueldo = $datoscredito['salario'];
        $cuota = $this->calcularCuota($datoscredito['monto'], $parametros['tasainteres'], $datoscredito['plazo']);
        //$cuota = $this->calcularCuota(2800000, 1.5, 24);
        $sueldo20 = $valorSueldo * 0.2;
        $valorPrima = $valorSueldo * $this->diasPrima / 360;
        $mesContratoAsegurado = $this->mesGarantia * $cuota;
        $vacaciones = ((($valorSueldo - $this->valorAuxlTrasporte) * $this->diasCesantias) / 720);

        $valorCesantia = $valorSueldo * $this->diasCesantias / 360;
        $valorInteresCesantia = ($valorCesantia * $this->diasCesantias * 0.12) / 360;
        $valorTotal = $sueldo20 + $valorPrima + $mesContratoAsegurado + $vacaciones + $valorCesantia + $valorInteresCesantia + $this->garantia_2;
        $calificacion = ($datoscredito['monto'] <= $valorTotal) ? 31.5 : 0;
        $calificacion = $calificacion;
        $respuesta['valorvariable'] = round($valorTotal, 0);
        $plazoEstimado = ($valorTotal / $cuota);
        $respuesta['scoring'] = $calificacion;
        return $respuesta;
    }

    public function personasacargo(array $parametros) {

        $resultado = $this->funcionesCredito->obtenerPersonasACargo($this->idcredito);
        $valor = $resultado["personasacargo"];
        $unidad = 0;
        if ($valor <= 1) {
            $unidad = 5.25;
        }
        if ($valor == 2) {
            $unidad = 2;
        }
        if ($valor > 2) {
            $unidad = 1;
        }
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    public function estado_civil(array $parametros) {

        $resultado = $this->funcionesCredito->obtenerEstadoCivil($this->idcredito);
        $unidad = 0;
        switch ($resultado['idestcivil']) {
            case 853: //soltero
                $unidad = 0.9;
                break;
            case 854: // Casado
                $unidad = 2.25;
                break;
            case 855: //Union Libre
                $unidad = 1.50;
                break;
        }
        $respuesta['valorvariable'] = $resultado['nombre'];
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    public function antiguedad(array $parametros) {

        $resultado = $this->funcionesCredito->obtenerMesesLaborales($this->idcredito);
        $unidad = 0;
        if ($resultado >= 60) {
            $unidad = 10.5;
        }
        if ($resultado >= 36 && $resultado <= 59) {
            $unidad = 7.9;
        }
        if ($resultado >= 13 && $resultado <= 35) {
            $unidad = 3.9;
        }
        if ($resultado >= 6 && $resultado <= 12) {
            $unidad = 1;
        }

        $respuesta['valorvariable'] = $resultado . ' meses';
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    public function uso_credito(array $parametros) {
        $param = 0;
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
            switch ($valor) {
                case 0:
                    $param = 3;
                    break;
                case 1:
                    $param = 3;
                    break;
                case 2:
                    $param = 2;
                    break;
            }
        }
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = $param;
        return $respuesta;
    }

    /**
     * Se inserta un valor para calificar el seguro cuando se vaya a facturar
     * @param array $param
     * @return int
     */
    public function seguro(array $param) {
        $unidad = 0;
        $valor = $parametros['valor'];
        $respuesta['valorvariable'] = $valor;
        $respuesta['scoring'] = $unidad;
        return $respuesta;
    }

    /**
     * Se almacena el Valor de Garantia 2 
     * @param array $parametros
     */
    public function garantia_2(array $parametros) {
        $valor = 0;
        if (!empty($parametros)) {
            $valor = $parametros['valor'];
        }
        $this->garantia_2 = $valor;
        $respuesta['scoring'] = 0;
        $respuesta['valorvariable'] = $valor;
        return $respuesta;
    }

    /**
     * Se calcula el valor del estudio de credito
     * @param array $parametros
     */
    public function calcular_esdio_credito(array $parametros) {
        $valor = 0;
        if (!empty($parametros['valor'])) {
            $monto_credito = $parametros['valor'];
            switch ($monto_credito) {
                case ($monto_credito <= 3000000):
                    $valor = 35000;
                    break;
                case ($monto_credito > 3000000 and $monto_credito <= 5000000):
                    $valor = 40000;
                    break;
                default:
                    $valor = 50000;
                    break;
            }
        }
        $respuesta['valorvariable'] = $valor;
        return $respuesta;
    }

    // FUNCIONES PARA COMPRA DE CARTERA LLANOGAS  //

    /**
     * Calcula Meses desde la certificacion del ciente 
     * @param array $parametros
     */
    public function antiguedadInstalacionGas(array $parametros) {
        $idsuscripcion = $parametros['idsuscripcion'];
        $antiguedad = $this->funcionesCredito->obtenerDiasInstalacionGas($idsuscripcion);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($antiguedad, $idDetalleFormulario, 'valorvariable', 'Antiguedad');
        if ($valorVariable == '$antiguedad') {
            $valorVariable = $antiguedad;
        }
        $respuesta['valorvariable'] = $valorVariable . ' dias';
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($antiguedad, $idDetalleFormulario, 'scoring', 'Antiguedad');
        return $respuesta;
    }

    /**
     * Calcula cantidad de suspensiones desde la certificacion del ciente 
     * @param array $parametros
     */
    public function supensionSemestreCliente(array $parametros) {

        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerSupensionSemestreCliente($idsuscripcion);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Suspensiones');
        if ($valorVariable == '$suspensiones') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Suspensiones');
        return $respuesta;
    }

    /**
     * Calcula Cupo disponible de financiacion del ciente 
     * @param array $parametros
     */
    public function cupoDisponibleCliente(array $parametros) {
        $cupopreaprobadotipo = $this->obtenerCupoPreaprobado($parametros);
        $montosolicitado = $parametros['liquidacionventa']['valorventa'];
        if (empty($montosolicitado)) {
            $montosolicitado = 0;
        }
        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerCupoDisponibleCliente($idsuscripcion, $cupopreaprobadotipo, $montosolicitado);

        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Cupo');
        if ($valorVariable == '$saldofinanciacion') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = Util::formatoNumeroEntero($valorVariable);
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Cupo');
        return $respuesta;
    }

    /**
     * Calcula puntaje x Cupo preaprobado del tipo del ciente 
     * @param array $parametros
     */
    public function cupoPreaprobadoTipo(array $parametros) {
        $cupopreaprobadotipo = $this->obtenerCupoPreaprobado($parametros);
        $resultado = $this->funcionesCredito->obtenerCupoPreaprobadoTipo($cupopreaprobadotipo);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Preaprobado');
        if ($valorVariable == '$cupopreaprobadotipo') {
            $valorVariable = $resultado;
        }
        $valorVariable = Util::formatoNumeroEntero($valorVariable);
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Preaprobado');
        return $respuesta;
    }

    /**
     * Calcula edad del ciente 
     * @param array $parametros
     */
    public function calculaEdadCliente(array $parametros) {
        $fechanacimiento = $parametros['informacionbasica']['fechanacimiento'];
        if (empty($fechanacimiento)) {
            throw new MyException('Debe seleccionar una fecha de nacimiento');
        }
        $resultado = $this->funcionesCredito->obtenerEdadCliente($fechanacimiento);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Edad');
        if ($valorVariable == '$resultado') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Edad');
        return $respuesta;
    }

    /**
     * Valida Pagos despues de vencimiento de factura de los ultimos 6 meses del ciente 
     * @param array $parametros
     */
    public function habitoPagoClilente(array $parametros) {

        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerHabitoPagoClilente($idsuscripcion);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Habito');
        if ($valorVariable == '$habitopago') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Habito');
        return $respuesta;
    }

    /**
     * Valida valor datacredito del ciente 
     * @param array $parametros
     */
    public function puntajeDatacreditoCliente(array $parametros) {
        $dataCreditoCliente = 0;
        foreach ($parametros['calificacion'] as $variable) {
            if ($variable['nombrefuncion'] == 'puntajeDatacreditoCliente') {
                $dataCreditoCliente = $variable['valor'];
                break;
            }
        }
        $dataCreditoCliente = Util::quitarCaracteresNumero($dataCreditoCliente);
        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerPuntajeDatacreditoCliente($idsuscripcion, $dataCreditoCliente);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $dataCreditoCliente = Util::formatoNumeroEntero($dataCreditoCliente);
        $respuesta['valorvariable'] = $dataCreditoCliente; //$this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Datacredito');
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Datacredito');
        return $respuesta;
    }

    /**
     * Valida saldo del cupo aprobado para el cliente teniendo en cuenta finacianes actuales del ciente 
     * @param array $parametros
     */
    public function saldoFinanciacionCliente(array $parametros) {
        $cupopreaprobadotipo = $this->obtenerCupoPreaprobado($parametros);
        $montosolicitado = $parametros['liquidacionventa']['valorventa'];
        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerSaldoFinanciacionCliente($idsuscripcion, $cupopreaprobadotipo, $montosolicitado);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Saldo');
        if ($valorVariable == '$saldofinanciacion') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = Util::formatoNumeroEntero($resultado);
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Saldo');
        return $respuesta;
    }

    /**
     * Valilda las calificaciones de las variables para definir si es o no aprobado el credito
     * @param array $parametros
     */
    public function evaluaScoringCompraCarteraGas(array $parametros) {
        $calificacion = 1;
        foreach ($parametros['variables'] as $varable) {
            $calificacion *= $varable['calificacion'];
        }
        $respuesta['valorvariable'] = $calificacion;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaEvaluaScoringCompraCarteraGas($calificacion, $parametros['iddetalleformulario']);
        return $respuesta;
    }

    private function obtenerCupoPreaprobado($parametros) {
        $cupopreaprobadotipo = 0;
        foreach ($parametros['calificacion'] as $variable) {
            if ($variable['nombrefuncion'] == 'cupoPreaprobadoTipo') {
                $cupopreaprobadotipo = $variable['valor'];
                break;
            }
        }
        $cupopreaprobadotipo = Util::quitarCaracteresNumero($cupopreaprobadotipo);
        return $cupopreaprobadotipo;
    }

    /**
     * Valilda las calificaciones del scrong interna de las variables para definir si es o no aprobado el credito
     * @param array $parametros
     */
    public function evaluaScoringCompraCarteraInternasGas(array $parametros) {
        $calificacion = 1;
        foreach ($parametros['variables'] as $varable) {
            $calificacion *= $varable['calificacion'];
        }
        $respuesta['valorvariable'] = $calificacion;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaEvaluaScoringCompraCarteraGas($calificacion, $parametros['iddetalleformulario']);
        return $respuesta;
    }

    /**
     * Valida si la instalacion del cliente ya existe del ciente 
     * @param array $parametros
     */
    public function estadoInstalacionInterna(array $parametros) {
        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerEstadoInstalacionClilente($idsuscripcion);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Instalacion');
        if ($valorVariable == '$instalacion') {
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Instalacion');
        return $respuesta;
    }

     /**
     * Valida en que estado se encuentra el ciente 
     * @param array $parametros
     */
    public function estadoCliente(array $parametros) {

        $idsuscripcion = $parametros['idsuscripcion'];
        $resultado = $this->funcionesCredito->obtenerEstadoClilente($idsuscripcion);
        $idDetalleFormulario = $parametros['iddetalleformulario'];
        $valorVariable = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'valorvariable', 'Estado');
        if ($valorVariable == '$estadocliente'){
            $valorVariable = $resultado;
        }
        $respuesta['valorvariable'] = $valorVariable;
        $respuesta['scoring'] = $this->funcionesCredito->respuestaRangosEnterosCompraCarteraGas($resultado, $idDetalleFormulario, 'scoring', 'Estado');
        return $respuesta;
    }

    // FIN FUNCIONES PARA COMPRA DE CARTERA LLANOGAS  //
}
