package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitDetailByAforoDTO {

	private Long consecutivo;
	private List<ConceptoDTO> detalles;
	private Double equivalenciaConcepto;
	private String estado;
	private String fechaEjecucion;
	private String fechaProgramacion;
	private String fechaVisita;
	private String diaSemanaFechaProgramacion;
	private Long id;
	private String observaciones;
	private Long semana;
	private Double peso;
	private Double volumen;
	private Long usuIderegistro;
	
}
