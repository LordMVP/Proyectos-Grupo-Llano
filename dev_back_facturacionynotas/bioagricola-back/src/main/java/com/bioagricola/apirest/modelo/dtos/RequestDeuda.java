package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestDeuda {
	
	private char adiciona;
	private List<String> facturas;
	private Boolean suselimina;
	private Integer tiponota;
	private Integer suscripcion;
	
	
	public Integer getSuscripcion() {
		return suscripcion;
	}
	public void setSuscripcion(Integer suscripcion) {
		this.suscripcion = suscripcion;
	}
	public char getAdiciona() {
		return adiciona;
	}
	public void setAdiciona(char adiciona) {
		this.adiciona = adiciona;
	}
	public List<String> getFacturas() {
		return facturas;
	}
	public void setFacturas(List<String> facturas) {
		this.facturas = facturas;
	}

	public Integer getTiponota() {
		return tiponota;
	}
	public void setTiponota(Integer tiponota) {
		this.tiponota = tiponota;
	}
	public Boolean getSuselimina() {
		return suselimina;
	}
	public void setSuselimina(Boolean suselimina) {
		this.suselimina = suselimina;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + adiciona;
		result = prime * result + ((facturas == null) ? 0 : facturas.hashCode());
		result = prime * result + ((suscripcion == null) ? 0 : suscripcion.hashCode());
		result = prime * result + ((suselimina == null) ? 0 : suselimina.hashCode());
		result = prime * result + ((tiponota == null) ? 0 : tiponota.hashCode());
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
		RequestDeuda other = (RequestDeuda) obj;
		if (adiciona != other.adiciona)
			return false;
		if (facturas == null) {
			if (other.facturas != null)
				return false;
		} else if (!facturas.equals(other.facturas))
			return false;
		if (suscripcion == null) {
			if (other.suscripcion != null)
				return false;
		} else if (!suscripcion.equals(other.suscripcion))
			return false;
		if (suselimina == null) {
			if (other.suselimina != null)
				return false;
		} else if (!suselimina.equals(other.suselimina))
			return false;
		if (tiponota == null) {
			if (other.tiponota != null)
				return false;
		} else if (!tiponota.equals(other.tiponota))
			return false;
		return true;
	}
	
	
	
}