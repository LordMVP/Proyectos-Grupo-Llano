package com.bioagricola.homologaciones.dto.basic;

import lombok.Data;

@Data
public class PiminsJsonColumnDTO {

	private String nombre;
	private Object valor;
	private Boolean sugerido;
	private Boolean editable;
	private Long dimins;
	private String etiqueta;
	
}
