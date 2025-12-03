package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class RequestNofaDTO implements Serializable {

	private Integer cicIderegistro;

	private Integer perIderegistro;

	private Short cicAnoactual;

	private Integer empIderegistro;

	private Integer uniIderegistro;

	private Integer estMotnota;

	private Integer usuIderegistro;

	public RequestNofaDTO() {
		super();
	}

	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@JsonProperty("uniIderegistro")
	public Integer getUniIderegistro() {
		return uniIderegistro;
	}

	@JsonProperty("uniIderegistro")
	public void setUniIderegistro(Integer uniIderegistro) {
		this.uniIderegistro = uniIderegistro;
	}

	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	@JsonProperty("perIderegistro")
	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	@JsonProperty("perIderegistro")
	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro() {
		return cicIderegistro;
	}

	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro) {
		this.cicIderegistro = cicIderegistro;
	}

	@JsonProperty("cicAnoactual")
	public Short getCicAnoactual() {
		return cicAnoactual;
	}

	@JsonProperty("cicAnoactual")
	public void setCicAnoactual(Short cicAnoactual) {
		this.cicAnoactual = cicAnoactual;
	}

	@JsonProperty("estMotnota")
	public Integer getEstMotnota() {
		return estMotnota;
	}

	@JsonProperty("estMotnota")
	public void setEstMotnota(Integer estMotnota) {
		this.estMotnota = estMotnota;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cicAnoactual == null) ? 0 : cicAnoactual.hashCode());
		result = prime * result + ((cicIderegistro == null) ? 0 : cicIderegistro.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((estMotnota == null) ? 0 : estMotnota.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
		result = prime * result + ((uniIderegistro == null) ? 0 : uniIderegistro.hashCode());
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
		RequestNofaDTO other = (RequestNofaDTO) obj;
		if (cicAnoactual == null) {
			if (other.cicAnoactual != null)
				return false;
		} else if (!cicAnoactual.equals(other.cicAnoactual))
			return false;
		if (cicIderegistro == null) {
			if (other.cicIderegistro != null)
				return false;
		} else if (!cicIderegistro.equals(other.cicIderegistro))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (estMotnota == null) {
			if (other.estMotnota != null)
				return false;
		} else if (!estMotnota.equals(other.estMotnota))
			return false;
		if (perIderegistro == null) {
			if (other.perIderegistro != null)
				return false;
		} else if (!perIderegistro.equals(other.perIderegistro))
			return false;
		if (uniIderegistro == null) {
			if (other.uniIderegistro != null)
				return false;
		} else if (!uniIderegistro.equals(other.uniIderegistro))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
