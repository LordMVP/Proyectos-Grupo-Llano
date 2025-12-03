package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DrecDetrecaudoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DrecDetrecaudoDTO implements Serializable{	

	
	private Long drecIderegistr;

	private Long recIderegistro;
	
	private BigDecimal drecVlrtotal;
	
	private BigDecimal drecVlrreal;
	
	private Byte[] drecFecha;
	
	private Long drecIdeorigen;
	
	private Long facIderegistro;
	
	private Integer cicIderegistro;
	
	private Integer perIderegistro;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Long dfacIderegistr;
	
	private Long direIderegistr;
	
	private Long drecIdepadre;
	
	private Short cicAno;
	
	private Long dcsgIderegistr;
	
	private Integer usuIderegistro;
	
	private Long drecVersion;
	
	private Long mvmcIderegistr;
	
	private Long mvreIderegistr;
	
	private Long mvcsIderegistr;
	
	private Long mviIderegistro;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DrecDetrecaudoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("drecIderegistr")
	public Long getDrecIderegistr(){
		return this.drecIderegistr;
	}
	
	@JsonProperty("drecIderegistr")
	public void setDrecIderegistr(Long drecIderegistr){
		this.drecIderegistr = drecIderegistr;
	}
	
	@JsonProperty("recIderegistro")
	public Long getRecIderegistro(){
		return this.recIderegistro;
	}
	
	@JsonProperty("recIderegistro")
	public void setRecIderegistro(Long recIderegistro){
		this.recIderegistro = recIderegistro;
	}
		
	@JsonProperty("drecVlrtotal")
	public BigDecimal getDrecVlrtotal(){
		return this.drecVlrtotal;
	}
	
	@JsonProperty("drecVlrtotal")
	public void setDrecVlrtotal(BigDecimal drecVlrtotal){
		this.drecVlrtotal = drecVlrtotal;
	}
		
	@JsonProperty("drecVlrreal")
	public BigDecimal getDrecVlrreal(){
		return this.drecVlrreal;
	}
	
	@JsonProperty("drecVlrreal")
	public void setDrecVlrreal(BigDecimal drecVlrreal){
		this.drecVlrreal = drecVlrreal;
	}
		
	@JsonProperty("drecFecha")
	public Byte[] getDrecFecha(){
		return this.drecFecha;
	}
	
	@JsonProperty("drecFecha")
	public void setDrecFecha(Byte[] drecFecha){
		this.drecFecha = drecFecha;
	}
		
	@JsonProperty("drecIdeorigen")
	public Long getDrecIdeorigen(){
		return this.drecIdeorigen;
	}
	
	@JsonProperty("drecIdeorigen")
	public void setDrecIdeorigen(Long drecIdeorigen){
		this.drecIdeorigen = drecIdeorigen;
	}
		
	@JsonProperty("facIderegistro")
	public Long getFacIderegistro(){
		return this.facIderegistro;
	}
	
	@JsonProperty("facIderegistro")
	public void setFacIderegistro(Long facIderegistro){
		this.facIderegistro = facIderegistro;
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
		
	@JsonProperty("dfacIderegistr")
	public Long getDfacIderegistr(){
		return this.dfacIderegistr;
	}
	
	@JsonProperty("dfacIderegistr")
	public void setDfacIderegistr(Long dfacIderegistr){
		this.dfacIderegistr = dfacIderegistr;
	}
		
	@JsonProperty("direIderegistr")
	public Long getDireIderegistr(){
		return this.direIderegistr;
	}
	
	@JsonProperty("direIderegistr")
	public void setDireIderegistr(Long direIderegistr){
		this.direIderegistr = direIderegistr;
	}
		
	@JsonProperty("drecIdepadre")
	public Long getDrecIdepadre(){
		return this.drecIdepadre;
	}
	
	@JsonProperty("drecIdepadre")
	public void setDrecIdepadre(Long drecIdepadre){
		this.drecIdepadre = drecIdepadre;
	}
		
	@JsonProperty("cicAno")
	public Short getCicAno(){
		return this.cicAno;
	}
	
	@JsonProperty("cicAno")
	public void setCicAno(Short cicAno){
		this.cicAno = cicAno;
	}
		
	@JsonProperty("dcsgIderegistr")
	public Long getDcsgIderegistr(){
		return this.dcsgIderegistr;
	}
	
	@JsonProperty("dcsgIderegistr")
	public void setDcsgIderegistr(Long dcsgIderegistr){
		this.dcsgIderegistr = dcsgIderegistr;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("drecVersion")
	public Long getDrecVersion(){
		return this.drecVersion;
	}
	
	@JsonProperty("drecVersion")
	public void setDrecVersion(Long drecVersion){
		this.drecVersion = drecVersion;
	}
		
	@JsonProperty("mvmcIderegistr")
	public Long getMvmcIderegistr(){
		return this.mvmcIderegistr;
	}
	
	@JsonProperty("mvmcIderegistr")
	public void setMvmcIderegistr(Long mvmcIderegistr){
		this.mvmcIderegistr = mvmcIderegistr;
	}
		
	@JsonProperty("mvreIderegistr")
	public Long getMvreIderegistr(){
		return this.mvreIderegistr;
	}
	
	@JsonProperty("mvreIderegistr")
	public void setMvreIderegistr(Long mvreIderegistr){
		this.mvreIderegistr = mvreIderegistr;
	}
		
	@JsonProperty("mvcsIderegistr")
	public Long getMvcsIderegistr(){
		return this.mvcsIderegistr;
	}
	
	@JsonProperty("mvcsIderegistr")
	public void setMvcsIderegistr(Long mvcsIderegistr){
		this.mvcsIderegistr = mvcsIderegistr;
	}
		
	@JsonProperty("mviIderegistro")
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	@JsonProperty("mviIderegistro")
	public void setMviIderegistro(Long mviIderegistro){
		this.mviIderegistro = mviIderegistro;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.drecIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);
        hash = 37 * hash + Objects.hashCode(this.drecVlrtotal);
        hash = 37 * hash + Objects.hashCode(this.drecVlrreal);
        hash = 37 * hash + Objects.hashCode(this.drecFecha);
        hash = 37 * hash + Objects.hashCode(this.drecIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.facIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.dfacIderegistr);
        hash = 37 * hash + Objects.hashCode(this.direIderegistr);
        hash = 37 * hash + Objects.hashCode(this.drecIdepadre);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.dcsgIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.drecVersion);
        hash = 37 * hash + Objects.hashCode(this.mvmcIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvcsIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DrecDetrecaudoDTO que se pasa
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
        final DrecDetrecaudoDTO other = (DrecDetrecaudoDTO) obj;
                
        if (!Objects.equals(this.drecIderegistr, other.drecIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.drecVlrtotal, other.drecVlrtotal)) {
            return false;
        }
        
        if (!Objects.equals(this.drecVlrreal, other.drecVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.drecFecha, other.drecFecha)) {
            return false;
        }
        
        if (!Objects.equals(this.drecIdeorigen, other.drecIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
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
        
        if (!Objects.equals(this.dfacIderegistr, other.dfacIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.direIderegistr, other.direIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.drecIdepadre, other.drecIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.cicAno, other.cicAno)) {
            return false;
        }
        
        if (!Objects.equals(this.dcsgIderegistr, other.dcsgIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.drecVersion, other.drecVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.mvmcIderegistr, other.mvmcIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.mvreIderegistr, other.mvreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.mvcsIderegistr, other.mvcsIderegistr)) {
            return false;
        }
        
        return Objects.equals(this.mviIderegistro, other.mviIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

