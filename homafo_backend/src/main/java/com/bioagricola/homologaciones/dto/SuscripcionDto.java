package com.bioagricola.homologaciones.dto;

import lombok.Data;

@Data
public class SuscripcionDto {

	private Long susIderegistro;
	private String terDocumento;
	private Integer empIderegistro;
	private Integer usuIderegistro;
	private Integer cnreId;
	private String susModconvenio;
	private String barrioNom;
	private Integer tipoLiquidacion;
	private Integer tipoUso;
	private Integer estrato;
	
}
