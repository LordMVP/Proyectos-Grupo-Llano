package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ParametrizacionImportacionUpdateRequest
{
	private Integer idImarc;
	private String imarcNombreArchivo;
	private String imarcTipoArchivo;
	private String imarcTipoProceso;
	private String imarcEstado;
	private List<ParametrizacionImcolRequest> detallesImcol;
	private List<ParametrizacionIminsRequest> detallesImins;
}
