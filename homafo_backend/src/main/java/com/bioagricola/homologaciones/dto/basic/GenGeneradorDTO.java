package com.bioagricola.homologaciones.dto.basic;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Getter@Setter
public class GenGeneradorDTO {

	private Long genIderegistro;
	private UniUnidadDTO unidad;
	private Long uniClaseaforo;
	private Long uniTipouso;
	private String uniTipousoDesc;
	private Double genDesde;
	private Double genHasta;
	private Double genVolumenDesde;
	private Double genVolumenHasta;
	private Double genFactorEquivalencia;
	private Date fechaGenerador;

}
