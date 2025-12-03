package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestCosuConsuscripDTO {

	private List<String> listaSuscripciones;
	private String vigenciaDesde;
	private String vigenciaHasta;
	private Integer conceptoNota;

	public RequestCosuConsuscripDTO() {
		super();
	}

	public List<String> getListaSuscripciones() {
		return listaSuscripciones;
	}

	public void setListaSuscripciones(List<String> listaSuscripciones) {
		this.listaSuscripciones = listaSuscripciones;
	}

	public String getvigenciaDesde() {
		return vigenciaDesde;
	}

	public void setvigenciaDesde(String vigenciaDesde) {
		this.vigenciaDesde = vigenciaDesde;
	}

	public String getvigenciaHasta() {
		return vigenciaHasta;
	}

	public void setvigenciaHasta(String vigenciaHasta) {
		this.vigenciaHasta = vigenciaHasta;
	}

	public Integer getConceptoNota() {
		return conceptoNota;
	}

	public void setConceptoNota(Integer conceptoNota) {
		this.conceptoNota = conceptoNota;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((conceptoNota == null) ? 0 : conceptoNota.hashCode());
		result = prime * result + ((vigenciaDesde == null) ? 0 : vigenciaDesde.hashCode());
		result = prime * result + ((vigenciaHasta == null) ? 0 : vigenciaHasta.hashCode());
		result = prime * result + ((listaSuscripciones == null) ? 0 : listaSuscripciones.hashCode());
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
		RequestCosuConsuscripDTO other = (RequestCosuConsuscripDTO) obj;
		if (conceptoNota == null) {
			if (other.conceptoNota != null)
				return false;
		} else if (!conceptoNota.equals(other.conceptoNota))
			return false;
		if (vigenciaDesde == null) {
			if (other.vigenciaDesde != null)
				return false;
		} else if (!vigenciaDesde.equals(other.vigenciaDesde))
			return false;
		if (vigenciaHasta == null) {
			if (other.vigenciaHasta != null)
				return false;
		} else if (!vigenciaHasta.equals(other.vigenciaHasta))
			return false;
		if (listaSuscripciones == null) {
			if (other.listaSuscripciones != null)
				return false;
		} else if (!listaSuscripciones.equals(other.listaSuscripciones))
			return false;
		return true;
	}

}
