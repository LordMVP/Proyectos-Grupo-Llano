package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad RacoRanconceptDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class RacoRanconceptDTO implements Serializable{	

	
	private Integer racoIderegistr;

	private Integer uniConcepto;
	
	private BigDecimal racoRaninicial;
	
	private BigDecimal racoRanfinal;
	
	private BigDecimal racoValor;
	
	private String racoFormula;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RacoRanconceptDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("racoIderegistr")
	public Integer getRacoIderegistr(){
		return this.racoIderegistr;
	}
	
	@JsonProperty("racoIderegistr")
	public void setRacoIderegistr(Integer racoIderegistr){
		this.racoIderegistr = racoIderegistr;
	}
	
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
		this.uniConcepto = uniConcepto;
	}
		
	@JsonProperty("racoRaninicial")
	public BigDecimal getRacoRaninicial(){
		return this.racoRaninicial;
	}
	
	@JsonProperty("racoRaninicial")
	public void setRacoRaninicial(BigDecimal racoRaninicial){
		this.racoRaninicial = racoRaninicial;
	}
		
	@JsonProperty("racoRanfinal")
	public BigDecimal getRacoRanfinal(){
		return this.racoRanfinal;
	}
	
	@JsonProperty("racoRanfinal")
	public void setRacoRanfinal(BigDecimal racoRanfinal){
		this.racoRanfinal = racoRanfinal;
	}
		
	@JsonProperty("racoValor")
	public BigDecimal getRacoValor(){
		return this.racoValor;
	}
	
	@JsonProperty("racoValor")
	public void setRacoValor(BigDecimal racoValor){
		this.racoValor = racoValor;
	}
		
	@JsonProperty("racoFormula")
	public String getRacoFormula(){
		return this.racoFormula;
	}
	
	@JsonProperty("racoFormula")
	public void setRacoFormula(String racoFormula){
		this.racoFormula = racoFormula;
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
        
        hash = 37 * hash + Objects.hashCode(this.racoIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.racoRaninicial);
        hash = 37 * hash + Objects.hashCode(this.racoRanfinal);
        hash = 37 * hash + Objects.hashCode(this.racoValor);
        hash = 37 * hash + Objects.hashCode(this.racoFormula);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad RacoRanconceptDTO que se pasa
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
        final RacoRanconceptDTO other = (RacoRanconceptDTO) obj;
                
        if (!Objects.equals(this.racoIderegistr, other.racoIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.racoRaninicial, other.racoRaninicial)) {
            return false;
        }
        
        if (!Objects.equals(this.racoRanfinal, other.racoRanfinal)) {
            return false;
        }
        
        if (!Objects.equals(this.racoValor, other.racoValor)) {
            return false;
        }
        
        if (!Objects.equals(this.racoFormula, other.racoFormula)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

