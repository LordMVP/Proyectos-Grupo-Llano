package com.bioagricola.apirest.modelo.manejadores;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;

@Repository
public class ManejadorFacturaAprovechamiento {

    @PersistenceContext
    EntityManager em;
    
    String idEmpresap = "idEmpresa";
    String estadosp = "estados";


    public List<FacFactura> getFacturasAprovechamiento(
            List<String> estados,
            Integer anoCiclo,
            Integer idEmpresa,
            String aprovechamiento,
            Date corteFacturacion){

        Calendar calendario = GregorianCalendar.getInstance();
        calendario.set(2017, Calendar.JANUARY, 1);
        Date inicioLiquidacion = calendario.getTime();

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT * ");
        sqlBuilder.append(" from fac_factura ff ");
        sqlBuilder.append("join dfac_detfactura dd on dd.fac_ideregistro = ff.fac_ideregistro ");
        sqlBuilder.append("join con_concepto cc on cc.uni_concepto = dd.uni_concepto ");
        sqlBuilder.append("where ");
        sqlBuilder.append("ff.emp_ideregistro = :idEmpresa ");
        sqlBuilder.append(" and ff.fac_estado in (:estados) ");
        sqlBuilder.append("and cc.con_propiedad ->> ");
        sqlBuilder.append(aprovechamiento.concat(" = 'true' "));
        sqlBuilder.append("and ff.fac_sdoreal = 0 ");
        sqlBuilder.append("and ff.fac_fecha <= :corteFacturacion ");
        sqlBuilder.append("and ff.fac_fecha >= :inicioLiquidacion ");
        sqlBuilder.append("and ff.cic_ano >= :anoCiclo ");
        sqlBuilder.append("and ff.fac_feceliminad is null ");
        sqlBuilder.append("and ff.fac_ideregistro not in ( ");
        sqlBuilder.append("select f.fac_ideregistro from fac_factura f ");
        sqlBuilder.append("join aseo.dprl_detliquidacionapro dl on ");
        sqlBuilder.append("dl.fac_ideregistro = f.fac_ideregistro ");
        sqlBuilder.append("join aseo.coap_consolidadoapro ca on ");
        sqlBuilder.append("ca.dprl_ideregistro = dl.dprl_ideregistro ");
        sqlBuilder.append("where ca.estado = 'A' and f.fac_ideregistro = ff.fac_ideregistro) ");
        sqlBuilder.append("and ff.fac_ideregistro in ( ");
        sqlBuilder.append("select dr.fac_ideregistro from drec_detrecaudo dr ");
        sqlBuilder.append("where dr.fac_ideregistro = ff.fac_ideregistro) ");

        Query query = this.em.createNativeQuery(sqlBuilder.toString(), FacFactura.class);
        query.setParameter(idEmpresap, idEmpresa);
        query.setParameter(estadosp, estados);
        query.setParameter("corteFacturacion", corteFacturacion);
        query.setParameter("inicioLiquidacion", inicioLiquidacion);
        query.setParameter("anoCiclo", anoCiclo-1);

        List<FacFactura> result = query.getResultList();
        return result;
        
        

    }


    public List<FacFactura> getFacturasAprovechamientoCartCast(List<String> estados,Integer idEmpresa,String aprovechamiento,
            Date corteFacturacion) {
        StringBuilder sqlBuilder = new StringBuilder();
        
        sqlBuilder.append("SELECT ff.fac_ideregistro, ");
        sqlBuilder.append("ff.fac_numero, ");
        sqlBuilder.append("ff.fac_metgenera, ");
        sqlBuilder.append("ff.fac_estado, ");
        sqlBuilder.append("ff.fac_fecha, ");
        sqlBuilder.append("ff.fac_ideactual, ");
        sqlBuilder.append("ff.fac_idepadre, ");
        sqlBuilder.append("ff.fac_fecaprobada, ");
        sqlBuilder.append("ff.fac_feceliminad, ");
        sqlBuilder.append("ff.fac_fecfinancia, ");
        sqlBuilder.append("ff.fac_feccastigad, ");
        sqlBuilder.append("ff.fac_fecvence, ");
        sqlBuilder.append("ff.emp_ideregistro, ");
        sqlBuilder.append("ff.sus_ideregistro, ");
        sqlBuilder.append("ff.dsus_ideregistr, ");
        sqlBuilder.append("ff.uni_tipsuscripc, ");
        sqlBuilder.append("ff.uni_tipusosuscr, ");
        sqlBuilder.append("ff.uni_liquidacion, ");
        sqlBuilder.append("ff.ter_ideregistro, ");
        sqlBuilder.append("ff.cic_ideregistro, ");
        sqlBuilder.append("ff.per_ideregistro, ");
        sqlBuilder.append("ff.uni_documento, ");
        sqlBuilder.append("ff.uni_tipdocument, ");
        sqlBuilder.append("ff.amo_ideregistro, ");
        sqlBuilder.append("ff.cic_ano, ");
        sqlBuilder.append("ff.hliq_ideregistr, ");
        sqlBuilder.append("ff.fac_sdoreal, ");
        sqlBuilder.append("ff.fac_ideorigen, ");
        sqlBuilder.append("ff.uni_tiptercero, ");
        sqlBuilder.append("ff.fac_fecsuspens, ");
        sqlBuilder.append("ff.fin_ideregistro, ");
        sqlBuilder.append("ff.fac_version, ");
        sqlBuilder.append("ff.fac_vlrreal, ");
        sqlBuilder.append("ff.usu_ideregistro, ");
        sqlBuilder.append("ff.mvi_ideregistro, ");
        sqlBuilder.append("ff.fac_ctrlfelec ");
        sqlBuilder.append(" from fac_factura ff ");
        sqlBuilder.append("join dfac_detfactura dd on ");
        sqlBuilder.append("dd.fac_ideregistro = ff.fac_ideregistro ");
        sqlBuilder.append("join con_concepto cc on ");
        sqlBuilder.append("cc.uni_concepto = dd.uni_concepto ");
        sqlBuilder.append("left join drec_detrecaudo dd2 on ");
        sqlBuilder.append("dd2.dfac_ideregistr = dd.dfac_ideregistr ");
        sqlBuilder.append("where ff.fac_idepadre is null ");
        sqlBuilder.append("and ff.fin_ideregistro is null ");
        sqlBuilder.append("and ff.fac_ideorigen is null ");
        sqlBuilder.append("and ff.emp_ideregistro = :idEmpresa ");
        sqlBuilder.append("and ff.fac_estado in (:estados) ");
        sqlBuilder.append("and cc.con_propiedad -> ");
        sqlBuilder.append(aprovechamiento.concat(" = 'true' "));
        sqlBuilder.append("and ff.fac_sdoreal = 0 ");
        sqlBuilder.append("and ff.fac_fecha <= :corteFacturacion ");	
        sqlBuilder.append("and dd2.drec_ideregistr is null ");
        sqlBuilder.append("and ff.fac_ideregistro not in ( ");
        sqlBuilder.append("select ff.fac_ideregistro ");
        sqlBuilder.append("from fac_factura ff ");
        sqlBuilder.append("inner join aseo.dprl_detliquidacionapro dd on ");
        sqlBuilder.append("dd.fac_ideregistro = ff.fac_ideregistro ");		
        sqlBuilder.append("inner join aseo.coap_consolidadoapro cc on ");
        sqlBuilder.append("cc.dprl_ideregistro = dd.dprl_ideregistro ");
        sqlBuilder.append("where cc.estado not in ('A')) ");
        sqlBuilder.append("group by ff.fac_ideregistro ");
        
        Query query = this.em.createNativeQuery(sqlBuilder.toString(), FacFactura.class);
        query.setParameter(idEmpresap, idEmpresa);
        query.setParameter(estadosp, estados);
        query.setParameter("corteFacturacion", corteFacturacion);
        
        List<FacFactura> result = query.getResultList();
        return result;
    	
    }
    
    public FacFacturaDTO getFacturasBase(Integer idPadre) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("select f from fac_factura f ");
        sqlBuilder.append("where f.fac_idregistro = :fac_idepadre  ");

        Query query = this.em.createNativeQuery(sqlBuilder.toString());
        query.setParameter("fac_idepadre", idPadre);
        return  (FacFacturaDTO) query.getSingleResult();
    }

    public Object getFacturasConRecaudo(List<String> estados,
                                        Integer idCiclo,
                                        Integer anoCiclo,
                                        Integer idPeriodo,
                                        Integer idEmpresa,
                                        String aprovechamiento) {

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT ff ");
        sqlBuilder.append("from fac_factura ff ");
        sqlBuilder.append("join dfac_detfactura dd on dd.fac_ideregistro = ff.fac_ideregistro ");
        sqlBuilder.append("join con_concepto cc on cc.uni_concepto = dd.uni_concepto ");
        sqlBuilder.append("where ");
        sqlBuilder.append("ff.emp_ideregistro = :idEmpresa ");
        sqlBuilder.append("and ff.fac_estado in (:estados) ");
        sqlBuilder.append("and ff.cic_ideregistro = :idCiclo ");
        sqlBuilder.append("and ff.per_ideregistro = :idPeriodo ");
        sqlBuilder.append("and ff.cic_ano = :anoCiclo ");
        sqlBuilder.append("and cc.con_propiedad -> :aprovechamiento = 'true' ");

        Query query = this.em.createNativeQuery(sqlBuilder.toString());
        query.setParameter(idEmpresap, idEmpresa);
        query.setParameter(estadosp, estados);
        query.setParameter("idCiclo", idCiclo);
        query.setParameter("idPeriodo", idPeriodo);
        query.setParameter("anoCiclo", anoCiclo);
        query.setParameter("aprovechamiento", aprovechamiento);
        return query.getResultList();
    }
}
