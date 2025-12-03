package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad UniUnidadDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class UniUnidadDTO implements Serializable{	

	
	private Integer uniIderegistro;

	private Integer estIderegistro;
	
	private String uniCodigo1;
	
	private String uniCodigo2;
	
	private String uniCodigo3;
	
	private String uniCodigo4;
	
	private String uniCodigo5;
	
	private String uniNombre1;
	
	private String uniNombre2;
	
	private String uniNombre3;
	
	private String uniNombre4;
	
	private String uniNombre5;
	
	private BigDecimal uniOrden;
	
	private Short uniNivel;
	
	private String uniCodigo;
	
	private Integer uniIdepadre;
	
	private Integer usuIderegistro;
	
	private String uniPropiedad;
	
	private Byte[] uniFecha;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public UniUnidadDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniIderegistro")
	public Integer getUniIderegistro(){
		return this.uniIderegistro;
	}
	
	@JsonProperty("uniIderegistro")
	public void setUniIderegistro(Integer uniIderegistro){
		this.uniIderegistro = uniIderegistro;
	}
	
	@JsonProperty("estIderegistro")
	public Integer getEstIderegistro(){
		return this.estIderegistro;
	}
	
	@JsonProperty("estIderegistro")
	public void setEstIderegistro(Integer estIderegistro){
		this.estIderegistro = estIderegistro;
	}
		
	@JsonProperty("uniCodigo1")
	public String getUniCodigo1(){
		return this.uniCodigo1;
	}
	
	@JsonProperty("uniCodigo1")
	public void setUniCodigo1(String uniCodigo1){
		this.uniCodigo1 = uniCodigo1;
	}
		
	@JsonProperty("uniCodigo2")
	public String getUniCodigo2(){
		return this.uniCodigo2;
	}
	
	@JsonProperty("uniCodigo2")
	public void setUniCodigo2(String uniCodigo2){
		this.uniCodigo2 = uniCodigo2;
	}
		
	@JsonProperty("uniCodigo3")
	public String getUniCodigo3(){
		return this.uniCodigo3;
	}
	
	@JsonProperty("uniCodigo3")
	public void setUniCodigo3(String uniCodigo3){
		this.uniCodigo3 = uniCodigo3;
	}
		
	@JsonProperty("uniCodigo4")
	public String getUniCodigo4(){
		return this.uniCodigo4;
	}
	
	@JsonProperty("uniCodigo4")
	public void setUniCodigo4(String uniCodigo4){
		this.uniCodigo4 = uniCodigo4;
	}
		
	@JsonProperty("uniCodigo5")
	public String getUniCodigo5(){
		return this.uniCodigo5;
	}
	
	@JsonProperty("uniCodigo5")
	public void setUniCodigo5(String uniCodigo5){
		this.uniCodigo5 = uniCodigo5;
	}
		
	@JsonProperty("uniNombre1")
	public String getUniNombre1(){
		return this.uniNombre1;
	}
	
	@JsonProperty("uniNombre1")
	public void setUniNombre1(String uniNombre1){
		this.uniNombre1 = uniNombre1;
	}
		
	@JsonProperty("uniNombre2")
	public String getUniNombre2(){
		return this.uniNombre2;
	}
	
	@JsonProperty("uniNombre2")
	public void setUniNombre2(String uniNombre2){
		this.uniNombre2 = uniNombre2;
	}
		
	@JsonProperty("uniNombre3")
	public String getUniNombre3(){
		return this.uniNombre3;
	}
	
	@JsonProperty("uniNombre3")
	public void setUniNombre3(String uniNombre3){
		this.uniNombre3 = uniNombre3;
	}
		
	@JsonProperty("uniNombre4")
	public String getUniNombre4(){
		return this.uniNombre4;
	}
	
	@JsonProperty("uniNombre4")
	public void setUniNombre4(String uniNombre4){
		this.uniNombre4 = uniNombre4;
	}
		
	@JsonProperty("uniNombre5")
	public String getUniNombre5(){
		return this.uniNombre5;
	}
	
	@JsonProperty("uniNombre5")
	public void setUniNombre5(String uniNombre5){
		this.uniNombre5 = uniNombre5;
	}
		
	@JsonProperty("uniOrden")
	public BigDecimal getUniOrden(){
		return this.uniOrden;
	}
	
	@JsonProperty("uniOrden")
	public void setUniOrden(BigDecimal uniOrden){
		this.uniOrden = uniOrden;
	}
		
	@JsonProperty("uniNivel")
	public Short getUniNivel(){
		return this.uniNivel;
	}
	
	@JsonProperty("uniNivel")
	public void setUniNivel(Short uniNivel){
		this.uniNivel = uniNivel;
	}
		
	@JsonProperty("uniCodigo")
	public String getUniCodigo(){
		return this.uniCodigo;
	}
	
	@JsonProperty("uniCodigo")
	public void setUniCodigo(String uniCodigo){
		this.uniCodigo = uniCodigo;
	}
		
	@JsonProperty("uniIdepadre")
	public Integer getUniIdepadre(){
		return this.uniIdepadre;
	}
	
	@JsonProperty("uniIdepadre")
	public void setUniIdepadre(Integer uniIdepadre){
		this.uniIdepadre = uniIdepadre;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("uniPropiedad")
	public String getUniPropiedad(){
		return this.uniPropiedad;
	}
	
	@JsonProperty("uniPropiedad")
	public void setUniPropiedad(String uniPropiedad){
		this.uniPropiedad = uniPropiedad;
	}
		
	@JsonProperty("uniFecha")
	public Byte[] getUniFecha(){
		return this.uniFecha;
	}
	
	@JsonProperty("uniFecha")
	public void setUniFecha(Byte[] uniFecha){
		this.uniFecha = uniFecha;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.estIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo1);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo2);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo3);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo4);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo5);
        hash = 37 * hash + Objects.hashCode(this.uniNombre1);
        hash = 37 * hash + Objects.hashCode(this.uniNombre2);
        hash = 37 * hash + Objects.hashCode(this.uniNombre3);
        hash = 37 * hash + Objects.hashCode(this.uniNombre4);
        hash = 37 * hash + Objects.hashCode(this.uniNombre5);
        hash = 37 * hash + Objects.hashCode(this.uniOrden);
        hash = 37 * hash + Objects.hashCode(this.uniNivel);
        hash = 37 * hash + Objects.hashCode(this.uniCodigo);
        hash = 37 * hash + Objects.hashCode(this.uniIdepadre);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniPropiedad);
        hash = 37 * hash + Objects.hashCode(this.uniFecha);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad UniUnidadDTO que se pasa
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
        final UniUnidadDTO other = (UniUnidadDTO) obj;
                
        if (!Objects.equals(this.uniIderegistro, other.uniIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.estIderegistro, other.estIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo1, other.uniCodigo1)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo2, other.uniCodigo2)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo3, other.uniCodigo3)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo4, other.uniCodigo4)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo5, other.uniCodigo5)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNombre1, other.uniNombre1)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNombre2, other.uniNombre2)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNombre3, other.uniNombre3)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNombre4, other.uniNombre4)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNombre5, other.uniNombre5)) {
            return false;
        }
        
        if (!Objects.equals(this.uniOrden, other.uniOrden)) {
            return false;
        }
        
        if (!Objects.equals(this.uniNivel, other.uniNivel)) {
            return false;
        }
        
        if (!Objects.equals(this.uniCodigo, other.uniCodigo)) {
            return false;
        }
        
        if (!Objects.equals(this.uniIdepadre, other.uniIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniPropiedad, other.uniPropiedad)) {
            return false;
        }
        
        return Objects.equals(this.uniFecha, other.uniFecha);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

