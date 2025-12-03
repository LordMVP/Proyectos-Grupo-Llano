package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;



public class PeriodoConsolidadoDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer prlIderegistro;
	
	private String perNombre;
	
	private String estado;
	
	public PeriodoConsolidadoDTO(Integer prlIderegistro, String perNombre,String estado) {
		this.prlIderegistro = prlIderegistro;
		this.perNombre = perNombre;
		this.estado=estado;
		
	}

	public Integer getPrlIderegistro() {
		return prlIderegistro;
	}

	public void setPrlIderegistro(Integer prlIderegistro) {
		this.prlIderegistro = prlIderegistro;
	}

	public String getPerNombre() {
		return perNombre;
	}

	public void setPerNombre(String perNombre) {
		this.perNombre = perNombre;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}
	
	
	


}
