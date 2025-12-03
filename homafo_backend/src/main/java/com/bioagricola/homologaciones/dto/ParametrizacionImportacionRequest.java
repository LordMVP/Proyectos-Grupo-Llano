package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ParametrizacionImportacionRequest
{
	private String imarcNombreArchivo;
	private String imarcTipoArchivo;
	private Integer imarcTipoProceso;
	private List<ParametrizacionImcolRequest> detallesImcol;
	private List<ParametrizacionIminsRequest> detallesImins;
}
