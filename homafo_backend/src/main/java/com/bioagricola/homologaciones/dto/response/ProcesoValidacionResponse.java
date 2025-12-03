package com.bioagricola.homologaciones.dto.response;

import lombok.Data;

import com.bioagricola.aforos.entity.dto.ProcesoInfoDTO;

@Data
public class ProcesoValidacionResponse {
    private boolean procesoInactivo;
    private int codigo;
    private String mensaje;
    private ProcesoInfoDTO procesoActivo;
    
    public ProcesoValidacionResponse(boolean procesoInactivo, ProcesoInfoDTO procesoActivo, String mensaje) {
        this.procesoInactivo = procesoInactivo;
        this.codigo = 0;
        this.mensaje = mensaje;
        this.procesoActivo = procesoActivo;
    }
    
    public ProcesoValidacionResponse(String mensajeError) {
        this.procesoInactivo = true;
        this.codigo = 1;
        this.mensaje = mensajeError;
        this.procesoActivo = null;
    }
}