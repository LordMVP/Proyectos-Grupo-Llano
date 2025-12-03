<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Delegado;

use Doctrine\DBAL\Connection;
use Externo\FinanciacionesBundle\Models\FinanciacionExternoModel;
use Externo\FinanciacionesBundle\Models\VentaExternoModel;
use Libranza\LibranzaBundle\Delegado\FuncionesCreditoDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Utiles\Validacion;
use ReflectionMethod;
use const CLASE_CALIFICAR_CREDITO;

/**
 * Description of FinanciacionExternoDelegado
 *
 * @author god
 */
class FinanciacionExternoDelegado {

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
     *  Conexión a la base de datos 
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var array 
     */
    private $parametros;

    /**
     *
     * @var FinanciacionExternoModel 
     */
    private $financiacionExternoModel;

    /**
     *
     * @var Validacion 
     */
    private $validacion;

    /**
     *
     * @var FuncionesCreditoDelegado 
     */
    private $funcionesCreditoDelegado;

    /**
     * 
     * @param Connection $conexion Conexión a la base de datos
     * @param array $sesion información del usuario 
     * @param array $parametros 
     */
    public function __construct($conexion, $sesion, &$parametros = array()) {
        $this->parametros = $parametros;
        $this->conexion = $conexion;
        $this->sesion = $sesion;
        $this->financiacionExternoModel = new FinanciacionExternoModel($conexion, $sesion);
        $this->validacion = new Validacion();
        $this->funcionesCreditoDelegado = new FuncionesCreditoDelegado(0);
    }

    /**
     * Consulta todos los parentescos 
     * @return array Lista de los parentescos
     */
    public function consultarParentesco() {
        $genericoModel = new GenericoModel($this->conexion);
        return $genericoModel->obtenerParentescos($this->sesion['idempresa']);
    }

    /**
     * Consulta todos los terceros 
     * @return array Lista de los terceros que tienen la misma palabra
     */
    public function consultarTercero() {
        $this->validacion->validar($this->parametros, [
            'nombre' => 'required'
        ]);
        $nombre = $this->parametros['nombre'];
        return $this->financiacionExternoModel->consultarTercero($nombre);
    }

    public function consultarTerceroPorDocumento() {
        $this->validacion->validar($this->parametros, [
            'documento' => 'required'
        ]);
        $documento = $this->parametros['documento'];
        return $this->financiacionExternoModel->consultarTerceroPorDocumento($documento);
    }

    /**
     * Consulta todos los productos financierons que tiene 
     * la empresa de sesión 
     * @return array  Lista de productos
     */
    public function consultarProductosFinancieros() {
        return $this->financiacionExternoModel->consultarProductosFinancieros();
    }

    /**
     * Permite obtener el listado de las liquidaciones que aplican créditos
     * @return Array listado departamentos
     */
    public function consultarLiquidacionesCredito() {
        $this->validacion->validar($this->parametros, [
            'idtipodocumento' => 'required|numeric'
        ]);
        $idEmpresa = $this->sesion['idempresa'];
        $idTipoDocumento = $this->parametros['idtipodocumento'];
        return $this->financiacionExternoModel->consultarLiquidacionesCredito($idEmpresa, $idTipoDocumento);
    }

    /**
     * Consulta todas las variables de la calificación del crédito
     * @return MyException Si no hay formularios parametrizados
     */
    public function consultarVariablesCalificacion() {
        $this->validacion->validar($this->parametros, [
            'idproductofinan' => 'required|numeric'
        ]);
        $idEmpresaFinan = $this->sesion['idempresa'];
        $idProductoFinan = $this->parametros['idproductofinan'];
        $listaVariables = $this->financiacionExternoModel->consultarVariablesCalificacion($idEmpresaFinan, $idProductoFinan);
        return ['variables' => $listaVariables];
    }

    public function calificar() {
        $jsonParametros = $this->parametros['parametros'];
        $infoVenta = json_decode($jsonParametros, true);
        $listaVariables = $infoVenta['calificacion'];
        $listaCalificacion = array();
        $idDetalleFormulario = 0;
        foreach ($listaVariables as $variable) {
            $nombreFuncion = $variable['nombrefuncion'];
            $idDetalleFormulario = $variable['iddetalleformulario'];
            $infoVenta['iddetalleformulario'] = $idDetalleFormulario;
            $infoVenta['valor'] = $variable['valor'];
            $parametro = array();
            $parametro[] = $infoVenta;
            $valores = $this->ejecutarFuncion($nombreFuncion, $parametro);
            $variable['valor'] = $valores['valorvariable'];
            $variable['calificacion'] = $valores['scoring'];
            $listaCalificacion[] = $variable;
        }
        $infoVariables = array();
        $infoVariables['variables'] = $listaCalificacion;
        $infoVariables['iddetalleformulario'] = $idDetalleFormulario;
        $parametro = array();
        $parametro[] = $infoVariables;
        $funcionFormulario = $this->financiacionExternoModel->consultarFormularioFuncion($idDetalleFormulario);
        $valores = $this->ejecutarFuncion($funcionFormulario, $parametro);
        $respuesta['variables'] = $listaCalificacion;
        $respuesta['evaluacion'] = $valores;
        return $respuesta;
    }

    /**
     * permite ejecutar una función
     * @param string $nombreFuncion nombre la función a ejecutar
     * @param array $parametros listado parámetros
     * @return Array listado parámetros de retorno
     * @throws MyException función no existe
     */
    private function ejecutarFuncion($nombreFuncion, array $parametros) {
        try {
            $method = new ReflectionMethod(CLASE_CALIFICAR_CREDITO, $nombreFuncion);
            return $method->invokeArgs($this->funcionesCreditoDelegado, $parametros);
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('La función ' . $nombreFuncion . ' no existe en la clase ', -1);
        }
    }

    public function guardar() {
        $this->guardarSolicitante();
        $this->guardarFinanciacion();
        $this->guardarCredito();
        $this->guardarDetalleFinanciacion();
        $this->guardarReferencias();
        $this->guardarInformacionBasica();
        $this->guardarCalificacion();
        $this->guardarCreditoVenta();
    }

    /**
     * Guarda la información del solicitante
     */
    private function guardarSolicitante() {
        $this->validacion->validar($this->parametros['solicitante'], [
            'documento' => 'required',
            'ter_nombre' => 'required',
            'ter_apellido' => 'required',
            'ter_correo' => 'required|email',
            'ter_fecnacimiento' => 'required|date'], 'La información del solicitante está incompleta ');
        $documento = $this->parametros['solicitante']['documento'];
        $infoTercero = $this->financiacionExternoModel->consultarTerceroIdentificacion($documento);
        if (empty($infoTercero)) {
            $infoTercero['idtercero'] = $this->financiacionExternoModel->insertarTercero($this->parametros['solicitante']);
        }
        $this->parametros['solicitante']['idtercero'] = $infoTercero['idtercero'];
    }

    /**
     * Guarda la información requerida en la financiación 
     */
    public function guardarFinanciacion() {
        $genericoModel = new GenericoModel($this->conexion);
        $creditoFinanciacion = $this->parametros['creditofinanciacion'];
        $this->validacion->validar($creditoFinanciacion, [
            'idliquidacion' => 'required',
            'plazo' => 'required|numeric'], 'La liquidación, plazo en crédito financiación es obligatoria'
        );
        $infoLiquidacion = $genericoModel->getLiquidacionID($creditoFinanciacion['idliquidacion'])[0];
        $liquidacionVenta = $this->parametros['liquidacionventa'];
        $parametros['idventa'] = $liquidacionVenta['numeroventa'];
        $parametros['valortotalfinanciar'] = $liquidacionVenta['valorventa'];
        $parametros['estado'] = 'A';
        $parametros['valortotalfinanciar'] = $liquidacionVenta['valorventa'];
        $parametros['fecha'] = 'now()';
        $parametros['idsolicitante'] = $this->parametros['solicitante']['idtercero'];
        $parametros['idbanco'] = $this->financiacionExternoModel->consultarEmpresaFinanciaId($liquidacionVenta['idempresafinancia']);
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $parametros['idusuario'] = $this->sesion['idusuario'];
        $parametros['idparentesco'] = $this->parametros['solicitante']['idparentesco'];
        $parametros['numerocuotas'] = $this->parametros['creditofinanciacion']['plazo'];
        $parametros['iddocumento'] = $infoLiquidacion['iddocumento'];
        $parametros['idliquidacion'] = $infoLiquidacion['idliquidacion'];
        $parametros['idtipodocumento'] = $infoLiquidacion['idtipodocumento'];
        $infoFinanciacion = $this->financiacionExternoModel->insertarVentaFinanciacion($parametros);
        $ventaModel = new VentaExternoModel($this->conexion, $this->sesion);
        $ventaModel->actualizarVenta($infoFinanciacion);
        $this->parametros['financiacion'] = $infoFinanciacion;
    }

    /**
     * Guarda todos los detalles de la financiación 
     */
    public function guardarDetalleFinanciacion() {
        $idVenta = $this->parametros['liquidacionventa']['numeroventa'];
        $idFinanciacionVenta = $this->parametros['financiacion']['idventafinanciacion'];
        $this->financiacionExternoModel->insertarDetallesFinanciacion($idVenta, $idFinanciacionVenta);
    }

    /**
     * Registra el crédito en la tabla de cre_credito
     */
    private function guardarCredito() {
        $credifoFinanciacion = $this->parametros['creditofinanciacion'];
        $this->validacion->validar($credifoFinanciacion, [
            'montosolicitado' => 'numeric|required'
                ], 'La información del crédito financiación es obligatoria');
        $idSuscripcion = $this->parametros['informacionbasica']['idsuscripcion'];
        $infoCredito['idproductofinanciero'] = $credifoFinanciacion['idproductofinan'];
        $infoCredito['vlrmontocredito'] = Util::quitarCaracteresNumero($credifoFinanciacion['montosolicitado']);
        $infoCredito['plazo'] = $credifoFinanciacion['plazo'];
        $infoCredito['idterempresafinancia'] = $this->parametros['liquidacionventa']['idempresafinancia'];
        $infoCredito['iduniliqfinanciacion'] = $credifoFinanciacion['idliquidacion'];
        $infoCredito['idsuscripcion'] = $idSuscripcion;
        $idCredito = $this->financiacionExternoModel->insertarCredito($infoCredito);
        $this->parametros['creditofinanciacion']['idcredito'] = $idCredito;
    }

    private function guardarCreditoVenta() {
        $liquidacionVenta = $this->parametros['liquidacionventa'];
        $idCredito = $this->parametros['creditofinanciacion']['idcredito'];
        $info['idventa'] = $liquidacionVenta['numeroventa'];
        $info['idcredito'] = $idCredito;
        $this->financiacionExternoModel->insertarCreditoVenta($info);
    }

    private function guardarInformacionBasica() {
        $idSuscripcion = $this->parametros['informacionbasica']['idsuscripcion'];
        $idCredito = $this->parametros['creditofinanciacion']['idcredito'];
        $infoBasica = $this->parametros['datosconyuge'];
        $this->financiacionExternoModel->insertarInformacionBasica($infoBasica, $idCredito, $idSuscripcion);
    }

    /**
     * permite ingresar la información de la referencia en la solicitud de crédito
     * @param array $referencia información de activos del usuario para la solicitud de crédito
     */
    private function guardarReferencias() {
        $referencias = $this->parametros['referencias'];
        if (empty($referencias)) {
            return;
        }
        foreach ($referencias as $infoReferencia) {
            $infoReferencia['idcredito'] = $this->parametros['creditofinanciacion']['idcredito'];
            $this->financiacionExternoModel->insertarReferencias($infoReferencia);
        }
    }

    /**
     * Guarda toda la información de la calificación
     */
    private function guardarCalificacion() {
        if (!isset($this->parametros['calificacion'])) {
            throw new MyException('Error: La calificación es obligatoria', -1);
        }
        $calificacion = $this->parametros['calificacion'];
        if (empty($calificacion)) {
            throw new MyException('Error: La calificación es obligatoria ', -1);
        }
        foreach ($calificacion as $variables) {
            $variables['idcredito'] = $this->parametros['creditofinanciacion']['idcredito'];
            $this->financiacionExternoModel->insertarCalificacionScoringCredito($variables);
        }
    }

    /**
     * Consulta toda la información financiera de un crédito
     * y de una venta 
     * @param int $numeroVenta identificador de la venta
     * @param int $idSuscripcion identificador de la suscripción
     * @return array
     */
    public function consultarFinanciacionVenta($numeroVenta, $idSuscripcion) {
        $infoCredito = $this->financiacionExternoModel->consultarCreditoFinanciacion($numeroVenta, $idSuscripcion);
        $infoFinanciacion['creditofinanciacion'] = $infoCredito;
        $infoFinanciacion['solicitante'] = $this->financiacionExternoModel->consultarDatosSolicitante($numeroVenta);
        $infoFinanciacion['datosconyuge'] = $this->financiacionExternoModel->consultarDatosConyuge($infoCredito['idcredito']);
        $infoFinanciacion['referencias'] = $this->financiacionExternoModel->consultarDatosReferencia($infoCredito['idcredito']);
        $infoFinanciacion['calificacion'] = $this->financiacionExternoModel->consultarCalificacionCredito($infoCredito['idcredito']);
        return $infoFinanciacion;
    }

    /**
     * Consulta las ciudades de acuerdo al nombre y 
     * la empresa parametrizada 
     * @param int $idEmpresa identificador de la empresa 
     * @param string $nombreCiudad Nombre de la ciudad que se quiere buscar
     * @return array Lista de las coincidencias 
     */
    public function consultarCiudadesExpedicionDocumento() {
        $this->validacion->validar($this->parametros, [
            'nombreCiudad' => 'required'
        ]);
        $idEmpresa = $this->sesion['idempresa'];
        $nombreCiudad = $this->parametros['nombreCiudad'];
        return $this->financiacionExternoModel->consultarCiudadesExpedicionDocumento($idEmpresa, $nombreCiudad);
    }

    /**
     * Consulta los tipos de identificación asociados a una empresa 
     * ej: NIT, Cédula, etc
     * @param type $idEmpresa
     * @return type
     */
    public function consultarTiposDocumento() {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->financiacionExternoModel->consultarTiposDocumento($idEmpresa);
    }

    /**
     * Consulta la información de la empresa de acuerdo al 
     * identificador de la empresa  
     * @param int $idEmpresa identificador de la empresa 
     * @return array
     */
    public function consultarTiposTercero() {
        $idEmpresa = $this->sesion['idempresa'];
        return $this->financiacionExternoModel->consultarTiposTercero($idEmpresa);
    }

}
