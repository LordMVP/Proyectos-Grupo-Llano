package com.bioagricola.apirest.modelo.projections;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 *
 * @author yasilva
 */
public interface LogFacturaApiEmsaProjection {
    Long getLog_ideregistro();
    Timestamp getFecha();
    String getCodigo_bio();
    String getCodigo_emsa();
    String getCodigo_ean();
    Long getNum_factura();
    BigDecimal getValor_anterior();
    BigDecimal getValor_generado();
    Long getUsu_ideregistro();
    String getLog_tipo();
    String getAuditoria(); 
}
