package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class NotNotaDTO implements Serializable {

	private Long notIderegistro;

	private Integer cicAno;

	private String notComentario;

	private Timestamp notFecha;

	private Integer uniMotnota;

	private Integer usuIderegistro;

	private Integer dsusIderegistr;

	private Integer empIderegistro;

	private Integer perIderegistro;

	private Integer cicIderegistro;
	
	private Integer estMotnota;

	public NotNotaDTO() {
		super();
	}

	@JsonProperty("notIderegistro")
	public Long getNotIderegistro() {
		return notIderegistro;
	}

	@JsonProperty("notIderegistro")
	public void setNotIderegistro(Long notIderegistro) {
		this.notIderegistro = notIderegistro;
	}

	@JsonProperty("cicAno")
	public Integer getCicAno() {
		return cicAno;
	}

	@JsonProperty("cicAno")
	public void setCicAno(Integer cicAno) {
		this.cicAno = cicAno;
	}

	@JsonProperty("notComentario")
	public String getNotComentario() {
		return notComentario;
	}

	@JsonProperty("notComentario")
	public void setNotComentario(String notComentario) {
		this.notComentario = notComentario;
	}

	@JsonProperty("notFecha")
	public Timestamp getNotFecha() {
		return notFecha;
	}

	@JsonProperty("notFecha")
	public void setNotFecha(Timestamp notFecha) {
		this.notFecha = notFecha;
	}

	@JsonProperty("uniMotnota")
	public Integer getUniMotnota() {
		return uniMotnota;
	}

	@JsonProperty("uniMotnota")
	public void setUniMotnota(Integer uniMotnota) {
		this.uniMotnota = uniMotnota;
	}

	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@JsonProperty("dsusIderegistr")
	public Integer getDsusIderegistr() {
		return dsusIderegistr;
	}

	@JsonProperty("dsusIderegistr")
	public void setDsusIderegistr(Integer dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
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
		result = prime * result + ((cicAno == null) ? 0 : cicAno.hashCode());
		result = prime * result + ((cicIderegistro == null) ? 0 : cicIderegistro.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((estMotnota == null) ? 0 : estMotnota.hashCode());
		result = prime * result + ((notComentario == null) ? 0 : notComentario.hashCode());
		result = prime * result + ((notFecha == null) ? 0 : notFecha.hashCode());
		result = prime * result + ((notIderegistro == null) ? 0 : notIderegistro.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
		result = prime * result + ((uniMotnota == null) ? 0 : uniMotnota.hashCode());
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
		NotNotaDTO other = (NotNotaDTO) obj;
		if (cicAno == null) {
			if (other.cicAno != null)
				return false;
		} else if (!cicAno.equals(other.cicAno))
			return false;
		if (cicIderegistro == null) {
			if (other.cicIderegistro != null)
				return false;
		} else if (!cicIderegistro.equals(other.cicIderegistro))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
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
		if (notComentario == null) {
			if (other.notComentario != null)
				return false;
		} else if (!notComentario.equals(other.notComentario))
			return false;
		if (notFecha == null) {
			if (other.notFecha != null)
				return false;
		} else if (!notFecha.equals(other.notFecha))
			return false;
		if (notIderegistro == null) {
			if (other.notIderegistro != null)
				return false;
		} else if (!notIderegistro.equals(other.notIderegistro))
			return false;
		if (perIderegistro == null) {
			if (other.perIderegistro != null)
				return false;
		} else if (!perIderegistro.equals(other.perIderegistro))
			return false;
		if (uniMotnota == null) {
			if (other.uniMotnota != null)
				return false;
		} else if (!uniMotnota.equals(other.uniMotnota))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

	

}
