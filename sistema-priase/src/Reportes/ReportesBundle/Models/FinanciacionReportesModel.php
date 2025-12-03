<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of FinanciacionReportesModel
 *
 * @author jpsierra
 */
class FinanciacionReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    public function ejecutarSQL($sql){
        return $this->executeQuery($sql);
    }

    public function FinancionesReporte($parametros , $complemento) {
        $sql = "SELECT DISTINCT fin_ideregistro
                FROM reportes.tab_extracto_credito 
                WHERE
                    usu_ideregistro =  :ideusuario
                    AND emp_ideregistro =  :idempresa  
                       $complemento 
                ORDER BY fin_ideregistro ; 
                 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function GenererarFinancionesReporte($parametros ) {
        if ($parametros['idfinanciacion'] != NULL)
        {
            $sql = "SELECT * 
            FROM reportes.gen_extracto_credito_mas(".$parametros['idfinanciacion'] ." , NULL ,  ".$parametros['fechacorte'] ." , ".$parametros['idempresa'] ." , ".$parametros['ideusuario'] ." ) ; ";
        }
        else if  ($parametros['idciclo'] != NULL) 
        {
            $sql = "SELECT * 
            FROM reportes.gen_extracto_credito_mas( NULL , ".$parametros['idciclo'] .",  ".$parametros['fechacorte'] ." , ".$parametros['idempresa'] ." , ".$parametros['ideusuario'] ." ) ; ";
        }
        else
        {
            
            $sql = "SELECT * 
            FROM reportes.gen_extracto_credito_mas( NULL , NULL ,  ".$parametros['fechacorte'] ." , ".$parametros['idempresa'] ." , ".$parametros['ideusuario'] ." ) ; ";
        }
        return $this->executeQuery($sql, $parametros);
    }
    
    public function FinancionesFacturadasPeriodo($parametros, $complemento = " ") {
        $sql = "SELECT DISTINCT fin.fin_ideregistro
                FROM fin_financiacio fin
                INNER JOIN amfi_amofinanci amm ON amm.fin_ideregistro =  fin.fin_ideregistro 
                        AND amfi_estado in ('A' , 'C')
                INNER JOIN liq_liquidacion liqq ON liqq.uni_liquidacion = amm.uni_liquidacion 
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fin.dsus_ideregistr
                INNER JOIN fac_factura facc ON facc.fin_ideregistro =  fin.fin_ideregistro
                        AND facc.fac_ideorigen IS NULL
                INNER JOIN per_periodo prr on prr.per_ideregistro = facc.per_ideregistro
                        AND EXTRACT(YEAR from per_fecfinal) = EXTRACT (YEAR from :fechacorte::DATE )
                        AND EXTRACT(MONTH from per_fecfinal) = EXTRACT (MONTH from :fechacorte::DATE )
                WHERE fin.emp_ideregistro = :idempresa
                        AND fin.fin_fecha::DATE <= :fechacorte::DATE 
                        $complemento
                ORDER BY fin.fin_ideregistro ";

        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Consulta los dias trascurridos desde el final del perido de la ultima liquidacion
     * y si no hay facturas de amortizacion desde la fecha de la financiacion
     * para la liquidacion de interes
     * @param int $idfin  id de la tabla fin_financiacion
     * @return int cantidad de dias  
     */
     public function consultar_dias_interes ($idfin , $fecha_corte) {
        $parametros['id_fin'] = $idfin;
        $parametros['fec_corte'] = $fecha_corte;
        $sql = "
                SELECT finn.fin_ideregistro ,
                    (CASE 
                        WHEN 
                            (prr.per_fecfinal::DATE is not NULL) 
                        THEN 
                            (CASE 
                                WHEN  
                                    (:fec_corte::DATE - prr.per_fecfinal::DATE) > 0 
                                THEN
                                    (:fec_corte::DATE - prr.per_fecfinal::DATE)
                                ELSE 
                                    0
                            END)
                        ELSE 
                            (:fec_corte::DATE - finn.fin_fecha::DATE)
                        END
                    ) as dias_fac
                FROM fin_financiacio finn
                    INNER JOIN amfi_amofinanci amm ON amm.fin_ideregistro =  finn.fin_ideregistro 
                    LEFT JOIN fac_factura fcc on fcc.fin_ideregistro = finn.fin_ideregistro 
                        and fcc.uni_documento = 85  
                    LEFT JOIN per_periodo prr ON prr.per_ideregistro = fcc.per_ideregistro
                WHERE amm.fin_ideregistro =:id_fin and amm.amfi_estado='A' 
                ORDER BY fcc.fac_ideregistro DESC limit 1 ";
        return $this->executeQuery($sql, $parametros)[0]['dias_fac'];
    }
    
    /**
     * Consulta la tasa de interes corriente y si aplica la tasa de interes del iva
     * para la liquidacion de interes
     * @param int $idfinan  id de la tabla fin_finan
     * @return registro con la tasa de interes y la tasa del iva
     */
     public function consultar_tasas_interes ($idfinan) {
        $parametros['if_finan'] = $idfinan;
        $sql = "
                SELECT
                    amm.fin_ideregistro ,
                    (con.con_formula::json->0->>'valor')::NUMERIC(20,7) interes,
                    (CASE 
                        WHEN (LENGTH(cn.con_formula))>0 
                        THEN
                            (cn.con_formula::json->0->>'valor')::NUMERIC(20,7)
                        ELSE
                            0
                    END) tasaivainteres,
                    con.uni_concepto idconceptointeres,
                    COALESCE(cn.uni_concepto,0) idconceptoivainteres
                FROM amfi_amofinanci amm 
                    INNER JOIN fin_financiacio fnn on fnn.fin_ideregistro = amm.fin_ideregistro
                    INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = amm.uni_liquidacion
                        AND liq.liq_venclasific='FI' 
                    INNER JOIN coli_conliquida coli ON liq.uni_liquidacion = coli.uni_liquidacion
                    INNER JOIN con_concepto con ON con.uni_concepto=coli.uni_concepto
                        AND con.con_intfinanciacion='S'
                    INNER JOIN esem_estempresa esem ON liq.est_liquidacion=esem.est_ideregistro
                        AND esem.emp_ideregistro=fnn.emp_ideregistro 
                    LEFT JOIN core_conrelacio core ON con.uni_concepto=core.uni_conrelacion
                    LEFT JOIN con_concepto cn ON cn.uni_concepto=core.uni_concepto
                    WHERE amm.fin_ideregistro =:if_finan and amm.amfi_estado='A'";
        return $this->executeQuery($sql, $parametros)[0];
    }

}
