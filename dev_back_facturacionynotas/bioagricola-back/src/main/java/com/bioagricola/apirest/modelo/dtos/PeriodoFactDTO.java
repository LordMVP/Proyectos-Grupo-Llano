package com.bioagricola.apirest.modelo.dtos;

import lombok.Data;

@Data
public class PeriodoFactDTO {

    private String perNombre;

    private Integer perIderegistro;

    private Integer maprcIderegistr;
    
    private Integer perFacturacion;

    public PeriodoFactDTO() {
    }

    public PeriodoFactDTO(String perNombre, Integer perIderegistro) {
        this.perNombre = perNombre;
        this.perIderegistro = perIderegistro;
    }

    public PeriodoFactDTO(String perNombre, Integer perIderegistro, Integer maprcIderegistr, Integer perFacturacion) {
        this.perNombre = perNombre;
        this.perIderegistro = perIderegistro;
        this.maprcIderegistr = maprcIderegistr;
        this.perFacturacion = perFacturacion;
    }    
}
