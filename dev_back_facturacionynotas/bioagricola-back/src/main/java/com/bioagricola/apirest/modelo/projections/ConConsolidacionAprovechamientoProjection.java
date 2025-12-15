package com.bioagricola.apirest.modelo.projections;

import java.math.BigDecimal;
import java.util.Date;

public interface ConConsolidacionAprovechamientoProjection {    
    String getPeriodo_prestacion();
    String getPerodo_facturacion();
    Long getTerideregistro();
    String getTernomcompleto();
    BigDecimal getCastigo_saldo_ta();
    BigDecimal getCastigo_saldo_cc();
    BigDecimal getCastigo_saldo_ta_dinc();
    BigDecimal getCastigo_saldo_ajuste_ta();
    BigDecimal getCastigo_saldo_ajuste_ta_dinc();
    BigDecimal getCastigo_ta_aforado_valor();
    BigDecimal getCastigo_cc_fin_valor();
    BigDecimal getCastigo_ta_fin_valor();
    BigDecimal getCastigo_ta_mora_valor();
    BigDecimal getCastigo_ta_intcorriente_valor();
    BigDecimal getCastigo_saldo_iat();
    BigDecimal getCastigo_saldo_ajuste_iat();
    BigDecimal getCastigo_saldo_ajuste_cc();
    BigDecimal getCantidad_fcr();
    Date getFecha_ultimo_castigo();
}
