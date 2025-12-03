package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

public class RequestVisitasSolDTO implements Serializable {
	
	private Integer codigoNovedad;
	
	private String observacion;
	
	private Integer idSuscripcion;	
	
	private String numeroPqr;	
	
	private String accede;
		
	public RequestVisitasSolDTO() {
		super();
	}

	

	public Integer getCodigoNovedad() {
		return codigoNovedad;
	}



	public void setCodigoNovedad(Integer codigoNovedad) {
		this.codigoNovedad = codigoNovedad;
	}



	public String getObservacion() {
		return observacion;
	}



	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}



	public Integer getIdSuscripcion() {
		return idSuscripcion;
	}



	public void setIdSuscripcion(Integer idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}



	public String getNumeroPqr() {
		return numeroPqr;
	}



	public void setNumeroPqr(String numeroPqr) {
		this.numeroPqr = numeroPqr;
	}



	public String getAccede() {
		return accede;
	}



	public void setAccede(String accede) {
		this.accede = accede;
	}



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accede == null) ? 0 : accede.hashCode());
		result = prime * result + ((codigoNovedad == null) ? 0 : codigoNovedad.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((numeroPqr == null) ? 0 : numeroPqr.hashCode());
		result = prime * result + ((observacion == null) ? 0 : observacion.hashCode());
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
		RequestVisitasSolDTO other = (RequestVisitasSolDTO) obj;
		if (accede == null) {
			if (other.accede != null)
				return false;
		} else if (!accede.equals(other.accede))
			return false;
		if (codigoNovedad == null) {
			if (other.codigoNovedad != null)
				return false;
		} else if (!codigoNovedad.equals(other.codigoNovedad))
			return false;
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
		return true;
	}

	
}
