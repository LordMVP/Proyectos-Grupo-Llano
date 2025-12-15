package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;

public class InvoiceWrittenOffDto { // facturas castigadas
    private Long idNote;
    private Long idParentInvoice;
    private String parentDocInvoice;
    private String parentDocTypeInvoice;
    private String settlementPeriod;
    private String document;
    private String documentType;
    private String concept;
    private BigDecimal punishedValue;
    private String punishedPeriod;

    public Long getIdNote() {
        return idNote;
    }

    public void setIdNote(Long idNote) {
        this.idNote = idNote;
    }

    public Long getIdParentInvoice() {
        return idParentInvoice;
    }

    public void setIdParentInvoice(Long idParentInvoice) {
        this.idParentInvoice = idParentInvoice;
    }

    public String getParentDocInvoice() {
        return parentDocInvoice;
    }

    public void setParentDocInvoice(String parentDocInvoice) {
        this.parentDocInvoice = parentDocInvoice;
    }

    public String getParentDocTypeInvoice() {
        return parentDocTypeInvoice;
    }

    public void setParentDocTypeInvoice(String parentDocTypeInvoice) {
        this.parentDocTypeInvoice = parentDocTypeInvoice;
    }

    public String getSettlementPeriod() {
        return settlementPeriod;
    }

    public void setSettlementPeriod(String settlementPeriod) {
        this.settlementPeriod = settlementPeriod;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public BigDecimal getPunishedValue() {
        return punishedValue;
    }

    public void setPunishedValue(BigDecimal punishedValue) {
        this.punishedValue = punishedValue;
    }

    public String getPunishedPeriod() {
        return punishedPeriod;
    }

    public void setPunishedPeriod(String punishedPeriod) {
        this.punishedPeriod = punishedPeriod;
    }
}
