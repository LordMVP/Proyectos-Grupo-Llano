/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import java.util.Date;

/**
 *
 * @author lrey
 */
public class RecaudoDTO {

    private Long idRecaudo;
    private Date fecha;
    private String estado;
    private Date fechaAplicado;
    private Double valorPagado;
    private Double valorCambio;
    private Double valorAjuste;
    private Double valorReal;
    private Long idMedioPago;
    private Long idConvenio;
    private Integer idEmpresa;
    private Long idSuscriptor;
    private Long idTercero;
    private Long idDocumento;
    private Long idRecaudoOrigen;
    private Long idRecaudoPadre;
    private Date fechaPago;
    private Long idMunicipio;
    private Long idConsignacion;
    private Long idUsuario;
    private Integer version;
    private Long idMovimiento;
    private Long idRecaudoUnificado;

    public Long getIdRecaudo() {
        return idRecaudo;
    }

    public void setIdRecaudo(Long idRecaudo) {
        this.idRecaudo = idRecaudo;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaAplicado() {
        return fechaAplicado;
    }

    public void setFechaAplicado(Date fechaAplicado) {
        this.fechaAplicado = fechaAplicado;
    }

    public Double getValorPagado() {
        return valorPagado;
    }

    public void setValorPagado(Double valorPagado) {
        this.valorPagado = valorPagado;
    }

    public Double getValorCambio() {
        return valorCambio;
    }

    public void setValorCambio(Double valorCambio) {
        this.valorCambio = valorCambio;
    }

    public Double getValorAjuste() {
        return valorAjuste;
    }

    public void setValorAjuste(Double valorAjuste) {
        this.valorAjuste = valorAjuste;
    }

    public Double getValorReal() {
        return valorReal;
    }

    public void setValorReal(Double valorReal) {
        this.valorReal = valorReal;
    }

    public Long getIdMedioPago() {
        return idMedioPago;
    }

    public void setIdMedioPago(Long idMedioPago) {
        this.idMedioPago = idMedioPago;
    }

    public Long getIdConvenio() {
        return idConvenio;
    }

    public void setIdConvenio(Long idConvenio) {
        this.idConvenio = idConvenio;
    }

    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }



    public Long getIdSuscriptor() {
        return idSuscriptor;
    }

    public void setIdSuscriptor(Long idSuscriptor) {
        this.idSuscriptor = idSuscriptor;
    }

    public Long getIdTercero() {
        return idTercero;
    }

    public void setIdTercero(Long idTercero) {
        this.idTercero = idTercero;
    }

    public Long getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(Long idDocumento) {
        this.idDocumento = idDocumento;
    }

    public Long getIdRecaudoOrigen() {
        return idRecaudoOrigen;
    }

    public void setIdRecaudoOrigen(Long idRecaudoOrigen) {
        this.idRecaudoOrigen = idRecaudoOrigen;
    }

    public Long getIdRecaudoPadre() {
        return idRecaudoPadre;
    }

    public void setIdRecaudoPadre(Long idRecaudoPadre) {
        this.idRecaudoPadre = idRecaudoPadre;
    }

    public Date getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Date fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Long getIdMunicipio() {
        return idMunicipio;
    }

    public void setIdMunicipio(Long idMunicipio) {
        this.idMunicipio = idMunicipio;
    }

    public Long getIdConsignacion() {
        return idConsignacion;
    }

    public void setIdConsignacion(Long idConsignacion) {
        this.idConsignacion = idConsignacion;
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

    public Long getIdMovimiento() {
        return idMovimiento;
    }

    public void setIdMovimiento(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

    public Long getIdRecaudoUnificado() {
        return idRecaudoUnificado;
    }

    public void setIdRecaudoUnificado(Long idRecaudoUnificado) {
        this.idRecaudoUnificado = idRecaudoUnificado;
    }

}
