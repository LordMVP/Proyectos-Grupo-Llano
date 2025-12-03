package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestNotNotaDTO {
	
	private String fecha;
	
	private String observacion;
	
	private Integer uniMotnota;	
	
	private Long dsusIdregistr;
	
	private List<Long> facturas;

	public String getFecha() {
		return fecha;
	}

	public void setFecha(String fecha) {
		this.fecha = fecha;
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

	public Long getDsusIdregistr() {
		return dsusIdregistr;
	}

	public void setDsusIdregistr(Long dsusIdregistr) {
		this.dsusIdregistr = dsusIdregistr;
	}

	public List<Long> getFacturas() {
		return facturas;
	}

	public void setFacturas(List<Long> facturas) {
		this.facturas = facturas;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dsusIdregistr == null) ? 0 : dsusIdregistr.hashCode());
		result = prime * result + ((facturas == null) ? 0 : facturas.hashCode());
		result = prime * result + ((fecha == null) ? 0 : fecha.hashCode());
		result = prime * result + ((observacion == null) ? 0 : observacion.hashCode());
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
		RequestNotNotaDTO other = (RequestNotNotaDTO) obj;
		if (dsusIdregistr == null) {
			if (other.dsusIdregistr != null)
				return false;
		} else if (!dsusIdregistr.equals(other.dsusIdregistr))
			return false;
		if (facturas == null) {
			if (other.facturas != null)
				return false;
		} else if (!facturas.equals(other.facturas))
			return false;
		if (fecha == null) {
			if (other.fecha != null)
				return false;
		} else if (!fecha.equals(other.fecha))
			return false;
		if (observacion == null) {
			if (other.observacion != null)
				return false;
		} else if (!observacion.equals(other.observacion))
			return false;
		if (uniMotnota == null) {
			if (other.uniMotnota != null)
				return false;
		} else if (!uniMotnota.equals(other.uniMotnota))
			return false;
		return true;
	}

	
}
