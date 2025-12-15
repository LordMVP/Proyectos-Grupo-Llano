package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionDetailTownHallTotalDto
 */
public class CollectionDetailTownHallTotalDto {
    Map<String, BigDecimal> totals = new HashMap<>();
    String liquidationPeriod;
    String benefitPeriod;

    public Map<String, BigDecimal> getTotals() {
        return totals;
    }

    public void setTotals(Map<String, BigDecimal> totals) {
        this.totals = totals;
    }

    public String getLiquidationPeriod() {
        return liquidationPeriod;
    }

    public void setLiquidationPeriod(String liquidationPeriod) {
        this.liquidationPeriod = liquidationPeriod;
    }

    public String getBenefitPeriod() {
        return benefitPeriod;
    }

    public void setBenefitPeriod(String benefitPeriod) {
        this.benefitPeriod = benefitPeriod;
    }

    public void setTotals(BigDecimal saldoAnteriorIAT, BigDecimal cambioVlrIAT, BigDecimal cambioVlrPagado, BigDecimal valorRecaudoFinanciado, BigDecimal pagoIAT, BigDecimal pagoAjusteIAT, BigDecimal pagoInteresMoraCorriente, BigDecimal pagoTotal, BigDecimal saldoFinalPendiente) {
        this.totals.put("saldoAnteriorIAT", saldoAnteriorIAT);
        this.totals.put("cambioVlrIAT", cambioVlrIAT);
        this.totals.put("cambioVlrPagado", cambioVlrPagado);
        this.totals.put("valorRecaudoFinanciado", valorRecaudoFinanciado);
        this.totals.put("pagoIAT", pagoIAT);
        this.totals.put("pagoAjusteIAT", pagoAjusteIAT);
        this.totals.put("pagoInteresMoraCorriente", pagoInteresMoraCorriente);
        this.totals.put("pagoTotal", pagoTotal);
        this.totals.put("saldoFinalPendiente", saldoFinalPendiente);
    }
}
