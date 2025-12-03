<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of DevolucionesTableModel
 *
 * @author jpsierra
 */
class DevolucionesTableModel extends DynamicTableModel {

    //put your code here

    public function __construct(&$conexion = null) {
        parent::__construct($conexion);
    }

    protected function init() {
        $this->columns = array();
        $this->tableName = "fac_factura";
        array_push($this->columns, array("field" => "recaudo_id", "title" => "Recaudo", "show" => true, "width" => 5));
        array_push($this->columns, array("field" => "recaudo_fecha", "title" => "F. Recaudo", "show" => true, "width" => 15));
        array_push($this->columns, array("field" => "tercero_documento", "title" => "Tercero Documento", "show" => true, "width" => 20));
        array_push($this->columns, array("field" => "tercero_nombre", "title" => "Tercero Nombre", "show" => true, "width" => 40));
        array_push($this->columns, array("field" => "recaudo_valor", "title" => "Valor Recaudo", "show" => true, "width" => 20));
        
        $this->defaultConditions = array("doc.doc_tipo"=>"'DV'");
        $this->optionalConditions = array(
            "valorBusqueda"=>"(dsus.dsus_pcodigo = :valorBusqueda OR dsus.dsus_ideregistr = :valorBusqueda)",
            "fechaInicio"=>"rec.rec_fecha BETWEEN :fechaInicio::DATE AND :fechaFinal::DATE"
            );
        //$this->defaultOrder=array("rec.rec_fecha"=>"desc");
        $this->defaultOrder=array("recaudo_fecha"=>"desc");
    }

    protected function getSqlQuery() {
        $sql = "SELECT DISTINCT count(*) OVER() AS total_rows,
                        rec.rec_ideregistro AS recaudo_id, 
                        rec.rec_fecha::DATE AS recaudo_fecha, 
                        rec.sus_ideregistro AS suscriptor_id,
                        rec.uni_documento AS documento_id,
                        doc.doc_nombre AS documento_nombre,
                        ter.ter_documento AS tercero_documento, 
                        ter.ter_nomcompleto AS tercero_nombre,
                        rec.rec_vlrreal AS recaudo_valor,
                        pro.proyecto_nom AS proyecto_nombre,
			dsus.dsus_ideregistr,
			dsus.dsus_pcodigo,
			dsus.emp_ideregistro
                FROM rec_recaudo rec
                    INNER JOIN sus_suscripcion sus ON rec.sus_ideregistro = sus.sus_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro = sus.sus_ideregistro
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = sus.ter_ideregistro
                    INNER JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                    INNER JOIN proyectos pro ON pro.proyecto_ideregistro = rec.uni_municipio
                    --GROUP BY tercero_documento,rec.rec_ideregistro,doc.doc_nombre,ter.ter_nomcompleto,pro.proyecto_nom
                   
                    ";               
        return $sql;
    }

}
