package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ThirdCollectionCrossingDto
 */
public class ThirdCollectionCrossingDto { // Cruce Recaudo Tercero
    private BigInteger idInvoice;
    private BigInteger codSubscription;
    private String benefitPeriod;
    private String liquidationPeriod;
    private String document;
    private String documentType;
    private String concept;
    private BigDecimal valuePaid;
    private String periodCollected;
    private BigDecimal tara;

    public BigInteger getIdInvoice() {
        return idInvoice;
    }

    public void setIdInvoice(BigInteger idInvoice) {
        this.idInvoice = idInvoice;
    }

    public BigInteger getCodSubscription() {
        return codSubscription;
    }

    public void setCodSubscription(BigInteger codSubscription) {
        this.codSubscription = codSubscription;
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

    public String getPeriodCollected() {
        return periodCollected;
    }

    public void setPeriodCollected(String periodCollected) {
        this.periodCollected = periodCollected;
    }

    public BigDecimal getTara() {
        return tara;
    }

    public void setTara(BigDecimal tara) {
        this.tara = tara;
    }
}
