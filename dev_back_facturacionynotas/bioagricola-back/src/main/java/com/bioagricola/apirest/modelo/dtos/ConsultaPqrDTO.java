package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import com.bioagricola.apirest.modelo.utils.ResponseError;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DocDocumentoDTO que se
 * transmite por los servicios REST. Solo se transmiten los atributos simples,
 * es decir, se omiten aquellos atributos que definen relaciones con otras
 * entidades.
 * 
 * @author GeneradorCRUD
 */

@XmlRootElement
public class ConsultaPqrDTO implements Serializable {

	private ResponseError response;

	private Date fechaSolicitud;

	private String radicado;

	private String tipoServicio;

	private String tipoAtencion;

	private String seccion;

	private String servicio;

	private String observaciones;

	private Boolean descartado;

	private String documentoTercero;

	private String nombreTercero;

	private String idSuscripcion;

	private String tipoAtencionCod;
	
	private String tipoNota;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	

	public ConsultaPqrDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	@JsonProperty("response")
	public ResponseError getResponse() {
		return response;
	}

	@JsonProperty("response")
	public void setResponse(ResponseError response) {
		this.response = response;
	}

	@JsonProperty("fechaSolicitud")
	public Date getFechaSolicitud() {
		return fechaSolicitud;
	}

	@JsonProperty("fechaSolicitud")
	public void setFechaSolicitud(Date fechaSolicitud) {
		this.fechaSolicitud = fechaSolicitud;
	}

	@JsonProperty("radicado")
	public String getRadicado() {
		return radicado;
	}

	@JsonProperty("radicado")
	public void setRadicado(String radicado) {
		this.radicado = radicado;
	}

	@JsonProperty("tipoServicio")
	public String getTipoServicio() {
		return tipoServicio;
	}

	@JsonProperty("tipoServicio")
	public void setTipoServicio(String tipoServicio) {
		this.tipoServicio = tipoServicio;
	}

	@JsonProperty("tipoAtencion")
	public String getTipoAtencion() {
		return tipoAtencion;
	}

	@JsonProperty("tipoAtencion")
	public void setTipoAtencion(String tipoAtencion) {
		this.tipoAtencion = tipoAtencion;
	}

	@JsonProperty("seccion")
	public String getSeccion() {
		return seccion;
	}

	@JsonProperty("seccion")
	public void setSeccion(String seccion) {
		this.seccion = seccion;
	}

	@JsonProperty("servicio")
	public String getServicio() {
		return servicio;
	}

	@JsonProperty("servicio")
	public void setServicio(String servicio) {
		this.servicio = servicio;
	}

	@JsonProperty("observaciones")
	public String getObservaciones() {
		return observaciones;
	}

	@JsonProperty("observaciones")
	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	@JsonProperty("descartado")
	public Boolean getDescartado() {
		return descartado;
	}

	@JsonProperty("descartado")
	public void setDescartado(Boolean descartado) {
		this.descartado = descartado;
	}

	@JsonProperty("documentoTercero")
	public String getDocumentoTercero() {
		return documentoTercero;
	}

	@JsonProperty("documentoTercero")
	public void setDocumentoTercero(String documentoTercero) {
		this.documentoTercero = documentoTercero;
	}

	@JsonProperty("nombreTercero")
	public String getNombreTercero() {
		return nombreTercero;
	}

	@JsonProperty("nombreTercero")
	public void setNombreTercero(String nombreTercero) {
		this.nombreTercero = nombreTercero;
	}

	@JsonProperty("idSuscripcion")
	public String getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(String idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("tipoAtencionCod")
	public String getTipoAtencionCod() {
		return tipoAtencionCod;
	}
	
	@JsonProperty("tipoAtencionCod")
	public void setTipoAtencionCod(String tipoAtencionCod) {
		this.tipoAtencionCod = tipoAtencionCod;
	}
	
	@JsonProperty("tipoNota")
	public String getTipoNota() {
		return tipoNota;
	}

	@JsonProperty("tipoNota")
	public void setTipoNota(String tipoNota) {
		this.tipoNota = tipoNota;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((descartado == null) ? 0 : descartado.hashCode());
		result = prime * result + ((documentoTercero == null) ? 0 : documentoTercero.hashCode());
		result = prime * result + ((fechaSolicitud == null) ? 0 : fechaSolicitud.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((nombreTercero == null) ? 0 : nombreTercero.hashCode());
		result = prime * result + ((observaciones == null) ? 0 : observaciones.hashCode());
		result = prime * result + ((radicado == null) ? 0 : radicado.hashCode());
		result = prime * result + ((response == null) ? 0 : response.hashCode());
		result = prime * result + ((seccion == null) ? 0 : seccion.hashCode());
		result = prime * result + ((servicio == null) ? 0 : servicio.hashCode());
		result = prime * result + ((tipoAtencion == null) ? 0 : tipoAtencion.hashCode());
		result = prime * result + ((tipoAtencionCod == null) ? 0 : tipoAtencionCod.hashCode());
		result = prime * result + ((tipoNota == null) ? 0 : tipoNota.hashCode());
		result = prime * result + ((tipoServicio == null) ? 0 : tipoServicio.hashCode());
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
		ConsultaPqrDTO other = (ConsultaPqrDTO) obj;
		if (descartado == null) {
			if (other.descartado != null)
				return false;
		} else if (!descartado.equals(other.descartado))
			return false;
		if (documentoTercero == null) {
			if (other.documentoTercero != null)
				return false;
		} else if (!documentoTercero.equals(other.documentoTercero))
			return false;
		if (fechaSolicitud == null) {
			if (other.fechaSolicitud != null)
				return false;
		} else if (!fechaSolicitud.equals(other.fechaSolicitud))
			return false;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (nombreTercero == null) {
			if (other.nombreTercero != null)
				return false;
		} else if (!nombreTercero.equals(other.nombreTercero))
			return false;
		if (observaciones == null) {
			if (other.observaciones != null)
				return false;
		} else if (!observaciones.equals(other.observaciones))
			return false;
		if (radicado == null) {
			if (other.radicado != null)
				return false;
		} else if (!radicado.equals(other.radicado))
			return false;
		if (response == null) {
			if (other.response != null)
				return false;
		} else if (!response.equals(other.response))
			return false;
		if (seccion == null) {
			if (other.seccion != null)
				return false;
		} else if (!seccion.equals(other.seccion))
			return false;
		if (servicio == null) {
			if (other.servicio != null)
				return false;
		} else if (!servicio.equals(other.servicio))
			return false;
		if (tipoAtencion == null) {
			if (other.tipoAtencion != null)
				return false;
		} else if (!tipoAtencion.equals(other.tipoAtencion))
			return false;
		if (tipoAtencionCod == null) {
			if (other.tipoAtencionCod != null)
				return false;
		} else if (!tipoAtencionCod.equals(other.tipoAtencionCod))
			return false;
		if (tipoNota == null) {
			if (other.tipoNota != null)
				return false;
		} else if (!tipoNota.equals(other.tipoNota))
			return false;
		if (tipoServicio == null) {
			if (other.tipoServicio != null)
				return false;
		} else if (!tipoServicio.equals(other.tipoServicio))
			return false;
		return true;
	}

}
