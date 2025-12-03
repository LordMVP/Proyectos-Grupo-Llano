package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CicCicloDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class ConceptoSuscripcionDeudaDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private List<ConceptoSuscripcionReliquidadaDTO> listaConceptos;
	private String nombreTercero;
	private String documento;
	private String tipoDocumento;
	private String codigoAnterior;
	private String direccion;

	public ConceptoSuscripcionDeudaDTO() {
		//constructor por defecto
	}
	
	@JsonProperty("direccion")
	public String getDireccion() {
		return direccion;
	}
	
	@JsonProperty("direccion")
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}


	@JsonProperty("codigoAnterior")
	public String getCodigoAnterior() {
		return codigoAnterior;
	}

	@JsonProperty("codigoAnterior")
	public void setCodigoAnterior(String codigoAnterior) {
		this.codigoAnterior = codigoAnterior;
	}

	@JsonProperty("nombreTercero")
	public String getNombreTercero() {
		return nombreTercero;
	}

	@JsonProperty("nombreTercero")
	public void setNombreTercero(String nombreTercero) {
		this.nombreTercero = nombreTercero;
	}

	@JsonProperty("documento")
	public String getDocumento() {
		return documento;
	}

	@JsonProperty("documento")
	public void setDocumento(String documento) {
		this.documento = documento;
	}

	@JsonProperty("tipoDocumento")
	public String getTipoDocumento() {
		return tipoDocumento;
	}

	@JsonProperty("tipoDocumento")
	public void setTipoDocumento(String tipoDocumento) {
		this.tipoDocumento = tipoDocumento;
	}
	
	@JsonProperty("listaConceptos")
	public List<ConceptoSuscripcionReliquidadaDTO> getListaConceptos() {
		return listaConceptos;
	}
	
	@JsonProperty("listaConceptos")
	public void setListaConceptos(List<ConceptoSuscripcionReliquidadaDTO> listaConceptos) {
		this.listaConceptos = listaConceptos;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((codigoAnterior == null) ? 0 : codigoAnterior.hashCode());
		result = prime * result + ((documento == null) ? 0 : documento.hashCode());
		result = prime * result + ((listaConceptos == null) ? 0 : listaConceptos.hashCode());
		result = prime * result + ((nombreTercero == null) ? 0 : nombreTercero.hashCode());
		result = prime * result + ((tipoDocumento == null) ? 0 : tipoDocumento.hashCode());
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
		ConceptoSuscripcionDeudaDTO other = (ConceptoSuscripcionDeudaDTO) obj;
		if (codigoAnterior == null) {
			if (other.codigoAnterior != null)
				return false;
		} else if (!codigoAnterior.equals(other.codigoAnterior))
			return false;
		if (documento == null) {
			if (other.documento != null)
				return false;
		} else if (!documento.equals(other.documento))
			return false;
		if (listaConceptos == null) {
			if (other.listaConceptos != null)
				return false;
		} else if (!listaConceptos.equals(other.listaConceptos))
			return false;
		if (nombreTercero == null) {
			if (other.nombreTercero != null)
				return false;
		} else if (!nombreTercero.equals(other.nombreTercero))
			return false;
		if (tipoDocumento == null) {
			if (other.tipoDocumento != null)
				return false;
		} else if (!tipoDocumento.equals(other.tipoDocumento))
			return false;
		return true;
	}

	
}
