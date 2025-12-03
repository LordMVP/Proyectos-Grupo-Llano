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
public class DistribucionRecaudoDTO {

    private Long idDistribucion;
    private Double valorRecaudo;
    private Double saldoRecaudo;
    private Double valorRecaudoAdicional;
    private Double saldoRecaudoAdicional;
    private RecaudoDTO recaudo;
    private Long idDistribucionConvenio;
    private Long idSuscripcion;
    private Long idDocumento;
    private Long idTipoDocumento;
    private Long idConcepto;
    private Long idPeriodo;
    private Long idCiclo;
    private Integer idEmpresa;
    private Integer anio;
    private Long idUsuario;
    private Integer version;

    public Long getIdDistribucion() {
        return idDistribucion;
    }

    public void setIdDistribucion(Long idDistribucion) {
        this.idDistribucion = idDistribucion;
    }

    public Double getValorRecaudo() {
        return valorRecaudo;
    }

    public void setValorRecaudo(Double valorRecaudo) {
        this.valorRecaudo = valorRecaudo;
    }

    public Double getSaldoRecaudo() {
        return saldoRecaudo;
    }

    public void setSaldoRecaudo(Double saldoRecaudo) {
        this.saldoRecaudo = saldoRecaudo;
    }

    public RecaudoDTO getRecaudo() {
        return recaudo;
    }

    public void setRecaudo(RecaudoDTO recaudo) {
        this.recaudo = recaudo;
    }

    public Long getIdDistribucionConvenio() {
        return idDistribucionConvenio;
    }

    public void setIdDistribucionConvenio(Long idDistribucionConvenio) {
        this.idDistribucionConvenio = idDistribucionConvenio;
    }

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public Long getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(Long idDocumento) {
        this.idDocumento = idDocumento;
    }

    public Long getIdTipoDocumento() {
        return idTipoDocumento;
    }

    public void setIdTipoDocumento(Long idTipoDocumento) {
        this.idTipoDocumento = idTipoDocumento;
    }

    public Long getIdConcepto() {
        return idConcepto;
    }

    public void setIdConcepto(Long idConcepto) {
        this.idConcepto = idConcepto;
    }

    public Long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
    }

    public Long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Double getValorRecaudoAdicional() {
        return valorRecaudoAdicional;
    }

    public void setValorRecaudoAdicional(Double valorRecaudoAdicional) {
        this.valorRecaudoAdicional = valorRecaudoAdicional;
    }

    public Double getSaldoRecaudoAdicional() {
        return saldoRecaudoAdicional;
    }

    public void setSaldoRecaudoAdicional(Double saldoRecaudoAdicional) {
        this.saldoRecaudoAdicional = saldoRecaudoAdicional;
    }

}
