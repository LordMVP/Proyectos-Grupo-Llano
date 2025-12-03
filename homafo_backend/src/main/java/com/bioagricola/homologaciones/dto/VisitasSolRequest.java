package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class VisitasSolRequest 
{
	private String fecha;
	private String novedad;
	private String cuadrilla;
	private String observaciones;
	private String reclamo_numpqr;
	private String novReporte;

}
