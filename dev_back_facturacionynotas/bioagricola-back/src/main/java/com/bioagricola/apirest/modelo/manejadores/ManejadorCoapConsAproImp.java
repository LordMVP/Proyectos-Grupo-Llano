package com.bioagricola.apirest.modelo.manejadores;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;

@Repository

public class ManejadorCoapConsAproImp implements IManejadorCoapConsApro {
	
	@PersistenceContext
	EntityManager em;
	
	@Override
	public List<Object[]> getResumenLiquidacion(Integer prlaIderegistro, 
			List<Integer> perIderegistro, List<Long> terIderegistro, Integer idEmpresa){
		
		StringBuilder hql = new StringBuilder();
		hql.append("select tt2.ter_ideregistro as terIderegistro, tt2.ter_nomcompleto as terNomcompleto, ");
		hql.append("sum(ssc.coap_saldo_fact_cc)as coapSaldoFactCc , " ); 
		hql.append("sum(ssc.coap_saldo_fact_ta) as coapSaldoFactTa," ); 
		hql.append("sum(ssc.coap_cambio_vlr_cte_ta) as coapCambioVlrCteTa," );
		hql.append("sum (ssc.coap_pago_cte_cc) as coapPagoCteCc," );
		hql.append("sum(ssc.coap_pago_cte_ta) as coapPagoCteTa," );
		hql.append("sum(ssc.coap_fact_ajuste_cc) as coapFactAjusteCc,");
		hql.append("sum(ssc.coap_fact_ajuste_ta) as coapFactAjusteTa," ); 
		hql.append("sum(ssc.coap_pago_ajuste_cc) as coapPagoAjusteCc," );
		hql.append("sum(ssc.coap_pago_ajuste_ta) as coapPagoAjusteTa," );
		hql.append("sum(ssc.coap_cambio_vlr_pago_cte) as  coapCambioVlrPagoCte," ); 
		hql.append("sum(ssc.coap_vlr_castigado) as coapVlrCastigado from aseo.stcoap_stage_consolidadoapro");
		hql.append(idEmpresa);
		hql.append(" ssc inner join aseo.dprl_detliquidacionapro dd on dd.dprl_ideregistro = ssc.dprl_ideregistro "); 
		hql.append("inner join aseo.prl_liquidacionapro pl on pl.prl_ideregistro = dd.prl_idregistro inner join public.ter_tercero tt2 on tt2.ter_ideregistro = dd.ter_ideregistro ");
		hql.append("inner join public.fac_factura ff2 on ff2.fac_ideregistro = dd.fac_ideregistro  where pl.prl_ideregistro  =");
		hql.append(prlaIderegistro);	
		hql.append(" and ff2.per_ideregistro in (:perIderegistro) ");
		hql.append("and tt2.ter_ideregistro in (:terIderegistro) ");
		hql.append("and pl.prl_tipo_proceso = 1 ");
		hql.append("group by tt2.ter_ideregistro");
		
		Query query = em.createNativeQuery(hql.toString());
		query.setParameter("perIderegistro", perIderegistro);
		query.setParameter("terIderegistro", terIderegistro);
		List<Object[]> dataResult = query.getResultList();
		return dataResult;
		
	}
	
	public List<Object> getDetalleStage (Integer prlaIderegistro, 
	List<Integer> perIderegistro, List<Long> terIderegistro, Integer idEmpresa){
		StringBuilder hql = new StringBuilder();
		hql.append("select ff2.per_ideregistro, "); 
		hql.append("extract(month from pp2.per_fecfinal)|| '-' ||extract(year from pp2.per_fecfinal) ," );
		hql.append("sum(ssc.coap_saldo_fact_cc)as coapSaldoFactCc , " ); 
		hql.append("sum(ssc.coap_saldo_fact_ta) as coapSaldoFactTa," ); 
		hql.append("sum(ssc.coap_cambio_vlr_cte_ta) as coapCambioVlrCteTa," );
		hql.append("sum (ssc.coap_pago_cte_cc) as coapPagoCteCc," );
		hql.append("sum(ssc.coap_pago_cte_ta) as coapPagoCteTa," );
		hql.append("sum(ssc.coap_fact_ajuste_cc) as coapFactAjusteCc,");
		hql.append("sum(ssc.coap_fact_ajuste_ta) as coapFactAjusteTa," ); 
		hql.append("sum(ssc.coap_pago_ajuste_cc) as coapPagoAjusteCc," );
		hql.append("sum(ssc.coap_pago_ajuste_ta) as coapPagoAjusteTa," );
		hql.append("sum(ssc.coap_cambio_vlr_pago_cte) as  coapCambioVlrPagoCte," ); 
		hql.append("sum(ssc.coap_vlr_castigado) as coapVlrCastigado ");
		hql.append("from aseo.stcoap_stage_consolidadoapro");
		hql.append(idEmpresa);
		hql.append(" ssc ");
		hql.append("inner join aseo.dprl_detliquidacionapro dd on dd.dprl_ideregistro = ssc.dprl_ideregistro " );
		hql.append("inner join aseo.prl_liquidacionapro pl on pl.prl_ideregistro = dd.prl_idregistro " );
		hql.append("inner join public.ter_tercero tt2 on tt2.ter_ideregistro = dd.ter_ideregistro " );
		hql.append("inner join public.fac_factura ff2 on ff2.fac_ideregistro = dd.fac_ideregistro " );
		hql.append("inner join public.per_periodo pp2 on pp2.per_ideregistro = ff2.per_ideregistro ");
		hql.append("where pl.prl_ideregistro  =");
		hql.append(prlaIderegistro);	
		hql.append(" and ff2.per_ideregistro in (:perIderegistro) ");
		hql.append("and tt2.ter_ideregistro in (:terIderegistro) ");
		hql.append("group by ff2.per_ideregistro, pp2.per_ideregistro ;");

		Query query = em.createNativeQuery(hql.toString());
		query.setParameter("perIderegistro", perIderegistro);
		query.setParameter("terIderegistro", terIderegistro);

		return  query.getResultList();
		
	}
	
	@Override
	public Object getFechaPrestacion(Integer idperiodoFacturacion ){
		StringBuilder hql = new StringBuilder();
		hql.append("select (extract ( month from pp.per_fecfinal)) || '-' ||"); 
		hql.append("(extract ( year from pp.per_fecfinal)) "); 	
		hql.append("from per_periodo pp inner join ( select per_ideregistro, per_fecinicial,"); 
		hql.append("cic_ideregistro, per_fecfinal from per_periodo pp2 where per_ideregistro = ");
		hql.append(":idperiodoFacturacion) "); 
		hql.append("periodofacturacion on "); 
		hql.append("periodofacturacion.cic_ideregistro = pp.cic_ideregistro ");
		hql.append("where pp.per_fecinicial < periodofacturacion.per_fecinicial ");
		hql.append("and (pp.per_fecinicial >= ( periodofacturacion.per_fecinicial- interval '1' month)) "); 
		hql.append("and pp.per_estado = 'C' order by pp.per_ideorden desc limit 1");
		
		Query query = em.createNativeQuery(hql.toString());
		query.setParameter("idperiodoFacturacion", idperiodoFacturacion);

		return  query.getResultList();
		
	}
	
    @Modifying
	@Transactional
	@Override
	public Integer insertarConsolidado(AproCoapConsolidadoDTO coapConsolidadoaproDTO, Integer idEmpresa, 
			Integer usuIderegistro, Date fechaReg ) {
		StringBuilder hql = new StringBuilder();
		if(coapConsolidadoaproDTO.getAprovechamiento().equals("A") ) {
		hql.append("INSERT INTO aseo.stcoap_stage_consolidadoapro");
		hql.append(idEmpresa);
		hql.append(" (dprl_ideregistro,coap_saldo_fact_cc,coap_saldo_fact_ta,");
		hql.append("coap_cambio_vlr_cte_ta,coap_pago_cte_cc,coap_pago_cte_ta,");
		hql.append("coap_fact_ajuste_cc,coap_fact_ajuste_ta,coap_pago_ajuste_cc,");
		hql.append("coap_pago_ajuste_ta,coap_cambio_vlr_pago_cte,coap_vlr_castigado,");
		hql.append("dinc,estado,usu_ideregistro,fecha_reg)");
		hql.append(" VALUES (");
		hql.append(":dprlIderegistro,:coapSaldoFactCc,:coapSaldoFactTa,:coapCambioVlrCteTa,");
		hql.append(":coapPagoCteCc,:coapPagoCteTa,:coapFactAjusteCc,:coapFactAjusteTa,");
		hql.append(":coapPagoAjusteCc,:coapPagoAjusteTa,:coapCambioVlrPagoCte,:coapVlrCastigado,");
		hql.append(":dinc,:estado,:usuIderegistro,:fechaReg)");
		
		Query query = em.createNativeQuery(hql.toString());
		query.setParameter("dprlIderegistro", coapConsolidadoaproDTO.getDprlIderegistro());
		query.setParameter("coapSaldoFactCc", coapConsolidadoaproDTO.getCoapSaldoFactCc());
		query.setParameter("coapSaldoFactTa", coapConsolidadoaproDTO.getCoapSaldoFactTa());
		query.setParameter("coapCambioVlrCteTa", coapConsolidadoaproDTO.getCoapCambioVlrCteTa());
		query.setParameter("coapPagoCteCc", coapConsolidadoaproDTO.getCoapPagoCteCc());
		query.setParameter("coapPagoCteTa", coapConsolidadoaproDTO.getCoapPagoCteTa());
		query.setParameter("coapFactAjusteCc", coapConsolidadoaproDTO.getCoapFactAjusteCc());
		query.setParameter("coapFactAjusteTa", coapConsolidadoaproDTO.getCoapFactAjusteTa());
		query.setParameter("coapPagoAjusteCc", coapConsolidadoaproDTO.getCoapPagoAjusteCc());
		query.setParameter("coapPagoAjusteTa", coapConsolidadoaproDTO.getCoapPagoAjusteTa());
		query.setParameter("coapCambioVlrPagoCte", coapConsolidadoaproDTO.getCoapCambioVlrPagoCte());
		query.setParameter("coapVlrCastigado", coapConsolidadoaproDTO.getCoapVlrCastigado());
		query.setParameter("dinc", coapConsolidadoaproDTO.getDinc());
		query.setParameter("estado", coapConsolidadoaproDTO.getEstado());
		query.setParameter("usuIderegistro", usuIderegistro);
		query.setParameter("fechaReg", fechaReg);
		return query.executeUpdate();	
		
		}else {
			hql.append("INSERT INTO aseo.stcoap_stage_consolidadoapro");
			hql.append(idEmpresa);
			hql.append(" (dprl_ideregistro,coap_saldo_fact_ia,coap_cambio_vlr_cte_ia,coap_pago_cte_ia,");
			hql.append("coap_cambio_vlr_pago_cte_ia,coap_vlr_castigado_ia,");
			hql.append("estado,usu_ideregistro,fecha_reg)");
			hql.append(" VALUES (");
			hql.append(":dprlIderegistro,:coapSaldoFactIa,:coapCambioVlrCteIa,:coapPagoCteIa,");
			hql.append(":coapCambioVlrPagoCteIa,:coapVlrCastigadoIa,:estado,:usuIderegistro,:fechaReg)");
			
			Query query = em.createNativeQuery(hql.toString());
			query.setParameter("dprlIderegistro", coapConsolidadoaproDTO.getDprlIderegistro());
			query.setParameter("coapSaldoFactIa", coapConsolidadoaproDTO.getCoapSaldoFactIa());
			query.setParameter("coapCambioVlrCteIa", coapConsolidadoaproDTO.getCoapCambioVlrCteIa());
			query.setParameter("coapPagoCteIa", coapConsolidadoaproDTO.getCoapPagoCteIa());
			query.setParameter("coapCambioVlrPagoCteIa", coapConsolidadoaproDTO.getCoapCambioVlrCteIa());
			query.setParameter("coapVlrCastigadoIa", coapConsolidadoaproDTO.getCoapVlrCastigadoIa());
			query.setParameter("estado", coapConsolidadoaproDTO.getEstado());
			query.setParameter("usuIderegistro", usuIderegistro);
			query.setParameter("fechaReg", fechaReg);
			return query.executeUpdate();

		}	
	}
    
	@Override
	public List<Object[]> getResumenLiquidacionIA(Integer prlaIderegistro, 
			Integer idEmpresa){
		
		StringBuilder hql = new StringBuilder();
		hql.append("select tt2.ter_ideregistro as terIderegistro, tt2.ter_nomcompleto as terNomcompleto, ");
		hql.append("c2.ciudad_nom as municipio, ");
		hql.append("sum(ssc.coap_saldo_fact_ia)as coapSaldoFactIa , " ); 
		hql.append("sum(ssc.coap_cambio_vlr_cte_ia)as coapCambioVlrCteIa , " ); 
		hql.append("sum(ssc.coap_pago_cte_ia)as coapPagoCteIa , " ); 
		hql.append("sum(ssc.coap_cambio_vlr_pago_cte_ia)as coapCambioVlrPagoCteIa , " ); 
		hql.append("sum(ssc.coap_vlr_castigado_ia)as coapVlrCastigadoIa " ); 
		hql.append("from aseo.stcoap_stage_consolidadoapro");
		hql.append(idEmpresa);
		hql.append(" ssc ");
		hql.append("inner join aseo.dprl_detliquidacionapro dd on dd.dprl_ideregistro = ssc.dprl_ideregistro "); 
		hql.append("inner join aseo.prl_liquidacionapro pl on pl.prl_ideregistro = dd.prl_idregistro ");
		hql.append("inner join public.ter_tercero tt2 on tt2.ter_ideregistro = dd.ter_ideregistro ");
		hql.append("inner join ciudades c2 on c2.ciudad_cod = tt2.ciudad_cod ");
		hql.append("inner join public.fac_factura ff2 on ff2.fac_ideregistro = dd.fac_ideregistro ");
		hql.append("where pl.prl_ideregistro  =");
		hql.append(prlaIderegistro);	
		hql.append(" and pl.prl_tipo_proceso = 2 ");
		hql.append("group by tt2.ter_ideregistro,c2.ciudad_nom");
		
		Query query = em.createNativeQuery(hql.toString());
		@SuppressWarnings("unchecked")
		List<Object[]> dataResult = query.getResultList();
		return dataResult;
	}
	

}
