package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class FacFacturaDTOResponse
 */
public class FacFacturaDTOResponse {
    private String cicAno;
    private String facEstado;
    private String empresaAlterna;
    private Integer perIderegistro;
    private BigDecimal facVlrreal;
    private Double dctos;
    private Double subCont;
    private Double dctosInd;
    private Double ajuste;
    private Double deuda;
    private Double mora;
    private Double otros;
    private Double total;
    private Date facFecha;
    private Long dsusIderegistr;
    private Double totalDeudaMora;
    private Long idInvoice;
    private Map<String, Double> rateDetail;

    public FacFacturaDTOResponse() {
        this.rateDetail = new HashMap<>();
    }

    public String getCicAno() {
        return cicAno;
    }

    public void setCicAno(String cicAno) {
        this.cicAno = cicAno;
    }

    public String getFacEstado() {
        return facEstado;
    }

    public void setFacEstado(String facEstado) {
        this.facEstado = facEstado;
    }

    public String getEmpresaAlterna() {
        return empresaAlterna;
    }

    public void setEmpresaAlterna(String empresaAlterna) {
        this.empresaAlterna = empresaAlterna;
    }

    public Integer getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public BigDecimal getFacVlrreal() {
        return facVlrreal;
    }

    public void setFacVlrreal(BigDecimal facVlrreal) {
        this.facVlrreal = facVlrreal;
    }

    public Double getDctos() {
        return dctos;
    }

    public void setDctos(Double dctos) {
        this.dctos = dctos;
    }

    public Double getSubCont() {
        return subCont;
    }

    public void setSubCont(Double subCont) {
        this.subCont = subCont;
    }

    public Double getDctosInd() {
        return dctosInd;
    }

    public void setDctosInd(Double dctosInd) {
        this.dctosInd = dctosInd;
    }

    public Double getAjuste() {
        return ajuste;
    }

    public void setAjuste(Double ajuste) {
        this.ajuste = ajuste;
    }

    public Double getDeuda() {
        return deuda;
    }

    public void setDeuda(Double deuda) {
        this.deuda = deuda;
    }

    public Double getMora() {
        return mora;
    }

    public void setMora(Double mora) {
        this.mora = mora;
    }

    public Double getOtros() {
        return otros;
    }

    public void setOtros(Double otros) {
        this.otros = otros;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Date getFacFecha() {
        return facFecha;
    }

    public void setFacFecha(Date facFecha) {
        this.facFecha = facFecha;
    }

    public Long getDsusIderegistr() {
        return dsusIderegistr;
    }

    public void setDsusIderegistr(Long dsusIderegistr) {
        this.dsusIderegistr = dsusIderegistr;
    }

    public Double getTotalDeudaMora() {
        return totalDeudaMora;
    }

    public void setTotalDeudaMora(Double totalDeudaMora) {
        this.totalDeudaMora = totalDeudaMora;
    }

    public Long getIdInvoice() {
        return idInvoice;
    }

    public void setIdInvoice(Long idInvoice) {
        this.idInvoice = idInvoice;
    }

    public Map<String, Double> getRateDetail() {
        return rateDetail;
    }

    public void setRateDetail(Map<String, Double> rateDetail) {
        this.rateDetail = rateDetail;
    }
}
