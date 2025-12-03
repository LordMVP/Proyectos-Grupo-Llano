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
public class FacturaDTO {

    private Long idFactura;
    private Long numero;
    private String metodoGenera;
    private String estado;
    private Date fecha;
    private Long ideActual;
    private Long idPadre;
    private Date fechaAprobada;
    private Date fechaEliminada;
    private Date fechaFinanciacion;
    private Date fechaCastigada;
    private Date fechaVencimiento;
    private Integer idEmpresa;
    private Long idSuscriptor;
    private Long idSuscripcion;
    private Long idTipoSuscripcion;
    private Long idTipoUsoSuscripcion;
    private Long idLiquidacion;
    private Long idTercero;
    private Long idCiclo;
    private Long idPeriodo;
    private Long idDocumento;
    private Long idTipoDocumento;
    private Long idAmortizacion;
    private Integer anio;
    private Long idHistoricoLiquidacion;
    private Long idOrigen;
    private Long idTipoTercero;
    private Date fechaSuspension;
    private Long idFinanciacion;
    private Integer version;
    private Long idUsuario;
    private Long idMovimiento;
    private Double valorReal;
    private Double saldo;

    public FacturaDTO() {
    }

    public FacturaDTO(Long idFactura) {
        this.idFactura = idFactura;
    }

    public Long getIdFactura() {
        return idFactura;
    }

    public void setIdFactura(Long idFactura) {
        this.idFactura = idFactura;
    }

    public Long getNumero() {
        return numero;
    }

    public void setNumero(Long numero) {
        this.numero = numero;
    }

    public String getMetodoGenera() {
        return metodoGenera;
    }

    public void setMetodoGenera(String metodoGenera) {
        this.metodoGenera = metodoGenera;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Long getIdeActual() {
        return ideActual;
    }

    public void setIdeActual(Long ideActual) {
        this.ideActual = ideActual;
    }

    public Long getIdPadre() {
        return idPadre;
    }

    public void setIdPadre(Long idPadre) {
        this.idPadre = idPadre;
    }

    public Date getFechaAprobada() {
        return fechaAprobada;
    }

    public void setFechaAprobada(Date fechaAprobada) {
        this.fechaAprobada = fechaAprobada;
    }

    public Date getFechaEliminada() {
        return fechaEliminada;
    }

    public void setFechaEliminada(Date fechaEliminada) {
        this.fechaEliminada = fechaEliminada;
    }

    public Date getFechaFinanciacion() {
        return fechaFinanciacion;
    }

    public void setFechaFinanciacion(Date fechaFinanciacion) {
        this.fechaFinanciacion = fechaFinanciacion;
    }

    public Date getFechaCastigada() {
        return fechaCastigada;
    }

    public void setFechaCastigada(Date fechaCastigada) {
        this.fechaCastigada = fechaCastigada;
    }

    public Date getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(Date fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
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

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public Long getIdTipoSuscripcion() {
        return idTipoSuscripcion;
    }

    public void setIdTipoSuscripcion(Long idTipoSuscripcion) {
        this.idTipoSuscripcion = idTipoSuscripcion;
    }

    public Long getIdTipoUsoSuscripcion() {
        return idTipoUsoSuscripcion;
    }

    public void setIdTipoUsoSuscripcion(Long idTipoUsoSuscripcion) {
        this.idTipoUsoSuscripcion = idTipoUsoSuscripcion;
    }

    public Long getIdLiquidacion() {
        return idLiquidacion;
    }

    public void setIdLiquidacion(Long idLiquidacion) {
        this.idLiquidacion = idLiquidacion;
    }

    public Long getIdTercero() {
        return idTercero;
    }

    public void setIdTercero(Long idTercero) {
        this.idTercero = idTercero;
    }

    public Long getIdCiclo() {
        return idCiclo;
    }

    public void setIdCiclo(Long idCiclo) {
        this.idCiclo = idCiclo;
    }

    public Long getIdPeriodo() {
        return idPeriodo;
    }

    public void setIdPeriodo(Long idPeriodo) {
        this.idPeriodo = idPeriodo;
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

    public Long getIdAmortizacion() {
        return idAmortizacion;
    }

    public void setIdAmortizacion(Long idAmortizacion) {
        this.idAmortizacion = idAmortizacion;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Long getIdHistoricoLiquidacion() {
        return idHistoricoLiquidacion;
    }

    public void setIdHistoricoLiquidacion(Long idHistoricoLiquidacion) {
        this.idHistoricoLiquidacion = idHistoricoLiquidacion;
    }

    public Long getIdOrigen() {
        return idOrigen;
    }

    public void setIdOrigen(Long idOrigen) {
        this.idOrigen = idOrigen;
    }

    public Long getIdTipoTercero() {
        return idTipoTercero;
    }

    public void setIdTipoTercero(Long idTipoTercero) {
        this.idTipoTercero = idTipoTercero;
    }

    public Date getFechaSuspension() {
        return fechaSuspension;
    }

    public void setFechaSuspension(Date fechaSuspension) {
        this.fechaSuspension = fechaSuspension;
    }

    public Long getIdFinanciacion() {
        return idFinanciacion;
    }

    public void setIdFinanciacion(Long idFinanciacion) {
        this.idFinanciacion = idFinanciacion;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdMovimiento() {
        return idMovimiento;
    }

    public void setIdMovimiento(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

    public Double getValorReal() {
        return valorReal;
    }

    public void setValorReal(Double valorReal) {
        this.valorReal = valorReal;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

}
