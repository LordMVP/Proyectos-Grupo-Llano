package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionTownHallReportDto
 */
public class CollectionTownHallReportDto {
    private Long idInvoice;
    private Integer subscriptionCode;
    private String benefitPeriod;
    private String liquidationPeriod;
    private String document;
    private String documentType;
    private String concept;
    private BigDecimal valuePaid;
    private String collectionPeriod;

    public Long getIdInvoice() {
        return idInvoice;
    }

    public void setIdInvoice(Long idInvoice) {
        this.idInvoice = idInvoice;
    }

    public Integer getSubscriptionCode() {
        return subscriptionCode;
    }

    public void setSubscriptionCode(Integer subscriptionCode) {
        this.subscriptionCode = subscriptionCode;
    }

    public String getBenefitPeriod() {
        return benefitPeriod;
    }

    public void setBenefitPeriod(String benefitPeriod) {
        this.benefitPeriod = benefitPeriod;
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

    public BigDecimal getValuePaid() {
        return valuePaid;
    }

    public void setValuePaid(BigDecimal valuePaid) {
        this.valuePaid = valuePaid;
    }

    public String getCollectionPeriod() {
        return collectionPeriod;
    }

    public void setCollectionPeriod(String collectionPeriod) {
        this.collectionPeriod = collectionPeriod;
    }
}
