package com.bioagricola.apirest.modelo.projections;

import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author yasilva
 */
public interface DetPeriodoAproGirosProjection {
    
    Long getTer_ideregistro();
    String getTer_nomcompleto();
    String getOficioconciliacion_tercero();
    Integer getNumeroactacon_tercero();
    BigDecimal getPagocc();
    BigDecimal getPagota();
    BigDecimal getPagoiat();
    Date getAprconc_fechagiro();
}
