package com.bioagricola.apirest.modelo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UspuUsuprgunidDTO {

	private Long uspuIderegistr;

	private Integer usuAuditoria;

	private Integer usuIderegistro;

	public UspuUsuprgunidDTO() {
		super();
	}

	@JsonProperty("uspuIderegistr")
	public Long getUspuIderegistr() {
		return uspuIderegistr;
	}

	@JsonProperty("uspuIderegistr")
	public void setUspuIderegistr(Long uspuIderegistr) {
		this.uspuIderegistr = uspuIderegistr;
	}

	@JsonProperty("usuAuditoria")
	public Integer getUsuAuditoria() {
		return usuAuditoria;
	}

	@JsonProperty("usuAuditoria")
	public void setUsuAuditoria(Integer usuAuditoria) {
		this.usuAuditoria = usuAuditoria;
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
		result = prime * result + ((uspuIderegistr == null) ? 0 : uspuIderegistr.hashCode());
		result = prime * result + ((usuAuditoria == null) ? 0 : usuAuditoria.hashCode());
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
		UspuUsuprgunidDTO other = (UspuUsuprgunidDTO) obj;
		if (uspuIderegistr == null) {
			if (other.uspuIderegistr != null)
				return false;
		} else if (!uspuIderegistr.equals(other.uspuIderegistr))
			return false;
		if (usuAuditoria == null) {
			if (other.usuAuditoria != null)
				return false;
		} else if (!usuAuditoria.equals(other.usuAuditoria))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
