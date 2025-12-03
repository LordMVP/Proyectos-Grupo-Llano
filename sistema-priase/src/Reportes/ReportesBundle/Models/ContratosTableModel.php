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
class ContratosTableModel extends ReportesDefaultModel {

    protected $columns = array();
    
//put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->init();
    }
    
    public function init(){
        $this->columns = array();
        array_push($this->columns, array("field"=>"numero_orden","title"=>"Orden","show"=>true,"width"=>5));
        array_push($this->columns, array("field"=>"constructora_id","title"=>"Documento","show"=>true,"width"=>10));
        array_push($this->columns, array("field"=>"constructora","title"=>"Constructora","show"=>true,"width"=>40));
        array_push($this->columns, array("field"=>"contrato","title"=>"Contrato","show"=>true,"width"=>10));
        array_push($this->columns, array("field"=>"barrio","title"=>"Barrio","show"=>true,"width"=>20));
        $this->columns;
    }

    public function consultaPrincipal($page = 1, $count = 10, $extra = null) {
        $condiciones=array();
        $parametros = array();
        if($extra!=null){
            foreach ($extra as $key=>$value){
                if($value!=null){
                    array_push($condiciones,"%%".$key."%% = :".$key);
                    $parametros["$key"] = $value;
                }
            }            
        }
        $condicion = count($condiciones)==0?"":" WHERE ".  implode(" AND ", $condiciones);        
        $sql = "SELECT
                    gco.gco_ideregistro AS numero_orden,
                    munproye.proyecto_nom AS municipio,
                    tergco.ter_documento AS documento,
                    tergco.ter_ideregistro AS constructora_id,
                    tergco.ter_nomcompleto AS constructora,
                    gco.gco_numcontrato AS contrato,
                    barrio.barrio_nom AS barrio,
                    gco.gco_fecinicio::DATE AS fecha_inicio
            FROM gco_gesconstruc gco
                INNER JOIN ter_tercero tergco ON tergco.ter_ideregistro = gco.ter_ideregistro
                INNER JOIN proyectos munproye ON munproye.proyecto_ideregistro = gco.uni_municipio
                INNER JOIN barrios barrio ON barrio.barrio_ideregistro = gco.uni_barrio
                $condicion
                ORDER BY numero_orden DESC
                OFFSET :offset LIMIT :limit";
        $matches = array();
        $columnsRefs = $this->parseColumnsNames($sql);
        preg_match_all("/%%([\w]+)%%/",$sql,$matches);
        for($i=0;$i<count($matches[0]);$i++){
            $sql = str_replace($matches[0][$i],$columnsRefs[$matches[1][$i]], $sql);
        }
        $parametros['offset'] = ($page - 1) * $count;
        $parametros['limit'] = $count;
        $resultado['data']=$this->executeQuery($sql, $parametros);
        $resultado['total']=$condicion===""?$this->countAll():count($resultado['data']);
        return $resultado;
    }

    public function countAll() {
        $sql = "SELECT COUNT(*) AS total FROM gco_gesconstruc gco";
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
