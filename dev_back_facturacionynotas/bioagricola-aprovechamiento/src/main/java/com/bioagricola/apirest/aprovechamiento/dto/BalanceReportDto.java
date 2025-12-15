package com.bioagricola.apirest.aprovechamiento.dto;

import java.math.BigDecimal;
import java.util.List;

public class BalanceReportDto {
    private String aprov;
    private Long idTer;
    private BigDecimal invoicedTotal;
    private BigDecimal orderCollection;
    private BigDecimal vlrChanges;
    private BigDecimal dinc;
    private BigDecimal punishedWalletVlr;
    private BigDecimal walletResidue;

    public BalanceReportDto(String aprov, Long idTer, BigDecimal invoicedTotal, BigDecimal orderCollection, BigDecimal vlrChanges, BigDecimal dinc, BigDecimal punishedWalletVlr, BigDecimal walletResidue) {
        this.aprov = aprov;
        this.idTer = idTer;
        this.invoicedTotal = invoicedTotal;
        this.orderCollection = orderCollection;
        this.vlrChanges = vlrChanges;
        this.dinc = dinc;
        this.punishedWalletVlr = punishedWalletVlr;
        this.walletResidue = walletResidue;
    }

    public BalanceReportDto() {
    }

    public String getAprov() {
        return aprov;
    }

    public void setAprov(String aprov) {
        this.aprov = aprov;
    }

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

}
