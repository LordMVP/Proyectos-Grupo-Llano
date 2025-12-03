package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class BusquedaHomologacionCruceRequest
{
	private String catastral;
	private String tercero;
	private String direccion;
	private Integer empresa;
	private Integer dsusIderegistro;
	private Integer empresaAlt;

}
