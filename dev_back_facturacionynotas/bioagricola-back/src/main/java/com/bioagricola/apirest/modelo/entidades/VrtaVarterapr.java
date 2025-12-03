package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vrta_varterapr", schema = "aseo")
public class VrtaVarterapr implements Serializable {

    @Id
    @Column(name="vrta_ideregistro")
    private Integer vrtaIderegistro;
    @Column(name="ter_ideregistro")
    private Integer terIderegistro;
    @Column(name="per_ideregistro")
    private Integer perIderegistro;
    @Column(name="con_ideregistro")
    private Integer conIderegistro;
    @Column(name="arpr_ideregistro")
    private Integer arprIderegistro;
    @Column(name="vrta_valor")
    private BigDecimal vrtaValor;
    @Column(name="vrta_descripcion")
    private String vrtaDescripcion;
    @Column(name="vrta_estado")
    private String vrtaEstado;
    @Column(name="usu_ideregistro_gb")
    private Integer usuIderegistroGb;
    @Column(name="vrta_fecgrabacion")
    private Date vrtaFecgrabacion;
    @Column(name="usu_ideregistro_cer")
    private Integer usuIderegistroCer;
    @Column(name="vrta_feccertificacion")
    private Date vrtaFeccertificacion;
    @Column(name="emp_ideregistro")
    private Integer empIderegistro;
    @Column(name="vrta_estado_registro")
    private String vrtaEstadoRegistro;
    @Column(name="raco_ideregistro")
    private Integer racoIderegistro;

    public Integer getVrtaIderegistro() {
        return vrtaIderegistro;
    }

    public void setVrtaIderegistro(Integer vrtaIderegistro) {
        this.vrtaIderegistro = vrtaIderegistro;
    }

    public Integer getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Integer terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Integer getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public Integer getConIderegistro() {
        return conIderegistro;
    }

    public void setConIderegistro(Integer conIderegistro) {
        this.conIderegistro = conIderegistro;
    }

    public Integer getArprIderegistro() {
        return arprIderegistro;
    }

    public void setArprIderegistro(Integer arprIderegistro) {
        this.arprIderegistro = arprIderegistro;
    }

    public BigDecimal getVrtaValor() {
        return vrtaValor;
    }

    public void setVrtaValor(BigDecimal vrtaValor) {
        this.vrtaValor = vrtaValor;
    }

    public String getVrtaDescripcion() {
        return vrtaDescripcion;
    }

    public void setVrtaDescripcion(String vrtaDescripcion) {
        this.vrtaDescripcion = vrtaDescripcion;
    }

    public String getVrtaEstado() {
        return vrtaEstado;
    }

    public void setVrtaEstado(String vrtaEstado) {
        this.vrtaEstado = vrtaEstado;
    }

    public Integer getUsuIderegistroGb() {
        return usuIderegistroGb;
    }

    public void setUsuIderegistroGb(Integer usuIderegistroGb) {
        this.usuIderegistroGb = usuIderegistroGb;
    }

    public Date getVrtaFecgrabacion() {
        return vrtaFecgrabacion;
    }

    public void setVrtaFecgrabacion(Date vrtaFecgrabacion) {
        this.vrtaFecgrabacion = vrtaFecgrabacion;
    }

    public Integer getUsuIderegistroCer() {
        return usuIderegistroCer;
    }

    public void setUsuIderegistroCer(Integer usuIderegistroCer) {
        this.usuIderegistroCer = usuIderegistroCer;
    }

    public Date getVrtaFeccertificacion() {
        return vrtaFeccertificacion;
    }

    public void setVrtaFeccertificacion(Date vrtaFeccertificacion) {
        this.vrtaFeccertificacion = vrtaFeccertificacion;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public String getVrtaEstadoRegistro() {
        return vrtaEstadoRegistro;
    }

    public void setVrtaEstadoRegistro(String vrtaEstadoRegistro) {
        this.vrtaEstadoRegistro = vrtaEstadoRegistro;
    }

    public Integer getRacoIderegistro() {
        return racoIderegistro;
    }

    public void setRacoIderegistro(Integer racoIderegistro) {
        this.racoIderegistro = racoIderegistro;
    }
}
