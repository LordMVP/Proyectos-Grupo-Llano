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
public class InfoRecaudoDTO {

    private Integer idEmpresaRecaudadora;
    private SuscripcionDTO suscripcion;
    private Double valor;
    private String tipoRecaudo;
    private Long idConvenio;
    private String estado;

    public Integer getIdEmpresaRecaudadora() {
        return idEmpresaRecaudadora;
    }

    public void setIdEmpresaRecaudadora(Integer idEmpresaRecaudadora) {
        this.idEmpresaRecaudadora = idEmpresaRecaudadora;
    }

    public SuscripcionDTO getSuscripcion() {
        return suscripcion;
    }

    public void setSuscripcion(SuscripcionDTO suscripcion) {
        this.suscripcion = suscripcion;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getTipoRecaudo() {
        return tipoRecaudo;
    }

    public void setTipoRecaudo(String tipoRecaudo) {
        this.tipoRecaudo = tipoRecaudo;
    }

    public Long getIdConvenio() {
        return idConvenio;
    }

    public void setIdConvenio(Long idConvenio) {
        this.idConvenio = idConvenio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}
