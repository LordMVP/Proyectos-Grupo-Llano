package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CartasRequest
{
	private String fecha1;
	private String fecha2;
	private Integer tipo;
	private String pcodigo;
	private Integer ciclo;
	private Integer empresa;
}
