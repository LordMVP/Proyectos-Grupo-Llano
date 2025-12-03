package com.bioagricola.homologaciones.dto.basic;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter@Setter
public class DtafoDetaTipoAforoDTO {

	private Long dtafoIderegistro;	
	private Double dtafoDesde;	
	private Double dtafoHasta;	
	private Integer dtafoCantidadVisitas;	
	private Integer dtafoFrecuencia;	
	
}
