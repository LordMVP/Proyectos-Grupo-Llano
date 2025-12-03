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
class FinanciacionesTableModel extends ReportesDefaultModel {

    protected $columns = array();
    
//put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->init();
    }
    
    public function init(){
        $this->columns = array();
        array_push($this->columns, array("field"=>"numero_financiacion","title"=>"Financiacion","show"=>true,"width"=>5));
        array_push($this->columns, array("field"=>"fecha_financiacion","title"=>"Fecha Financiacion","show"=>true,"width"=>20));
        array_push($this->columns, array("field"=>"suscripcion","title"=>"# Suscripcion","show"=>true,"width"=>20));
        array_push($this->columns, array("field"=>"codigo_anterior","title"=>"# Codigo","show"=>true,"width"=>20));
        array_push($this->columns, array("field"=>"tercero_nombre","title"=>"Nombre Tercero","show"=>true,"width"=>60));
        array_push($this->columns, array("field"=>"numero_cuotas","title"=>"# Cuotas","show"=>true,"width"=>5));
        array_push($this->columns, array("field"=>"valor_financiacion","title"=>"Valor Financiacion","show"=>true,"width"=>20));
        
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
        $condicion = count($condiciones)==0?"WHERE fin.fin_estado = 'A'":" WHERE fin.fin_estado = 'A' AND ".  implode(" AND ", $condiciones);        
        $sql = "SELECT 
                    fin.fin_ideregistro AS numero_financiacion,
                    fin.fin_fecha AS fecha_financiacion,
                    amfi.amfi_numcuotas AS numero_cuotas,
                    fin.fin_inicapital AS valor_financiacion,
                    ter.ter_nomcompleto AS tercero_nombre,
                    dsus.dsus_ideregistr AS suscripcion,
                    dsus.dsus_pcodigo AS codigo_anterior
                FROM fin_financiacio fin 
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fin.dsus_ideregistr
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro AND amfi.amfi_estado = 'A'
                $condicion
                ORDER BY numero_financiacion DESC
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
        $resultado['total']=count($condiciones)==0?$this->countAll():count($resultado['data']);
        return $resultado;
    }

    public function countAll() {
        $sql = "SELECT COUNT(*) AS total FROM fin_financiacio fin INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro AND amfi.amfi_estado = 'A' WHERE fin.fin_estado = 'A'";
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
