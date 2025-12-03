<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\ModelReport;

/**
 * Description of FacturacionBuildModel
 *
 * @author jpsierra
 */
class FacturacionBuildModel extends SQLBuilderReport {

    //put your code here
    public function init() {
        $this->tables = array();
        $this->joins = array();
        $this->mainTable = "fac_factura";
        $this->mainTableAlias = "fac";
        $this->joins["dfac"] = array("[><]dfac_detfactura(dfac)" => "fac_ideregistro");
        $this->joins["dsus"] = array("[><]dsus_detsuscrip(dsus)" => "dsus_ideregistr");
        $this->joins["concepto"] = array("[><]uni_unidad(concepto)" => ["uni_ideregistro" => "dfac.uni_concepto"]);
        $this->joins["ter"] = array("[><]ter_tercero(ter)" => "ter_ideregistro");
        $this->joins["utuso"] = array("[><]uni_unidad(utuso)" => ["uni_ideregistro" => "dsus.uni_tipusosuscr"]);
        $this->joins["proy"] = array("[><]proyectos(proy)" => ["proyecto_ideregistro" => "dsus.uni_municipio"]);
        $this->joins["pro"] = array("[><]pro_propiedad(pro)" => ["pro_ideregistro" => "dsus.pro_ideregistro"]);
        $this->joins["rusu"] = array("[><]rusu_rutsuscrip(rusu)" => ["dsus_ideregistr" => "dsus.dsus_ideregistr"]);
        $this->joins["rut"] = array("[><]rut_ruta(rut)" => ["rut_ideregistro" => "rusu.rut_ideregistro"]);
        $this->joins["lec"] = array("[><]lec_lectura(lec)" => ["dsus_ideregistr", "per_ideregistro", "cic_ano", "cic_ideregistro"]);
        $this->joins["barrio"] = array("[><]barrios(barrio)" => ["barrio_ideregistro" => "pro.uni_barrio"]);
        $this->joins["promuni"] = array("[><]proyectos(promuni)" => ["proyecto_ideregistro" => "pro.uni_municipio"]);


        $this->columns["fac.fac_ideregistro"] = array("label" => "factura_id");
        $this->columns["proy.proyecto_ideregistro"] = array("label" => "proyecto_id");
        $this->columns["proy.proyecto_nom"] = "proyecto_nombre";
        //$this->columns["pro.pro_idepropieda"] = "numero_medidor";
        $this->columns["utuso.uni_ideregistro"] = "tipo_uso_id";
        $this->columns["utuso.uni_nombre1"] = "tipo_uso_nombre";
        //$this->columns["dsus.pro_catestrato"] = "suscripcion_estrato";
        //$this->columns["dsus.dsus_ideregistr"] = "suscripcion_id";
        $this->columns["ter.ter_nomcompleto"] = "tercero_nombre_completo";
        $this->columns["lec.lec_actual"] = "lectura_actual";
        $this->columns["lec.lec_anterior"] = "lectura_anterior";
        $this->columns["lec.lec_consumo"] = "mts_consumo";
        $this->columns["lec.dsus_factor"] = "factor_correcion";
        $this->columns["0"] = "consumo_cobrar";
        
        //$this->columns["rut.rut_nombre"] = "ruta_nombre";
        //$this->columns["barrio.barrio_nom"] = "barrio_nombre";
        //$this->columns["promuni.proyecto_nom"] = "propiedad_municipio";
        //$this->columns["promuni.proyecto_nom"] = "propiedad_municipio";
        $this->columns["now()"] = "fecha_actual";

        $this->allColumns["proy.proyecto_ideregistro"] = array("label" => "proyecto_id");
        $this->allColumns["proy.proyecto_nom"] = "proyecto_nombre";
        $this->allColumns["pro.pro_idepropieda"] = "numero_medidor";
        $this->allColumns["utuso.uni_ideregistro"] = "tipo_uso_id";
        $this->allColumns["utuso.uni_nombre1"] = "tipo_uso_nombre";
        $this->allColumns["dsus.pro_catestrato"] = "suscripcion_estrato";
        $this->allColumns["dsus.dsus_ideregistr"] = "suscripcion_id";
        $this->allColumns["ter.ter_nomcompleto"] = "tercero_nombre_completo";
        $this->allColumns["rut.rut_nombre"] = "ruta_nombre";
        $this->allColumns["barrio.barrio_nom"] = "barrio_nombre";
        $this->allColumns["promuni.proyecto_nom"] = "propiedad_municipio";
        $this->allColumns["now()"] = "fecha_actual";


        $this->concepts[33] = array('label' => '(D) Metros Alargue Residencial', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[34] = array('label' => 'Lectura', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[35] = array('label' => '(D) Consumo Metros', 'function' => 'COUNT', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[36] = array('label' => '(D) Subsidio Gas', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[37] = array('label' => 'XXXXXX', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[38] = array('label' => '(D) Interes Corriente', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[39] = array('label' => 'XXXXXX', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[40] = array('label' => '(D) Interes Moratorio', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[41] = array('label' => 'Tarifa Basica', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[42] = array('label' => '(D) Valor Consumo Gas', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[43] = array('label' => 'XXXXXX', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[44] = array('label' => 'Estrato', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[45] = array('label' => 'Descuento por error', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[46] = array('label' => '(D) Factor Correcion', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');
        $this->concepts[47] = array('label' => 'Consumo por lectura', 'function' => 'SUM', 'column' => 'dfac.uni_concepto', 'columnValue' => 'dfac.dfac_vlrreal');

       // $this->conditions['dsus.uni_tipusosuscr'] = 5;
        $this->order = ["proyecto_nombre", "tipo_uso_nombre", "tercero_nombre_completo"];
    }

    private function buildConcepts() {
        $concepts = array();
        foreach ($this->concepts as $key => $value) {
            $concepts[] = "COALESCE(" . $value['function'] . "(CASE WHEN " . $value['column'] . "=" . $key . " THEN " . $value['columnValue'] . " END),0) AS " . $this->sanitizeLabel($value['label']);
        }
        return $concepts;
    }

    public function buildSQL() {
        $sql = "SELECT \n";
        $sql.=implode(",\n", $this->buildSelects());
        $sql.=",\n";
        $sql.=implode(",\n", $this->buildConcepts());
        $sql.= "\nFROM $this->mainTable $this->mainTableAlias \n";
        $sql.=implode("\n", $this->buildJoins());
        //$sql.="\nWHERE \n";
        //$sql.=implode(" AND ", $this->buildConditions());
        $sql.="\nGROUP BY \n";
        $sql.=implode(",", $this->buildGroup());
        $sql.="\nORDER BY \n";
        $sql.=implode(",", $this->order);
        return $sql;
    }

}
