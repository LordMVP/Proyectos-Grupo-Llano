package com.bioagricola.aforos.entity.dto;

import lombok.Data;

@Data
public class AforoLiquidacionMultiusuarioRequest {

	private Long aforo;
	private Long generador;
	private Double factor;
	private Double tafna;

}
