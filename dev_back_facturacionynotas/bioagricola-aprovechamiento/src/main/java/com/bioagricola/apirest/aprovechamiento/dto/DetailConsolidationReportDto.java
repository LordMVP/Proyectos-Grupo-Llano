package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.Date;

public class DetailConsolidationReportDto {
    /**
     * Periodo Liquidación	Cambios Valor Corriente	Cambios Valor Pago Corriente
     */
    private String liquidationPeriod;

    private Double currentChangesValue;

    private Double currentPaymentChangesValue;

    public String getLiquidationPeriod() {
        return liquidationPeriod;
    }

    public void setLiquidationPeriod(String liquidationPeriod) {
        this.liquidationPeriod = liquidationPeriod;
    }

    public Double getCurrentChangesValue() {
        return currentChangesValue;
    }

    public void setCurrentChangesValue(Double currentChangesValue) {
        this.currentChangesValue = currentChangesValue;
    }

    public Double getCurrentPaymentChangesValue() {
        return currentPaymentChangesValue;
    }

    public void setCurrentPaymentChangesValue(Double currentPaymentChangesValue) {
        this.currentPaymentChangesValue = currentPaymentChangesValue;
    }
}
