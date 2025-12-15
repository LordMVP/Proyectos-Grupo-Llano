package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.Date;
import java.util.List;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class SearchCriteriaReportForm
 */
public class SearchCriteriaReportForm {
    private Date initialDate;
    private Date endDate;
    private List<Long> idTerceroList;

    public Date getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(Date initialDate) {
        this.initialDate = initialDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public List<Long> getIdTerceroList() {
        return idTerceroList;
    }

    public void setIdTerceroList(List<Long> idTerceroList) {
        this.idTerceroList = idTerceroList;
    }
}
