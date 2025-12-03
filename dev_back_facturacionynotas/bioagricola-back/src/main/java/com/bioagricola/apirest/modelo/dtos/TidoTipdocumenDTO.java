package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad TidoTipdocumenDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class TidoTipdocumenDTO implements Serializable{	

	
	private Integer uniTipdocument;

	private Integer estTipdocument;
	
	private String tidoNombre;
	
	private String tidoAbreviatur;
	
	private String tidoMetregistr;
	
	private String tidoGensuspend;
	
	private Integer usuIderegistro;
	
	private String tidoNitcontabil;
	
	private Short tidoMaxcuofinancia;
	
	private Short tidoMaxcuounifica;
	
	private Short tidoMaxcuoreestruc;
	
	private Short tidoMaxcuoabonok;
	
	private String tidoFinvencido;
	
	private Short tidoPagpriori;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public TidoTipdocumenDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniTipdocument")
	public Integer getUniTipdocument(){
		return this.uniTipdocument;
	}
	
	@JsonProperty("uniTipdocument")
	public void setUniTipdocument(Integer uniTipdocument){
		this.uniTipdocument = uniTipdocument;
	}
	
	@JsonProperty("estTipdocument")
	public Integer getEstTipdocument(){
		return this.estTipdocument;
	}
	
	@JsonProperty("estTipdocument")
	public void setEstTipdocument(Integer estTipdocument){
		this.estTipdocument = estTipdocument;
	}
		
	@JsonProperty("tidoNombre")
	public String getTidoNombre(){
		return this.tidoNombre;
	}
	
	@JsonProperty("tidoNombre")
	public void setTidoNombre(String tidoNombre){
		this.tidoNombre = tidoNombre;
	}
		
	@JsonProperty("tidoAbreviatur")
	public String getTidoAbreviatur(){
		return this.tidoAbreviatur;
	}
	
	@JsonProperty("tidoAbreviatur")
	public void setTidoAbreviatur(String tidoAbreviatur){
		this.tidoAbreviatur = tidoAbreviatur;
	}
		
	@JsonProperty("tidoMetregistr")
	public String getTidoMetregistr(){
		return this.tidoMetregistr;
	}
	
	@JsonProperty("tidoMetregistr")
	public void setTidoMetregistr(String tidoMetregistr){
		this.tidoMetregistr = tidoMetregistr;
	}
		
	@JsonProperty("tidoGensuspend")
	public String getTidoGensuspend(){
		return this.tidoGensuspend;
	}
	
	@JsonProperty("tidoGensuspend")
	public void setTidoGensuspend(String tidoGensuspend){
		this.tidoGensuspend = tidoGensuspend;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("tidoNitcontabil")
	public String getTidoNitcontabil(){
		return this.tidoNitcontabil;
	}
	
	@JsonProperty("tidoNitcontabil")
	public void setTidoNitcontabil(String tidoNitcontabil){
		this.tidoNitcontabil = tidoNitcontabil;
	}
		
	@JsonProperty("tidoMaxcuofinancia")
	public Short getTidoMaxcuofinancia(){
		return this.tidoMaxcuofinancia;
	}
	
	@JsonProperty("tidoMaxcuofinancia")
	public void setTidoMaxcuofinancia(Short tidoMaxcuofinancia){
		this.tidoMaxcuofinancia = tidoMaxcuofinancia;
	}
		
	@JsonProperty("tidoMaxcuounifica")
	public Short getTidoMaxcuounifica(){
		return this.tidoMaxcuounifica;
	}
	
	@JsonProperty("tidoMaxcuounifica")
	public void setTidoMaxcuounifica(Short tidoMaxcuounifica){
		this.tidoMaxcuounifica = tidoMaxcuounifica;
	}
		
	@JsonProperty("tidoMaxcuoreestruc")
	public Short getTidoMaxcuoreestruc(){
		return this.tidoMaxcuoreestruc;
	}
	
	@JsonProperty("tidoMaxcuoreestruc")
	public void setTidoMaxcuoreestruc(Short tidoMaxcuoreestruc){
		this.tidoMaxcuoreestruc = tidoMaxcuoreestruc;
	}
		
	@JsonProperty("tidoMaxcuoabonok")
	public Short getTidoMaxcuoabonok(){
		return this.tidoMaxcuoabonok;
	}
	
	@JsonProperty("tidoMaxcuoabonok")
	public void setTidoMaxcuoabonok(Short tidoMaxcuoabonok){
		this.tidoMaxcuoabonok = tidoMaxcuoabonok;
	}
		
	@JsonProperty("tidoFinvencido")
	public String getTidoFinvencido(){
		return this.tidoFinvencido;
	}
	
	@JsonProperty("tidoFinvencido")
	public void setTidoFinvencido(String tidoFinvencido){
		this.tidoFinvencido = tidoFinvencido;
	}
		
	@JsonProperty("tidoPagpriori")
	public Short getTidoPagpriori(){
		return this.tidoPagpriori;
	}
	
	@JsonProperty("tidoPagpriori")
	public void setTidoPagpriori(Short tidoPagpriori){
		this.tidoPagpriori = tidoPagpriori;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);        
        hash = 37 * hash + Objects.hashCode(this.estTipdocument);
        hash = 37 * hash + Objects.hashCode(this.tidoNombre);
        hash = 37 * hash + Objects.hashCode(this.tidoAbreviatur);
        hash = 37 * hash + Objects.hashCode(this.tidoMetregistr);
        hash = 37 * hash + Objects.hashCode(this.tidoGensuspend);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.tidoNitcontabil);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuofinancia);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuounifica);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuoreestruc);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuoabonok);
        hash = 37 * hash + Objects.hashCode(this.tidoFinvencido);
        hash = 37 * hash + Objects.hashCode(this.tidoPagpriori);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad TidoTipdocumenDTO que se pasa
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
        final TidoTipdocumenDTO other = (TidoTipdocumenDTO) obj;
                
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.estTipdocument, other.estTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoNombre, other.tidoNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoAbreviatur, other.tidoAbreviatur)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMetregistr, other.tidoMetregistr)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoGensuspend, other.tidoGensuspend)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoNitcontabil, other.tidoNitcontabil)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuofinancia, other.tidoMaxcuofinancia)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuounifica, other.tidoMaxcuounifica)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuoreestruc, other.tidoMaxcuoreestruc)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuoabonok, other.tidoMaxcuoabonok)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoFinvencido, other.tidoFinvencido)) {
            return false;
        }
        
        return Objects.equals(this.tidoPagpriori, other.tidoPagpriori);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

