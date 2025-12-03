package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad DsusDetsuscripDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class DsusDetsuscripDTO implements Serializable{	

	
	private Long dsusIderegistr;

	private String dsusEstado;
	
	private String dsusDescripcion;
	
	private String dsusPcodigo;
	
	private Long susIderegistro;
	
	private Long terIderegistro;
	
	private Long proIderegistro;
	
	private Integer uniMunicipio;
	
	private Integer uniBarrio;
	
	private Integer estTipsuscripc;
	
	private Integer uniTipsuscripc;
	
	private Integer estTipusosuscr;
	
	private Integer uniTipusosuscr;
	
	private Integer empIderegistro;
	
	private Integer estLiquidacion;
	
	private Integer uniLiquidacion;
	
	private Integer cicIderegistro;
	
	private Date dsusFecinicio;
	
	private Date dsusFecexpira;
	
	private Short proCatestrato;
	
	private Date dsusIniestado;
	
	private Date dsusFinestado;
	
	private BigDecimal dsusFactor;
	
	private Integer usuIderegistro;
	
	private Integer uniActsuscripc;
	
	private String dsusResolestrato;
	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DsusDetsuscripDTO(){
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
	
	@JsonProperty("dsusEstado")
	public String getDsusEstado(){
		return this.dsusEstado;
	}
	
	@JsonProperty("dsusEstado")
	public void setDsusEstado(String dsusEstado){
		this.dsusEstado = dsusEstado;
	}
		
	@JsonProperty("dsusDescripcion")
	public String getDsusDescripcion(){
		return this.dsusDescripcion;
	}
	
	@JsonProperty("dsusDescripcion")
	public void setDsusDescripcion(String dsusDescripcion){
		this.dsusDescripcion = dsusDescripcion;
	}
		
	@JsonProperty("dsusPcodigo")
	public String getDsusPcodigo(){
		return this.dsusPcodigo;
	}
	
	@JsonProperty("dsusPcodigo")
	public void setDsusPcodigo(String dsusPcodigo){
		this.dsusPcodigo = dsusPcodigo;
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
		
	@JsonProperty("proIderegistro")
	public Long getProIderegistro(){
		return this.proIderegistro;
	}
	
	@JsonProperty("proIderegistro")
	public void setProIderegistro(Long proIderegistro){
		this.proIderegistro = proIderegistro;
	}
		
	@JsonProperty("uniMunicipio")
	public Integer getUniMunicipio(){
		return this.uniMunicipio;
	}
	
	@JsonProperty("uniMunicipio")
	public void setUniMunicipio(Integer uniMunicipio){
		this.uniMunicipio = uniMunicipio;
	}
		
	@JsonProperty("uniBarrio")
	public Integer getUniBarrio(){
		return this.uniBarrio;
	}
	
	@JsonProperty("uniBarrio")
	public void setUniBarrio(Integer uniBarrio){
		this.uniBarrio = uniBarrio;
	}
		
	@JsonProperty("estTipsuscripc")
	public Integer getEstTipsuscripc(){
		return this.estTipsuscripc;
	}
	
	@JsonProperty("estTipsuscripc")
	public void setEstTipsuscripc(Integer estTipsuscripc){
		this.estTipsuscripc = estTipsuscripc;
	}
		
	@JsonProperty("uniTipsuscripc")
	public Integer getUniTipsuscripc(){
		return this.uniTipsuscripc;
	}
	
	@JsonProperty("uniTipsuscripc")
	public void setUniTipsuscripc(Integer uniTipsuscripc){
		this.uniTipsuscripc = uniTipsuscripc;
	}
		
	@JsonProperty("estTipusosuscr")
	public Integer getEstTipusosuscr(){
		return this.estTipusosuscr;
	}
	
	@JsonProperty("estTipusosuscr")
	public void setEstTipusosuscr(Integer estTipusosuscr){
		this.estTipusosuscr = estTipusosuscr;
	}
		
	@JsonProperty("uniTipusosuscr")
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	@JsonProperty("uniTipusosuscr")
	public void setUniTipusosuscr(Integer uniTipusosuscr){
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	@JsonProperty("empIderegistro")
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	@JsonProperty("empIderegistro")
	public void setEmpIderegistro(Integer empIderegistro){
		this.empIderegistro = empIderegistro;
	}
		
	@JsonProperty("estLiquidacion")
	public Integer getEstLiquidacion(){
		return this.estLiquidacion;
	}
	
	@JsonProperty("estLiquidacion")
	public void setEstLiquidacion(Integer estLiquidacion){
		this.estLiquidacion = estLiquidacion;
	}
		
	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion){
		this.uniLiquidacion = uniLiquidacion;
	}
		
	@JsonProperty("cicIderegistro")
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	@JsonProperty("cicIderegistro")
	public void setCicIderegistro(Integer cicIderegistro){
		this.cicIderegistro = cicIderegistro;
	}
		
	@JsonProperty("dsusFecinicio")
	public Date getDsusFecinicio(){
		return this.dsusFecinicio;
	}
	
	@JsonProperty("dsusFecinicio")
	public void setDsusFecinicio(Date dsusFecinicio){
		this.dsusFecinicio = dsusFecinicio;
	}
		
	@JsonProperty("dsusFecexpira")
	public Date getDsusFecexpira(){
		return this.dsusFecexpira;
	}
	
	@JsonProperty("dsusFecexpira")
	public void setDsusFecexpira(Date dsusFecexpira){
		this.dsusFecexpira = dsusFecexpira;
	}
		
	@JsonProperty("proCatestrato")
	public Short getProCatestrato(){
		return this.proCatestrato;
	}
	
	@JsonProperty("proCatestrato")
	public void setProCatestrato(Short proCatestrato){
		this.proCatestrato = proCatestrato;
	}
		
	@JsonProperty("dsusIniestado")
	public Date getDsusIniestado(){
		return this.dsusIniestado;
	}
	
	@JsonProperty("dsusIniestado")
	public void setDsusIniestado(Date dsusIniestado){
		this.dsusIniestado = dsusIniestado;
	}
		
	@JsonProperty("dsusFinestado")
	public Date getDsusFinestado(){
		return this.dsusFinestado;
	}
	
	@JsonProperty("dsusFinestado")
	public void setDsusFinestado(Date dsusFinestado){
		this.dsusFinestado = dsusFinestado;
	}
		
	@JsonProperty("dsusFactor")
	public BigDecimal getDsusFactor(){
		return this.dsusFactor;
	}
	
	@JsonProperty("dsusFactor")
	public void setDsusFactor(BigDecimal dsusFactor){
		this.dsusFactor = dsusFactor;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("uniActsuscripc")
	public Integer getUniActsuscripc(){
		return this.uniActsuscripc;
	}
	
	@JsonProperty("uniActsuscripc")
	public void setUniActsuscripc(Integer uniActsuscripc){
		this.uniActsuscripc = uniActsuscripc;
	}
		
	@JsonProperty("dsusResolestrato")
	public String getDsusResolestrato(){
		return this.dsusResolestrato;
	}
	
	@JsonProperty("dsusResolestrato")
	public void setDsusResolestrato(String dsusResolestrato){
		this.dsusResolestrato = dsusResolestrato;
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
        hash = 37 * hash + Objects.hashCode(this.dsusEstado);
        hash = 37 * hash + Objects.hashCode(this.dsusDescripcion);
        hash = 37 * hash + Objects.hashCode(this.dsusPcodigo);
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.proIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
        hash = 37 * hash + Objects.hashCode(this.uniBarrio);
        hash = 37 * hash + Objects.hashCode(this.estTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.estTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.estLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dsusFecinicio);
        hash = 37 * hash + Objects.hashCode(this.dsusFecexpira);
        hash = 37 * hash + Objects.hashCode(this.proCatestrato);
        hash = 37 * hash + Objects.hashCode(this.dsusIniestado);
        hash = 37 * hash + Objects.hashCode(this.dsusFinestado);
        hash = 37 * hash + Objects.hashCode(this.dsusFactor);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniActsuscripc);
        hash = 37 * hash + Objects.hashCode(this.dsusResolestrato);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DsusDetsuscripDTO que se pasa
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
        final DsusDetsuscripDTO other = (DsusDetsuscripDTO) obj;
                
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusEstado, other.dsusEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusDescripcion, other.dsusDescripcion)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusPcodigo, other.dsusPcodigo)) {
            return false;
        }
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.proIderegistro, other.proIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
            return false;
        }
        
        if (!Objects.equals(this.uniBarrio, other.uniBarrio)) {
            return false;
        }
        
        if (!Objects.equals(this.estTipsuscripc, other.estTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.estTipusosuscr, other.estTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.estLiquidacion, other.estLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusFecinicio, other.dsusFecinicio)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusFecexpira, other.dsusFecexpira)) {
            return false;
        }
        
        if (!Objects.equals(this.proCatestrato, other.proCatestrato)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIniestado, other.dsusIniestado)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusFinestado, other.dsusFinestado)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusFactor, other.dsusFactor)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniActsuscripc, other.uniActsuscripc)) {
            return false;
        }
        
        return Objects.equals(this.dsusResolestrato, other.dsusResolestrato);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

