package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad TerTerceroDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class TerTerceroDTO implements Serializable{	

	
	private Long terIderegistro;

	private String terDocumento;
	
	private String terNombre;
	
	private String terApellido;
	
	private String terNomcompleto;
	
	private String terSexo;
	
	private String terTelcelular;
	
	private String terTelfijo;
	
	private Integer estTiptercero;
	
	private Integer uniTiptercero;
	
	private String terCorreo;
	
	private Integer usuIderegistro;
	
	private String ciudadCod;
	
	private Byte[] terDocexpedicion;
	
	private Integer uniTipidentifica;
	
	private Date terFecnacimiento;
	
	private Short terDigverificacion;
	
	private String terInfoadicional;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public TerTerceroDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("terIderegistro")
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public void setTerIderegistro(Long terIderegistro){
		this.terIderegistro = terIderegistro;
	}
	
	@JsonProperty("terDocumento")
	public String getTerDocumento(){
		return this.terDocumento;
	}
	
	@JsonProperty("terDocumento")
	public void setTerDocumento(String terDocumento){
		this.terDocumento = terDocumento;
	}
		
	@JsonProperty("terNombre")
	public String getTerNombre(){
		return this.terNombre;
	}
	
	@JsonProperty("terNombre")
	public void setTerNombre(String terNombre){
		this.terNombre = terNombre;
	}
		
	@JsonProperty("terApellido")
	public String getTerApellido(){
		return this.terApellido;
	}
	
	@JsonProperty("terApellido")
	public void setTerApellido(String terApellido){
		this.terApellido = terApellido;
	}
		
	@JsonProperty("terNomcompleto")
	public String getTerNomcompleto(){
		return this.terNomcompleto;
	}
	
	@JsonProperty("terNomcompleto")
	public void setTerNomcompleto(String terNomcompleto){
		this.terNomcompleto = terNomcompleto;
	}
		
	@JsonProperty("terSexo")
	public String getTerSexo(){
		return this.terSexo;
	}
	
	@JsonProperty("terSexo")
	public void setTerSexo(String terSexo){
		this.terSexo = terSexo;
	}
		
	@JsonProperty("terTelcelular")
	public String getTerTelcelular(){
		return this.terTelcelular;
	}
	
	@JsonProperty("terTelcelular")
	public void setTerTelcelular(String terTelcelular){
		this.terTelcelular = terTelcelular;
	}
		
	@JsonProperty("terTelfijo")
	public String getTerTelfijo(){
		return this.terTelfijo;
	}
	
	@JsonProperty("terTelfijo")
	public void setTerTelfijo(String terTelfijo){
		this.terTelfijo = terTelfijo;
	}
		
	@JsonProperty("estTiptercero")
	public Integer getEstTiptercero(){
		return this.estTiptercero;
	}
	
	@JsonProperty("estTiptercero")
	public void setEstTiptercero(Integer estTiptercero){
		this.estTiptercero = estTiptercero;
	}
		
	@JsonProperty("uniTiptercero")
	public Integer getUniTiptercero(){
		return this.uniTiptercero;
	}
	
	@JsonProperty("uniTiptercero")
	public void setUniTiptercero(Integer uniTiptercero){
		this.uniTiptercero = uniTiptercero;
	}
		
	@JsonProperty("terCorreo")
	public String getTerCorreo(){
		return this.terCorreo;
	}
	
	@JsonProperty("terCorreo")
	public void setTerCorreo(String terCorreo){
		this.terCorreo = terCorreo;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("ciudadCod")
	public String getCiudadCod(){
		return this.ciudadCod;
	}
	
	@JsonProperty("ciudadCod")
	public void setCiudadCod(String ciudadCod){
		this.ciudadCod = ciudadCod;
	}
		
	@JsonProperty("terDocexpedicion")
	public Byte[] getTerDocexpedicion(){
		return this.terDocexpedicion;
	}
	
	@JsonProperty("terDocexpedicion")
	public void setTerDocexpedicion(Byte[] terDocexpedicion){
		this.terDocexpedicion = terDocexpedicion;
	}
		
	@JsonProperty("uniTipidentifica")
	public Integer getUniTipidentifica(){
		return this.uniTipidentifica;
	}
	
	@JsonProperty("uniTipidentifica")
	public void setUniTipidentifica(Integer uniTipidentifica){
		this.uniTipidentifica = uniTipidentifica;
	}
		
	@JsonProperty("terFecnacimiento")
	public Date getTerFecnacimiento(){
		return this.terFecnacimiento;
	}
	
	@JsonProperty("terFecnacimiento")
	public void setTerFecnacimiento(Date terFecnacimiento){
		this.terFecnacimiento = terFecnacimiento;
	}
		
	@JsonProperty("terDigverificacion")
	public Short getTerDigverificacion(){
		return this.terDigverificacion;
	}
	
	@JsonProperty("terDigverificacion")
	public void setTerDigverificacion(Short terDigverificacion){
		this.terDigverificacion = terDigverificacion;
	}
		
	@JsonProperty("terInfoadicional")
	public String getTerInfoadicional(){
		return this.terInfoadicional;
	}
	
	@JsonProperty("terInfoadicional")
	public void setTerInfoadicional(String terInfoadicional){
		this.terInfoadicional = terInfoadicional;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.terDocumento);
        hash = 37 * hash + Objects.hashCode(this.terNombre);
        hash = 37 * hash + Objects.hashCode(this.terApellido);
        hash = 37 * hash + Objects.hashCode(this.terNomcompleto);
        hash = 37 * hash + Objects.hashCode(this.terSexo);
        hash = 37 * hash + Objects.hashCode(this.terTelcelular);
        hash = 37 * hash + Objects.hashCode(this.terTelfijo);
        hash = 37 * hash + Objects.hashCode(this.estTiptercero);
        hash = 37 * hash + Objects.hashCode(this.uniTiptercero);
        hash = 37 * hash + Objects.hashCode(this.terCorreo);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.ciudadCod);
        hash = 37 * hash + Objects.hashCode(this.terDocexpedicion);
        hash = 37 * hash + Objects.hashCode(this.uniTipidentifica);
        hash = 37 * hash + Objects.hashCode(this.terFecnacimiento);
        hash = 37 * hash + Objects.hashCode(this.terDigverificacion);
        hash = 37 * hash + Objects.hashCode(this.terInfoadicional);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad TerTerceroDTO que se pasa
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
        final TerTerceroDTO other = (TerTerceroDTO) obj;
                
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terDocumento, other.terDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.terNombre, other.terNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.terApellido, other.terApellido)) {
            return false;
        }
        
        if (!Objects.equals(this.terNomcompleto, other.terNomcompleto)) {
            return false;
        }
        
        if (!Objects.equals(this.terSexo, other.terSexo)) {
            return false;
        }
        
        if (!Objects.equals(this.terTelcelular, other.terTelcelular)) {
            return false;
        }
        
        if (!Objects.equals(this.terTelfijo, other.terTelfijo)) {
            return false;
        }
        
        if (!Objects.equals(this.estTiptercero, other.estTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTiptercero, other.uniTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.terCorreo, other.terCorreo)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.ciudadCod, other.ciudadCod)) {
            return false;
        }
        
        if (!Objects.equals(this.terDocexpedicion, other.terDocexpedicion)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipidentifica, other.uniTipidentifica)) {
            return false;
        }
        
        if (!Objects.equals(this.terFecnacimiento, other.terFecnacimiento)) {
            return false;
        }
        
        if (!Objects.equals(this.terDigverificacion, other.terDigverificacion)) {
            return false;
        }
        
        return Objects.equals(this.terInfoadicional, other.terInfoadicional);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

