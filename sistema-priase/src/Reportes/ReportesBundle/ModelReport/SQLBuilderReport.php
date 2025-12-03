<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\ModelReport;

/**
 * Description of FacturacionBuilderReport
 *
 * @author jpsierra
 */
abstract class SQLBuilderReport {

    //put your code here

    protected $tables;
    protected $columns;
    protected $allColumns;
    protected $concepts;
    protected $conditions;
    protected $order;
    protected $joins;
    protected $joinsNeed;
    protected $groups;
    protected $mainTable;
    protected $mainTableAlias;

    public function __construct() {
        
    }

    protected function getTableDetails($table) {
        $parts = array();
        $details = array();
        preg_match('/(?:\[([<,>]{1,2})\])*([\w]+)(?:\((.+)\))*/', $table, $parts);
        if (count($parts) != 0) {
            $inner = $parts[1];
            $details['name'] = $parts[2];
            $details['alias'] = $parts[3];
        }
        switch ($inner) {
            case '><':$inner = "INNER JOIN";
            case '>':$inner = "LEFT JOIN";
            case '<':$inner = "RIGHT JOIN";
            case '<>':$inner = "FULL JOIN";
            default : $inner = "INNER JOIN";
        }
        $details['join'] = $inner;
        return $details;
    }

    protected function getTableConditions($details, $conditions) {
        $on = array();
        if (is_array($conditions)) {
            foreach ($conditions as $key => $value) {
                if (preg_match('/[\d]/', $key)) {
                    $key = $value;
                }
                $on[] = $this->buildCondition($details, $key, $value);
            }
        } else {
            $on[] = $this->mainTableAlias . "." . $conditions . " = " . $details['alias'] . "." . $conditions;
        }
        return $on;
    }

    protected function buildCondition($details, $key, $value) {
        if (preg_match('/\./', $value)) {
            return $details['alias'] . "." . $key . " = " . $value;
        } else {
            return $details['alias'] . "." . $key . " = " . $this->mainTableAlias . "." . $value;
        }
    }

    protected function buildLine($table, $conditions) {
        $line = "";
        $details = $this->getTableDetails($table);
        $on = $this->getTableConditions($details, $conditions);
        $line = $details['join'] . " " . $details['name'] . " " . $details['alias'];
        $onLine = "ON " . implode(" AND ", $on);
        return $line . " " . $onLine;
    }

    protected function sanitizeLabel($label) {
        $patrones[] = "/\(.+\)\s*/";
        $patrones[] = "/\s+/";
        $remplazos[] = "";
        $remplazos[] = "_";
        return strtolower("concepto_" . preg_replace($patrones, $remplazos, $label));
    }

    protected function buildSelects() {
        $selects = array();
        $joins = array();
        foreach ($this->columns as $key => $value) {
            $parts = array();
            if (!is_array($value)) {
                $label = $value;
                $val = $key;
            } else {
                $label = isset($value['label']) ? $value['label'] : preg_replace("/^.+\.(.+)/", "$1", $key);
                $val = isset($value['function']) ? preg_replace("/(.+)/", "$1($key)", $value['function']) : $key;
            }
            array_push($selects, $val . " AS " . $label);
            preg_match("/^(.+)\./", $key, $parts);
            if (count($parts)&&$parts[1]!=$this->mainTableAlias) {
                $joins = array_merge($joins, $this->processJoin($parts[1]));
            }
        }
        $this->joinsNeed = array_unique($joins);
        return $selects;
    }

    protected function buildGroup() {
        $selects = array();
        foreach ($this->columns as $key => $value) {
            $parts = array();
            if (is_array($value)) {
                $value = isset($value['label']) ? $value['label'] : preg_replace("/^.+\.(.+)/", "$1", $key);
            }
            preg_match("/^(.+)\./", $key, $parts);
            if (count($parts)) {
                array_push($selects, $value);
            }
        }
        return $selects;
    }

    protected function processJoin($table) {
        $joins = array();
        $parts = array();
        $conditions = each($this->joins[$table])['value'];
        if (is_array($conditions)) {
            foreach ($conditions as $value) {
                preg_match("/^(.+)\./", $value, $parts);
                if (count($parts)) {
                    $joins = array_merge($joins, $this->processJoin($parts[1]));
                } else {
                    array_push($joins, $table);
                }
            }
        }
        array_push($joins, $table);
        return $joins;
    }

    protected function buildJoins() {
        $joins = array();
        list($table, $conditions) = each($this->joins['dfac']);
        $joins[] = $this->buildLine($table, $conditions);
        foreach ($this->joinsNeed as $joinName) {
            $joinValue = $this->joins[$joinName];
            list($join, $conditions) = each($joinValue);
            array_push($joins, $this->buildLine($join, $conditions));
        }
        return $joins;
    }

    protected function buildConditions() {
        $conditions = array();
        foreach ($this->conditions as $key => $value) {
            array_push($conditions, $key . " = " . $value);
        }
        return $conditions;
    }

    public abstract function init();

    public function buildSQL() {
        $sql = "SELECT \n";
        $sql.=implode(",\n", $this->buildSelects());
        $sql.="\n";
        //$sql.=implode(",\n", $this->buildConcepts());
        $sql.= "\nFROM $this->mainTable $this->mainTableAlias \n";
        $sql.=implode("\n", $this->buildJoins());
        if (count($this->conditions) != 0) {
            $sql.="\nWHERE \n";
            $sql.=implode(" AND ", $this->buildConditions());
        }
        if (count($this->order) != 0) {
            $sql.="\nORDER BY \n";
            $sql.=implode(",", $this->order);
        }

        //$sql.="\nGROUP BY \n";
        //$sql.=implode(",", $this->buildGroup());
        //$sql.="\nORDER BY \n";
        //$sql.=implode(",", $this->order);
        return $sql;
    }

}
