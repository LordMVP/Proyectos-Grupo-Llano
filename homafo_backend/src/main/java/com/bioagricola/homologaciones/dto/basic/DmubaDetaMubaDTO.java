package com.bioagricola.homologaciones.dto.basic;


import java.util.Set;

import lombok.Data;


@Data
public class DmubaDetaMubaDTO {

	private Long dmubaIderegistro;
	private Long mubaIderegistro;
	private Long barrioHomllanogas;
	private Set<Long> dmubaRutas;
	private Set<Integer> dmubaFrecuenciasBarrido;
	
}
