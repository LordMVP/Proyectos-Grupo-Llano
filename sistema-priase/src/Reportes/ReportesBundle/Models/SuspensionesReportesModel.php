<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of SuspensionesReportesModel
 *
 * @author jpsierra
 */
class SuspensionesReportesModel extends ReportesDefaultModel {
    
    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    
    public function consultarNovedadesSuspension($fechaInicial,$fechaFinal,$tipoSuspension,$novedadSuspension,$tipoUso){
        $sql ="SELECT 
                    rut.rut_ideregistro AS ruta_id,
                    rusu.rusu_rutsecuen AS ruta_secuencia,
                    utuso.uni_nombre1 AS tipo_uso,
                    dsus.dsus_ideregistr AS suscripcion_id,
                    dsus.dsus_pcodigo AS suscripcion_codigo,
                    ter.ter_nomcompleto AS tercero_nombre_completo,
                    pro.pro_direccion as direccion,
                    barrio.barrio_nom AS barrio_nombre,                   
                    unove.uni_nombre1 AS novedad_suspension,
                    ssp.ssp_fecejesuspe AS fecha_suspension,
                    ssp.ssp_realizada AS suspension_realizada,                    
                    utsus.uni_nombre1 AS tipo_suspension,                    
                    umotv.uni_nombre1 AS motivo_suspension,
                    ter.ter_documento AS tercero_documento                   
                FROM syr_susreconex syr
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr
                    INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
                    INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro
                    INNER JOIN uni_unidad unove ON unove.uni_ideregistro = ssp.uni_novsuspen
                    INNER JOIN uni_unidad utsus ON utsus.uni_ideregistro = ssp.uni_tipsuspen
                    INNER JOIN uni_unidad umotv ON umotv.uni_ideregistro = ssp.uni_motsuspen
                    INNER JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr
                    INNER JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro
                    INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                    INNER JOIN barrios barrio ON barrio.barrio_ideregistro = pro.uni_barrio
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = ssp.ter_ejesuspens
                WHERE 
                    ssp.ssp_estado = 'A'
                    AND ssp.ssp_fecejesuspe::DATE BETWEEN :fechaInicial::DATE AND :fechaFinal::DATE AND dsus.uni_tipusosuscr=:tipoUso AND ssp.uni_tipsuspen=:tipoSuspension AND ssp.uni_novsuspen=:novedadSuspension";
        $parametros['fechaInicial']=$fechaInicial;
        $parametros["fechaFinal"]=$fechaFinal;
        $parametros["tipoSuspension"]=$tipoSuspension;
        $parametros["novedadSuspension"]=$novedadSuspension;
        $parametros["tipoUso"]=$tipoUso;
        return $this->executeQuery($sql,$parametros);
        
        
    }
    
    
    public function consultarResumenDiario($empresa, $fecha){
        
        $sql =" WITH trabajo AS (   SELECT 	aa.ure_ideregistro
                                                , uu.cuadrila_cod 
                                                , uu.cuadrilla_codemp
                                                , initcap(c.cuadrilla_nom) cuadrilla_nom
                                                , aa.oda_tabla
                                                ,   (   case 
                                                            when aa.oda_tabla = 'rco_reconexion' then (aa.oda_camporeferencia->>'rco_ideregistro')::INTEGER
                                                            when aa.oda_tabla = 'ssp_suspension' then (aa.oda_camporeferencia->>'ssp_ideregistro')::INTEGER
                                                            else 0
                                                        end ) referencia
                                    FROM    	agau.agau_agenda aa 
                                    INNER JOIN empresas e2 on e2.empresa_cod = aa.agau_empresa 
                                        AND 	e2.empresa_sevemp = :empresa
                                    INNER JOIN 	agau.ure_unidadresponsable uu on uu.ure_ideregistro  = aa.ure_ideregistro 
                                    INNER JOIN 	cuadrillas c on c.cuadrilla_cod = uu.cuadrila_cod 
                                        AND 	c.cuadrilla_codemp = uu.cuadrilla_codemp 
                                        AND 	c.cuadrilla_coddepemp = '06'
                                    WHERE   	aa.uni_proceso = 1678 
                                        AND 	aa.agau_estado in ('A','S') 
                                        AND 	aa.age_fecha::DATE = :fecha::DATE )

                SELECT      ure_ideregistro ure, 
                            cuadrila_cod cuadrilla, 
                            cuadrilla_nom nombre,
                            COUNT(*)::INTEGER total,
                            SUM(cantidad)::INTEGER ejecutadas,
                            (COUNT(*) - SUM(cantidad))::INTEGER pendientes,
                            SUM(fotos) fotos
                FROM 	( 	SELECT 	tb.ure_ideregistro, 
                                        tb.cuadrila_cod, 
                                        tb.cuadrilla_nom,
                                        tb.oda_tabla, 
                                        tb.referencia,
                                        (   CASE
                                                WHEN tb.oda_tabla = 'ssp_suspension' THEN ( SELECT  COUNT(*) cnt_ejecutadas 
                                                                                            FROM    ssp_suspension ss 
                                                                                            WHERE   ss.ssp_ideregistro = tb.referencia
                                                                                                AND ss.ssp_realizada IN ('S','N')
                                                                                                AND tb.oda_tabla = 'ssp_suspension') 

                                                ELSE	(   SELECT  COUNT(*) cnt_ejecutadas 
                                                            FROm    rco_reconexion rr  
                                                            WHERE   rr.rco_ideregistro = tb.referencia
                                                                AND rr.rco_realizada IN ('S','N')
                                                                AND tb.oda_tabla = 'rco_reconexion')
                                            END ) cantidad, 
                                        (   CASE
                                                WHEN tb.oda_tabla = 'ssp_suspension' THEN ( SELECT  (	CASE 
                                                                                                            WHEN COUNT(*) > 0 THEN 1
                                                                                                            ELSE 0 
                                                                                                        END ) cnt_fotos 
                                                                                            FROM    adss_adjsuspension aa  
                                                                                            WHERE   aa.ssp_ideregistro = tb.referencia) 

                                                ELSE	(   SELECT  (	CASE 
                                                                            WHEN COUNT(*) > 0 THEN 1
                                                                            ELSE 0 
                                                                        END ) cnt_fotos
                                                            FROM    adrc_adjreconexion aa   
                                                            WHERE   aa.rco_ideregistro = tb.referencia)
                                            END ) fotos	  
                                FROM    trabajo	tb ) resumen 
                GROUP BY    ure_ideregistro, 
                            cuadrila_cod, 
                            cuadrilla_nom
                ORDER BY    cuadrilla_nom;";
        
        $parametros['empresa']  = $empresa;
        $parametros["fecha"]    = $fecha;
        return $this->executeQuery($sql,$parametros);
        
    }
    
    public function consultarDetalleDiario($empresa, $fecha, $ure){
        
        $sql =" WITH trabajo AS (   SELECT 	aa.ure_ideregistro
                                                , uu.cuadrila_cod 
                                                , uu.cuadrilla_codemp
                                                , initcap(c.cuadrilla_nom) cuadrilla_nom
                                                , aa.oda_tabla
                                                ,   (   CASE 
                                                            WHEN aa.oda_tabla = 'rco_reconexion' THEN (aa.oda_camporeferencia->>'rco_ideregistro')::INTEGER
                                                            WHEN aa.oda_tabla = 'ssp_suspension' THEN (aa.oda_camporeferencia->>'ssp_ideregistro')::INTEGER
                                                            ELSE 0
                                                        END ) referencia
                                    FROM    	agau.agau_agenda aa 
                                    INNER JOIN 	empresas e2 ON e2.empresa_cod = aa.agau_empresa 
                                        AND 	e2.empresa_sevemp = :empresa
                                    INNER JOIN 	agau.ure_unidadresponsable uu on uu.ure_ideregistro  = aa.ure_ideregistro 
                                        AND 	uu.ure_ideregistro = :ure
                                    INNER JOIN 	cuadrillas c on c.cuadrilla_cod = uu.cuadrila_cod 
                                        AND 	c.cuadrilla_codemp = uu.cuadrilla_codemp 
                                        AND 	c.cuadrilla_coddepemp = '06'
                                    WHERE   	aa.uni_proceso = 1678 
                                        AND 	aa.agau_estado in ('A','S') 
                                        AND 	aa.age_fecha::DATE = :fecha::DATE )

                SELECT      'Suspensión' tipo
                            , tbl.referencia referencia
                            , tbl.ure_ideregistro ure
                            , tbl.cuadrila_cod cuadrilla
                            , ssp.ssp_fecinisuspe fec_ini
                            , ssp.ssp_fecfinsuspe fec_fin
                            , 	CASE 
                                    WHEN ssp.ssp_realizada = 'S' THEN 'Ejecutada'
                                    WHEN ssp.ssp_realizada = 'N' THEN 'No Efectiva'
                                    ELSE 'Sin Ejecutar'
                                END realizada
                            , syr.dsus_ideregistr suscripcion
                            , dsus.dsus_pcodigo cod_anterior
                            , ter.ter_nomcompleto tercero
                            , rut.rut_tipo rutacodigo
                            , rusu.rusu_rutsecuen rutasecuencia
                            , uni.uni_nombre1 novedad
                            , pro.pro_idepropieda medidor
                            , pro.pro_direccion direccion
                            , fot.cantidad fotos
                            , ssp.ssp_latitud latitud
                            , ssp.ssp_longitud longitud
                FROM        trabajo tbl
                INNER JOIN  ssp_suspension ssp  on ssp.ssp_ideregistro = tbl.referencia
                inner join  uni_unidad uni on uni.uni_ideregistro = ssp.uni_novsuspen 
                INNER JOIN  syr_susreconex syr on syr.syr_ideregistro = ssp.syr_ideregistro 
                INNER JOIN  dsus_detsuscrip dsus on dsus.dsus_ideregistr  = syr.dsus_ideregistr 
                inner join  pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro 
                INNER JOIN  rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr 
                INNER JOIN  rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro 
                INNER JOIN  ter_tercero ter on ter.ter_ideregistro  = dsus.ter_ideregistro 
                inner join lateral (select  count(*) cantidad
                                    from    adss_adjsuspension adss
                                    where   adss.ssp_ideregistro = ssp.ssp_ideregistro ) fot on true	
                WHERE       tbl.oda_tabla = 'ssp_suspension'

                UNION ALL

                SELECT      'Reconexión' tipo
                            , tbl.referencia referencia
                            , tbl.ure_ideregistro ure
                            , tbl.cuadrila_cod cuadrilla
                            , rco.rco_fecinirecon fec_ini
                            , rco.rco_fecfinrecon fec_fin
                            , CASE 
                                WHEN rco.rco_realizada = 'S' THEN 'Ejecutada'
                                WHEN rco.rco_realizada = 'N' THEN 'No Efectiva'
                                ELSE 'Sin Ejecutar'
                              END realizada
                            , syr.dsus_ideregistr suscripcion
                            , dsus.dsus_pcodigo cod_anterior
                            , ter.ter_nomcompleto tercero
                            , rut.rut_tipo rutacodigo
                            , rusu.rusu_rutsecuen rutasecuencia
                            , uni.uni_nombre1 novedad
                            , pro.pro_idepropieda medidor
                            , pro.pro_direccion direccion
                            , fot.cantidad fotos
                            , rco.rco_latitud latitud
                            , rco.rco_longitud longitud
                FROM        trabajo tbl
                inner join  rco_reconexion rco  on rco.rco_ideregistro = tbl.referencia
                inner join  uni_unidad uni on uni.uni_ideregistro = rco.uni_novreconex  
                inner join  syr_susreconex syr on syr.syr_ideregistro = rco.syr_ideregistro 
                inner join  dsus_detsuscrip dsus on dsus.dsus_ideregistr  = syr.dsus_ideregistr 
                inner join  pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro 
                INNER JOIN  rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr 
                INNER JOIN  rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro 
                inner join  ter_tercero ter on ter.ter_ideregistro  = dsus.ter_ideregistro 
                inner join lateral (select  count(*) cantidad
                                    from    adrc_adjreconexion adrc
                                    where   adrc.rco_ideregistro = rco.rco_ideregistro ) fot on true			
                where       tbl.oda_tabla = 'rco_reconexion';";
        
        $parametros['empresa']  = $empresa;
        $parametros["fecha"]    = $fecha;
        $parametros["ure"]      = $ure;
        
        return $this->executeQuery($sql,$parametros);
        
    }
}
