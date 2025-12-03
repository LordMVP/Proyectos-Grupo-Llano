package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
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
public class FacFacturaDTO implements Serializable{	

	
	private Long facIderegistro;

	private Long facNumero;
	
	private String facMetgenera;
	
	private String facEstado;
	
	private Date facFecha;
	
	private Long facIdeactual;
	
	private Long facIdepadre;
	
	private Date facFecaprobada;
	
	private Date facFeceliminad;
	
	private Date facFecfinancia;
	
	private Date facFeccastigad;
	
	private Date facFecvence;
	
	private Integer empIderegistro;
	
	private Long susIderegistro;
	
	private Long dsusIderegistr;
	
	private Integer uniTipsuscripc;
	
	private Integer uniTipusosuscr;
	
	private Integer uniLiquidacion;
	
	private Long terIderegistro;
	
	private Integer cicIderegistro;
	
	private Integer perIderegistro;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Long amoIderegistro;
	
	private Short cicAno;
	
	private Long hliqIderegistr;
	
	private BigDecimal facSdoreal;
	
	private Long facIdeorigen;
	
	private Integer uniTiptercero;
	
	private Date facFecsuspens;
	
	private Long finIderegistro;
	
	private Integer facVersion;
	
	private BigDecimal facVlrreal;
	
	private Integer usuIderegistro;
	
	private Long mviIderegistro;
	
	private Short facCtrlfelec;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public FacFacturaDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }

	public FacFacturaDTO(Long facIderegistro, Long facNumero, String facMetgenera, String facEstado, Date facFecha, Long facIdeactual, Long facIdepadre, Date facFecaprobada, Date facFeceliminad, Date facFecfinancia, Date facFeccastigad, Date facFecvence, Integer empIderegistro, Long susIderegistro, Long dsusIderegistr, Integer uniTipsuscripc, Integer uniTipusosuscr, Integer uniLiquidacion, Long terIderegistro, Integer cicIderegistro, Integer perIderegistro, Integer uniDocumento, Integer uniTipdocument, Long amoIderegistro, Short cicAno, Long hliqIderegistr, BigDecimal facSdoreal, Long facIdeorigen, Integer uniTiptercero, Date facFecsuspens, Long finIderegistro, Integer facVersion, BigDecimal facVlrreal, Integer usuIderegistro, Long mviIderegistro, Short facCtrlfelec) {
		this.facIderegistro = facIderegistro;
		this.facNumero = facNumero;
		this.facMetgenera = facMetgenera;
		this.facEstado = facEstado;
		this.facFecha = facFecha;
		this.facIdeactual = facIdeactual;
		this.facIdepadre = facIdepadre;
		this.facFecaprobada = facFecaprobada;
		this.facFeceliminad = facFeceliminad;
		this.facFecfinancia = facFecfinancia;
		this.facFeccastigad = facFeccastigad;
		this.facFecvence = facFecvence;
		this.empIderegistro = empIderegistro;
		this.susIderegistro = susIderegistro;
		this.dsusIderegistr = dsusIderegistr;
		this.uniTipsuscripc = uniTipsuscripc;
		this.uniTipusosuscr = uniTipusosuscr;
		this.uniLiquidacion = uniLiquidacion;
		this.terIderegistro = terIderegistro;
		this.cicIderegistro = cicIderegistro;
		this.perIderegistro = perIderegistro;
		this.uniDocumento = uniDocumento;
		this.uniTipdocument = uniTipdocument;
		this.amoIderegistro = amoIderegistro;
		this.cicAno = cicAno;
		this.hliqIderegistr = hliqIderegistr;
		this.facSdoreal = facSdoreal;
		this.facIdeorigen = facIdeorigen;
		this.uniTiptercero = uniTiptercero;
		this.facFecsuspens = facFecsuspens;
		this.finIderegistro = finIderegistro;
		this.facVersion = facVersion;
		this.facVlrreal = facVlrreal;
		this.usuIderegistro = usuIderegistro;
		this.mviIderegistro = mviIderegistro;
		this.facCtrlfelec = facCtrlfelec;
	}

	@JsonProperty("facIderegistro")
	public Long getFacIderegistro(){
		return this.facIderegistro;
	}
	
	@JsonProperty("facIderegistro")
	public void setFacIderegistro(Long facIderegistro){
		this.facIderegistro = facIderegistro;
	}
	
	@JsonProperty("facNumero")
	public Long getFacNumero(){
		return this.facNumero;
	}
	
	@JsonProperty("facNumero")
	public void setFacNumero(Long facNumero){
		this.facNumero = facNumero;
	}
		
	@JsonProperty("facMetgenera")
	public String getFacMetgenera(){
		return this.facMetgenera;
	}
	
	@JsonProperty("facMetgenera")
	public void setFacMetgenera(String facMetgenera){
		this.facMetgenera = facMetgenera;
	}
		
	@JsonProperty("facEstado")
	public String getFacEstado(){
		return this.facEstado;
	}
	
	@JsonProperty("facEstado")
	public void setFacEstado(String facEstado){
		this.facEstado = facEstado;
	}
		
	@JsonProperty("facFecha")
	public Date getFacFecha(){
		return this.facFecha;
	}
	
	@JsonProperty("facFecha")
	public void setFacFecha(Date facFecha){
		this.facFecha = facFecha;
	}
		
	@JsonProperty("facIdeactual")
	public Long getFacIdeactual(){
		return this.facIdeactual;
	}
	
	@JsonProperty("facIdeactual")
	public void setFacIdeactual(Long facIdeactual){
		this.facIdeactual = facIdeactual;
	}
		
	@JsonProperty("facIdepadre")
	public Long getFacIdepadre(){
		return this.facIdepadre;
	}
	
	@JsonProperty("facIdepadre")
	public void setFacIdepadre(Long facIdepadre){
		this.facIdepadre = facIdepadre;
	}
		
	@JsonProperty("facFecaprobada")
	public Date getFacFecaprobada(){
		return this.facFecaprobada;
	}
	
	@JsonProperty("facFecaprobada")
	public void setFacFecaprobada(Date facFecaprobada){
		this.facFecaprobada = facFecaprobada;
	}
		
	@JsonProperty("facFeceliminad")
	public Date getFacFeceliminad(){
		return this.facFeceliminad;
	}
	
	@JsonProperty("facFeceliminad")
	public void setFacFeceliminad(Date facFeceliminad){
		this.facFeceliminad = facFeceliminad;
	}
		
	@JsonProperty("facFecfinancia")
	public Date getFacFecfinancia(){
		return this.facFecfinancia;
	}
	
	@JsonProperty("facFecfinancia")
	public void setFacFecfinancia(Date facFecfinancia){
		this.facFecfinancia = facFecfinancia;
	}
		
	@JsonProperty("facFeccastigad")
	public Date getFacFeccastigad(){
		return this.facFeccastigad;
	}
	
	@JsonProperty("facFeccastigad")
	public void setFacFeccastigad(Date facFeccastigad){
		this.facFeccastigad = facFeccastigad;
	}
		
	@JsonProperty("facFecvence")
	public Date getFacFecvence(){
		return this.facFecvence;
	}
	
	@JsonProperty("facFecvence")
	public void setFacFecvence(Date facFecvence){
		this.facFecvence = facFecvence;
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
		
	@JsonProperty("dsusIderegistr")
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	@JsonProperty("dsusIderegistr")
	public void setDsusIderegistr(Long dsusIderegistr){
		this.dsusIderegistr = dsusIderegistr;
	}
		
	@JsonProperty("uniTipsuscripc")
	public Integer getUniTipsuscripc(){
		return this.uniTipsuscripc;
	}
	
	@JsonProperty("uniTipsuscripc")
	public void setUniTipsuscripc(Integer uniTipsuscripc){
		this.uniTipsuscripc = uniTipsuscripc;
	}
		
	@JsonProperty("uniTipusosuscr")
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	@JsonProperty("uniTipusosuscr")
	public void setUniTipusosuscr(Integer uniTipusosuscr){
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
		
	@JsonProperty("terIderegistro")
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	@JsonProperty("terIderegistro")
	public void setTerIderegistro(Long terIderegistro){
		this.terIderegistro = terIderegistro;
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
		
	@JsonProperty("amoIderegistro")
	public Long getAmoIderegistro(){
		return this.amoIderegistro;
	}
	
	@JsonProperty("amoIderegistro")
	public void setAmoIderegistro(Long amoIderegistro){
		this.amoIderegistro = amoIderegistro;
	}
		
	@JsonProperty("cicAno")
	public Short getCicAno(){
		return this.cicAno;
	}
	
	@JsonProperty("cicAno")
	public void setCicAno(Short cicAno){
		this.cicAno = cicAno;
	}
		
	@JsonProperty("hliqIderegistr")
	public Long getHliqIderegistr(){
		return this.hliqIderegistr;
	}
	
	@JsonProperty("hliqIderegistr")
	public void setHliqIderegistr(Long hliqIderegistr){
		this.hliqIderegistr = hliqIderegistr;
	}
		
	@JsonProperty("facSdoreal")
	public BigDecimal getFacSdoreal(){
		return this.facSdoreal;
	}
	
	@JsonProperty("facSdoreal")
	public void setFacSdoreal(BigDecimal facSdoreal){
		this.facSdoreal = facSdoreal;
	}
		
	@JsonProperty("facIdeorigen")
	public Long getFacIdeorigen(){
		return this.facIdeorigen;
	}
	
	@JsonProperty("facIdeorigen")
	public void setFacIdeorigen(Long facIdeorigen){
		this.facIdeorigen = facIdeorigen;
	}
		
	@JsonProperty("uniTiptercero")
	public Integer getUniTiptercero(){
		return this.uniTiptercero;
	}
	
	@JsonProperty("uniTiptercero")
	public void setUniTiptercero(Integer uniTiptercero){
		this.uniTiptercero = uniTiptercero;
	}
		
	@JsonProperty("facFecsuspens")
	public Date getFacFecsuspens(){
		return this.facFecsuspens;
	}
	
	@JsonProperty("facFecsuspens")
	public void setFacFecsuspens(Date facFecsuspens){
		this.facFecsuspens = facFecsuspens;
	}
		
	@JsonProperty("finIderegistro")
	public Long getFinIderegistro(){
		return this.finIderegistro;
	}
	
	@JsonProperty("finIderegistro")
	public void setFinIderegistro(Long finIderegistro){
		this.finIderegistro = finIderegistro;
	}
		
	@JsonProperty("facVersion")
	public Integer getFacVersion(){
		return this.facVersion;
	}
	
	@JsonProperty("facVersion")
	public void setFacVersion(Integer facVersion){
		this.facVersion = facVersion;
	}
		
	@JsonProperty("facVlrreal")
	public BigDecimal getFacVlrreal(){
		return this.facVlrreal;
	}
	
	@JsonProperty("facVlrreal")
	public void setFacVlrreal(BigDecimal facVlrreal){
		this.facVlrreal = facVlrreal;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("mviIderegistro")
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	@JsonProperty("mviIderegistro")
	public void setMviIderegistro(Long mviIderegistro){
		this.mviIderegistro = mviIderegistro;
	}
		
	@JsonProperty("facCtrlfelec")
	public Short getFacCtrlfelec(){
		return this.facCtrlfelec;
	}
	
	@JsonProperty("facCtrlfelec")
	public void setFacCtrlfelec(Short facCtrlfelec){
		this.facCtrlfelec = facCtrlfelec;
	}
		
	
    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.facIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.facNumero);
        hash = 37 * hash + Objects.hashCode(this.facMetgenera);
        hash = 37 * hash + Objects.hashCode(this.facEstado);
        hash = 37 * hash + Objects.hashCode(this.facFecha);
        hash = 37 * hash + Objects.hashCode(this.facIdeactual);
        hash = 37 * hash + Objects.hashCode(this.facIdepadre);
        hash = 37 * hash + Objects.hashCode(this.facFecaprobada);
        hash = 37 * hash + Objects.hashCode(this.facFeceliminad);
        hash = 37 * hash + Objects.hashCode(this.facFecfinancia);
        hash = 37 * hash + Objects.hashCode(this.facFeccastigad);
        hash = 37 * hash + Objects.hashCode(this.facFecvence);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.amoIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.hliqIderegistr);
        hash = 37 * hash + Objects.hashCode(this.facSdoreal);
        hash = 37 * hash + Objects.hashCode(this.facIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.uniTiptercero);
        hash = 37 * hash + Objects.hashCode(this.facFecsuspens);
        hash = 37 * hash + Objects.hashCode(this.finIderegistro);
        hash = 37 * hash + Objects.hashCode(this.facVersion);
        hash = 37 * hash + Objects.hashCode(this.facVlrreal);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.facCtrlfelec);
  
        
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
        final FacFacturaDTO other = (FacFacturaDTO) obj;
                
        if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.facNumero, other.facNumero)) {
            return false;
        }
        
        if (!Objects.equals(this.facMetgenera, other.facMetgenera)) {
            return false;
        }
        
        if (!Objects.equals(this.facEstado, other.facEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecha, other.facFecha)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdeactual, other.facIdeactual)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdepadre, other.facIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecaprobada, other.facFecaprobada)) {
            return false;
        }
        
        if (!Objects.equals(this.facFeceliminad, other.facFeceliminad)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecfinancia, other.facFecfinancia)) {
            return false;
        }
        
        if (!Objects.equals(this.facFeccastigad, other.facFeccastigad)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecvence, other.facFecvence)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
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
        
        if (!Objects.equals(this.amoIderegistro, other.amoIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicAno, other.cicAno)) {
            return false;
        }
        
        if (!Objects.equals(this.hliqIderegistr, other.hliqIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.facSdoreal, other.facSdoreal)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdeorigen, other.facIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTiptercero, other.uniTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecsuspens, other.facFecsuspens)) {
            return false;
        }
        
        if (!Objects.equals(this.finIderegistro, other.finIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.facVersion, other.facVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.facVlrreal, other.facVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.facCtrlfelec, other.facCtrlfelec);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

