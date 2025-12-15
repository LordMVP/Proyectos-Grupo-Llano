/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;

/**
 *
 * @author jlmendoza
 */
public class TotalesDescCalidadMicroRutaDTO {
    private Integer microRuta;
    private String periodo;
    private Integer cantidad;
    private BigDecimal totalToneladas;
    private BigDecimal totalToneladasLiq;
    private BigDecimal totalDescuento;
    private BigDecimal totalInteresCorriente;
    private BigDecimal totalInteresMoratorio;
    private Integer concepto;

    public TotalesDescCalidadMicroRutaDTO() {
    }   

    public TotalesDescCalidadMicroRutaDTO(Integer microRuta, String periodo, Integer cantidad, BigDecimal totalToneladas, BigDecimal totalToneladasLiq, BigDecimal totalDescuento, BigDecimal totalInteresCorriente, BigDecimal totalInteresMoratorio) {
        this.microRuta = microRuta;
        this.periodo = periodo;
        this.cantidad = cantidad;
        this.totalToneladas = totalToneladas;
        this.totalToneladasLiq = totalToneladasLiq;
        this.totalDescuento = totalDescuento;
        this.totalInteresCorriente = totalInteresCorriente;
        this.totalInteresMoratorio = totalInteresMoratorio;
    }

    public TotalesDescCalidadMicroRutaDTO(Integer microRuta, String periodo, Integer cantidad, BigDecimal totalToneladas, BigDecimal totalToneladasLiq, BigDecimal totalDescuento, BigDecimal totalInteresCorriente, BigDecimal totalInteresMoratorio, Integer concepto) {
        this.microRuta = microRuta;
        this.periodo = periodo;
        this.cantidad = cantidad;
        this.totalToneladas = totalToneladas;
        this.totalToneladasLiq = totalToneladasLiq;
        this.totalDescuento = totalDescuento;
        this.totalInteresCorriente = totalInteresCorriente;
        this.totalInteresMoratorio = totalInteresMoratorio;
        this.concepto = concepto;
    }

    public Integer getConcepto() {
        return concepto;
    }

    public void setConcepto(Integer concepto) {
        this.concepto = concepto;
    }
    

    public Integer getMicroRuta() {
        return microRuta;
    }

    public void setMicroRuta(Integer microRuta) {
        this.microRuta = microRuta;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getTotalToneladas() {
        return totalToneladas;
    }

    public void setTotalToneladas(BigDecimal totalToneladas) {
        this.totalToneladas = totalToneladas;
    }

    public BigDecimal getTotalToneladasLiq() {
        return totalToneladasLiq;
    }

    public void setTotalToneladasLiq(BigDecimal totalToneladasLiq) {
        this.totalToneladasLiq = totalToneladasLiq;
    }

    public BigDecimal getTotalDescuento() {
        return totalDescuento;
    }

    public void setTotalDescuento(BigDecimal totalDescuento) {
        this.totalDescuento = totalDescuento;
    }

    public BigDecimal getTotalInteresCorriente() {
        return totalInteresCorriente;
    }

    public void setTotalInteresCorriente(BigDecimal totalInteresCorriente) {
        this.totalInteresCorriente = totalInteresCorriente;
    }

    public BigDecimal getTotalInteresMoratorio() {
        return totalInteresMoratorio;
    }

    public void setTotalInteresMoratorio(BigDecimal totalInteresMoratorio) {
        this.totalInteresMoratorio = totalInteresMoratorio;
    }   
    
}
