package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

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
public class ParParametroDTO implements Serializable{	

	
	private Integer idParametro;
	
	private String descParametro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ParParametroDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }
    
	public ParParametroDTO(Integer idParametro, String descParametro) {
		super();
		this.idParametro = idParametro;
		this.descParametro = descParametro;
	}

	@JsonProperty("idParametro")
	public Integer getIdParametro() {
		return idParametro;
	}

	@JsonProperty("idParametro")
	public void setIdParametro(Integer idParametro) {
		this.idParametro = idParametro;
	}

	@JsonProperty("descParametro")
	public String getDescParametro() {
		return descParametro;
	}

	@JsonProperty("descParametro")
	public void setDescParametro(String descParametro) {
		this.descParametro = descParametro;
	}
	
	

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((descParametro == null) ? 0 : descParametro.hashCode());
		result = prime * result + ((idParametro == null) ? 0 : idParametro.hashCode());
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
		ParParametroDTO other = (ParParametroDTO) obj;
		if (descParametro == null) {
			if (other.descParametro != null)
				return false;
		} else if (!descParametro.equals(other.descParametro))
			return false;
		if (idParametro == null) {
			if (other.idParametro != null)
				return false;
		} else if (!idParametro.equals(other.idParametro))
			return false;
		return true;
	}
	
} 

