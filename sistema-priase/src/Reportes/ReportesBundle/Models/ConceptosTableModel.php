<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of ContratosTableModel
 *
 * @author jpsierra
 */
class ConceptosTableModel extends ReportesDefaultModel {

    protected $columns = array();
    
//put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->init();
    }
    
    public function init(){
        $this->columns = array();
        array_push($this->columns, array("field"=>"liquidacion_nombre","title"=>"Liquidacion","show"=>true,"width"=>30));
        array_push($this->columns, array("field"=>"concepto_codigo","title"=>"Codigo","show"=>false,"width"=>50));
        array_push($this->columns, array("field"=>"concepto_nombre","title"=>"Concepto","show"=>true,"width"=>10));        
        array_push($this->columns, array("field"=>"concepto_interes","title"=>"Interes","show"=>true,"width"=>10));        
        $this->columns;
    }

    public function consultaPrincipal($page = 1, $count = 10, $extra = null) {
        $condiciones=array();
        $parametros = array();
        if($extra!=null){
            foreach ($extra as $key=>$value){
                if($value!=null){
                    array_push($condiciones,"%%".$key."%% ilike :".$key);
                    $parametros["$key"] = "%".$value."%";
                }
            }            
        }
        $condicion = count($condiciones)==0?"WHERE con.con_operacion = 'S' AND coli.coli_imprimir = 'S'":" WHERE con.con_operacion = 'S' AND con.con_intfinanciacion = 'N' AND coli.coli_imprimir = 'S' AND ".  implode(" AND ", $condiciones);        
        
        $sql = "SELECT DISTINCT  
                    liq.liq_nombre AS liquidacion_nombre,
                    con.uni_concepto AS concepto_codigo,
                    con.con_nombre AS concepto_nombre,
                    con.con_intfinanciacion AS concepto_interes
                FROM core_conrelacio core
                    INNER JOIN coli_conliquida coli ON coli.uni_concepto = core.uni_concepto
                    INNER JOIN con_concepto con ON con.uni_concepto = core.uni_conrelacion
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = coli.uni_liquidacion
                $condicion
                ORDER BY liquidacion_nombre OFFSET :offset LIMIT :limit";
        
         $sqlCount = "SELECT COUNT(*) as total FROM (SELECT DISTINCT  
                    liq.liq_nombre AS liquidacion_nombre,
                    con.uni_concepto AS concepto_codigo,
                    con.con_nombre AS concepto_nombre,
                    con.con_intfinanciacion AS concepto_interes
                FROM core_conrelacio core
                    INNER JOIN coli_conliquida coli ON coli.uni_concepto = core.uni_concepto
                    INNER JOIN con_concepto con ON con.uni_concepto = core.uni_conrelacion
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = coli.uni_liquidacion
                $condicion
                ORDER BY liquidacion_nombre) AS tmp";
        
       
        $matches = array();
        $columnsRefs = $this->parseColumnsNames($sql);
        preg_match_all("/%%([\w]+)%%/",$sql,$matches);
        for($i=0;$i<count($matches[0]);$i++){
            $sql = str_replace($matches[0][$i],$columnsRefs[$matches[1][$i]], $sql);
        }
        
        $columnsRefs = $this->parseColumnsNames($sqlCount);
        preg_match_all("/%%([\w]+)%%/",$sqlCount,$matches);
        for($i=0;$i<count($matches[0]);$i++){
            $sqlCount = str_replace($matches[0][$i],$columnsRefs[$matches[1][$i]], $sqlCount);
        }
        
        $parametros['offset'] = ($page - 1) * $count;
        $parametros['limit'] = $count;
        $resultado['data']=$this->executeQuery($sql, $parametros);
        $resultado['total']=count($condiciones)==0?$this->countAll():$this->executeQuery($sqlCount, $parametros)[0]['total'];
        return $resultado;
    }

    public function countAll() {
        $sql = "SELECT COUNT(*) as total FROM (SELECT DISTINCT 
                    liq.liq_nombre,
                    con.uni_concepto,
                    con.con_nombre
                FROM core_conrelacio core
                    INNER JOIN coli_conliquida coli ON coli.uni_concepto = core.uni_concepto
                    INNER JOIN con_concepto con ON con.uni_concepto = core.uni_conrelacion
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = coli.uni_liquidacion
                WHERE con.con_operacion = 'S'  AND coli.coli_imprimir = 'S'
                ORDER BY liq_nombre) as tmp";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['total'];
        }

    private function parseColumnsNames($sql) {
        $concidencias = array();
        $columns = array();
        preg_match_all("/([\w\.]+)\sAS\s([\w]+)/", $sql, $concidencias);
        for ($i = 0; $i < count($concidencias[0]); $i++) {
            $columns[$concidencias[2][$i]] = $concidencias[1][$i];
        }
        return $columns;
    }
    
    public function getColumns(){
        return $this->columns;
    }

}
