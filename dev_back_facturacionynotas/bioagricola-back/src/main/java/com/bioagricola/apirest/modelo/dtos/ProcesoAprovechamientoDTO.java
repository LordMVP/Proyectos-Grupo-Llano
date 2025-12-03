package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Map;

public class ProcesoAprovechamientoDTO implements Serializable {
    private Map<String, Object> manejadores;
    private Map<String, Object> negocios;

    public Map<String, Object> getManejadores() {
        return manejadores;
    }

    public void setManejadores(Map<String, Object> manejadores) {
        this.manejadores = manejadores;
    }

    public Map<String, Object> getNegocios() {
        return negocios;
    }

    public void setNegocios(Map<String, Object> negocios) {
        this.negocios = negocios;
    }
}
