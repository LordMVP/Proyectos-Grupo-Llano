package com.bioagricola.homologaciones.dto.basic;

import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class PimpProcesoImportacionDTO {

	private Long pimpIderegistro;
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private LocalDateTime pimpFechaCreacion;
	private Integer pimpNumeroRegistros;
	private String pimpEstado;
	private String pimpDescripcion;
	private String imarcNombre;
	
	
}
