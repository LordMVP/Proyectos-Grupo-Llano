package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class BalanceReportForm
 */

public class AprBalanceReportForm {
    private List<Long> idTerceroList;

    private int period;
    private SettlementPeriodForm settlementPeriod;

    public List<Long> getIdTerceroList() {
        return idTerceroList;
    }

    public void setIdTerceroList(List<Long> idTerceroList) {
        this.idTerceroList = idTerceroList;
    }

    public SettlementPeriodForm getSettlementPeriod() {
        return settlementPeriod;
    }

    public void setSettlementPeriod(SettlementPeriodForm settlementPeriods) {
        this.settlementPeriod = settlementPeriods;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }
}
