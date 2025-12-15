package com.bioagricola.apirest.aprovechamiento.payload;

import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ConsolidarForm
 */
public class ConsolidationForm {
    private String period;
    private Date billingCutOffDate; // Fecha Corte Facturacion
    private Date processingDeadlineDate; // Fecha Limite Procesamiento

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Date getBillingCutOffDate() {
        return billingCutOffDate;
    }

    public void setBillingCutOffDate(Date billingCutOffDate) {
        this.billingCutOffDate = billingCutOffDate;
    }

    public Date getProcessingDeadlineDate() {
        return processingDeadlineDate;
    }

    public void setProcessingDeadlineDate(Date processingDeadlineDate) {
        this.processingDeadlineDate = processingDeadlineDate;
    }
}
