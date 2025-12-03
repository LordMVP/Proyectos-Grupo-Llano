package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad LiagLiqagendaDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class LiagLiqagendaDTO implements Serializable{	

	
	private Integer liagIderegistr;

	private Integer agendaIderegistro;
	
	private Integer uniLiquidacion;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiagLiqagendaDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("liagIderegistr")
	public Integer getLiagIderegistr(){
		return this.liagIderegistr;
	}
	
	@JsonProperty("liagIderegistr")
	public void setLiagIderegistr(Integer liagIderegistr){
		this.liagIderegistr = liagIderegistr;
	}
	
	@JsonProperty("agendaIderegistro")
	public Integer getAgendaIderegistro(){
		return this.agendaIderegistro;
	}
	
	@JsonProperty("agendaIderegistro")
	public void setAgendaIderegistro(Integer agendaIderegistro){
		this.agendaIderegistro = agendaIderegistro;
	}
		
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.liagIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.agendaIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiagLiqagendaDTO que se pasa
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
        final LiagLiqagendaDTO other = (LiagLiqagendaDTO) obj;
                
        if (!Objects.equals(this.liagIderegistr, other.liagIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.agendaIderegistro, other.agendaIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.uniLiquidacion, other.uniLiquidacion);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

