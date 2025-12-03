<?php

namespace Bioagricola\BioagricolaBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\Models\GenericoModel;


/**
 * Consultas para cargar financioaciones especiales.
 *
 * @author rsagudelo
 */
class ConsultarFinanciacionModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     * @param \Doctrine\DBAL\Connection $sesion
     */
    public function __construct(&$conexion) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
    }
    
    /**
     * Cosulta las financiaciones asociadas a un codigo de Usuario
     * @param array con los datos para la consulta
     * @return array - Listado de Financiaciones del Codigo de Usuario
     */
    public function consultarDatCodUSuario($param) {
        $parametros['idempresa'] = $param['id_empresa'];
        $complemento = " " ;            
        if ($param['id_usuario'] != '' )
        {
            $complemento .= " AND mua_cod =:cod_usu  " ;
            $parametros['cod_usu'] = $param['id_usuario'] ;
        }
        if ($param['id_Finan'] != '' )
        {
            $complemento .= " AND fnn.fin_ideregistro =:id_Finan  " ;
            $parametros['id_Finan'] = $param['id_Finan'] ;
        }
        $sql = " SELECT 
                    mua_cod , 
                    fnn.fin_ideregistro id_fin ,
                    lmf_fac,
                    fin_mesaho ,
                    fin_vlrtotal , 
                    (fin_cambio + fin_camtervar) cam_valor  ,
                    (fin_pagbio + fin_pagterfijo + fin_pagtervar + fin_pagajutervar ) fin_pago ,
                    fin_cuoemitidas ,
                    dfin_numcuotas ,
                    fin_vlrtotal - (fin_cambio + fin_camtervar +
                    fin_pagbio + fin_pagterfijo + fin_pagtervar + fin_pagajutervar ) fin_sdo
                FROM aseo.esp_fin_financiacion fnn 
                INNER JOIN  aseo.esp_dfin_detfinanciacion dff on dff.fin_ideregistro = fnn.fin_ideregistro
			AND dff.dfin_estado = 't'
                where emp_ideregistro =:idempresa AND fnn.fin_estado = 't'  $complemento ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Cosulta los pagos de la financiacion enviada
     * @param array con los datos para la consulta
     * @return array - Listado de pagos de la financiacion 
     */
    public function consultarPagosFinanciaciones ($param) {
        $parametros['id_Finan'] = $param['id_Finan'] ;       
        $sql = "SELECT * 
                FROM aseo.esp_pfin_pagfinanciacion pfnn
                WHERE pfnn.fin_ideregistro =:id_Finan 
                ORDER BY pfin_fechagb ; ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Cosulta las amortizaciones de la financiacion enviada
     * @param array con los datos para la consulta
     * @return array - Listado de pagos de la financiacion 
     */
    public function consultarAmortizacFinanciaciones ($param) {
        $parametros['id_Finan'] = $param['id_Finan'] ;       
        $sql = "SELECT 
                    am_ideregistro ,
                    fin_ideregistro ,	
                    am_vlrtotal ,
                    am_vlrbio ,
                    am_vlrterfij ,
                    am_vlrtervar ,
                    am_vlrteraju ,
                    am_vlrinteres ,
                    (am_cambio + am_camtervar) as cambio ,
                    (am_pagbio + am_pagterfij + am_pagtervar + am_pagteraju + am_paginteres ) as pago , 
                    am_numcuota , 
                    am_sdocuota  ,
                    am_fechagb::DATE 
                FROM aseo.esp_am_amortizacion amm
                WHERE amm.fin_ideregistro =:id_Finan 
                ORDER BY am_fechagb ; ";
        return $this->executeQuery($sql, $parametros);
    }
    /**
     * Cosulta las distribucion de valores para los terceros de la financiacion enviada
     * @param array con los datos para la consulta
     * @return array - Listado de la distribucion de los terceros de la financiacion 
     */
    public function consultarTercerosFinanciaciones ($param) {
        $parametros['id_Finan'] = $param['id_Finan'] ;       
        $sql = "SELECT 
                    ter_nomcompleto as nombre, 
                    apr.afin_vlrfijo as vlr_fijo ,
                    apr.afin_vlrvariable as vlr_vr ,
                    apr.afin_vlrajuste as vlr_ajuste ,
                    apr.afin_camvlr as cambio ,
                    apr.afin_camvlrpago as cam_pag ,
                    (apr.afin_pagvlrfijo +  apr.afin_pagvlrajustes + apr.afin_pagvlrvariable ) as pago ,
                    (apr.afin_sdovlrfijo + apr.afin_sdovlrfijo + apr.afin_sdovlrvariable ) as saldo 
                FROM aseo.esp_afin_aprfinanciacion apr 
                INNER JOIN public.ter_tercero trr on trr.ter_ideregistro = apr.ter_ideregistro 
                WHERE fin_ideregistro =:id_Finan  ";
        return $this->executeQuery($sql, $parametros);
    }
    
    /**
     * Cosulta el resumen de los totales de las financiaciones asociadas a una empresa
     * @param array con los datos para la consulta
     * @return array - Resumen de las Financiaciones de la empresa
     */
    public function consultarTotalesFinanciaciones($param) {
        $parametros['idempresa'] = $param['id_empresa'];       
        $sql = "    SELECT 
                        fin_mesaho mes ,
                        count(mua_cod ) as cantidad , 
                        SUM (fin_vlrtotal) as total ,	
                        sum (COALESCE(fin_cambio,0)  + COALESCE(fin_camtervar,0) ) cam_valor  ,
                        sum (COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)  
                                        + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0) 
                        ) fin_pago ,
                        SUM (COALESCE (fin_cuoemitidas,0)) emitidas ,
                        SUM (COALESCE (dfin_numcuotas,0)) as tot_cuotas ,
                        SUM ((COALESCE (fin_vlrbio, 0) 
                                - COALESCE (fin_cambio, 0) - COALESCE (fin_pagbio, 0)
                            )
                        ) as sdo_bio , 
                        SUM (((   COALESCE (fin_vlraprfijo, 0) + COALESCE (fin_vlraprvar, 0)
                                + COALESCE (fin_vlrajuaprvar, 0) + COALESCE (fin_vlrviatfijo, 0)
                                + COALESCE (fin_vlrviatvar, 0) ) -
                                ( COALESCE (fin_camtervar, 0) + COALESCE (fin_pagterfijo, 0) 
                                + COALESCE (fin_pagtervar, 0)  + COALESCE (fin_pagajutervar, 0))
                               )
                        ) as sdo_terceros , 
                        SUM((COALESCE (fin_vlrtotal,0) - 
                                    (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                                    + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                                    + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0)  
                                    )
                            )
                        )fin_sdo
                    FROM aseo.esp_fin_financiacion fnn 
                        INNER JOIN  aseo.esp_dfin_detfinanciacion dff on dff.fin_ideregistro = fnn.fin_ideregistro
                            AND dff.dfin_estado = 't'
                    WHERE emp_ideregistro =:idempresa
                    GROUP BY mes
                UNION ALL
                    SELECT 
                        'TOTAL' AS mes ,
                        count(mua_cod ) as cantidad , 
                        SUM (fin_vlrtotal) as total ,	
                        sum (COALESCE(fin_cambio,0)  + COALESCE(fin_camtervar,0) ) cam_valor  ,
                        sum (COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)  
                                        + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0) 
                        ) fin_pago ,
                        SUM (COALESCE (fin_cuoemitidas,0)) emitidas ,
                        SUM (COALESCE (dfin_numcuotas,0)) as tot_cuotas ,
                        SUM ((COALESCE (fin_vlrbio, 0) 
                                - COALESCE (fin_cambio, 0) - COALESCE (fin_pagbio, 0)
                            )
                        ) as sdo_bio , 
                        SUM (((   COALESCE (fin_vlraprfijo, 0) + COALESCE (fin_vlraprvar, 0)
                                + COALESCE (fin_vlrajuaprvar, 0) + COALESCE (fin_vlrviatfijo, 0)
                                + COALESCE (fin_vlrviatvar, 0) ) -
                                ( COALESCE (fin_camtervar, 0) + COALESCE (fin_pagterfijo, 0) 
                                + COALESCE (fin_pagtervar, 0)  + COALESCE (fin_pagajutervar, 0))
                               )
                        ) as sdo_terceros , 
                        SUM((COALESCE (fin_vlrtotal,0) - 
                                    (COALESCE(fin_cambio,0) + COALESCE(fin_camtervar,0)
                                    + COALESCE(fin_pagbio,0)  + COALESCE(fin_pagterfijo,0)	
                                    + COALESCE(fin_pagtervar,0)  + COALESCE(fin_pagajutervar,0)  
                                    )
                            )
                        )fin_sdo
                    FROM aseo.esp_fin_financiacion fnn 
                        INNER JOIN  aseo.esp_dfin_detfinanciacion dff on dff.fin_ideregistro = fnn.fin_ideregistro
                            AND dff.dfin_estado = 't'
                    WHERE emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes";
        return $this->executeQuery($sql, $parametros);
    }
     
    /**
     * Cosulta el resumen de las amortizaciones las financiaciones
     * @param array con los datos para la consulta
     * @return array - resumen de las amortizaciones agrupadas por mes
     */
    public function consultarResumenAmortizaciones ($param) {
        $parametros['idempresa'] = $param['id_empresa'];    
        $sql = "    SELECT 
                        fnn.fin_mesaho as mes , 
                        COUNT(am_ideregistro) as tot_emitidas ,
                        SUM(COALESCE(am_vlrtotal, 0)) as total ,
                        SUM(COALESCE(am_vlrbio, 0) 
                             - COALESCE(am_cambio, 0) - COALESCE(am_pagbio, 0)
                        ) as sdo_bio,
                        SUM(  COALESCE(am_vlrterfij, 0)  + COALESCE(am_vlrtervar, 0)
                            + COALESCE(am_vlrteraju, 0) - COALESCE(am_camtervar, 0)
                            - COALESCE(am_pagterfij, 0) - COALESCE(am_pagtervar, 0)
                            - COALESCE(am_pagteraju, 0)
                        ) as sdo_tercero ,
                        SUM(  COALESCE(am_vlrinteres, 0)  - COALESCE(am_paginteres, 0)                          
                        ) as sdo_interes ,
                        SUM(  (COALESCE(am_cambio, 0) + COALESCE(am_camtervar, 0)) 
                           ) 
                         as cambio ,
                        SUM(  COALESCE(am_pagbio, 0) + COALESCE(am_pagterfij, 0)
                            + COALESCE(am_pagtervar, 0) + COALESCE(am_pagteraju, 0)
                            + COALESCE(am_paginteres, 0)
                        ) as pago , 
                        SUM(COALESCE(am_sdocuota, 0)) as sdo  
                    FROM aseo.esp_am_amortizacion amm
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = amm.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa AND fnn.fin_estado = 't'
                    GROUP BY mes 
                UNION ALL
                    SELECT 
                        'TOTAL' as mes , 
                        COUNT(am_ideregistro) as tot_emitidas ,
                        SUM(COALESCE(am_vlrtotal, 0)) as total ,
                        SUM(COALESCE(am_vlrbio, 0) 
                             - COALESCE(am_cambio, 0) - COALESCE(am_pagbio, 0)
                        ) as sdo_bio,
                        SUM(  COALESCE(am_vlrterfij, 0)  + COALESCE(am_vlrtervar, 0)
                            + COALESCE(am_vlrteraju, 0) - COALESCE(am_camtervar, 0)
                            - COALESCE(am_pagterfij, 0) - COALESCE(am_pagtervar, 0)
                            - COALESCE(am_pagteraju, 0)
                        ) as sdo_tercero ,
                        SUM(  COALESCE(am_vlrinteres, 0)  - COALESCE(am_paginteres, 0)                          
                        ) as sdo_interes ,
                        SUM(  (COALESCE(am_cambio, 0) + COALESCE(am_camtervar, 0)) 
                           ) 
                         as cambio ,
                        SUM(  COALESCE(am_pagbio, 0) + COALESCE(am_pagterfij, 0)
                            + COALESCE(am_pagtervar, 0) + COALESCE(am_pagteraju, 0)
                            + COALESCE(am_paginteres, 0)
                        ) as pago , 
                        SUM(COALESCE(am_sdocuota, 0)) as sdo  
                    FROM aseo.esp_am_amortizacion amm
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = amm.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes  ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Cosulta el resumen de los pagos de las financiaciones
     * @param array con los datos para la consulta
     * @return array - resumen de pagos de la financiacion 
     */
    public function consultarResumenPagos ($param) {
        $parametros['idempresa'] = $param['id_empresa'];      
        $sql = "    SELECT
                        fnn.fin_mesaho as mes , 
                        pfin_tippago as tipo ,                       
                        COUNT(pfin_ideregistro) tot_pagos ,
                        SUM(COALESCE(pfin_vlrtotal, 0)) as total ,
                        SUM(COALESCE(pfin_vlrbio, 0)) as total_bio ,
                        SUM(COALESCE(pfin_vlrterfijo, 0)) as total_fijo ,
                        SUM(COALESCE(pfin_vlrtervar, 0)) as total_var ,
                        SUM(COALESCE(pfin_vlrteraju, 0)) as total_ajus ,
                        SUM(COALESCE(pfin_vlrinteres, 0)) as total_interes 
                    FROM aseo.esp_pfin_pagfinanciacion ppf
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = ppf.fin_ideregistro
                    WHERE fnn.emp_ideregistro = :idempresa 
                    GROUP BY mes , tipo 
                UNION ALL
                    SELECT
                        'TOTAL' as mes , 
                        '' as tipo ,                       
                        COUNT(pfin_ideregistro) tot_pagos ,
                        SUM(COALESCE(pfin_vlrtotal, 0)) as total ,
                        SUM(COALESCE(pfin_vlrbio, 0)) as total_bio ,
                        SUM(COALESCE(pfin_vlrterfijo, 0)) as total_fijo ,
                        SUM(COALESCE(pfin_vlrtervar, 0)) as total_var ,
                        SUM(COALESCE(pfin_vlrteraju, 0)) as total_ajus ,
                        SUM(COALESCE(pfin_vlrinteres, 0)) as total_interes 
                    FROM aseo.esp_pfin_pagfinanciacion ppf
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = ppf.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes , tipo  
                 ";
        return $this->executeQuery($sql, $parametros);
    }
    
     /**
     * Cosulta el resumen de la distribucion de terceros de las financiaciones
     * @param array con los datos para la consulta
     * @return array - resumen de la distribucion de terceros de las financiaciones 
     */
    public function consultarResumenTerceros ($param) {
        $parametros['idempresa'] = $param['id_empresa'];   
        $sql = "    SELECT 
                        fnn.fin_mesaho as mes , 
                        ter_nomcompleto as nombre, 
                        SUM (COALESCE (apr.afin_vlrfijo, 0)) as vlr_fijo ,
                        SUM (COALESCE (apr.afin_vlrvariable, 0))  as vlr_vr ,
                        SUM (COALESCE (apr.afin_vlrajuste, 0))  as vlr_ajuste ,
                        SUM (COALESCE (apr.afin_camvlr, 0))  as cambio ,
                        SUM (COALESCE (apr.afin_camvlrpago, 0))  as cam_pag ,
                        SUM (COALESCE (apr.afin_pagvlrfijo, 0) +  COALESCE (apr.afin_pagvlrajustes, 0) 
                                + COALESCE (apr.afin_pagvlrvariable, 0) ) as pago ,
                        SUM (COALESCE (apr.afin_sdovlrfijo, 0) + COALESCE (apr.afin_sdovlrajustes, 0)
                                + COALESCE (apr.afin_sdovlrvariable, 0) ) as saldo 
                    FROM aseo.esp_afin_aprfinanciacion apr 
                        INNER JOIN public.ter_tercero trr on trr.ter_ideregistro = apr.ter_ideregistro 
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = apr.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes , ter_nomcompleto 
                UNION ALL
                    SELECT 
                        fnn.fin_mesaho as mes , 
                        '' as nombre, 
                        SUM (COALESCE (apr.afin_vlrfijo, 0)) as vlr_fijo ,
                        SUM (COALESCE (apr.afin_vlrvariable, 0))  as vlr_vr ,
                        SUM (COALESCE (apr.afin_vlrajuste, 0))  as vlr_ajuste ,
                        SUM (COALESCE (apr.afin_camvlr, 0))  as cambio ,
                        SUM (COALESCE (apr.afin_camvlrpago, 0))  as cam_pag ,
                        SUM (COALESCE (apr.afin_pagvlrfijo, 0) +  COALESCE (apr.afin_pagvlrajustes, 0) 
                            + COALESCE (apr.afin_pagvlrvariable, 0) ) as pago ,
                        SUM (COALESCE (apr.afin_sdovlrfijo, 0) + COALESCE (apr.afin_sdovlrajustes, 0)
                            + COALESCE (apr.afin_sdovlrvariable, 0) ) as saldo 
                    FROM aseo.esp_afin_aprfinanciacion apr 
                        INNER JOIN public.ter_tercero trr on trr.ter_ideregistro = apr.ter_ideregistro 
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = apr.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes , nombre 
                    ORDER BY mes , nombre DESC
                ";
        return $this->executeQuery($sql, $parametros);
    }
     /**
     * Cosulta el resumen de la distribucion de terceros de las financiaciones
     * @param array con los datos para la consulta
     * @return array - resumen de la distribucion de terceros de las financiaciones 
     */
    public function consultarTotalTerceros ($param) {
        $parametros['idempresa'] = $param['id_empresa'];   
        $sql = "    SELECT 
                        '' as mes , 
                        'TOTAL' as nombre, 
                        SUM (COALESCE (apr.afin_vlrfijo, 0)) as vlr_fijo ,
                        SUM (COALESCE (apr.afin_vlrvariable, 0))  as vlr_vr ,
                        SUM (COALESCE (apr.afin_vlrajuste, 0))  as vlr_ajuste ,
                        SUM (COALESCE (apr.afin_camvlr, 0))  as cambio ,
                        SUM (COALESCE (apr.afin_camvlrpago, 0))  as cam_pag ,
                        SUM (COALESCE (apr.afin_pagvlrfijo, 0) +  COALESCE (apr.afin_pagvlrajustes, 0) 
                            + COALESCE (apr.afin_pagvlrvariable, 0) ) as pago ,
                        SUM (COALESCE (apr.afin_sdovlrfijo, 0) + COALESCE (apr.afin_sdovlrajustes, 0)
                            + COALESCE (apr.afin_sdovlrvariable, 0) ) as saldo 
                    FROM aseo.esp_afin_aprfinanciacion apr 
                        INNER JOIN public.ter_tercero trr on trr.ter_ideregistro = apr.ter_ideregistro 
                        INNER JOIN aseo.esp_fin_financiacion fnn ON fnn.fin_ideregistro = apr.fin_ideregistro
                    WHERE fnn.emp_ideregistro =:idempresa  AND fnn.fin_estado = 't'
                    GROUP BY mes , nombre 
                ";
        return $this->executeQuery($sql, $parametros);
    }
}
