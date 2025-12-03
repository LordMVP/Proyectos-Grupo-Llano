package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LiquidacionDTO {

	private Long idTipoAforo;
	private Long idConcepto;
	private Long idMultiusuario;
	private Long idSuscripcion;
	private Long idAforo;
	private String mensaje;
	private String tipoAforo;
	private String estado;
	private Long idClaseAforo;
}
