package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * DAO que contiene la información de la entidad FacFacturaDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class RequestConsultarFacturasGeneradas implements Serializable{	

	
	private Integer cicIderegistro;
	private Integer	empIderegistro;

	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RequestConsultarFacturasGeneradas(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


    @JsonProperty("empIderegistro")
	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

		
			
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
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
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);

        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad FacFacturaDTO que se pasa
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
        final RequestConsultarFacturasGeneradas other = (RequestConsultarFacturasGeneradas) obj;
                
  
        
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        return (Objects.equals(this.empIderegistro, other.empIderegistro));
        
       
                
    }











	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

