package com.bioagricola.apirest.aprovechamiento.model;

import java.math.BigDecimal;
public class SevenDataDto {
    private Integer codeCompany;
    private Integer year;
    private Integer month;
    private Integer codeConcf;
    private String nameConcf;
    private BigDecimal projectedValue;
    private BigDecimal executedValue;

    public int getCodeCompany() {
        return codeCompany;
    }

    public void setCodeCompany(int codeCompany) {
        this.codeCompany = codeCompany;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getCodeConcf() {
        return codeConcf;
    }

    public void setCodeConcf(int codeConcf) {
        this.codeConcf = codeConcf;
    }

    public String getNameConcf() {
        return nameConcf;
    }

    public void setNameConcf(String nameConcf) {
        this.nameConcf = nameConcf;
    }

    public BigDecimal getProjectedValue() {
        return projectedValue;
    }

    public void setProjectedValue(BigDecimal projectedValue) {
        this.projectedValue = projectedValue;
    }

    public BigDecimal getExecutedValue() {
        return executedValue;
    }

    public void setExecutedValue(BigDecimal executedValue) {
        this.executedValue = executedValue;
    }
}
