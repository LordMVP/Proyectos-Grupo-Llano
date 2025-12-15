package com.bioagricola.apirest.modelo.dtos;

import javax.persistence.Column;
import java.sql.Timestamp;
import java.util.Date;

public class HvtconHomvartarconceptosDTO {

    private Integer hvtconIderegistr;

    private String hvtconTipoactualizacion;

    private Integer uniConceptoLiq;

    private Integer empIderegistro;

    private Integer uniMunicipio;

    private Timestamp hvtconFecharegistro;

    private String hvtconEstado;

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
