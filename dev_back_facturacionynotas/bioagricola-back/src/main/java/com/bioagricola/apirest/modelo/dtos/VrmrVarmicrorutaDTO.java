package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class VrmrVarmicrorutaDTO {

	private Integer vrmrIderegistro;
	private Integer arprIderegistro;
	private Integer conIderegistro;
	private Integer empIderegistro;
	private Integer perIderegistro;
	private Integer rutIdemicroruta;
	private Integer usuIderegistroCer;
	private Integer usuIderegistroGb;
	private String vrmrDescripcion;
	private String vrmrEstado;
	private String vrmrEstadoregistro;
	private Timestamp vrmrFeccerficicacion;
	private Timestamp vrmrFecgrabacion;
	private BigDecimal vrmrValor;

	public VrmrVarmicrorutaDTO() {
		super();
	}

	public Integer getVrmrIderegistro() {
		return vrmrIderegistro;
	}

	public void setVrmrIderegistro(Integer vrmrIderegistro) {
		this.vrmrIderegistro = vrmrIderegistro;
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

	public Integer getRutIdemicroruta() {
		return rutIdemicroruta;
	}

	public void setRutIdemicroruta(Integer rutIdemicroruta) {
		this.rutIdemicroruta = rutIdemicroruta;
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

	public String getVrmrDescripcion() {
		return vrmrDescripcion;
	}

	public void setVrmrDescripcion(String vrmrDescripcion) {
		this.vrmrDescripcion = vrmrDescripcion;
	}

	public String getVrmrEstado() {
		return vrmrEstado;
	}

	public void setVrmrEstado(String vrmrEstado) {
		this.vrmrEstado = vrmrEstado;
	}

	public String getVrmrEstadoregistro() {
		return vrmrEstadoregistro;
	}

	public void setVrmrEstadoregistro(String vrmrEstadoregistro) {
		this.vrmrEstadoregistro = vrmrEstadoregistro;
	}

	public Timestamp getVrmrFeccerficicacion() {
		return vrmrFeccerficicacion;
	}

	public void setVrmrFeccerficicacion(Timestamp vrmrFeccerficicacion) {
		this.vrmrFeccerficicacion = vrmrFeccerficicacion;
	}

	public Timestamp getVrmrFecgrabacion() {
		return vrmrFecgrabacion;
	}

	public void setVrmrFecgrabacion(Timestamp vrmrFecgrabacion) {
		this.vrmrFecgrabacion = vrmrFecgrabacion;
	}

	public BigDecimal getVrmrValor() {
		return vrmrValor;
	}

	public void setVrmrValor(BigDecimal vrmrValor) {
		this.vrmrValor = vrmrValor;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((arprIderegistro == null) ? 0 : arprIderegistro.hashCode());
		result = prime * result + ((conIderegistro == null) ? 0 : conIderegistro.hashCode());
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((perIderegistro == null) ? 0 : perIderegistro.hashCode());
		result = prime * result + ((rutIdemicroruta == null) ? 0 : rutIdemicroruta.hashCode());
		result = prime * result + ((usuIderegistroCer == null) ? 0 : usuIderegistroCer.hashCode());
		result = prime * result + ((usuIderegistroGb == null) ? 0 : usuIderegistroGb.hashCode());
		result = prime * result + ((vrmrDescripcion == null) ? 0 : vrmrDescripcion.hashCode());
		result = prime * result + ((vrmrEstado == null) ? 0 : vrmrEstado.hashCode());
		result = prime * result + ((vrmrEstadoregistro == null) ? 0 : vrmrEstadoregistro.hashCode());
		result = prime * result + ((vrmrFeccerficicacion == null) ? 0 : vrmrFeccerficicacion.hashCode());
		result = prime * result + ((vrmrFecgrabacion == null) ? 0 : vrmrFecgrabacion.hashCode());
		result = prime * result + ((vrmrIderegistro == null) ? 0 : vrmrIderegistro.hashCode());
		result = prime * result + ((vrmrValor == null) ? 0 : vrmrValor.hashCode());
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
		VrmrVarmicrorutaDTO other = (VrmrVarmicrorutaDTO) obj;
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
		if (rutIdemicroruta == null) {
			if (other.rutIdemicroruta != null)
				return false;
		} else if (!rutIdemicroruta.equals(other.rutIdemicroruta))
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
		if (vrmrDescripcion == null) {
			if (other.vrmrDescripcion != null)
				return false;
		} else if (!vrmrDescripcion.equals(other.vrmrDescripcion))
			return false;
		if (vrmrEstado == null) {
			if (other.vrmrEstado != null)
				return false;
		} else if (!vrmrEstado.equals(other.vrmrEstado))
			return false;
		if (vrmrEstadoregistro == null) {
			if (other.vrmrEstadoregistro != null)
				return false;
		} else if (!vrmrEstadoregistro.equals(other.vrmrEstadoregistro))
			return false;
		if (vrmrFeccerficicacion == null) {
			if (other.vrmrFeccerficicacion != null)
				return false;
		} else if (!vrmrFeccerficicacion.equals(other.vrmrFeccerficicacion))
			return false;
		if (vrmrFecgrabacion == null) {
			if (other.vrmrFecgrabacion != null)
				return false;
		} else if (!vrmrFecgrabacion.equals(other.vrmrFecgrabacion))
			return false;
		if (vrmrIderegistro == null) {
			if (other.vrmrIderegistro != null)
				return false;
		} else if (!vrmrIderegistro.equals(other.vrmrIderegistro))
			return false;
		if (vrmrValor == null) {
			if (other.vrmrValor != null)
				return false;
		} else if (!vrmrValor.equals(other.vrmrValor))
			return false;
		return true;
	}

}
