package com.bioagricola.apirest.modelo.projections;

import java.math.BigDecimal;
import java.util.Date;

public interface DetailConsolidacionAprovechamientoProjection {    
    Long getIdfactura();
    Long getFac_numero();
    Date getFechaexpedicion();
    Date getFechacastigo();
    Integer getT_edadcartera();
    BigDecimal getPorcentaje_participacion();
    
    BigDecimal getT_porcentaje_cc();
    BigDecimal getT_valoracastigar_cc();
    
    BigDecimal getT_porcentaje_ta();
    BigDecimal getT_valorcastigar_ta();
    
    BigDecimal getT_porcentaje_iat();
    BigDecimal getT_valorcastigar_iat();
    
    BigDecimal getT_porcentajeajuste_cc();
    BigDecimal getT_valoracastigar_ajustecc();
    
    BigDecimal getT_porcentajeajuste_ta();
    BigDecimal getT_valoracastigar_ajusteta();
    
    BigDecimal getT_porcentajeajuste_iat();
    BigDecimal getT_valoracastigar_ajusteiat();
}
