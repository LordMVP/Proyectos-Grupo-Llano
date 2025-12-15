package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class BalanceReportForm
 */

public class BalanceReportForm {
    private List<Long> idTerceroList;
    private List<SettlementPeriodForm> settlementPeriods;

    public List<Long> getIdTerceroList() {
        return idTerceroList;
    }

    public void setIdTerceroList(List<Long> idTerceroList) {
        this.idTerceroList = idTerceroList;
    }

    public List<SettlementPeriodForm> getSettlementPeriods() {
        return settlementPeriods;
    }

    public void setSettlementPeriods(List<SettlementPeriodForm> settlementPeriods) {
        this.settlementPeriods = settlementPeriods;
    }

}
