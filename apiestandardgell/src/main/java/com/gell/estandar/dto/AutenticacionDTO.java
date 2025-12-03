package com.gell.estandar.dto;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author god
 */
public class AutenticacionDTO implements Serializable {

    private String idEmpresa;
    private String usuario;
    private String clave;

    private Map<String, String> parametros = new HashMap<>();

    public AutenticacionDTO() {
    }

    public String getIdEmpresa() {
        return idEmpresa;
    }

    public AutenticacionDTO setIdEmpresa(String empresa) {
        this.idEmpresa = empresa;
        return this;
    }

    public String getUsuario() {
        return usuario;
    }

    public AutenticacionDTO setUsuario(String usuario) {
        this.usuario = usuario;
        return this;
    }

    public AutenticacionDTO setParametro(String nombre, String valor) {
        parametros.put(nombre, valor);
        return this;
    }

    public String getParametro(String nombre) {
        return parametros.get(nombre);
    }

    public String getClave() {
        return clave;
    }

    public AutenticacionDTO setClave(String clave) {
        this.clave = clave;
        return this;
    }

    public Map<String, String> getParametros() {
        return parametros;
    }

    public void setParametros(Map<String, String> parametros) {
        this.parametros = parametros;
    }

}
