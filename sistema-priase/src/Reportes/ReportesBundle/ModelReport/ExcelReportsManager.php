<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\ModelReport;

/**
 * Description of ExcelReportsManager
 *
 * @author jpsierra
 */
class ExcelReportsManager {

    private $objPHPExcel;
    private $response;
    private $tituloLibro;
    private $hojasActuales = 0;
    private $extension;
    private $contentType;
    private $nombresColumnas;

    public function __construct($tituloLibro = "Reporte Llanogas", $nombresColumnas = true) {
        $this->tituloLibro = $tituloLibro;
        $this->nombresColumnas = $nombresColumnas;
    }

    public function construirRespuestaVacia() {
        $resultado['content'] = null;
        $resultado['error'] = false;
        $resultado['noContent'] = true;
        $resultado['format'] = $this->extension;
        $resultado['fileName'] = $this->tituloLibro . "." . $this->extension;
        return $resultado;
    }

    public function construirRespuestaAjax($formato = "Excel2007") {
        $this->ajustarFormato($formato);
        ob_end_clean();
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
        if ($formato === "CSV") {
            $objWriter->setDelimiter(';');
            $objWriter->setEnclosure('');
        }
        ob_start();
        $objWriter->save('php://output');
        $salida = ob_get_clean();
        $resultado['content'] = base64_encode($salida);
        $resultado['error'] = false;
        $resultado['noContent'] = false;
        $resultado['format'] = $this->extension;
        $resultado['fileName'] = $this->tituloLibro . "." . $this->extension;
        return $resultado;
    }

    public function construirRespuestaHttp($formato = "Excel2007") {
        $this->response = new \Symfony\Component\HttpFoundation\StreamedResponse();
        $this->response->setCallback(function()use($formato) {
            $objWriter = \PHPExcel_IOFactory:: createWriter($this->objPHPExcel, $formato);
            $objWriter->save('php://output');
        });
        $this->response->setStatusCode(200);
        $this->ajustarFormato($formato);
        $this->response->headers->set('Content-Type', $this->contentType);
        $this->response->headers->set('Content-Disposition', 'attachment; filename="' . $this->tituloLibro . '.' . $this->extension . '"');
        return $this->response;
    }

    private function ajustarFormato($formato) {
        switch ($formato) {
            case "CSV":
                $this->extension = "csv";
                $this->contentType = 'text/csv; charset=utf-8';
                break;
            case "Excel5":
                $this->extension = "xls";
                $this->contentType = 'application/vnd.ms-excel; charset=utf-8';
                break;
            default :
                $this->extension = "xlsx";
                $this->contentType = 'application/vnd.ms-excel; charset=utf-8';
        }
    }

    public function agregarHoja($datos, $tituloHoja = null, $columnas = null, $hoja = null) {
        if ($this->objPHPExcel == null) {
            $this->objPHPExcel = new \PHPExcel();
            $this->objPHPExcel->getProperties()->setCreator("Llanogas Reportes")
                    ->setLastModifiedBy("Reingenieria")
                    ->setTitle($this->tituloLibro)
                    ->setSubject("Reporte llanogas");
            $this->objPHPExcel->removeSheetByIndex(0);
        }
        if ($hoja === null) {
            $hoja = $this->hojasActuales;
        }
        $this->objPHPExcel->createSheet($hoja);
        $this->objPHPExcel->setActiveSheetIndex($hoja);

        $rowNum = $this->nombresColumnas ? 2 : 1;
        if ($tituloHoja === null) {
            $tituloHoja = "Hoja " . $hoja;
        }
        $this->
        objPHPExcel->getActiveSheet()->setTitle($tituloHoja);
        foreach ($datos as $row) {
            $this->procesarFila($row, $rowNum, $columnas);
            $rowNum++;
        }
        $this->objPHPExcel->getActiveSheet()->setAutoFilter(
                $this->objPHPExcel->getActiveSheet()->calculateWorksheetDimension());
        $this->hojasActuales++;
        $this->objPHPExcel->setActiveSheetIndex(0);
    }

    private function procesarFila($row, $rowNum, $columnas) {
        $columnCount = 0;
        foreach ($row as $key => $value) {
            if ($rowNum === 2 && $this->nombresColumnas) {
                $key = $this->obtenerNombreColumna($columnas, $key);
                $this->objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnCount, $rowNum - 1, $key);
                $this->objPHPExcel->getActiveSheet()->getColumnDimensionByColumn($columnCount)->setAutoSize(true);
            }
            $this->objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnCount, $rowNum, $value);
            $columnCount++;
        }
    }

    private function obtenerNombreColumna($columnas, $key) {
        if (isset($columnas) && isset($columnas[$key])) {
            $key = $columnas[$key];
        }
        return $key;
    }

    function getTituloLibro() {
        return $this->tituloLibro;
    }

    function getHojasActuales() {
        return $this->hojasActuales;
    }

    function setTituloLibro($tituloLibro) {
        $this->tituloLibro = $tituloLibro;
    }

}
