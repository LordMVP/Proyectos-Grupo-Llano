/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bioagricola.apirest.modelo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author jlmendoza
 */
@XmlRootElement
public class ResponseDescuentosCalidadRecolDTO {
    private Integer codResp;
    private String error;
    private Integer periodo;
    private boolean respuesta;
    private Map<Integer,List<TotalesDescCalidadMicroRutaDTO>> totalesMicroRuta;

    public ResponseDescuentosCalidadRecolDTO() {
    }

    @JsonProperty("codResp")
    public Integer getCodResp() {
        return codResp;
    }

    @JsonProperty("codResp")
    public void setCodResp(Integer codResp) {
        this.codResp = codResp;
    }

    @JsonProperty("error")
    public String getError() {
        return error;
    }

    @JsonProperty("error")
    public void setError(String error) {
        this.error = error;
    }

    @JsonProperty("periodo")
    public Integer getPeriodo() {
        return periodo;
    }

    @JsonProperty("periodo")
    public void setPeriodo(Integer periodo) {
        this.periodo = periodo;
    }

    @JsonProperty("respuesta")
    public boolean isRespuesta() {
        return respuesta;
    }

    @JsonProperty("respuesta")
    public void setRespuesta(boolean respuesta) {
        this.respuesta = respuesta;
    }

    @JsonProperty("totalesMicroRuta")
    public Map<Integer, List<TotalesDescCalidadMicroRutaDTO>> getTotalesMicroRuta() {
        return totalesMicroRuta;
    }

    @JsonProperty("totalesMicroRuta")
    public void setTotalesMicroRuta(Map<Integer, List<TotalesDescCalidadMicroRutaDTO>> totalesMicroRuta) {
        this.totalesMicroRuta = totalesMicroRuta;
    }
    
    
    
}
