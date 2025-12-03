package com.bioagricola.homologaciones.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter @NoArgsConstructor
public class HomologacionInfoHomoRequest
{
	private Integer nuevoConvenio;
	private String nombreNuevoConvenio;
	private Integer nuevoTercero;
	private Integer usuario;
	///ghmo
	private Integer empresaHomologa;
	private Integer periodoHomologa;
	private Integer dsusHomologa;
	//dgho
	private Integer dsusHomologador;
	private Integer empresaHomologador;
	private String pcodigoHomologador;
	private Integer suscripcion1;
	private Integer suscripcion2;
	private String consumo;
	private List<Integer> consumomap;
	private String medidor;
	private String observaciones;
	private Boolean deshomologacion;

}
