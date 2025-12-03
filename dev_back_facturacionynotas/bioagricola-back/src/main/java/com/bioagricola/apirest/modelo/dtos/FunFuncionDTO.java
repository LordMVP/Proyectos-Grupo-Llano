package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad FunFuncionDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class FunFuncionDTO implements Serializable{	

	
	private String funNombre;

	private String funDescripcion;
	
	private String funUbicacion;
	
	private String funTipo;
	
	private Integer funIderegistro;
	
	private Short funParametro;
	
	private Integer usuIderegistro;
	
	private String funSql;
	
	private String funClase;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public FunFuncionDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("funNombre")
	public String getFunNombre(){
		return this.funNombre;
	}
	
	@JsonProperty("funNombre")
	public void setFunNombre(String funNombre){
		this.funNombre = funNombre;
	}
	
	@JsonProperty("funDescripcion")
	public String getFunDescripcion(){
		return this.funDescripcion;
	}
	
	@JsonProperty("funDescripcion")
	public void setFunDescripcion(String funDescripcion){
		this.funDescripcion = funDescripcion;
	}
		
	@JsonProperty("funUbicacion")
	public String getFunUbicacion(){
		return this.funUbicacion;
	}
	
	@JsonProperty("funUbicacion")
	public void setFunUbicacion(String funUbicacion){
		this.funUbicacion = funUbicacion;
	}
		
	@JsonProperty("funTipo")
	public String getFunTipo(){
		return this.funTipo;
	}
	
	@JsonProperty("funTipo")
	public void setFunTipo(String funTipo){
		this.funTipo = funTipo;
	}
		
	@JsonProperty("funIderegistro")
	public Integer getFunIderegistro(){
		return this.funIderegistro;
	}
	
	@JsonProperty("funIderegistro")
	public void setFunIderegistro(Integer funIderegistro){
		this.funIderegistro = funIderegistro;
	}
		
	@JsonProperty("funParametro")
	public Short getFunParametro(){
		return this.funParametro;
	}
	
	@JsonProperty("funParametro")
	public void setFunParametro(Short funParametro){
		this.funParametro = funParametro;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
	
	@JsonProperty("funSql")
	public String getFunSql(){
		return this.funSql;
	}
	
	@JsonProperty("funSql")
	public void setFunSql(String funSql){
		this.funSql = funSql;
	}
		
	@JsonProperty("funClase")
	public String getFunClase(){
		return this.funClase;
	}
	
	@JsonProperty("funClase")
	public void setFunClase(String funClase){
		this.funClase = funClase;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.funNombre);        
        hash = 37 * hash + Objects.hashCode(this.funDescripcion);
        hash = 37 * hash + Objects.hashCode(this.funUbicacion);
        hash = 37 * hash + Objects.hashCode(this.funTipo);
        hash = 37 * hash + Objects.hashCode(this.funIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funParametro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funSql);
        hash = 37 * hash + Objects.hashCode(this.funClase);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad FunFuncionDTO que se pasa
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
        final FunFuncionDTO other = (FunFuncionDTO) obj;
                
        if (!Objects.equals(this.funNombre, other.funNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.funDescripcion, other.funDescripcion)) {
            return false;
        }
        
        if (!Objects.equals(this.funUbicacion, other.funUbicacion)) {
            return false;
        }
        
        if (!Objects.equals(this.funTipo, other.funTipo)) {
            return false;
        }
        
        if (!Objects.equals(this.funIderegistro, other.funIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.funParametro, other.funParametro)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.funSql, other.funSql)) {
            return false;
        }
        
        return Objects.equals(this.funClase, other.funClase);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

