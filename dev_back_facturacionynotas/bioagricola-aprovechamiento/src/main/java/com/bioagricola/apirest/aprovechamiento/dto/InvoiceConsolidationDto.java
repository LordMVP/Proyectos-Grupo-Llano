package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class InvoiceConsolidationDto {
    private Integer idInvoice;
    private Integer idSettlement;
    private Integer idFin;
    private Integer idAmo;
    private Integer idPeriod;
    private BigDecimal actualInvoiceValue;
    private String invoiceState;
    private Date deadLineDate;
    private Integer idProject;
    private List<InvoiceUseDetailDto> details;

    public Integer getIdInvoice() {
        return idInvoice;
    }

    public void setIdInvoice(Integer idInvoice) {
        this.idInvoice = idInvoice;
    }

    public Integer getIdSettlement() {
        return idSettlement;
    }

    public void setIdSettlement(Integer idSettlement) {
        this.idSettlement = idSettlement;
    }

    public Integer getIdFin() {
        return idFin;
    }

    public void setIdFin(Integer idFin) {
        this.idFin = idFin;
    }

    public Integer getIdAmo() {
        return idAmo;
    }

    public void setIdAmo(Integer idAmo) {
        this.idAmo = idAmo;
    }

    public Integer getIdPeriod() {
        return idPeriod;
    }

    public void setIdPeriod(Integer idPeriod) {
        this.idPeriod = idPeriod;
    }

    public BigDecimal getActualInvoiceValue() {
        return actualInvoiceValue;
    }

    public void setActualInvoiceValue(BigDecimal actualInvoiceValue) {
        this.actualInvoiceValue = actualInvoiceValue;
    }

    public List<InvoiceUseDetailDto> getDetails() {
        return details;
    }

    public void setDetails(List<InvoiceUseDetailDto> details) {
        this.details = details;
    }

    public String getInvoiceState() {
        return invoiceState;
    }

    public void setInvoiceState(String invoiceState) {
        this.invoiceState = invoiceState;
    }

    public Date getDeadLineDate() {
        return deadLineDate;
    }

    public void setDeadLineDate(Date deadLineDate) {
        this.deadLineDate = deadLineDate;
    }

    public Integer getIdProject() {
        return idProject;
    }

    public void setIdProject(Integer idProject) {
        this.idProject = idProject;
    }
}

