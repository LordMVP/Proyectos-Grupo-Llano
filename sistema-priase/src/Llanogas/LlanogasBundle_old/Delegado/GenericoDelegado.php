<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase que realiza todas las transacciones 
 * @author hrey
 */
class GenericoDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Connection &$conexion) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
    }

    /**
     * Genera un nuevo número para la factura de interés.
     * @param array $factura (idfactura,iddocumento, idtipodocumento, idempresa) 
     * o toda la información de la factura
     */
    public function actualizarNumeroFactura($factura) {
        
        $transaccion = $this->conexion->isTransactionActive();
        if (!$transaccion) {
            throw new MyException('Error, No hay una transacción activa', -1);
        }
        $factura['tipo'] = "FA";
        $informacionNumero = $this->genericoModel->obtenerNumeroFactura($factura);
        $this->genericoModel->actualizarNumeroFactura($factura['idfactura'], $informacionNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($informacionNumero['numero'], $informacionNumero['idnumero']);
    }
    
    public function actualizarNumeroFacturaCusiana($factura) {
        
        $transaccion = $this->conexion->isTransactionActive();
        if (!$transaccion) {
            throw new MyException('Error, No hay una transacción activa', -1);
        }
        $factura['tipo'] = "FA";
        $informacionNumero = $this->genericoModel->obtenerNumeroFactura($factura);
        $this->genericoModel->actualizarNumeroFacturaCusiana($factura['idfactura'], $informacionNumero['numero']);
        $this->genericoModel->actualizarNumeroDisponible($informacionNumero['numero'], $informacionNumero['idnumero']);
    }

    /**
     * Actualiza los saldos de las facturas
     * @param type $idFactura Identificador de la factura
     * @param type $version número de la versión de la factura
     * @param type $tipoFactura FT =Factura normal (Tiene en cuenta los detalles y notas ) , NT= Nota (tiene en cuenta únicamente a los detalles)
     */
    public function actualizarFacturaSaldo($idFactura, $version, $tipoFactura = 'FT') {
        $tipo = strtoupper($tipoFactura);
        if ($tipo == 'FT') {
            $this->calcularFacturaSaldo($idFactura, $version);
            return;
        }
        if ($tipo == 'NT') {
            $this->calcularSaldoNota($idFactura, $version);
            return;
        }
    }

    private function calcularFacturaSaldo($idFactura, $version) {
        //$factura = $this->genericoModel->getFacturaCalculada($idFactura, $version);
        $listaConceptos = $this->genericoModel->getConceptosCalulados($idFactura);
        $saldoFactura = 0;
        $valorFactura = 0;
        foreach ($listaConceptos as $concepto) {
            if ((($concepto['valor'] / 1) - ($concepto['valorpagado'] / 1)) < 0) {
                throw new MyException('Factura :' . $idFactura . ' Genera Saldo Negativo : Concepto' . $concepto['idconcepto'], -1);
            }
            $valorFactura += $concepto['valor'];
            $saldoFactura += $concepto['valor'] - $concepto['valorpagado'];
            $nuevoConcepto['dfac_ideregistr'] = $concepto['iddetallefactura'];
            $nuevoConcepto['dfac_vlrreal'] = $concepto['valor'];
            $nuevoConcepto['dfac_sdoreal'] = $concepto['valor'] - $concepto['valorpagado'];
            $nuevoConcepto['dfac_version'] = $concepto['version'] ++;
            $this->genericoModel->actualizar($nuevoConcepto, 'dfac_detfactura', 'dfac_ideregistr=:dfac_ideregistr');
        }
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_sdoreal'] = $saldoFactura;
        $data['fac_version'] = $version + 1;
        $data['fac_vlrreal'] = $valorFactura;
        $resultado = $this->genericoModel->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro and fac_version =' . $version);
        if (empty($resultado)) {
            throw new MyException('Error la factura ya fue modificada por otro proceso ' . $idFactura, -1);
        }
    }

    /**
     * Calcula el saldo de los documentos que son notas 
     * @param type $idFactura
     * @param type $version
     * @throws MyException
     */
    private function calcularSaldoNota($idFactura, $version) {
        $resultado = $this->genericoModel->actualizarSaldoNotas($idFactura, $version);
        $data['fac_ideregistro'] = $idFactura;
        $data['fac_version'] = $version + 1;
        $this->genericoModel->actualizar($data, 'fac_factura', 'fac_ideregistro=:fac_ideregistro and fac_version =' . $version);
        if (empty($resultado)) {
            throw new MyException('Error la nota ya fue modificada por otro proceso ' . $idFactura, -1);
        }
    }

    /**
     * Consolida la información del saldo de una financiación
     * teniendo encuenta  las amortizaciones y los abonos a capital que se le ha hecho 
     * a una financiación
     * @param type $idFinanciacion
     * @param type $version
     * @return type
     * @throws MyException
     */
    public function actualizarFinanciacionSaldo($idFinanciacion, $version) {
        $financiacion = $this->genericoModel->getFinanciacionCalculada($idFinanciacion, $version);
        $listaConceptos = $this->genericoModel->getDetalleFinanciacion($idFinanciacion);
        foreach ($listaConceptos as $concepto) {
            $nuevoConcepto['dfin_ideregistr'] = $concepto['iddetallefinanciacion'];
            $nuevoConcepto['dfin_sdoreal'] = $concepto['saldodetallefinanciacion'];
            $nuevoConcepto['dfin_version'] = $concepto['version'] + 1;
            $this->genericoModel->actualizar($nuevoConcepto, 'dfin_detfinanci', 'dfin_ideregistr=:dfin_ideregistr');
        }
        if (intval($financiacion['saldofinanciacion']) < 0) {
            throw new MyException("No se puede generar documento a la financiación " . $idFinanciacion . ". El saldo no corresponde con el valor a pagar. ", -1);
        }
        $data['fin_ideregistro'] = $idFinanciacion;
        $data['fin_sdocapital'] = $financiacion['saldofinanciacion'];
        $data['fin_version'] = $version + 1;
        $resultado = $this->genericoModel->actualizar($data, 'fin_financiacio', 'fin_ideregistro=:fin_ideregistro and fin_version =' . $version);
        if (empty($resultado)) {
            throw new MyException('Error la financiacion ya fue modificada por otro proceso ' . $idFinanciacion, -1);
        }
        return $data['fin_sdocapital'];
    }

    /**
     * Vuelve consistente la distribución del recaudo, con los detalles ya 
     * aplicados y con el saldo que tiene
     * @param type $idRecaudo
     * @param type $versionRecaudo
     * @param type $idSuscripcion
     */
    public function actualizarRecaudoSaldo($idRecaudo, $versionRecaudo, $idSuscripcion) {
        /*
         * AQUI VOY 
         */
        $disponible = $this->genericoModel->getDisponibleRecaudoCalculado($idRecaudo, $idSuscripcion, $versionRecaudo);
        $this->genericoModel->actualizarRecaudoSaldo($disponible['iddistribucionrecaudo'], $disponible['disponiblerecaudo']);
        $this->genericoModel->actualizarRecaudoVersion($idRecaudo, $versionRecaudo);
        /*
         * Se comentarea esta linea ya que no es funcional ya que no hay un metodo que reciba 
         */
//        $this->genericoModel->actualizarRecaudoSaldo($disponible['iddistribucionrecaudo'], $disponible['disponiblerecaudo'], $versionRecaudo);
    }

    public function actualizarRecaudoDistribucionSaldo($idDistribucion, $versionRecaudo, $idRecaudo) {
        $disponible = $this->genericoModel->getDisponiblePorId($idDistribucion, $versionRecaudo);
        $this->genericoModel->actualizarRecaudoSaldo($disponible['iddistribucionrecaudo'], $disponible['disponiblerecaudo']);
        $datosVersionRecaudo = $this->genericoModel->actualizarRecaudoVersion($idRecaudo, $versionRecaudo);
//        $this->genericoModel->actualizarRecaudoSaldo($disponible['iddistribucionrecaudo'], $disponible['disponiblerecaudo'], $versionRecaudo);
        return $datosVersionRecaudo;
    }

    /**
     * Método encargado de validar si un programa ya se puede ejecutar 
     * o si simplemente la actividad se encuentra cerrado
     * @param type $idPrograma
     * @param type $idCiclo
     * @param type $idEmpresa
     * @return type
     * @throws MyException
     */
    public function validarPrograma($idPrograma, $idCiclo, $idEmpresa) {
        $detallePeriodo = $this->genericoModel->validarActividadPrograma($idPrograma, $idCiclo, $idEmpresa);
        if (!empty($detallePeriodo) && $detallePeriodo['ejecutar'] === 'N') {
            throw new MyException($detallePeriodo['detalle'], -1);
        }
        return $detallePeriodo;
    }

    /**
     * permite identificar el estado de la ejecución del proceso
     * @param int $idprograma identifica el programa
     * @param int $idempresa identifica la empresa de ejecución 
     * @return array
     */
    public function obtenerIdentificadorPrograma($idprograma, $idempresa) {
        $response = $this->genericoModel->consultarProcesoPorEmpresaEstadoPrograma($idprograma, $idempresa);
        if (!empty($response)) {
            return $response;
        }
        return null;
    }

    /**
     * Permite insertar el proceso a ejecutar
     * @return int identificador de proceso en ejecución
     */
    public function verificarProcesoEjecucion($idproceso, $idempresa, $idacceso) {
        $parametros['idAcceso'] = $idacceso;
        $parametros['idPrograma'] = $idproceso;
        $parametros['estado'] = 'A';
        $parametros['idEmpresa'] = $idempresa;
        $parametros['idHilo'] = 1;
        $parametros['fechaInicio'] = 'now()';
        return $this->genericoModel->insertarProceso($parametros);
    }

    /**
     * @deprecated since version 1.0.0
     * permite cerrar los programas que se encuentran abiertos
     * @param int $idprograma identifica el código de programa a cerrar 
     * @param int $cantidadFilas identifica el código de programa a cerrar 
     */
    public function cerrarPrograma($idprograma, $cantidadFilas = 0) {
        $this->genericoModel->CerrarProgramaModel($idprograma, $cantidadFilas);
    }

    public function consultarTerceros($idunidad, $nombre) {
        $respuesta = $this->genericoModel->consultarTercero($nombre, $idunidad);
        if (empty($respuesta)) {
            throw new MyException("No se encontraron registros ", 0);
        }
        return $respuesta;
    }

    public function getLiquidaciones($idTipoDocumento, $idDocumento = null) {
        $resultado = $this->genericoModel->getLiquidaciones($idTipoDocumento, $idDocumento);
        if (empty($resultado)) {
            throw new MyException('No se encontraron liquidaciones ', 0);
        }
        return $resultado;
    }

    /**
     * Autor:  Sergio Andrés Vargas
     * Permite invocar un servicio web de tercero 
     * @param varchar $urlServicio url de servicio soap  WSDL 
     * @param type $nombreFuncion nombre de método a invocar
     * @param type $parametros listado de parámetros 
     * @return type respuesta de servicio  
     */
    public function invocarServicio($urlServicio, $nombreFuncion, $parametros) {
        try {       
            $client = new \SoapClient($urlServicio, array("connection_timeout" => 600000, "default_socket_timeout" => 600000));
            $respuesta = $client->__soapCall($nombreFuncion, array($parametros));
            return $respuesta;
        } catch (\Exception $ex) {
            throw new MyException($ex->getMessage(), -1);
        }
    }

    public function obtenerCiclosActivosPrograma($programa, $empresa) {
        $ciclos = $this->genericoModel->consultarCiclosActivosPrograma($programa, $empresa);
        if (empty($ciclos)) {
            throw new MyException("Error, No se encontraron ciclos", 0);
        }
        return $ciclos;
    }

    public function getFechaFactura($infoSuscripcion, $cicloPeriodo) {
        $fechasRutas = $this->genericoModel->getFechasRutaPeriodo($infoSuscripcion['idsuscripcion'], $cicloPeriodo['idperiodo']);
        if (!empty($fechasRutas)) {
            return $fechasRutas;
        }
        if (!empty($cicloPeriodo['fechavencimiento'])) {
            $fechas['fechavencimiento'] = $cicloPeriodo['fechavencimiento'];
            $fechas['fechasuspension'] = $cicloPeriodo['fechasuspension'];
            return $fechas;
        }
        $infoLiquidacion = $this->genericoModel->getLiquidacionSuscripcion($infoSuscripcion['idliquidacion']);
        $fechas['fechavencimiento'] = $infoLiquidacion['fechavencimiento'];
        $fechas['fechasuspension'] = $infoLiquidacion['fechasuspension'];
        return $fechas;
    }

    public function invocaWsTercerosSeven($DatosSuscripcion) {

        $parametros['emp_codi'] = (int) $DatosSuscripcion['idempresa'];    // Codigo Empresa
        $parametros['tip_codi'] = '2';      // Tipo Tercero , 
        $parametros['ter_coda'] = ($DatosSuscripcion['idempresa'] == '325') ? $DatosSuscripcion['documento'] : $DatosSuscripcion['pcodigo']; // Nit o identiicacion
        $parametros['ter_dive'] = '0';      // DIgito Verificacion
        $parametros['ter_nomb'] = $DatosSuscripcion['nombre'];   // Nombres 
        $parametros['ter_apel'] = $DatosSuscripcion['apellido'];  // Apellidos 
        $parametros['ter_noco'] = $DatosSuscripcion['nombrecompleto']; // Concatenacion nombres y apellidos 
        $parametros['mod_codi'] = ($DatosSuscripcion['idempresa'] == '325') ? '6' : '601';    // Codigo modulo , Validar los codigos que Aplican
        $parametros['pai_codi'] = '169';   // Codigo Pais  , Colombia es el 169
        $parametros['dep_codi'] = $DatosSuscripcion['departamento'];    // Seg�n DANE Departamento
        $parametros['mun_codi'] = $DatosSuscripcion['municipio']; //  Segun Dane Municipio
        $parametros['ter_dire'] = $DatosSuscripcion['direccion']; // Direccion 
        $parametros['ter_ntel'] = $DatosSuscripcion['telefono'];  // Telefono si existe sino 0 
        $parametros['ter_mail'] = $DatosSuscripcion['mail']; // Mail si existe sino 0 
        $parametros['ter_nfax'] = '0';     // Fax si existe si no 0 
        $parametros['ter_audp'] = '0';   // por defecto O          

        $resultado = $this->invocarServicio(WEB_SERVICE_TERCEROS, 'SyncGnTerce', $parametros);
        $respuesta = $this->procesarXml($resultado->SyncGnTerceResult);
        if ($respuesta['error'] != 0) {
            throw new MyException('Error Creando Tercero-Suscripción en Seven: ' . '[' . $respuesta['error'] . '] ' . $respuesta['mensaje'], -1);
        }
        return $respuesta;
    }

    public function procesarXml($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->GN_TERCE->RETORNO[0];
        $respuesta['mensaje'] = $xml->GN_TERCE->TXTERROR[0];
        return $respuesta;
    }

    public function consultarParametroSincronizacionSeven($idEmpresa) {

        $resultado = $this->genericoModel->consultarParametroSincronizaSeven($idEmpresa);
        return $resultado;
    }
    
    public function getCicloPeriodoAnteriorDelegado($idCiclo){
         $resultado = $this->genericoModel->getCicloPeriodoAnterior($idCiclo);
        return $resultado;
    }
    
     public function consultaPermisosGrabar($idPrograma, $idusuario, $idUnidad = null) {

      return $this->genericoModel->consultarPermisosGrabar($idPrograma,$idusuario, $idUnidad);      
    }
    
    /**
     * Vuelve consistente la distribución del recaudo, con los detalles ya 
     * aplicados y con el saldo que tiene
     * @param type $idRecaudo
     * @param type $versionRecaudo
     * @param type $idSuscripcion
     */
    public function actualizarRecaudoSaldoDevolucion($idRecaudo, $versionRecaudo, $idSuscripcion) {        
        $disponible = $this->genericoModel->getDisponibleRecaudoCalculadoDevolucion($idRecaudo, $idSuscripcion, $versionRecaudo);
            foreach ($disponible as $distribucionDevolucion){
                $this->genericoModel->actualizarRecaudoSaldoDevolucion($distribucionDevolucion['iddistribucionrecaudo'], $distribucionDevolucion['disponiblerecaudo']);
            }
            $this->genericoModel->actualizarRecaudoVersionDevolucion($idRecaudo, $versionRecaudo);
    }
    
    
    /**
     * 
     * 
     * @param type $usuario
     * @return type
     * @throws MyException
     */
    public function consultaClasificacionLiquidacion($idUsuario, $idEmpresa){
        try {
            $docsConstructora = $this->genericoModel
                    ->consultaClasificacionLiquidacion($idUsuario, $idEmpresa);
        } catch (\Exception $e) {
            throw new MyException("Error Buscando Los Documentos de Constructoras" . $e->getMessage(), -1);
        }
        return $docsConstructora;
    }

    
    public function getArbCuentaSeven($empresa) {
        return $this->genericoModel->getArbCuentaSeven($empresa, '4');
    }
    
    /**
     * Consulta en la tabla par_pametro si la empresa en sesion
     * requiere envio automatico de extracto a travez de correo
     * @param type $idEmpresa
     */
    public function consultarParametroExtractoAutomatico($idEmpresa) {

        $resultado = $this->genericoModel->consultarParametroExtractoAutomatico($idEmpresa);
        return $resultado;
    }
    
}
