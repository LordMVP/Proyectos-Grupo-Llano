/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import java.util.Date;

/**
 *
 * @author lrey
 */
public class RecaudoWebLogDTO {

    private Long idRecaudoWebLog;
    private Long idRecaudoWeb;
    private Date fecha = new Date();
    private String returnCode;
    private String state;
    private String paymentId;
    private Double amount;
    private Double vatAmount;
    private String bankCode;
    private String serviceCode;
    private String trazabilityCode;
    private int cycleNumber;
    private String referenceNumber3;
    private String referenceNumber2;
    private String referenceNumber1;
    private Date solicitedDate;
    private String xmlInicio;
    private String respuesta;

    public Long getIdRecaudoWebLog() {
        return idRecaudoWebLog;
    }

    public void setIdRecaudoWebLog(Long idRecaudoWebLog) {
        this.idRecaudoWebLog = idRecaudoWebLog;
    }

    public Long getIdRecaudoWeb() {
        return idRecaudoWeb;
    }

    public void setIdRecaudoWeb(Long idRecaudoWeb) {
        this.idRecaudoWeb = idRecaudoWeb;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getReturnCode() {
        return returnCode;
    }

    public void setReturnCode(String returnCode) {
        this.returnCode = returnCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getVatAmount() {
        return vatAmount;
    }

    public void setVatAmount(Double vatAmount) {
        this.vatAmount = vatAmount;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getTrazabilityCode() {
        return trazabilityCode;
    }

    public void setTrazabilityCode(String trazabilityCode) {
        this.trazabilityCode = trazabilityCode;
    }

    public int getCycleNumber() {
        return cycleNumber;
    }

    public void setCycleNumber(int cycleNumber) {
        this.cycleNumber = cycleNumber;
    }

    public String getReferenceNumber3() {
        return referenceNumber3;
    }

    public void setReferenceNumber3(String referenceNumber3) {
        this.referenceNumber3 = referenceNumber3;
    }

    public String getReferenceNumber2() {
        return referenceNumber2;
    }

    public void setReferenceNumber2(String referenceNumber2) {
        this.referenceNumber2 = referenceNumber2;
    }

    public String getReferenceNumber1() {
        return referenceNumber1;
    }

    public void setReferenceNumber1(String referenceNumber1) {
        this.referenceNumber1 = referenceNumber1;
    }

    public Date getSolicitedDate() {
        return solicitedDate;
    }

    public void setSolicitedDate(Date solicitedDate) {
        this.solicitedDate = solicitedDate;
    }

    public String getXmlInicio() {
        return xmlInicio;
    }

    public void setXmlInicio(String xmlInicio) {
        this.xmlInicio = xmlInicio;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

}
