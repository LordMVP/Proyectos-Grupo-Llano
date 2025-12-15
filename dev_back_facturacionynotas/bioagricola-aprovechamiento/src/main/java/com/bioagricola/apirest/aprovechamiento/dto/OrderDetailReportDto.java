package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class OrderDetailReportDto
 */

public class OrderDetailReportDto {
    private String association;
    private BigDecimal total;
    private Date start;
    private Date end;

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public String getAssociation() {
        return association;
    }

    public void setAssociation(String association) {
        this.association = association;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
