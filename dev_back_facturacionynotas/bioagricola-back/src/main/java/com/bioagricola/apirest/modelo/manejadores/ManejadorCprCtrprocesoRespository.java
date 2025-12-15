package com.bioagricola.apirest.modelo.manejadores;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ManejadorCprCtrprocesoRespository {
	
	Logger log = LoggerFactory.getLogger(this.getClass());

	@PersistenceContext
	EntityManager entityManager;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@SuppressWarnings("unchecked")
	public List<Object> getProcesoEjecucion(String identiEmpresa, Integer idprograma, Integer idempresa) {
		List<Object> respuesta = null;
		String sql = "select cpr.acc_ideregistro idacceso, cpr.cpr_fecinicio fechainicio, usu.usuario_nom usuario, "
				+ "(select count(*) from " + identiEmpresa + " where estado <> 'P') cantidad "
				+ " from cpr_ctrproceso cpr inner join acc_acceso acc on  " + "cpr.acc_ideregistro=acc.acc_ideregistro "
				+ "inner join usuarios usu " + "on usu.usu_ideregistro=cpr.usu_ideregistro "
				+ "where cpr.prg_ideregistro=" + idprograma + " and cpr.cpr_estado='A' " + "and cpr.emp_ideregistro= "
				+ idempresa + " limit 1  ";
		try {
			respuesta = entityManager.createNativeQuery(sql).getResultList();
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	@Transactional
	public int vaciarTablaProceso(String idEmpresa) {
		String query = "drop table if exists " + idEmpresa + "";
		int respuesta = 0;
		try {
			respuesta = entityManager.createNativeQuery(query).executeUpdate();
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	@Modifying
	@Transactional
	public int cargarSuscripciones(Integer idCiclo, Integer idEmpresa, Integer idUsuario, Integer numeroProceso,
			String tableId) {

		String sql = "create table " + tableId + " as "
				+ "select dsus_ideregistr idsuscripcion,dsus.uni_liquidacion idliquidacion, "
				+ "dsus.cic_ideregistro idciclo, " + "(row_number() OVER () % (" + numeroProceso + ") +1) as proceso, "
				+ "CAST( 'P' AS character varying )estado," + "CAST( ' - ' AS character varying ) " + "mensaje,"
				+ idUsuario + " usu_ideregistro " + "from dsus_detsuscrip dsus " + "where dsus.cic_ideregistro="
				+ idCiclo + " and " + "dsus.dsus_estado='A' and " + "dsus.emp_ideregistro=" + idEmpresa + ";"
				+ " create index ix_prcfac_idsuscripcion_" + idEmpresa + "  ON public." + tableId
				+ " USING btree (idsuscripcion); " + " create index ix_prcfac_proceso_" + idEmpresa + "   ON public."
				+ tableId + " USING btree (proceso); " + " create index ix_prcfac_estado_" + idEmpresa
				+ "    ON public." + tableId + " USING btree (estado); " + " create index ix_prcfac_idliquidacion_"
				+ idEmpresa + " ON public." + tableId + " USING btree (idliquidacion); "
				+ " create index ix_prcfac_idciclo_" + idEmpresa + " ON public." + tableId + " USING btree (idciclo);";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getLiquidaciones(String idEmpresa, Long proceso) {
		String sql = "select distinct idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento, "
				+ " cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,"
				+ " cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento"
				+ " from  proceso_facturacion_" + idEmpresa
				+ " pfac inner join  liq_liquidacion liq on pfac.idliquidacion=liq.uni_liquidacion where proceso= "
				+ proceso + " order by idliquidacion;";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getSuscripcionPorProceso(String idEmpresa, Long proceso) {
		String sql = "select idsuscripcion,idliquidacion,idciclo, "
				+ " dsus.emp_ideregistro idempresa,dsus.sus_ideregistro idsuscriptor,"
				+ " dsus.uni_tipsuscripc idtiposuscripcion, dsus.uni_tipusosuscr idtipousosuscripcion,"
				+ " dsus.ter_ideregistro idtercero, ter.uni_tiptercero idtipotercero" + " from  proceso_facturacion_"
				+ idEmpresa + " pfac inner join dsus_detsuscrip dsus on " + " pfac.idsuscripcion=dsus.dsus_ideregistr"
				+ " inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro" + " where proceso="
				+ proceso + " and estado='P' order by idliquidacion limit 500; ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@Modifying
	@Transactional
	public int actualizar(String parametros, String tabla, String condicion) {
		String sql = " Update " + tabla + " set " + parametros + " where " + condicion + "; ";
                try {
                    return entityManager.createNativeQuery(sql).executeUpdate();
                }catch(Exception e){
                    log.error("ERROR-> " + e);
                    return 0;
                }		
	}

	@Modifying
	@Transactional
	public Long insertar(String tabla, String campos, String valores, String secuencia) {
		BigInteger biid;
		long id = 0;
		String sql = " INSERT INTO " + tabla + " ( " + campos + " ) VALUES ( " + valores + " ) " + secuencia + "; ";
//		log.error("INSERTAR DATOS->"+sql);
		try {
			biid = (BigInteger) entityManager.createNativeQuery(sql).getSingleResult();
			id = biid.longValue();
			return id;
		} catch (Exception e) {
			return id;
		}
	}

	public Long getFacturaCicloPeriodoActual(Long idsuscripcion, Integer iddocumento, Integer idtipodocumento,
			Integer idciclo, Integer idperiodo, Short cicloanio) {
		String sql = " select f.fac_ideregistro " + " from fac_factura f " + " where f.dsus_ideregistr ="
				+ idsuscripcion + " " + " and f.uni_documento =" + iddocumento + " " + " and f.uni_tipdocument="
				+ idtipodocumento + " " + " and f.cic_ideregistro=" + idciclo + " " + " and f.per_ideregistro="
				+ idperiodo + "" + " and f.cic_ano= " + cicloanio + " "
				+ " AND f.fac_estado  IN ('A','G') AND f.fac_ideorigen is null;";
		try {
			return ((Long) entityManager.createNativeQuery(sql).getSingleResult());
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptoInformacion(Integer idconcepto) {
		String sql = "select uni_concepto , est_concepto , con_nombre ,con_alias , con_abreviatura ,"
				+ " con_tipcalculo, con_valor, con_formula , con_operacion , con_naturaleza,"
				+ " con_preliquidar, con_anticipo, con_pagpriori, con_financiable, con_inivigencia ,con_finvigencia,"
				+ " con_estado  ,prg_ideregistro , con_condonable , con_valnulo ,usu_ideregistro,"
				+ " con_tipregistro ,fun_ideregistro , con_precision , con_metajuste"
				+ " from con_concepto  where uni_concepto =" + idconcepto + ";";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public List<Map<String, Object>> getConceptoInformacion2(Integer idconcepto) {
		List<Map<String, Object>> maplist = null;
		try {
			String sql = "select uni_concepto , est_concepto , con_nombre ,con_alias , con_abreviatura ,"
					+ " con_tipcalculo, con_valor, con_formula , con_operacion , con_naturaleza,"
					+ " con_preliquidar, con_anticipo, con_pagpriori, con_financiable, con_inivigencia ,con_finvigencia,"
					+ " con_estado  ,prg_ideregistro , con_condonable , con_valnulo ,usu_ideregistro,"
					+ " con_tipregistro ,fun_ideregistro , con_precision , con_metajuste"
					+ " from con_concepto  where uni_concepto = ?";
			maplist = jdbcTemplate.queryForList(sql, idconcepto);
			return maplist;
		} catch (Exception e) {
			return maplist;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptosRelacionados(Integer idconcepto, Integer liquidaciones) {
		String sql = "select distinct con.uni_concepto, con.est_concepto, "
				+ " con.con_nombre, con.con_alias, con.con_abreviatura, "
				+ " con.con_tipcalculo, con.con_valor, con.con_formula, " + " con.con_operacion, con.con_naturaleza, "
				+ " con.con_preliquidar, con.con_anticipo, " + " con.con_pagpriori, con.con_financiable, "
				+ " con.con_inivigencia, con.con_finvigencia, "
				+ " con.con_estado, con.prg_ideregistro, con.con_condonable, "
				+ " con.con_valnulo, con.usu_ideregistro, con.con_tipregistro, con.fun_ideregistro, "
				+ " con.con_precision, con.con_metajuste, core.fun_ideregistro idfuncionrelacion "
				+ " from con_concepto con inner join core_conrelacio core on con.uni_concepto=core.uni_conrelacion "
				+ " inner join coli_conliquida coli on coli.uni_concepto=con.uni_concepto "
				+ " where core.uni_concepto in (" + idconcepto + ") and coli.uni_liquidacion in (" + liquidaciones
				+ ") " + " AND ( CASE WHEN con.con_finvigencia IS NULL THEN con.con_finvigencia IS NULL "
				+ " ELSE con.con_finvigencia >= now() END ); ";
		try {
			return entityManager.createNativeQuery(sql).getResultList();
		} catch (Exception e) {
			return Collections.emptyList();
		}
	}

	public Integer tieneRangoConcepto(Integer idconcepto) {
		String sql = " select count(*) numero from raco_ranconcept raco where raco.uni_concepto=" + idconcepto + ";";
		try {
			return entityManager.createNativeQuery(sql).getFirstResult();
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object> getRangoConcepto(Integer idconcepto, BigDecimal valortotal) {
		String sql = "select raco_ideregistr, uni_concepto,"
				+ " raco_raninicial, raco_ranfinal, raco_valor, raco_formula, usu_ideregistro "
				+ " from raco_ranconcept  " + " where uni_concepto= " + idconcepto + " and " + valortotal
				+ " between  raco_raninicial and  raco_ranfinal;";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getConceptosLiquidacion(Integer idliquidacion) {
		String sql = "select coli.uni_concepto, con.con_preliquidar " + " from coli_conliquida coli "
				+ "inner join con_concepto con " + " on coli.uni_concepto = con.uni_concepto "
				+ "where coli.uni_liquidacion = " + idliquidacion + "" + "And (CASE "
				+ " WHEN con.con_finvigencia IS NULL THEN " + "   con.con_finvigencia IS NULL " + " ELSE "
				+ "   con.con_finvigencia >= now()  " + " END ); ";

		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Object getCicloPeriodoId(Integer idciclo) {
		String sql = "SELECT cic.cic_ideregistro, cic.cic_nombre ciclo, per.per_ideregistro idperiodo,"
				+ " per.per_nombre periodo, cic.cic_anoactual cicloanio, per.per_fecvence fechavencimiento, per.per_fecsuspens fechasuspension"
				+ " FROM cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro"
				+ " WHERE per.per_estado = 'A' and cic.cic_ideregistro=" + idciclo + ";";

		return entityManager.createNativeQuery(sql).getResultList().get(0);

	}

	public Object getInfoSesion(Integer idacceso) {
		String sql = "select acc.acc_ideregistro idacceso," + " acc.usu_ideregistro idusuario,"
				+ " usu.usuario_nit cedula," + " usu.usuario_nom usuario," + " acc.emp_ideregistro idempresa,"
				+ " emp.empresa_nom empresa," + " acc.pfi_ideregistro idperfil"
				+ " from  acc_acceso acc  inner join usuarios usu on  acc.usu_ideregistro=usu.usu_ideregistro"
				+ " inner join empresas emp on acc.emp_ideregistro=emp.empresa_sevemp" + " where acc.acc_ideregistro="
				+ idacceso + ";";
		return entityManager.createNativeQuery(sql).getResultList().get(0);
	}

	@Modifying
	@Transactional
	public void aumentarCantidadRegistro(Integer cprideregistro) {
		String sql = "Update cpr_ctrproceso set cpr_canregistro=(cpr_canregistro+1) where cpr_ideregistro="
				+ cprideregistro + ";";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	public Object[] consultarFacturasConSaldo(Integer idsuscripcion) {
		String sql = "SELECT fac.fac_ideregistro, fac.cic_ideregistro, fac.per_ideregistro,"
				+ "  fac.cic_ano cicloanio, fac.emp_ideregistro, fac.fac_sdoreal,"
				+ "  (CASE WHEN fac.fac_fecvence < now() THEN 'M'" + "  ELSE 'C' END) As tipo"
				+ "  FROM fac_factura fac" + "  WHERE fac.fac_sdoreal > 0 AND fac.fac_estado='A'"
				+ "  AND fac.dsus_ideregistr = " + idsuscripcion + " AND fac.fac_idepadre IS NULL"
				+ "  AND fac.per_ideregistro <= (SELECT per1.per_ideregistro FROM per_periodo per1 WHERE per1.cic_ideregistro = fac.cic_ideregistro AND per_estado = 'A');";
		return entityManager.createNativeQuery(sql).getResultList().toArray();
	}

	public Object getFuncion(Integer idfuncion) {
		String sql = "select fun_nombre, fun_descripcion, fun_tipo, fun_ideregistro, fun_parametro, usu_ideregistro"
				+ " from fun_funcion where fun_ideregistro=" + idfuncion + ";";
		return entityManager.createNativeQuery(sql).getResultList().get(0);
	}

	public Object getFuncionRelacionada(Integer idconceptorelacionado, Integer idconceptoliquidar) {
		String sql = "SELECT fun.fun_ideregistro, fun.fun_nombre "
				+ " FROM core_conrelacio core INNER JOIN fun_funcion fun ON core.fun_ideregistro=fun.fun_ideregistro"
				+ " WHERE core.uni_concepto = " + idconceptoliquidar + " AND uni_conrelacion = " + idconceptorelacionado
				+ ";";
		return entityManager.createNativeQuery(sql).getResultList().get(0);
	}

	public Object[] getFechasRutaPeriodo(BigInteger idsuscripcion, Integer idperiodo) {
		Object[] respuesta = null;
		String sql = "SELECT rp.rupe_fecvence, rp.rupe_fecsuspens from public.dsus_detsuscrip dd"
				+ " inner join public.rusu_rutsuscrip rr on rr.dsus_ideregistr = dd.dsus_ideregistr"
				+ " inner join public.per_periodo pp on pp.cic_ideregistro = dd.cic_ideregistro and pp.per_estado = 'A'"
                                + " inner join public.rupe_rutperiodo rp on rp.per_ideregistro = pp.per_ideregistro"
				+ " and rp.rut_ideregistro = rr.rut_ideregistro  where dd.dsus_ideregistr =" + idsuscripcion + ";";
		try {
			respuesta = (Object[]) entityManager.createNativeQuery(sql).getResultList().get(0);
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	public Object getLiquidacionSuscripcion(Integer idLiquidacion) {
		String sql = "select uni_liquidacion, uni_tipdocument, uni_documento,"
				+ "  cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as timestamp) fechasuspension ,"
				+ "  cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as timestamp) fechavencimiento"
				+ "  from  liq_liquidacion " + "  where uni_liquidacion=" + idLiquidacion + ";";
		return entityManager.createNativeQuery(sql).getResultList().get(0);
	}

	@Modifying
	@Transactional
	public void insertarDetallesSuma(Integer idFacturaCartera, String idUsuario, Integer idFactura) {
		String sql = "INSERT INTO dfcs_detcarsuma (SELECT" + " nextval('sq_dfcs_ideregistr')," + " 'A'," + " "
				+ idFacturaCartera + "," + " dfac.fac_ideregistro," + " dfac.dfac_ideregistr," + " dfac.dfac_cantidad,"
				+ " dfac.dfac_vlrunitari," + " dfac.dfac_vlrtotal," + " dfac.dfac_vlrreal," + " dfac.dfac_sdoreal,"
				+ " dfac.uni_concepto," + " " + idUsuario + " " + " FROM dfac_detfactura dfac "
				+ " INNER JOIN fac_factura fac ON fac.fac_ideregistro = dfac.fac_ideregistro"
				+ " INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto"
				+ " WHERE con.con_operacion='S' AND  dfac.fac_ideregistro = " + idFactura + " "
				+ " AND fac.fac_idepadre is null AND dfac.dfac_sdoreal>0 )";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public void insertarDetallesInformativos(Integer idFacturaCartera, String idUsuario, Integer idFactura) {
		String sql = "INSERT INTO dfci_detcarinforma (SELECT" + " nextval('sq_dfci_ideregistr')," + " 'A'," + " "
				+ idFacturaCartera + "," + " dfac.fac_ideregistro," + " dfac.dfac_ideregistr," + " dfac.dfac_cantidad,"
				+ " dfac.dfac_vlrunitari," + " dfac.dfac_vlrtotal," + " dfac.dfac_vlrreal," + " dfac.dfac_sdoreal,"
				+ " dfac.uni_concepto," + " " + idUsuario + "" + " FROM"
				+ " dfac_detfactura dfac INNER JOIN con_concepto con ON dfac.uni_concepto=con.uni_concepto"
				+ " WHERE con.con_operacion='I' AND  dfac.fac_ideregistro = " + idFactura + " "
				+ " AND dfac.dfac_idepadre is null);";
		entityManager.createNativeQuery(sql).executeUpdate();

	}

	public BigDecimal getValorFactura(Integer idFactura) {
		String sql = "SELECT SUM (dfac_vlrreal) valor" + " FROM dfac_detfactura " + " WHERE fac_ideregistro = "
				+ idFactura + ";";
		return (BigDecimal) entityManager.createNativeQuery(sql).getSingleResult();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultarNovedad(String idFacturaNov) {
		String sql = "select  fac_vlrreal,fac_metgenera, fac_estado, fac_fecha, fac_fecvence, emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, "
				+ " uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, cic_ano, hliq_ideregistr, "
				+ " fac_sdoreal, uni_tiptercero, fac_fecsuspens, fac_version, fac_fecaprobada, usu_ideregistro , fac_idepadre, pqr, adiciona_elimina "
				+ " from fac_novedad where fac_ideregistro =" + idFacturaNov + ";";
		log.error("CONSULTANOVEDAD->"+sql);
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultarFactura(String idFactura) {
		String sql = "select  fac_vlrreal,fac_metgenera, fac_estado, fac_fecha, fac_fecvence, emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, "
				+ " uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, cic_ano, hliq_ideregistr, "
				+ " fac_sdoreal, uni_tiptercero, fac_fecsuspens, fac_version, fac_fecaprobada, usu_ideregistro , fac_idepadre "
				+ " from fac_factura where fac_ideregistro =" + idFactura + ";";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultarConceptosNovedad(String idFacturaNov) {
		String sql = "select  dd.uni_concepto, dd.dfac_vlrreal , dd.dfac_idepadre, cc.con_operacion ,dd.dfac_vlrtotal "
				+ " from dfac_detnovedad dd "
                                + " inner join con_concepto cc on cc.uni_concepto = dd.uni_concepto "
                        + "where dd.fac_ideregistro = " + idFacturaNov + " " + " and dd.dfac_idepadre != 0;";
		log.error("CONSULTACONCEPTONOVEDAD->"+sql);
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultarConceptoPadre(String idFactura) {
		String sql = "select uni_concepto, dfac_sdoreal, dfac_vlrreal, dfac_vlrtotal  "
				+ " from dfac_detfactura dd where dfac_ideregistr =" + idFactura + ";";
		log.error("CONSULTAPADRE->"+sql);
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Integer compararVersionNota(String idFactura) {
		String sql = "select case when fn.fac_version <> ff.fac_version then 0 else ff.fac_version end"
				+ " from fac_novedad fn , fac_factura ff" + " where fn.fac_idepadre = ff.fac_ideregistro"
				+ " and fn.fac_ideregistro  = " + idFactura + ";";
		return (Integer) entityManager.createNativeQuery(sql).getSingleResult();
	}

	@Modifying
	@Transactional
	public void insertarDetalleFacturaReal(String facideregistro, String dfacvlrtotal, String dfacsdoreal,
			String dfacvlrreal, String uniconcepto, String idNovedad) {
		String sql = "insert into dfac_detfactura (dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,emp_ideregistro) "
				+ " select 'A',dfac_cantidad,dfac_vlrunitari," + dfacvlrtotal + "," + dfacvlrreal + "," + dfacsdoreal
				+ "," + facideregistro + "," + uniconcepto
				+ ",dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,emp_ideregistro "
				+ " from dfac_detnovedad where dfac_idepadre is not null and dfac_idepadre <> 0  and fac_ideregistro = "
				+ idNovedad + " and uni_concepto = " + uniconcepto + ";";
		log.error("INSERTAR DETALLE FACTURA->"+sql);
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	public BigDecimal getValorSaldo(Integer idFactura) {
		String sql = "SELECT SUM (dfac_sdoreal) valor" + " FROM dfac_detfactura " + " WHERE fac_ideregistro = "
				+ idFactura + ";";
		return (BigDecimal) entityManager.createNativeQuery(sql).getSingleResult();
	}

	@Modifying
	@Transactional
	public void actualizarValorConceptoOriginal(String dfacvlrreal, String dfacsdoreal, String dfacideregistr, String dfacvlrtotal) {
		String sql = "update dfac_detfactura set dfac_vlrreal = " + dfacvlrreal + " , dfac_sdoreal = " + dfacsdoreal // + " , dfac_vlrtotal = " + dfacvlrtotal
				+ " " + " where dfac_ideregistr = " + dfacideregistr + ";";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public void insertarNofa(Long notideregistro, BigInteger facideregistro, String facideorigen,
			Integer usuideregistro) {
		String sql = "INSERT INTO nofa_notfactura( "
				+ " not_ideregistro, fac_ideregistro, dfac_ideregistr, fac_ideorigen, dfac_ideorigen, usu_ideregistro) "
				+ "select " + notideregistro + " , fac_ideregistro ,dfac_ideregistr, " + facideorigen
				+ " ,dfac_idepadre, " + usuideregistro + " " + " from dfac_detfactura where fac_ideregistro = "
				+ facideregistro + ";";
                log.error(sql);
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public void vaciarDetalleNovedadTMP(int idEmpresa, int idUsuario, int tipoNota) {
		String sql = "delete from dfac_detnovedad where usu_ideregistro = " + idUsuario + " and  tipo_nota = "
				+ tipoNota + "  and emp_ideregistro = " + idEmpresa + ";";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public void vaciarNovedadTMP(int idEmpresa, int idUsuario, int tipoNota) {
		String sql = "delete from fac_novedad where usu_ideregistro = " + idUsuario + " and tipo_nota  = " + tipoNota
				+ " and emp_ideregistro = " + idEmpresa + ";";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public int vaciarTablaTemporal(String idEmpresa, int idUsuario, int tipoNota) {
		String query = "delete from " + idEmpresa + " where usu_ideregistro = " + idUsuario + " and tipo_nota = "
				+ tipoNota + " ";
		return entityManager.createNativeQuery(query).executeUpdate();
	}

	public Integer consultarDocumentoPorDocumentoyTipoDocumento(Integer unidocumento, Integer unitipdocument,
			String ddottipo) {
		String sql = "select ddot.uni_documento iddocumento" + " from ddot_detdoctipo ddot "
				+ " inner join doti_doctipo doti on ddot.doti_ideregistr=doti.doti_ideregistr"
				+ " inner join uni_unidad uni on ddot.uni_documento=uni.uni_ideregistro "
				+ " where doti.uni_documento= " + unidocumento + " and doti.uni_tipdocument= " + unitipdocument + " "
				+ " and ddot.ddot_tipo='" + ddottipo + "';";
		return (Integer) entityManager.createNativeQuery(sql).getSingleResult();
	}

	public Integer obtenerCodigoReclamacion(Integer idempresa) {
		String sql = "select distinct uu.uni_ideregistro from est_estructura ee "
				+ " inner join esem_estempresa em on em.est_ideregistro = ee.est_ideregistro "
				+ " inner join uni_unidad uu on uu.est_ideregistro = ee.est_ideregistro "
				+ " where em.emp_ideregistro = '" + idempresa + "' and uni_nombre1 like 'Nota Reclamacion';";
		try {
			return (Integer) entityManager.createNativeQuery(sql).getSingleResult();
		} catch (Exception e) {
			return 0;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultarInformacionSuscripcion(BigInteger idsuscripcion) {
		String sql = " SELECT dsus_estado estado, dsus_descripcion descripcion,   "
				+ "             dsus_pcodigo codigoanterior , sus_ideregistro idsuscriptor,   "
				+ "             dsus_ideregistr idsuscripcion, dsus.ter_ideregistro idtercero,   "
				+ "             pro_ideregistro idpropiedad, uni_municipio idmunicipio,   "
				+ "             uni_barrio idbarrio, est_tipsuscripc idestructuratiposuscripcion,   "
				+ "             uni_tipsuscripc idtiposuscripcion, est_tipusosuscr idestructuratipousosuscripcion,   "
				+ "             uni_tipusosuscr idtipousosuscripcion, emp_ideregistro idempresa,   "
				+ "             est_liquidacion idestructuraliquidacion, uni_liquidacion idliquidacion,   "
				+ "             cic_ideregistro idciclo, dsus_fecinicio fechainicio,   "
				+ "             dsus_fecexpira fechaexpira, pro_catestrato estrato,   "
				+ "             dsus_iniestado fechainicioestado, dsus_finestado fechafinestado,   "
				+ "             ter.uni_tiptercero idtipotercero   "
				+ "            FROM dsus_detsuscrip dsus inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro   "
				+ "            WHERE dsus.dsus_ideregistr=" + idsuscripcion + ";";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getConsultarFacturasGeneradas(Integer idEmpresa, Integer idCiclo) {
		String sql = "select fac.emp_ideregistro idempresa,   fac.uni_documento iddocumento,"
				+ "  fac.uni_tipdocument idtipodocumento, fac.fac_ideregistro idfactura,"
				+ "    fac.dsus_ideregistr idsuscripcion " + " from fac_factura fac "
				+ " INNER JOIN dsus_detsuscrip dsus " + " ON fac.dsus_ideregistr = dsus.dsus_ideregistr  "
				+ " where fac.fac_estado   = 'G' " + " AND  fac.emp_ideregistro  =" + idEmpresa
				+ " AND dsus.cic_ideregistro =" + idCiclo + " ";
		List<Object> respuesta = new ArrayList<>();
		try {
			respuesta = entityManager.createNativeQuery(sql).getResultList();
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}

	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getInfoConceptosFacturacion(BigInteger idsuscripcion, Integer idperiodo,
			Integer indicadorCalidadRecoleccion, Integer indicadorCalidadCompactacion,
			Integer indicadorCalidadReclamacionAseoGas, Integer indicadorCalidadReclamacionAseoEnergia) {

		String sql = "select deca_idregistr as id_descuento, " + "uni_concepto_facturacion as concepto_calidad, "
				+ " (valor_total_desc + interes_mor_aplicado + interes_corr_aplicado) as descuento "
				+ " from aseo.DECA_DESCCALIDAD " + " where uni_concepto_facturacion in ( " + indicadorCalidadRecoleccion
				+ "," + indicadorCalidadCompactacion + "," + indicadorCalidadReclamacionAseoGas + ","
				+ indicadorCalidadReclamacionAseoEnergia + ") " + "  and dsus_ideregistr =" + idsuscripcion + " "
				+ "  and per_ideregistro_tarifas  =" + idperiodo + " and desc_aplicado = false  ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getSaldoCalidad(Integer idFactura) {

		String sql = "select sum( saldo_total_desc ) from aseo.deca_desccalidad dd " + " where  fac_ideregistro  ="
				+ idFactura + " and saldo_total_desc is not null and saldo_total_desc > 0 ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@Modifying
	@Transactional
	public void eliminarRegistroAforado(Integer tipoNota, Integer idempresa, Integer conceptoaforoextraordinario,
			int idUsuario) {
		String query = "delete from aseo.paen_parametrosentradanotas where emp_ideregistro = " + idempresa
				+ " and uni_concepto = " + conceptoaforoextraordinario + " and prg_ideregistro = " + tipoNota
				+ " and usu_ideregistro = " + idUsuario + " ";
		entityManager.createNativeQuery(query).executeUpdate();
	}

	@Modifying
	@Transactional
	public BigInteger insertarDeuda(char metodogenera, char estado, String fecha, String fechaaprobacion, Integer version,
			String idUsuario, Integer tipoNota, String facIdePadre, String fechasuspende, String fechavencimiento,char adiciona) {
		BigInteger biid;
		long id = 0;

		String sql = " INSERT INTO public.fac_novedad "
				+ " (fac_numero, fac_metgenera, fac_estado, fac_fecha, fac_ideactual, fac_idepadre, fac_fecaprobada, fac_feceliminad, fac_fecfinancia, fac_feccastigad,  emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, amo_ideregistro, cic_ano, hliq_ideregistr, fac_sdoreal, fac_ideorigen, uni_tiptercero,"
				+ "  fin_ideregistro, fac_version, fac_vlrreal, usu_ideregistro, mvi_ideregistro, fac_ctrlfelec,tipo_nota,fac_fecsuspens,fac_fecvence,adiciona_elimina) "
				+ " select fac_numero, '" + metodogenera + "','" + estado + "', '" + fecha + "' , fac_ideactual,"
				+ facIdePadre + ", '" + fechaaprobacion
				+ "', fac_feceliminad, fac_fecfinancia, fac_feccastigad,  emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, amo_ideregistro, cic_ano, hliq_ideregistr, fac_sdoreal, fac_ideorigen, uni_tiptercero,  fin_ideregistro, "
				+ version + ", fac_vlrreal," + idUsuario + ", mvi_ideregistro, fac_ctrlfelec, " + tipoNota + ",'"+fechasuspende+"', '"+fechavencimiento+"', '"+adiciona+"'"
				+ " from fac_factura where fac_ideregistro = " + facIdePadre + " returning fac_ideregistro ";
		try {
			biid = (BigInteger) entityManager.createNativeQuery(sql).getSingleResult();
			return biid ;
		} catch (Exception e) {
			return BigInteger.ZERO ;
		}
	}

	@Modifying
	@Transactional
	public void insertarDeudaDetalle(char estado, Integer version, String idUsuario, Integer tipoNota, String factura,
			BigInteger idfactura, Integer idempresa) {
		String sql = " insert into dfac_detnovedad (dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,emp_ideregistro, tipo_nota) "
				+ " select '" + estado + "' ,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,"
				+ idfactura + ",uni_concepto," + version + "," + idUsuario
				+ ",dfac_ideorigen,damo_ideregistr,dfac_ideregistr ,dfin_ideregistr," + idempresa + "," + tipoNota + " "
				+ " from dfac_detfactura where fac_ideregistro =  " + factura + " ";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public void vaciarDetalleNovedadTMPDeuda(int idEmpresa, int idUsuario, int tipoNota, List<String> factura) {
		String sql = "delete from dfac_detnovedad where usu_ideregistro = " + idUsuario + " and tipo_nota = " + tipoNota
				+ " and emp_ideregistro = " + idEmpresa + " and fac_ideregistro not in  " + factura + ";";
		sql = sql.replace('[', '(');
		sql = sql.replace(']', ')');
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	public Integer validarSuscripcionAEliminar(int tipoNota, int idEmpresa, int idUsuario) {
		Integer respuesta = 0;
		String sql = "select idsuscripcion from proceso_refacturacion_" + idEmpresa + " where tipo_nota = " + tipoNota
				+ " and mensaje like '%Elimina%' and estado like 'G' and usu_ideregistro=" + idUsuario + " ";
		try {
			respuesta = Integer.parseInt(entityManager.createNativeQuery(sql).getSingleResult().toString());
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}

	}

	@Modifying
	@Transactional
	public void eliminarSuscripcion(Integer suscripcion) {
		String sql = "update dsus_detsuscrip dd set dsus_estado = 'E' where dsus_ideregistr = " + suscripcion + " ";
		entityManager.createNativeQuery(sql).executeUpdate();
	}

	public BigInteger conteoConsultaSuscripcionesReliquidadasDeuda(List<Long> listaSuscripciones, int idEmpresa,
			int idUsuario, Integer tipoNota) {
		BigInteger respuesta = BigInteger.ZERO;
		String sql = "select COUNT(distinct fn.fac_ideregistro) " + " from fac_novedad fn "
				+ " inner join fac_factura ff on ff.fac_ideregistro = fn.fac_idepadre  "
				+ " inner join dsus_detsuscrip dd on dd.dsus_ideregistr = fn.dsus_ideregistr  "
				+ " inner join pro_propiedad pp2 on pp2.pro_ideregistro = dd.pro_ideregistro  "
				+ " inner join per_periodo pp on pp.per_ideregistro = fn.per_ideregistro  "
				+ " inner join ter_tercero tt on tt.ter_ideregistro = dd.ter_ideregistro "
				+ " inner join barrios b2 on b2.barrio_ideregistro = dd.uni_barrio  "
				+ " inner join proceso_refacturacion_" + idEmpresa + " pr on pr.idsuscripcion = dd.dsus_ideregistr "
				+ " where fn.fac_idepadre is not null " + " and fn.dsus_ideregistr IN " + listaSuscripciones
				+ " and fn.emp_ideregistro = " + idEmpresa + " " + " and fn.usu_ideregistro =" + idUsuario
				+ " and fn.tipo_nota =" + tipoNota + " "
				+ " and pr.usu_ideregistro = fn.usu_ideregistro and pr.tipo_nota =fn.tipo_nota and pr.estado like 'G' ";
		sql = sql.replace('[', '(');
		sql = sql.replace(']', ')');
		try {
			respuesta = (BigInteger) entityManager.createNativeQuery(sql).getSingleResult();
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> consultaSuscripcionesReliquidadasDeuda(List<Long> listaSuscripciones, int idEmpresa,
			int idUsuario, Integer tipoNota) {
		String sql = "select  distinct fn.dsus_ideregistr as ID_SUSCRIPCION,  " + " dd.dsus_pcodigo as CODIGO_ANTERIOR,"
				+ " fn.fac_ideregistro as NUMERO_FACTURA," + " CONCAT(pp.per_nombre, ' - ', fn.cic_ano ) as PERIODO, "
				+ " tt.ter_nomcompleto as NOMBRE_COMPLETO,   " + " tt.ter_documento as DOCUMENTO_TERCERO, "
				+ " pp2.pro_direccion as DIRECCION,   " + " b2.barrio_nom as BARRIO,   "
				+ " pp2.pro_numcatastral as CATASTRAL,"
				+ " case when pr.mensaje like '%Elimina%' then 'SI' else 'NO' end as ELIMINA_CODIGO,"
				+ " ff.fac_vlrreal  as VALOR_EMITIDO," + " fn.fac_vlrreal as  VALOR_AJUSTAR,"
				+ " ff.fac_vlrreal - fn.fac_vlrreal as NUEVO_SALDO_ELIMINA,"
				+ " ff.fac_vlrreal + fn.fac_vlrreal  as NUEVO_SALDO_ADICIONA " + " from fac_novedad fn "
				+ " inner join fac_factura ff on ff.fac_ideregistro = fn.fac_idepadre  "
				+ " inner join dsus_detsuscrip dd on dd.dsus_ideregistr = fn.dsus_ideregistr  "
				+ " inner join pro_propiedad pp2 on pp2.pro_ideregistro = dd.pro_ideregistro  "
				+ " inner join per_periodo pp on pp.per_ideregistro = fn.per_ideregistro  "
				+ " inner join ter_tercero tt on tt.ter_ideregistro = dd.ter_ideregistro "
				+ " inner join barrios b2 on b2.barrio_ideregistro = dd.uni_barrio  "
				+ " inner join proceso_refacturacion_" + idEmpresa + " pr on pr.idsuscripcion = dd.dsus_ideregistr "
				+ " where fn.fac_idepadre is not null " + " and fn.dsus_ideregistr IN " + listaSuscripciones
				+ " and fn.emp_ideregistro = " + idEmpresa + " " + " and fn.usu_ideregistro =" + idUsuario
				+ " and fn.tipo_nota =" + tipoNota + " "
				+ " and pr.usu_ideregistro = fn.usu_ideregistro and pr.tipo_nota =fn.tipo_nota and pr.estado like 'G' ";
		sql = sql.replace('[', '(');
		sql = sql.replace(']', ')');
		return entityManager.createNativeQuery(sql).getResultList();
	}

}
