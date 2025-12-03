<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\ModelReport;

/**
 * Description of ExcelTestReport
 *
 * @author jpsierra
 */
class ExcelTestReport {

    //put your code here
    private $objPHPExcel;
    private $objReader;
    private $rowNum;
    private $groups;
    private $groupsValues;
    private $groupsColumnVars;
    private $columns;
    private $columnsVars;
    private $currentRow;
    private $currentAntRow;
    private $rowDataNum = 0;
    private $data;

    public function __construct() {
        $this->objReader = \PHPExcel_IOFactory::createReader('Excel2007');
        $this->objPHPExcel = $this->objReader->load(EXCEL_REPORTS_PATH . "/plantilla_1.xlsx");
       
    }

    public function build() {
        $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel2007');
        \PHPExcel_Shared_Font::setAutoSizeMethod(\PHPExcel_Shared_Font::AUTOSIZE_METHOD_EXACT);
        $objWriter->save(EXCEL_REPORTS_PATH . "/prueba.xlsx");
    }

    public function fillReport($data, $columns, $groups) {
        $this->objPHPExcel->getActiveSheet()->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(1, 4);
        $this->groups = $groups;
        $this->columns = $columns;
        $this->data = $data;
        $this->groupsValues = array();

        foreach ($this->groups as $key => $group) {
            $this->groupsValues[$key] = $group;
            $this->groupsValues[$key]['value'] = null;
            $this->groupsValues[$key]['change'] = false;
            $this->groupsValues[$key]['name'] = $group;
            foreach (array_keys($this->columns) as $order) {
                $this->columnsVars[$order] = 0;
                $this->groupsColumnVars[$key][$order]['VALUE'] = 0;
                $this->groupsColumnVars[$key][$order]['SUM'] = 0;
                $this->groupsColumnVars[$key][$order]['COUNT'] = 0;
                $this->groupsColumnVars[$key][$order]['AVG'] = 0;
            }
        }
        $this->groups = $this->groupsValues;
        $this->rowNum = 5;
        $antRow = null;
        $this->writeColumnsNames($this->columns);
        foreach ($this->data as $row) {
            $this->rowDataNum++;
            $this->currentRow = $row;
            $this->rowChange($row);
            if ($antRow != null) {
                $this->writeGroupFooter();
            }
            $this->writeGroupHeader();
            $this->writeDetail($row, $this->columns);
            $antRow = $row;
            $this->currentAntRow = $row;
        }
        $this->writeGroupFooter(true);
        foreach ($this->columns as $order => $column) {
            if(isset($column['width'])&&$column['width']=='auto'){
                $this->objPHPExcel->getActiveSheet()->getColumnDimensionByColumn($order)->setAutoSize(true);           
            }elseif (isset($column['width'])) {
                $this->objPHPExcel->getActiveSheet()->getColumnDimensionByColumn($order)->setAutoSize(false); 
                $this->objPHPExcel->getActiveSheet()->getColumnDimensionByColumn($order)->setWidth($column['width']);
            }
            
        }
        
    }

    private function writeColumnsNames() {
        $this->objPHPExcel->getActiveSheet()->getRowDimension('4')->setRowHeight(30);
        foreach ($this->columns as $order => $column) {
            $this->objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($order, 4)->getAlignment()->setWrapText(true);
            $this->objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($order, 4)->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            $this->objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($order, 4, $column['label']);
        }
    }

    private function writeDetail($row) {
        foreach ($this->columns as $order => $column) {
            $this->objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($order, $this->rowNum, $row[$column['name']]);
            if (isset($column['function'])) {
                $this->calculeFunction($order, $column, $row);
            }
            $this->columnsVars[$order]+=$row[$column['name']];            
        }
        $this->rowNum++;
    }

    private function calculeFunction($order, $column, $row) {
        foreach (array_keys($this->groupsValues) as $key) {
            $this->groupsColumnVars[$key][$order]['SUM']+=$row[$column['name']];
            $this->groupsColumnVars[$key][$order]['COUNT']++;             
            $this->groupsColumnVars[$key][$order]['AVG'] = $this->groupsColumnVars[$key][$order]['SUM'] / $this->groupsColumnVars[$key][$order]['COUNT'];
            $this->groupsColumnVars[$key][$order]['VALUE'] = $this->groupsColumnVars[$key][$order][$column['function']]; 
        }
    }

    private function writeGroupHeader() {
        foreach ($this->groupsValues as $group) {
            if ($group['change']) {
                $title = $this->processTitle($group['headerTitle'], $this->currentRow);
                $this->objPHPExcel->getActiveSheet()->setCellValue('A' . $this->rowNum, $title);
                $this->rowNum++;
            }
        }
    }

    private function processTitle($title, $row) {
        $datas = array();
        preg_match_all('~<%(.*?)%>~s', $title, $datas);
        $Html = $title;
        foreach ($datas[1] as $value) {
            $Html = str_replace($value, $row[$value], $Html);
        }
        return str_replace(array("<%", "%>"), '', $Html);
    }

    private function writeGroupFooter($final = false) {
        $closeGroups = null;
        foreach ($this->groupsValues as $key => $group) {
            if ($group['change']) {
                $closeGroups = array_reverse(array_slice($this->groupsValues, $key));
                break;
            }
        }
        if ($final) {
            $closeGroups = array_reverse($this->groupsValues);
        }
        if ($closeGroups != null) {
            foreach ($closeGroups as $key => $group) {
                $title = $this->processTitle($group['footerTitle'], $this->currentAntRow);
                $this->objPHPExcel->getActiveSheet()->setCellValue('A' . $this->rowNum, $title);
                $this->rowNum++;
                $this->writeFooterTotals($key);
            }
        }
    }

    private function writeFooterTotals($group) {
        foreach (array_keys($this->columns) as $columnOrder) {
            $this->objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnOrder, $this->rowNum, $this->groupsColumnVars[$group][$columnOrder]['VALUE']);
            $this->groupsColumnVars[$group][$columnOrder]['VALUE'] = 0;
            $this->groupsColumnVars[$group][$columnOrder]['SUM'] = 0;
            $this->groupsColumnVars[$group][$columnOrder]['COUNT'] = 0;
            $this->groupsColumnVars[$group][$columnOrder]['AVG'] = 0;
        }
        $this->rowNum++;
    }

    private function rowChange($row) {
        foreach ($this->groups as $order => $group) {
            $this->groupsValues[$order]['change'] = $row[$group['column']] != $this->groupsValues[$order]['value'];
            $this->groupsValues[$order]['antValue'] = $this->groupsValues[$order]['value'];
            $this->groupsValues[$order]['value'] = $row[$group['column']];
        }
    }

}
