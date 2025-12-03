package com.bioagricola.common.dto;

import java.util.List;

import lombok.Data;

@Data
public class TipoProcesoHomologacionDTO {
	private List<TipoProcesoHomologacionItemDTO> valor;
	private String columnaReferencia;
}
