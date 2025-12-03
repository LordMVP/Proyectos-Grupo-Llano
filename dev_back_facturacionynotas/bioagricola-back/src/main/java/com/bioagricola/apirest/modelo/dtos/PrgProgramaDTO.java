package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad PrgPrograma que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class PrgProgramaDTO implements Serializable {

	private Integer prgIderegistro;

	private String prgAbreviatura;

	private String prgLocaliza;

	private String prgNombre;

	private String prgTipo;

	private String prgVersion;

	private Integer usuIderegistro;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public PrgProgramaDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	@JsonProperty("prgIderegistro")
	public Integer getPrgIderegistro() {
		return prgIderegistro;
	}

	@JsonProperty("prgIderegistro")
	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	@JsonProperty("prgAbreviatura")
	public String getPrgAbreviatura() {
		return prgAbreviatura;
	}

	@JsonProperty("prgAbreviatura")
	public void setPrgAbreviatura(String prgAbreviatura) {
		this.prgAbreviatura = prgAbreviatura;
	}

	@JsonProperty("prgLocaliza")
	public String getPrgLocaliza() {
		return prgLocaliza;
	}

	@JsonProperty("prgLocaliza")
	public void setPrgLocaliza(String prgLocaliza) {
		this.prgLocaliza = prgLocaliza;
	}

	@JsonProperty("prgNombre")
	public String getPrgNombre() {
		return prgNombre;
	}

	@JsonProperty("prgNombre")
	public void setPrgNombre(String prgNombre) {
		this.prgNombre = prgNombre;
	}

	@JsonProperty("prgTipo")
	public String getPrgTipo() {
		return prgTipo;
	}

	@JsonProperty("prgTipo")
	public void setPrgTipo(String prgTipo) {
		this.prgTipo = prgTipo;
	}

	@JsonProperty("prgVersion")
	public String getPrgVersion() {
		return prgVersion;
	}

	@JsonProperty("prgVersion")
	public void setPrgVersion(String prgVersion) {
		this.prgVersion = prgVersion;
	}

	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((prgAbreviatura == null) ? 0 : prgAbreviatura.hashCode());
		result = prime * result + ((prgIderegistro == null) ? 0 : prgIderegistro.hashCode());
		result = prime * result + ((prgLocaliza == null) ? 0 : prgLocaliza.hashCode());
		result = prime * result + ((prgNombre == null) ? 0 : prgNombre.hashCode());
		result = prime * result + ((prgTipo == null) ? 0 : prgTipo.hashCode());
		result = prime * result + ((prgVersion == null) ? 0 : prgVersion.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
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
		PrgProgramaDTO other = (PrgProgramaDTO) obj;
		if (prgAbreviatura == null) {
			if (other.prgAbreviatura != null)
				return false;
		} else if (!prgAbreviatura.equals(other.prgAbreviatura))
			return false;
		if (prgIderegistro == null) {
			if (other.prgIderegistro != null)
				return false;
		} else if (!prgIderegistro.equals(other.prgIderegistro))
			return false;
		if (prgLocaliza == null) {
			if (other.prgLocaliza != null)
				return false;
		} else if (!prgLocaliza.equals(other.prgLocaliza))
			return false;
		if (prgNombre == null) {
			if (other.prgNombre != null)
				return false;
		} else if (!prgNombre.equals(other.prgNombre))
			return false;
		if (prgTipo == null) {
			if (other.prgTipo != null)
				return false;
		} else if (!prgTipo.equals(other.prgTipo))
			return false;
		if (prgVersion == null) {
			if (other.prgVersion != null)
				return false;
		} else if (!prgVersion.equals(other.prgVersion))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
