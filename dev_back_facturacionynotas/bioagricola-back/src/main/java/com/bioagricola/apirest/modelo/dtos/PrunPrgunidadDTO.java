package com.bioagricola.apirest.modelo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PrunPrgunidadDTO {

	private Long prunIderegistr;

	private Integer prgIderegistro;

	private Integer usuIderegistro;

	public PrunPrgunidadDTO() {
		super();
	}

	@JsonProperty("prunIderegistr")
	public Long getPrunIderegistr() {
		return prunIderegistr;
	}

	@JsonProperty("prunIderegistr")
	public void setPrunIderegistr(Long prunIderegistr) {
		this.prunIderegistr = prunIderegistr;
	}

	@JsonProperty("prgIderegistro")
	public Integer getPrgIderegistro() {
		return prgIderegistro;
	}

	@JsonProperty("prgIderegistro")
	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
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
		result = prime * result + ((prgIderegistro == null) ? 0 : prgIderegistro.hashCode());
		result = prime * result + ((prunIderegistr == null) ? 0 : prunIderegistr.hashCode());
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
		PrunPrgunidadDTO other = (PrunPrgunidadDTO) obj;
		if (prgIderegistro == null) {
			if (other.prgIderegistro != null)
				return false;
		} else if (!prgIderegistro.equals(other.prgIderegistro))
			return false;
		if (prunIderegistr == null) {
			if (other.prunIderegistr != null)
				return false;
		} else if (!prunIderegistr.equals(other.prunIderegistr))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
