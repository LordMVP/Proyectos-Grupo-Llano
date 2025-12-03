package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ConsultaDsusHomologacionRequest
{
	private Integer dsus;
	private String medidor;
	private String pcodigo;
	private Integer empresa;
	private Boolean deshomologacion;
}
