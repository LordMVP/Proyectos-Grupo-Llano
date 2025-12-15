package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class OrderDetailReportForm
 */

public class OrderDetailReportForm {
    private String initialDate;
    private String endDate;
    private List<Long> idTerceroList;

    public String getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(String initialDate) {
        this.initialDate = initialDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public List<Long> getIdTerceroList() {
        return idTerceroList;
    }

    public void setIdTerceroList(List<Long> idTerceroList) {
        this.idTerceroList = idTerceroList;
    }
}
