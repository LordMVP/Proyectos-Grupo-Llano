package com.bioagricola.homologaciones.dto.basic;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.Data;


@Data
public class PiminsProyeccionIminsDTO {

	@JsonRawValue
	private String piminsJson;	
	private Integer piminsFila;
	private Long pimpIderegistro;
	private Long piminsIderegistro;	
	private String piminsEstado;
}
