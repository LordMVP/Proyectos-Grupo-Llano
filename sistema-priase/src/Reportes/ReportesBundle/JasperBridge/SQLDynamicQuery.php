<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\JasperBridge;

/**
 * Description of SQLDynamicQuery
 *
 * @author jpsierra
 */
class SQLDynamicQuery {

    //put your code here
    private $conceptos;
    private $sqlColumns;

    public function __construct() {
        
    }

    public function buildQuery($columns) {
        foreach ($columns as $column) {
           $this->sqlColumns[]=$this->buildColumn($column);
        }
        return $this->sqlColumns;
    }

    private function buildColumn($column) {
        $columnSql = $column['operation'];
        $columnSql.="("
                . "CASE WHEN "
                . $column['condition']
                . " THEN "
                . $column['action']
                . " END ";
        $columnSql.=")";
        $coalesceDefault = isset($column['coalesce']) ? $column['coalesce'] : 0;
        $coalesce = "COALESCE(" . $columnSql . ",".$coalesceDefault.")";
        $columnSql = $coalesce." AS ".$column['name'];
        return $columnSql;
    }

}
