package com.bioagricola.homologaciones.dto.basic;

import java.util.List;

import lombok.Data;

@Data
public class PiminsJsonDTO {

	private Integer fila;
	private List<PiminsProyeccionTablaDTO> tablas;
	
	
}
