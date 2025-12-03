package com.bioagricola.common.dto;

import java.util.List;

import lombok.Data;

@Data
public class ImportacionInformacionDTO {

	private String nombreArchivo;
	private Integer numeroFilasArchivo;
	private Integer numeroColumnasArchivo;
	private List<String> tablasRelacionadas;
	private String nombreConfiguracion;
	private Long pimpId;
	private Integer numeroProyecciones;
	private List<String> mensajesError;
	private Integer numeroErrores;
	
}
