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
public class ResponseDescuentosCalidadRecolAprobRespuestaDTO {
    private Integer cantidad;
    private String respuesta;
    private boolean rep;

    public ResponseDescuentosCalidadRecolAprobRespuestaDTO() {
    }

    @JsonProperty("cantidad")
    public Integer getCantidad() {
        return cantidad;
    }

    @JsonProperty("cantidad")
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    @JsonProperty("respuesta")
    public String getRespuesta() {
        return respuesta;
    }

    @JsonProperty("respuesta")
    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    @JsonProperty("rep")
    public boolean isRep() {
        return rep;
    }

    @JsonProperty("rep")
    public void setRep(boolean rep) {
        this.rep = rep;
    }
    
    
    
}
