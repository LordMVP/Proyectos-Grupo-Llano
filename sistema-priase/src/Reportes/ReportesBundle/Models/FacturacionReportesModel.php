<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of FacturacionReportesModel
 *
 * @author jpsierra
 */
class FacturacionReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    public function ejecutarSQL($sql){
        return $this->executeQuery($sql);
    }

    public function suscripcionesPeriodoConsumo($periodo, $empresa, $consumo, $operador = "=") {
        $sql = "SELECT
                        proy.proyecto_ideregistro AS proyecto_id,
                        proy.proyecto_nom AS proyecto_nombre,
                        uni.uni_nombre1 AS tipo_uso,
                        dsus.dsus_ideregistr AS suscripcion_id,
                        dsus.dsus_pcodigo AS codigo_anterior,
                        ter.ter_nomcompleto AS tercero_nombre,
	                pro.pro_direccion AS propiedad_direccion,
                    	bar.barrio_nom AS propiedad_barrio,
                    	pro.pro_idepropieda AS numero_medidor,
                        per.per_fecinicial AS periodo_fecha_inicial,
                	lec.lec_actual AS lectura_actual,
                	lec.lec_anterior AS lectura_anterior,
                	lec.lec_consumo AS lectura_consumo_actual,
                    	dsus.dsus_fecinicio AS fecha_matricula,
                        (ultimos6_consumos_crosstab(dsus.dsus_ideregistr,per.per_fecinicial::DATE,lec.emp_ideregistro)).*
                    FROM
                        lec_lectura lec
                        INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = lec.dsus_ideregistr
                        INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
                        INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = lec.pro_ideregistro
                        INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
                        INNER JOIN proyectos proy ON proy.proyecto_ideregistro = pro.uni_municipio
                        INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                        INNER JOIN uni_unidad uni ON uni.uni_ideregistro = dsus.uni_tipusosuscr
                    WHERE
                        lec.lec_consumo $operador :consumo  
                        AND lec.per_ideregistro = :periodo    
                        AND lec.emp_ideregistro = :empresa
                    GROUP BY
                        proyecto_id,
                        lec.emp_ideregistro,
                        per.per_fecinicial,
                        proyecto_nombre,
                        tipo_uso,
                        suscripcion_id,
                        codigo_anterior,
                        tercero_nombre,
                        propiedad_direccion,
                        propiedad_barrio,
                        periodo_fecha_inicial,
                        numero_medidor,
                        lectura_actual,
                        lectura_anterior,
                        lectura_consumo_actual,
                        fecha_matricula";

        $parametros['periodo'] = $periodo;
        $parametros['empresa'] = $empresa;
        $parametros['consumo'] = $consumo;
        return $this->executeQuery($sql, $parametros);
    }

    public function ultimosConsumosSuscripcion($suscripcion, $fechaReferencia, $empresa, $limite = 6) {
        $sql = "SELECT	
                    lec.dsus_ideregistr AS suscripcion_id,
                    lec.lec_fecha AS fecha_lectura,
                    lec.per_ideregistro,
                    per.per_fecinicial AS fecha_inicial_periodo,
                    per.per_fecfinal AS fecha_final_periodo,
                    lec.lec_actual AS lectura_periodo,
                    lec.lec_anterior AS lectura_anterior,
                    lec.lec_consumo AS lectura_consumo
                FROM
                    lec_lectura lec
                    INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
                WHERE 
                    (per.per_fecinicial::DATE <= :fechaReferencia ::DATE - CAST (date_part('day', :fechaReferencia ::DATE) AS INT))	
                    AND lec.dsus_ideregistr = :suscripcion
                    AND lec.emp_ideregistro = :empresa
                ORDER BY 
                        suscripcion_id,per.per_fecinicial DESC
                LIMIT :limite";

        $parametros['limite'] = $limite;
        $parametros['suscripcion'] = $suscripcion;
        $parametros['fechaReferencia'] = $fechaReferencia;
        $parametros['empresa'] = $empresa;
        return $this->executeQuery($sql, $parametros);
    }

    public function consultaMaestraLecturas($fechaInicial, $fechaFinal, $consumo, $estado, $empresa, $novedad = -1, $tipoUso = -1, $operador = "=") {
        $condicionNovedad = "";
        $condicionTipoUso = "";

        if ($novedad != "-1") {
            $condicionNovedad = "AND dlec.uni_novlectura = :novedad";
        }
        if ($tipoUso != "-1") {
            $condicionTipoUso = "AND utuso.uni_ideregistro = :tipoUso";
        }

        $sql = "SELECT
	proy.proyecto_ideregistro AS proyecto_id,
	proy.proyecto_nom AS proyecto_nombre,
	rut.rut_ideregistro AS ruta_id,
	rut.rut_nombre AS ruta_nombre,
	utuso.uni_nombre1 AS tipo_uso,
	utsus.uni_nombre1 AS tipo_suscripcion,
	dsus.dsus_ideregistr AS suscripcion_id,
	dsus.dsus_pcodigo AS codigo_anterior,
	ter.ter_nomcompleto AS tercero_nombre,
	pro.pro_direccion AS propiedad_direccion,
	bar.barrio_nom AS propiedad_barrio,
	pro.pro_idepropieda AS numero_medidor,
	per.per_fecinicial AS periodo_fecha_inicial,
        per.per_nombre AS periodo_nombre,
	lec.cic_ano AS ciclo_anno,
	lec.lec_ideregistro AS lectura_id,
	lec.lec_actual AS lectura_actual,
	lec.lec_anterior AS lectura_anterior,
	lec.lec_consumo AS lectura_consumo_actual,
	dlec.uni_novlectura AS novedad_id,
	unov.uni_nombre1 AS novedad_nombre,
	dlec.dlec_observacio AS lectura_observacion,
	dsus.dsus_fecinicio::DATE AS fecha_matricula,
	(ultimos6_consumos_crosstab(dsus.dsus_ideregistr,per.per_fecinicial::DATE,lec.emp_ideregistro)).*
		FROM
			lec_lectura lec
		INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = lec.dsus_ideregistr
		INNER JOIN per_periodo per ON per.per_ideregistro = lec.per_ideregistro
		INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = lec.pro_ideregistro
		INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
		INNER JOIN proyectos proy ON proy.proyecto_ideregistro = pro.uni_municipio
		INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
		INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr
		INNER JOIN uni_unidad utsus ON utsus.uni_ideregistro = dsus.uni_tipsuscripc
		INNER JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr
		INNER JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro
		LEFT JOIN dlec_detlectura dlec ON dlec.dlec_ideregistr = lec.dlec_ideregistr
		LEFT JOIN uni_unidad unov ON dlec.uni_novlectura = unov.uni_ideregistro
		WHERE
                lec.lec_consumo >= :consumo
		AND lec.lec_fecprocesad :: DATE BETWEEN :fechaInicial AND :fechaFinal
		AND lec.emp_ideregistro = :empresa
		AND lec.lec_estado = :estado
                $condicionNovedad
                $condicionTipoUso
		GROUP BY
			lec.emp_ideregistro,
			proyecto_id,
			per.per_fecinicial,
			proyecto_nombre,
			rut.rut_ideregistro,
			rut.rut_nombre,
			tipo_uso,
			tipo_suscripcion,
			codigo_anterior,
			suscripcion_id,
			tercero_nombre,
			propiedad_direccion,
			propiedad_barrio,
			numero_medidor,
			periodo_fecha_inicial,
                        periodo_nombre,
                        ciclo_anno,
			lectura_id,
			lectura_actual,
			lectura_anterior,
			lectura_consumo_actual,
			novedad_id,
			novedad_nombre,
			lectura_observacion,
			fecha_matricula
		LIMIT 1000";
        $parametros['fechaInicial'] = $fechaInicial;
        $parametros['fechaFinal'] = $fechaFinal;
        $parametros['consumo'] = $consumo;
        $parametros['estado'] = $estado;
        $parametros['empresa'] = $empresa;
        $parametros['novedad'] = $novedad;
        $parametros['tipoUso'] = $tipoUso;
        return $this->executeQuery($sql, $parametros);
    }

    public function consolidadoFacturacion() {
        $sql = "SELECT 
                proy.proyecto_ideregistro as proyecto_id,
                proy.proyecto_nom AS proyecto_nombre,
                utuso.uni_ideregistro AS tipo_uso_id,
                utuso.uni_nombre1 AS tipo_uso_nombre,
                dsus.dsus_ideregistr AS suscripcion_id,
                ter.ter_nomcompleto AS tercero_nombre,
                fac.fac_ideregistro AS factura_id,
                lec.lec_actual AS lectura_actual,
                lec.lec_anterior AS lectura_anterior,
                lec.lec_consumo AS lectura_consumo,
                lec.dsus_factor AS lectura_factor_correcion,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=41 THEN dfac.dfac_vlrreal END),0) AS tarifa_basica,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
                COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas
            FROM fac_factura fac
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
                INNER JOIN uni_unidad concep ON concep.uni_ideregistro = dfac.uni_concepto
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN proyectos proy ON proy.proyecto_ideregistro = dsus.uni_municipio
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN lec_lectura lec ON (lec.dsus_ideregistr = fac.dsus_ideregistr AND lec.per_ideregistro = fac.per_ideregistro AND lec.cic_ano = fac.cic_ano AND lec.cic_ideregistro = fac.cic_ideregistro AND lec.lec_estado = 'P')
                INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr 
            
            GROUP BY 
                proyecto_id,
                proyecto_nombre,
                tipo_uso_id,
                tipo_uso_nombre,
                suscripcion_id,
                tercero_nombre,
                factura_id,
                lectura_actual,
                lectura_anterior,
                lectura_consumo,
                lectura_factor_correcion
                ORDER BY proyecto_nombre,tipo_uso_nombre,tercero_nombre";
        return $this->executeQuery($sql);
    }

    public function prueba() {
        $sql = "SELECT 
                proy.proyecto_ideregistro as proyecto_id,
                proy.proyecto_nom AS proyecto_nombre,
                utuso.uni_ideregistro AS tipo_uso_id,
                utuso.uni_nombre1 AS tipo_uso_nombre,
                dsus.pro_catestrato AS suscripcion_estrato,
                dsus.dsus_ideregistr AS suscripcion_id,
ter.ter_nomcompleto AS tercero_nombre,
--fac.fac_ideregistro AS factura_id,
--lec.lec_actual AS lectura_actual,
--lec.lec_anterior AS lectura_anterior,
--lec.lec_consumo AS lectura_consumo,
--lec.dsus_factor AS lectura_factor_correcion,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=41 THEN dfac.dfac_vlrreal END),0) AS tarifa_basica,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas,
COALESCE(MAX(CASE WHEN dfac.uni_concepto=42 THEN dfac.dfac_vlrreal END),0) AS valor_consumo_gas
FROM fac_factura fac
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro = fac.fac_ideregistro
INNER JOIN uni_unidad concep ON concep.uni_ideregistro = dfac.uni_concepto
INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
INNER JOIN proyectos proy ON proy.proyecto_ideregistro = dsus.uni_municipio
INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
--INNER JOIN lec_lectura lec ON (lec.dsus_ideregistr = fac.dsus_ideregistr AND lec.per_ideregistro = fac.per_ideregistro AND lec.cic_ano = fac.cic_ano AND lec.cic_ideregistro = fac.cic_ideregistro AND lec.lec_estado = 'P')
INNER JOIN uni_unidad utuso ON utuso.uni_ideregistro = dsus.uni_tipusosuscr 
--WHERE dsus.uni_tipusosuscr = 5
GROUP BY 
proyecto_id,
proyecto_nombre,
tipo_uso_id,
tipo_uso_nombre,
suscripcion_estrato,
suscripcion_id,
tercero_nombre
--factura_id,
--lectura_actual,
--lectura_anterior,
--lectura_consumo,
--lectura_factor_correcion
ORDER BY proyecto_nombre,tipo_uso_nombre,suscripcion_estrato,tercero_nombre";
        return $this->executeQuery($sql);
    }
    
     public function consultarRutas($municipio) {
        $sql = "SELECT
                rut.rut_ideregistro as ideruta,
                rut.rut_nombre as nombre,
                muba.uni_municipio as municipio
                FROM mbru_munbarruta mbru
                INNER JOIN muba_munbarrio muba ON muba.muba_ideregistr=mbru.muba_ideregistr
                INNER JOIN rut_ruta rut  ON rut.rut_ideregistro=mbru.rut_ideregistro
                WHERE (muba.uni_municipio=:municipio OR -1=:municipio)
                GROUP BY ideruta,nombre,municipio
                ORDER BY rut.rut_ideregistro ASC";
        $parametros = array("municipio" => $municipio);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
     public function consultarUsuariosCiclo($ciclo=null , $empresa =null) {
         $condiciones ="1=1";
        if($ciclo!=null){
            $condiciones = "dsus.cic_ideregistro=:ciclo AND 
                     fac.cic_ideregistro=:ciclo AND fac.fac_idepadre IS NULL 
                    AND fac.fac_ideorigen IS NULL AND liq.liq_venclasific='LI' 
                    AND fac.emp_ideregistro=:empresa AND fac.fac_estado='A' and perr.per_estado = 'A' ";
        } 
        $sql = "SELECT
            CASE
             WHEN usua.estado='A' THEN 'APROBADO'
             WHEN usua.estado='G' THEN 'PENDIENTE APROBAR'
             WHEN usua.estado='F' THEN 'FINANCIADO'
             WHEN usua.estado='R' THEN 'NOTA RECLAMACION'
             WHEN usua.estado='P' THEN 'PROVISIONADO'
             WHEN usua.estado='E' THEN 'ELIMINADA'
             WHEN usua.estado='C' THEN 'CASTIGADA'
                            END AS estado,
            COUNT(usua.usuarios) as cuenta
            FROM
            (
            SELECT
            dsus.dsus_ideregistr as usuarios,
            COUNT(DISTINCT fac.fac_ideregistro) as cuentafactura,
            fac.fac_estado as estado
            FROM dsus_detsuscrip dsus
            INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
            INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=fac.uni_liquidacion
            INNER JOIN per_periodo perr on perr.per_ideregistro = fac.per_ideregistro
            WHERE $condiciones 
            GROUP BY usuarios,estado
            HAVING
            COUNT(DISTINCT fac.fac_ideregistro)>0
            ) usua
            GROUP BY estado";
        $parametros = array("ciclo" => $ciclo ,"empresa"=> $empresa );
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    public function consultarUsuariosPendientes($ciclo=null, $empresa = null) {
        $condiciones ="1=1 AND fac.fac_estado='Z'";
        if($ciclo!=null){
            $condiciones = "fac.cic_ideregistro=:ciclo and fac.emp_ideregistro =:empresa and fac.fac_estado='G'";
        }        
        $sql = "SELECT
                fac.fac_ideregistro as factura,
                fac.dsus_ideregistr as suscripcion
                FROM fac_factura fac
                WHERE $condiciones
                ORDER BY fac.fac_ideregistro ASC";
        $parametros = array("ciclo" => $ciclo,  "empresa" => $empresa);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    public function consultarUsuariosCicloPendientes($ciclo=null, $empresa = null) {
         $condiciones ="1=1";
        if($ciclo!=null){
            $condiciones = "dsus.cic_ideregistro=:ciclo AND fac.cic_ideregistro=:ciclo AND fac.fac_idepadre IS NULL AND fac.fac_ideorigen IS NULL AND liq.liq_venclasific='LI' AND fac.emp_ideregistro=:empresa AND fac.fac_estado='G'";
        } 
        $sql = "SELECT
            CASE
             WHEN usua.estado='A' THEN 'APROBADO'
             WHEN usua.estado='G' THEN 'PENDIENTE APROBAR'
             WHEN usua.estado='F' THEN 'FINANCIADO'
             WHEN usua.estado='R' THEN 'NOTA RECLAMACION'
             WHEN usua.estado='P' THEN 'PROVISIONADO'
             WHEN usua.estado='E' THEN 'ELIMINADA'
             WHEN usua.estado='C' THEN 'CASTIGADA'
                            END AS estado,
            COUNT(usua.usuarios) as cuenta
            FROM
            (
            SELECT
            dsus.dsus_ideregistr as usuarios,
            COUNT(DISTINCT fac.fac_ideregistro) as cuentafactura,
            fac.fac_estado as estado
            FROM dsus_detsuscrip dsus
            INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
            INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=fac.uni_liquidacion
            WHERE $condiciones 
            GROUP BY usuarios,estado
            HAVING
            COUNT(DISTINCT fac.fac_ideregistro)>0
            ) usua
            GROUP BY estado";
        $parametros = array("ciclo" => $ciclo , "empresa" => $empresa);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    public function consultarFacturasPeriodo($anno=null,$usuario=null,$empresa = null, $empleado = null) {
        $sql = "SELECT DISTINCT datos.* FROM (

						SELECT
                                                                DISTINCT fac.per_ideregistro as ide,
                                                                per.per_nombre as nombre
                                                FROM 		fac_factura fac 
                                                INNER JOIN 	per_periodo per on per.per_ideregistro = fac.per_ideregistro
                                                INNER JOIN 	dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fac.dsus_ideregistr
                                                WHERE 			(dsus.dsus_ideregistr = :usuario  or dsus.dsus_pcodigo = :usuario::varchar)
                                                        AND  	fac.uni_documento = 24 
                                                        AND 	fac.fac_estado  in  ('A','F','P','C','N')
                                                        AND     fac.fac_idepadre is null
							AND 			extract(YEAR from per.per_fecinicial)::INTEGER= :anno
           
							AND  
						((SELECT
                                                                uni.uni_ideregistro as ideunidad
                                                FROM				est_estructura est
                                                INNER JOIN 	esem_estempresa esem ON est.est_ideregistro = esem.est_ideregistro
                                                INNER JOIN 	cla_clase cla ON est.cla_ideregistro = cla.cla_ideregistro
                                                INNER JOIN 	uni_unidad uni ON est.est_ideregistro = uni.est_ideregistro
                                                INNER JOIN 	prun_prgunidad prun ON uni.uni_ideregistro = prun.uni_ideregistro
                                                INNER JOIN 	uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr
                                                WHERE
                                                                est.cla_ideregistro =43
                                                    AND         esem.emp_ideregistro = :empresa
                                                    AND         prun.prg_ideregistro = 143
                                                    AND         uspu.usu_ideregistro = :empleado
                                                    AND         prun.uni_ideregistro = 1217
             )=1217)
							
	UNION

			SELECT datos2.* 
			FROM (
						SELECT
                                                                DISTINCT fac1.per_ideregistro  as ide,
                                                                per.per_nombre as nombre
						FROM            fac_factura fac1 
						INNER JOIN 	per_periodo per on per.per_ideregistro = fac1.per_ideregistro 
						INNER JOIN 	dsus_detsuscrip dsus ON dsus.dsus_ideregistr=fac1.dsus_ideregistr
						
						WHERE 		(dsus.dsus_ideregistr = :usuario or dsus.dsus_pcodigo = :usuario::varchar)
                                                AND  	fac1.uni_documento = 24 
                                                AND 	fac1.fac_estado  in  ('A','F','P','C','N')
                                                AND     fac1.fac_idepadre is null
						AND 		extract(YEAR from per.per_fecinicial)::INTEGER= :anno 
						AND     	fac1.fac_ideregistro in 
                                                                (select 		max(fac2.fac_ideregistro) from fac_factura fac2
                                                                INNER JOIN dsus_detsuscrip dsus2 on dsus2.dsus_ideregistr = fac2.dsus_ideregistr
                                                                INNER JOIN 	per_periodo per on per.per_ideregistro = fac2.per_ideregistro and per.per_estado = 'C' 
                                                                WHERE           (dsus2.dsus_ideregistr = :usuario or dsus2.dsus_pcodigo = :usuario::varchar) and fac2.uni_documento = 24)
						
						  limit 1
			) as datos2
        ) as datos
        ORDER BY datos.ide";
        $parametros = array("anno" => $anno,"usuario" => $usuario,'empresa'=>$empresa, 'empleado'=>$empleado);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }
    
    public function consultarRutasMunicipios($municipios) {
        $sql = "SELECT
                rut.rut_ideregistro as ideruta,
                rut.rut_nombre as nombre,
                muba.uni_municipio as municipio
                FROM mbru_munbarruta mbru
                INNER JOIN muba_munbarrio muba ON muba.muba_ideregistr=mbru.muba_ideregistr
                INNER JOIN rut_ruta rut  ON rut.rut_ideregistro=mbru.rut_ideregistro
                WHERE (muba.uni_municipio in (:municipios) OR -1=:municipios)
                GROUP BY ideruta,nombre,municipio
                ORDER BY rut.rut_ideregistro ASC";
        $parametros = array("municipios" => $municipios);
        $resultado = $this->executeQuery($sql,$parametros);
        return $resultado;
    }

}
