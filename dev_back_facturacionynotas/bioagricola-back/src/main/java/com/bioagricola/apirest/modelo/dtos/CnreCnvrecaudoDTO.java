package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CnreCnvrecaudoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class CnreCnvrecaudoDTO implements Serializable{	

	
	private Integer cnreIderegistr;

	private String cnreNombre;
	
	private String cnreEstado;
	
	private Integer cnreNumcontrat;
	
	private String cnreTipdistrib;
	
	private String cnreObliga;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public CnreCnvrecaudoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("cnreIderegistr")
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	@JsonProperty("cnreIderegistr")
	public void setCnreIderegistr(Integer cnreIderegistr){
		this.cnreIderegistr = cnreIderegistr;
	}
	
	@JsonProperty("cnreNombre")
	public String getCnreNombre(){
		return this.cnreNombre;
	}
	
	@JsonProperty("cnreNombre")
	public void setCnreNombre(String cnreNombre){
		this.cnreNombre = cnreNombre;
	}
		
	@JsonProperty("cnreEstado")
	public String getCnreEstado(){
		return this.cnreEstado;
	}
	
	@JsonProperty("cnreEstado")
	public void setCnreEstado(String cnreEstado){
		this.cnreEstado = cnreEstado;
	}
		
	@JsonProperty("cnreNumcontrat")
	public Integer getCnreNumcontrat(){
		return this.cnreNumcontrat;
	}
	
	@JsonProperty("cnreNumcontrat")
	public void setCnreNumcontrat(Integer cnreNumcontrat){
		this.cnreNumcontrat = cnreNumcontrat;
	}
		
	@JsonProperty("cnreTipdistrib")
	public String getCnreTipdistrib(){
		return this.cnreTipdistrib;
	}
	
	@JsonProperty("cnreTipdistrib")
	public void setCnreTipdistrib(String cnreTipdistrib){
		this.cnreTipdistrib = cnreTipdistrib;
	}
		
	@JsonProperty("cnreObliga")
	public String getCnreObliga(){
		return this.cnreObliga;
	}
	
	@JsonProperty("cnreObliga")
	public void setCnreObliga(String cnreObliga){
		this.cnreObliga = cnreObliga;
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
        
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.cnreNombre);
        hash = 37 * hash + Objects.hashCode(this.cnreEstado);
        hash = 37 * hash + Objects.hashCode(this.cnreNumcontrat);
        hash = 37 * hash + Objects.hashCode(this.cnreTipdistrib);
        hash = 37 * hash + Objects.hashCode(this.cnreObliga);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad CnreCnvrecaudoDTO que se pasa
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
        final CnreCnvrecaudoDTO other = (CnreCnvrecaudoDTO) obj;
                
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreNombre, other.cnreNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreEstado, other.cnreEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreNumcontrat, other.cnreNumcontrat)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreTipdistrib, other.cnreTipdistrib)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreObliga, other.cnreObliga)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

