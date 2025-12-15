package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;

public class NotesChangeValueDto {
    private String dateRegisterNote;
    private BigDecimal idNote;
    private String liquidationPeriod;
    private String document;
    private String documentType;
    private String concept;
    private BigDecimal valueChangeTA;
    private BigDecimal changeValuePaid;
    private String collectedPeriod;

    public String getDateRegisterNote() {
        return dateRegisterNote;
    }

    public void setDateRegisterNote(String dateRegisterNote) {
        this.dateRegisterNote = dateRegisterNote;
    }

    public BigDecimal getIdNote() {
        return idNote;
    }

    public void setIdNote(BigDecimal idNote) {
        this.idNote = idNote;
    }

    public String getLiquidationPeriod() {
        return liquidationPeriod;
    }

    public void setLiquidationPeriod(String liquidationPeriod) {
        this.liquidationPeriod = liquidationPeriod;
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

    public BigDecimal getValueChangeTA() {
        return valueChangeTA;
    }

    public void setValueChangeTA(BigDecimal valueChangeTA) {
        this.valueChangeTA = valueChangeTA;
    }

    public BigDecimal getChangeValuePaid() {
        return changeValuePaid;
    }

    public void setChangeValuePaid(BigDecimal changeValuePaid) {
        this.changeValuePaid = changeValuePaid;
    }

    public String getCollectedPeriod() {
        return collectedPeriod;
    }

    public void setCollectedPeriod(String collectedPeriod) {
        this.collectedPeriod = collectedPeriod;
    }

}
