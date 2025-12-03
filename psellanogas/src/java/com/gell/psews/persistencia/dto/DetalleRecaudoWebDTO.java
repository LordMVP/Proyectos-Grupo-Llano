/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import java.util.ArrayList;
import java.util.Date;

/**
 *
 * @author lrey
 */
public class DetalleRecaudoWebDTO {

    private Long idDetalleRecaudoWeb;
    private String facturasAdicionales;
    private Long idRecaudoWeb;
    private Long idSuscripcion;
    private Long idEmpresa;
    private Date fecha = new Date();
    private Double valorPago;
    private String estadoPago;
    private String estadoAplicacionPago;
    private String mensaje;
    private     ArrayList<DetalleAplicacionRecaudoDTO> detalleAplicacionRecaudo;

    
    
    
    public Long getIdDetalleRecaudoWeb() {
        return idDetalleRecaudoWeb;
    }

    public void setIdDetalleRecaudoWeb(Long idDetalleRecaudoWeb) {
        this.idDetalleRecaudoWeb = idDetalleRecaudoWeb;
    }

    public Long getIdRecaudoWeb() {
        return idRecaudoWeb;
    }

    public void setIdRecaudoWeb(Long idRecaudoWeb) {
        this.idRecaudoWeb = idRecaudoWeb;
    }

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public Long getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Long idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Double getValorPago() {
        return valorPago;
    }

    public void setValorPago(Double valorPago) {
        this.valorPago = valorPago;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public String getEstadoAplicacionPago() {
        return estadoAplicacionPago;
    }

    public void setEstadoAplicacionPago(String estadoAplicacionPago) {
        this.estadoAplicacionPago = estadoAplicacionPago;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }



    /**
     * @return the facturasAdicionales
     */
    public String getFacturasAdicionales() {
        return facturasAdicionales;
    }

    /**
     * @param facturasAdicionales the facturasAdicionales to set
     */
    public void setFacturasAdicionales(String facturasAdicionales) {
        this.facturasAdicionales = facturasAdicionales;
    }

    /**
     * @return the detalleAplicacionRecaudo
     */
    public ArrayList<DetalleAplicacionRecaudoDTO> getDetalleAplicacionRecaudo() {
        return detalleAplicacionRecaudo;
    }

    /**
     * @param detalleAplicacionRecaudo the detalleAplicacionRecaudo to set
     */
    public void setDetalleAplicacionRecaudo(ArrayList<DetalleAplicacionRecaudoDTO> detalleAplicacionRecaudo) {
        this.detalleAplicacionRecaudo = detalleAplicacionRecaudo;
    }

}
