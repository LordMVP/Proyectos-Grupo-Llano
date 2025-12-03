/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Date;
import com.gell.psews.persistencia.dto.PagoAdicionalDTO;

/**
 *
 * @author lrey
 */
public class UsuarioDTO {

    private Long idSuscripcion;
    private String nombres;
    private String direccion;
    private String codigoAnteriorGas;
    private Date fechaVencimiento;
    private Double valorGas;
    private Double valorAseo;
    private Double valorAdicionalGas;
    private Double valorAdicionalAseo;
    private String urlHabeasData;
    private String codigoanteriorAseo;
    private Long idSuscripcionAseo  ;
    private String numeroFacturaAseo ;
    private ArrayList<PagoAdicionalDTO> pagoAdicional;
    

    
    
    
    
    
    
    
    
    public UsuarioDTO() {
    }

    public UsuarioDTO(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public Long getIdSuscripcion() {
        return idSuscripcion;
    }

    public void setIdSuscripcion(Long idSuscripcion) {
        this.idSuscripcion = idSuscripcion;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCodigoAnteriorGas() {
        return codigoAnteriorGas;
    }

    public void setCodigoAnteriorGas(String codigoAnteriorGas) {
        this.codigoAnteriorGas = codigoAnteriorGas;
    }

    public Date getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(Date fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public Double getValorGas() {
        return valorGas;
    }

    public void setValorGas(Double valorGas) {
        this.valorGas = valorGas;
    }

    public Double getValorAseo() {
        return valorAseo;
    }

    public void setValorAseo(Double valorAseo) {
        this.valorAseo = valorAseo;
    }

    public String getUrlHabeasData() {
        return urlHabeasData;
    }

    public void setUrlHabeasData(String urlHabeasData) {
        this.urlHabeasData = urlHabeasData;
    }

    @Override
    public String toString() {
        return new Gson().toJson(this);
    }

    /**
     * @return the codigoanteriorAseo
     */
    public String getCodigoanteriorAseo() {
        return codigoanteriorAseo;
    }

    /**
     * @param codigoanteriorAseo the codigoanteriorAseo to set
     */
    public void setCodigoanteriorAseo(String codigoanteriorAseo) {
        this.codigoanteriorAseo = codigoanteriorAseo;
    }

    /**
     * @return the idSuscripcionAseo
     */
    public Long getIdSuscripcionAseo() {
        return idSuscripcionAseo;
    }

    /**
     * @param idSuscripcionAseo the idSuscripcionAseo to set
     */
    public void setIdSuscripcionAseo(Long idSuscripcionAseo) {
        this.idSuscripcionAseo = idSuscripcionAseo;
    }

    /**
     * @return the numeroFacturaAseo
     */
    public String getNumeroFacturaAseo() {
        return numeroFacturaAseo;
    }

    /**
     * @param numeroFacturaAseo the numeroFacturaAseo to set
     */
    public void setNumeroFacturaAseo(String numeroFacturaAseo) {
        this.numeroFacturaAseo = numeroFacturaAseo;
    }

    /**
     * @return the pagoAdicional
     */
    public ArrayList<PagoAdicionalDTO> getPagoAdicional() {
        return pagoAdicional;
    }

    /**
     * @param pagoAdicional the pagoAdicional to set
     */
    public void setPagoAdicional(ArrayList<PagoAdicionalDTO> pagoAdicional) {
        this.pagoAdicional = pagoAdicional;
    }

    /**
     * @return the valorAdicionalGas
     */
    public Double getValorAdicionalGas() {
        return valorAdicionalGas;
    }

    /**
     * @param valorAdicionalGas the valorAdicionalGas to set
     */
    public void setValorAdicionalGas(Double valorAdicionalGas) {
        this.valorAdicionalGas = valorAdicionalGas;
    }

    /**
     * @return the valorAdicionalAseo
     */
    public Double getValorAdicionalAseo() {
        return valorAdicionalAseo;
    }

    /**
     * @param valorAdicionalAseo the valorAdicionalAseo to set
     */
    public void setValorAdicionalAseo(Double valorAdicionalAseo) {
        this.valorAdicionalAseo = valorAdicionalAseo;
    }

}
