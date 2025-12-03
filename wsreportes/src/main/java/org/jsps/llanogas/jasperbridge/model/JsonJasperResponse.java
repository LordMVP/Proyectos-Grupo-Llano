/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlElement;
import org.json.JSONException;
import org.json.JSONObject;
/**
 *
 * @author pc
 */
@XmlRootElement
public class JsonJasperResponse implements Serializable 
{
    
    private int statusCode;
    private String consulta;
    private List<JasperFormato> parametros;
    private List<JasperFormato> subreportes;
    private String mensaje;

    public JsonJasperResponse() {
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getConsulta() {
        return consulta;
    }

    public void setConsulta(String consulta) {
        this.consulta = consulta;
    }

    public List<JasperFormato> getParametros() {
        return parametros;
    }

    public void setParametros(List<JasperFormato> parametros) {
        this.parametros = parametros;
    }

    public List<JasperFormato> getSubreportes() {
        return subreportes;
    }

    public void setSubreportes(List<JasperFormato> subreportes) {
        this.subreportes = subreportes;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
    
    
    
}
