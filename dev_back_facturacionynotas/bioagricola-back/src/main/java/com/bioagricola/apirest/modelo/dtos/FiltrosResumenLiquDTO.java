package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class FiltrosResumenLiquDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private List<Integer> perIderegistro;

    private List<Long> maprcIderegistr;

    private Integer prlIderegistro;

    private List<Long> terIderegistro;

    private String estado;

    private Date fechaPrueba;

    private Integer tipoProceso;
    
    private List<PeriodoFactDTO> periodos;

    public FiltrosResumenLiquDTO() {
        //constructor por defecto
    }

    public List<Integer> getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(List<Integer> perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public Integer getPrlIderegistro() {
        return prlIderegistro;
    }

    public void setPrlIderegistro(Integer prlIderegistro) {
        this.prlIderegistro = prlIderegistro;
    }

    public List<Long> getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(List<Long> terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaPrueba() {
        return fechaPrueba;
    }

    public void setFechaPrueba(Date fechaPrueba) {
        this.fechaPrueba = fechaPrueba;
    }

    public Integer getTipoProceso() {
        return tipoProceso;
    }

    public void setTipoProceso(Integer tipoProceso) {
        this.tipoProceso = tipoProceso;
    }

    public List<Long> getMaprcIderegistr() {
        return maprcIderegistr;
    }

    public void setMaprcIderegistr(List<Long> maprcIderegistr) {
        this.maprcIderegistr = maprcIderegistr;
    }

    public List<PeriodoFactDTO> getPeriodos() {
        return periodos;
    }

    public void setPeriodos(List<PeriodoFactDTO> periodos) {
        this.periodos = periodos;
    }

    
}
