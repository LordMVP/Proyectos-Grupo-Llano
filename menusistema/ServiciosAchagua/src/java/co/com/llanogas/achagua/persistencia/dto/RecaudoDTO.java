/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.dto;

import java.util.Date;

/**
 *
 * @author hrey
 */
public class RecaudoDTO {

    private long idRecaudo;
    private Date fecha;
    private String estado;
    private Date fechaAplicado;
    private double valorPagado;
    private double valorCambio;
    private double valorAjuste;
    private double valorReal;
    private long idMedioPago;
    private long idConvenio;
    private long idEmpresa;
    private long idSuscriptor;
    private long idTercero;
    private long idDocumento;
    private long idOrigen;
    private long idPadre;
    private long idSuscripcion;

    public long getIdRecaudo() {
        return idRecaudo;
    }

    public void setIdRecaudo(long idRecaudo) {
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

    public double getValorPagado() {
        return valorPagado;
    }

    public void setValorPagado(double valorPagado) {
        this.valorPagado = valorPagado;
    }

    public double getValorCambio() {
        return valorCambio;
    }

    public void setValorCambio(double valorCambio) {
        this.valorCambio = valorCambio;
    }

    public double getValorAjuste() {
        return valorAjuste;
    }

    public void setValorAjuste(double valorAjuste) {
        this.valorAjuste = valorAjuste;
    }

    public double getValorReal() {
        return valorReal;
    }

    public void setValorReal(double valorReal) {
        this.valorReal = valorReal;
    }

    public long getIdMedioPago() {
        return idMedioPago;
    }

    public void setIdMedioPago(long idMedioPago) {
        this.idMedioPago = idMedioPago;
    }

    public long getIdConvenio() {
        return idConvenio;
    }

    public void setIdConvenio(long idConvenio) {
        this.idConvenio = idConvenio;
    }

    public long getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(long idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public long getIdSuscriptor() {
        return idSuscriptor;
    }

    public void setIdSuscriptor(long idSuscriptor) {
        this.idSuscriptor = idSuscriptor;
    }

    public long getIdTercero() {
        return idTercero;
    }

    public void setIdTercero(long idTercero) {
        this.idTercero = idTercero;
    }

    public long getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(long idDocumento) {
        this.idDocumento = idDocumento;
    }

    public long getIdOrigen() {
        return idOrigen;
    }

    public void setIdOrigen(long idOrigen) {
        this.idOrigen = idOrigen;
    }

    public long getIdPadre() {
        return idPadre;
    }

    public void setIdPadre(long idPadre) {
        this.idPadre = idPadre;
    }

    public long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

}
