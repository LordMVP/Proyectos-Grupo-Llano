<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Reportes\ReportesBundle\Models\NotasReporteModel;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of NotasReporteController
 *
 * @author progredi
 */
class NotasReporteController extends Controller {
    //put your code here

    /**
     * @Route("/notasreporte")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:notasReporte.html.twig") 
     */
    public function notasReportes() {
        $base = $this->get("reportes.base");
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarnotasreporte")
     * @Method({"POST"})
     */
    public function generarNotasReporte(Request $request) {
        try {
            $parametros['PR_STR_CONDICIONES'] = '';
            $base = $this->get("reportes.base");
            $content = json_decode($request->getContent(), true);
            $documento  = $content['documento'];
            
            $parametros['PR_INT_EMPRESA'] = $base->idEmpresa;
            $parametros['PR_STR_FECHA1'] = $content['fechaInicial'];
            $parametros['PR_STR_FECHA2'] = $content['fechaFinal'];
            
            
            if(!empty($documento)){
                $parametros['PR_STR_CONDICIONES'] .= " AND doc_padre.uni_documento IN (".$documento.")";
            }
            
            if (!empty($content['municipio'])) {
                $parametros['PR_STR_CONDICIONES'] .= " AND dsus.uni_municipio = " . $content['municipio'];
            }
            if (!empty($content['ciclo'])) {
                $parametros['PR_STR_CONDICIONES'] .= " AND fac.cic_ideregistro in (" . $content['ciclo'] . ")";
            }
            if (!empty($content['estado'])) {
                $parametros['PR_STR_CONDICIONES'] .= " AND dsus.dsus_estado = '" . $content['estado'] . "'";
            }
            if (!empty($content['idsuscripcion'])) {
                $parametros['PR_STR_CONDICIONES'] .= " AND (fac.dsus_ideregistr = ".$content['idsuscripcion']." "
                        . "OR dsus.dsus_pcodigo = '".$content['idsuscripcion']."')";
                
            }
            
            /*$parametros['PR_STR_CONDICION'] .= " AND dsus.emp_ideregistro = " . $base->idEmpresa;
            $parametros['PR_STR_CONDICION'] .= " AND fac.fac_fecha::DATE BETWEEN  '" . $content['fechaInicial'] . "'::DATE AND  '" . $content['fechaFinal'] . "'::DATE     ";
            //if (!empty($content['municipio'])) {
            if (!empty($content['municipio'])) {
                $parametros['PR_STR_CONDICION'] .= " AND dsus.uni_municipio = " . $content['municipio'];
            }
            if (!empty($content['ciclo'])) {
                $parametros['PR_STR_CONDICION'] .= " AND fac.cic_ideregistro in (" . $content['ciclo'] . ")";
            }
            if (!empty($content['estado'])) {
                $parametros['PR_STR_CONDICION'] .= " AND dsus.dsus_estado = " . $content['estado'];
            }
            if (!empty($content['idsuscripcion'])) {
                $parametros['PR_STR_CONDICION'] .= " AND fac.dsus_ideregistr = " . $content['idsuscripcion'];
            }*/
            
            //set_time_limit(3600);
            //ini_set('memory_limit', '512');
            //return $this->construirExcel($parametros);
            
            $report = $base->getReportObject("notas.jrxml", $parametros, "xlsx");
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

    public function construirExcel($parametros) {
        $base = $this->get("reportes.base");
        if (empty($parametros)) {
            throw new MyException('Error al generar el reporte', -1);
        }

        $cacheMethod = \PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp;
        $cacheSettings = array(' memoryCacheSize ' => '64MB');
        \PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);

        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->getDefaultStyle()
                ->getAlignment()
                ->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Reporte Notas")
                ->setSubject("Notas")
                ->setDescription("Reporte de notas")
                ->setKeywords("Notas")
                ->setCategory("Notas");


        $this->procesarDatos($base, $parametros['PR_STR_CONDICION']);
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
//        print('\n Lleaqui');
        $nombreReporte = 'reporte_' . round(microtime(true) * 1000) . '.xlsx';
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
//        print_r('\n Guarda el reporte en   ' . RUTA_REPORTES_GRANDES . ' ');
        $objWriter->save(RUTA_REPORTES_GRANDES . $nombreReporte);
//        print_r('\n  construye la respuesta ' . ' ');
        $respuesta["codigoRespuesta"] = 1;
        $respuesta['id'] = $nombreReporte;
        $respuesta['mensaje'] = 'Consulta realizada correctamente';
//        print_r('\n  Contruye la repuesta ' . ' ');
        return Util::construyeRespuesta($respuesta);
    }

    public function procesarDatos($base, $parametros) {
        $datos = new NotasReporteModel($base->conexion);
        $resultado = $datos->procesarDatos($this->objPHPExcel, $parametros);
        $letrafinal = $resultado['letraFinal'];
        $cantidadfilas = $resultado['cantidadFacturas'];

        $this->estilo($base, $letrafinal, $cantidadfilas);
    }

    public function estilo($base, $letrafinal, $cantidadfilas) {

        $style = array(
            'alignment' => array(
                'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            )
        );

        $style2 = array(
            'borders' => array(
                'allborders' => array(
                    'style' => \PHPExcel_Style_Border::BORDER_THIN
                )
            )
        );

        $styleLetra = array(
            'font' => array(
                'bold' => true,
                'size' => 16,
            )
        );
        $this->objPHPExcel->getActiveSheet()->setShowGridlines(false);

        //Imagen
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:B4');
        // $this->imagen();
        $this->insertarLogoExcel();
        //Titulo 
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C1:' . $letrafinal . '2');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C1', $base->empresaNombre);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '2')->applyFromArray($styleLetra);
        //Titulo rEPORTE
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C3:' . $letrafinal . '4');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C3', ' REPORTES NOTAS');
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C3:' . $letrafinal . '4')->applyFromArray($styleLetra);



        $posicion = $letrafinal . $cantidadfilas;

        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '4')->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A1:' . $posicion)->applyFromArray($style);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A6:' . $posicion)->applyFromArray($style2);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A1:' . $posicion)->getAlignment()->setWrapText(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A1:' . $posicion)->getAlignment()->setVertical(\PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A1:' . $posicion)->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
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
