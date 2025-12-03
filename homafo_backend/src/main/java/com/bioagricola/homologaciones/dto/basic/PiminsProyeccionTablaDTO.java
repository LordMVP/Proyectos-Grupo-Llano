package com.bioagricola.homologaciones.dto.basic;

import java.util.List;

import lombok.Data;

@Data
public class PiminsProyeccionTablaDTO {
	private String nombre;
	private List<PiminsJsonColumnDTO> columnas;
	private Long iminsIderegistro;
	private Integer iminsOrden;
	private String estado;
	private String etiqueta;
	@com.fasterxml.jackson.annotation.JsonIgnore
	private String sql;
	private List<String> returning;
}
