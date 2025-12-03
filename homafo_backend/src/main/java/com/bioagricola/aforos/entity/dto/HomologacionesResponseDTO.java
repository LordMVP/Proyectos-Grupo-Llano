package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HomologacionesResponseDTO {

	private String referenciaComercial;
	private String actividadComercial;
	private String nombreEstablecimiento;
	private String frecuenciaRecoleccion;
	private String jornada;
}
