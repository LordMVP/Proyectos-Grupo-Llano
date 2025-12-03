package com.bioagricola.apirest.modelo.dtos;

public class RequestReclamoDTO {

	private String numeroPqr;
	private Long idSuscripcion;
	private String observacion;
	private String tipoNota;

	public String getTipoNota() {
		return tipoNota;
	}

	public void setTipoNota(String tipoNota) {
		this.tipoNota = tipoNota;
	}

	public String getObservacion() {
		return observacion;
	}

	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}

	public RequestReclamoDTO() {
		super();
	}

	public String getNumeroPqr() {
		return numeroPqr;
	}

	public void setNumeroPqr(String numeroPqr) {
		this.numeroPqr = numeroPqr;
	}

	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((numeroPqr == null) ? 0 : numeroPqr.hashCode());
		result = prime * result + ((observacion == null) ? 0 : observacion.hashCode());
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
		RequestReclamoDTO other = (RequestReclamoDTO) obj;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (numeroPqr == null) {
			if (other.numeroPqr != null)
				return false;
		} else if (!numeroPqr.equals(other.numeroPqr))
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
		return true;
	}

}
