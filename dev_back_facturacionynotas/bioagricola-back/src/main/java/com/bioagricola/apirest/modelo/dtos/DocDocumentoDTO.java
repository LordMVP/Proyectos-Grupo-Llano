package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DocDocumentoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DocDocumentoDTO implements Serializable{	

	
	private Integer uniDocumento;

	private Integer estDocumento;
	
	private String docNombre;
	
	private String docAbreviatura;
	
	private String docFinanciable;
	
	private String docTipo;
	
	private String docContabiliza;
	
	private String docConsigna;
	
	private String docPresupuesto;
	
	private String docRecaudo;
	
	private Integer usuIderegistro;
	
	private String docDevolucion;
	
	private String docAnticipo;
	
	private String docRegistro;
	
	private String docNitcontabil;
	
	private Short docMaximpresion;
	
	private Short docPagpriori;
	
	private String docAplicafes;
	
	private String docAplicafelec;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DocDocumentoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniDocumento")
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	@JsonProperty("uniDocumento")
	public void setUniDocumento(Integer uniDocumento){
		this.uniDocumento = uniDocumento;
	}
	
	@JsonProperty("estDocumento")
	public Integer getEstDocumento(){
		return this.estDocumento;
	}
	
	@JsonProperty("estDocumento")
	public void setEstDocumento(Integer estDocumento){
		this.estDocumento = estDocumento;
	}
		
	@JsonProperty("docNombre")
	public String getDocNombre(){
		return this.docNombre;
	}
	
	@JsonProperty("docNombre")
	public void setDocNombre(String docNombre){
		this.docNombre = docNombre;
	}
		
	@JsonProperty("docAbreviatura")
	public String getDocAbreviatura(){
		return this.docAbreviatura;
	}
	
	@JsonProperty("docAbreviatura")
	public void setDocAbreviatura(String docAbreviatura){
		this.docAbreviatura = docAbreviatura;
	}
		
	@JsonProperty("docFinanciable")
	public String getDocFinanciable(){
		return this.docFinanciable;
	}
	
	@JsonProperty("docFinanciable")
	public void setDocFinanciable(String docFinanciable){
		this.docFinanciable = docFinanciable;
	}
		
	@JsonProperty("docTipo")
	public String getDocTipo(){
		return this.docTipo;
	}
	
	@JsonProperty("docTipo")
	public void setDocTipo(String docTipo){
		this.docTipo = docTipo;
	}
		
	@JsonProperty("docContabiliza")
	public String getDocContabiliza(){
		return this.docContabiliza;
	}
	
	@JsonProperty("docContabiliza")
	public void setDocContabiliza(String docContabiliza){
		this.docContabiliza = docContabiliza;
	}
		
	@JsonProperty("docConsigna")
	public String getDocConsigna(){
		return this.docConsigna;
	}
	
	@JsonProperty("docConsigna")
	public void setDocConsigna(String docConsigna){
		this.docConsigna = docConsigna;
	}
		
	@JsonProperty("docPresupuesto")
	public String getDocPresupuesto(){
		return this.docPresupuesto;
	}
	
	@JsonProperty("docPresupuesto")
	public void setDocPresupuesto(String docPresupuesto){
		this.docPresupuesto = docPresupuesto;
	}
		
	@JsonProperty("docRecaudo")
	public String getDocRecaudo(){
		return this.docRecaudo;
	}
	
	@JsonProperty("docRecaudo")
	public void setDocRecaudo(String docRecaudo){
		this.docRecaudo = docRecaudo;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("docDevolucion")
	public String getDocDevolucion(){
		return this.docDevolucion;
	}
	
	@JsonProperty("docDevolucion")
	public void setDocDevolucion(String docDevolucion){
		this.docDevolucion = docDevolucion;
	}
		
	@JsonProperty("docAnticipo")
	public String getDocAnticipo(){
		return this.docAnticipo;
	}
	
	@JsonProperty("docAnticipo")
	public void setDocAnticipo(String docAnticipo){
		this.docAnticipo = docAnticipo;
	}
		
	@JsonProperty("docRegistro")
	public String getDocRegistro(){
		return this.docRegistro;
	}
	
	@JsonProperty("docRegistro")
	public void setDocRegistro(String docRegistro){
		this.docRegistro = docRegistro;
	}
		
	@JsonProperty("docNitcontabil")
	public String getDocNitcontabil(){
		return this.docNitcontabil;
	}
	
	@JsonProperty("docNitcontabil")
	public void setDocNitcontabil(String docNitcontabil){
		this.docNitcontabil = docNitcontabil;
	}
		
	@JsonProperty("docMaximpresion")
	public Short getDocMaximpresion(){
		return this.docMaximpresion;
	}
	
	@JsonProperty("docMaximpresion")
	public void setDocMaximpresion(Short docMaximpresion){
		this.docMaximpresion = docMaximpresion;
	}
		
	@JsonProperty("docPagpriori")
	public Short getDocPagpriori(){
		return this.docPagpriori;
	}
	
	@JsonProperty("docPagpriori")
	public void setDocPagpriori(Short docPagpriori){
		this.docPagpriori = docPagpriori;
	}
		
	@JsonProperty("docAplicafes")
	public String getDocAplicafes(){
		return this.docAplicafes;
	}
	
	@JsonProperty("docAplicafes")
	public void setDocAplicafes(String docAplicafes){
		this.docAplicafes = docAplicafes;
	}
		
	@JsonProperty("docAplicafelec")
	public String getDocAplicafelec(){
		return this.docAplicafelec;
	}
	
	@JsonProperty("docAplicafelec")
	public void setDocAplicafelec(String docAplicafelec){
		this.docAplicafelec = docAplicafelec;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);        
        hash = 37 * hash + Objects.hashCode(this.estDocumento);
        hash = 37 * hash + Objects.hashCode(this.docNombre);
        hash = 37 * hash + Objects.hashCode(this.docAbreviatura);
        hash = 37 * hash + Objects.hashCode(this.docFinanciable);
        hash = 37 * hash + Objects.hashCode(this.docTipo);
        hash = 37 * hash + Objects.hashCode(this.docContabiliza);
        hash = 37 * hash + Objects.hashCode(this.docConsigna);
        hash = 37 * hash + Objects.hashCode(this.docPresupuesto);
        hash = 37 * hash + Objects.hashCode(this.docRecaudo);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.docDevolucion);
        hash = 37 * hash + Objects.hashCode(this.docAnticipo);
        hash = 37 * hash + Objects.hashCode(this.docRegistro);
        hash = 37 * hash + Objects.hashCode(this.docNitcontabil);
        hash = 37 * hash + Objects.hashCode(this.docMaximpresion);
        hash = 37 * hash + Objects.hashCode(this.docPagpriori);
        hash = 37 * hash + Objects.hashCode(this.docAplicafes);
        hash = 37 * hash + Objects.hashCode(this.docAplicafelec);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DocDocumentoDTO que se pasa
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
        final DocDocumentoDTO other = (DocDocumentoDTO) obj;
                
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.estDocumento, other.estDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.docNombre, other.docNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.docAbreviatura, other.docAbreviatura)) {
            return false;
        }
        
        if (!Objects.equals(this.docFinanciable, other.docFinanciable)) {
            return false;
        }
        
        if (!Objects.equals(this.docTipo, other.docTipo)) {
            return false;
        }
        
        if (!Objects.equals(this.docContabiliza, other.docContabiliza)) {
            return false;
        }
        
        if (!Objects.equals(this.docConsigna, other.docConsigna)) {
            return false;
        }
        
        if (!Objects.equals(this.docPresupuesto, other.docPresupuesto)) {
            return false;
        }
        
        if (!Objects.equals(this.docRecaudo, other.docRecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.docDevolucion, other.docDevolucion)) {
            return false;
        }
        
        if (!Objects.equals(this.docAnticipo, other.docAnticipo)) {
            return false;
        }
        
        if (!Objects.equals(this.docRegistro, other.docRegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.docNitcontabil, other.docNitcontabil)) {
            return false;
        }
        
        if (!Objects.equals(this.docMaximpresion, other.docMaximpresion)) {
            return false;
        }
        
        if (!Objects.equals(this.docPagpriori, other.docPagpriori)) {
            return false;
        }
        
        if (!Objects.equals(this.docAplicafes, other.docAplicafes)) {
            return false;
        }
        
        return Objects.equals(this.docAplicafelec, other.docAplicafelec);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

