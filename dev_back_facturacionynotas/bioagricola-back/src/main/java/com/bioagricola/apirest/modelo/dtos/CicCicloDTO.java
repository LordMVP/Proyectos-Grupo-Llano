package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CicCicloDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class CicCicloDTO implements Serializable{	

	
	private Integer cicIderegistro;

	private String cicNombre;
	
	private Short cicDiainicia;
	
	private Short cicDiafinaliza;
	
	private String cicEstado;
	
	private Short cicPeriodos;
	
	private Short cicAnoactual;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public CicCicloDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
	}
	
	@JsonProperty("cicNombre")
	public String getCicNombre(){
		return this.cicNombre;
	}
	
	@JsonProperty("cicNombre")
	public void setCicNombre(String cicNombre){
		this.cicNombre = cicNombre;
	}
		
	@JsonProperty("cicDiainicia")
	public Short getCicDiainicia(){
		return this.cicDiainicia;
	}
	
	@JsonProperty("cicDiainicia")
	public void setCicDiainicia(Short cicDiainicia){
		this.cicDiainicia = cicDiainicia;
	}
		
	@JsonProperty("cicDiafinaliza")
	public Short getCicDiafinaliza(){
		return this.cicDiafinaliza;
	}
	
	@JsonProperty("cicDiafinaliza")
	public void setCicDiafinaliza(Short cicDiafinaliza){
		this.cicDiafinaliza = cicDiafinaliza;
	}
		
	@JsonProperty("cicEstado")
	public String getCicEstado(){
		return this.cicEstado;
	}
	
	@JsonProperty("cicEstado")
	public void setCicEstado(String cicEstado){
		this.cicEstado = cicEstado;
	}
		
	@JsonProperty("cicPeriodos")
	public Short getCicPeriodos(){
		return this.cicPeriodos;
	}
	
	@JsonProperty("cicPeriodos")
	public void setCicPeriodos(Short cicPeriodos){
		this.cicPeriodos = cicPeriodos;
	}
		
	@JsonProperty("cicAnoactual")
	public Short getCicAnoactual(){
		return this.cicAnoactual;
	}
	
	@JsonProperty("cicAnoactual")
	public void setCicAnoactual(Short cicAnoactual){
		this.cicAnoactual = cicAnoactual;
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
        
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.cicNombre);
        hash = 37 * hash + Objects.hashCode(this.cicDiainicia);
        hash = 37 * hash + Objects.hashCode(this.cicDiafinaliza);
        hash = 37 * hash + Objects.hashCode(this.cicEstado);
        hash = 37 * hash + Objects.hashCode(this.cicPeriodos);
        hash = 37 * hash + Objects.hashCode(this.cicAnoactual);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad CicCicloDTO que se pasa
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
        final CicCicloDTO other = (CicCicloDTO) obj;
                
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicNombre, other.cicNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.cicDiainicia, other.cicDiainicia)) {
            return false;
        }
        
        if (!Objects.equals(this.cicDiafinaliza, other.cicDiafinaliza)) {
            return false;
        }
        
        if (!Objects.equals(this.cicEstado, other.cicEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.cicPeriodos, other.cicPeriodos)) {
            return false;
        }
        
        if (!Objects.equals(this.cicAnoactual, other.cicAnoactual)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

