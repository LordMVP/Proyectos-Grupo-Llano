package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitEditAforoDTO {

	private Long idAforo;
	private Long numeroVisita;
	private Long idMaestro;
	private String fechaVisita;
	private String dia;
	private String aforador;
	private Long semana;
	private Double volumen;
	private Double total;
	private Double peso;
	private String estado;
	private List<VisitEditDetailAforoDTO> detalles;
	private String Observaciones;
	private Long consecutivo;
}

