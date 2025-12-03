package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CprCtrprocesoDTO implements Serializable {
	

	private Long cprIderegistro;
	private String cprEstado;
	private Date cprFecinicio;
	private Date cprFecfinal;
	private Long cprCanregistro;
	private Integer prgIderegistro;
	private Long accIderegistro;
	private Integer empIderegistro;
	private Long cprIdehilo;
	private Long usuIderegistro;
	

	public CprCtrprocesoDTO() {
		//constructor por defecto
	}

	@JsonProperty("cprIderegistro")
	public Long getCprIderegistro() {
		return this.cprIderegistro;
	}

	@JsonProperty("cprIderegistro")
	public void setCprIderegistro(Long cprIderegistro) {
		this.cprIderegistro = cprIderegistro;
	}

	@JsonProperty("cprEstado")
	public String getCprEstado() {
		return this.cprEstado;
	}
	
	@JsonProperty("cprEstado")
	public void setCprEstado(String cprEstado) {
		this.cprEstado = cprEstado;
	}

	@JsonProperty("cprFecinicio")
	public Date getCprFecinicio() {
		return cprFecinicio;
	}

	@JsonProperty("cprFecinicio")
	public void setCprFecinicio(Date cprFecinicio) {
		this.cprFecinicio = cprFecinicio;
	}

	@JsonProperty("cprFecfinal")
	public Date getCprFecfinal() {
		return cprFecfinal;
	}

	@JsonProperty("cprFecfinal")
	public void setCprFecfinal(Date cprFecfinal) {
		this.cprFecfinal = cprFecfinal;
	}

	@JsonProperty("cprCanregistro")
	public Long getCprCanregistro() {
		return cprCanregistro;
	}

	@JsonProperty("cprCanregistro")
	public void setCprCanregistro(Long cprCanregistro) {
		this.cprCanregistro = cprCanregistro;
	}

	@JsonProperty("prgIderegistro")
	public Integer getPrgIderegistro() {
		return prgIderegistro;
	}

	@JsonProperty("prgIderegistro")
	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	@JsonProperty("accIderegistro")
	public Long getAccIderegistro() {
		return accIderegistro;
	}

	@JsonProperty("accIderegistro")
	public void setAccIderegistro(Long accIderegistro) {
		this.accIderegistro = accIderegistro;
	}

	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro() {
		return empIderegistro;
	}
	
	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	@JsonProperty("cprIdehilo")
	public Long getCprIdehilo() {
		return cprIdehilo;
	}

	@JsonProperty("cprIdehilo")
	public void setCprIdehilo(Long cprIdehilo) {
		this.cprIdehilo = cprIdehilo;
	}

	@JsonProperty("usuIderegistro")
	public Long getUsuIderegistro() {
		return usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}
	

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accIderegistro == null) ? 0 : accIderegistro.hashCode());
		result = prime * result + ((cprCanregistro == null) ? 0 : cprCanregistro.hashCode());
		result = prime * result + ((cprEstado == null) ? 0 : cprEstado.hashCode());
		result = prime * result + ((cprFecfinal == null) ? 0 : cprFecfinal.hashCode());
		result = prime * result + ((cprFecinicio == null) ? 0 : cprFecinicio.hashCode());
		result = prime * result + ((cprIdehilo == null) ? 0 : cprIdehilo.hashCode());
		result = prime * result + ((cprIderegistro == null) ? 0 : cprIderegistro.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((prgIderegistro == null) ? 0 : prgIderegistro.hashCode());
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
		CprCtrprocesoDTO other = (CprCtrprocesoDTO) obj;
		if (accIderegistro == null) {
			if (other.accIderegistro != null)
				return false;
		} else if (!accIderegistro.equals(other.accIderegistro))
			return false;
		if (cprCanregistro == null) {
			if (other.cprCanregistro != null)
				return false;
		} else if (!cprCanregistro.equals(other.cprCanregistro))
			return false;
		if (cprEstado == null) {
			if (other.cprEstado != null)
				return false;
		} else if (!cprEstado.equals(other.cprEstado))
			return false;
		if (cprFecfinal == null) {
			if (other.cprFecfinal != null)
				return false;
		} else if (!cprFecfinal.equals(other.cprFecfinal))
			return false;
		if (cprFecinicio == null) {
			if (other.cprFecinicio != null)
				return false;
		} else if (!cprFecinicio.equals(other.cprFecinicio))
			return false;
		if (cprIdehilo == null) {
			if (other.cprIdehilo != null)
				return false;
		} else if (!cprIdehilo.equals(other.cprIdehilo))
			return false;
		if (cprIderegistro == null) {
			if (other.cprIderegistro != null)
				return false;
		} else if (!cprIderegistro.equals(other.cprIderegistro))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (prgIderegistro == null) {
			if (other.prgIderegistro != null)
				return false;
		} else if (!prgIderegistro.equals(other.prgIderegistro))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}
	
	

}
