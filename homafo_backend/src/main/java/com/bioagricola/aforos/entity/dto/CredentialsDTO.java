package com.bioagricola.aforos.entity.dto;

import com.gell.estandar.dto.AuditoriaDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public final class CredentialsDTO {

	private Long estempresa;
	private Long prgunidad;
	private Long usuprgunid;
	private Long clase;
	private AuditoriaDTO auditoria;
}
