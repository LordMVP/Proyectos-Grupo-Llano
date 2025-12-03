package com.bioagricola.apirest.modelo.manejadores;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

@Repository
public class ManejadorRecaudoAprovechamiento {

    @PersistenceContext
    EntityManager em;

    /**
     * Metodo que sirve para consultar los recaudos de una o varias facturas
     * @Param fechaLimiteProc establece la fecha Limite para hallar recaudos
     * */
    public Object getRecaudoAprovechamiento(Date fechaLimiteProc,
                                                  String tipoApro,
                                                  Integer idFactura
                                                  ){

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("select sum(drec_vlrreal)");
        sqlBuilder.append("from drec_detrecaudo dd ");
        sqlBuilder.append("join dfac_detfactura df on df.dfac_ideregistr = dd.dfac_ideregistr ");
        if(tipoApro != null) {
        sqlBuilder.append("join con_concepto cc on df.uni_concepto = cc.uni_concepto ");
        }
        sqlBuilder.append("where dd.fac_ideregistro in (:idFactura) ");
        if(tipoApro != null){
            sqlBuilder.append("and cc.con_propiedad -> ");
            sqlBuilder.append(tipoApro.concat(" = 'true' "));
        }

        sqlBuilder.append("and dd.drec_fecha <= :fecLimiteProc ");

        Query query = this.em.createNativeQuery(sqlBuilder.toString());
        query.setParameter("fecLimiteProc", fechaLimiteProc);
        query.setParameter("idFactura", idFactura);
        return query.getSingleResult();

    }
}
