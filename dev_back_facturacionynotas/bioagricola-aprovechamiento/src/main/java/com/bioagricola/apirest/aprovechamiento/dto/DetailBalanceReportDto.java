package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;

/**
 * @author krivas
 * @project dev_back_aprovechamiento
 * @class DetailBalanceReportDto
 */

public class DetailBalanceReportDto {
    private Long idTer;
    private BigDecimal invoicedTotal;
    private BigDecimal orderCollection;
    private BigDecimal vlrChanges;
    private BigDecimal dinc;
    private BigDecimal punishedWalletVlr;
    private BigDecimal walletResidue;
    private String perFacturacion;
    private String perPrestacion;

    public Long getIdTer() {
        return idTer;
    }

    public void setIdTer(Long idTer) {
        this.idTer = idTer;
    }

    public BigDecimal getInvoicedTotal() {
        return invoicedTotal;
    }

    public void setInvoicedTotal(BigDecimal invoicedTotal) {
        this.invoicedTotal = invoicedTotal;
    }

    public BigDecimal getOrderCollection() {
        return orderCollection;
    }

    public void setOrderCollection(BigDecimal orderCollection) {
        this.orderCollection = orderCollection;
    }

    public BigDecimal getVlrChanges() {
        return vlrChanges;
    }

    public void setVlrChanges(BigDecimal vlrChanges) {
        this.vlrChanges = vlrChanges;
    }

    public BigDecimal getDinc() {
        return dinc;
    }

    public void setDinc(BigDecimal dinc) {
        this.dinc = dinc;
    }

    public BigDecimal getPunishedWalletVlr() {
        return punishedWalletVlr;
    }

    public void setPunishedWalletVlr(BigDecimal punishedWalletVlr) {
        this.punishedWalletVlr = punishedWalletVlr;
    }

    public BigDecimal getWalletResidue() {
        return walletResidue;
    }

    public void setWalletResidue(BigDecimal walletResidue) {
        this.walletResidue = walletResidue;
    }

    public String getPerFacturacion() {
        return perFacturacion;
    }

    public void setPerFacturacion(String perFacturacion) {
        this.perFacturacion = perFacturacion;
    }

    public String getPerPrestacion() {
        return perPrestacion;
    }

    public void setPerPrestacion(String perPrestacion) {
        this.perPrestacion = perPrestacion;
    }
}
