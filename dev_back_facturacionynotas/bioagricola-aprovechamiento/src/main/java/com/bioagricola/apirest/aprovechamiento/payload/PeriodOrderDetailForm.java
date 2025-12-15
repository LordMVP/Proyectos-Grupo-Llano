package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class PeriodOrderDetailForm
 */

public class PeriodOrderDetailForm {
    private List<Long> idTerceroList;
    private List<SettlementPeriodForm> settlementPeriods;

    public List<SettlementPeriodForm> getSettlementPeriods() {
        return settlementPeriods;
    }

    public void setSettlementPeriods(List<SettlementPeriodForm> settlementPeriods) {
        this.settlementPeriods = settlementPeriods;
    }

    public List<Long> getIdTerceroList() {
        return idTerceroList;
    }

    public void setIdTerceroList(List<Long> idTerceroList) {
        this.idTerceroList = idTerceroList;
    }
}
