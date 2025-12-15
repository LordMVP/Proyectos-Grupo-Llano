/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.bioagricola.apirest.modelo.entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 *
 * @author jlmendoza
 */
@Entity
@Table(name="nov_novedad")
@NamedQuery(name="NovNovedad.findAll", query="SELECT n FROM NovNovedad n")
public class NovNovedad implements Serializable{
    private static final long serialVersionUID = 1L;
        
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="nov_ideregistro")
    private Long novIderegistro;
    
    @Column(name="nov_fecgenerac")
    private Timestamp novFecgenerac;
    
    @Column(name="nov_estado")
    private String novEstado;
    
    @Column(name="nov_genera")
    private String novGenera;
    
    @Column(name="nov_fecprocesad")
    private Timestamp novFecprocesad;
    
    @Column(name="nov_observacion")
    private String novObservacion;
    
    @Column(name="emp_ideregistro")
    private Integer empIderegistro;
    
    @Column(name="cic_ideregistro")
    private Integer cicIderegistro;
    
    @Column(name="per_ideregistro")
    private Integer perIderegistro;
    
    @Column(name="tor_nomtabla")
    private String torNomtabla;
    
    @Column(name="nov_fecaprovac")
    private Timestamp novFecaprovac;
    
    @Column(name="cic_ano")
    private Integer cicAno;
    
    @Column(name="usu_ideregistro")
    private Integer usuIderegistro;
    
    @Column(name="dsus_ideregistr")
    private Long dsusIderegistr; 
    
    /*@OneToMany(fetch = FetchType.LAZY,mappedBy = "novNovedad", cascade = CascadeType.ALL )
    @JsonBackReference
    List<DnovDetNovedad>dnovDetNovedad;*/    
    
    public NovNovedad() {
    }

    public Long getNovIderegistro() {
        return novIderegistro;
    }

    public void setNovIderegistro(Long novIderegistro) {
        this.novIderegistro = novIderegistro;
    }

    /*public List<DnovDetNovedad> getDnovDetNovedad() {
        return dnovDetNovedad;
    }

    public void setDnovDetNovedad(List<DnovDetNovedad> dnovDetNovedad) {
        this.dnovDetNovedad = dnovDetNovedad;
    }*/

    
    public Timestamp getNovFecgenerac() {
        return novFecgenerac;
    }

    public void setNovFecgenerac(Timestamp novFecgenerac) {
        this.novFecgenerac = novFecgenerac;
    }

    public String getNovEstado() {
        return novEstado;
    }

    public void setNovEstado(String novEstado) {
        this.novEstado = novEstado;
    }

    public String getNovGenera() {
        return novGenera;
    }

    public void setNovGenera(String novGenera) {
        this.novGenera = novGenera;
    }

    public Timestamp getNovFecprocesad() {
        return novFecprocesad;
    }

    public void setNovFecprocesad(Timestamp novFecprocesad) {
        this.novFecprocesad = novFecprocesad;
    }

    public String getNovObservacion() {
        return novObservacion;
    }

    public void setNovObservacion(String novObservacion) {
        this.novObservacion = novObservacion;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
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

    public String getTorNomtabla() {
        return torNomtabla;
    }

    public void setTorNomtabla(String torNomtabla) {
        this.torNomtabla = torNomtabla;
    }

    public Timestamp getNovFecaprovac() {
        return novFecaprovac;
    }

    public void setNovFecaprovac(Timestamp novFecaprovac) {
        this.novFecaprovac = novFecaprovac;
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

    public Long getDsusIderegistr() {
        return dsusIderegistr;
    }

    public void setDsusIderegistr(Long dsusIderegistr) {
        this.dsusIderegistr = dsusIderegistr;
    }
    
    
    
}
