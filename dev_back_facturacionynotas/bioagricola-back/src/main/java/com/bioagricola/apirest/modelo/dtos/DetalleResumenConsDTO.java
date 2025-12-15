package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class DetalleResumenConsDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private long id;
    
    private BigInteger perIderegistro;

    private Integer fechaFacturacion;

    private Integer fechaPrestacion;

    private BigDecimal coapSaldoFactCc;

    private BigDecimal coapSaldoFactTa;

    private BigDecimal coapCambioVlrCteTa;

    private BigDecimal coapPagoCteCc;

    private BigDecimal coapPagoCteTa;

    private BigDecimal coapFactAjusteCc;

    private BigDecimal coapFactAjusteTa;

    private BigDecimal coapPagoAjusteCc;

    private BigDecimal coapPagoAjusteTa;

    private BigDecimal coapCambioVlrPagoCte;

    private BigDecimal coapVlrCastigado;

    public DetalleResumenConsDTO() {
        //constructor por defecto
    }

    public BigDecimal getCoapSaldoFactCc() {
        return coapSaldoFactCc;
    }

    public void setCoapSaldoFactCc(BigDecimal coapSaldoFactCc) {
        this.coapSaldoFactCc = coapSaldoFactCc;
    }

    public BigDecimal getCoapSaldoFactTa() {
        return coapSaldoFactTa;
    }

    public void setCoapSaldoFactTa(BigDecimal coapSaldoFactTa) {
        this.coapSaldoFactTa = coapSaldoFactTa;
    }

    public BigDecimal getCoapCambioVlrCteTa() {
        return coapCambioVlrCteTa;
    }

    public void setCoapCambioVlrCteTa(BigDecimal coapCambioVlrCteTa) {
        this.coapCambioVlrCteTa = coapCambioVlrCteTa;
    }

    public BigDecimal getCoapPagoCteCc() {
        return coapPagoCteCc;
    }

    public void setCoapPagoCteCc(BigDecimal coapPagoCteCc) {
        this.coapPagoCteCc = coapPagoCteCc;
    }

    public BigDecimal getCoapPagoCteTa() {
        return coapPagoCteTa;
    }

    public void setCoapPagoCteTa(BigDecimal coapPagoCteTa) {
        this.coapPagoCteTa = coapPagoCteTa;
    }

    public BigDecimal getCoapFactAjusteCc() {
        return coapFactAjusteCc;
    }

    public void setCoapFactAjusteCc(BigDecimal coapFactAjusteCc) {
        this.coapFactAjusteCc = coapFactAjusteCc;
    }

    public BigDecimal getCoapFactAjusteTa() {
        return coapFactAjusteTa;
    }

    public void setCoapFactAjusteTa(BigDecimal coapFactAjusteTa) {
        this.coapFactAjusteTa = coapFactAjusteTa;
    }

    public BigDecimal getCoapPagoAjusteCc() {
        return coapPagoAjusteCc;
    }

    public void setCoapPagoAjusteCc(BigDecimal coapPagoAjusteCc) {
        this.coapPagoAjusteCc = coapPagoAjusteCc;
    }

    public BigDecimal getCoapPagoAjusteTa() {
        return coapPagoAjusteTa;
    }

    public void setCoapPagoAjusteTa(BigDecimal coapPagoAjusteTa) {
        this.coapPagoAjusteTa = coapPagoAjusteTa;
    }

    public BigDecimal getCoapCambioVlrPagoCte() {
        return coapCambioVlrPagoCte;
    }

    public void setCoapCambioVlrPagoCte(BigDecimal coapCambioVlrPagoCte) {
        this.coapCambioVlrPagoCte = coapCambioVlrPagoCte;
    }

    public BigDecimal getCoapVlrCastigado() {
        return coapVlrCastigado;
    }

    public void setCoapVlrCastigado(BigDecimal coapVlrCastigado) {
        this.coapVlrCastigado = coapVlrCastigado;
    }

    public BigInteger getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(BigInteger perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public Integer getFechaFacturacion() {
        return fechaFacturacion;
    }

    public void setFechaFacturacion(Integer fechaFacturacion) {
        this.fechaFacturacion = fechaFacturacion;
    }

    public Integer getFechaPrestacion() {
        return fechaPrestacion;
    }

    public void setFechaPrestacion(Integer fechaPrestacion) {
        this.fechaPrestacion = fechaPrestacion;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    
}
