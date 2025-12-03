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
public class DetalleRecaudoDTO {

    private Long idDetalleRecaudo;
    private RecaudoDTO recaudo;
    private Double valorTotal;
    private Double valorReal;
    private Date fecha;
    private Long idFactura;
    private Long idCiclo;
    private Long idPeriodo;
    private Long idDocumento;
    private Long idTipoDocumento;
    private Long idDetalleFactura;
    private DistribucionRecaudoDTO distribucionRecaudo;
    private Integer anio;
    private Long idUsuario;
    private Integer version;

    public Long getIdDetalleRecaudo() {
        return idDetalleRecaudo;
    }

    public void setIdDetalleRecaudo(Long idDetalleRecaudo) {
        this.idDetalleRecaudo = idDetalleRecaudo;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Double getValorReal() {
        return valorReal;
    }

    public void setValorReal(Double valorReal) {
        this.valorReal = valorReal;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Long getIdFactura() {
        return idFactura;
    }

    public void setIdFactura(Long idFactura) {
        this.idFactura = idFactura;
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

    public Long getIdDetalleFactura() {
        return idDetalleFactura;
    }

    public void setIdDetalleFactura(Long idDetalleFactura) {
        this.idDetalleFactura = idDetalleFactura;
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

    public RecaudoDTO getRecaudo() {
        return recaudo;
    }

    public void setRecaudo(RecaudoDTO recaudo) {
        this.recaudo = recaudo;
    }

    public DistribucionRecaudoDTO getDistribucionRecaudo() {
        return distribucionRecaudo;
    }

    public void setDistribucionRecaudo(DistribucionRecaudoDTO distribucionRecaudo) {
        this.distribucionRecaudo = distribucionRecaudo;
    }

}
