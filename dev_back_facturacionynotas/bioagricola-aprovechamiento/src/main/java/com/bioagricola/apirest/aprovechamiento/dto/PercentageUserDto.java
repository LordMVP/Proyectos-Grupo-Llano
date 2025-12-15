package com.bioagricola.apirest.aprovechamiento.dto;

import com.bioagricola.apirest.aprovechamiento.enums.EnumConcepts;

import java.math.BigDecimal;
import java.util.Date;

public class PercentageUserDto { // Porcentaje Aprovechador
    private Integer enterpriseId;
    private Integer idDetailInvoice;
    private Integer userId;
    private Integer periodId;
    private Integer conceptId;
    private Date initialPeriodDate;
    private Long idInvoice;
    private Long idThirdParty;
    private EnumConcepts enumConcepts;
    private BigDecimal percentage;
    private Integer idDetailCollection; // idrecIderegistro
    private BigDecimal valueBase;
    private BigDecimal calculatedValue;
    private Date registerDate;
    private Date deadLineDate;
    private Date dateMaximumProcessing;
    private String state;
    private Integer idProject;
    private Integer measured;
    private Integer financing;

    public Integer getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(Integer enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public Integer getIdDetailInvoice() {
        return idDetailInvoice;
    }

    public void setIdDetailInvoice(Integer idDetailInvoice) {
        this.idDetailInvoice = idDetailInvoice;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getPeriodId() {
        return periodId;
    }

    public void setPeriodId(Integer periodId) {
        this.periodId = periodId;
    }

    public Integer getConceptId() {
        return conceptId;
    }

    public void setConceptId(Integer conceptId) {
        this.conceptId = conceptId;
    }

    public Date getInitialPeriodDate() {
        return initialPeriodDate;
    }

    public void setInitialPeriodDate(Date initialPeriodDate) {
        this.initialPeriodDate = initialPeriodDate;
    }

    public Long getIdInvoice() {
        return idInvoice;
    }

    public void setIdInvoice(Long idInvoice) {
        this.idInvoice = idInvoice;
    }

    public Long getIdThirdParty() {
        return idThirdParty;
    }

    public void setIdThirdParty(Long idThirdParty) {
        this.idThirdParty = idThirdParty;
    }

    public EnumConcepts getEnumConcepts() {
        return enumConcepts;
    }

    public void setEnumConcepts(EnumConcepts enumConcepts) {
        this.enumConcepts = enumConcepts;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public Integer getIdDetailCollection() {
        return idDetailCollection;
    }

    public void setIdDetailCollection(Integer idDetailCollection) {
        this.idDetailCollection = idDetailCollection;
    }

    public BigDecimal getValueBase() {
        return valueBase;
    }

    public void setValueBase(BigDecimal valueBase) {
        this.valueBase = valueBase;
    }

    public BigDecimal getCalculatedValue() {
        return calculatedValue;
    }

    public void setCalculatedValue(BigDecimal calculatedValue) {
        this.calculatedValue = calculatedValue;
    }

    public Date getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(Date registerDate) {
        this.registerDate = registerDate;
    }

    public Date getDeadLineDate() {
        return deadLineDate;
    }

    public void setDeadLineDate(Date deadLineDate) {
        this.deadLineDate = deadLineDate;
    }

    public Date getDateMaximumProcessing() {
        return dateMaximumProcessing;
    }

    public void setDateMaximumProcessing(Date dateMaximumProcessing) {
        this.dateMaximumProcessing = dateMaximumProcessing;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getIdProject() {
        return idProject;
    }

    public void setIdProject(Integer idProject) {
        this.idProject = idProject;
    }

    public Integer getMeasured() {
        return measured;
    }

    public void setMeasured(Integer measured) {
        this.measured = measured;
    }

    public Integer getFinancing() {
        return financing;
    }

    public void setFinancing(Integer financing) {
        this.financing = financing;
    }
}
