package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DocDocumentoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */

@XmlRootElement
public class DocumentoDTO implements Serializable{	

	
	private Integer uniDocumento;

	private String uniNombre1;	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DocumentoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniDocumento")
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	@JsonProperty("uniDocumento")
	public void setUniDocumento(Integer uniDocumento){
		this.uniDocumento = uniDocumento;
	}
	
	@JsonProperty("uniNombre1")
	public String getUniNombre1(){
		return this.uniNombre1;
	}
	
	@JsonProperty("uniNombre1")
	public void setUniNombre1(String uniNombre1){
		this.uniNombre1 = uniNombre1;
	}
		
	
    @Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((uniDocumento == null) ? 0 : uniDocumento.hashCode());
		result = prime * result + ((uniNombre1 == null) ? 0 : uniNombre1.hashCode());
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
		DocumentoDTO other = (DocumentoDTO) obj;
		if (uniDocumento == null) {
			if (other.uniDocumento != null)
				return false;
		} else if (!uniDocumento.equals(other.uniDocumento))
			return false;
		if (uniNombre1 == null) {
			if (other.uniNombre1 != null)
				return false;
		} else if (!uniNombre1.equals(other.uniNombre1))
			return false;
		return true;
	}

	/**
     * Valida la igualdad de la instancia de la entidad DocDocumentoDTO que se pasa
     * como parámetro comprobando que comparten los mismos valores en cada uno
     * de sus atributos. Solo se tienen en cuenta los atributos simples, es
     * decir, se omiten aquellos que definen una relación con otra tabla.
     *
     * @param obj Instancia de la categoría a comprobar
     * iguales.
     * @return Verdadero si esta instancia y la que se pasan como parámetros son
     */

	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

