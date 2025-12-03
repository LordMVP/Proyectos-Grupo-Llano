package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CosuConsuscripRequest
{
	private Integer cosu_ideregistr;
    private Integer uni_concepto;
    private String concepto;
    private String desde;
    private String hasta;

}
