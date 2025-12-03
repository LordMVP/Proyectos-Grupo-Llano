package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ConConcepto;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ConConcepto.
 * 
 * @author GeneradorCRUD
 */	
@Configurable
@Service
public interface ManejadorConConcepto extends ManejadorCrud<ConConcepto,Integer>,IManejadorCrud<ConConcepto,Integer>{
	
	@Query(value =	"select con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,"
			+ "                     con.con_nombre concepto,con.con_alias  alias, con.con_abreviatura abreviatura,"
			+ "                     con.con_tipcalculo tipocalculo, con.con_valor valor, con.con_formula formula,"
			+ "                     con.con_operacion operacion, con.con_naturaleza naturaleza,"
			+ "                     con.con_preliquidar preliquidar, con.con_anticipo anticipo,"
			+ "                     con.con_pagpriori  pagoprioridad, con.con_financiable financiable,"
			+ "                     con.con_inivigencia iniciovigencia,con.con_finvigencia finvigencia,"
			+ "                     con.con_estado estado ,con.prg_ideregistro idprograma, con.con_condonable condonable,"
			+ "                     con.con_valnulo valornulo,con.usu_ideregistro idusuarioregistra,"
			+ "                     con.con_tipregistro tiporegistro,con.fun_ideregistro idfuncion,"
			+ "                     con.con_precision as precision,"
			+ "                     con.con_metajuste metodo"
			+ "                    from con_concepto con where con.uni_concepto =:idconcepto ", nativeQuery = true)
	public List<Object> getConceptoInformacion(Integer idconcepto);
	
	@Query(value="select (case when (select DISTINCT COALESCE(cosu_vlrtotal,0) from cosu_consuscrip cosu "
			+ "                where cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815) and "
			+ "                now() between cosu.cosu_fecinicio AND cosu.cosu_fecfinal)>0 "
			+ "                then (select DISTINCT cosu_vlrtotal from cosu_consuscrip cosu "
			+ "                where cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815)) "
			+ "                else (dsus.pro_catestrato ) "
			+ "                end) estrato from dsus_detsuscrip dsus "
			+ "                where dsus.dsus_ideregistr=:idSuscripcion", nativeQuery = true)
	public BigDecimal estrato(Long idSuscripcion);


	@Query(value="SELECT "
			+ "  dsus.dsus_factor factor "
			+ "  FROM "
			+ "  dsus_detsuscrip dsus "
			+ "  WHERE dsus.dsus_ideregistr = :idSuscripcion", nativeQuery = true)
	public BigDecimal factorCorreccion(Long idSuscripcion);


	@Query(value="SELECT cosu.cosu_vlrtotal exento "
			+ " FROM dsus_detsuscrip dsus "
			+ " INNER JOIN cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr "
			+ " WHERE dsus.dsus_ideregistr = :idSuscripcion  and cosu.uni_concepto=312  AND "
			+ " now() between cosu.cosu_fecinicio AND cosu.cosu_fecfinal ", nativeQuery = true)
	public BigDecimal exento(Long idSuscripcion);


	@Query(value="SELECT  COALESCE((select COALESCE(lec.lec_actual,0) "
			+ " from lec_lectura lec "
			+ " INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro "
			+ " where lec.lec_estado='A' and lec.dsus_ideregistr = :idSuscripcion "
			+ " and per.per_ideregistro = lec.per_ideregistro and per.per_estado ='A' ) ,0) as lecturaactual", nativeQuery = true)
	public BigDecimal lecturaActualCiclo(Long idSuscripcion);


	@Query(value= "SELECT  COALESCE((select COALESCE(lec.lec_consumo,0) "
			+ " from lec_lectura lec "
			+ " INNER JOIN per_periodo per on per.per_ideregistro = lec.per_ideregistro "
			+ " where lec.lec_estado='A' and lec.dsus_ideregistr = :idSuscripcion "
			+ " and per.per_ideregistro = lec.per_ideregistro and per.per_estado ='A' ) ,0) as consumo", nativeQuery = true)
	public BigDecimal consumoMtrs(Long idSuscripcion);


	@Query(value ="select COALESCE(lec.lec_consumo,0) consumo "
			+ " from lec_lectura lec "
			+ " where lec.lec_estado='T' and dsus_ideregistr=:idSuscripcion", nativeQuery = true)
	public BigDecimal consultarConsumoModificarLecturas(Long idSuscripcion);


	@Query(value ="select COALESCE(lec.lec_consumo,0) consumo , COALESCE(lec.lec_actual ,-1 ) lecturaactual "
			+ " from lec_lectura lec "
			+ " where lec.lec_estado='P' and dsus_ideregistr=idSuscripcion  order by lec_fecha desc limit 1 ", nativeQuery = true)
	public List<Object> consumoMtrsUltimoProcesado(Long idSuscripcion);


	@Query(value = " SELECT "
			+ " COALESCE (SUM(rco.rco_vlrtotal), 0) reconexion "
			+ " FROM "
			+ " syr_susreconex syr "
			+ " INNER JOIN rco_reconexion rco ON rco.syr_ideregistro = syr.syr_ideregistro "
			+ " INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr "
			+ " INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro "
			+ " WHERE "
			+ " syr.syr_estado = 'P' "
			+ " AND per.per_estado = 'A' "
			+ " AND syr.per_ideregistro = per.per_ideregistro "
			+ " AND syr.dsus_ideregistr =:idSuscripcion", nativeQuery = true)
	public BigDecimal reconexionCicloActual(Long idSuscripcion);

    @Query(value =    "select distinct con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,"
            + "                  con.con_nombre concepto,con.con_alias  alias, con.con_abreviatura abreviatura,"
            + "                  con.con_tipcalculo tipocalculo, con.con_valor valor, con.con_formula formula,"
            + "                  con.con_operacion operacion, con.con_naturaleza naturaleza,"
            + "                  con.con_preliquidar preliquidar, con.con_anticipo anticipo,"
            + "                  con.con_pagpriori  pagoprioridad, con.con_financiable financiable,"
            + "                  con.con_inivigencia iniciovigencia,con.con_finvigencia finvigencia,"
            + "                  con.con_estado estado ,con.prg_ideregistro idprograma, con.con_condonable condonable,"
            + "                  con.con_valnulo valornulo,con.usu_ideregistro idusuarioregistra,"
            + "                  con.con_tipregistro tiporegistro,con.fun_ideregistro idfuncion,"
            + "                  con.con_precision as precision,"
            + "                  con.con_metajuste metodo,"
            + "                  core. fun_ideregistro idfuncionrelacion"
            + "                from con_concepto con inner join core_conrelacio core on con.uni_concepto=core.uni_conrelacion"
            + "                           inner join coli_conliquida coli on coli.uni_concepto=con.uni_concepto"
            + "                where core.uni_concepto in (:idconcepto) and coli.uni_liquidacion in (:liquidaciones)"
            + "                    AND ("
            + "                                CASE"
            + "                                WHEN con.con_finvigencia IS NULL THEN"
            + "                                        con.con_finvigencia IS NULL"
            + "                                ELSE"
            + "                                        con.con_finvigencia >= now()"
            + "                                END"
            + "                        )", nativeQuery = true)
    public List<Object> getConceptosRelacionados(Integer idconcepto,Integer liquidaciones);

	@Query(value = "SELECT "
			+ " COALESCE (SUM(ssp.ssp_vlrtotal), 0) corte "
			+ " FROM "
			+ " syr_susreconex syr "
			+ " INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro "
			+ " INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr "
			+ " INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro "
			+ " WHERE "
			+ " syr.syr_estado = 'A' "
			+ " AND per.per_estado = 'A' "
			+ " AND syr.dsus_ideregistr =:idSuscripcion "
			+ " AND ssp.uni_concepto = 350  limit 1", nativeQuery = true)
	public BigDecimal corteAcometida(Long idSuscripcion);

	@Query(value = "select count(*) icbf "
			+ "from cosu_consuscrip cosu "
			+ "where cosu.dsus_ideregistr=:idSuscripcion "
			+ "AND cosu.uni_concepto=639 "
			+ "AND "
			+ " now() between cosu.cosu_fecinicio AND cosu.cosu_fecfinal ", nativeQuery = true)
	public Long iCBF(Long idSuscripcion);

	@Query(value= "select count(*) vip "
			+ " from cosu_consuscrip cosu "
			+ " where cosu.dsus_ideregistr=:idSuscripcion "
			+ " AND cosu.uni_concepto=2815 "
			+ " AND "
			+ " now() between cosu.cosu_fecinicio "
			+ "AND cosu.cosu_fecfinal ", nativeQuery = true)
	public Long vip(Long idSuscripcion);

	@Query(value ="SELECT "
			+ "  COALESCE ( "
			+ "    (SELECT "
			+ "     sum(dnov.dnov_vlrtotal) "
			+ "     FROM "
			+ "     dnov_detnovedad dnov "
			+ "     INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = dnov.dsus_ideregistr "
			+ "     INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro "
			+ "     INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro "
			+ "     INNER JOIN con_concepto con ON con.uni_concepto = dnov.uni_concepto "
			+ "     AND cic.cic_ideregistro = dnov.cic_ideregistro "
			+ "     AND dnov.per_ideregistro = per.per_ideregistro "
			+ "     WHERE "
			+ "     dsus.dsus_ideregistr =: idSuscripcion "
			+ "     AND per.per_estado = 'A' "
			+ "     AND dnov.uni_concepto =: concepto "
			+ "     ) , 0 ) valorfuncion", nativeQuery = true)
	public BigDecimal valorNovedadConceptoSuscripcion(Integer concepto, Long idSuscripcion);

	@Query(value="select lec_conpromedio promedio "
			+ " from lec_lectura "
			+ " where  dsus_ideregistr = :idSuscripcion  "
			+ "and lec_estado='P' "
			+ "order by lec_fecha desc limit 1", nativeQuery = true)
	public BigDecimal consumoPromedio(Long idSuscripcion);

	@Query(value = "select count(*) indicador "
			+ " from cosu_consuscrip cosu "
			+ " where cosu.dsus_ideregistr = :idSuscripcion "
			+ " AND cosu.uni_concepto=1127 "
			+ " and now() between cosu.cosu_fecinicio AND cosu.cosu_fecfinal ", nativeQuery = true)
	public Long indicadorConsumoPromedio(Long idSuscripcion);
 

	@Query(value = "SELECT subsidioalcaldia.porcentaje  porcentaje "
			+ " from dsus_detsuscrip dsus "
			+ " left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815) "
			+ " and now() BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal "
			+ " inner join ( select (val.dato::json->>'idmunicipio')::integer idmunicipio,(val.dato::json->>'porcentaje') porcentaje, "
			+ " (val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso "
			+ " from "
			+ " (SELECT json_array_elements_text((par_parametro::JSON->>'PARAMETROS_CONVENIO_ALCALDIA_MUNICIPIO')::json) dato "
			+ " FROM par_parametro) val) subsidioalcaldia on subsidioalcaldia.idmunicipio=dsus.uni_municipio and "
			+ " subsidioalcaldia.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0 then 1 else dsus.pro_catestrato end) "
			+ " and subsidioalcaldia.tipouso= dsus.uni_tipusosuscr "
			+ " where dsus.dsus_ideregistr = :idSuscripcion limit 1", nativeQuery = true)
	public String porcentajesubsidioalcaldia(Long idSuscripcion);

	@Query(value = "select COALESCE ((SELECT aportevoluntario.aporte "
			+ "  from dsus_detsuscrip dsus "
			+ "  left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in(639,2815) "
			+ "  and now() BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal "
			+ "  left join reclamos rec on rec.reclamo_codsus=dsus.dsus_pcodigo and (rec.reclamo_codrec='668' or rec.reclamo_codrec='670') "
			+ "  inner join ( select (val.dato::json->>'aporte')::numeric aporte, "
			+ "  (val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso "
			+ "  , val.idempresa "
			+ "  from "
			+ "  (SELECT        json_array_elements_text((par_parametro::JSON->>'PARAMETROS_APORTE_COMPARTO_ENERGIA')::json) dato "
			+ "   , emp_ideregistro idempresa "
			+ "  FROM par_parametro)        val) aportevoluntario on "
			+ "  aportevoluntario.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0        then 0 else dsus.pro_catestrato end) "
			+ "  and "
			+ "  aportevoluntario.tipouso= dsus.uni_tipusosuscr "
			+ "  and aportevoluntario.idempresa = dsus.emp_ideregistro "
			+ "  inner join cosu_consuscrip cosuaporte on cosuaporte.dsus_ideregistr=dsus.dsus_ideregistr and cosuaporte.uni_concepto=3132 "
			+ "  and now() BETWEEN cosuaporte.cosu_fecinicio and cosuaporte.cosu_fecfinal  "
			+ "  where  rec.reclamo_codsus is null and dsus.dsus_ideregistr = :idSuscripcion limit 1), 0) valor", nativeQuery = true)
	public BigDecimal calculoCompartoMiEnergia(Long idSuscripcion);

	
	
	@Query(value = "SELECT aportevoluntario.aporte aporte "
			+ " from dsus_detsuscrip dsus "
			+ " left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto=639  "
			+ " and now() BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal "
			+ " left join reclamos rec on rec.reclamo_codsus=dsus.dsus_pcodigo and (rec.reclamo_codrec='668' or rec.reclamo_codrec='670') "
			+ " inner join ( select (val.dato::json->>'aporte')::numeric aporte, "
			+ " (val.dato::json->>'estrato')::smallint estrato, (val.dato::json->>'tipouso')::smallint tipouso , val.idempresa "
			+ " from "
			+ " (SELECT json_array_elements_text((par_parametro::JSON->>'PARAMETROS_APORTE_COMPARTO_ENERGIA')::json) dato, emp_ideregistro idempresa "
			+ " FROM par_parametro) val) aportevoluntario on "
			+ " aportevoluntario.estrato = (case when COALESCE(cosu.cosu_vlrtotal,0) >0 then 0 else dsus.pro_catestrato end) "
			+ " and aportevoluntario.tipouso= dsus.uni_tipusosuscr "
			+ " and aportevoluntario.idempresa = dsus.emp_ideregistro "
			+ " where rec.reclamo_codsus is null and dsus.dsus_ideregistr = :idSuscripcion limit 1", nativeQuery = true)
	public BigDecimal calculaVlrAporteVoluntario(Long idSuscripcion);
	
	
	@Query(value ="SELECT 1  vinculo "
			+ " from dsus_detsuscrip dsus "
			+ " left join cosu_consuscrip cosu on cosu.dsus_ideregistr=dsus.dsus_ideregistr and cosu.uni_concepto in (639,2815) "
			+ " and now() BETWEEN cosu.cosu_fecinicio and cosu.cosu_fecfinal "
			+ " left join dsfo_detsuscripfuera_opt dsfo on dsfo.dsus_ideregistr=dsus.dsus_ideregistr "
			+ " where dsfo.dsfo_fecexpira is null  and dsus.dsus_ideregistr = :idSuscripcion and "
			+ " dsus.pro_catestrato = (case when dsus.dsus_ideregistr in (375609,375612,375610) then dsus.pro_catestrato  when "
			+ " COALESCE(cosu.cosu_vlrtotal,0) >0 then dsus.pro_catestrato  when dsus.pro_catestrato in (1,2) then dsus.pro_catestrato else 0  end) "
			+ " and dsus.uni_tipusosuscr = (case when dsus.dsus_ideregistr in (375609,375612,375610) then dsus.uni_tipusosuscr when dsus.uni_tipusosuscr=6 then dsus.uni_tipusosuscr else 0  end) limit 1" , nativeQuery = true)
	public BigDecimal vinculoOpcionTarifafaria(Long idSuscripcion);

	@Query(value ="SELECT "
			+ " COALESCE (SUM(ssp.ssp_vlrtotal), 0) suspension "
			+ " FROM "
			+ " syr_susreconex syr "
			+ " INNER JOIN ssp_suspension ssp ON ssp.syr_ideregistro = syr.syr_ideregistro "
			+ " INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = syr.dsus_ideregistr "
			+ " INNER JOIN per_periodo per ON per.cic_ideregistro = dsus.cic_ideregistro "
			+ " WHERE "
			+ " syr.syr_estado = 'P' "
			+ " AND per.per_estado = 'A' "
			+ " AND syr.per_ideregistro = per.per_ideregistro "
			+ " AND syr.dsus_ideregistr = :idSuscripcion "
			+ " AND ssp.uni_concepto in (95) ", nativeQuery = true)
	public BigDecimal suspencionCicloActual(Long idSuscripcion);

	@Query(value = "WITH UPDATED AS (UPDATE dnov_detnovedad "
			+ "  SET dnov_estado = 'P' "
			+ "  from dnov_detnovedad dnov "
			+ "  INNER JOIN ( "
			+ "  SELECT "
			+ "  dsus.dsus_ideregistr, "
			+ "  dsus.cic_ideregistro, "
			+ "  per.per_ideregistro, "
			+ "  con.uni_concepto "
			+ "  FROM "
			+ "  dnov_detnovedad dnov "
			+ "  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = dnov.dsus_ideregistr "
			+ "  INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = dsus.cic_ideregistro "
			+ "  INNER JOIN per_periodo per ON per.cic_ideregistro = cic.cic_ideregistro "
			+ "  INNER JOIN con_concepto con ON con.uni_concepto = dnov.uni_concepto "
			+ "  AND cic.cic_ideregistro = dnov.cic_ideregistro "
			+ "  AND dnov.per_ideregistro = per.per_ideregistro "
			+ "  WHERE "
			+ "  dsus.dsus_ideregistr =:idSuscripcion AND "
			+ "  per.per_estado = 'A' "
			+ "  AND dnov.uni_concepto =:concepto "
			+ "  ) AS d ON dnov.cic_ideregistro = d.cic_ideregistro and dnov.per_ideregistro = d.per_ideregistro and dnov.dsus_ideregistr = d.dsus_ideregistr "
			+ "  and dnov.uni_concepto = d.uni_concepto RETURNING dnov.nov_ideregistro) "
			+ "  UPDATE nov_novedad set nov_estado = 'P' where nov_ideregistro in (select DISTINCT nov_ideregistro from UPDATED) ", nativeQuery = true)
	public void updateValorNovedadConceptoSuscripcion(Integer concepto, Long idSuscripcion);

	@Query(value=" select (valor_total_desc + interes_mor_aplicado+interes_corr_aplicado)from aseo.deca_desccalidad dd  "
			+ " where uni_concepto_facturacion = :idconcepto and dsus_ideregistr = :idsuscripcion and desc_aplicado = false "
			+ " and desc_aplicado = false limit 1 ", nativeQuery = true)
	public BigDecimal descuentoCalidad(Integer idconcepto, Long idsuscripcion);

	@Query(value = "select cc2.uni_concepto, cc2.est_concepto, cc2.con_nombre, cc2.con_alias," +
			"cc2.con_abreviatura, cc2.con_tipcalculo, cc2.con_valor,cc2.con_formula,cc2.con_operacion, " +
			"cc2.con_naturaleza,cc2.con_preliquidar,cc2.con_anticipo,cc2.con_pagpriori,cc2.con_financiable,cc2.con_inivigencia,con_finvigencia," +
			"cc2.con_estado,cc2.prg_ideregistro,cc2.con_tipregistro,cc2.con_condonable,cc2.con_valnulo,cc2.usu_ideregistro,cc2.fun_ideregistro,cc2.con_suspende," +
			"cc2.con_intfinanciacion,cc2.con_metajuste,cc2.con_precision,cc2.con_contabiliza,cc2.con_liquidaservicio,cc2.con_propiedad " +
			"from con_concepto cc2 " +
			"inner join coli_conliquida cc on cc.uni_concepto = cc2.uni_concepto " +
			"where (cc2.con_propiedad -> 'aprovechamiento' = 'true' or cc2.con_propiedad -> 'incentivo_aprovechamiento' = 'true') " +
			"and cc.uni_liquidacion = :uniLiquidacion ", nativeQuery = true)
	public List<ConConcepto> consultaConceptosAprov(@Param("uniLiquidacion") Integer uniLiquidacion);

	@Query(value = "SELECT c.uni_concepto, c.con_nombre FROM con_concepto c " +
			"WHERE C.con_propiedad -> :tipoAprovechamiento = 'true' " +
			"and c.uni_concepto not in (" +
			"select cca.uni_concepto  " +
			"from aseo.coli_conliquida_apro cca where cca.coli_estado = 'A')", nativeQuery = true)
	List<Object> validarParam(@Param("tipoAprovechamiento") String tipoAprovechamiento);

	@Query("select cc.uniConcepto from ConConcepto cc where upper(cc.conNombre) like %:conName%")
	List<Integer> ccUniConceptByConName(@Param("conName") String conName);

	@Query(value = "select cc.uni_concepto from con_concepto cc where upper(cc.con_nombre) ilike %:conNameSubsidio% or upper(cc.con_nombre) ilike %:conNameContribuciones%", nativeQuery = true)
	List<Integer> ccUniConceptByConNameNative(@Param("conNameSubsidio") String conNameSubsidio, @Param("conNameContribuciones") String conNameContribuciones);

	@Query(value = "select cc.uni_concepto from con_concepto cc where upper(cc.con_nombre) ilike %:conNameIndicador% and upper(cc.con_nombre) ilike %:conNameCalidad%", nativeQuery = true)
	Integer ccUniConceptByConNameIndCalNative(@Param("conNameIndicador") String conNameIndicador, @Param("conNameCalidad") String conNameCalidad);

	@Query(value = "select cc.uni_concepto from con_concepto cc where upper(cc.con_nombre) ilike %:conNameAjuste% and upper(cc.con_nombre) not ilike %:conNameDifAseo%", nativeQuery = true)
	List<Integer> ccUniConceptByConNameAjusteNative(@Param("conNameAjuste") String conNameAjuste, @Param("conNameDifAseo") String conNameDifAseo);

	@Query(value = "select cc.* from con_concepto cc where CAST(con_propiedad as CHAR(1000)) ilike %:keyReport%", nativeQuery = true)
	List<ConConcepto> ccUniConceptoByKey(@Param("keyReport") String keyReport);
}

