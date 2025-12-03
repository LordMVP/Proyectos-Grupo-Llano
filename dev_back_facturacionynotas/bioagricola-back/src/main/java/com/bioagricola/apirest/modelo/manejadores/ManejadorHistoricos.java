package com.bioagricola.apirest.modelo.manejadores;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ManejadorHistoricos {

	@PersistenceContext
	EntityManager entityManager;

	public Integer buscarIdCiclo(Integer suscripcion, String dsusdetsuscrip, String fechadsusdetsuscrip) {
		String sql = "select cic_ideregistro from " + dsusdetsuscrip + " where dsus_ideregistr = " + suscripcion + " "
				+ fechadsusdetsuscrip + "";
		return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> historicoColiConliquida(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion,  'coli_conliquida_hist'   AS valida "
				+ "from  coli_conliquida_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and  '" + fechaHasta
				+ "' order by fecha_modificacion asc limit 1; ";
		return entityManager.createNativeQuery(query).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> historicoConConcepto(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion,  'con_concepto_hist'   AS valida "
				+ " from  con_concepto_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and    '" + fechaHasta
				+ "' order by fecha_modificacion asc limit 1 ;";
		return entityManager.createNativeQuery(query).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> historicoCoreCorelacio(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'core_conrelacio_hist'   AS valida "
				+ "from  core_conrelacio_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and    '" + fechaHasta
				+ "' order by fecha_modificacion asc limit 1  ;";
		return entityManager.createNativeQuery(query).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> historicoCosuConsuscrip(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'cosu_consuscrip_hist'   AS valida "
				+ "from  cosu_consuscrip_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and     '" + fechaHasta
				+ "'  order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoDocDocumento(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'doc_documento_hist'   AS valida "
				+ "from  doc_documento_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and         '" + fechaHasta
				+ "'   order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoFunFuncion(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion,  'fun_funcion_hist'  AS valida "
				+ "from  fun_funcion_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and "
						+ "'" + fechaHasta
				+ "'    order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoLiqLiquidacion(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion,  'liq_liquidacion_hist'   AS valida "
				+ "from  liq_liquidacion_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and              '" + fechaHasta
				+ "' order by  fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoParParametro(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'par_parametro_hist'  AS valida "
				+ "from  par_parametro_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and          '" + fechaHasta
				+ "' order by   fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoRacoRanconcept(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'raco_ranconcept_hist'   AS valida "
				+ "from  raco_ranconcept_hist where fecha_modificacion BETWEEN '" + fechaDesde + "'    and '" + fechaHasta
				+ "' order by     fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoSusSuscripcion(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'sus_suscripcion_hist'  AS valida "
				+ "from  sus_suscripcion_hist where fecha_modificacion BETWEEN '" + fechaDesde + "'       and '" + fechaHasta
				+ "' order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoDsusDetsuscrip(Date fechaDesde, Date fechaHasta, String suscripcion) {
		String query = " select dsus_hist_idregistr, 'dsus_detsuscrip_hist'  AS valida "
				+ " from  dsus_detsuscrip_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and '" + fechaHasta
				+ "'  and  dsus_ideregistr = " + suscripcion + " " + " order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public List<Object[]> historicoTidoTipdocumen(Date fechaDesde, Date fechaHasta) {
		String query = "select fecha_modificacion, 'tido_tipdocumen_hist' AS valida "
				+ " from  tido_tipdocumen_hist where fecha_modificacion BETWEEN '" + fechaDesde + "' and '" + fechaHasta
				+ "' order by fecha_modificacion asc limit 1;";
		return entityManager.createNativeQuery(query).getResultList();
	}

	@Modifying
	@Transactional
	public int vaciarTablaProceso(String tableName, Integer idUsuario, Integer tipoNota) {
		String query = "delete from " + tableName + " where usu_ideregistro = " + idUsuario + " and  tipo_nota = "
				+ tipoNota + " ";
		return entityManager.createNativeQuery(query).executeUpdate();
	}

	@Modifying
	@Transactional
	public int cargarSuscripciones(Integer idCiclo, Integer idEmpresa, Integer idUsuario, Integer numeroProceso,
			String tableId, String suscripcion, Date fechadesde, Date fechahasta, String dsusdetsuscrip,
			String parametros, Integer tipoNota) {

		String sql = "create table " + tableId + " as "
				+ " select dsus_ideregistr idsuscripcion,dsus.uni_liquidacion idliquidacion, "
				+ " dsus.cic_ideregistro idciclo, " + " " + numeroProceso
				+ " as proceso,  CAST( 'P' AS character varying )estado, " + " CAST( ' - ' AS character varying ) "
				+ " mensaje," + idUsuario + " usu_ideregistro , per_ideregistro, per_fecinicial, per_fecfinal, " + " "
				+ tipoNota + " as tipo_nota  from " + dsusdetsuscrip + " dsus , per_periodo per "
				+ " where dsus.cic_ideregistro=" + idCiclo + " and  dsus.dsus_estado='A' and "
				+ " dsus.emp_ideregistro=" + idEmpresa + "and  dsus_ideregistr = " + suscripcion + "and "
				+ " per_fecinicial >= '" + fechadesde + "' and per_fecfinal <=  '" + fechahasta + "' "
				+ " and per_estado in('C','A','B') and per.cic_ideregistro=dsus.cic_ideregistro  " + parametros
				+ "    order by per_ideorden  ;"

				+ " create index ix_hprcfac_idsuscripcion_" + idEmpresa + "  ON public.proceso_refacturacion_"
				+ idEmpresa + " USING btree (idsuscripcion); " + " create index ix_hprcfac_proceso_" + idEmpresa
				+ " ON "+"   public.proceso_refacturacion_" + idEmpresa + " USING btree (proceso); "
				+ " create index ix_hprcfac_estado_" + idEmpresa + " ON " +"  public.proceso_refacturacion_" + idEmpresa
				+ " USING btree (estado); " + " create index ix_hprcfac_idliquidacion_" + idEmpresa
				+ " ON " +"  public.proceso_refacturacion_" + idEmpresa + " USING btree (idliquidacion); "
				+ " create index ix_hprcfac_idciclo_" + idEmpresa + " ON "+ "public.proceso_refacturacion_" + idEmpresa
				+ " USING btree (idciclo);";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public int cargarSuscripcionesDeuda(Integer idEmpresa, String suscripcion, Integer numeroProceso, String tableId,
			Integer idUsuario, Integer tipoNota, Date fecha) {

		String sql = "create table " + tableId + " as " + "select dsus_ideregistr idsuscripcion, "
				+ " dsus.uni_liquidacion idliquidacion, dsus.cic_ideregistro idciclo, " + numeroProceso
				+ " as proceso, CAST( 'P' AS character varying )estado, "
				+ " CAST( ' - ' AS character varying ) mensaje, " + " " + idUsuario + " usu_ideregistro , 0, " + " '"
				+ fecha + "','" + fecha + "', " + tipoNota + " as tipo_nota from  dsus_detsuscrip  dsus "
				+ " where dsus.emp_ideregistro=" + idEmpresa + "and  dsus_ideregistr = " + suscripcion + " "

				+ " create index ix_hprcfac_idsuscripcion_" + idEmpresa + " ON " +"    public.proceso_refacturacion_"
				+ idEmpresa + " USING btree (idsuscripcion); " + " create index ix_hprcfac_proceso_" + idEmpresa
				+ " ON " +" public.proceso_refacturacion_" + idEmpresa + " USING btree (proceso); "
				+ " create index ix_hprcfac_estado_" + idEmpresa + " ON " + " public.proceso_refacturacion_" + idEmpresa
				+ " USING btree (estado); " + " create index ix_hprcfac_idliquidacion_" + idEmpresa
				+ " ON public.proceso_refacturacion_" + idEmpresa + " USING btree (idliquidacion); "
				+ " create index ix_hprcfac_idciclo_" + idEmpresa + " ON public.proceso_refacturacion_" + idEmpresa
				+ " USING btree (idciclo);";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public int insertarSuscripcionesDeuda(Integer idEmpresa, String suscripcion, Integer numeroProceso, String tableId,
			Integer idUsuario, Integer tipoNota, Date fecha) {

		String sql = "insert into " + tableId + " "
				+ "select dsus_ideregistr idsuscripcion,dsus.uni_liquidacion idliquidacion, "
				+ "dsus.cic_ideregistro idciclo, " + " " + numeroProceso + " as proceso, "
				+ "CAST( 'P' AS character varying )estado," + "CAST( ' - ' AS character varying ) mensaje, " + " "
				+ idUsuario + " usu_ideregistro , 0, '" + fecha + "','" + fecha + "', " + tipoNota + " as tipo_nota "
				+ "from  dsus_detsuscrip  dsus " + "where dsus.emp_ideregistro=" + idEmpresa + "and "
				+ " dsus_ideregistr = " + suscripcion + "";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public int insertarSuscripciones(Integer idCiclo, Integer idEmpresa, Integer idUsuario, Integer numeroProceso,
			String tableId, String suscripcion, Date fechadesde, Date fechahasta, String dsusdetsuscrip,
			String parametros, Integer tipoNota) {

		String sql = "Insert into " + tableId + " "
				+ " select dsus_ideregistr idsuscripcion,dsus.uni_liquidacion idliquidacion, "
				+ " dsus.cic_ideregistro idciclo, " + " " + numeroProceso + " as proceso, "
				+ " CAST( 'P' AS character varying )estado," + "CAST( ' - ' AS character varying ) " + "mensaje, "
				+ idUsuario + " usu_ideregistro , per_ideregistro, per_fecinicial, per_fecfinal, " + tipoNota
				+ " as tipo_nota " + "from " + dsusdetsuscrip + " dsus , per_periodo per "
				+ " where dsus.cic_ideregistro=" + idCiclo + " and " + "dsus.dsus_estado='A' and "
				+ " dsus.emp_ideregistro=" + idEmpresa + "and " + " dsus_ideregistr = " + suscripcion + "and "
				+ " per_fecinicial >= '" + fechadesde + "' and per_fecfinal <= '" + fechahasta + "' "
				+ " and per_estado in('C','A','B') and per.cic_ideregistro=dsus.cic_ideregistro  " + parametros
				+ "    order by per_ideorden  ;";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	public Object[] getProcesoEjecucion(String tableName, Integer idprograma, Integer idempresa, Integer tipoNnota,
			int idUsuario) {
		Object[] respuesta = null;

		String sql = "select cpr.acc_ideregistro, cpr.cpr_fecinicio, usu.usuario_nom, "
				+ " (select count(*) from "+tableName+ " where  tipo_nota = " + tipoNnota
				+ " and usu_ideregistro  =" + idUsuario + ") as cantidad "
				+ " from cpr_ctrproceso cpr inner join acc_acceso acc on  " + "cpr.acc_ideregistro=acc.acc_ideregistro "
				+ " inner join usuarios usu " + "on usu.usu_ideregistro=cpr.usu_ideregistro "
				+ " where cpr.prg_ideregistro=" + idprograma + " and cpr.cpr_estado='A' " + "and cpr.emp_ideregistro= "
				+ idempresa + " and cpr.usu_ideregistro  =" + idUsuario + " limit 1 ";
		try {
			respuesta = (Object[]) entityManager.createNativeQuery(sql).getResultList().get(0);
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getCicloPeriodoId(Integer idperiodo) {
		List<Object[]> respuesta=null;
		String sql = "SELECT " + "                    cic.cic_ideregistro idciclo,"
				+ "                    cic.cic_nombre ciclo," + "                    per.per_ideregistro idperiodo,"
				+ "                    per.per_nombre periodo," + "                    cic.cic_anoactual cicloanio,"
				+ "                    per.per_fecvence fechavencimiento,"
				+ "                    per.per_fecsuspens fechasuspension" + "                FROM"
				+ "                    cic_ciclo cic inner join per_periodo per on per.cic_ideregistro = cic.cic_ideregistro"
				+ "                WHERE" + "                    per.per_ideregistro=" + idperiodo + "";
		try {
			respuesta = entityManager.createNativeQuery(sql).getResultList();
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getPeriodoId(Integer idCiclo, Date fechadesde, Date fechahasta) {
		String sql = " select per_ideregistro,per_fecinicial,per_fecfinal " + " from per_periodo "
				+ " where per_fecinicial >= '" + fechadesde + "' and per_fecfinal <= '" + fechahasta + "' "
				+ " and per_estado in( 'C', 'A') " + " and cic_ideregistro= " + idCiclo + " order by per_ideorden ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getLiquidaciones(String idEmpresa, Long proceso, String liqliquidacion, String parametro,
			Integer tipoNota, String usuario) {
		String sql = "select distinct idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento, "
				+ " cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,"
				+ " cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento"
				+ "  from  proceso_refacturacion_" + idEmpresa + " pfac inner join  " + liqliquidacion
				+ " liq on pfac.idliquidacion=liq.uni_liquidacion" + " where proceso=" + proceso
				+ " and pfac.usu_ideregistro =" + usuario + " and pfac.tipo_nota =" + tipoNota + " " + parametro
				+ " order by idliquidacion";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getConceptosLiquidacion(Integer idliquidacion, String coliconliquida, String conconcepto,
			String parametro) {
		String sql = "select coli.uni_concepto idconcepto, con.con_preliquidar preliquidar " + " from "
				+ coliconliquida + " coli " + " inner join " + conconcepto + " con "
				+ " on coli.uni_concepto = con.uni_concepto  where coli.uni_liquidacion = " + idliquidacion
				+ " " + parametro + "And (CASE WHEN con.con_finvigencia IS NULL THEN "
				+ " con.con_finvigencia IS NULL " + " ELSE " + " con.con_finvigencia >= now()  "
				+ " END )";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object> getSuscripcionPorProceso(String idEmpresa, Long proceso, String dsusdetsuscrip,
			String parametro, Integer idperiodo, Integer tipoNota, String usuario) {
		String sql = "select idsuscripcion,idliquidacion,idciclo, "
				+ " dsus.emp_ideregistro idempresa,dsus.sus_ideregistro idsuscriptor,"
				+ " dsus.uni_tipsuscripc idtiposuscripcion, dsus.uni_tipusosuscr idtipousosuscripcion,"
				+ " dsus.ter_ideregistro idtercero, ter.uni_tiptercero idtipotercero" + " from  proceso_refacturacion_"
				+ idEmpresa + " pfac inner join " + dsusdetsuscrip + " dsus on "
				+ " pfac.idsuscripcion=dsus.dsus_ideregistr"
				+ " inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro" + " where proceso="
				+ proceso + " and pfac.tipo_nota =" + tipoNota + " and pfac.usu_ideregistro =" + usuario
				+ " and estado='P'" + " and pfac.per_ideregistro = " + idperiodo + " " + parametro
				+ " order by idliquidacion limit 500 ";
		return entityManager.createNativeQuery(sql).getResultList();
	}
 
	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptoInformacion(Integer idconcepto, String conconcepto, String parametro) {
		String sql = "select con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,"
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
				+ "                     con.con_metajuste metodo" + "                    from " + conconcepto
				+ " con where con.uni_concepto =" + idconcepto + " " + parametro;
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Object getLiquidacionSuscripcion(Integer idLiquidacion, String liqliquidacion, String parametro) {
		String sql = "select liq.uni_liquidacion idliquidacion, liq.uni_tipdocument idtipodocumento, liq.uni_documento iddocumento,"
				+ "                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diasuspens,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechasuspension ,"
				+ "                cast (CURRENT_TIMESTAMP + (cast(CAST(COALESCE(liq.liq_diavencim,0) as CHARACTER VARYING) ||' days' as  INTERVAL)) as date) fechavencimiento"
				+ "                from  " + liqliquidacion + " liq " + "                where liq.uni_liquidacion="
				+ idLiquidacion + " " + parametro;
		return entityManager.createNativeQuery(sql).getResultList().get(0);
	}

	public BigDecimal getValorFactura(Integer idFactura) {
		String sql = "SELECT" + "  SUM (dfac.dfac_vlrreal) valor" + "  FROM" + "  dfac_detnovedad dfac" + "  WHERE"
				+ "  dfac.fac_ideregistro = " + idFactura + " ";
		return (BigDecimal) entityManager.createNativeQuery(sql).getSingleResult();

	}

	@Modifying
	@Transactional
	public int insertarDetallesInformativos(Integer idFacturaCartera, String idUsuario, Integer idFactura,
			String conconcepto, String parametro) {
		String sql = "INSERT INTO dfci_detcarinforma (SELECT" + "            nextval('sq_dfci_ideregistr'),"
				+ "            'A'," + "            " + idFacturaCartera + "," + "            dfac.fac_ideregistro,"
				+ "            dfac.dfac_ideregistr," + "            dfac.dfac_cantidad,"
				+ "            dfac.dfac_vlrunitari," + "            dfac.dfac_vlrtotal,"
				+ "            dfac.dfac_vlrreal," + "            dfac.dfac_sdoreal," + "            dfac.uni_concepto,"
				+ "            " + idUsuario + " " + "          FROM"
				+ "                  dfac_detnovedad dfac INNER JOIN " + conconcepto
				+ " con ON dfac.uni_concepto=con.uni_concepto" + "          WHERE"
				+ "                  con.con_operacion='I' AND  dfac.fac_ideregistro = " + idFactura + " "
				+ "            AND dfac.dfac_idepadre is not null " + " " + parametro + ")";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	@Modifying
	@Transactional
	public int insertarDetallesSuma(Integer idFacturaCartera, String idUsuario, Integer idFactura, String conconcepto,
			String parametro) {
		String sql = "INSERT INTO dfcs_detcarsuma (SELECT" + "                nextval('sq_dfcs_ideregistr'),"
				+ "                'A'," + "                " + idFacturaCartera + ","
				+ "                dfac.fac_ideregistro," + "                dfac.dfac_ideregistr,"
				+ "                dfac.dfac_cantidad," + "                dfac.dfac_vlrunitari,"
				+ "                dfac.dfac_vlrtotal," + "                dfac.dfac_vlrreal,"
				+ "                dfac.dfac_sdoreal," + "                dfac.uni_concepto," + "                "
				+ idUsuario + " " + "              FROM" + "                      dfac_detnovedad dfac "
				+ "                      INNER JOIN fac_novedad fac ON fac.fac_ideregistro = dfac.fac_ideregistro"
				+ "                      INNER JOIN " + conconcepto + " con ON dfac.uni_concepto=con.uni_concepto"
				+ "              WHERE" + "                con.con_operacion='S' AND  dfac.fac_ideregistro = "
				+ idFactura + " " + "                AND fac.fac_idepadre is not null AND dfac.dfac_sdoreal>0 " + " "
				+ parametro + ")";
		return entityManager.createNativeQuery(sql).executeUpdate();

	}

	@SuppressWarnings("unchecked")
	public List<Object> getRangoConcepto(Integer idconcepto, BigDecimal valortotal, String racoranconcept,
			String parametro) {
		String sql = "select raco.raco_ideregistr idrangoconcepto,raco.uni_concepto idconcepto,"
				+ "                 raco.raco_raninicial rangoinicial, raco.raco_ranfinal rangofinal,"
				+ "                 raco.raco_valor valor, raco.raco_formula formula, raco.usu_ideregistro idusuario"
				+ "               from " + racoranconcept + "  raco " + "               where raco.uni_concepto= "
				+ idconcepto + " and " + valortotal + " between  raco.raco_raninicial and  raco.raco_ranfinal" + " "
				+ parametro;
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Integer tieneRangoConcepto(Integer idconcepto, String racoranconcept, String parametro) {
		String sql = "select count(*) numero from " + racoranconcept + " raco where raco.uni_concepto= " + idconcepto
				+ " " + parametro;
		return entityManager.createNativeQuery(sql).getFirstResult();
	}

	@Modifying
	@Transactional
	public int insertar(String tabla, String campos, String valores) {
		String sql = " INSERT INTO " + tabla + " ( " + campos + " ) VALUES ( " + valores + " ) ";
		return entityManager.createNativeQuery(sql).executeUpdate();
	}

	public int getFacturaIdRegistro(String idSuscripcion, Integer idperiodo, Integer idliquidacion) {
		String sql = "  select ff.fac_ideregistro " + " from fac_factura ff "
				+ " where dsus_ideregistr = " + idSuscripcion + " and fac_feceliminad is null"
				+ " and ff.per_ideregistro = " + idperiodo
				+ " and fac_estado like 'A' and uni_liquidacion = " + idliquidacion + " and fac_idepadre is null";

		try {
			return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();
		} catch (Exception e) {
			return 0;
		}

	}

	public int getFacturaVersion(Integer factura) {
		String sql = "  select fac_version " + " from fac_factura  "
				+ " where fac_ideregistro = " + factura + " ";
		return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();
	}

	public int getFacturaIdRegistroNovedad(Long idSuscripcion) {
		String sql = "  select ff.fac_ideregistro " + " from fac_novedad ff "
				+ " where dsus_ideregistr=" + idSuscripcion + "  and fac_estado = 'G' limit 1";
		return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getNovedades(int idFactura, BigInteger idNovedad) {
		String sql = " SELECT  dnov.dfac_estado, dnov.dfac_cantidad, dnov.dfac_vlrunitari, "
				+ " dnov.dfac_vlrtotal, "
				+ " (dfac.dfac_vlrreal - dnov.dfac_vlrreal  ) as dfac_vlrreal, dnov.dfac_sdoreal, dnov.fac_ideregistro, dfac.uni_concepto, "
				+ " dfac.dfac_version, dnov.usu_ideregistro, dnov.dfac_ideorigen, dnov.damo_ideregistr, dnov.dfin_ideregistr, "
				+ " dfac.dfac_ideregistr " + "FROM dfac_detfactura dfac "
				+ "inner join dfac_detnovedad dnov on dfac.uni_concepto = dnov.uni_concepto "
				+ "where dfac.fac_ideregistro =" + idFactura + " " + "and dnov.fac_ideregistro =" + idNovedad + " "
				+ "group by  dnov.dfac_estado, dnov.dfac_cantidad, dnov.dfac_vlrunitari, "
				+ " dnov.dfac_vlrtotal, dnov.dfac_vlrreal, dnov.dfac_sdoreal, dnov.fac_ideregistro, dfac.uni_concepto, "
				+ " dnov.dfac_version, dnov.usu_ideregistro, dnov.dfac_ideorigen, dnov.damo_ideregistr, dnov.dfin_ideregistr, dfac.dfac_vlrtotal, "
				+ " dfac.dfac_ideregistr " + "having   (dfac.dfac_vlrreal - dnov.dfac_vlrreal  ) <> 0";
		return entityManager.createNativeQuery(sql).getResultList();

	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getNovedadesDeuda(int idFactura) {
		String sql = " SELECT  dnov.dfac_estado, dnov.dfac_cantidad, dnov.dfac_vlrunitari, "
				+ " dnov.dfac_vlrtotal, "
				+ " dnov.dfac_vlrreal, dnov.dfac_sdoreal, dnov.fac_ideregistro, dfac.uni_concepto, "
				+ " dfac.dfac_version, dnov.usu_ideregistro, dnov.dfac_ideorigen, dnov.damo_ideregistr, dnov.dfin_ideregistr, "
				+ " dfac.dfac_ideregistr FROM dfac_detfactura dfac "
				+ "inner join dfac_detnovedad dnov on dfac.uni_concepto = dnov.uni_concepto "
				+ "where dfac.fac_ideregistro =" + idFactura + " " + "and dnov.fac_ideregistro =" + idFactura + " ";
		return entityManager.createNativeQuery(sql).getResultList();

	}

	public Integer getFacturaCicloPeriodoActual(Long idsuscripcion, Integer iddocumento, Integer idtipodocumento,
			Integer idciclo, Integer idperiodo) {
		String sql = " select f.fac_ideregistro " + " from fac_factura f " + " where f.dsus_ideregistr ="
				+ idsuscripcion + " " + " and f.uni_documento =" + iddocumento + " " + " and f.uni_tipdocument="
				+ idtipodocumento + " " + " and f.cic_ideregistro=" + idciclo + " " + " and f.per_ideregistro="
				+ idperiodo + " " + " AND f.fac_estado  IN ('A') AND f.fac_ideorigen is null and fac_idepadre is null";
		return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();

	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptosRelacionados(Integer idconcepto, Integer liquidaciones, String conconcepto,
			String coreconrelacio, String parametro) {
		String sql = " select distinct con.uni_concepto idconcepto, con.est_concepto idestructuraconcepto,"
				+ " con.con_nombre concepto,con.con_alias  alias, con.con_abreviatura abreviatura,"
				+ " con.con_tipcalculo tipocalculo, con.con_valor valor, con.con_formula formula,"
				+ " con.con_operacion operacion, con.con_naturaleza naturaleza,"
				+ " con.con_preliquidar preliquidar, con.con_anticipo anticipo,"
				+ " con.con_pagpriori  pagoprioridad, con.con_financiable financiable,"
				+ " con.con_inivigencia iniciovigencia,con.con_finvigencia finvigencia,"
				+ " con.con_estado estado ,con.prg_ideregistro idprograma, con.con_condonable condonable,"
				+ " con.con_valnulo valornulo,con.usu_ideregistro idusuarioregistra,"
				+ " con.con_tipregistro tiporegistro,con.fun_ideregistro idfuncion,"
				+ " con.con_precision as precision,"
				+ " con.con_metajuste metodo,"
				+ " core. fun_ideregistro idfuncionrelacion"
				+ " from "+ conconcepto+ " con inner join "+coreconrelacio+" core on con.uni_concepto=core.uni_conrelacion"
				+ " inner join coli_conliquida coli on coli.uni_concepto=core.uni_conrelacion"
				+ " where core.uni_concepto in (" + idconcepto
				+ " ) and coli.uni_liquidacion in (" + liquidaciones + ")  " + parametro + ""
				+ " AND ( CASE"
				+ " WHEN con.con_finvigencia IS NULL THEN"
				+ " con.con_finvigencia IS NULL  ELSE con.con_finvigencia >= now() END )";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Object[] consultarFacturasConSaldo(Integer idsuscripcion) {
		String sql = " SELECT" + " fac.fac_ideregistro idfactura," + " fac.cic_ideregistro idciclo,"
				+ " fac.per_ideregistro idperiodo," + " fac.cic_ano cicloanio,"
				+ " fac.emp_ideregistro idempresa," + " fac.fac_sdoreal saldo," + " ("
				+ " CASE WHEN fac.fac_fecvence < now() THEN" + " 'M'" + " ELSE" + " 'C'"
				+ " END" + " ) As tipo" + " FROM" + " fac_novedad fac"
				+ " WHERE" + " fac.fac_sdoreal > 0 AND fac.fac_estado='G'"
				+ " AND fac.dsus_ideregistr =" + idsuscripcion + " AND fac.fac_idepadre IS NULL"
				+ " AND fac.per_ideregistro <= (SELECT per1.per_ideregistro FROM per_periodo per1 WHERE per1.cic_ideregistro = fac.cic_ideregistro AND per_estado = 'A')";
		return entityManager.createNativeQuery(sql).getResultList().toArray();

	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getPeriodoProceso(String idEmpresa, Long idproceso, Integer tipoNota, String idUsuario) {
		String sql = " select per_ideregistro,per_fecinicial,per_fecfinal , idliquidacion  "
				+ " from  proceso_refacturacion_" + idEmpresa + " where proceso = " + idproceso
				+ " and usu_ideregistro = " + idUsuario + " and tipo_nota = " + tipoNota + " ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getNovedadesGeneradas(String identificadorEmpresa, Integer idUsuario, Integer tipoNota) {
		String sql = " select 1  " + " from  " + identificadorEmpresa + " where estado like 'G' and usu_ideregistro = "
				+ idUsuario + " and tipo_nota = " + tipoNota + " ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getParametro(String seccion, String campo, String empresa) {
		String sql = " SELECT par_parametro -> '" + seccion + "' ->> '" + campo + "' "
				+ "FROM par_parametro where emp_ideregistro = " + empresa + " ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptosTipoNota(Integer tipoNota, Integer idempresa) {
		String sql = " select uni_concepto from aseo.paen_parametrosentradanotas " + " where prg_ideregistro = "
				+ tipoNota + "  and emp_ideregistro =" + idempresa + " ; ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getTipoCalculoConceptoNota(Integer tipoNota, Integer idempresa, BigInteger idConcepto) {
		String sql = "select paen_tipocalculo , paen_valor,paen_sqlstring  from aseo.paen_parametrosentradanotas "
				+ " where prg_ideregistro =" + tipoNota + " and emp_ideregistro = " + idempresa + " and uni_concepto ="
				+ idConcepto + " ; ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getTipoCalculoConceptoNotaAforado(Integer tipoNota, Integer idempresa, BigInteger idConcepto,
			String idUsuario) {
		String sql = "select paen_tipocalculo , paen_valor,paen_sqlstring  from aseo.paen_parametrosentradanotas "
				+ " where prg_ideregistro =" + tipoNota + " and emp_ideregistro =" + idempresa + " and uni_concepto ="
				+ idConcepto + " and usu_ideregistro =" + idUsuario + " ; ";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	public Integer validarTablaExistente(String tabla) {
		String sql = " SELECT count(table_name) FROM information_schema.columns" + " WHERE table_name like '%" + tabla
				+ "%' " + " AND table_catalog = 'Tecnicoaseo' " + " AND table_schema = 'public'";
		return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).intValue();

	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getInfoFactura(String idFactura) {
		String sql = "select dsus_ideregistr , cic_ideregistro , per_ideregistro  from fac_factura ff  where  fac_ideregistro ="
				+ idFactura + ";";
		return entityManager.createNativeQuery(sql).getResultList();
	}

	@SuppressWarnings("unchecked")
	public List<Object[]> getConceptosTipoNotaAforado(Integer tipoNota, Integer idempresa, String idUsuario,
			Integer conceptoaforoextraordinario) {
		String sql = "  select uni_concepto from aseo.paen_parametrosentradanotas  where prg_ideregistro =" + tipoNota
				+ " and emp_ideregistro = " + idempresa + " and  uni_concepto <> " + conceptoaforoextraordinario + " "
				+ " union " + "select uni_concepto from aseo.paen_parametrosentradanotas  where prg_ideregistro ="
				+ tipoNota + " and emp_ideregistro =" + idempresa + "  and uni_concepto = "
				+ conceptoaforoextraordinario + " and usu_ideregistro =" + idUsuario + " ;  ";
		return entityManager.createNativeQuery(sql).getResultList();

	}

	/**
	 * Método encargado de consultar en la base de datos la existencia de un proceso en ejecución para el descuento
	 * de indicadores de calidad
	 * 
	 * @param idEmpresa
	 * @param tipoNota
	 * @return
	 */
	public Object[] consultarProcesoCalidad(int idEmpresa, Integer tipoNota) {
		Object[] respuesta = null;

		String sql = "select cpr.acc_ideregistro, cpr.cpr_fecinicio " + " from cpr_ctrproceso cpr "
				+ " where cpr.prg_ideregistro=" + tipoNota + " and cpr.cpr_estado='A' " + "and cpr.emp_ideregistro= "
				+ idEmpresa + " and cpr.cpr_idehilo=" + tipoNota + " limit 1 ";
		try {
			respuesta = (Object[]) entityManager.createNativeQuery(sql).getResultList().get(0);
			return respuesta;
		} catch (Exception e) {
			return respuesta;
		}
	}

}
