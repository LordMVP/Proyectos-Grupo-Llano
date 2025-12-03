package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ReporteResponse
{
	private String statusText;
    private Integer statusCode;
    private boolean error;
    

}
