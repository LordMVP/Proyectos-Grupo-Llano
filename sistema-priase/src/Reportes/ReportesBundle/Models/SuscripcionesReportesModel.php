<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of SuscripcionesReportesModel
 *
 * @author Appfuture
 */
class SuscripcionesReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarSuscipciones($tipoNovedad, $complementoSql, $data) {
        $respuesta = array();
        $complementoFechas = "";
        if (isset($data['fechainicio']) && isset($data['fechafin'])) {
            $complementoFechas .= " AND auds.auds_fecha::DATE BETWEEN :fechainicio AND :fechafin";
        }
        switch ($tipoNovedad) {
            case 'CD': //Cambio 
                if (isset($data['fechainicio']) && isset($data['fechafin'])) {
                    $complementoSql .= " AND aupr.aupr_fecha::DATE BETWEEN :fechainicio AND :fechafin";
                }
                $respuesta = $this->cambioDireccion($complementoSql, $data);
                break;
            case 'R'://Reconexión
                if (isset($data['fechainicio']) && isset($data['fechafin'])) {
                    $complementoSql .= " AND rco.rco_fecha::DATE BETWEEN :fechainicio AND :fechafin";
                }
                $respuesta = $this->reconexionSolicitudUsuario($complementoSql, $data);
                break;
            case 'CTU': //Cambio tipo de uso 
                $complementoSql .= $complementoFechas;
                $respuesta = $this->tipoUso($complementoSql, $data);
                break;
            case 'ST_SR': //Suspensión temporal y remodelación
                $complementoSql .= $complementoFechas;
                $respuesta = $this->suspencionTemporalRemodelacion($complementoSql, $data);
                break;
            case 'CE'://Cambio de estrato
                $complementoSql .= $complementoFechas;
                $respuesta = $this->cambioEstato($complementoSql, $data);
                break;
            case 'CEI'://Cambio de extrato ICBF
                if (isset($data['fechainicio']) && isset($data['fechafin'])) {
                    $complementoSql .= " AND aucs.aucs_fecha::DATE BETWEEN :fechainicio AND :fechafin";
                }
                $respuesta = $this->cambioEstatoICBF($complementoSql, $data);
                break;
            case 'C': //Contribución
                if (isset($data['fechainicio']) && isset($data['fechafin'])) {
                    $complementoSql .= " AND aucs.aucs_fecha::DATE BETWEEN :fechainicio AND :fechafin";
                }
                $respuesta = $this->extencionContribucion($complementoSql, $data);
                break;
            case 'CM'://Cambio de medidor
                if (isset($data['fechainicio']) && isset($data['fechafin'])) {
                    $complementoSql .= " AND aupr.aupr_fecha::DATE BETWEEN :fechainicio AND :fechafin";
                }
                $respuesta = $this->cambioMedidor($complementoSql, $data);
                break;
        }
        return $respuesta;
    }

    private function cambioDireccion($complementoSql, $data) {
        $sql = "SELECT  aupr.aupr_fecha::DATE fecha 
        ,dsus.dsus_ideregistr idsuscripcion
        ,dsus.dsus_pcodigo codigoanterior
        ,(SELECT ter.ter_nomcompleto
          FROM ter_tercero ter
          WHERE
          ter.ter_ideregistro = (aupr.aupr_infnueva :: json ->> 'ter_ideregistro') :: BIGINT
        )usuario
        ,aupr.aupr_infanterior::json->>'pro_direccion'  direccionanterior  
        ,barrioAnterior.barrio_nom barrioanterior 
        ,aupr.aupr_infnueva::json->>'pro_direccion' direccionactual
        ,barrioActual.barrio_nom  barrioactual	
        , usu.usuario_nom funcionario
        FROM aupr_audpropiedad aupr
        INNER JOIN proyectos proyectosAnterior ON proyectosAnterior.proyecto_ideregistro = (aupr.aupr_infanterior::json->>'uni_municipio')::INTEGER
        INNER JOIN barrios  barrioAnterior ON barrioAnterior.barrio_ideregistro = (aupr.aupr_infanterior::json->>'uni_barrio')::INTEGER AND barrioAnterior.barrio_codpro = proyectosAnterior.proyecto_cod
        INNER JOIN proyectos proyectosActual ON proyectosActual.proyecto_ideregistro = (aupr.aupr_infnueva::json->>'uni_municipio')::INTEGER
        INNER JOIN barrios  barrioActual ON barrioActual.barrio_ideregistro = (aupr.aupr_infnueva::json->>'uni_barrio')::INTEGER  AND barrioActual.barrio_codpro = proyectosActual.proyecto_cod
        INNER JOIN dsus_detsuscrip dsus ON aupr.aupr_campo = dsus.pro_ideregistro
        INNER JOIN usuarios usu ON usu.usu_ideregistro=aupr.usu_ideregistro
        WHERE aupr_opecrud = 'UPDATE' 
        AND ((aupr_infanterior::json->>'pro_direccion')::CHARACTER VARYING  <> 
        (aupr_infnueva::json->>'pro_direccion' )::CHARACTER VARYING OR (aupr_infanterior::json->>'uni_barrio')::CHARACTER VARYING  <> 
        (aupr_infnueva::json->>'uni_barrio' )::CHARACTER VARYING  ) " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

    private function suspencionTemporalRemodelacion($complementoSql, $data) {
        $sql = "SELECT  auds.auds_fecha::DATE fecha
        ,dsus.dsus_ideregistr idsuscripcion
        ,dsus.dsus_pcodigo codigoanterior
        ,(SELECT ter.ter_nomcompleto  FROM ter_tercero ter
          WHERE ter.ter_ideregistro = (auds.auds_infnueva :: json ->> 'ter_ideregistro') :: BIGINT )usuario
        ,CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                    FROM aupr_audpropiedad aupr
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN  (SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                   FROM aupr_audpropiedad aupr
                   WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                   ORDER BY aupr.aupr_fecha DESC
                   LIMIT 1)  ELSE pro.pro_direccion END direccion  --revisar
        ,CASE WHEN ((SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN  (SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) ELSE (SELECT barrios.barrio_nom
                  FROM barrios  WHERE barrios.barrio_ideregistro = dsus.uni_barrio ) END barrio --revisar
        ,(CASE WHEN  (auds.auds_infnueva::json->>'dsus_estado')::CHARACTER VARYING  = 'U'  THEN 'Suspensión Usuario' 
	                   WHEN  (auds.auds_infnueva::json->>'dsus_estado')::CHARACTER VARYING  = 'R'  THEN 'Suspensión Remodelación' END )   tiposuspencion
        ,(CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1) IS NOT NULL ) 
              THEN 
                    ( SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1)  ELSE pro.pro_idepropieda  END ) medidor  --revisar
			, usu.usuario_nom funcionario
        FROM dsus_detsuscrip dsus
        INNER JOIN pro_propiedad pro ON pro.pro_ideregistro =  dsus.pro_ideregistro   
        INNER JOIN auds_auddetsuscrip auds ON auds.auds_campo = dsus.dsus_ideregistr
	INNER JOIN usuarios usu ON usu.usu_ideregistro = auds.usu_ideregistro
        WHERE auds.auds_opecrud = 'UPDATE' 
        AND (auds.auds_infnueva::json->>'dsus_estado')::CHARACTER VARYING IN ('U','R')
        AND (auds.auds_infanterior::json->>'dsus_estado') <> (auds.auds_infnueva::json->>'dsus_estado') " . $complementoSql;

        return $this->executeQuery($sql, $data);
    }

    private function reconexionSolicitudUsuario($complementoSql, $data) {
        $sql = " SELECT DISTINCT rco.rco_fecha::DATE fecha
        ,dsus.dsus_ideregistr idsuscripcion
        ,dsus.dsus_pcodigo codigoanterior
        , (SELECT ter.ter_nomcompleto 
           FROM ter_tercero ter INNER JOIN auds_auddetsuscrip auds ON ter.ter_ideregistro=(auds.auds_infnueva::json->>'ter_ideregistro')::BIGINT
           WHERE  auds.auds_fecha <= rco.rco_fecha AND auds.auds_campo=dsus.dsus_ideregistr
           ORDER BY auds.auds_fecha DESC LIMIT 1
        ) usuario --revisar
        , CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                    FROM aupr_audpropiedad aupr
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                  (SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                   FROM aupr_audpropiedad aupr
                   WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                   ORDER BY aupr.aupr_fecha DESC
                   LIMIT 1)
            ELSE pro.pro_direccion END direccion --revisar
        ,CASE WHEN ((SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                   (SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1)
            ELSE (SELECT barrios.barrio_nom
                  FROM barrios
                  WHERE barrios.barrio_ideregistro = dsus.uni_barrio
                  )
            END barrio  --revisar
	, norx.norx_nombre novedad
	, (CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1) IS NOT NULL ) 
              THEN 
                    ( SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= rco.rco_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1)
              ELSE
                        pro.pro_idepropieda
              END ) medidor  --revisar
         , usu.usuario_nom funcionario 
        FROM dsus_detsuscrip dsus
        INNER JOIN pro_propiedad pro ON pro.pro_ideregistro =  dsus.pro_ideregistro   
	      INNER JOIN syr_susreconex syr  ON syr.dsus_ideregistr = dsus.dsus_ideregistr 
	      INNER JOIN rco_reconexion rco ON rco.syr_ideregistro = syr.syr_ideregistro
	      INNER JOIN norx_novreconex norx ON norx.uni_novreconex = rco.uni_novreconex
        INNER JOIN usuarios usu ON usu.usu_ideregistro = rco.usu_ideregistro
       WHERE rco.rco_realizada = 'S' AND  rco.uni_novreconex IN (1043) " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

    private function cambioEstato($complementoSql, $data) {
        $sql = "SELECT  auds.auds_fecha::DATE fecha
        ,dsus.dsus_ideregistr idsuscripcion
        ,dsus.dsus_pcodigo codigoanterior
        , (SELECT ter.ter_nomcompleto FROM ter_tercero ter
          WHERE ter.ter_ideregistro = (auds.auds_infnueva :: json ->> 'ter_ideregistro') :: BIGINT
        ) usuario --revisar
        ,(auds.auds_infanterior::json->>'pro_catestrato')::CHARACTER VARYING estratoanterior 
        ,(auds.auds_infnueva::json->>'pro_catestrato')::CHARACTER VARYING estratonuevo
        ,usu.usuario_nom funcionario 
        FROM auds_auddetsuscrip auds
        INNER JOIN dsus_detsuscrip dsus ON  dsus.dsus_ideregistr = auds.auds_campo
        INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
         INNER JOIN usuarios usu ON usu.usu_ideregistro = auds.usu_ideregistro
        WHERE auds.auds_opecrud = 'UPDATE' 
        AND (auds.auds_infanterior::json->>'pro_catestrato')::CHARACTER VARYING <> 
	(auds.auds_infnueva::json->>'pro_catestrato')::CHARACTER VARYING " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

    private function cambioEstatoICBF($complementoSql, $data) {
        $sql = "SELECT  (CASE WHEN  aucs.aucs_opecrud ='DELETE' THEN (aucs.aucs_infanterior::json->>'cosu_fecinicio')::DATE
                        WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' )  THEN (aucs.aucs_infnueva::json->>'cosu_fecinicio')::DATE  END   ) fechainicio
       ,(CASE WHEN  aucs.aucs_opecrud ='DELETE' THEN (aucs.aucs_infanterior::json->>'cosu_fecfinal')::DATE
              WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' )  THEN (aucs.aucs_infnueva::json->>'cosu_fecfinal')::DATE  END     ) fechafin
       ,dsus.dsus_ideregistr idsuscripcion
       ,dsus.dsus_pcodigo codigoanterior 
       ,(CASE WHEN  aucs.aucs_opecrud ='DELETE' THEN(SELECT ter.ter_nomcompleto 
                FROM auds_auddetsuscrip auds INNER JOIN ter_tercero ter ON ter.ter_ideregistro = (auds.auds_infnueva :: json->>'ter_ideregistro')::BIGINT
                WHERE auds.auds_campo = (aucs.aucs_infanterior :: json->>'dsus_ideregistr') ::BIGINT  AND auds.auds_fecha <= aucs.aucs_fecha 
                ORDER BY auds.auds_fecha DESC LIMIT 1)
            WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' )	THEN (SELECT ter.ter_nomcompleto
		FROM auds_auddetsuscrip auds  INNER JOIN ter_tercero ter ON ter.ter_ideregistro = (auds.auds_infnueva :: json->>'ter_ideregistro')::BIGINT
		WHERE auds.auds_campo = (aucs.aucs_infnueva :: json->>'dsus_ideregistr') ::BIGINT AND auds.auds_fecha <= aucs.aucs_fecha 
		ORDER BY auds.auds_fecha DESC LIMIT 1) END)   usuario
       ,(CASE WHEN   (aucs.aucs_opecrud ='DELETE' OR aucs.aucs_opecrud ='UPDATE') THEN '1'
              WHEN aucs.aucs_opecrud ='INSERT'   THEN  (SELECT auds.auds_infnueva :: json->>'pro_catestrato' FROM auds_auddetsuscrip auds 
                    WHERE auds.auds_campo = (aucs.aucs_infnueva :: json->>'dsus_ideregistr') ::BIGINT AND auds.auds_fecha <= aucs.aucs_fecha 
		ORDER BY auds.auds_fecha DESC LIMIT 1)   END   ) estratoanterior  
       ,(CASE WHEN aucs.aucs_opecrud ='DELETE'  THEN   (SELECT auds.auds_infnueva :: json->>'pro_catestrato' FROM auds_auddetsuscrip auds 
				WHERE auds.auds_campo = (aucs.aucs_infanterior :: json->>'dsus_ideregistr') ::BIGINT AND auds.auds_fecha <= aucs.aucs_fecha 
				ORDER BY auds.auds_fecha DESC LIMIT 1)
				WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' ) 	THEN '1'  END   ) estratonuevo
        ,usu.usuario_nom funcionario
            FROM aucs_audconsuscrip aucs
            INNER JOIN dsus_detsuscrip dsus 
            ON dsus.dsus_ideregistr = (CASE WHEN  ((aucs.aucs_infanterior= '') OR  (aucs.aucs_infanterior IS NULL))
                                        THEN (aucs.aucs_infnueva::json->>'dsus_ideregistr')::BIGINT 
					ELSE (aucs.aucs_infanterior::json->>'dsus_ideregistr')::BIGINT END   )
            INNER JOIN usuarios usu ON usu.usu_ideregistro = aucs.usu_ideregistro
            WHERE  (CASE WHEN ((aucs.aucs_infanterior= '') OR  (aucs.aucs_infanterior IS NULL))
		THEN (aucs.aucs_infnueva::json->>'uni_concepto')::BIGINT 
		ELSE (aucs.aucs_infanterior::json->>'uni_concepto')::BIGINT END   ) = 639 " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

    private function extencionContribucion($complementoSql, $data) {
        $sql = "SELECT  (CASE WHEN  aucs.aucs_opecrud ='DELETE' THEN (aucs.aucs_infanterior::json->>'cosu_fecinicio')::DATE
                        WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' )  THEN (aucs.aucs_infnueva::json->>'cosu_fecinicio')::DATE  END   ) fechainicio
       ,(CASE WHEN  aucs.aucs_opecrud ='DELETE' THEN (aucs.aucs_infanterior::json->>'cosu_fecfinal')::DATE
              WHEN  (aucs.aucs_opecrud ='INSERT' OR aucs.aucs_opecrud ='UPDATE' )  THEN (aucs.aucs_infnueva::json->>'cosu_fecfinal')::DATE  END     ) fechafin
            ,dsus.dsus_ideregistr idsuscripcion
            ,dsus.dsus_pcodigo codigoanterior  
            , (SELECT ter.ter_nomcompleto 
                       FROM ter_tercero ter INNER JOIN auds_auddetsuscrip auds ON ter.ter_ideregistro=(auds.auds_infnueva::json->>'ter_ideregistro')::BIGINT
                       WHERE  auds.auds_fecha <= aucs.aucs_fecha AND auds.auds_campo=dsus.dsus_ideregistr
                       ORDER BY auds.auds_fecha DESC LIMIT 1
                    ) usuario --revisar
                        ,CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                    FROM aupr_audpropiedad aupr
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <=  aucs.aucs_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                  (SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                   FROM aupr_audpropiedad aupr
                   WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <=  aucs.aucs_fecha
                   ORDER BY aupr.aupr_fecha DESC
                   LIMIT 1)
            ELSE pro.pro_direccion END direccion --revisar
           ,CASE WHEN ((SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <=  aucs.aucs_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                   (SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= aucs.aucs_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1)
            ELSE (SELECT barrios.barrio_nom
                  FROM barrios
                  WHERE barrios.barrio_ideregistro = dsus.uni_barrio
                  )
            END barrio  --revisar
            ,usu.usuario_nom funcionario ,
            aucs.aucs_opecrud
            FROM 
            aucs_audconsuscrip aucs 
            INNER JOIN dsus_detsuscrip dsus 
            ON dsus.dsus_ideregistr = (CASE WHEN ((aucs.aucs_infanterior= '') OR  (aucs.aucs_infanterior IS NULL))
                                            THEN (aucs.aucs_infnueva::json->>'dsus_ideregistr')::BIGINT 
                                            ELSE (aucs.aucs_infanterior::json->>'dsus_ideregistr')::BIGINT END   )
            INNER JOIN pro_propiedad pro ON pro.pro_ideregistro =  dsus.pro_ideregistro  
             INNER JOIN usuarios usu ON usu.usu_ideregistro = aucs.usu_ideregistro
            WHERE   (CASE WHEN ((aucs.aucs_infanterior= '') OR  (aucs.aucs_infanterior IS NULL))
                THEN (aucs.aucs_infnueva::json->>'uni_concepto')::BIGINT 
                ELSE (aucs.aucs_infanterior::json->>'uni_concepto')::BIGINT END   ) = 312 " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

    private function cambioMedidor($complementoSql, $data) {
        $sql = " ( SELECT aupr.aupr_ideregistr idauditoria, aupr.aupr_fecha::date fecha
                    ,dsus.dsus_ideregistr idsuscripcion
                    ,dsus.dsus_pcodigo codigoanterior
                    ,  ( SELECT ter.ter_nomcompleto
                      FROM ter_tercero ter
                      WHERE
                      ter.ter_ideregistro = (aupr.aupr_infnueva :: json ->> 'ter_ideregistro') :: BIGINT
                    ) usuario  --revisar
                    , CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                                FROM aupr_audpropiedad aupr
                                WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= aupr.aupr_fecha
                                ORDER BY aupr.aupr_fecha DESC
                                LIMIT 1) IS NOT NULL) 
                        THEN
                              (SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                               FROM aupr_audpropiedad aupr
                               WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= aupr.aupr_fecha
                               ORDER BY aupr.aupr_fecha DESC
                               LIMIT 1)
                        ELSE
                                    pro.pro_direccion
                        END direccion --revisar
                    ,CASE WHEN ((SELECT bar.barrio_nom
                                FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                                WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= aupr.aupr_fecha
                                ORDER BY aupr.aupr_fecha DESC
                                LIMIT 1) IS NOT NULL) 
                        THEN
                               (SELECT bar.barrio_nom
                                FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                                WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= aupr.aupr_fecha
                                ORDER BY aupr.aupr_fecha DESC
                                LIMIT 1)
                        ELSE (SELECT barrios.barrio_nom
                              FROM barrios
                              WHERE barrios.barrio_ideregistro = dsus.uni_barrio
                              )
                        END barrio --revisar
                    ,(aupr.aupr_infanterior::json->>'pro_idepropieda')::CHARACTER VARYING medidoranterior
                    ,lean.lec_actual lecturaanterior
                    ,(aupr.aupr_infnueva::json->>'pro_idepropieda')::CHARACTER VARYING medidoractual
                    ,leac.lec_anterior lecturaactual
                   ,usu.usuario_nom funcionario
                    FROM aupr_audpropiedad aupr 
                      INNER JOIN lec_lectura lean ON aupr.aupr_campo=lean.pro_ideregistro
                      INNER JOIN lec_lectura leac ON aupr.aupr_campo=leac.pro_ideregistro
                      INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = lean.dsus_ideregistr 
                      INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                      INNER JOIN pro_propiedad pro ON pro.pro_ideregistro =  dsus.pro_ideregistro   
                      INNER JOIN ( SELECT   ll.pro_idepropiedad, MAX(ll.lec_ideregistro) 
                                   FROM lec_lectura ll 
                                   WHERE  ll.lec_estado='K'
                                   GROUP BY ll.pro_idepropiedad) as inflean ON inflean.pro_idepropiedad=lean.pro_idepropiedad
                    INNER JOIN usuarios usu ON usu.usu_ideregistro = aupr.usu_ideregistro 
                    WHERE
                    lean.pro_idepropiedad=aupr.aupr_infanterior::json->>'pro_idepropieda' 
                    AND leac.pro_idepropiedad=aupr.aupr_infnueva::json->>'pro_idepropieda'
                    AND lean.pro_idepropiedad <> leac.pro_idepropiedad AND leac.lec_estado='A' 
                    AND lean.dsus_ideregistr=leac.dsus_ideregistr $complementoSql
                    ORDER BY aupr.aupr_ideregistr
            )
            UNION
            (
                    SELECT
                      aupr.aupr_ideregistr auditoria,
                            aupr.aupr_fecha::date fecha,
                      dsus.dsus_ideregistr idsuscripcion,
                      dsus.dsus_pcodigo codigoanterior,
                      ( SELECT ter.ter_nomcompleto
                        FROM ter_tercero ter
                        WHERE
                        ter.ter_ideregistro = (aupr.aupr_infnueva :: json ->> 'ter_ideregistro') :: BIGINT
                      ) usuario ,
                      aupr.aupr_infnueva::json->>'pro_direccion' direccion,
                      bar.barrio_nom barrio,
                      aupr.aupr_infanterior::json->>'pro_idepropieda' medidoranterior,
                      COALESCE(( 
                        SELECT lec.lec_actual 
                        FROM lec_lectura lec 
                        WHERE lec.lec_estado IN ('A','G','P') AND lec.lec_fecha<aupr.aupr_fecha AND lec.pro_ideregistro=pro.pro_ideregistro AND lec.dsus_ideregistr=dsus.dsus_ideregistr
                        ORDER BY lec.lec_fecha DESC LIMIT 1
                      ),0) lecturaanterior,
                      aupr.aupr_infnueva::json->>'pro_idepropieda' medidoractual,
                      COALESCE(( 
                        SELECT lec.lec_actual 
                        FROM lec_lectura lec 
                        WHERE lec.lec_estado IN ('A','G','P') AND lec.lec_fecha<aupr.aupr_fecha AND lec.pro_ideregistro=pro.pro_ideregistro AND lec.dsus_ideregistr=dsus.dsus_ideregistr
                        ORDER BY lec.lec_fecha DESC LIMIT 1
                      ),0) lecturaactual,
                       usu.usuario_nom funcionario  
                    FROM
                            aupr_audpropiedad aupr INNER JOIN  pro_propiedad pro ON aupr.aupr_campo=pro.pro_ideregistro
                      INNER JOIN dsus_detsuscrip dsus ON dsus.pro_ideregistro=pro.pro_ideregistro
                      INNER JOIN barrios bar ON bar.barrio_ideregistro=(aupr.aupr_infnueva::json->>'uni_barrio')::BIGINT
                      INNER JOIN usuarios usu ON usu.usu_ideregistro=aupr.usu_ideregistro
                    WHERE
                     (aupr.aupr_infnueva::json->>'pro_idepropieda') <> (aupr.aupr_infanterior::json->>'pro_idepropieda') $complementoSql
                    ORDER BY 
                     aupr.aupr_ideregistr
                ) ";
        return $this->executeQuery($sql, $data);
    }

    private function tipoUso($complementoSql, $data) {
        $sql = "SELECT
	auds.auds_fecha :: DATE fecha,
	dsus.dsus_ideregistr idsuscripcion,
	dsus.dsus_pcodigo codigoanterior,
        ( SELECT ter.ter_nomcompleto
          FROM ter_tercero ter
          WHERE
          ter.ter_ideregistro = (auds.auds_infnueva :: json ->> 'ter_ideregistro') :: BIGINT
        ) usuario,
        CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                    FROM aupr_audpropiedad aupr
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                  (SELECT aupr.aupr_infnueva :: json ->> 'pro_direccion'
                   FROM aupr_audpropiedad aupr
                   WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                   ORDER BY aupr.aupr_fecha DESC
                   LIMIT 1)
            ELSE
                        pro.pro_direccion
            END direccion,
        CASE WHEN ((SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1) IS NOT NULL) 
            THEN
                   (SELECT bar.barrio_nom
                    FROM aupr_audpropiedad aupr INNER JOIN barrios bar ON (aupr_infnueva :: json ->> 'uni_barrio') :: BIGINT = bar.barrio_ideregistro
                    WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                    ORDER BY aupr.aupr_fecha DESC
                    LIMIT 1)
            ELSE (SELECT barrios.barrio_nom
                  FROM barrios
                  WHERE barrios.barrio_ideregistro = dsus.uni_barrio
                  )
            END barrio,
                 unitipanterior.uni_nombre1 tipousoanterior,
                 unitipactual.uni_nombre1 tipousoactual,
        (CASE WHEN ((SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1) IS NOT NULL ) 
              THEN 
                    ( SELECT aupr.aupr_infnueva :: json ->> 'pro_idepropieda'
                      FROM aupr_audpropiedad aupr
                      WHERE aupr.aupr_campo = pro.pro_ideregistro AND aupr.aupr_fecha <= auds.auds_fecha
                      ORDER BY aupr.aupr_fecha DESC
                      LIMIT 1)
              ELSE
                        pro.pro_idepropieda
              END ) medidor,
        usu.usuario_nom funcionario
        FROM
         auds_auddetsuscrip auds INNER JOIN dsus_detsuscrip dsus ON auds.auds_campo = dsus.dsus_ideregistr
         INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
         INNER JOIN uni_unidad unitipanterior ON unitipanterior.uni_ideregistro = (auds.auds_infanterior :: json ->> 'uni_tipusosuscr') :: INTEGER
         INNER JOIN uni_unidad unitipactual ON unitipactual.uni_ideregistro = (auds.auds_infnueva :: json ->> 'uni_tipusosuscr') :: INTEGER
         INNER JOIN usuarios usu ON usu.usu_ideregistro = auds.usu_ideregistro
        WHERE
          (auds.auds_infanterior :: json ->> 'uni_tipusosuscr') :: INTEGER <> (auds.auds_infnueva :: json ->> 'uni_tipusosuscr') :: INTEGER AND auds.auds_opecrud = 'UPDATE' " . $complementoSql;
        return $this->executeQuery($sql, $data);
    }

}
