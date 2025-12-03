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
public class RequestConstructLiquidacion implements Serializable{	

	
	
	
	private Integer idacceso;
	
	private  Integer idciclo;
	
	private Integer idempresa;
	
	private Integer idproceso;
	
	private char preliquidar;
	

	

	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RequestConstructLiquidacion(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	
		
	@JsonProperty("idacceso")
	public Integer getIdacceso(){
		return this.idacceso;
	}
	
	@JsonProperty("idacceso")
	public void setDsusIderegistr(Integer idacceso){
		this.idacceso = idacceso;
	}
		
			
	@JsonProperty("idciclo")
	public Integer getidciclo(){
		return this.idciclo;
	}
	
	@JsonProperty("idciclo")
	public void setidciclo(Integer idciclo){
		this.idciclo = idciclo;
	}
		
	@JsonProperty("idempresa")
	public Integer getidempresa(){
		return this.idempresa;
	}
	
	@JsonProperty("idempresa")
	public void setidempresa(Integer idempresa){
		this.idempresa = idempresa;
	}
		
	@JsonProperty("idproceso")
	public Integer getidproceso(){
		return this.idproceso;
	}
	
	@JsonProperty("idproceso")
	public void setidproceso(Integer idproceso){
		this.idproceso = idproceso;
	}
		
	@JsonProperty("preliquidar")
	public char getpreliquidar(){
		return this.preliquidar;
	}
	
	@JsonProperty("preliquidar")
	public void setpreliquidar(char preliquidar){
		this.preliquidar = preliquidar;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
       
        hash = 37 * hash + Objects.hashCode(this.idacceso);
  
        hash = 37 * hash + Objects.hashCode(this.idciclo);
        hash = 37 * hash + Objects.hashCode(this.idempresa);
        hash = 37 * hash + Objects.hashCode(this.idproceso);
        hash = 37 * hash + Objects.hashCode(this.preliquidar);
   
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
        final RequestConstructLiquidacion other = (RequestConstructLiquidacion) obj;
                
        
        if (!Objects.equals(this.idacceso, other.idacceso)) {
            return false;
        }
        
        
        if (!Objects.equals(this.idciclo, other.idciclo)) {
            return false;
        }
        
        if (!Objects.equals(this.idempresa, other.idempresa)) {
            return false;
        }
        
        if (!Objects.equals(this.idproceso, other.idproceso)) {
            return false;
        }
        
           
        return (Objects.equals(this.preliquidar, other.preliquidar));
                
    }






	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

