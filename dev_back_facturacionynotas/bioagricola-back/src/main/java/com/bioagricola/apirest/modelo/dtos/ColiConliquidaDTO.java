package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.bioagricola.apirest.modelo.entidades.ColiConliquidaPK;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad ColiConliquidaDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class ColiConliquidaDTO implements Serializable{	

	private ColiConliquidaPK coliConliquidaPK;

	private String coliImprimir;
	
	private Integer coliIderegistr;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ColiConliquidaDTO(){
		coliConliquidaPK = new ColiConliquidaPK();
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	@JsonProperty("coliConliquidaPK")
	public ColiConliquidaPK getColiConliquidaPK(){
		return this.coliConliquidaPK;
	}
	@JsonProperty("coliConliquidaPK")
	public void setColiConliquidaPK(ColiConliquidaPK coliConliquidaPK){
		this.coliConliquidaPK   = coliConliquidaPK ;
	}  
	
	@JsonProperty("coliImprimir")
	public String getColiImprimir(){
		return this.coliImprimir;
	}
	
	@JsonProperty("coliImprimir")
	public void setColiImprimir(String coliImprimir){
		this.coliImprimir = coliImprimir;
	}
		
	@JsonProperty("coliIderegistr")
	public Integer getColiIderegistr(){
		return this.coliIderegistr;
	}
	
	@JsonProperty("coliIderegistr")
	public void setColiIderegistr(Integer coliIderegistr){
		this.coliIderegistr = coliIderegistr;
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
        
        hash = 37 * hash + Objects.hashCode(this.coliConliquidaPK);        
        hash = 37 * hash + Objects.hashCode(this.coliImprimir);
        hash = 37 * hash + Objects.hashCode(this.coliIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ColiConliquidaDTO que se pasa
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
        final ColiConliquidaDTO other = (ColiConliquidaDTO) obj;
                
        if (!Objects.equals(this.coliConliquidaPK, other.coliConliquidaPK)) {
            return false;
        }
        
        if (!Objects.equals(this.coliImprimir, other.coliImprimir)) {
            return false;
        }
        
        if (!Objects.equals(this.coliIderegistr, other.coliIderegistr)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

