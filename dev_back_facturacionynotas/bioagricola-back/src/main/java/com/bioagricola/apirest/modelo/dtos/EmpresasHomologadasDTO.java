package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmpresasHomologadasDTO implements Serializable{	

	private String empresaCod;

	private String empresaNom;
	
	private Integer empIderegistro;

	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	@JsonProperty("empresaCod")
	public String getEmpresaCod() {
		return empresaCod;
	}

	@JsonProperty("empresaCod")
	public void setEmpresaCod(String empresaCod) {
		this.empresaCod = empresaCod;
	}

	@JsonProperty("empresaNom")
	public String getEmpresaNom() {
		return empresaNom;
	}

	@JsonProperty("empresaNom")
	public void setEmpresaNom(String empresaNom) {
		this.empresaNom = empresaNom;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((empresaCod == null) ? 0 : empresaCod.hashCode());
		result = prime * result + ((empresaNom == null) ? 0 : empresaNom.hashCode());
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
		EmpresasHomologadasDTO other = (EmpresasHomologadasDTO) obj;
		if (empresaCod == null) {
			if (other.empresaCod != null)
				return false;
		} else if (!empresaCod.equals(other.empresaCod))
			return false;
		if (empresaNom == null) {
			if (other.empresaNom != null)
				return false;
		} else if (!empresaNom.equals(other.empresaNom))
			return false;
		return true;
	}

}
