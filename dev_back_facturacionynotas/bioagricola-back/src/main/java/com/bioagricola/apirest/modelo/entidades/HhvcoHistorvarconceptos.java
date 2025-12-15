package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "hhvco_historvarconceptos", schema = "aseo")
@NamedQuery(name = "HhvcoHistorvarconceptos.findAll", query = "SELECT h FROM HhvcoHistorvarconceptos h")
public class HhvcoHistorvarconceptos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hhvco_ideregistro")
    private Integer hhvcoIderegistr;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "hvtcon_ideregistr")
    private Integer hvtconIderegistr;

    @Column(name = "dhvtc_ideregistr")
    private Integer dhvtcIderegistr;

    @Column(name = "uni_concepto_liq")
    private Integer uniConceptoLiq;

    @Column(name = "nombre_con_liq")
    private String nombreConLiq;

    @Column(name = "nombre_con_vartar")
    private String nombreConVartar;

    @Column(name = "uni_concepto_vartar")
    private Integer uniConceptoVartar;

    @Column(name = "con_rangoinicio")
    private Integer conRangoinicio;

    @Column(name = "con_rangofin")
    private Integer conRangofin;

    @Column(name = "hhvco_valor")
    private BigDecimal hhvcoValor;

    @Column(name = "año_actualizar")
    private Integer anioActualizar;

    @Column(name = "mes_actualizar")
    private Integer mesActualizar;


    @Column(name = "hhvco_fecharegistro")
    private Timestamp hhvcoFecharegistro;

    @Column(name = "hhvco_fechataras")
    private Timestamp hhvcoFechataras;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "hhvco_estado")
    private String hhvcoEstado;

    public Integer getHhvcoIderegistr() {
        return hhvcoIderegistr;
    }

    public void setHhvcoIderegistr(Integer hhvcoIderegistr) {
        this.hhvcoIderegistr = hhvcoIderegistr;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getHvtconIderegistr() {
        return hvtconIderegistr;
    }

    public void setHvtconIderegistr(Integer hvtconIderegistr) {
        this.hvtconIderegistr = hvtconIderegistr;
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

    public BigDecimal getHhvcoValor() {
        return hhvcoValor;
    }

    public void setHhvcoValor(BigDecimal hhvcoValor) {
        this.hhvcoValor = hhvcoValor;
    }

    public Timestamp getHhvcoFecharegistro() {
        return hhvcoFecharegistro;
    }

    public void setHhvcoFecharegistro(Timestamp hhvcoFecharregistro) {
        this.hhvcoFecharegistro = hhvcoFecharregistro;
    }

    public Timestamp getHhvcoFechataras() {
        return hhvcoFechataras;
    }

    public void setHhvcoFechataras(Timestamp hhvcoFechataras) {
        this.hhvcoFechataras = hhvcoFechataras;
    }


    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public String getHhvcoEstado() {
        return hhvcoEstado;
    }

    public void setHhvcoEstado(String hhvcoEstado) {
        this.hhvcoEstado = hhvcoEstado;
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