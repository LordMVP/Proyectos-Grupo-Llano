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
use Symfony\Component\HttpFoundation\StreamedResponse;
use Llanogas\LlanogasBundle\Utiles\Util;
use Reportes\ReportesBundle\Models\VeredasReporteModel;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;

/**
 * Description of VeredasController
 *
 * @author progredi1
 */
class VeredasController extends Controller {
//put your code here

    /**
     * @Route("/veredas")
     * @Method({"GET"})
     * @Template("ReportesBundle:Facturacion:veredas.html.twig") 
     */
    public function veredas() {
        $base = $this->get('reportes.base');
        return $base->parametrosBasicos;
    }

    /**
     * @Route("/generarveredasreporteformato2")
     * @Method({"POST"})
     */
    public function generarReporte(Request $request) {
        try {
            $base = $this->get('reportes.base');
            $nombreReporte = "Veredas.jrxml";
            $tituloReporte = "REPORTE VEREDAS - FORMATO 2";
            $datosInterfaz = json_decode($request->getContent(), true);
            $parametros["PR_INT_ANO"] = $datosInterfaz['anos'];
            $parametros["PR_INT_IDORDEN"] = $datosInterfaz['idordenperiodo'];
            $parametros["PR_STR_CONDICION"] = " AND pry.proyecto_ideregistro in (" . $datosInterfaz['municipios'] . ")";
            $parametros["PR_STR_TITULO_REPORTE"] = $tituloReporte;
            $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
            set_time_limit(3600);
            $report = $base->getReportObject($nombreReporte, $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

    /**
     * @Route("/generarveredasreporte")
     * @Method({"POST"})
     */
    public function generarNotasReporte(Request $request) {
        try {
            $base = $this->get('reportes.base');
            $nombreReporte = "VeredasFormato1.jrxml";
            //$tituloReporte = "REPORTE VEREDAS - FORMATO 1";
            $datosInterfaz = json_decode($request->getContent(), true);
            $parametros["PR_INT_MES"] = $datosInterfaz['idordenperiodo'];
            $parametros["PR_INT_ANNO"] = $datosInterfaz['anos'];
            $parametros["PR_STR_BARRIOS"] = $datosInterfaz['barrios'];
            $parametros['PR_INT_EMPRESA']=$base->idEmpresa;
            $parametros["PR_STR_FECHA"] = "'01-".str_pad($datosInterfaz['idordenperiodo'],2,"0", STR_PAD_LEFT)."-".$datosInterfaz['anos']."'";
            //$parametros["PR_STR_TITULO_REPORTE"] = $tituloReporte;
            set_time_limit(3600);
            $report = $base->getReportObject($nombreReporte, $parametros, 'xlsx', true);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
        
        
        //$base = $this->get("reportes.base");
        /*$datosInterfaz = json_decode($request->getContent(), true);
        $parametros['barrios'] = $datosInterfaz['barrios'];
        $parametros['anos'] = $datosInterfaz['anos'];
        $parametros['idordenperiodo'] = $datosInterfaz['idordenperiodo'];
        set_time_limit(3600);
        return $this->construirExcel($parametros);*/
    }

    public function construirExcel($parametros) {
        $base = $this->get("reportes.base");
        if (empty($parametros)) {
            throw new MyException('Error al generar el reporte', -1);
        }

        $cacheMethod = \PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp;
        $cacheSettings = array(' memoryCacheSize ' => '8MB');
        \PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);

        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->getDefaultStyle()
                ->getAlignment()
                ->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Reporte Veredas")
                ->setSubject("Veredas")
                ->setDescription("Reporte de Veredas")
                ->setKeywords("Veredas")
                ->setCategory("Veredas");


        $this->procesarDatos($base, $parametros);
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        $nombreReporte = 'reporte_veredas_formato1' . round(microtime(true) * 1000) . '.xlsx';
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
        $objWriter->setPreCalculateFormulas(true);
        $objWriter->save(RUTA_REPORTES_GRANDES . $nombreReporte);
        $respuesta["codigoRespuesta"] = 1;
        $respuesta['id'] = $nombreReporte;
        $respuesta['mensaje'] = 'Consulta realizada correctamente';

        return Util::construyeRespuesta($respuesta);
    }

    function procesarDatos($base, $param) {
        $objetoModelo = new VeredasReporteModel($base->conexion);
        $cantidadfilas = $objetoModelo->procesardatos($this->objPHPExcel, $param);
        $this->estilo($base, 'J', $cantidadfilas);
//        $this->objPHPExcel->disconnectWorksheets();
    }

    public function estilo($base, $letrafinal, $cantidadfilas) {

        $styleCentrar = array(
            'alignment' => array(
                'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            )
        );

        $styleBorder = array(
            'borders' => array(
                'allborders' => array(
                    'style' => \PHPExcel_Style_Border::BORDER_THIN
                )
            )
        );
        $styleTitulo = array(
            'font' => array(
                'bold' => true,
                'size' => 16,
            )
        );
        $this->objPHPExcel->getActiveSheet()->setShowGridlines(false);

        //Imagen
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:B4');
        $this->insertarLogoExcel();
        //Titulo 
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C1:' . $letrafinal . '2');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C1', $base->empresaNombre);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '2')->applyFromArray($styleTitulo);
        //Titulo rEPORTE
        $this->objPHPExcel->setActiveSheetIndex(0)->mergeCells('C3:' . $letrafinal . '4');
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('C3', ' REPORTE VEREDAS - FORMATO 1 ');
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C3:' . $letrafinal . '4')->applyFromArray($styleTitulo);



        $posicion = $letrafinal . $cantidadfilas;
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('C1:' . $letrafinal . '4')->getFont()->setBold(true);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A1:' . $posicion)->applyFromArray($styleCentrar);
        $this->objPHPExcel->setActiveSheetIndex(0)->getStyle('A6:' . $posicion)->applyFromArray($styleBorder);
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
