package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;

public class ReportBudgetDto{
    private Map<String, BigDecimal> budgetReport;
    private Map<String, BigDecimal> analysisReportBudget;
    private Date start;
    private Date end;

    public Map<String, BigDecimal> getBudgetReport() {
        return budgetReport;
    }

    public void setBudgetReport(Map<String, BigDecimal> budgetReport) {
        this.budgetReport = budgetReport;
    }

    public Map<String, BigDecimal> getAnalysisReportBudget() {
        return analysisReportBudget;
    }

    public void setAnalysisReportBudget(Map<String, BigDecimal> analysisReportBudget) {
        this.analysisReportBudget = analysisReportBudget;
    }

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
}
