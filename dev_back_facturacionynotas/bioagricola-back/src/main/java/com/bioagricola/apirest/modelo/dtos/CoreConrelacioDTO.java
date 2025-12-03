package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CoreConrelacioDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class CoreConrelacioDTO implements Serializable{	

	
	private Integer coreIderegistr;

	private Integer uniConcepto;
	
	private Integer uniConrelacion;
	
	private Integer usuIderegistro;
	
	private Integer funIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public CoreConrelacioDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("coreIderegistr")
	public Integer getCoreIderegistr(){
		return this.coreIderegistr;
	}
	
	@JsonProperty("coreIderegistr")
	public void setCoreIderegistr(Integer coreIderegistr){
		this.coreIderegistr = coreIderegistr;
	}
	
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
		this.uniConcepto = uniConcepto;
	}
		
	@JsonProperty("uniConrelacion")
	public Integer getUniConrelacion(){
		return this.uniConrelacion;
	}
	
	@JsonProperty("uniConrelacion")
	public void setUniConrelacion(Integer uniConrelacion){
		this.uniConrelacion = uniConrelacion;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("funIderegistro")
	public Integer getFunIderegistro(){
		return this.funIderegistro;
	}
	
	@JsonProperty("funIderegistro")
	public void setFunIderegistro(Integer funIderegistro){
		this.funIderegistro = funIderegistro;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.coreIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.uniConrelacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad CoreConrelacioDTO que se pasa
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
        final CoreConrelacioDTO other = (CoreConrelacioDTO) obj;
                
        if (!Objects.equals(this.coreIderegistr, other.coreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConrelacion, other.uniConrelacion)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.funIderegistro, other.funIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

