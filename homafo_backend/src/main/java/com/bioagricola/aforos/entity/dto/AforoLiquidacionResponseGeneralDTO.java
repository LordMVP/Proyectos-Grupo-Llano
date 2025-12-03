package com.bioagricola.aforos.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AforoLiquidacionResponseGeneralDTO {

	private Integer statusCode;
	private String statusText;
	private Long cantidad;
	
}
