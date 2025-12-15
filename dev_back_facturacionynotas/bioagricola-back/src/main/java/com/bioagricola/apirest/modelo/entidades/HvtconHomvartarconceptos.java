package com.bioagricola.apirest.modelo.entidades;


import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "hvtcon_homvartarconceptos", schema = "aseo")
@NamedQuery(name = "HvtconHomvartarconceptos.findAll", query = "SELECT h FROM HvtconHomvartarconceptos h")
public class HvtconHomvartarconceptos {

    @Id
    @Column(name = "hvtcon_ideregistr")
    private Integer hvtconIderegistr;

    @Column(name = "hvtcon_tipoactualizacion")
    private String hvtconTipoactualizacion;


    @Column(name = "uni_concepto_liq")
    private Integer uniConceptoLiq;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "uni_municipio")
    private Integer uniMunicipio;

    @Column(name = "hvtcon_fecharegistro")
    private Timestamp hvtconFecharegistro;


    @Column(name = "hvtcon_estado")
    private String hvtconEstado;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;


    public Integer getHvtconIderegistr() {
        return hvtconIderegistr;
    }

    public void setHvtconIderegistr(Integer hvtconIderegistr) {
        this.hvtconIderegistr = hvtconIderegistr;
    }

    public String getHvtconTipoactualizacion() {
        return hvtconTipoactualizacion;
    }

    public void setHvtconTipoactualizacion(String hvtconTipoactualizacion) {
        this.hvtconTipoactualizacion = hvtconTipoactualizacion;
    }

    public Integer getUniConceptoLiq() {
        return uniConceptoLiq;
    }

    public void setUniConceptoLiq(Integer uniConceptoLiq) {
        this.uniConceptoLiq = uniConceptoLiq;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }

    public Integer getUniMunicipio() {
        return uniMunicipio;
    }

    public void setUniMunicipio(Integer uniMunicipio) {
        this.uniMunicipio = uniMunicipio;
    }

    public Timestamp getHvtconFecharegistro() {
        return hvtconFecharegistro;
    }

    public void setHvtconFecharegistro(Timestamp hvtconFecharegistro) {
        this.hvtconFecharegistro = hvtconFecharegistro;
    }

    public String getHvtconEstado() {
        return hvtconEstado;
    }

    public void setHvtconEstado(String hvtconEstado) {
        this.hvtconEstado = hvtconEstado;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }
}