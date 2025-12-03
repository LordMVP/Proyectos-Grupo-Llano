package com.gell.gestioncartera.dto;

import lombok.Data;

@Data
public class CondonacionDto {
	private Long uspu_ideregistr;
	private Long prun_ideregistr;
	private String nombreproceso;
	private Long usu_ideregistro;
	private String nombreusuario;
	private Long luspu_ideregistro;
	private String luspu_tipo;
	private String tipoproceso;
	private double luspu_limiteporcentaje;
	private double luspu_limitemonto;
}
