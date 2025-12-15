package com.bioagricola.apirest.modelo.dtos;

public class ProgresoLiqAprovDTO {
    private String estadoProceso;
    private Byte cantidadRegistros;

    public String getEstadoProceso() {
        return estadoProceso;
    }

    public void setEstadoProceso(String estadoProceso) {
        this.estadoProceso = estadoProceso;
    }

    public Byte getCantidadRegistros() {
        return cantidadRegistros;
    }

    public void setCantidadRegistros(Byte cantidadRegistros) {
        this.cantidadRegistros = cantidadRegistros;
    }
}
