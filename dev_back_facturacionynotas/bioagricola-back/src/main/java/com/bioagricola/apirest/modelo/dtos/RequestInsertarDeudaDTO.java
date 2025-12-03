package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

public class RequestInsertarDeudaDTO {

	private List<RequestConceptoDeuda> listaConceptos;
	private Integer idFactura; 
	private Integer tipoNota;
	
	public RequestInsertarDeudaDTO() {
		super();
	}

	
	public List<RequestConceptoDeuda> getListaConceptos() {
		return listaConceptos;
	}


	public void setListaConceptos(List<RequestConceptoDeuda> listaConceptos) {
		this.listaConceptos = listaConceptos;
	}


	public Integer getIdFactura() {
		return idFactura;
	}


	public void setIdFactura(Integer idFactura) {
		this.idFactura = idFactura;
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
		result = prime * result + ((idFactura == null) ? 0 : idFactura.hashCode());
		result = prime * result + ((listaConceptos == null) ? 0 : listaConceptos.hashCode());
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
		RequestInsertarDeudaDTO other = (RequestInsertarDeudaDTO) obj;
		if (idFactura == null) {
			if (other.idFactura != null)
				return false;
		} else if (!idFactura.equals(other.idFactura))
			return false;
		if (listaConceptos == null) {
			if (other.listaConceptos != null)
				return false;
		} else if (!listaConceptos.equals(other.listaConceptos))
			return false;
		if (tipoNota == null) {
			if (other.tipoNota != null)
				return false;
		} else if (!tipoNota.equals(other.tipoNota))
			return false;
		return true;
	}

}
