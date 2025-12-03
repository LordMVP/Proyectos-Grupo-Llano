package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ConsolidatedDetailAforoDTO {

	private String mes;
	private Integer numeroVisitas;
	private Double volumenM3;
	private Double volumenMes;

}

