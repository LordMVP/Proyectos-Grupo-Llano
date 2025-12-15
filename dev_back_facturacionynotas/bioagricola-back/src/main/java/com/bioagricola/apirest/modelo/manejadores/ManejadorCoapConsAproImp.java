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
import com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO;
import com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO;
import java.util.ArrayList;

@Repository
public class ManejadorCoapConsAproImp implements IManejadorCoapConsApro {

    @PersistenceContext
    EntityManager em;
    
    @Override
    public List<Object[]> getResumenLiquidacion(PeriodoFactDTO periodo, String terceros,Integer idEmpresa, String estado, Integer tipoProceso) {
                
        StringBuilder hql = new StringBuilder();
        hql.append("select terideregistro,ternomcompleto, coapsaldofactcc, coapsaldofactta,");
        hql.append("coapcambiovlrcteta, coappagoctecc, coappagocteta, coapfactajustecc,");
        hql.append("coapfactajusteta, coappagoajustecc, coappagoajusteta, coapcambiovlrpagocte,");
        hql.append("coapvlrcastigado,:periodo as per_idregistr,per_facturacion,:maprc_ideregistr as maprcIderegistr ");
        hql.append("from aseo.fn_apro_reporteresumen_procesoconciliacion(:terceros,:idEmpresa, :estado, :per_facturacion, :maprc_ideregistr) rr ");
        hql.append("where rr.coapsaldofactiat = 0 ");

        Query query = em.createNativeQuery(hql.toString());
        query.setParameter("terceros", terceros);
        query.setParameter("idEmpresa", idEmpresa);
        query.setParameter("estado", estado);
        query.setParameter("per_facturacion", periodo.getPerFacturacion());
        query.setParameter("maprc_ideregistr", periodo.getMaprcIderegistr());
        query.setParameter("periodo", periodo.getPerIderegistro());
        return query.getResultList();
    }

    @Override
    public List<Object[]> getDetalleStage(PeriodoFactDTO periodo,Integer idEmpresa, String estado, String terceros) {
        
        StringBuilder hql = new StringBuilder();
        hql.append("SELECT :periodo as per_ideregistro,periodoprestacion,perodofacturacion, coapsaldofactcc, coapsaldofactta, coapcambiovlrcteta,");
        hql.append("coappagoctecc, coappagocteta, coapfactajustecc, coapfactajusteta, coappagoajustecc,");
        hql.append("coappagoajusteta, coapcambiovlrpagocte, coapvlrcastigado,terideregistro,ternomcompleto ");
        hql.append("FROM aseo.fn_apro_reporteresumendetalle_procesoconciliacion(:terceros,:idEmpresa, :estado, :per_facturacion, :maprc_ideregistr) rr ");

        Query query = em.createNativeQuery(hql.toString());
        query.setParameter("periodo",periodo.getPerIderegistro());
        query.setParameter("terceros", terceros);
        query.setParameter("idEmpresa", idEmpresa);
        query.setParameter("estado", estado);
        query.setParameter("per_facturacion", periodo.getPerFacturacion());
        query.setParameter("maprc_ideregistr", periodo.getMaprcIderegistr());

        return query.getResultList();
    }
    
    @Override
    public List<Object[]> getResumenLiquidacionIA(PeriodoFactDTO periodo, Integer prlIderegistro,Integer idEmpresa, String estado, Integer tipoProceso, String terceros) {
        
        StringBuilder hql = new StringBuilder();
        hql.append("select terideregistro,ternomcompleto, coapsaldofactiat, coapfactfactajusteiat, coappagoiat,");
        hql.append("coappagoiatajuste, coapvlrcastigadoiat, coapcambiovlrcteiat, coapcambiovlrpagocteiat,per_facturacion ");
        hql.append("from aseo.fn_apro_reporteresumen_procesoconciliacion(:terceros, :idEmpresa, :estado, :per_facturacion, :maprc_ideregistr) rr ");
        hql.append("where rr.coapsaldofactiat > 0 ");
        
        Query query = em.createNativeQuery(hql.toString());
        query.setParameter("terceros", terceros);
        query.setParameter("idEmpresa", idEmpresa);
        query.setParameter("estado", estado);
        query.setParameter("per_facturacion", periodo.getPerFacturacion());
        query.setParameter("maprc_ideregistr", periodo.getMaprcIderegistr());

        List<Object[]> dataResult = query.getResultList();
        return dataResult;
    }
    
    @Override
    public List<TerceroPorFactDTO> consultaTerceroPorPeriodoFac(Integer idempresa,List<Integer> maprc_id, List<Integer> periodos_fact, Integer tipoProceso){
        StringBuilder sql = new StringBuilder();
        sql.append("select distinct tt.ter_documento,tt.ter_digverificacion,tt.ter_nomcompleto,tt.ter_apellido,tt.ter_ideregistro from aseo.aprconc_conciliacion ac ");
        sql.append("inner join aseo.maprc_maestroconciliacion mm on ac.maprc_ideregistr = mm.maprc_ideregistr ");
        sql.append("inner join aseo.prl_liquidacionapro pl on mm.maprc_ideregistr = pl.maprc_ideregistr ");
        sql.append("inner join public.ter_tercero tt on tt.ter_ideregistro = ac.ter_ideregistro ");
        sql.append("where pl.prl_estado in ('A','P') and mm.maprc_ideregistr in (:maprcideregistr) and ac.per_facturacion in (:perfacturacion) and mm.emp_ideregistro = :idempresa ");
        
        switch (tipoProceso) {
            case 1:
                sql.append("and ac.iat_valor = 0 ");
                break;
            case 2:
                sql.append("and ac.iat_valor > 0 ");
                break;
        }
        
        Query query = em.createNativeQuery(sql.toString());
        query.setParameter("idempresa", idempresa);
        query.setParameter("maprcideregistr", maprc_id);
        query.setParameter("perfacturacion", periodos_fact);
        List<Object[]> terceros = query.getResultList();
        
        List<TerceroPorFactDTO> tercerosDto = new ArrayList<>();
        for (Object[] tercero : terceros) {
            tercerosDto.add(new TerceroPorFactDTO(
                    tercero[0].toString(),
                    Short.valueOf(tercero[1].toString()),
                    tercero[2].toString(),
                    tercero[3].toString(),
                    Long.valueOf(tercero[4].toString())));
        }
        return tercerosDto;
    }

    @Override
    public Object getFechaPrestacion(Integer idperiodoFacturacion) {
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

        return query.getResultList();

    }

    @Modifying
    @Transactional
    @Override
    public Integer insertarConsolidado(AproCoapConsolidadoDTO coapConsolidadoaproDTO, Integer idEmpresa,
            Integer usuIderegistro, Date fechaReg) {
        StringBuilder hql = new StringBuilder();
        if (coapConsolidadoaproDTO.getAprovechamiento().equals("A")) {
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

        } else {
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
}
