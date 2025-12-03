package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad LiqLiquidacionDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class LiqLiquidacionDTO implements Serializable{	

	
	private Integer uniLiquidacion;

	private Integer estLiquidacion;
	
	private String liqNombre;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Byte[] liqInivigencia;
	
	private Date liqFinvigencia;
	
	private String liqVenclasific;
	
	private String liqEstado;
	
	private String liqHistorico;
	
	private Integer liqDiavencim;
	
	private Integer liqDiasuspens;
	
	private Integer usuIderegistro;
	
	private String liqTipcuota;
	
	private String liqCtrventas;
	
	private Long hliqIderegistr;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiqLiquidacionDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
	
	@JsonProperty("estLiquidacion")
	public Integer getEstLiquidacion(){
		return this.estLiquidacion;
	}
	
	@JsonProperty("estLiquidacion")
	public void setEstLiquidacion(Integer estLiquidacion){
		this.estLiquidacion = estLiquidacion;
	}
		
	@JsonProperty("liqNombre")
	public String getLiqNombre(){
		return this.liqNombre;
	}
	
	@JsonProperty("liqNombre")
	public void setLiqNombre(String liqNombre){
		this.liqNombre = liqNombre;
	}
		
	@JsonProperty("uniDocumento")
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	@JsonProperty("uniDocumento")
	public void setUniDocumento(Integer uniDocumento){
		this.uniDocumento = uniDocumento;
	}
		
	@JsonProperty("uniTipdocument")
	public Integer getUniTipdocument(){
		return this.uniTipdocument;
	}
	
	@JsonProperty("uniTipdocument")
	public void setUniTipdocument(Integer uniTipdocument){
		this.uniTipdocument = uniTipdocument;
	}
		
	@JsonProperty("liqInivigencia")
	public Byte[] getLiqInivigencia(){
		return this.liqInivigencia;
	}
	
	@JsonProperty("liqInivigencia")
	public void setLiqInivigencia(Byte[] liqInivigencia){
		this.liqInivigencia = liqInivigencia;
	}
		
	@JsonProperty("liqFinvigencia")
	public Date getLiqFinvigencia(){
		return this.liqFinvigencia;
	}
	
	@JsonProperty("liqFinvigencia")
	public void setLiqFinvigencia(Date liqFinvigencia){
		this.liqFinvigencia = liqFinvigencia;
	}
		
	@JsonProperty("liqVenclasific")
	public String getLiqVenclasific(){
		return this.liqVenclasific;
	}
	
	@JsonProperty("liqVenclasific")
	public void setLiqVenclasific(String liqVenclasific){
		this.liqVenclasific = liqVenclasific;
	}
		
	@JsonProperty("liqEstado")
	public String getLiqEstado(){
		return this.liqEstado;
	}
	
	@JsonProperty("liqEstado")
	public void setLiqEstado(String liqEstado){
		this.liqEstado = liqEstado;
	}
		
	@JsonProperty("liqHistorico")
	public String getLiqHistorico(){
		return this.liqHistorico;
	}
	
	@JsonProperty("liqHistorico")
	public void setLiqHistorico(String liqHistorico){
		this.liqHistorico = liqHistorico;
	}
		
	@JsonProperty("liqDiavencim")
	public Integer getLiqDiavencim(){
		return this.liqDiavencim;
	}
	
	@JsonProperty("liqDiavencim")
	public void setLiqDiavencim(Integer liqDiavencim){
		this.liqDiavencim = liqDiavencim;
	}
		
	@JsonProperty("liqDiasuspens")
	public Integer getLiqDiasuspens(){
		return this.liqDiasuspens;
	}
	
	@JsonProperty("liqDiasuspens")
	public void setLiqDiasuspens(Integer liqDiasuspens){
		this.liqDiasuspens = liqDiasuspens;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("liqTipcuota")
	public String getLiqTipcuota(){
		return this.liqTipcuota;
	}
	
	@JsonProperty("liqTipcuota")
	public void setLiqTipcuota(String liqTipcuota){
		this.liqTipcuota = liqTipcuota;
	}
		
	@JsonProperty("liqCtrventas")
	public String getLiqCtrventas(){
		return this.liqCtrventas;
	}
	
	@JsonProperty("liqCtrventas")
	public void setLiqCtrventas(String liqCtrventas){
		this.liqCtrventas = liqCtrventas;
	}
		
	@JsonProperty("hliqIderegistr")
	public Long getHliqIderegistr(){
		return this.hliqIderegistr;
	}
	
	@JsonProperty("hliqIderegistr")
	public void setHliqIderegistr(Long hliqIderegistr){
		this.hliqIderegistr = hliqIderegistr;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);        
        hash = 37 * hash + Objects.hashCode(this.estLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.liqNombre);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.liqInivigencia);
        hash = 37 * hash + Objects.hashCode(this.liqFinvigencia);
        hash = 37 * hash + Objects.hashCode(this.liqVenclasific);
        hash = 37 * hash + Objects.hashCode(this.liqEstado);
        hash = 37 * hash + Objects.hashCode(this.liqHistorico);
        hash = 37 * hash + Objects.hashCode(this.liqDiavencim);
        hash = 37 * hash + Objects.hashCode(this.liqDiasuspens);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.liqTipcuota);
        hash = 37 * hash + Objects.hashCode(this.liqCtrventas);
        hash = 37 * hash + Objects.hashCode(this.hliqIderegistr);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiqLiquidacionDTO que se pasa
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
        final LiqLiquidacionDTO other = (LiqLiquidacionDTO) obj;
                
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.estLiquidacion, other.estLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.liqNombre, other.liqNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.liqInivigencia, other.liqInivigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.liqFinvigencia, other.liqFinvigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.liqVenclasific, other.liqVenclasific)) {
            return false;
        }
        
        if (!Objects.equals(this.liqEstado, other.liqEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.liqHistorico, other.liqHistorico)) {
            return false;
        }
        
        if (!Objects.equals(this.liqDiavencim, other.liqDiavencim)) {
            return false;
        }
        
        if (!Objects.equals(this.liqDiasuspens, other.liqDiasuspens)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.liqTipcuota, other.liqTipcuota)) {
            return false;
        }
        
        if (!Objects.equals(this.liqCtrventas, other.liqCtrventas)) {
            return false;
        }
        
        return Objects.equals(this.hliqIderegistr, other.hliqIderegistr);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

