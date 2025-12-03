package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad RecRecaudoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class RecRecaudoDTO implements Serializable{	

	
	private Long recIderegistro;

	private Byte[] recFecha;
	
	private String recEstado;
	
	private Date recFecaplicado;
	
	private BigDecimal recVlrpagado;
	
	private BigDecimal recVlrcambio;
	
	private BigDecimal recVlrajuste;
	
	private BigDecimal recVlrreal;
	
	private Integer uniMedpago;
	
	private Integer cnreIderegistr;
	
	private Integer empIderegistro;
	
	private Long susIderegistro;
	
	private Long terIderegistro;
	
	private Integer uniDocumento;
	
	private Long recIdeorigen;
	
	private Long recIdepadre;
	
	private Date recFecpago;
	
	private Integer uniMunicipio;
	
	private Long csgIderegistro;
	
	private Integer usuIderegistro;
	
	private Long recVersion;
	
	private Long mviIderegistro;
	
	private Integer recIdeunificad;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RecRecaudoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("recIderegistro")
	public Long getRecIderegistro(){
		return this.recIderegistro;
	}
	
	@JsonProperty("recIderegistro")
	public void setRecIderegistro(Long recIderegistro){
		this.recIderegistro = recIderegistro;
	}
	
	@JsonProperty("recFecha")
	public Byte[] getRecFecha(){
		return this.recFecha;
	}
	
	@JsonProperty("recFecha")
	public void setRecFecha(Byte[] recFecha){
		this.recFecha = recFecha;
	}
		
	@JsonProperty("recEstado")
	public String getRecEstado(){
		return this.recEstado;
	}
	
	@JsonProperty("recEstado")
	public void setRecEstado(String recEstado){
		this.recEstado = recEstado;
	}
		
	@JsonProperty("recFecaplicado")
	public Date getRecFecaplicado(){
		return this.recFecaplicado;
	}
	
	@JsonProperty("recFecaplicado")
	public void setRecFecaplicado(Date recFecaplicado){
		this.recFecaplicado = recFecaplicado;
	}
		
	@JsonProperty("recVlrpagado")
	public BigDecimal getRecVlrpagado(){
		return this.recVlrpagado;
	}
	
	@JsonProperty("recVlrpagado")
	public void setRecVlrpagado(BigDecimal recVlrpagado){
		this.recVlrpagado = recVlrpagado;
	}
		
	@JsonProperty("recVlrcambio")
	public BigDecimal getRecVlrcambio(){
		return this.recVlrcambio;
	}
	
	@JsonProperty("recVlrcambio")
	public void setRecVlrcambio(BigDecimal recVlrcambio){
		this.recVlrcambio = recVlrcambio;
	}
		
	@JsonProperty("recVlrajuste")
	public BigDecimal getRecVlrajuste(){
		return this.recVlrajuste;
	}
	
	@JsonProperty("recVlrajuste")
	public void setRecVlrajuste(BigDecimal recVlrajuste){
		this.recVlrajuste = recVlrajuste;
	}
		
	@JsonProperty("recVlrreal")
	public BigDecimal getRecVlrreal(){
		return this.recVlrreal;
	}
	
	@JsonProperty("recVlrreal")
	public void setRecVlrreal(BigDecimal recVlrreal){
		this.recVlrreal = recVlrreal;
	}
		
	@JsonProperty("uniMedpago")
	public Integer getUniMedpago(){
		return this.uniMedpago;
	}
	
	@JsonProperty("uniMedpago")
	public void setUniMedpago(Integer uniMedpago){
		this.uniMedpago = uniMedpago;
	}
		
	@JsonProperty("cnreIderegistr")
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	@JsonProperty("cnreIderegistr")
	public void setCnreIderegistr(Integer cnreIderegistr){
		this.cnreIderegistr = cnreIderegistr;
	}
		
	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro){
		this.empIderegistro = empIderegistro;
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
		
	@JsonProperty("uniDocumento")
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	@JsonProperty("uniDocumento")
	public void setUniDocumento(Integer uniDocumento){
		this.uniDocumento = uniDocumento;
	}
		
	@JsonProperty("recIdeorigen")
	public Long getRecIdeorigen(){
		return this.recIdeorigen;
	}
	
	@JsonProperty("recIdeorigen")
	public void setRecIdeorigen(Long recIdeorigen){
		this.recIdeorigen = recIdeorigen;
	}
		
	@JsonProperty("recIdepadre")
	public Long getRecIdepadre(){
		return this.recIdepadre;
	}
	
	@JsonProperty("recIdepadre")
	public void setRecIdepadre(Long recIdepadre){
		this.recIdepadre = recIdepadre;
	}
		
	@JsonProperty("recFecpago")
	public Date getRecFecpago(){
		return this.recFecpago;
	}
	
	@JsonProperty("recFecpago")
	public void setRecFecpago(Date recFecpago){
		this.recFecpago = recFecpago;
	}
		
	@JsonProperty("uniMunicipio")
	public Integer getUniMunicipio(){
		return this.uniMunicipio;
	}
	
	@JsonProperty("uniMunicipio")
	public void setUniMunicipio(Integer uniMunicipio){
		this.uniMunicipio = uniMunicipio;
	}
		
	@JsonProperty("csgIderegistro")
	public Long getCsgIderegistro(){
		return this.csgIderegistro;
	}
	
	@JsonProperty("csgIderegistro")
	public void setCsgIderegistro(Long csgIderegistro){
		this.csgIderegistro = csgIderegistro;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("recVersion")
	public Long getRecVersion(){
		return this.recVersion;
	}
	
	@JsonProperty("recVersion")
	public void setRecVersion(Long recVersion){
		this.recVersion = recVersion;
	}
		
	@JsonProperty("mviIderegistro")
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	@JsonProperty("mviIderegistro")
	public void setMviIderegistro(Long mviIderegistro){
		this.mviIderegistro = mviIderegistro;
	}
		
	@JsonProperty("recIdeunificad")
	public Integer getRecIdeunificad(){
		return this.recIdeunificad;
	}
	
	@JsonProperty("recIdeunificad")
	public void setRecIdeunificad(Integer recIdeunificad){
		this.recIdeunificad = recIdeunificad;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.recFecha);
        hash = 37 * hash + Objects.hashCode(this.recEstado);
        hash = 37 * hash + Objects.hashCode(this.recFecaplicado);
        hash = 37 * hash + Objects.hashCode(this.recVlrpagado);
        hash = 37 * hash + Objects.hashCode(this.recVlrcambio);
        hash = 37 * hash + Objects.hashCode(this.recVlrajuste);
        hash = 37 * hash + Objects.hashCode(this.recVlrreal);
        hash = 37 * hash + Objects.hashCode(this.uniMedpago);
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.recIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.recIdepadre);
        hash = 37 * hash + Objects.hashCode(this.recFecpago);
        hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
        hash = 37 * hash + Objects.hashCode(this.csgIderegistro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.recVersion);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.recIdeunificad);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad RecRecaudoDTO que se pasa
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
        final RecRecaudoDTO other = (RecRecaudoDTO) obj;
                
        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecha, other.recFecha)) {
            return false;
        }
        
        if (!Objects.equals(this.recEstado, other.recEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecaplicado, other.recFecaplicado)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrpagado, other.recVlrpagado)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrcambio, other.recVlrcambio)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrajuste, other.recVlrajuste)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrreal, other.recVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMedpago, other.uniMedpago)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.recIdeorigen, other.recIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.recIdepadre, other.recIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecpago, other.recFecpago)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
            return false;
        }
        
        if (!Objects.equals(this.csgIderegistro, other.csgIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.recVersion, other.recVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.recIdeunificad, other.recIdeunificad);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

