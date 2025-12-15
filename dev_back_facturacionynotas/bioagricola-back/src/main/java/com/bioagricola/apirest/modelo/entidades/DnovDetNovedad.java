/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.modelo.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 *
 * @author jlmendoza
 */
@Entity
@Table(name="dnov_detnovedad")
//@NamedQuery(name="DNovDetNovedad.findAll", query="SELECT n FROM DnovDetNovedad n")
public class DnovDetNovedad implements Serializable{    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="dnov_ideregistr")
    private Long dnovIderegistr;
    
    @Column(name="dnov_estado")
    private String dnovEstado;
    
    @Column(name="dnov_cantidad")
    private Integer dnovCantidad;
    
    @Column(name="dnov_vlrunitari")
    private BigDecimal dnovVlrUnitari;
    
    @Column(name="dnov_vlrtotal")
    private BigDecimal dnovVlrTotal;
    
    @Column(name="dnov_ideorigen")
    private Integer dnovIdeorigen;
    
    @Column(name="nov_ideregistro")
    private Integer novIderegistro;
    
    @Column(name="emp_ideregistro")
    private Integer empIderegistro;
    
    @Column(name="dsus_ideregistr")
    private Long dsusIderegistr; 
    
    @Column(name="uni_liquidacion")
    private Integer uniLiquidacion;
    
    @Column(name="uni_concepto")
    private Integer uniConcepto;
    
    @Column(name="tor_nomtabla")
    private String torNomtabla;
    
    @Column(name="dtor_nomcampo")
    private String dtorNomCampo;
    
    @Column(name="cic_ideregistro")
    private Integer cicIderegistro;
    
    @Column(name="per_ideregistro")
    private Integer perIderegistro;
    
    @Column(name="cic_ano")
    private Integer cicAno;
        
    @Column(name="usu_ideregistro")
    private Integer usuIderegistro;

    public DnovDetNovedad() {
    }   

    public Integer getNovIderegistro() {
        return novIderegistro;
    }

    public void setNovIderegistro(Integer novIderegistro) {
        this.novIderegistro = novIderegistro;
    }
    
    
    
    public Long getDnovIderegistr() {
        return dnovIderegistr;
    }

    public void setDnovIderegistr(Long dnovIderegistr) {
        this.dnovIderegistr = dnovIderegistr;
    }

    public String getDnovEstado() {
        return dnovEstado;
    }

    public void setDnovEstado(String dnovEstado) {
        this.dnovEstado = dnovEstado;
    }

    public Integer getDnovCantidad() {
        return dnovCantidad;
    }

    public void setDnovCantidad(Integer dnovCantidad) {
        this.dnovCantidad = dnovCantidad;
    }

    public BigDecimal getDnovVlrUnitari() {
        return dnovVlrUnitari;
    }

    public void setDnovVlrUnitari(BigDecimal dnovVlrUnitari) {
        this.dnovVlrUnitari = dnovVlrUnitari;
    }

    public BigDecimal getDnovVlrTotal() {
        return dnovVlrTotal;
    }

    public void setDnovVlrTotal(BigDecimal dnovVlrTotal) {
        this.dnovVlrTotal = dnovVlrTotal;
    }

    public Integer getDnovIdeorigen() {
        return dnovIdeorigen;
    }

    public void setDnovIdeorigen(Integer dnovIdeorigen) {
        this.dnovIdeorigen = dnovIdeorigen;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Long getDsusIderegistr() {
        return dsusIderegistr;
    }

    public void setDsusIderegistr(Long dsusIderegistr) {
        this.dsusIderegistr = dsusIderegistr;
    }

    public Integer getUniLiquidacion() {
        return uniLiquidacion;
    }

    public void setUniLiquidacion(Integer uniLiquidacion) {
        this.uniLiquidacion = uniLiquidacion;
    }

    public Integer getUniConcepto() {
        return uniConcepto;
    }

    public void setUniConcepto(Integer uniConcepto) {
        this.uniConcepto = uniConcepto;
    }

    public String getTorNomtabla() {
        return torNomtabla;
    }

    public void setTorNomtabla(String torNomtabla) {
        this.torNomtabla = torNomtabla;
    }

    public String getDtorNomCampo() {
        return dtorNomCampo;
    }

    public void setDtorNomCampo(String dtorNomCampo) {
        this.dtorNomCampo = dtorNomCampo;
    }

    public Integer getCicIderegistro() {
        return cicIderegistro;
    }

    public void setCicIderegistro(Integer cicIderegistro) {
        this.cicIderegistro = cicIderegistro;
    }

    public Integer getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public Integer getCicAno() {
        return cicAno;
    }

    public void setCicAno(Integer cicAno) {
        this.cicAno = cicAno;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }
    
    
    
    
}
