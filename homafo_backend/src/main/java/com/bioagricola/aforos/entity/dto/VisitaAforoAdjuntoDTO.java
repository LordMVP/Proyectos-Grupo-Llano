package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitaAforoAdjuntoDTO {

	private String nombre;
	private String idAz;
	private String tipo;
	private Long idDetalle;
	private Long uniTipoAdjunto;
	private String observaciones;
}
