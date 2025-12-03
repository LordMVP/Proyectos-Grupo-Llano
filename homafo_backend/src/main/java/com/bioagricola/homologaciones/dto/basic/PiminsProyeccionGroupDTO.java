package com.bioagricola.homologaciones.dto.basic;

import java.util.List;

import lombok.Data;

@Data
public class PiminsProyeccionGroupDTO {	
	private Integer fila;
	private List<PiminsProyeccionTablaDTO> tablas;
	
}
