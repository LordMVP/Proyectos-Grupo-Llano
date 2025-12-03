<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Externo\FinanciacionesBundle\Delegado;

use Externo\FinanciacionesBundle\Models\ContratoExternoModel;
use Externo\FinanciacionesBundle\Models\VentaExternoModel;
use Llanogas\LlanogasBundle\Utiles\Validacion;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Reportes\ReportesBundle\JasperBridge\ReportManager;

/**
 * Description of ContratoDelegado
 *
 * @author god
 */
class ContratoExternoDelegado {

    private $parametros;
    private $conexion;
    private $sesion;
    private $modelo;

    public function __construct($conexion, $sesion, &$parametros = array()) {
        $this->parametros = $parametros;
        $this->conexion = $conexion;
        $this->sesion = $sesion;
        $this->validacion = new Validacion();
        $this->modelo = new ContratoExternoModel($conexion, $sesion);
    }

    public function consultarEmpresas($conexion) {
        $seguridadDelegado = new VentaExternoModel($conexion, array());
        $listaEmpresas = $seguridadDelegado->consultarTodasLasFirmasInstaladoras();
        return $listaEmpresas;
    }

    public function generarContrato() {
        $idfirmas = $this->parametros["idfirmas"];
        //Primero debemos buscar las firmas...
        $listaFirmas = $this->modelo->buscarFirmas($idfirmas);
        if (is_array($listaFirmas) && count($listaFirmas) > 0) {
            $maximoNumcontratoActual = $listaFirmas[0]["maximonumcontrato"];
            $this->ejecutarContratos($idfirmas, $maximoNumcontratoActual);
            $listaFirmas = $this->consultarContratos($idfirmas, $maximoNumcontratoActual);
        }
        return $listaFirmas;
    }

    public function consultarContratos($idfirmas = null, $numMaximoContratoActual = null) {
        if ($idfirmas == null) {
            $idfirmas = $this->parametros['idfirmas'];
        }
        if ($numMaximoContratoActual == null) {
            $numMaximoContratoActual = 0;
        }
        return $this->modelo->consultarContratos($idfirmas, $numMaximoContratoActual);
    }

    /**
     * Se crean grupos por id firmas...
     * @param type $listaFirmas
     */
    private function agruparFirmasPorIdFirma(&$listaFirmas) {
        $max = count($listaFirmas);
        $listaTemp = array();
        for ($i = 0; $i < $max; $i++) {
            $firma = $listaFirmas[$i];
            $idfirma = $firma["idfirma"];
            if (!isset($listaTemp[$idfirma])) {
                $listaTemp[$idfirma] = [];
            }
            $listaTemp[$idfirma][] = $firma;
        }
        $listaFirmas = $listaTemp;
    }

    /**
     * Se agrupa la lista de ventas por fecha, se crean grupos de máximo 5 y se 
     * actualiza el número de contrato siguiento estas reglas.
     * @param type $listaFirmas
     * @return array
     */
    private function ejecutarContratos($idfirmas, $maximoactualnumcontrato) {
        $this->modelo->ejecutarContrato($idfirmas, $maximoactualnumcontrato);
    }

    /**
     * Realiza la petición para poder construir el reporte en jasper y devolver la información 
     */
    public function generarReporteContrato($controlador) {
        $base = $controlador->get("reportes.base");
        $manager = new ReportManager();
        $parametros['PR_STR_CONTRATO'] = $this->parametros['numerocontrato'];
        $parametros['PR_STR_IDFIRMAS'] = $this->parametros['idfirmas'];
        $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
        $report = $base->getReportObject("ContratoWSFinanciacion.jrxml", $parametros, 'pdf');
        $manager->executeReport($report);
        return JasperUtil::getPDFResponse($manager, 'ContratoWSFinanciacion');
    }

}
