package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ConsolidatedAforoDTO {

	private Integer totalNumeroVisitas;
	private Double totalVolumenM3;
	private Double totalVolumenMes;
	private String factorProduccion;
	private String tipo;
	private String tafna;
	private String tipoAforo;
	private Long numAforo;
	
	private List<ConsolidatedDetailAforoDTO> detalles;
}

