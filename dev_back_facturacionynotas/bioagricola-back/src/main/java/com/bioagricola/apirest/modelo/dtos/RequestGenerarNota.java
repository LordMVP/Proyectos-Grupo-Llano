package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestGenerarNota {

	private List<String> idfactura;

	private Integer tipoNota;

	private String observacion;

	private Integer uniMotnota;
	private Integer reclamacion;

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idfactura == null) ? 0 : idfactura.hashCode());
		result = prime * result + ((observacion == null) ? 0 : observacion.hashCode());
		result = prime * result + ((tipoNota == null) ? 0 : tipoNota.hashCode());
		result = prime * result + ((tipoNota == null) ? 0 : reclamacion.hashCode());
		result = prime * result + ((uniMotnota == null) ? 0 : uniMotnota.hashCode());
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
		RequestGenerarNota other = (RequestGenerarNota) obj;
		if (idfactura == null) {
			if (other.idfactura != null)
				return false;
		} else if (!idfactura.equals(other.idfactura))
			return false;
		if (observacion == null) {
			if (other.observacion != null)
				return false;
		} else if (!observacion.equals(other.observacion))
			return false;
		if (tipoNota == null) {
			if (other.tipoNota != null)
				return false;
		} else if (!tipoNota.equals(other.tipoNota))
			return false;
		if (reclamacion == null) {
			if (other.reclamacion != null)
				return false;
		} else if (!reclamacion.equals(other.reclamacion))
			return false;
		if (uniMotnota == null) {
			if (other.uniMotnota != null)
				return false;
		} else if (!uniMotnota.equals(other.uniMotnota))
			return false;
		return true;

	}

	public List<String> getFacturas() {
		return idfactura;
	}

	public void setFacturas(List<String> facturas) {
		this.idfactura = facturas;
	}

	public Integer getTipoNota() {
		return tipoNota;
	}

	public void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;
	}

	public Integer getReclamacion() {
		return reclamacion;
	}

	public void setReclamacion(Integer tipoNota) {
		this.reclamacion = tipoNota;
	}

	public String getObservacion() {
		return observacion;
	}

	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}

	public Integer getUniMotnota() {
		return uniMotnota;
	}

	public void setUniMotnota(Integer uniMotnota) {
		this.uniMotnota = uniMotnota;
	}
}