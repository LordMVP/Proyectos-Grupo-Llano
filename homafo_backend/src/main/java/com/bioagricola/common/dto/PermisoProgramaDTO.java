package com.bioagricola.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PermisoProgramaDTO {

	private Long idPrograma;	
	private String codigoPermiso;
	private Long idPermiso;
	private String nombrePermiso;
	
}
