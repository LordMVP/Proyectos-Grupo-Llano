package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class RutaprRutaRequest
{
	private Integer rutapr_ideregistro;
    private Integer dsus_ideregistr;
    private Integer rut_ideregistro;
    private Integer ter_aprovechamiento;
    private Boolean rutapr_incentivo;
    private Boolean rutapr_aforado;
}
