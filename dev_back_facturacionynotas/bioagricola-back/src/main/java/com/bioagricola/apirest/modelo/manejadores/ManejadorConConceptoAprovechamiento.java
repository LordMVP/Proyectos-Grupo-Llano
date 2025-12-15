package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.bioagricola.apirest.modelo.entidades.ConConcepto;

@Repository
public class ManejadorConConceptoAprovechamiento {

    @PersistenceContext
    EntityManager em;

    public List<Object> validarParam(String TIPO_APROVECHAMIENTO,String TIPO_INCENTIVO_APROVECHAMIENTO) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT c.uni_concepto, c.con_nombre FROM con_concepto c ");
        sql.append("WHERE C.con_propiedad -> ");
        sql.append(TIPO_APROVECHAMIENTO);
        sql.append(" = 'true' ");
        sql.append("or C.con_propiedad ->");
        sql.append(TIPO_INCENTIVO_APROVECHAMIENTO);
        sql.append(" = 'true' ");
        sql.append("and c.uni_concepto not in (");
        sql.append("select cca.uni_concepto  ");
        sql.append("from aseo.coli_conliquida_apro cca where cca.coli_estado = 'A')");

        Query nativeQuery = this.em.createNativeQuery(sql.toString());
        return nativeQuery.getResultList();
    }

    public List<ConConcepto> getConceptosFactura(String tipoApro, Long idFactura) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT * FROM con_concepto c ");
        sql.append("join dfac_detfactura dd on dd.uni_concepto = c.uni_concepto ");
        sql.append("WHERE c.con_propiedad ->> ");
        sql.append(tipoApro);
        sql.append(" = 'true' ");
        sql.append("and  dd.fac_ideregistro= :fac_ideregistro");

        Query nativeQuery = this.em.createNativeQuery(sql.toString(), ConConcepto.class);
        nativeQuery.setParameter("fac_ideregistro", idFactura);
        return nativeQuery.getResultList();
    }
}
