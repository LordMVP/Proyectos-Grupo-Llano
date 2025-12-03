<?php

namespace Reportes\ReportesBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TerceroModel
 *
 * @author lmrubio
 */
class TarifasModel extends ReportesDefaultModel {

    

     public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarTarifasHomlogadas($parametros) {
        $complemento = '' ; 
        if($parametros['mercado']!= -1)
        {
            $complemento = " and vper.varper_codmer = '".$parametros['mercado']."' " ;
        }
        $sql = "SELECT
                mer.mercado_nom mercado,
                con.uni_concepto idconcepto, 
                con.con_nombre concepto ,
                rac.raco_raninicial rangoinicial,
                rac.raco_ranfinal rangofinal ,
                round(rac.raco_valor , 2 ) valorreingenieria,
                th.varper_codvar codvariable,
                var.variable_alias aliasvariable,
                round(th.varper_val , 2 ) valortarifas 

              FROM thvc_variabconcep th
                INNER JOIN variables_periodo vper ON vper.varper_codvar = th.varper_codvar AND vper.varper_codmer = th.varper_codmer
                INNER JOIN raco_ranconcept rac ON rac.raco_ideregistr = th.raco_ideregistr
                INNER JOIN con_concepto con ON con.uni_concepto = th.uni_concepto
                INNER JOIN mercados mer ON mer.mercado_cod = th.varper_codmer
                INNER JOIN variables var ON var.variable_cod = th.varper_codvar
                INNER JOIN empresas emp on empresa_cod = vper.varper_codemp
              WHERE vper.varper_codper ILIKE '" . $parametros['periodo'] . "%' $complemento and emp.empresa_sevemp = :idempresa   order by mer.mercado_cod,th.uni_concepto,rac.raco_raninicial ";
        $resultado = $this->executeQuery($sql,$parametros);
//        print_r($resultado) ;
        return $resultado;
        
    }

    public function consultaPeriodos($parametros) {
        $sql = "SELECT DISTINCT
                    periodo_mes :: INTEGER,
                    periodo_ano :: INTEGER,
                    (periodo_ano || periodo_mes) AS periodo
                  FROM periodos per
                    INNER JOIN empresas empr ON empr.empresa_cod = per.periodo_codemp
                  WHERE empr.empresa_sevemp = :idempresa
                        AND periodo_ano :: INTEGER IN (
                    SELECT DISTINCT periodo_ano :: INTEGER
                    FROM periodos per
                      INNER JOIN empresas empr ON empr.empresa_cod = periodo_codemp
                    WHERE empresa_sevemp = :idempresa
                    ORDER BY periodo_ano :: INTEGER DESC
                    LIMIT 1)
                  ORDER BY periodo_mes :: INTEGER DESC
                  LIMIT 1";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado[0]['periodo'];
    }

    public function consultaMercados($parametros) {
        $sql = "select mercado_cod idmercado,mercado_nom mercado from mercados mer
                    inner join empresas emp on emp.empresa_cod = mer.mercado_codemp
                    where emp.empresa_sevemp = :idempresa";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

}
