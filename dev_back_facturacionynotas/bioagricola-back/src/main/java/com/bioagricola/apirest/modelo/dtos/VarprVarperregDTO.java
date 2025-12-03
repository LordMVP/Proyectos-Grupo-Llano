package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class VarprVarperregDTO {

	private Integer varprIderegistro;

	private Integer arprIderegistro;

	private Integer conIderegistro;

	private Integer empIderegistro;

	private Integer perIderegistro;

	private Integer racoIderegistro;

	private Integer usuIderegistroCer;

	private Integer usuIderegistroGb;

	private String varprEstado;

	private String varprEstadoRegistro;

	private Date varprFeccertificacion;

	private Date varprFecgrabacion;

	private BigDecimal varprValor;

	public VarprVarperregDTO() {
		super();
	}

	public Integer getVarprIderegistro() {
		return varprIderegistro;
	}

	public void setVarprIderegistro(Integer varprIderegistro) {
		this.varprIderegistro = varprIderegistro;
	}

	public Integer getArprIderegistro() {
		return arprIderegistro;
	}

	public void setArprIderegistro(Integer arprIderegistro) {
		this.arprIderegistro = arprIderegistro;
	}

	public Integer getConIderegistro() {
		return conIderegistro;
	}

	public void setConIderegistro(Integer conIderegistro) {
		this.conIderegistro = conIderegistro;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Integer getPerIderegistro() {
		return perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Integer getRacoIderegistro() {
		return racoIderegistro;
	}

	public void setRacoIderegistro(Integer racoIderegistro) {
		this.racoIderegistro = racoIderegistro;
	}

	public Integer getUsuIderegistroCer() {
		return usuIderegistroCer;
	}

	public void setUsuIderegistroCer(Integer usuIderegistroCer) {
		this.usuIderegistroCer = usuIderegistroCer;
	}

	public Integer getUsuIderegistroGb() {
		return usuIderegistroGb;
	}

	public void setUsuIderegistroGb(Integer usuIderegistroGb) {
		this.usuIderegistroGb = usuIderegistroGb;
	}

	public String getVarprEstado() {
		return varprEstado;
	}

	public void setVarprEstado(String varprEstado) {
		this.varprEstado = varprEstado;
	}

	public String getVarprEstadoRegistro() {
		return varprEstadoRegistro;
	}

	public void setVarprEstadoRegistro(String varprEstadoRegistro) {
		this.varprEstadoRegistro = varprEstadoRegistro;
	}

	public Date getVarprFeccertificacion() {
		return varprFeccertificacion;
	}

	public void setVarprFeccertificacion(Date varprFeccertificacion) {
		this.varprFeccertificacion = varprFeccertificacion;
	}

	public Date getVarprFecgrabacion() {
		return varprFecgrabacion;
	}

	public void setVarprFecgrabacion(Date varprFecgrabacion) {
		this.varprFecgrabacion = varprFecgrabacion;
	}

	public BigDecimal getVarprValor() {
		return varprValor;
	}

	public void setVarprValor(BigDecimal varprValor) {
		this.varprValor = varprValor;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((arprIderegistro == null) ? 0 : arprIderegistro.hashCode());
		result = prime * result + ((conIderegistro == null) ? 0 : conIderegistro.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
		result = prime * result + ((racoIderegistro == null) ? 0 : racoIderegistro.hashCode());
		result = prime * result + ((usuIderegistroCer == null) ? 0 : usuIderegistroCer.hashCode());
		result = prime * result + ((usuIderegistroGb == null) ? 0 : usuIderegistroGb.hashCode());
		result = prime * result + ((varprEstado == null) ? 0 : varprEstado.hashCode());
		result = prime * result + ((varprEstadoRegistro == null) ? 0 : varprEstadoRegistro.hashCode());
		result = prime * result + ((varprFeccertificacion == null) ? 0 : varprFeccertificacion.hashCode());
		result = prime * result + ((varprFecgrabacion == null) ? 0 : varprFecgrabacion.hashCode());
		result = prime * result + ((varprIderegistro == null) ? 0 : varprIderegistro.hashCode());
		result = prime * result + ((varprValor == null) ? 0 : varprValor.hashCode());
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
		VarprVarperregDTO other = (VarprVarperregDTO) obj;
		if (arprIderegistro == null) {
			if (other.arprIderegistro != null)
				return false;
		} else if (!arprIderegistro.equals(other.arprIderegistro))
			return false;
		if (conIderegistro == null) {
			if (other.conIderegistro != null)
				return false;
		} else if (!conIderegistro.equals(other.conIderegistro))
			return false;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (perIderegistro == null) {
			if (other.perIderegistro != null)
				return false;
		} else if (!perIderegistro.equals(other.perIderegistro))
			return false;
		if (racoIderegistro == null) {
			if (other.racoIderegistro != null)
				return false;
		} else if (!racoIderegistro.equals(other.racoIderegistro))
			return false;
		if (usuIderegistroCer == null) {
			if (other.usuIderegistroCer != null)
				return false;
		} else if (!usuIderegistroCer.equals(other.usuIderegistroCer))
			return false;
		if (usuIderegistroGb == null) {
			if (other.usuIderegistroGb != null)
				return false;
		} else if (!usuIderegistroGb.equals(other.usuIderegistroGb))
			return false;
		if (varprEstado == null) {
			if (other.varprEstado != null)
				return false;
		} else if (!varprEstado.equals(other.varprEstado))
			return false;
		if (varprEstadoRegistro == null) {
			if (other.varprEstadoRegistro != null)
				return false;
		} else if (!varprEstadoRegistro.equals(other.varprEstadoRegistro))
			return false;
		if (varprFeccertificacion == null) {
			if (other.varprFeccertificacion != null)
				return false;
		} else if (!varprFeccertificacion.equals(other.varprFeccertificacion))
			return false;
		if (varprFecgrabacion == null) {
			if (other.varprFecgrabacion != null)
				return false;
		} else if (!varprFecgrabacion.equals(other.varprFecgrabacion))
			return false;
		if (varprIderegistro == null) {
			if (other.varprIderegistro != null)
				return false;
		} else if (!varprIderegistro.equals(other.varprIderegistro))
			return false;
		if (varprValor == null) {
			if (other.varprValor != null)
				return false;
		} else if (!varprValor.equals(other.varprValor))
			return false;
		return true;
	}

}
