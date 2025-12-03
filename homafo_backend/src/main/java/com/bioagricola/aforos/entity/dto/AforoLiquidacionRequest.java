package com.bioagricola.aforos.entity.dto;

import lombok.Data;

@Data
public class AforoLiquidacionRequest {

	private Long aforo;
	private Long generador;
	private Double factor;

}
