package com.bioagricola.aforos.entity.dto;

import java.util.Date;


import lombok.Data;

@Data
public class DetalleConceptoVisitaResource {

	private Long dcvaIderegistro ;
	private Long uniConcepto ;
	private String uniConceptoNombre;
	private Long dcvaCantidadconcepto ;
	private Double dcvaVolumenaforo ;
	private Date dcvaFecharegistro ;
	private Date dcvaFechaactualiza ;
	private String dcvaObservaciones ;
	private Long usuIderegistro ;
	private Double dcvaPesoaforo ;
}
