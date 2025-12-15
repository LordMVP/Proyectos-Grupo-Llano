package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.List;

public class DetailValueChangeDto { // cambios de valor
    private Double valueChange;
    private Double valuePaidChange;

    private String liquidationPeriod;
    public Double getValueChange() {
        return valueChange;
    }

    public void setValueChange(Double valueChange) {
        this.valueChange = valueChange;
    }

    public Double getValuePaidChange() {
        return valuePaidChange;
    }

    public void setValuePaidChange(Double valuePaidChange) {
        this.valuePaidChange = valuePaidChange;
    }

    public String getLiquidationPeriod() {
        return liquidationPeriod;
    }

    public void setLiquidationPeriod(String liquidationPeriod) {
        this.liquidationPeriod = liquidationPeriod;
    }
}
