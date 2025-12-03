package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * DAO que contiene la información de la entidad FacFacturaDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class RequestConceptosLiquidacion implements Serializable{	

	
	private Integer idliquidacion;

	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RequestConceptosLiquidacion(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


    @JsonProperty("idliquidacion")
	public Integer getidliquidacion() {

		return this.idliquidacion;
	}

	public void setidliquidacion(Integer idliquidacion) {

		this.idliquidacion = idliquidacion;
	}

			
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        
        hash = 37 * hash + Objects.hashCode(this.idliquidacion);
 
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad FacFacturaDTO que se pasa
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
        final RequestConceptosLiquidacion other = (RequestConceptosLiquidacion) obj;
                
  
        
        return (Objects.equals(this.idliquidacion, other.idliquidacion));
        
       
                
    }











	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

