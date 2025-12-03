package com.bioagricola.homologaciones.dto;

import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionTablaDTO;

import lombok.Data;

@Data
public class PiminsActualizarTablaRequest {
	
	private PiminsProyeccionTablaDTO tabla;
	private Long piminsIderegistro;	 
}
