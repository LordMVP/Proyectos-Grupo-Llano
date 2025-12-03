package com.bioagricola.apirest.modelo.projections;

import java.math.BigDecimal;
import java.util.Date;

public interface ConConsolidacionAprovechamientoProjection {
    String getId();
    Date getFechaExpedicion();
    BigDecimal getValor();
    BigDecimal getPorcentaje();
    Integer getUniConcepto();
}
