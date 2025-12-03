package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParParametroStringDTO implements Serializable {

	private List<Integer> idParametro =  new  ArrayList<>();

	private String descParametro;

	public ParParametroStringDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public ParParametroStringDTO(List<Integer> idParametro, String descParametro) {
		super();
		this.idParametro = idParametro;
		this.descParametro = descParametro;
	}

	

	public List<Integer> getIdParametro() {
		return idParametro;
	}

	public void setIdParametro(List<Integer> idParametro) {
		this.idParametro = idParametro;
	}

	@JsonProperty("descParametro")
	public String getDescParametro() {
		return descParametro;
	}

	@JsonProperty("descParametro")
	public void setDescParametro(String descParametro) {
		this.descParametro = descParametro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((descParametro == null) ? 0 : descParametro.hashCode());
		result = prime * result + ((idParametro == null) ? 0 : idParametro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ParParametroStringDTO other = (ParParametroStringDTO) obj;
		if (descParametro == null) {
			if (other.descParametro != null)
				return false;
		} else if (!descParametro.equals(other.descParametro))
			return false;
		if (idParametro == null) {
			if (other.idParametro != null)
				return false;
		} else if (!idParametro.equals(other.idParametro))
			return false;
		return true;
	}



	
}
