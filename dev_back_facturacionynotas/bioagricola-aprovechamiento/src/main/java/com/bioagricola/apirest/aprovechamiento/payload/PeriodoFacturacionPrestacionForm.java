package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
@Getter
@Setter
public class PeriodoFacturacionPrestacionForm implements Serializable {
    private Integer idPeriodo;
    private Integer perFacturacion;

    private String perNombreFacturacion;
    private Integer perPrestacion;
    private String perNombrePrestacion;

}
