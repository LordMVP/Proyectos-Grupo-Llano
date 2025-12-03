package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ParametrizacionDiminsRequest
{
	private Integer idDimins;
	private String nombreColumna;
	private String json;
	private String tipoResolucion;
	private String tipoDato;
	//private String tipoDato;
	private String validador;
	private Boolean obligatorio;
	private Integer longitud;
	private Boolean diminseditable;
	private Boolean diminsSugerido;
	private String diminsJsonSugerido;

}
