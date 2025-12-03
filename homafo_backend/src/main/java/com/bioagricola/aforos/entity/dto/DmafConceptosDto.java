package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DmafConceptosDto
{
	private List<ConceptoDTO> listaConceptosDetalles;
	private Long dmafIderegistro;
	private String fechaDmaf;
	private String observacionesDmaf;
	

}
