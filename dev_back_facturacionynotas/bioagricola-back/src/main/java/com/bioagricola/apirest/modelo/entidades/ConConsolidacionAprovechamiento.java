package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class ConConsolidacionAprovechamiento
 */
@Entity
@Table(name = "con_consolidacionaprovechamiento", schema = "aseo")
public class ConConsolidacionAprovechamiento {
    @Id
    @SequenceGenerator(name = "con_idconsolidacion_seq", sequenceName = "con_idconsolidacion_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "con_idconsolidacion_seq")
    @Column(name = "con_idconsolidacion")
    private Integer conIdConsolidacion;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "dfac_ideregistr")
    private BigInteger dfacIderegistr;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "per_ideregistro")
    private Integer perIderegistro;

    @Column(name = "drec_ideregistro")
    private Integer drecIderegistro;

    @Column(name = "fac_ideregistro")
    private BigInteger facIderegistro;

    @Column(name = "ter_ideregistro")
    private Long terIderegistro;

    @Column(name = "uni_concepto")
    private Integer uniConcepto;

    @Column(name = "per_fecinicial")
    private Date perFecinicial;

    @Column(name = "concepto")
    private String concepto;

    @Column(name = "valor_base")
    private BigDecimal valorBase;

    @Column(name = "porcentaje")
    private BigDecimal porcentaje;

    @Column(name = "valor_calculado")
    private BigDecimal valorCalculado;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_reg")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date fechaReg;

    @Column(name = "fecha_corte")
    private Date fechaCorte;

    @Column(name = "fecha_maximo_procesamiento")
    private Date fechaMaximoProcesamiento;

    @Column(name = "proyecto_ideregistro")
    private Integer proyectoIderegistro;

    @Column(name = "aforado")
    private Integer aforado;

    @Column(name = "dinc")
    private BigDecimal dinc;

    @Column(name = "fecha_actualizacion")
    private Date fechaActualizacion;

    @Column(name = "usu_idregistro_act")
    private Integer usuIdregistroAct;

    @Column(name = "incentivo")
    private Integer incentivo;

    @Column(name = "con_exportar_seven")
    private Integer exportarSeven;

    @Column(name = "con_oficio_pago")
    private Integer oficioPago;

    @Column(name = "tipo_concepto")
    private String tipoConcepto;

    @Column(name = "financiacion")
    private Integer financiacion;

    public Integer getConIdConsolidacion() {
        return conIdConsolidacion;
    }

    public void setConIdConsolidacion(Integer conIdConsolidacion) {
        this.conIdConsolidacion = conIdConsolidacion;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public BigInteger getDfacIderegistr() {
        return dfacIderegistr;
    }

    public void setDfacIderegistr(BigInteger dfacIderegistr) {
        this.dfacIderegistr = dfacIderegistr;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Integer getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public BigInteger getFacIderegistro() {
        return facIderegistro;
    }

    public void setFacIderegistro(BigInteger facIderegistro) {
        this.facIderegistro = facIderegistro;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Integer getUniConcepto() {
        return uniConcepto;
    }

    public void setUniConcepto(Integer uniConcepto) {
        this.uniConcepto = uniConcepto;
    }

    public Date getPerFecinicial() {
        return perFecinicial;
    }

    public void setPerFecinicial(Date perFecinicial) {
        this.perFecinicial = perFecinicial;
    }

    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public BigDecimal getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(BigDecimal porcentaje) {
        this.porcentaje = porcentaje;
    }

    public BigDecimal getValorBase() {
        return valorBase;
    }

    public void setValorBase(BigDecimal valorBase) {
        this.valorBase = valorBase;
    }

    public BigDecimal getValorCalculado() {
        return valorCalculado;
    }

    public void setValorCalculado(BigDecimal valorCalculado) {
        this.valorCalculado = valorCalculado;
    }

    public Integer getDrecIderegistro() {
        return drecIderegistro;
    }

    public void setDrecIderegistro(Integer drecIderegistro) {
        this.drecIderegistro = drecIderegistro;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaReg() {
        return fechaReg;
    }

    public void setFechaReg(Date fechaReg) {
        this.fechaReg = fechaReg;
    }

    public Date getFechaCorte() {
        return fechaCorte;
    }

    public void setFechaCorte(Date fechaCorte) {
        this.fechaCorte = fechaCorte;
    }

    public Date getFechaMaximoProcesamiento() {
        return fechaMaximoProcesamiento;
    }

    public void setFechaMaximoProcesamiento(Date fechaMaximoProcesamiento) {
        this.fechaMaximoProcesamiento = fechaMaximoProcesamiento;
    }

    public Integer getProyectoIderegistro() {
        return proyectoIderegistro;
    }

    public void setProyectoIderegistro(Integer proyectoIderegistro) {
        this.proyectoIderegistro = proyectoIderegistro;
    }

    public Integer getAforado() {
        return aforado;
    }

    public void setAforado(Integer aforado) {
        this.aforado = aforado;
    }

    public BigDecimal getDinc() {
        return dinc;
    }

    public void setDinc(BigDecimal dinc) {
        this.dinc = dinc;
    }

    public Date getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(Date fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public Integer getUsuIdregistroAct() {
        return usuIdregistroAct;
    }

    public void setUsuIdregistroAct(Integer usuIdregistroAct) {
        this.usuIdregistroAct = usuIdregistroAct;
    }

    public Integer getIncentivo() {
        return incentivo;
    }

    public void setIncentivo(Integer incentivo) {
        this.incentivo = incentivo;
    }

    public Integer getExportarSeven() {
        return exportarSeven;
    }

    public void setExportarSeven(Integer exportarSeven) {
        this.exportarSeven = exportarSeven;
    }

    public Integer getOficioPago() {
        return oficioPago;
    }

    public void setOficioPago(Integer oficioPago) {
        this.oficioPago = oficioPago;
    }

    public String getTipoConcepto() {
        return tipoConcepto;
    }

    public void setTipoConcepto(String tipoConcepto) {
        this.tipoConcepto = tipoConcepto;
    }

    public Integer getFinanciacion() {
        return financiacion;
    }

    public void setFinanciacion(Integer financiacion) {
        this.financiacion = financiacion;
    }
}
