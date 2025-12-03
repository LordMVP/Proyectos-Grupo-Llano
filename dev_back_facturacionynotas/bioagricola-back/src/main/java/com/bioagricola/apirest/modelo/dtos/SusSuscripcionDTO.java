package com.bioagricola.apirest.modelo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.Objects;

/**
 * DAO que contiene la información de la entidad SusSuscripcionDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class SusSuscripcionDTO implements Serializable{	

	
	private Long susIderegistro;

	private Long terIderegistro;

	private Integer cnreIderegistr;

	private String susModconvenio;

	private String susDescripcion;

	private Integer usuIderegistro;

	private String dsusPcodigo;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public SusSuscripcionDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("susIderegistro")
	public Long getSusIderegistro(){
		return this.susIderegistro;
	}
	
	@JsonProperty("susIderegistro")
	public void setSusIderegistro(Long susIderegistro){
		this.susIderegistro = susIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public void setTerIderegistro(Long terIderegistro){
		this.terIderegistro = terIderegistro;
	}
		
	@JsonProperty("cnreIderegistr")
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	@JsonProperty("cnreIderegistr")
	public void setCnreIderegistr(Integer cnreIderegistr){
		this.cnreIderegistr = cnreIderegistr;
	}
		
	@JsonProperty("susModconvenio")
	public String getSusModconvenio(){
		return this.susModconvenio;
	}
	
	@JsonProperty("susModconvenio")
	public void setSusModconvenio(String susModconvenio){
		this.susModconvenio = susModconvenio;
	}
		
	@JsonProperty("susDescripcion")
	public String getSusDescripcion(){
		return this.susDescripcion;
	}
	
	@JsonProperty("susDescripcion")
	public void setSusDescripcion(String susDescripcion){
		this.susDescripcion = susDescripcion;
	}

	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@JsonProperty("dsusPcodigo")
	public String getDsusPcodigo() {
		return this.dsusPcodigo;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.susIderegistro);
		hash = 37 * hash + Objects.hashCode(this.terIderegistro);
		hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
		hash = 37 * hash + Objects.hashCode(this.susModconvenio);
		hash = 37 * hash + Objects.hashCode(this.susDescripcion);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
		hash = 37 * hash + Objects.hashCode(this.dsusPcodigo);


		return hash;
	}

	/**
     * Valida la igualdad de la instancia de la entidad SusSuscripcionDTO que se pasa
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
        final SusSuscripcionDTO other = (SusSuscripcionDTO) obj;
                
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
			return false;
		}

		if (!Objects.equals(this.susModconvenio, other.susModconvenio)) {
			return false;
		}

		if (!Objects.equals(this.susDescripcion, other.susDescripcion)) {
			return false;
		}

		if (!Objects.equals(this.dsusPcodigo, other.dsusPcodigo)) {
			return false;
		}

		return Objects.equals(this.usuIderegistro, other.usuIderegistro);

	}
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

