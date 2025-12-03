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
class ContribucionReportesModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }
    
    public function ejecutarSQL($sql){
        return $this->executeQuery($sql);
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
                lec.lec_consumo $operador :consumo
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
		LIMIT 5000";
        $parametros['fechaInicial'] = $fechaInicial;
        $parametros['fechaFinal'] = $fechaFinal;
        $parametros['consumo'] = $consumo;
        $parametros['estado'] = $estado;
        $parametros['empresa'] = $empresa;
        $parametros['novedad'] = $novedad;
        $parametros['tipoUso'] = $tipoUso;
        return $this->executeQuery($sql, $parametros);
    }

    public function exentosContribucion($periodo = null) {
                    $parametros = array("periodo" => $periodo);
                        $sql = "SELECT 
                pro.proyecto_nom,
                fac.fac_ideregistro as factura,
                ter.ter_nomcompleto nombre,
                uni.uni_nombre1 as tipo,
                dsus.pro_catestrato as estrato,
                COALESCE(MAX(CASE con.uni_concepto WHEN 41 THEN dfac.dfac_vlrreal END),0) as tarifabasica,
                COALESCE(MAX(CASE con.uni_concepto WHEN 42 THEN dfac.dfac_vlrreal END),0) as consumo,
                COALESCE(MAX(CASE con.uni_concepto WHEN 35 THEN dfac.dfac_vlrreal END),0) as consumometros,
                COALESCE(MAX(CASE con.uni_concepto WHEN 202 THEN dfac.dfac_vlrreal END),0) as consumobasico,
                COALESCE(MAX(CASE con.uni_concepto WHEN 203 THEN dfac.dfac_vlrreal END),0) as consumosuperior
                from proyectos pro 
                INNER JOIN dsus_detsuscrip dsus ON dsus.uni_municipio=pro.proyecto_ideregistro
                INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                INNER JOIN per_periodo per ON fac.per_ideregistro=per.per_ideregistro 
                INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
                INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
                INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=per.cic_ideregistro
                WHERE per.per_ideregistro=:periodo 
                GROUP BY pro.proyecto_nom,factura,nombre,tipo,estrato";
        return $this->executeQuery($sql);
    }

    public function subsidioTipo($periodo=null){
        $sql ="SELECT 
pro.proyecto_nom,
fac.fac_ideregistro as factura,
ter.ter_nomcompleto nombre,
uni.uni_nombre1 as tipo,
dsus.pro_catestrato as estrato,
COALESCE(MAX(CASE con.uni_concepto WHEN 35 THEN dfac.dfac_vlrreal END),0) as consumometros,
COALESCE(MAX(CASE con.uni_concepto WHEN 202 THEN dfac.dfac_vlrreal END),0) as consumobasico,
COALESCE(MAX(CASE con.uni_concepto WHEN 203 THEN dfac.dfac_vlrreal END),0) as consumosuperior,
COALESCE(MAX(CASE con.uni_concepto WHEN 1 THEN dfac.dfac_vlrreal END),0) as valorconsumobasico,
COALESCE(MAX(CASE con.uni_concepto WHEN 2 THEN dfac.dfac_vlrreal END),0) as valorconsumosuperior,
COALESCE(MAX(CASE con.uni_concepto WHEN 3 THEN dfac.dfac_vlrreal END),0) as tarifabasicaplena,
COALESCE(MAX(CASE con.uni_concepto WHEN 4 THEN dfac.dfac_vlrreal END),0) as tarifabasicasub,
COALESCE(MAX(CASE con.uni_concepto WHEN 5 THEN dfac.dfac_vlrreal END),0) as consumovalorpleno,
COALESCE(MAX(CASE con.uni_concepto WHEN 6 THEN dfac.dfac_vlrreal END),0) as consumovalorsub
from proyectos pro 
INNER JOIN dsus_detsuscrip dsus ON dsus.uni_municipio=pro.proyecto_ideregistro
INNER JOIN fac_factura fac ON fac.dsus_ideregistr=dsus.dsus_ideregistr
INNER JOIN per_periodo per ON fac.per_ideregistro=per.per_ideregistro 
INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro
INNER JOIN uni_unidad uni ON dsus.uni_tipusosuscr=uni.uni_ideregistro
INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro
INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=per.cic_ideregistro
WHERE per.per_ideregistro=:periodo
GROUP BY pro.proyecto_nom,factura,nombre,tipo,estrato";    
        $parametros['periodo']=$periodo;
        return $this->executeQuery($sql,$parametros);
    }

}
