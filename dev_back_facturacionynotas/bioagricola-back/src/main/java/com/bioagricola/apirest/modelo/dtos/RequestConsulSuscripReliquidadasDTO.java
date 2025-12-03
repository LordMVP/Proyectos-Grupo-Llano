package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestConsulSuscripReliquidadasDTO {

	private List<Long> listaSuscripciones;
	private Integer pagina; 
	private Integer tamanoPagina;
	private Integer tipoNota;
	
	public RequestConsulSuscripReliquidadasDTO() {
		super();
	}

	public Integer getPagina() {
		return pagina;
	}

	public void setPagina(Integer pagina) {
		this.pagina = pagina;
	}

	public Integer getTamanoPagina() {
		return tamanoPagina;
	}

	public void setTamanoPagina(Integer tamanoPagina) {
		this.tamanoPagina = tamanoPagina;
	}

	public List<Long> getListaSuscripciones() {
		return listaSuscripciones;
	}

	public void setListaSuscripciones(List<Long> listaSuscripciones) {
		this.listaSuscripciones = listaSuscripciones;
	}

	public Integer getTipoNota() {
		return tipoNota;
	}

	public void setTipoNota(Integer tipoNota) {
		this.tipoNota = tipoNota;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((listaSuscripciones == null) ? 0 : listaSuscripciones.hashCode());
		result = prime * result + ((pagina == null) ? 0 : pagina.hashCode());
		result = prime * result + ((tamanoPagina == null) ? 0 : tamanoPagina.hashCode());
		result = prime * result + ((tipoNota == null) ? 0 : tipoNota.hashCode());
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
		RequestConsulSuscripReliquidadasDTO other = (RequestConsulSuscripReliquidadasDTO) obj;
		if (listaSuscripciones == null) {
			if (other.listaSuscripciones != null)
				return false;
		} else if (!listaSuscripciones.equals(other.listaSuscripciones))
			return false;
		if (pagina == null) {
			if (other.pagina != null)
				return false;
		} else if (!pagina.equals(other.pagina))
			return false;
		if (tamanoPagina == null) {
			if (other.tamanoPagina != null)
				return false;
		} else if (!tamanoPagina.equals(other.tamanoPagina))
			return false;
		if (tipoNota == null) {
			if (other.tipoNota != null)
				return false;
		} else if (!tipoNota.equals(other.tipoNota))
			return false;
		return true;
	}

}
