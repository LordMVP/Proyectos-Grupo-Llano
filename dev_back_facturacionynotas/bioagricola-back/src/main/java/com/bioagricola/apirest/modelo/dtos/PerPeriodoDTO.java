package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad PerPeriodoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class PerPeriodoDTO implements Serializable{	

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer perIderegistro;

	private Short perIdeorden;
	
	private Integer cicIderegistro;
	
	private String perNombre;
	
	private String perEstado;
	
	private String perBlofecha;
	
	private Date perFecinicial;
	
	private Date perFecfinal;
	
	private Date perFecvence;
	
	private Date perFecsuspens;
	
	private Integer usuIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public PerPeriodoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("perIderegistro")
	public Integer getPerIderegistro(){
		return this.perIderegistro;
	}
	
	@JsonProperty("perIderegistro")
	public void setPerIderegistro(Integer perIderegistro){
		this.perIderegistro = perIderegistro;
	}
	
	@JsonProperty("perIdeorden")
	public Short getPerIdeorden(){
		return this.perIdeorden;
	}
	
	@JsonProperty("perIdeorden")
	public void setPerIdeorden(Short perIdeorden){
		this.perIdeorden = perIdeorden;
	}
		
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
	}
		
	@JsonProperty("perNombre")
	public String getPerNombre(){
		return this.perNombre;
	}
	
	@JsonProperty("perNombre")
	public void setPerNombre(String perNombre){
		this.perNombre = perNombre;
	}
		
	@JsonProperty("perEstado")
	public String getPerEstado(){
		return this.perEstado;
	}
	
	@JsonProperty("perEstado")
	public void setPerEstado(String perEstado){
		this.perEstado = perEstado;
	}
		
	@JsonProperty("perBlofecha")
	public String getPerBlofecha(){
		return this.perBlofecha;
	}
	
	@JsonProperty("perBlofecha")
	public void setPerBlofecha(String perBlofecha){
		this.perBlofecha = perBlofecha;
	}
		
	@JsonProperty("perFecinicial")
	public Date getPerFecinicial(){
		return this.perFecinicial;
	}
	
	@JsonProperty("perFecinicial")
	public void setPerFecinicial(Date perFecinicial){
		this.perFecinicial = perFecinicial;
	}
		
	@JsonProperty("perFecfinal")
	public Date getPerFecfinal(){
		return this.perFecfinal;
	}
	
	@JsonProperty("perFecfinal")
	public void setPerFecfinal(Date perFecfinal){
		this.perFecfinal = perFecfinal;
	}
		
	@JsonProperty("perFecvence")
	public Date getPerFecvence(){
		return this.perFecvence;
	}
	
	@JsonProperty("perFecvence")
	public void setPerFecvence(Date perFecvence){
		this.perFecvence = perFecvence;
	}
		
	@JsonProperty("perFecsuspens")
	public Date getPerFecsuspens(){
		return this.perFecsuspens;
	}
	
	@JsonProperty("perFecsuspens")
	public void setPerFecsuspens(Date perFecsuspens){
		this.perFecsuspens = perFecsuspens;
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
        
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.perIdeorden);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perNombre);
        hash = 37 * hash + Objects.hashCode(this.perEstado);
        hash = 37 * hash + Objects.hashCode(this.perBlofecha);
        hash = 37 * hash + Objects.hashCode(this.perFecinicial);
        hash = 37 * hash + Objects.hashCode(this.perFecfinal);
        hash = 37 * hash + Objects.hashCode(this.perFecvence);
        hash = 37 * hash + Objects.hashCode(this.perFecsuspens);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad PerPeriodoDTO que se pasa
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
        final PerPeriodoDTO other = (PerPeriodoDTO) obj;
                
        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.perIdeorden, other.perIdeorden)) {
            return false;
        }
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.perNombre, other.perNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.perEstado, other.perEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.perBlofecha, other.perBlofecha)) {
            return false;
        }
        
        if (!Objects.equals(this.perFecinicial, other.perFecinicial)) {
            return false;
        }
        
        if (!Objects.equals(this.perFecfinal, other.perFecfinal)) {
            return false;
        }
        
        if (!Objects.equals(this.perFecvence, other.perFecvence)) {
            return false;
        }
        
        if (!Objects.equals(this.perFecsuspens, other.perFecsuspens)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

