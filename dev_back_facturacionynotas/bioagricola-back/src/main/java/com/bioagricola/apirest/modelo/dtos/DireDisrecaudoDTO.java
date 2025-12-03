package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DireDisrecaudoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DireDisrecaudoDTO implements Serializable{	

	
	private Long direIderegistr;

	private BigDecimal direVlrrecaudo;
	
	private BigDecimal direSdorecaudo;
	
	private Long recIderegistro;
	
	private Integer dicnIderegistr;
	
	private Long dsusIderegistr;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Integer uniConcepto;
	
	private Integer perIderegistro;
	
	private Integer cicIderegistro;
	
	private Integer empIderegistro;
	
	private Short cicAno;
	
	private Long dcsgIderegistr;
	
	private Integer usuIderegistro;
	
	private Long direVersion;
	
	private Long mviIderegistro;
	
	private Long mvreIderegistr;
	
	private Long mvcsIderegistr;
	
	private Long direIdeorigen;
	
	private Long direIdepadre;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DireDisrecaudoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("direIderegistr")
	public Long getDireIderegistr(){
		return this.direIderegistr;
	}
	
	@JsonProperty("direIderegistr")
	public void setDireIderegistr(Long direIderegistr){
		this.direIderegistr = direIderegistr;
	}
	
	@JsonProperty("direVlrrecaudo")
	public BigDecimal getDireVlrrecaudo(){
		return this.direVlrrecaudo;
	}
	
	@JsonProperty("direVlrrecaudo")
	public void setDireVlrrecaudo(BigDecimal direVlrrecaudo){
		this.direVlrrecaudo = direVlrrecaudo;
	}
		
	@JsonProperty("direSdorecaudo")
	public BigDecimal getDireSdorecaudo(){
		return this.direSdorecaudo;
	}
	
	@JsonProperty("direSdorecaudo")
	public void setDireSdorecaudo(BigDecimal direSdorecaudo){
		this.direSdorecaudo = direSdorecaudo;
	}
		
	@JsonProperty("recIderegistro")
	public Long getRecIderegistro(){
		return this.recIderegistro;
	}
	
	@JsonProperty("recIderegistro")
	public void setRecIderegistro(Long recIderegistro){
		this.recIderegistro = recIderegistro;
	}
		
	@JsonProperty("dicnIderegistr")
	public Integer getDicnIderegistr(){
		return this.dicnIderegistr;
	}
	
	@JsonProperty("dicnIderegistr")
	public void setDicnIderegistr(Integer dicnIderegistr){
		this.dicnIderegistr = dicnIderegistr;
	}
		
	@JsonProperty("dsusIderegistr")
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	@JsonProperty("dsusIderegistr")
	public void setDsusIderegistr(Long dsusIderegistr){
		this.dsusIderegistr = dsusIderegistr;
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
		
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
		this.uniConcepto = uniConcepto;
	}
		
	@JsonProperty("perIderegistro")
	public Integer getPerIderegistro(){
		return this.perIderegistro;
	}
	
	@JsonProperty("perIderegistro")
	public void setPerIderegistro(Integer perIderegistro){
		this.perIderegistro = perIderegistro;
	}
		
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
	}
		
	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro){
		this.empIderegistro = empIderegistro;
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
		
	@JsonProperty("direVersion")
	public Long getDireVersion(){
		return this.direVersion;
	}
	
	@JsonProperty("direVersion")
	public void setDireVersion(Long direVersion){
		this.direVersion = direVersion;
	}
		
	@JsonProperty("mviIderegistro")
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	@JsonProperty("mviIderegistro")
	public void setMviIderegistro(Long mviIderegistro){
		this.mviIderegistro = mviIderegistro;
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
		
	@JsonProperty("direIdeorigen")
	public Long getDireIdeorigen(){
		return this.direIdeorigen;
	}
	
	@JsonProperty("direIdeorigen")
	public void setDireIdeorigen(Long direIdeorigen){
		this.direIdeorigen = direIdeorigen;
	}
		
	@JsonProperty("direIdepadre")
	public Long getDireIdepadre(){
		return this.direIdepadre;
	}
	
	@JsonProperty("direIdepadre")
	public void setDireIdepadre(Long direIdepadre){
		this.direIdepadre = direIdepadre;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.direIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.direVlrrecaudo);
        hash = 37 * hash + Objects.hashCode(this.direSdorecaudo);
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dicnIderegistr);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.dcsgIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.direVersion);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.mvreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvcsIderegistr);
        hash = 37 * hash + Objects.hashCode(this.direIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.direIdepadre);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DireDisrecaudoDTO que se pasa
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
        final DireDisrecaudoDTO other = (DireDisrecaudoDTO) obj;
                
        if (!Objects.equals(this.direIderegistr, other.direIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.direVlrrecaudo, other.direVlrrecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.direSdorecaudo, other.direSdorecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnIderegistr, other.dicnIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
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
        
        if (!Objects.equals(this.direVersion, other.direVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.mvreIderegistr, other.mvreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.mvcsIderegistr, other.mvcsIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.direIdeorigen, other.direIdeorigen)) {
            return false;
        }
        
        return Objects.equals(this.direIdepadre, other.direIdepadre);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

