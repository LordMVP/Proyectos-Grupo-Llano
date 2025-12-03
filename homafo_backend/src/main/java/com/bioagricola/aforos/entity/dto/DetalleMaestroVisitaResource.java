package com.bioagricola.aforos.entity.dto;

import java.util.Date;
import java.util.List;


import lombok.Data;


@Data
public class DetalleMaestroVisitaResource {

	private Long dmafIderegistro;
	private Long dmavConsecutivovisita;
	private Date dmafFechavisita;
	private Long terAforador;
	private String terAforadorNombre;
	private Double dmafPesoaforo;
	private String dmafEstado;
	private Date dmafFecharegistro;
	private Long dmafSemanasecuencia;
	private String dmafObservaciones;
	private List<DetalleConceptoVisitaResource> detalles;

}
