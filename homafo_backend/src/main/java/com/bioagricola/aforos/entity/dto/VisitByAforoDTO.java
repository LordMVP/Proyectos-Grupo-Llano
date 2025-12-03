package com.bioagricola.aforos.entity.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitByAforoDTO {

	private Long numAforo;
	private String tipoAforo;
	private String numPqrs;
	private Long idTipoAforo;
	private String claseSuscripcion;
	private List<VisitDetailByAforoDTO> visitasRegistradas;
	private Long usuIderegistro;
	private Long terAforador;
	private String afoFecha;
	private List<VisitDetailByAforoDTO> visitasRegistradas2;
	private String MafvFin;
	private String codSuscripcion;
	private Long idSuscripcion;
}
