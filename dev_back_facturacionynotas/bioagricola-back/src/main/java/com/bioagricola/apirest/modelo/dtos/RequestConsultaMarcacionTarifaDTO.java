package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestConsultaMarcacionTarifaDTO {

	private List<Long> listaSuscripciones;
	private Integer conceptoNota;
	private String vigenciaDesde;
	private String vigenciaHasta;
	private Integer pagina; 
	private Integer tamanoPagina;
	
	public RequestConsultaMarcacionTarifaDTO() {
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

	public String getVigenciaDesde() {
		return vigenciaDesde;
	}

	public void setVigenciaDesde(String vigenciaDesde) {
		this.vigenciaDesde = vigenciaDesde;
	}

	public String getVigenciaHasta() {
		return vigenciaHasta;
	}

	public void setVigenciaHasta(String vigenciaHasta) {
		this.vigenciaHasta = vigenciaHasta;
	}

	public List<Long> getListaSuscripciones() {
		return listaSuscripciones;
	}

	public void setListaSuscripciones(List<Long> listaSuscripciones) {
		this.listaSuscripciones = listaSuscripciones;
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
		result = prime * result + ((listaSuscripciones == null) ? 0 : listaSuscripciones.hashCode());
		result = prime * result + ((pagina == null) ? 0 : pagina.hashCode());
		result = prime * result + ((tamanoPagina == null) ? 0 : tamanoPagina.hashCode());
		result = prime * result + ((vigenciaDesde == null) ? 0 : vigenciaDesde.hashCode());
		result = prime * result + ((vigenciaHasta == null) ? 0 : vigenciaHasta.hashCode());
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
		RequestConsultaMarcacionTarifaDTO other = (RequestConsultaMarcacionTarifaDTO) obj;
		if (conceptoNota == null) {
			if (other.conceptoNota != null)
				return false;
		} else if (!conceptoNota.equals(other.conceptoNota))
			return false;
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
		return true;
	}

}
