package com.bioagricola.aforos.entity.dto;

import lombok.Data;

@Data
public class GenGeneradorResource {

	private Long genIderegistro;
	private Long uniTipouso;
	private String genNombre;
	private String uniTipousoDesc;
	private Float genDesde;
	private Float genHasta;
	private Float genFactorEquivalencia;
}
