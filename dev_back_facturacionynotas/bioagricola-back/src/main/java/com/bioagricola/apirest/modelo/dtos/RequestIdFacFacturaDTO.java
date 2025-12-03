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
public class RequestIdFacFacturaDTO implements Serializable{	

	
	
	
	private Long dsusIderegistr;
	
	private Integer cicIderegistro;
	
	private Integer perIderegistro;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Short cicAno;
	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RequestIdFacFacturaDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	
		
	@JsonProperty("dsusIderegistr")
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	@JsonProperty("dsusIderegistr")
	public void setDsusIderegistr(Long dsusIderegistr){
		this.dsusIderegistr = dsusIderegistr;
	}
		
			
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
	}
		
	@JsonProperty("perIderegistro")
	public Integer getPerIderegistro(){
		return this.perIderegistro;
	}
	
	@JsonProperty("perIderegistro")
	public void setPerIderegistro(Integer perIderegistro){
		this.perIderegistro = perIderegistro;
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
		
		
	@JsonProperty("cicAno")
	public Short getCicAno(){
		return this.cicAno;
	}
	
	@JsonProperty("cicAno")
	public void setCicAno(Short cicAno){
		this.cicAno = cicAno;
	}
	
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
       
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
  
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        
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
        final RequestIdFacFacturaDTO other = (RequestIdFacFacturaDTO) obj;
                
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        return (Objects.equals(this.cicAno, other.cicAno));
                
    }






	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

