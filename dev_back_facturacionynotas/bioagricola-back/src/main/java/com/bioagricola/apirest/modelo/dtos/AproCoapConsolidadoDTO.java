package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class AproCoapConsolidadoDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private Long terIderegistro;

    private String terNomcompleto;

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

    /*-----------------------------------------*/
    private BigDecimal coapSaldoFactIa;

    private BigDecimal coapCambioVlrCteIa;

    private BigDecimal coapPagoCteIa;

    private BigDecimal coapCambioVlrPagoCteIa;

    private BigDecimal coapVlrCastigadoIa;

    private Integer facIderegistro;

    private Integer prlIdregistro;

    private Long perIdregistr;

    private Integer perFacturacion;

    /*-------------------------------*/
    private Integer coapIderegistro;

    private Integer dprlIderegistro;

    private BigDecimal dinc;

    private String estado;

    private Integer coapNumeroHilo;

    private Integer usuIderegistro;

    private Date fechaReg;

    private String aprovechamiento;

    public AproCoapConsolidadoDTO() {
    }

    public Integer getCoapIderegistro() {
        return coapIderegistro;
    }

    public void setCoapIderegistro(Integer coapIderegistro) {
        this.coapIderegistro = coapIderegistro;
    }

    public Integer getDprlIderegistro() {
        return dprlIderegistro;
    }

    public void setDprlIderegistro(Integer dprlIderegistro) {
        this.dprlIderegistro = dprlIderegistro;
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

    public BigDecimal getDinc() {
        return dinc;
    }

    public void setDinc(BigDecimal dinc) {
        this.dinc = dinc;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTerNomcompleto() {
        return terNomcompleto;
    }

    public void setTerNomcompleto(String terNomcompleto) {
        this.terNomcompleto = terNomcompleto;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Date getFechaReg() {
        return fechaReg;
    }

    public void setFechaReg(Date fechaReg) {
        this.fechaReg = fechaReg;
    }

    public BigDecimal getCoapSaldoFactIa() {
        return coapSaldoFactIa;
    }

    public void setCoapSaldoFactIa(BigDecimal coapSaldoFactIa) {
        this.coapSaldoFactIa = coapSaldoFactIa;
    }

    public BigDecimal getCoapCambioVlrCteIa() {
        return coapCambioVlrCteIa;
    }

    public void setCoapCambioVlrCteIa(BigDecimal coapCambioVlrCteIa) {
        this.coapCambioVlrCteIa = coapCambioVlrCteIa;
    }

    public BigDecimal getCoapPagoCteIa() {
        return coapPagoCteIa;
    }

    public void setCoapPagoCteIa(BigDecimal coapPagoCteIa) {
        this.coapPagoCteIa = coapPagoCteIa;
    }

    public BigDecimal getCoapCambioVlrPagoCteIa() {
        return coapCambioVlrPagoCteIa;
    }

    public void setCoapCambioVlrPagoCteIa(BigDecimal coapCambioVlrPagoCteIa) {
        this.coapCambioVlrPagoCteIa = coapCambioVlrPagoCteIa;
    }

    public BigDecimal getCoapVlrCastigadoIa() {
        return coapVlrCastigadoIa;
    }

    public void setCoapVlrCastigadoIa(BigDecimal coapVlrCastigadoIa) {
        this.coapVlrCastigadoIa = coapVlrCastigadoIa;
    }

    public Integer getCoapNumeroHilo() {
        return coapNumeroHilo;
    }

    public void setCoapNumeroHilo(Integer coapNumeroHilo) {
        this.coapNumeroHilo = coapNumeroHilo;
    }

    public String getAprovechamiento() {
        return aprovechamiento;
    }

    public void setAprovechamiento(String aprovechamiento) {
        this.aprovechamiento = aprovechamiento;
    }

    public Integer getFacIderegistro() {
        return facIderegistro;
    }

    public void setFacIderegistro(Integer facIderegistro) {
        this.facIderegistro = facIderegistro;
    }

    public Integer getPrlIdregistro() {
        return prlIdregistro;
    }

    public void setPrlIdregistro(Integer prlIdregistro) {
        this.prlIdregistro = prlIdregistro;
    }

    public Long getPerIdregistr() {
        return perIdregistr;
    }

    public void setPerIdregistr(Long perIdregistr) {
        this.perIdregistr = perIdregistr;
    }

    public Integer getPerFacturacion() {
        return perFacturacion;
    }

    public void setPerFacturacion(Integer perFacturacion) {
        this.perFacturacion = perFacturacion;
    }

}
