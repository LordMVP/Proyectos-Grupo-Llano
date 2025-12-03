package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad LiusLiqusoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class LiusLiqusoDTO implements Serializable{	

	
	private Integer liusIderegistr;

	private Integer uniTipusosuscr;
	
	private Integer uniLiquidacion;
	
	private BigDecimal liusDesviacion;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiusLiqusoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("liusIderegistr")
	public Integer getLiusIderegistr(){
		return this.liusIderegistr;
	}
	
	@JsonProperty("liusIderegistr")
	public void setLiusIderegistr(Integer liusIderegistr){
		this.liusIderegistr = liusIderegistr;
	}
	
	@JsonProperty("uniTipusosuscr")
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	@JsonProperty("uniTipusosuscr")
	public void setUniTipusosuscr(Integer uniTipusosuscr){
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
		
	@JsonProperty("liusDesviacion")
	public BigDecimal getLiusDesviacion(){
		return this.liusDesviacion;
	}
	
	@JsonProperty("liusDesviacion")
	public void setLiusDesviacion(BigDecimal liusDesviacion){
		this.liusDesviacion = liusDesviacion;
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
        
        hash = 37 * hash + Objects.hashCode(this.liusIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.liusDesviacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiusLiqusoDTO que se pasa
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
        final LiusLiqusoDTO other = (LiusLiqusoDTO) obj;
                
        if (!Objects.equals(this.liusIderegistr, other.liusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.liusDesviacion, other.liusDesviacion)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

