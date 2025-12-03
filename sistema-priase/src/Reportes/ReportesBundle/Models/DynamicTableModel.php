<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of DynamicTableModel
 *
 * @author jpsierra
 */
abstract class DynamicTableModel extends ReportesDefaultModel {

    //put your code here

    protected $defaultConditions;
    protected $defaultOrder;
    protected $optionalConditions;
    protected $columns;
    protected $tableName;
    protected $parameters;
    protected $conditions;
    protected $conditionText;
    protected $orderText;
    protected $paginationText;
    protected $columnsMap;
    protected $sql;
    protected $resultData;
    protected $totalRows;

    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->init();
    }

    abstract protected function getSqlQuery();

    abstract protected function init();

    public function mainQuery($page = 1, $count = 10, $conditions = null) {
        $this->buildConditions($conditions);
        $this->buildOrder();
        $this->buildPagination($page, $count);
        $this->sql = $this->getSqlQuery() . " " . $this->conditionText;
        $this->sql = $this->sql . " " . $this->orderText;
        //$this->totalRows = count($this->executeQuery($this->sql, $this->parameters));
        $this->sql = $this->sql . " " . $this->paginationText;
        $this->resultData = $this->executeQuery($this->sql, $this->parameters);
        $this->totalRows = count($this->resultData) != 0 ? $this->resultData[0]['total_rows'] : 0;
        $response = array("data" => $this->resultData, "total" => $this->totalRows);
        return $response;
    }

    protected function buildConditions($conditions) {
        $defaultConditions = $this->buildDefaultConditions();
        if ($conditions != null) {
            foreach ($conditions as $key => $value) {
                if ($value !== null) {
                    if ($this->optionalConditions != null && isset($this->optionalConditions[$key])) {
                        array_push($defaultConditions, $this->optionalConditions[$key]);
                    }
                    $this->parameters[$key] = $value;
                }
            }
        }
        $this->conditionText = count($defaultConditions) == 0 ? "" : " WHERE " . implode(" AND ", $defaultConditions);
    }

    protected function buildDefaultConditions() {
        $defaultConditions = array();
        if ($this->defaultConditions != null) {
            foreach ($this->defaultConditions as $key => $value) {
                array_push($defaultConditions, $key . "=" . $value);
            }
        }
        return $defaultConditions;
    }

    protected function buildOrder() {
        $order = array();
        if ($this->defaultOrder != null) {
            foreach ($this->defaultOrder as $key => $value) {
                array_push($order, "$key $value");
            }
        }
        $this->orderText = count($order) === 0 ? "" : "ORDER BY " . implode(",", $order);
    }

    protected function buildPagination($page, $count) {
        $this->parameters['offset'] = ($page - 1) * $count;
        $this->parameters['limit'] = $count;
        $this->paginationText = " OFFSET :offset LIMIT :limit";
    }

    protected function replaceColumnsNames() {
        $matches = array();
        preg_match_all("/%%([\w]+)%%/", $this->sql, $matches);
        for ($i = 0; $i < count($matches[0]); $i++) {
            $this->sql = str_replace($matches[0][$i], $this->columnsMap[$matches[1][$i]], $this->sql);
        }
    }

    protected function countAll() {
        $sql = $this->getSqlQuery();
        $defaultConditions = $this->buildDefaultConditions();
        $conditionText = count($defaultConditions) == 0 ? "" : " WHERE " . implode(" AND ", $defaultConditions);
        $sql = $sql . " " . $conditionText;
        $resultado = $this->executeQuery($sql);
        return count($resultado);
    }

    protected function createColumnsMap() {
        $matches = array();
        $this->columnsMap = array();
        preg_match_all("/([\w\.]+)\sAS\s([\w]+)/", $this->sql, $matches);
        for ($i = 0; $i < count($matches[0]); $i++) {
            $this->columnsMap[$matches[2][$i]] = $matches[1][$i];
        }
    }

    public function getColumns() {
        return $this->columns;
    }

}
