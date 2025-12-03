package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad EmpresasDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class EmpresasDTO implements Serializable{	

	
	private String empresaCod;

	private String empresaNom;
	
	private String empresaSlo;
	
	private String empresaImg;
	
	private String empresaCodsed;
	
	private String empresaCodsuc;
	
	private String empresaIndemp;
	
	private String empresaIdefac;
	
	private Integer empresaSevemp;
	
	private Long terIdegenerico;
	
	private String empresaCodfssri;
	
	private boolean empresaHomaseo;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public EmpresasDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("empresaCod")
	public String getEmpresaCod(){
		return this.empresaCod;
	}
	
	@JsonProperty("empresaCod")
	public void setEmpresaCod(String empresaCod){
		this.empresaCod = empresaCod;
	}
	
	@JsonProperty("empresaNom")
	public String getEmpresaNom(){
		return this.empresaNom;
	}
	
	@JsonProperty("empresaNom")
	public void setEmpresaNom(String empresaNom){
		this.empresaNom = empresaNom;
	}
		
	@JsonProperty("empresaSlo")
	public String getEmpresaSlo(){
		return this.empresaSlo;
	}
	
	@JsonProperty("empresaSlo")
	public void setEmpresaSlo(String empresaSlo){
		this.empresaSlo = empresaSlo;
	}
		
	@JsonProperty("empresaImg")
	public String getEmpresaImg(){
		return this.empresaImg;
	}
	
	@JsonProperty("empresaImg")
	public void setEmpresaImg(String empresaImg){
		this.empresaImg = empresaImg;
	}
		
	@JsonProperty("empresaCodsed")
	public String getEmpresaCodsed(){
		return this.empresaCodsed;
	}
	
	@JsonProperty("empresaCodsed")
	public void setEmpresaCodsed(String empresaCodsed){
		this.empresaCodsed = empresaCodsed;
	}
		
	@JsonProperty("empresaCodsuc")
	public String getEmpresaCodsuc(){
		return this.empresaCodsuc;
	}
	
	@JsonProperty("empresaCodsuc")
	public void setEmpresaCodsuc(String empresaCodsuc){
		this.empresaCodsuc = empresaCodsuc;
	}
		
	@JsonProperty("empresaIndemp")
	public String getEmpresaIndemp(){
		return this.empresaIndemp;
	}
	
	@JsonProperty("empresaIndemp")
	public void setEmpresaIndemp(String empresaIndemp){
		this.empresaIndemp = empresaIndemp;
	}
		
	@JsonProperty("empresaIdefac")
	public String getEmpresaIdefac(){
		return this.empresaIdefac;
	}
	
	@JsonProperty("empresaIdefac")
	public void setEmpresaIdefac(String empresaIdefac){
		this.empresaIdefac = empresaIdefac;
	}
		
	@JsonProperty("empresaSevemp")
	public Integer getEmpresaSevemp(){
		return this.empresaSevemp;
	}
	
	@JsonProperty("empresaSevemp")
	public void setEmpresaSevemp(Integer empresaSevemp){
		this.empresaSevemp = empresaSevemp;
	}
		
	@JsonProperty("terIdegenerico")
	public Long getTerIdegenerico(){
		return this.terIdegenerico;
	}
	
	@JsonProperty("terIdegenerico")
	public void setTerIdegenerico(Long terIdegenerico){
		this.terIdegenerico = terIdegenerico;
	}
		
	@JsonProperty("empresaCodfssri")
	public String getEmpresaCodfssri(){
		return this.empresaCodfssri;
	}
	
	@JsonProperty("empresaCodfssri")
	public void setEmpresaCodfssri(String empresaCodfssri){
		this.empresaCodfssri = empresaCodfssri;
	}
		
	@JsonProperty("empresaHomaseo")
	public boolean getEmpresaHomaseo(){
		return this.empresaHomaseo;
	}
	
	@JsonProperty("empresaHomaseo")
	public void setEmpresaHomaseo(boolean empresaHomaseo){
		this.empresaHomaseo = empresaHomaseo;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.empresaCod);        
        hash = 37 * hash + Objects.hashCode(this.empresaNom);
        hash = 37 * hash + Objects.hashCode(this.empresaSlo);
        hash = 37 * hash + Objects.hashCode(this.empresaImg);
        hash = 37 * hash + Objects.hashCode(this.empresaCodsed);
        hash = 37 * hash + Objects.hashCode(this.empresaCodsuc);
        hash = 37 * hash + Objects.hashCode(this.empresaIndemp);
        hash = 37 * hash + Objects.hashCode(this.empresaIdefac);
        hash = 37 * hash + Objects.hashCode(this.empresaSevemp);
        hash = 37 * hash + Objects.hashCode(this.terIdegenerico);
        hash = 37 * hash + Objects.hashCode(this.empresaCodfssri);
        hash = 37 * hash + (this.empresaHomaseo ? 0 : 1);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad EmpresasDTO que se pasa
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
        final EmpresasDTO other = (EmpresasDTO) obj;
                
        if (!Objects.equals(this.empresaCod, other.empresaCod)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaNom, other.empresaNom)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaSlo, other.empresaSlo)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaImg, other.empresaImg)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaCodsed, other.empresaCodsed)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaCodsuc, other.empresaCodsuc)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaIndemp, other.empresaIndemp)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaIdefac, other.empresaIdefac)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaSevemp, other.empresaSevemp)) {
            return false;
        }
        
        if (!Objects.equals(this.terIdegenerico, other.terIdegenerico)) {
            return false;
        }
        
        if (!Objects.equals(this.empresaCodfssri, other.empresaCodfssri)) {
            return false;
        }
        
        return Objects.equals(this.empresaHomaseo, other.empresaHomaseo);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

