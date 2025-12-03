package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitEditDetailAforoDTO {

	private String tipoRecipiente;
	private String dimensiones;
	private Long cantidadRecipientes;
	private Double equivalencia;
	private Double total;
	private Long totalCantidadRecipientes;
	private Double totalTotales;
	private String observaciones;
	private Long idDetalleConcepto;
	private Double peso;
}

