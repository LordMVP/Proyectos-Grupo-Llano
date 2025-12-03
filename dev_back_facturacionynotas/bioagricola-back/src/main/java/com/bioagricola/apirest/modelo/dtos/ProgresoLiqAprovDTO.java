package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

public class ProgresoLiqAprovDTO implements Serializable {
    private String estadoProceso;
    private BigDecimal cantidadRegistros;

    public String getEstadoProceso() {
        return estadoProceso;
    }

    public void setEstadoProceso(String estadoProceso) {
        this.estadoProceso = estadoProceso;
    }

    public BigDecimal getCantidadRegistros() {
        return cantidadRegistros;
    }

    public void setCantidadRegistros(BigDecimal cantidadRegistros) {
        this.cantidadRegistros = cantidadRegistros;
    }
}
