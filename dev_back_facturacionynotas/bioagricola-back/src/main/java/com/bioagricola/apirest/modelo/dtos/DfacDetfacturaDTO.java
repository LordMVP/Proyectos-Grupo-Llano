package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DfacDetfacturaDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DfacDetfacturaDTO implements Serializable{	

	
	private Long dfacIderegistr;

	private String dfacEstado;
	
	private Long dfacIdeorigen;
	
	private BigDecimal dfacCantidad;
	
	private BigDecimal dfacVlrunitari;
	
	private BigDecimal dfacVlrtotal;
	
	private BigDecimal dfacVlrreal;
	
	private BigDecimal dfacSdoreal;
	
	private Long facIderegistro;
	
	private Integer uniConcepto;
	
	private Long damoIderegistr;
	
	private Long dfacIdepadre;
	
	private Long dfinIderegistr;
	
	private Integer dfacVersion;
	
	private Long scoIderegistro;
	
	private Integer usuIderegistro;
	
	private Long mvmcIderegistr;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DfacDetfacturaDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("dfacIderegistr")
	public Long getDfacIderegistr(){
		return this.dfacIderegistr;
	}
	
	@JsonProperty("dfacIderegistr")
	public void setDfacIderegistr(Long dfacIderegistr){
		this.dfacIderegistr = dfacIderegistr;
	}
	
	@JsonProperty("dfacEstado")
	public String getDfacEstado(){
		return this.dfacEstado;
	}
	
	@JsonProperty("dfacEstado")
	public void setDfacEstado(String dfacEstado){
		this.dfacEstado = dfacEstado;
	}
		
	@JsonProperty("dfacIdeorigen")
	public Long getDfacIdeorigen(){
		return this.dfacIdeorigen;
	}
	
	@JsonProperty("dfacIdeorigen")
	public void setDfacIdeorigen(Long dfacIdeorigen){
		this.dfacIdeorigen = dfacIdeorigen;
	}
		
	@JsonProperty("dfacCantidad")
	public BigDecimal getDfacCantidad(){
		return this.dfacCantidad;
	}
	
	@JsonProperty("dfacCantidad")
	public void setDfacCantidad(BigDecimal dfacCantidad){
		this.dfacCantidad = dfacCantidad;
	}
		
	@JsonProperty("dfacVlrunitari")
	public BigDecimal getDfacVlrunitari(){
		return this.dfacVlrunitari;
	}
	
	@JsonProperty("dfacVlrunitari")
	public void setDfacVlrunitari(BigDecimal dfacVlrunitari){
		this.dfacVlrunitari = dfacVlrunitari;
	}
		
	@JsonProperty("dfacVlrtotal")
	public BigDecimal getDfacVlrtotal(){
		return this.dfacVlrtotal;
	}
	
	@JsonProperty("dfacVlrtotal")
	public void setDfacVlrtotal(BigDecimal dfacVlrtotal){
		this.dfacVlrtotal = dfacVlrtotal;
	}
		
	@JsonProperty("dfacVlrreal")
	public BigDecimal getDfacVlrreal(){
		return this.dfacVlrreal;
	}
	
	@JsonProperty("dfacVlrreal")
	public void setDfacVlrreal(BigDecimal dfacVlrreal){
		this.dfacVlrreal = dfacVlrreal;
	}
		
	@JsonProperty("dfacSdoreal")
	public BigDecimal getDfacSdoreal(){
		return this.dfacSdoreal;
	}
	
	@JsonProperty("dfacSdoreal")
	public void setDfacSdoreal(BigDecimal dfacSdoreal){
		this.dfacSdoreal = dfacSdoreal;
	}
		
	@JsonProperty("facIderegistro")
	public Long getFacIderegistro(){
		return this.facIderegistro;
	}
	
	@JsonProperty("facIderegistro")
	public void setFacIderegistro(Long facIderegistro){
		this.facIderegistro = facIderegistro;
	}
		
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
		this.uniConcepto = uniConcepto;
	}
		
	@JsonProperty("damoIderegistr")
	public Long getDamoIderegistr(){
		return this.damoIderegistr;
	}
	
	@JsonProperty("damoIderegistr")
	public void setDamoIderegistr(Long damoIderegistr){
		this.damoIderegistr = damoIderegistr;
	}
		
	@JsonProperty("dfacIdepadre")
	public Long getDfacIdepadre(){
		return this.dfacIdepadre;
	}
	
	@JsonProperty("dfacIdepadre")
	public void setDfacIdepadre(Long dfacIdepadre){
		this.dfacIdepadre = dfacIdepadre;
	}
		
	@JsonProperty("dfinIderegistr")
	public Long getDfinIderegistr(){
		return this.dfinIderegistr;
	}
	
	@JsonProperty("dfinIderegistr")
	public void setDfinIderegistr(Long dfinIderegistr){
		this.dfinIderegistr = dfinIderegistr;
	}
		
	@JsonProperty("dfacVersion")
	public Integer getDfacVersion(){
		return this.dfacVersion;
	}
	
	@JsonProperty("dfacVersion")
	public void setDfacVersion(Integer dfacVersion){
		this.dfacVersion = dfacVersion;
	}
		
	@JsonProperty("scoIderegistro")
	public Long getScoIderegistro(){
		return this.scoIderegistro;
	}
	
	@JsonProperty("scoIderegistro")
	public void setScoIderegistro(Long scoIderegistro){
		this.scoIderegistro = scoIderegistro;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("mvmcIderegistr")
	public Long getMvmcIderegistr(){
		return this.mvmcIderegistr;
	}
	
	@JsonProperty("mvmcIderegistr")
	public void setMvmcIderegistr(Long mvmcIderegistr){
		this.mvmcIderegistr = mvmcIderegistr;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.dfacIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.dfacEstado);
        hash = 37 * hash + Objects.hashCode(this.dfacIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.dfacCantidad);
        hash = 37 * hash + Objects.hashCode(this.dfacVlrunitari);
        hash = 37 * hash + Objects.hashCode(this.dfacVlrtotal);
        hash = 37 * hash + Objects.hashCode(this.dfacVlrreal);
        hash = 37 * hash + Objects.hashCode(this.dfacSdoreal);
        hash = 37 * hash + Objects.hashCode(this.facIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.damoIderegistr);
        hash = 37 * hash + Objects.hashCode(this.dfacIdepadre);
        hash = 37 * hash + Objects.hashCode(this.dfinIderegistr);
        hash = 37 * hash + Objects.hashCode(this.dfacVersion);
        hash = 37 * hash + Objects.hashCode(this.scoIderegistro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.mvmcIderegistr);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DfacDetfacturaDTO que se pasa
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
        final DfacDetfacturaDTO other = (DfacDetfacturaDTO) obj;
                
        if (!Objects.equals(this.dfacIderegistr, other.dfacIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacEstado, other.dfacEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacIdeorigen, other.dfacIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacCantidad, other.dfacCantidad)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacVlrunitari, other.dfacVlrunitari)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacVlrtotal, other.dfacVlrtotal)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacVlrreal, other.dfacVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacSdoreal, other.dfacSdoreal)) {
            return false;
        }
        
        if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.damoIderegistr, other.damoIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacIdepadre, other.dfacIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.dfinIderegistr, other.dfinIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dfacVersion, other.dfacVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.scoIderegistro, other.scoIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.mvmcIderegistr, other.mvmcIderegistr);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

