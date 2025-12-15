package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class InAproCoapConsolidadoDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private Integer coapIderegistro;

    private Integer dprlIderegistro;

    private String estado;

    private String terNomcompleto;

    private Long terIderegistro;

    private BigDecimal coapSaldoFactIa;

    private BigDecimal coapFactAjusteIa;
    
    private BigDecimal coapPagoIa;

    private BigDecimal coapCambioVlrCteIa;

    private BigDecimal coapPagoCteIa;

    private BigDecimal coapCambioVlrPagoCteIa;

    private BigDecimal coapVlrCastigadoIa;

    private Integer coapNumeroHilo;

    private Integer usuIderegistro;

    private Date fechaReg;

    private String municipio;

    public InAproCoapConsolidadoDTO(
            Long terIderegistro,
            String terNomcompleto,
            String municipio,
            BigDecimal coapSaldoFactIa,
            BigDecimal coapCambioVlrCteIa,
            BigDecimal coapPagoCteIa,
            BigDecimal coapCambioVlrPagoCteIa,
            BigDecimal coapVlrCastigadoIa
    ) {
        this.terIderegistro = terIderegistro;
        this.terNomcompleto = terNomcompleto;
        this.municipio = municipio;
        this.coapSaldoFactIa = coapSaldoFactIa;
        this.coapCambioVlrCteIa = coapCambioVlrCteIa;
        this.coapPagoCteIa = coapPagoCteIa;
        this.coapCambioVlrPagoCteIa = coapCambioVlrPagoCteIa;
        this.coapVlrCastigadoIa = coapVlrCastigadoIa;

    }

    public InAproCoapConsolidadoDTO() {

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

    public String getMunicipio() {
        return municipio;
    }

    public void setMunicipio(String municipio) {
        this.municipio = municipio;
    }

    public BigDecimal getCoapFactAjusteIa() {
        return coapFactAjusteIa;
    }

    public void setCoapFactAjusteIa(BigDecimal coapFactAjusteIa) {
        this.coapFactAjusteIa = coapFactAjusteIa;
    }

    public BigDecimal getCoapPagoIa() {
        return coapPagoIa;
    }

    public void setCoapPagoIa(BigDecimal coapPagoIa) {
        this.coapPagoIa = coapPagoIa;
    }

    
}
