package com.bioagricola.apirest.modelo.entidades.aseo;

/**
 * Enum que representa los diferentes estados de procesamiento.
 */
public enum EstadoProcesado {

    T("Procesamiento terminado"),
    P("Procesamiento en progreso"),
    E("Procesamiento con error"),
    N("Procesamiento no iniciado");

    private final String descripcion;

    EstadoProcesado(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}