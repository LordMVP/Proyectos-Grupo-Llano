package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.sql.Timestamp;

public class PeriodoLiquidacionDTO implements Serializable {
    private Integer idPeriodo;
    private Timestamp fechaCorteFacturacion;
    private Timestamp fechaLimiteProcesamiento;
    private String perNombre;
    private Integer idCiclo;
    private Short anoCiclo;

    public Integer getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Integer idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public Timestamp getFechaCorteFacturacion() {
        return fechaCorteFacturacion;
    }

    public void setFechaCorteFacturacion(Timestamp fechaCorteFacturacion) {
        this.fechaCorteFacturacion = fechaCorteFacturacion;
    }

    public Timestamp getFechaLimiteProcesamiento() {
        return fechaLimiteProcesamiento;
    }

    public void setFechaLimiteProcesamiento(Timestamp fechaLimiteProcesamiento) {
        this.fechaLimiteProcesamiento = fechaLimiteProcesamiento;
    }

    public String getPerNombre() {
        return perNombre;
    }

    public void setPerNombre(String perNombre) {
        this.perNombre = perNombre;
    }

    public Integer getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Integer idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Short getAnoCiclo() {
        return anoCiclo;
    }

    public void setAnoCiclo(Short anoCiclo) {
        this.anoCiclo = anoCiclo;
    }
}
