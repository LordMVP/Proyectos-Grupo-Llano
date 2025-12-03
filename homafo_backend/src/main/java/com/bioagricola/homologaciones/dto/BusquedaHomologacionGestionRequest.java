package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class BusquedaHomologacionGestionRequest
{
	private String desde;
    private String hasta;
    private Integer visita;
    private Integer liquidacion;
    private Integer colaborador;
    private Integer dsus_ideregistro;
}
