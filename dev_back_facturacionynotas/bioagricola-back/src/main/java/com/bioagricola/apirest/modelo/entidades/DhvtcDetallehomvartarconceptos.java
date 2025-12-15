package com.bioagricola.apirest.modelo.entidades;


import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;


@Entity
@Table(name = "dhvtc_detallehomvartarconceptos", schema = "aseo")
@NamedQuery(name = "DhvtcDetallehomvartarconceptos.findAll", query = "SELECT h FROM DhvtcDetallehomvartarconceptos h")
public class DhvtcDetallehomvartarconceptos implements Serializable{


    private static final long serialVersionUID = 1L;

    @Id
    //serial
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dhvtc_ideregistr")
    private Long	dhvtcIderegistr;

    @Column(name = "hvtcon_ideregistr")
    private Long	hvtconIderegistr;

    @Column(name = "con_rangoinicio")
    private Integer	conRangoinicio;

    @Column(name = "con_rangofin")
    private Integer	conRangofin;

    @Column(name = "uni_concepto_vartar")
    private Long	uniConceptoVartar;

    @Column(name = "dhvtc_valor_default")
    private Integer	dhvtcValorDefault;

    @Column(name = "dhvtc_fecharegistro")
    private Timestamp	dhvtcFecharegistro;

    @Column(name = "dhvtc_estado")
    private String	dhvtcEstado;

    @Column(name = "usu_ideregistro")
    private Integer	usuIderegistro;

    @Column(name = "dhvtc_valorreferencia")
    private Integer	dhvtcValorreferencia;


    public Long getDhvtcIderegistr() {
        return dhvtcIderegistr;
    }

    public void setDhvtcIderegistr(Long dhvtcIderegistr) {
        this.dhvtcIderegistr = dhvtcIderegistr;
    }

    public Long getHvtconIderegistr() {
        return hvtconIderegistr;
    }

    public void setHvtconIderegistr(Long hvtconIderegistr) {
        this.hvtconIderegistr = hvtconIderegistr;
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

    public Long getUniConceptoVartar() {
        return uniConceptoVartar;
    }

    public void setUniConceptoVartar(Long uniConceptoVartar) {
        this.uniConceptoVartar = uniConceptoVartar;
    }

    public Integer getDhvtcValorDefault() {
        return dhvtcValorDefault;
    }

    public void setDhvtcValorDefault(Integer dhvtcValorDefault) {
        this.dhvtcValorDefault = dhvtcValorDefault;
    }

    public Timestamp getDhvtcFecharegistro() {
        return dhvtcFecharegistro;
    }

    public void setDhvtcFecharegistro(Timestamp dhvtcFecharegistro) {
        this.dhvtcFecharegistro = dhvtcFecharegistro;
    }

    public String getDhvtcEstado() {
        return dhvtcEstado;
    }

    public void setDhvtcEstado(String dhvtcEstado) {
        this.dhvtcEstado = dhvtcEstado;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public Integer getDhvtcValorreferencia() {
        return dhvtcValorreferencia;
    }

    public void setDhvtcValorreferencia(Integer dhvtcValorreferencia) {
        this.dhvtcValorreferencia = dhvtcValorreferencia;
    }
}
