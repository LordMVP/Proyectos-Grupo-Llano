/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

/**
 *
 * @author lrey
 */
public class CicloDTO {

    private Long idCiclo;
    private String ciclo;
    private Long idPeriodo;
    private String periodo;
    private Integer anio;

    public Long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public String getCiclo() {
        return ciclo;
    }

    public void setCiclo(String ciclo) {
        this.ciclo = ciclo;
    }

    public Long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

}
