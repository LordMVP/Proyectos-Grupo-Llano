package com.bioagricola.homologaciones.dto.basic;

import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class MubaMunbarrioDTO {
	
	private Long mubaIderegistro;
	private Long uniMunicipio;
	private Long uniBarrio;
	private Long mubaSector;
	private Float mubaFactor;
	private Set<Long> complementos;
	private Long barrioHomllanogas;
	private Set<Long> dmubaRutas;
	private Set<Integer> dmubaFrecuenciasBarrido;
	private List<Long> mbru;
	private String zonaRiesgo;
	
	

}
