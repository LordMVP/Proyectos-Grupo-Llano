package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class PeriodoIndicadoresCalidadDTO implements Serializable {

	private Integer idPeriodo;

	private String nombrePeriodo;

	public PeriodoIndicadoresCalidadDTO() {
		//constructor por defecto
	}

	public Integer getIdPeriodo() {
		return idPeriodo;
	}

	public void setIdPeriodo(Integer idPeriodo) {
		this.idPeriodo = idPeriodo;
	}

	public String getNombrePeriodo() {
		return nombrePeriodo;
	}

	public void setNombrePeriodo(String nombrePeriodo) {
		this.nombrePeriodo = nombrePeriodo;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idPeriodo == null) ? 0 : idPeriodo.hashCode());
		result = prime * result + ((nombrePeriodo == null) ? 0 : nombrePeriodo.hashCode());
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
		PeriodoIndicadoresCalidadDTO other = (PeriodoIndicadoresCalidadDTO) obj;
		if (idPeriodo == null) {
			if (other.idPeriodo != null)
				return false;
		} else if (!idPeriodo.equals(other.idPeriodo))
			return false;
		if (nombrePeriodo == null) {
			if (other.nombrePeriodo != null)
				return false;
		} else if (!nombrePeriodo.equals(other.nombrePeriodo))
			return false;
		return true;
	}

	
}
