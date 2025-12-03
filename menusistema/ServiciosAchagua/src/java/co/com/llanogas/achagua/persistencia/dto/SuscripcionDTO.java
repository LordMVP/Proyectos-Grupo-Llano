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
public class SuscripcionDTO {

    private String estado;
    private String descripcion;
    private String codigoAnterior;
    private long idSuscriptor;
    private long idSuscripcion;
    private long idTercero;
    private long idPropiedad;
    private long idMunicipio;
    private long idBarrio;
    private long idEstructuraTipoSuscripcion;
    private long idTipoSuscripcion;
    private long idEstructuraTipoUsoSuscripcion;
    private long idTipoUsoSuscripcion;
    private long idEmpresa;
    private long idEstructuraLiquidacion;
    private long idLiquidacion;
    private long idCiclo;
    private Date fechaInicio;
    private Date fechaExpira;
    private long idPropiedadEstrato;
    private Date inicioEstado;
    private Date finEstado;

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCodigoAnterior() {
        return codigoAnterior;
    }

    public void setCodigoAnterior(String codigoAnterior) {
        this.codigoAnterior = codigoAnterior;
    }

    public long getIdSuscriptor() {
        return idSuscriptor;
    }

    public void setIdSuscriptor(long idSuscriptor) {
        this.idSuscriptor = idSuscriptor;
    }

    public long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public long getIdTercero() {
        return idTercero;
    }

    public void setIdTercero(long idTercero) {
        this.idTercero = idTercero;
    }

    public long getIdPropiedad() {
        return idPropiedad;
    }

    public void setIdPropiedad(long idPropiedad) {
        this.idPropiedad = idPropiedad;
    }

    public long getIdMunicipio() {
        return idMunicipio;
    }

    public void setIdMunicipio(long idMunicipio) {
        this.idMunicipio = idMunicipio;
    }

    public long getIdBarrio() {
        return idBarrio;
    }

    public void setIdBarrio(long idBarrio) {
        this.idBarrio = idBarrio;
    }

    public long getIdEstructuraTipoSuscripcion() {
        return idEstructuraTipoSuscripcion;
    }

    public void setIdEstructuraTipoSuscripcion(long idEstructuraTipoSuscripcion) {
        this.idEstructuraTipoSuscripcion = idEstructuraTipoSuscripcion;
    }

    public long getIdTipoSuscripcion() {
        return idTipoSuscripcion;
    }

    public void setIdTipoSuscripcion(long idTipoSuscripcion) {
        this.idTipoSuscripcion = idTipoSuscripcion;
    }

    public long getIdEstructuraTipoUsoSuscripcion() {
        return idEstructuraTipoUsoSuscripcion;
    }

    public void setIdEstructuraTipoUsoSuscripcion(long idEstructuraTipoUsoSuscripcion) {
        this.idEstructuraTipoUsoSuscripcion = idEstructuraTipoUsoSuscripcion;
    }

    public long getIdTipoUsoSuscripcion() {
        return idTipoUsoSuscripcion;
    }

    public void setIdTipoUsoSuscripcion(long idTipoUsoSuscripcion) {
        this.idTipoUsoSuscripcion = idTipoUsoSuscripcion;
    }

    public long getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(long idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public long getIdEstructuraLiquidacion() {
        return idEstructuraLiquidacion;
    }

    public void setIdEstructuraLiquidacion(long idEstructuraLiquidacion) {
        this.idEstructuraLiquidacion = idEstructuraLiquidacion;
    }

    public long getIdLiquidacion() {
        return idLiquidacion;
    }

    public void setIdLiquidacion(long idLiquidacion) {
        this.idLiquidacion = idLiquidacion;
    }

    public long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaExpira() {
        return fechaExpira;
    }

    public void setFechaExpira(Date fechaExpira) {
        this.fechaExpira = fechaExpira;
    }

    public long getIdPropiedadEstrato() {
        return idPropiedadEstrato;
    }

    public void setIdPropiedadEstrato(long idPropiedadEstrato) {
        this.idPropiedadEstrato = idPropiedadEstrato;
    }

    public Date getInicioEstado() {
        return inicioEstado;
    }

    public void setInicioEstado(Date inicioEstado) {
        this.inicioEstado = inicioEstado;
    }

    public Date getFinEstado() {
        return finEstado;
    }

    public void setFinEstado(Date finEstado) {
        this.finEstado = finEstado;
    }

}
