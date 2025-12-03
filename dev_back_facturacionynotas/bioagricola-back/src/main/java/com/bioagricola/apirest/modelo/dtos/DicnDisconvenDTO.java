package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DicnDisconvenDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DicnDisconvenDTO implements Serializable{	

	
	private Integer dicnIderegistr;

	private Integer cnreIderegistr;
	
	private Integer empIderegistro;
	
	private Integer uniTipsuscripc;
	
	private BigDecimal dicnValor;
	
	private Integer usuIderegistro;
	
	private Short dicnPagprioridad;
	
	private Short dicnProprioridad;
	
	private String dicnEmpfactura;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DicnDisconvenDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("dicnIderegistr")
	public Integer getDicnIderegistr(){
		return this.dicnIderegistr;
	}
	
	@JsonProperty("dicnIderegistr")
	public void setDicnIderegistr(Integer dicnIderegistr){
		this.dicnIderegistr = dicnIderegistr;
	}
	
	@JsonProperty("cnreIderegistr")
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	@JsonProperty("cnreIderegistr")
	public void setCnreIderegistr(Integer cnreIderegistr){
		this.cnreIderegistr = cnreIderegistr;
	}
		
	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro){
		this.empIderegistro = empIderegistro;
	}
		
	@JsonProperty("uniTipsuscripc")
	public Integer getUniTipsuscripc(){
		return this.uniTipsuscripc;
	}
	
	@JsonProperty("uniTipsuscripc")
	public void setUniTipsuscripc(Integer uniTipsuscripc){
		this.uniTipsuscripc = uniTipsuscripc;
	}
		
	@JsonProperty("dicnValor")
	public BigDecimal getDicnValor(){
		return this.dicnValor;
	}
	
	@JsonProperty("dicnValor")
	public void setDicnValor(BigDecimal dicnValor){
		this.dicnValor = dicnValor;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("dicnPagprioridad")
	public Short getDicnPagprioridad(){
		return this.dicnPagprioridad;
	}
	
	@JsonProperty("dicnPagprioridad")
	public void setDicnPagprioridad(Short dicnPagprioridad){
		this.dicnPagprioridad = dicnPagprioridad;
	}
		
	@JsonProperty("dicnProprioridad")
	public Short getDicnProprioridad(){
		return this.dicnProprioridad;
	}
	
	@JsonProperty("dicnProprioridad")
	public void setDicnProprioridad(Short dicnProprioridad){
		this.dicnProprioridad = dicnProprioridad;
	}
		
	@JsonProperty("dicnEmpfactura")
	public String getDicnEmpfactura(){
		return this.dicnEmpfactura;
	}
	
	@JsonProperty("dicnEmpfactura")
	public void setDicnEmpfactura(String dicnEmpfactura){
		this.dicnEmpfactura = dicnEmpfactura;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.dicnIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.dicnValor);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dicnPagprioridad);
        hash = 37 * hash + Objects.hashCode(this.dicnProprioridad);
        hash = 37 * hash + Objects.hashCode(this.dicnEmpfactura);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DicnDisconvenDTO que se pasa
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
        final DicnDisconvenDTO other = (DicnDisconvenDTO) obj;
                
        if (!Objects.equals(this.dicnIderegistr, other.dicnIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnValor, other.dicnValor)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnPagprioridad, other.dicnPagprioridad)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnProprioridad, other.dicnProprioridad)) {
            return false;
        }
        
        return Objects.equals(this.dicnEmpfactura, other.dicnEmpfactura);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

