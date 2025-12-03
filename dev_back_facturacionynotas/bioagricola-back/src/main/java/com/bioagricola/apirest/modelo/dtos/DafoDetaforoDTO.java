package com.bioagricola.apirest.modelo.dtos;

import java.util.Date;

public class DafoDetaforoDTO {

	private Integer dafoIderegistro;
	private Date afoFechafinvegencia;
	private String afoNumpqr;
	private Date dafoFechactualizacion;
	private Date dafoFecharegistro;
	private String dafoMultiusuporcentaje;
	private Integer dsusIderegistr;
	private Integer usuIderegistro;

	public Integer getDafoIderegistro() {
		return dafoIderegistro;
	}

	public void setDafoIderegistro(Integer dafoIderegistro) {
		this.dafoIderegistro = dafoIderegistro;
	}

	public Date getAfoFechafinvegencia() {
		return afoFechafinvegencia;
	}

	public void setAfoFechafinvegencia(Date afoFechafinvegencia) {
		this.afoFechafinvegencia = afoFechafinvegencia;
	}

	public String getAfoNumpqr() {
		return afoNumpqr;
	}

	public void setAfoNumpqr(String afoNumpqr) {
		this.afoNumpqr = afoNumpqr;
	}

	public Date getDafoFechactualizacion() {
		return dafoFechactualizacion;
	}

	public void setDafoFechactualizacion(Date dafoFechactualizacion) {
		this.dafoFechactualizacion = dafoFechactualizacion;
	}

	public Date getDafoFecharegistro() {
		return dafoFecharegistro;
	}

	public void setDafoFecharegistro(Date dafoFecharegistro) {
		this.dafoFecharegistro = dafoFecharegistro;
	}

	public String getDafoMultiusuporcentaje() {
		return dafoMultiusuporcentaje;
	}

	public void setDafoMultiusuporcentaje(String dafoMultiusuporcentaje) {
		this.dafoMultiusuporcentaje = dafoMultiusuporcentaje;
	}

	public Integer getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Integer dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((afoFechafinvegencia == null) ? 0 : afoFechafinvegencia.hashCode());
		result = prime * result + ((afoNumpqr == null) ? 0 : afoNumpqr.hashCode());
		result = prime * result + ((dafoFechactualizacion == null) ? 0 : dafoFechactualizacion.hashCode());
		result = prime * result + ((dafoFecharegistro == null) ? 0 : dafoFecharegistro.hashCode());
		result = prime * result + ((dafoIderegistro == null) ? 0 : dafoIderegistro.hashCode());
		result = prime * result + ((dafoMultiusuporcentaje == null) ? 0 : dafoMultiusuporcentaje.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
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
		DafoDetaforoDTO other = (DafoDetaforoDTO) obj;
		if (afoFechafinvegencia == null) {
			if (other.afoFechafinvegencia != null)
				return false;
		} else if (!afoFechafinvegencia.equals(other.afoFechafinvegencia))
			return false;
		if (afoNumpqr == null) {
			if (other.afoNumpqr != null)
				return false;
		} else if (!afoNumpqr.equals(other.afoNumpqr))
			return false;
		if (dafoFechactualizacion == null) {
			if (other.dafoFechactualizacion != null)
				return false;
		} else if (!dafoFechactualizacion.equals(other.dafoFechactualizacion))
			return false;
		if (dafoFecharegistro == null) {
			if (other.dafoFecharegistro != null)
				return false;
		} else if (!dafoFecharegistro.equals(other.dafoFecharegistro))
			return false;
		if (dafoIderegistro == null) {
			if (other.dafoIderegistro != null)
				return false;
		} else if (!dafoIderegistro.equals(other.dafoIderegistro))
			return false;
		if (dafoMultiusuporcentaje == null) {
			if (other.dafoMultiusuporcentaje != null)
				return false;
		} else if (!dafoMultiusuporcentaje.equals(other.dafoMultiusuporcentaje))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
