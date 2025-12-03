package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class DetRecaudoAlcaldia
 */
@Entity
@Table(name = "dreciat_detalle_recaudo_iat", schema = "aseo")
public class DetRecaudoAlcaldiaIat {
    @Id
    @SequenceGenerator(name = "sq_dreciat_recaudo_iat", sequenceName = "sq_dreciat_recaudo_iat", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sq_dreciat_recaudo_iat")
    @Column(name = "dreciat_ideregistro")
    private Integer drecIatIderegistro;

    @Column(name = "dreciat_cambio_vlr_iat")
    private BigDecimal cambioVlrIAT;

    @Column(name = "dreciat_cambio_vlr_pagado")
    private BigDecimal cambioVlrPagado;

    @Column(name = "dreciat_valor_recaudo_financiado")
    private BigDecimal valorRecaudoFinanciado;

    @Column(name = "dreciat_pago_iat")
    private BigDecimal pagoIAT;

    @Column(name = "dreciat_pago_ajuste_iat")
    private BigDecimal pagoAjusteIAT;

    @Column(name = "dreciat_pago_interesmora_corriente")
    private BigDecimal pagoInteresMoraCorriente;

    @Column(name = "ter_ideregistro")
    private Long terIderegistro;

    @Column(name = "per_fecinicial")
    private Date perFecinicial;

    @Column(name = "fecha_corte")
    private Date fechaCorte;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "dereciat_pago_total")
    private BigDecimal pagoTotal;

    @Column(name = "dereciat_saldo_final_pendiente")
    private BigDecimal saldoFinalPendiente;

    @Transient
    private BigDecimal saldoAnteriorIAT;

    public Integer getDrecIatIderegistro() {
        return drecIatIderegistro;
    }

    public void setDrecIatIderegistro(Integer drecIderegistro) {
        this.drecIatIderegistro = drecIderegistro;
    }

    public BigDecimal getCambioVlrIAT() {
        return cambioVlrIAT;
    }

    public void setCambioVlrIAT(BigDecimal cambioVlrIAT) {
        this.cambioVlrIAT = cambioVlrIAT;
    }

    public BigDecimal getCambioVlrPagado() {
        return cambioVlrPagado;
    }

    public void setCambioVlrPagado(BigDecimal cambioVlrPagado) {
        this.cambioVlrPagado = cambioVlrPagado;
    }

    public BigDecimal getValorRecaudoFinanciado() {
        return valorRecaudoFinanciado;
    }

    public void setValorRecaudoFinanciado(BigDecimal valorRecaudoFinanciado) {
        this.valorRecaudoFinanciado = valorRecaudoFinanciado;
    }

    public BigDecimal getPagoIAT() {
        return pagoIAT;
    }

    public void setPagoIAT(BigDecimal pagoIAT) {
        this.pagoIAT = pagoIAT;
    }

    public BigDecimal getPagoAjusteIAT() {
        return pagoAjusteIAT;
    }

    public void setPagoAjusteIAT(BigDecimal pagoAjusteIAT) {
        this.pagoAjusteIAT = pagoAjusteIAT;
    }

    public BigDecimal getPagoInteresMoraCorriente() {
        return pagoInteresMoraCorriente;
    }

    public void setPagoInteresMoraCorriente(BigDecimal pagoInteresMoraYCorriente) {
        this.pagoInteresMoraCorriente = pagoInteresMoraYCorriente;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Date getPerFecinicial() {
        return perFecinicial;
    }

    public void setPerFecinicial(Date perFecinicial) {
        this.perFecinicial = perFecinicial;
    }

    public Date getFechaCorte() {
        return fechaCorte;
    }

    public void setFechaCorte(Date fechaCorte) {
        this.fechaCorte = fechaCorte;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public BigDecimal getSaldoAnteriorIAT() {
        return saldoAnteriorIAT;
    }

    public void setSaldoAnteriorIAT(BigDecimal saldoAnteriorIAT) {
        this.saldoAnteriorIAT = saldoAnteriorIAT;
    }

    public BigDecimal getPagoTotal() {
        return pagoTotal;
    }

    public void setPagoTotal(BigDecimal pagoTotal) {
        this.pagoTotal = pagoTotal;
    }

    public BigDecimal getSaldoFinalPendiente() {
        return saldoFinalPendiente;
    }

    public void setSaldoFinalPendiente(BigDecimal saldoFinalPendiente) {
        this.saldoFinalPendiente = saldoFinalPendiente;
    }
}
