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
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Reportes\ReportesBundle\Models\FinanciacionesFacturadasCicloReporteModel;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Llanogas\LlanogasBundle\Utiles\Util;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

/**
 * Description of FinanciacionesFacturadasCicloController
 *
 * @author AppFuture
 */
class FinanciacionesFacturadasCicloController extends Controller {

    /**
     * @Route("/financiacionesfacturadasciclo")
     * @Method({"GET"})
     * @Template("ReportesBundle:Cartera:financiacionesFacturadasCiclo.html.twig") 
     */
    public function financiacionesFacturadasCiclo() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarfinanciacionesFacturadasCiclo")
     * @Method({"POST"})
     */
    public function generarfinanciacionesFacturadasCiclo(Request $requiest) {
        
/*
            $base = $this->get("reportes.base");
            $datosInterfaz = json_decode($requiest->getContent(), true);
            $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
            //$parametros['PR_STR_CONDICION'] = " AND  fac.emp_ideregistro = " . $base->idEmpresa;
            $parametros['PR_STR_CONDICION'] = " AND DATE_TRUNC('MONTH', per.per_fecfinal)::DATE = '01-".STR_PAD($datosInterfaz['periodo'],2,'0',STR_PAD_LEFT)."-".$datosInterfaz['anos']."'::DATE";
            
            if (isset($datosInterfaz['ciclo'])) {
                if (!empty($datosInterfaz['ciclo'])) {
                    $parametros['PR_STR_CONDICION'] .= " AND cic.cic_ideregistro in (" . $datosInterfaz['ciclo'] . ")";
                }
            }
            set_time_limit(3600);
            $report= $base->getReportObject("FinFacturadasCiclos.jrxml", $parametros, "xlsx");
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);

        
        */
        try {
            $base = $this->get("reportes.base");
            $datosInterfaz = json_decode($requiest->getContent(), true);
            $parametros['PR_STR_CONDICION'] = " AND  fac.emp_ideregistro = " . $base->idEmpresa;
            $parametros['PR_STR_CONDICION'] .= " AND DATE_TRUNC('MONTH', per.per_fecfinal)::DATE = '01-".
                    STR_PAD($datosInterfaz['periodo'],2,'0',STR_PAD_LEFT)."-".$datosInterfaz['anos']."'::DATE";
            
            if (isset($datosInterfaz['ciclo'])) {
                if (!empty($datosInterfaz['ciclo'])) {
                    $parametros['PR_STR_CONDICION'] .= " AND cic.cic_ideregistro in (" . $datosInterfaz['ciclo'] . ")";
                }
            }
            
            set_time_limit(3600);
            return $this->construirExcel($parametros);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
     
               
    }

    public function construirExcel($parametros) {
        $base = $this->get("reportes.base");
        if (empty($parametros)) {
            throw new MyException('Error al generar el reporte', -1);
        }
        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->getDefaultStyle()
                ->getAlignment()
                ->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Financiacion facturas Ciclo")
                ->setSubject("Financiacion")
                ->setDescription("Reporte de las facturas financiadas por ciclo")
                ->setKeywords("Financiacion")
                ->setCategory("Financiacion");
        $this->procesarDatos($base, $parametros['PR_STR_CONDICION']);
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        $nombreReporte = 'reporte_' . round(microtime(true) * 1000) . '.xlsx';
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
        $objWriter->save(RUTA_REPORTES_GRANDES . $nombreReporte);
        $respuesta["codigoRespuesta"] = 1;
        $respuesta['id'] = $nombreReporte;
        $respuesta['mensaje'] = 'Consulta realizada correctamente';
        return Util::construyeRespuesta($respuesta);
    }

    public function procesarDatos($base, $parametros) {
        $financiacionesFacturadasCiclo = new FinanciacionesFacturadasCicloReporteModel($base->conexion);
        $letrafinal = $financiacionesFacturadasCiclo->procesarDatos($this->objPHPExcel, $parametros);
        $this->estilo($base, $letrafinal);
    }

    public function estilo($base, $letrafinal) {

        $style = array(
            'alignment' => array(
                'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            )
        );

        //Imagen
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:B4');
        $this->insertarLogoExcel();
        //Titulo 
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C1:' . $letrafinal . '2');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C1', $base->empresaNombre);
        //Titulo rEPORTE
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C3:' . $letrafinal . '4');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C3', 'FINANCIACIONES FACTURADAS POR CICLO');

        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '4')->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '4')->applyFromArray($style);
        $this->objPHPExcel->setActiveSheetIndex(0)->getRowDimension('5')->setRowHeight(30);

        //Columnas encabezado
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A5:' . $letrafinal . '5')->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A5:' . $letrafinal . '5')->getAlignment()->setWrapText(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A5:' . $letrafinal . '5')->applyFromArray($style);
    }

    public function insertarLogoExcel() {

        $objDrawing = new \PHPExcel_Worksheet_Drawing();
        $objDrawing->setName('Logo');
        $objDrawing->setDescription('Logo');
        $logo = RUTA_PRINCIPAL . "/web/bundles/Llanogas/img/logollanogas.gif"; // Provide path to your logo file
        $objDrawing->setPath($logo);  //setOffsetY has no effect
        $objDrawing->setCoordinates('A1');
        $objDrawing->setHeight(80); // logo height

        $objDrawing->setWorksheet($this->objPHPExcel->getActiveSheet());
    }

}
