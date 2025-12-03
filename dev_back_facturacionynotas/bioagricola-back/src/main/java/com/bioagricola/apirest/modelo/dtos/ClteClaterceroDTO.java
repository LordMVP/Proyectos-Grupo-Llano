package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad ClteClaterceroDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class ClteClaterceroDTO implements Serializable{	

	
	private Long clteIderegistr;

	private Integer uniClatercero;
	
	private Long terIderegistro;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ClteClaterceroDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("clteIderegistr")
	public Long getClteIderegistr(){
		return this.clteIderegistr;
	}
	
	@JsonProperty("clteIderegistr")
	public void setClteIderegistr(Long clteIderegistr){
		this.clteIderegistr = clteIderegistr;
	}
	
	@JsonProperty("uniClatercero")
	public Integer getUniClatercero(){
		return this.uniClatercero;
	}
	
	@JsonProperty("uniClatercero")
	public void setUniClatercero(Integer uniClatercero){
		this.uniClatercero = uniClatercero;
	}
		
	@JsonProperty("terIderegistro")
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public void setTerIderegistro(Long terIderegistro){
		this.terIderegistro = terIderegistro;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.clteIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniClatercero);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ClteClaterceroDTO que se pasa
     * como parámetro comprobando que comparten los mismos valores en cada uno
     * de sus atributos. Solo se tienen en cuenta los atributos simples, es
     * decir, se omiten aquellos que definen una relación con otra tabla.
     *
     * @param obj Instancia de la categoría a comprobar
     * iguales.
     * @return Verdadero si esta instancia y la que se pasan como parámetros son
     */
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final ClteClaterceroDTO other = (ClteClaterceroDTO) obj;
                
        if (!Objects.equals(this.clteIderegistr, other.clteIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniClatercero, other.uniClatercero)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

