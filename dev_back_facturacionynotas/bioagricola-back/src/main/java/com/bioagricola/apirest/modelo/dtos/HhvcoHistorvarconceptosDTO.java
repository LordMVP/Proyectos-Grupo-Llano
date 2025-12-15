package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class HhvcoHistorvarconceptosDTO implements Serializable{
    private static final long serialVersionUID = 1L;

    private Integer hhvcoIderegistr;
    private Long hvtconIderegistr;
    private BigDecimal hhvcoValor;
    private String hhvcoEstado;
    private Integer usuIderegistro;
    private Timestamp hhvcoFecharegistro;
    private Timestamp hhvcoFechataras;
    private Integer empIderegistro;
    private Integer dhvtcIderegistr;
    private Integer uniConceptoLiq;
    private String nombreConLiq;
    private Integer uniConceptoVartar;

    private String nombreConVartar;

    private Integer conRangoinicio;
    private Integer conRangofin;

    private Integer anioActualizar;

    private Integer mesActualizar;

    public Integer getHhvcoIderegistr() {
        return hhvcoIderegistr;
    }

    public void setHhvcoIderegistr(Integer hhvcoIderegistr) {
        this.hhvcoIderegistr = hhvcoIderegistr;
    }

    public Long getHvtconIderegistr() {
        return hvtconIderegistr;
    }

    public void setHvtconIderegistr(Long hvtconIderegistr) {
        this.hvtconIderegistr = hvtconIderegistr;
    }

    public BigDecimal getHhvcoValor() {
        return hhvcoValor;
    }

    public void setHhvcoValor(BigDecimal hhvcoValor) {
        this.hhvcoValor = hhvcoValor;
    }

    public String getHhvcoEstado() {
        return hhvcoEstado;
    }

    public void setHhvcoEstado(String hhvcoEstado) {
        this.hhvcoEstado = hhvcoEstado;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Timestamp getHhvcoFecharegistro() {
        return hhvcoFecharegistro;
    }

    public void setHhvcoFecharegistro(Timestamp hhvcoFecharegistro) {
        this.hhvcoFecharegistro = hhvcoFecharegistro;
    }

    public Timestamp getHhvcoFechataras() {
        return hhvcoFechataras;
    }

    public void setHhvcoFechataras(Timestamp hhvcoFechataras) {
        this.hhvcoFechataras = hhvcoFechataras;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getDhvtcIderegistr() {
        return dhvtcIderegistr;
    }

    public void setDhvtcIderegistr(Integer dhvtcIderegistr) {
        this.dhvtcIderegistr = dhvtcIderegistr;
    }

    public Integer getUniConceptoLiq() {
        return uniConceptoLiq;
    }

    public void setUniConceptoLiq(Integer uniConceptoLiq) {
        this.uniConceptoLiq = uniConceptoLiq;
    }

    public Integer getUniConceptoVartar() {
        return uniConceptoVartar;
    }

    public void setUniConceptoVartar(Integer uniConceptoVartar) {
        this.uniConceptoVartar = uniConceptoVartar;
    }

    public Integer getConRangoinicio() {
        return conRangoinicio;
    }

    public void setConRangoinicio(Integer conRangoinicio) {
        this.conRangoinicio = conRangoinicio;
    }

    public Integer getConRangofin() {
        return conRangofin;
    }

    public void setConRangofin(Integer conRangofin) {
        this.conRangofin = conRangofin;
    }

    public Integer getAnioActualizar() {
        return anioActualizar;
    }

    public void setAnioActualizar(Integer anioActualizar) {
        this.anioActualizar = anioActualizar;
    }

    public Integer getMesActualizar() {
        return mesActualizar;
    }

    public void setMesActualizar(Integer mesActualizar) {
        this.mesActualizar = mesActualizar;
    }

    public String getNombreConLiq() {
        return nombreConLiq;
    }

    public void setNombreConLiq(String nombreConLiq) {
        this.nombreConLiq = nombreConLiq;
    }

    public String getNombreConVartar() {
        return nombreConVartar;
    }

    public void setNombreConVartar(String nombreConVartar) {
        this.nombreConVartar = nombreConVartar;
    }
}
