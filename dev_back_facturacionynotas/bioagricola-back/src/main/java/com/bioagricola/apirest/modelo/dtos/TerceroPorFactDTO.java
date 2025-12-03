package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

public class TerceroPorFactDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String terNomcompleto;

	private Long terIderegistro;
	
	
	public TerceroPorFactDTO(String terNomcompleto,Long terIderegistro ) {
		this.terNomcompleto= terNomcompleto;
		this.terIderegistro= terIderegistro;
	}


	public String getTerNomcompleto() {
		return terNomcompleto;
	}


	public void setTerNomcompleto(String terNomcompleto) {
		this.terNomcompleto = terNomcompleto;
	}


	public Long getTerIderegistro() {
		return terIderegistro;
	}


	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}
	
	



}
