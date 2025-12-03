package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NovedadesRadicadoDTO implements Serializable {

	private String idParametro;

	private String descParametro;

	public NovedadesRadicadoDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public NovedadesRadicadoDTO(String idParametro, String descParametro) {
		super();
		this.idParametro = idParametro;
		this.descParametro = descParametro;
	}

	@JsonProperty("idParametro")
	public String getIdParametro() {
		return idParametro;
	}

	@JsonProperty("idParametro")
	public void setIdParametro(String idParametro) {
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
		NovedadesRadicadoDTO other = (NovedadesRadicadoDTO) obj;
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
