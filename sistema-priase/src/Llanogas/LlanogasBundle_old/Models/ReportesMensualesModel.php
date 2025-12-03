<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 *
 * @author maramirez
 */

class ReportesMensualesModel extends AuditoriaServices {
    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    public function consultarReporte($empresa, $reporte) {
        $anno = date("Y",time());
        $mes = date("n",time())-1;
         if($mes == 0){
            $mes = 12;
            $anno = $anno - 1 ;
        }
        print_r("Fecha último Proceso: ");
        print_r(date('d-m-Y h:mm:ss',time()));
        $parametros['empresa'] = $empresa;
        $parametros['reporte'] = $reporte;
        $parametros['anno'] = $anno;
        $parametros['mes'] = $mes;
        $sql = "SELECT * 
                FROM reportes.temp_reportes_periodicos 
                where mes = :mes
                  and anno = :anno 
                  and empresa = :empresa 
                  and reporte = :reporte";

        print_r("\n PASO 0 : Validar si el reporte ya existe en la tabla para el mes en curso");
        return $this->executeQuery($sql, $parametros);
    }
    
    public function insertarReporte($empresa, $reporte){
        $anno = date("Y",time());
        $mes = date("n",time())-1;
        if($mes == 0){
            $mes = 12;
            $anno = $anno - 1 ;
        }
        $complemento="";
        if($reporte=="DETERIORO CARTERA"){
           // $complemento = "WHERE dete.sdo_capital >  1000 ORDER BY dsus_ideregistr, fin_ideregistro, factura";
            $funcion = "fn_deterioro";

            $parametros['empresa'] = $empresa;
            $parametros['reporte'] = $reporte;
            $parametros['anno'] = $anno;
            $parametros['mes'] = $mes;
            $sql = "SELECT reportes.".$funcion."( :empresa , :mes , :anno ); ";
            print_r($sql." parametros: ".$parametros['empresa'].", ".$parametros['reporte'].", ".$parametros['anno'].", ".$parametros['mes']);
            print_r("\n PASO 1 : Inserta Reporte en la tabla temp_reportes_periodicos");
            return $this->executeQuery($sql, $parametros);
        }
        else{
            if($reporte=="FACTURADO VS RECAUDADO FINANCIADO"){
                $funcion = "fn_facvsrec_financiado";
            }
            else{
                $funcion = "fn_facvsrec_nofinanciado";
            }
            $parametros['empresa'] = $empresa;
            $parametros['reporte'] = $reporte;
            $parametros['anno'] = $anno;
            $parametros['mes'] = $mes;
            $sql = "INSERT INTO reportes.temp_reportes_periodicos(mes, anno, reporte, datos, empresa)
                    SELECT :mes as mes, 
                           :anno as anno, 
                           :reporte as reporte,
                           array_to_json(array_agg(row_to_json(dete))) as datos,
                           :empresa as empresa
                    FROM (	SELECT       * 
                            FROM          reportes.".$funcion."( :empresa , :mes , :anno ) dete ".$complemento."
                            ) dete";
            print_r($sql." parametros: ".$parametros['empresa'].", ".$parametros['reporte'].", ".$parametros['anno'].", ".$parametros['mes']);
            print_r("\n PASO 1 : Inserta Reporte en la tabla temp_reportes_periodicos");
            return $this->executeQuery($sql, $parametros);
        }
    }
}

