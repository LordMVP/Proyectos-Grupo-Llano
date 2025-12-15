/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bioagricola.apirest.modelo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author jlmendoza
 */
@XmlRootElement
public class ResponseDescuentosCalidadRecolAprobDTO {
    private Integer periodo;
    private String concepto;
    private ResponseDescuentosCalidadRecolDTO dctoDescuento;

    public ResponseDescuentosCalidadRecolAprobDTO() {
    }

    @JsonProperty("periodo")
    public Integer getPeriodo() {
        return periodo;
    }

    @JsonProperty("periodo")
    public void setPeriodo(Integer periodo) {
        this.periodo = periodo;
    }

    @JsonProperty("concepto")
    public String getConcepto() {
        return concepto;
    }

    @JsonProperty("concepto")
    public void setConcepto(String Concepto) {
        this.concepto = Concepto;
    }

    @JsonProperty("dctoDescuento")
    public ResponseDescuentosCalidadRecolDTO getDctoDescuento() {
        return dctoDescuento;
    }

    @JsonProperty("dctoDescuento")
    public void setDctoDescuento(ResponseDescuentosCalidadRecolDTO dctoDescuento) {
        this.dctoDescuento = dctoDescuento;
    }
    
    
    
    
}
