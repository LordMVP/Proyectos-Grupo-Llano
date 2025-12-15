package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

public class CriteriaSearchInvoicingReportForm {
    private List<SettlementPeriodForm> settlementPeriods;

    public List<SettlementPeriodForm> getSettlementPeriods() {
        return settlementPeriods;
    }

    public void setSettlementPeriods(List<SettlementPeriodForm> settlementPeriods) {
        this.settlementPeriods = settlementPeriods;
    }
}
