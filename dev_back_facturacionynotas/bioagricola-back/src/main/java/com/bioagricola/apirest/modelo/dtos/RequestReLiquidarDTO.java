package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestReLiquidarDTO {
	
	private char liquidar;
	private List<String> suscripciones;
	private String desde;
	private String hasta;
	private Integer tipnota;
	
	public char getLiquidar() {
		return liquidar;
	}
	public void setLiquidar(char liquidar) {
		this.liquidar = liquidar;
	}
	public List<String> getSuscripciones() {
		return suscripciones;
	}
	public void setSuscripciones(List<String> suscripciones) {
		this.suscripciones = suscripciones;
	}
	public String getDesde() {
		return desde;
	}
	public void setDesde(String desde) {
		this.desde = desde;
	}
	public String getHasta() {
		return hasta;
	}
	public void setHasta(String hasta) {
		this.hasta = hasta;
	}
	public Integer getTipnota() {
		return tipnota;
	}
	public void setTipnota(Integer tipnota) {
		this.tipnota = tipnota;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((desde == null) ? 0 : desde.hashCode());
		result = prime * result + ((hasta == null) ? 0 : hasta.hashCode());
		result = prime * result + liquidar;
		result = prime * result + ((suscripciones == null) ? 0 : suscripciones.hashCode());
		result = prime * result + ((tipnota == null) ? 0 : tipnota.hashCode());
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
		RequestReLiquidarDTO other = (RequestReLiquidarDTO) obj;
		if (desde == null) {
			if (other.desde != null)
				return false;
		} else if (!desde.equals(other.desde))
			return false;
		if (hasta == null) {
			if (other.hasta != null)
				return false;
		} else if (!hasta.equals(other.hasta))
			return false;
		if (liquidar != other.liquidar)
			return false;
		if (suscripciones == null) {
			if (other.suscripciones != null)
				return false;
		} else if (!suscripciones.equals(other.suscripciones))
			return false;
		if (tipnota == null) {
			if (other.tipnota != null)
				return false;
		} else if (!tipnota.equals(other.tipnota))
			return false;
		return true;
	}
}