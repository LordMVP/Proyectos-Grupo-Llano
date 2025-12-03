<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Reportes\ReportesBundle\Models\PagosCreditoModel;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of PagosCreditoController
 *
 * @author progredi1
 */
class PagosCreditoController extends Controller {
    //put your code here

    /**
     * @Route("/pagos_credito")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:pagosCredito.html.twig") 
     */
    public function pagosPorCredito() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/consultarCreditos")
     * @Method({"POST"})
     */
    public function consultarCreditos(Request $requiest) {
        try {
            $base = $this->get("reportes.base");
            $pagosCreditoModelo = new PagosCreditoModel($base->conexion);
            $requestInfo = json_decode($requiest->getContent(), true);
            $respuesta['creditos'] = $pagosCreditoModelo->consultarCredito($requestInfo);
            return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }   
    
    /**
     * @Route("/generarPagosCredito")
     * @Method({"POST"})
     */
    public function generarPagosCredito(Request $requiest) {
        try {
            $base = $this->get("reportes.base");
            $requestInfo = json_decode($requiest->getContent(), true);
            $parametros = array();
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            $parametros['PR_ID_FINANCIACION'] = $requestInfo["idfinanciacion"];
            $reporte = $base->getReportObject('ReportePagos.jrxml', $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($reporte);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }
    /**
     * @Route("/generarPaz_Salvo_Tercero")
     * @Method({"POST"})
     */
    public function generarPazSalvoTercero(Request $requiest) {
        try {
            $base = $this->get("reportes.base");
            $requestInfo = json_decode($requiest->getContent(), true);
            $empresa = $base->utilModel->consultarEmpresaCodSeven($base->idEmpresa);
            $informacionUsuario = $base->getUserDetails(); 
            $parametros = array();
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            $parameters["PR_STR_USUARIO"] = $informacionUsuario['usu_login'] ;
            $parametros['PR_STR_EMPRESA_NIT'] = "NIT: " . $empresa[0]['empresa_cod'] ;
            $parametros['PR_STR_TITULO_EMPRESA'] = $base->idEmpresa;
            $parametros['PR_STR_USUARIO_APR'] =  "Mvparrado";
            $parametros['PR_STR_TER_DOCUMENTO'] = $requestInfo["docTercero"];
            $reporte = $base->getReportObject('Paz_y_Salvo_Financiacion.jrxml', $parametros, 'pdf', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($reporte);
            return JasperUtil::getJSONPathResponse($manager);           
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }


    public function construirExcel($datos) {
        $base = $this->get("reportes.base");
        //  $datos = $base->sesion->get('datosCredito');
        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Pagos por credito")
                ->setSubject("Credito")
                ->setDescription("Reporte de los pagos que se han hecho al credito")
                ->setKeywords("credito")
                ->setCategory("credito");
        $this->procesarCredito1($datos, $base);
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        $nombreReporte = "reporte_no_" . $datos['idcredito'] . '.xlsx';
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
        $objWriter->setPreCalculateFormulas(true);
        $objWriter->save(RUTA_REPORTES_GRANDES . $nombreReporte);
        $respuesta["codigoRespuesta"] = 1;
        $respuesta['id'] = $nombreReporte;
        $respuesta['mensaje'] = 'Consulta realizada correctamente';
        return Util::construyeRespuesta($respuesta);
    }

    private $pagosCreditoModelo;

    public function procesarCredito1($datos, $base) {
        $this->pagosCreditoModelo = new PagosCreditoModel($base->conexion);
        $tablaAmortizacion = array();
        $tieneCuotaCero = $this->tablaAmortizacion($datos, $tablaAmortizacion);
        $this->consultarYConfigurarPagos($tablaAmortizacion, $tieneCuotaCero, $datos);
//        print_r($tablaAmortizacion);
        $this->escribirDatos($datos, $tablaAmortizacion);
    }

    public function consultarYConfigurarPagos(&$tablaAmortizacion, $cuotaCero, $datosPrincipales) {
        $idfinanciacion = $datosPrincipales["idfinanciacion"];
        $idsuscripcion = $datosPrincipales["idsuscripcion"];
        $datosejecutado = $this->pagosCreditoModelo->datosEjecutados($idfinanciacion, $idsuscripcion);

        for ($i = 0; $i < count($datosejecutado); $i++) {
            $cuota = $tablaAmortizacion[$i];
            $pago = $datosejecutado[$i];
            $cuota['estado'] = $pago['estado'];
            $cuota['pagadocapital'] = $pago['capital'];
            $cuota['pagadointereses'] = $pago['intgeres'];
            $cuota['pagadoseguro'] = $pago['seguro'];
            $cuota['estudio'] = $pago['estudio'];
            $this->saldoReal($cuotaCero, $cuota, $datosPrincipales, $tablaAmortizacion, $i);
            $tablaAmortizacion[$i] = $cuota;
        }
    }

    /**
     * Se hace la tabla de amortización con el numero de cuotas  y el saldo que tiene 
     * 
     * pendite el credito 
     * @param type $datos
     * @param type $calcularCuotaCero
     * @param type $datosejecutadoSE HA
     */
    public function tablaAmortizacion($datos, &$datosejecutado) {
        $capital = $datos["capital"];
        $plazo = $datos['plazo'];
        $contado = 1;
        $interes = $datos["tasa"] / 100;
        $otrosConceptos = ($datos["seguro"] + $datos["estudio"]) / $datos["plazo"];
        $cuota = $this->cuota($datos);
        $tieneCuotaCero = $this->calcularCuotaCero($datos, $datosejecutado);
        for ($i = 1; $i <= $plazo; $i++) {
            $valorInteres = $capital * $interes;
            $amortizado = $cuota - $valorInteres;
            $capital = $capital - $amortizado;
            $fechapago = date('Y-m-d', strtotime('+' . $contado . ' months', strtotime($datos['fechapago'])));
            $cuotaAmortizada = $this->configurarCuota($contado, $valorInteres, ($cuota + $otrosConceptos), $capital, $amortizado, $fechapago);
            array_push($datosejecutado, $cuotaAmortizada);
            $contado++;
        }
        return $tieneCuotaCero;
    }

    /**
     * Se calcula la cuota 0  
     * @param type $datos los datos que necesito de credito 
     * @param type $cuotas arreglo dobdo almaceno las cuota
     * @param type $calcularCuotaCero Valida si re requiere calcular la cuota 
     */
    public function calcularCuotaCero($datos, &$cuotas) {
        $idfinanciacion = $datos["idfinanciacion"];
        $dias = $this->pagosCreditoModelo->diasDiferenciaPeriodo($idfinanciacion);
        if ($dias >= 0 && $dias < 30) {
            $capital = $datos["capital"];
            $interes = $datos["tasa"] / 100;
            $cuota = (($capital * $interes) / 30) * $dias;
            $fechapago = $datos["fechapago"];
            $cuotaAmortizada = $this->configurarCuota(0, $cuota, $cuota, $capital, 0, $fechapago);
            array_push($cuotas, $cuotaAmortizada);
            return 1;
        }
        return 0;
    }

    /**
     * Crea un objeto con los datos necesario para una cuota amortizada
     * @param type $numero
     * @param type $interes
     * @param type $cuota
     * @param type $saldo
     * @param type $amortizado
     * @param type $fechapago
     * @return type
     */
    public function configurarCuota($numero, $interes, $cuota, $saldo, $amortizado, $fechapago) {
        $cuotaAmortizada["numero"] = $numero;
        $cuotaAmortizada["capitalproyectado"] = $amortizado;
        $cuotaAmortizada["interesproyectado"] = $interes;
        $cuotaAmortizada["cuota"] = $cuota;
        $cuotaAmortizada["saldo"] = $saldo;
        $cuotaAmortizada["fechapago"] = $fechapago;
        return $cuotaAmortizada;
    }

    /**
     * Valida que tipo de cuota es : si es variable o fija 
     * @param type $datos
     * @return type
     */
    public function cuota($datos) {
        $tipoCuota = $datos["tipocuota"];
        if ($tipoCuota == "V") {
            return $this->cuotaVariable($datos);
        }
        return $this->calcularCuota($datos);
    }

    /**
     * Calcula la cuota del credito cuando la cuota es fija
     * @param type $datos datos del credito 
     * @return type
     */
    private function calcularCuota($datos) {
        $capitalInicial = $datos["capital"];
        $tasaInteres = $datos["tasa"];
        $numeroCuotas = $datos["plazo"];

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

    /**
     * Calcula la cuota del credito cuando la cuota es variable 
     * @param type $datos datos del credito 
     * @return type
     */
    private function cuotaVariable($datos) {
        $numeroCuotas = $datos["plazo"];
        $capitalInicial = $datos["capital"];
        $tasaInteres = $datos["tasa"];
        if ($tasaInteres == 0) {
            return round(($capitalInicial / $numeroCuotas), CANTIDAD_DECIMALES);
        }
        $i = $tasaInteres / 100;

        return round(($capitalInicial / $numeroCuotas) + ($capitalInicial * $i), CANTIDAD_DECIMALES);
    }

    public function escribirDatos($datosPrincipales, $tabla) {
        $cuotaCeroEjecutada = $this->pagosCreditoModelo->cuotaCero($datosPrincipales["idfinanciacion"]);
        $this->encabezado($datosPrincipales);
        $this->agregarFilaEncabezadoTabla(12);
        $numeroCuotas = empty($cuotaCeroEjecutada) ? 1 : 0;
        $numerofila = 13;
        for ($i = 0; $i < count($tabla); $i++) {
            $cuota = $tabla[$i];
            $cuota["numero"] = $numeroCuotas;
            $this->escribirDatosColumnas($numerofila, $cuota);
            $tabla[$i] = $cuota;
            $numeroCuotas++;
            $numerofila ++;
        }
        $this->estilo(13, ($numeroCuotas + 13));
        $this->totales(13, ($numeroCuotas + 13));
    }

    public function saldoReal($cuotaCeroEjecutada, &$cuota, $datosPrincipales, $tabla, $i) {
        if (array_key_exists("pagadocapital", $cuota)) {
            if (!empty($cuotaCeroEjecutada) && $i == 0) {
                $cuota["saldoreal"] = $datosPrincipales["capital"];
                return;
            }
            if (empty($cuotaCeroEjecutada) && $i == 0) {
//                print_r('table en la posicion ' . $i . ' capital ' . $datosPrincipales["capital"] . 'cuota pagada ' . $cuota["pagadocapital"] . ' \n');
                $cuota["saldoreal"] = $datosPrincipales["capital"] - $cuota["pagadocapital"];
                return;
            }

//            print_r("Registro No  $i  -- Cuota " . $cuota['numero'] . " \n");
//            print_r('table en la posicion anterior' . ($i - 1) . 'posicioan actual tabla ' . ($i) . ' capital ' . $tabla[($i - 1)]["saldoreal"]
//                    . 'cuota pagada ' . $cuota["pagadocapital"] . ' \n');
            $cuota["saldoreal"] = $tabla[($i - 1)]["saldoreal"] - $cuota["pagadocapital"];
        }
    }

    public function encabezado($datos) {
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:J1');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A1', 'POTENZA INVERSIONES SAS')
                ->setCellValue('B3', 'Id financiacion')
                ->setCellValue('B4', $datos['idfinanciacion'])
                ->setCellValue('C3', 'Id suscripcion')
                ->setCellValue('C4', $datos['idsuscripcion'])
                ->setCellValue('D3', 'Credito No')
                ->setCellValue('D4', $datos['idcredito'])
                ->setCellValue('B6', 'Cliente')
                ->setCellValue('B7', $datos['nombre'])
                ->setCellValue('C6', 'Identificacion')
                ->setCellValue('C7', $datos['documento'])
                ->setCellValue('D6', 'Capital')
                ->setCellValue('D7', $datos['capital'])
                ->setCellValue('B9', 'Fecha desembolso')
                ->setCellValue('B10', $datos['fechadesembolso'])
                ->setCellValue('C9', 'Fecha vencimiento')
                ->setCellValue('C10', $datos['fechavencimiento'])
                ->setCellValue('D9', 'Plazo obligatorio')
                ->setCellValue('D10', $datos['plazo'])
                ->setCellValue('E9', 'Tasa')
                ->setCellValue('E10', $datos['tasa']);

        $this->objPHPExcel->setActiveSheetIndex(0)
                ->getStyle('D7')->getNumberFormat()->setFormatCode('$#,##0.00');
    }

    public function agregarFilaEncabezadoTabla($i) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, 'No Cuota')
                ->setCellValue('B' . $i, 'Fecha de Pago')
                ->setCellValue('C' . $i, 'Capital proyectado')
                ->setCellValue('D' . $i, 'Interes proyectado')
                ->setCellValue('E' . $i, 'Cuota')
                ->setCellValue('F' . $i, 'Saldo')
                ->setCellValue('G' . $i, 'Estado')
                ->setCellValue('H' . $i, 'Valor pagado a capital')
                ->setCellValue('I' . $i, 'Valor pagado a interes')
                ->setCellValue('J' . $i, 'Valor Seguro')
                ->setCellValue('K' . $i, 'Valor Estudio')
                ->setCellValue('L' . $i, 'Saldo Real');
        $this->objPHPExcel->setActiveSheetIndex(0)->getRowDimension($i)->setRowHeight(30);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("A" . $i . ":L" . $i)->getAlignment()->setWrapText(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A' . $i . ':L' . $i)->applyFromArray(
                array(
                    'fill' => array(
                        'type' => \PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'EBE9E9')
                    ),
                    'font' => array(
                        'bold' => true
                    ),
                    'alignment' => array(
                        'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                    )
                )
        );
    }

    public function escribirDatosColumnas($i, $datos) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, $datos["numero"])
                ->setCellValue('B' . $i, $datos["fechapago"])
                ->setCellValue('C' . $i, $datos["capitalproyectado"])
                ->setCellValue('D' . $i, $datos["interesproyectado"])
                ->setCellValue('E' . $i, $datos["cuota"])
                ->setCellValue('F' . $i, $datos["saldo"])
                ->setCellValue('G' . $i, array_key_exists("estado", $datos) ? $datos["estado"] : "P")
                ->setCellValue('H' . $i, array_key_exists("pagadocapital", $datos) ? $datos["pagadocapital"] : "" )
                ->setCellValue('I' . $i, array_key_exists("pagadointereses", $datos) ? $datos["pagadointereses"] : "")
                ->setCellValue('J' . $i, array_key_exists("pagadoseguro", $datos) ? $datos["pagadoseguro"] : "")
                ->setCellValue('K' . $i, array_key_exists("estudio", $datos) ? $datos["estudio"] : "")
                ->setCellValue('L' . $i, array_key_exists("saldoreal", $datos) ? $datos["saldoreal"] : "");
    }

    public function totales($inicial, $final) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('B' . $final, "TOTAL")
                ->setCellValue('C' . $final, "=SUM(C" . $inicial . ":C" . ($final - 1) . ")")
                ->setCellValue('D' . $final, "=SUM(D" . $inicial . ":D" . ($final - 1) . ")")
                ->setCellValue('E' . $final, "=SUM(E" . $inicial . ":E" . ($final - 1) . ")")
                ->setCellValue('F' . $final, "=SUM(F" . $inicial . ":F" . ($final - 1) . ")")
                ->setCellValue('H' . $final, "=SUM(H" . $inicial . ":H" . ($final - 1) . ")")
                ->setCellValue('I' . $final, "=SUM(I" . $inicial . ":I" . ($final - 1) . ")")
                ->setCellValue('J' . $final, "=SUM(J" . $inicial . ":J" . ($final - 1) . ")")
                ->setCellValue('K' . $final, "=SUM(K" . $inicial . ":K" . ($final - 1) . ")")
                ->setCellValue('L' . $final, "=SUM(L" . $inicial . ":L" . ($final - 1) . ")");

        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("A" . $final . ":L" . $final)->getAlignment()->setWrapText(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A' . $final . ':L' . $final)->applyFromArray(
                array(
                    'fill' => array(
                        'type' => \PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'EBE9E9')
                    ),
                    'font' => array(
                        'bold' => true
                    ),
                    'alignment' => array(
                        'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                    )
                )
        );
    }

    public function estilo($inicio, $final) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->getStyle('C' . $inicio . ':F' . $final)->getNumberFormat()->setFormatCode('$#,##0.00');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->getStyle('H' . $inicio . ':L' . $final)->getNumberFormat()->setFormatCode('$#,##0.00');

        $style = array(
            'alignment' => array(
                'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            )
        );
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("A1:L" . $final)->applyFromArray($style);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('A')->setWidth(10);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('B')->setWidth(20);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('C')->setWidth(20);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('D')->setWidth(20);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('E')->setWidth(20);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('F')->setWidth(20);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('H')->setWidth(18);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('I')->setWidth(18);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('J')->setWidth(18);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('K')->setWidth(18);
        $this->objPHPExcel->setActiveSheetIndex(0)->getColumnDimension('L')->setWidth(18);
        //Encabezado
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("B3:D3")->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("B6:D6")->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("B9:E9")->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle("A1")->getFont()->setBold(true);
    }

}
