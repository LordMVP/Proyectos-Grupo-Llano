package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad LiesLiqespecialDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class LiesLiqespecialDTO implements Serializable{	

	
	private Long liesIderegistr;

	private BigDecimal liesVlrlimite;
	
	private Integer uniMunicipio;
	
	private Integer uniBarrio;
	
	private Short proCatestrato;
	
	private Integer uniTipusosuscr;
	
	private Long dsusIderegistr;
	
	private Integer uniLiquidacion;
	
	private Integer usuIderegistro;
	
	private Long terIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiesLiqespecialDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("liesIderegistr")
	public Long getLiesIderegistr(){
		return this.liesIderegistr;
	}
	
	@JsonProperty("liesIderegistr")
	public void setLiesIderegistr(Long liesIderegistr){
		this.liesIderegistr = liesIderegistr;
	}
	
	@JsonProperty("liesVlrlimite")
	public BigDecimal getLiesVlrlimite(){
		return this.liesVlrlimite;
	}
	
	@JsonProperty("liesVlrlimite")
	public void setLiesVlrlimite(BigDecimal liesVlrlimite){
		this.liesVlrlimite = liesVlrlimite;
	}
		
	@JsonProperty("uniMunicipio")
	public Integer getUniMunicipio(){
		return this.uniMunicipio;
	}
	
	@JsonProperty("uniMunicipio")
	public void setUniMunicipio(Integer uniMunicipio){
		this.uniMunicipio = uniMunicipio;
	}
		
	@JsonProperty("uniBarrio")
	public Integer getUniBarrio(){
		return this.uniBarrio;
	}
	
	@JsonProperty("uniBarrio")
	public void setUniBarrio(Integer uniBarrio){
		this.uniBarrio = uniBarrio;
	}
		
	@JsonProperty("proCatestrato")
	public Short getProCatestrato(){
		return this.proCatestrato;
	}
	
	@JsonProperty("proCatestrato")
	public void setProCatestrato(Short proCatestrato){
		this.proCatestrato = proCatestrato;
	}
		
	@JsonProperty("uniTipusosuscr")
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	@JsonProperty("uniTipusosuscr")
	public void setUniTipusosuscr(Integer uniTipusosuscr){
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	@JsonProperty("dsusIderegistr")
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	@JsonProperty("dsusIderegistr")
	public void setDsusIderegistr(Long dsusIderegistr){
		this.dsusIderegistr = dsusIderegistr;
	}
		
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("terIderegistro")
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public void setTerIderegistro(Long terIderegistro){
		this.terIderegistro = terIderegistro;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.liesIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.liesVlrlimite);
        hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
        hash = 37 * hash + Objects.hashCode(this.uniBarrio);
        hash = 37 * hash + Objects.hashCode(this.proCatestrato);
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiesLiqespecialDTO que se pasa
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
        final LiesLiqespecialDTO other = (LiesLiqespecialDTO) obj;
                
        if (!Objects.equals(this.liesIderegistr, other.liesIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.liesVlrlimite, other.liesVlrlimite)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
            return false;
        }
        
        if (!Objects.equals(this.uniBarrio, other.uniBarrio)) {
            return false;
        }
        
        if (!Objects.equals(this.proCatestrato, other.proCatestrato)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.terIderegistro, other.terIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

