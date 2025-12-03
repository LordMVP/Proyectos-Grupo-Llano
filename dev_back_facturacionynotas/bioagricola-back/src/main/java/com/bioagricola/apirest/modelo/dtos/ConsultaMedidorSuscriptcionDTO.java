package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ConsultaMedidorSuscriptcionDTO implements Serializable {

	private Long idSuscripcion;

	private String nombreCompletoTercero;

	private Long suscripcionAseo;

	public ConsultaMedidorSuscriptcionDTO() {
		//constructor por defecto
	}

	@JsonProperty("idSuscripcion")
	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("nombreCompletoTercero")
	public String getNombreCompletoTercero() {
		return nombreCompletoTercero;
	}

	@JsonProperty("nombreCompletoTercero")
	public void setNombreCompletoTercero(String nombreCompletoTercero) {
		this.nombreCompletoTercero = nombreCompletoTercero;
	}

	@JsonProperty("suscripcionAseo")
	public Long getSuscripcionAseo() {
		return suscripcionAseo;
	}

	@JsonProperty("suscripcionAseo")
	public void setSuscripcionAseo(Long suscripcionAseo) {
		this.suscripcionAseo = suscripcionAseo;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((nombreCompletoTercero == null) ? 0 : nombreCompletoTercero.hashCode());
		result = prime * result + ((suscripcionAseo == null) ? 0 : suscripcionAseo.hashCode());
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
		ConsultaMedidorSuscriptcionDTO other = (ConsultaMedidorSuscriptcionDTO) obj;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (nombreCompletoTercero == null) {
			if (other.nombreCompletoTercero != null)
				return false;
		} else if (!nombreCompletoTercero.equals(other.nombreCompletoTercero))
			return false;
		if (suscripcionAseo == null) {
			if (other.suscripcionAseo != null)
				return false;
		} else if (!suscripcionAseo.equals(other.suscripcionAseo))
			return false;
		return true;
	}

}
