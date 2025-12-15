package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.Date;

public class ConsolidationReportDto {
    private Date benefitPeriod;
    private String benefitPeriodString;
    private Date liquidationPeriod;
    private String liquidationPeriodString;
    // Facturado Corriente
    private Double valueCC;
    private Double percentageCC;
    private Double valueTA;
    private Double percentageTA;
    private Double valueTADinc;
    private Double percentageTADinc;
    private Double totalsStream; // Total Corriente
    // Facturado Ajuste
    private Double adjustValueCC;
    private Double adjustPercentageCC;
    private Double adjustValueTA;
    private Double adjustPercentageTA;
    private Double adjustValueTADinc;
    private Double adjustPercentageTADinc;
    private Double totalsAdjust; // Total Ajuste
    // Facturado Semestral
    private Double semesterValueCC;
    private Double semesterPercentageCC;
    private Double semesterValueTA;
    private Double semesterPercentageTA;
    private Double semesterValueTADinc;
    private Double semesterPercentageTADinc;
    private Double totalsSemester; // Total Semestral

    private Double totals; // Total

    public Date getBenefitPeriod() {
        return benefitPeriod;
    }

    public void setBenefitPeriod(Date benefitPeriod) {
        this.benefitPeriod = benefitPeriod;
    }

    public String getBenefitPeriodString() {
        return benefitPeriodString;
    }

    public void setBenefitPeriodString(String benefitPeriodString) {
        this.benefitPeriodString = benefitPeriodString;
    }

    public Date getLiquidationPeriod() {
        return liquidationPeriod;
    }

    public void setLiquidationPeriod(Date liquidationPeriod) {
        this.liquidationPeriod = liquidationPeriod;
    }

    public String getLiquidationPeriodString() {
        return liquidationPeriodString;
    }

    public void setLiquidationPeriodString(String liquidationPeriodString) {
        this.liquidationPeriodString = liquidationPeriodString;
    }

    public Double getValueCC() {
        return valueCC;
    }

    public void setValueCC(Double valueCC) {
        this.valueCC = valueCC;
    }

    public Double getPercentageCC() {
        return percentageCC;
    }

    public void setPercentageCC(Double percentageCC) {
        this.percentageCC = percentageCC;
    }

    public Double getValueTA() {
        return valueTA;
    }

    public void setValueTA(Double valueTA) {
        this.valueTA = valueTA;
    }

    public Double getPercentageTA() {
        return percentageTA;
    }

    public void setPercentageTA(Double percentageTA) {
        this.percentageTA = percentageTA;
    }

    public Double getValueTADinc() {
        return valueTADinc;
    }

    public void setValueTADinc(Double valueTADinc) {
        this.valueTADinc = valueTADinc;
    }



    public Double getTotalsStream() {
        return totalsStream;
    }

    public void setTotalsStream(Double totalsStream) {
        this.totalsStream = totalsStream;
    }

    public Double getAdjustValueCC() {
        return adjustValueCC;
    }

    public void setAdjustValueCC(Double adjustValueCC) {
        this.adjustValueCC = adjustValueCC;
    }

    public Double getAdjustPercentageCC() {
        return adjustPercentageCC;
    }

    public void setAdjustPercentageCC(Double adjustPercentageCC) {
        this.adjustPercentageCC = adjustPercentageCC;
    }

    public Double getAdjustValueTA() {
        return adjustValueTA;
    }

    public void setAdjustValueTA(Double adjustValueTA) {
        this.adjustValueTA = adjustValueTA;
    }

    public Double getAdjustPercentageTA() {
        return adjustPercentageTA;
    }

    public void setAdjustPercentageTA(Double adjustPercentageTA) {
        this.adjustPercentageTA = adjustPercentageTA;
    }

    public Double getAdjustValueTADinc() {
        return adjustValueTADinc;
    }

    public void setAdjustValueTADinc(Double adjustValueTADinc) {
        this.adjustValueTADinc = adjustValueTADinc;
    }

    public Double getAdjustPercentageTADinc() {
        return adjustPercentageTADinc;
    }

    public void setAdjustPercentageTADinc(Double adjustPercentageTADinc) {
        this.adjustPercentageTADinc = adjustPercentageTADinc;
    }

    public Double getPercentageTADinc() {
        return percentageTADinc;
    }

    public void setPercentageTADinc(Double percentageTADinc) {
        this.percentageTADinc = percentageTADinc;
    }

    public Double getTotalsAdjust() {
        return totalsAdjust;
    }

    public void setTotalsAdjust(Double totalsAdjust) {
        this.totalsAdjust = totalsAdjust;
    }

    public Double getSemesterValueCC() {
        return semesterValueCC;
    }

    public void setSemesterValueCC(Double semesterValueCC) {
        this.semesterValueCC = semesterValueCC;
    }

    public Double getSemesterPercentageCC() {
        return semesterPercentageCC;
    }

    public void setSemesterPercentageCC(Double semesterPercentageCC) {
        this.semesterPercentageCC = semesterPercentageCC;
    }

    public Double getSemesterValueTA() {
        return semesterValueTA;
    }

    public void setSemesterValueTA(Double semesterValueTA) {
        this.semesterValueTA = semesterValueTA;
    }

    public Double getSemesterPercentageTA() {
        return semesterPercentageTA;
    }

    public void setSemesterPercentageTA(Double semesterPercentageTA) {
        this.semesterPercentageTA = semesterPercentageTA;
    }

    public Double getSemesterValueTADinc() {
        return semesterValueTADinc;
    }

    public void setSemesterValueTADinc(Double semesterValueTADinc) {
        this.semesterValueTADinc = semesterValueTADinc;
    }

    public Double getSemesterPercentageTADinc() {
        return semesterPercentageTADinc;
    }

    public void setSemesterPercentageTADinc(Double semesterPercentageTADinc) {
        this.semesterPercentageTADinc = semesterPercentageTADinc;
    }

    public Double getTotalsSemester() {
        return totalsSemester;
    }

    public void setTotalsSemester(Double totalsSemester) {
        this.totalsSemester = totalsSemester;
    }

    public Double getTotals() {
        return totals;
    }

    public void setTotals(Double totals) {
        this.totals = totals;
    }
}
