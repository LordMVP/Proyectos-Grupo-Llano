package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ContContactoterceroRequest
{
	private Integer cont_ideregistro;
	private Integer ter_ideregistro;
	private Integer uni_ideregistro;
	private String cont_valor;
	private String uni_nombre1;
	private String uni_codigo1;
	public ContContactoterceroRequest() {
		super();
	}

}
