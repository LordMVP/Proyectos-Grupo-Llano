package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class PeriodOrderDetailDto
 */

public class PeriodOrderDetailDto {
    private String paymentTradeNumber;
    private String minuteNumber;
    private String period;
    private BigDecimal orderValueCC;
    private BigDecimal orderValueTA;
    private BigDecimal orderValueIAT;
    private BigDecimal orderValueTotal;
    private String orderDate;

    public String getPaymentTradeNumber() {
        return paymentTradeNumber;
    }

    public void setPaymentTradeNumber(String paymentTradeNumber) {
        this.paymentTradeNumber = paymentTradeNumber;
    }

    public String getMinuteNumber() {
        return minuteNumber;
    }

    public void setMinuteNumber(String minuteNumber) {
        this.minuteNumber = minuteNumber;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getOrderValueCC() {
        return orderValueCC;
    }

    public void setOrderValueCC(BigDecimal orderValueCC) {
        this.orderValueCC = orderValueCC;
    }

    public BigDecimal getOrderValueTA() {
        return orderValueTA;
    }

    public void setOrderValueTA(BigDecimal orderValueTA) {
        this.orderValueTA = orderValueTA;
    }

    public BigDecimal getOrderValueIAT() {
        return orderValueIAT;
    }

    public void setOrderValueIAT(BigDecimal orderValueIAT) {
        this.orderValueIAT = orderValueIAT;
    }
    
    public BigDecimal getOrderValueTotal() {
        return orderValueTotal;
    }

    public void setOrderValueTotal(BigDecimal orderValueTotal) {
        this.orderValueTotal = orderValueTotal;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }
}
