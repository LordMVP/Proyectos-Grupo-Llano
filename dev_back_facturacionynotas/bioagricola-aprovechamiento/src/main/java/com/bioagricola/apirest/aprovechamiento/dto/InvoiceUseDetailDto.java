package com.bioagricola.apirest.aprovechamiento.dto;

public class InvoiceUseDetailDto {
    private Integer idDetailInvoice;
    private Integer percentage;
    private Integer idConcept;
    private Integer idDrec;

    public InvoiceUseDetailDto() {
    }

    public InvoiceUseDetailDto(Integer idDetailInvoice, Integer percentage, Integer idConcept) {
        this.idDetailInvoice = idDetailInvoice;
        this.percentage = percentage;
        this.idConcept = idConcept;
    }

    public Integer getIdConcept() {
        return idConcept;
    }

    public void setIdConcept(Integer idConcept) {
        this.idConcept = idConcept;
    }

    public Integer getIdDetailInvoice() {
        return idDetailInvoice;
    }

    public void setIdDetailInvoice(Integer idDetailInvoice) {
        this.idDetailInvoice = idDetailInvoice;
    }

    public Integer getPercentage() {
        return percentage;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }

    public Integer getIdDrec() {
        return idDrec;
    }

    public void setIdDrec(Integer idDrec) {
        this.idDrec = idDrec;
    }
}
