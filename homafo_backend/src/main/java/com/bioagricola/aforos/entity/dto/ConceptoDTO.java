package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ConceptoDTO {

	private Long cantidadRecipientes;
	private Long idTipoRecipiente;
	private Double peso;
	private String tipoRecipiente;
	private Double volumen;
	private String observaciones;
	private Long idDetalleConcepto;
}
