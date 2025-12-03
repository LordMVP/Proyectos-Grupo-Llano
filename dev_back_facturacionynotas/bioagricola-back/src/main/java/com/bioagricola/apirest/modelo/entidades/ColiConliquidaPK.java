package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

@Embeddable
public class ColiConliquidaPK implements Serializable{

private static final long serialVersionUID = 1L;
	
	@Basic(optional = false)
    @NotNull
    @Column(name="uni_concepto")
    
	private Integer uniConcepto;
  
	@Basic(optional = false)
    @NotNull
    @Column(name="uni_liquidacion")
    
	private Integer uniLiquidacion;
  

	public ColiConliquidaPK(){
		
	}

    public ColiConliquidaPK(Integer uniConcepto, Integer uniLiquidacion) {
		this.uniConcepto = uniConcepto;       
		this.uniLiquidacion = uniLiquidacion;       
    }

    
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
	
		this.uniConcepto = uniConcepto;
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
                
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ColiConliquidaPK que se pasa
     * como parámetro comprobando que comparten los mismos valores en cada uno
     * de sus atributos. Solo se tienen en cuenta los atributos simples, es
     * decir, se omiten aquellos que definen una relación con otra tabla.
     *
     * @param obj Instancia de la categoría a comprobar
     * @return Verdadero si esta instancia y la que se pasan como parámetros son
     * iguales.
     */
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final ColiConliquidaPK other = (ColiConliquidaPK) obj;
        
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        return Objects.equals(this.uniLiquidacion, other.uniLiquidacion);
                
    }
    
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
     @Override
     public String toString(){
     	StringBuilder cadena = new StringBuilder();
	     cadena.append("uniConcepto");
		 cadena.append(this.uniConcepto);
	 	cadena.append(", ");
         
	     cadena.append("uniLiquidacion");
		 cadena.append(this.uniLiquidacion);
         
     	return cadena.toString(); 
     }

} 
