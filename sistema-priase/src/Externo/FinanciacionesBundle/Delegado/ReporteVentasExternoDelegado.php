<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Externo\FinanciacionesBundle\Models\ReporteVentasExternoModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\PeticionUtil;
use Llanogas\LlanogasBundle\Utiles\Validacion;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use const URL_WSFINANCIACION_SEVEN;

/**
 * Description of ContratoDelegado
 *
 * @author god
 */
class ReporteVentasExternoDelegado {

    /**
     *
     * @var ReporteVentasExternoModel 
     */
    private $reporteVentasExternoModel;

    /**
     *
     * @var array 
     */
    private $sesion;

    /**
     *
     * @var array 
     */
    private $parametros;

    /**
     *
     * @var Validacion 
     */
    private $validacion;

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *  Constructor de la clase 
     * @param Connection $conexion 
     * @param array $sesion
     * @param array  $parametros
     */
    public function __construct($conexion, $sesion, &$parametros = array()) {
        $this->parametros = $parametros;
        $this->conexion = $conexion;
        $this->sesion = $sesion;
        $this->validacion = new Validacion();
        $this->reporteVentasExternoModel = new ReporteVentasExternoModel($conexion, $sesion);
    }

    public function obtenerDatosSeven() {
        $this->validacion->validar($this->parametros, [
            'fechainicio' => 'required',
            'fechafin' => 'required'
        ]);
        $idFirmas = (isset($this->parametros['idfirmas'])) ? $this->parametros['idfirmas'] : null;
        $fechaInicio = $this->parametros['fechainicio'];
        $fechaFin = $this->parametros['fechafin'];
        $listaInfoFacturasSeven = $this->reporteVentasExternoModel->consultarNumeroContratos($fechaInicio, $fechaFin, $idFirmas);
        $codigosContratos = '';
        foreach ($listaInfoFacturasSeven as $info) {
            $codigosContratos .= $info['id'] . ',';
        }
        $codigosContrato = trim($codigosContratos, ',');
        if (empty($codigosContrato)) {
            return;
        }
        $parametrosSeven['idsContrato'] = $codigosContrato;
        $parametrosSeven['idEmpresa'] = $this->sesion['idempresa'];
        $respuestaJson = PeticionUtil::ejecutar(URL_WSFINANCIACION_SEVEN, $parametrosSeven);
        $this->guardarDatosSeven($respuestaJson);
    }

    public function crearReporte($controlador) {
        $this->obtenerDatosSeven();
        return $this->generarReporte($controlador);
    }

    /**
     * Guarda los datos que retorna seven 
     * @param type $respuestaJson
     * @return type
     */
    private function guardarDatosSeven($respuestaJson) {
        if (empty($respuestaJson)) {
            throw new MyException('Error al procesar la petición de seven', -1);
        }
        $respuesta = json_decode($respuestaJson, true);
        if ($respuesta['codigo'] < 0) {
            throw new MyException($respuesta['mensaje'], -1);
        }
        try {
            $this->conexion->beginTransaction();
            $this->reporteVentasExternoModel->eliminarDatosUsuario();
            foreach ($respuesta['datos'] as $contrato) {
                $this->reporteVentasExternoModel->insertarDatosReporte($contrato);
            }
            $this->conexion->commit();
        } catch (\Exception $e) {
            error_log($e->getMessage());
            $this->conexion->rollBack();
            throw new MyException('Error al consultar los datos de seven', -1);
        }
    }

    /**
     * Genera el reporte de las ventas que están aprobadas y facturadas, E información si ha recibido un pago
     * @param \Symfony\Bundle\FrameworkBundle\Controller\Controller $controlador 
     * @return type Información del reporte
     */
    private function generarReporte($controlador) {
        $base = $controlador->get("reportes.base");
        $parametros['PR_FECHA_INICIO'] = $this->parametros['fechainicio'];
        $parametros['PR_FECHA_FIN'] = $this->parametros['fechafin'];
        $parametros['PR_VENTA_ESTADO'] = $this->parametros['ventaestado'];
        $parametros['PR_IDS_FIRMAS'] = '{' . $this->parametros['firmaInstaladora'] . '}';
        $parametros['PR_NUMERO_PQRS'] = $this->parametros['numeropqr'];
        $parametros['PR_FECHA_PAGO'] = $this->parametros['fechapago'];
        $parametros['IS_IGNORE_PAGINATION'] = TRUE;
        $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
        $reporte = 'WsFinanciacion.jrxml';
        $opcion = $this->parametros['opcion'];
        if (strtoupper($opcion) == 'G') {
            $reporte = 'WsGeneral.jrxml';
        }
        $report = $base->getReportObject($reporte, $parametros, 'xlsx');
        $manager->executeReportBytes($report);
        return JasperUtil::getJSONPathResponse($manager);
    }

}
