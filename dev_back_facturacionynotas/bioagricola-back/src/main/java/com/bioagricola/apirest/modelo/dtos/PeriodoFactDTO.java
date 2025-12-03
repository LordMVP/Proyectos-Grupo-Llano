package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

public class PeriodoFactDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String perNombre;
	
	private Integer perIderegistro;
	
	public PeriodoFactDTO(String perNombre, Integer perIderegistro) {
		this.perNombre = perNombre;
		this.perIderegistro = perIderegistro;
	}

	public String getPerNombre() {
		return perNombre;
	}

	public void setPerNombre(String perNombre) {
		this.perNombre = perNombre;
	}

	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}
	
	

}
