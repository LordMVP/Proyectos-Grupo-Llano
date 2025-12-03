package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad ConConceptoDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class ConConceptoDTO implements Serializable{	

	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer uniConcepto;

	private Integer estConcepto;
	
	private String conNombre;
	
	private String conAlias;
	
	private String conAbreviatura;
	
	private String conTipcalculo;
	
	private BigDecimal conValor;
	
	private String conFormula;
	
	private String conOperacion;
	
	private String conNaturaleza;
	
	private String conPreliquidar;
	
	private String conAnticipo;
	
	private Short conPagpriori;
	
	private String conFinanciable;
	
	private Byte[] conInivigencia;
	
	private Date conFinvigencia;
	
	private String conEstado;
	
	private Integer prgIderegistro;
	
	private String conTipregistro;
	
	private String conCondonable;
	
	private String conValnulo;
	
	private Integer usuIderegistro;
	
	private Integer funIderegistro;
	
	private String conSuspende;
	
	private String conIntfinanciacion;
	
	private String conMetajuste;
	
	private Short conPrecision;
	
	private String conContabiliza;
	
	private boolean conLiquidaservicio;
	
	private String conPropiedad;
	
	private boolean aprovechamiento;
	
	private boolean incentivoAprovechamiento;

	

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ConConceptoDTO(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	
	@JsonProperty("uniConcepto")
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto){
		this.uniConcepto = uniConcepto;
	}
	
	@JsonProperty("estConcepto")
	public Integer getEstConcepto(){
		return this.estConcepto;
	}
	
	@JsonProperty("estConcepto")
	public void setEstConcepto(Integer estConcepto){
		this.estConcepto = estConcepto;
	}
		
	@JsonProperty("conNombre")
	public String getConNombre(){
		return this.conNombre;
	}
	
	@JsonProperty("conNombre")
	public void setConNombre(String conNombre){
		this.conNombre = conNombre;
	}
		
	@JsonProperty("conAlias")
	public String getConAlias(){
		return this.conAlias;
	}
	
	@JsonProperty("conAlias")
	public void setConAlias(String conAlias){
		this.conAlias = conAlias;
	}
		
	@JsonProperty("conAbreviatura")
	public String getConAbreviatura(){
		return this.conAbreviatura;
	}
	
	@JsonProperty("conAbreviatura")
	public void setConAbreviatura(String conAbreviatura){
		this.conAbreviatura = conAbreviatura;
	}
		
	@JsonProperty("conTipcalculo")
	public String getConTipcalculo(){
		return this.conTipcalculo;
	}
	
	@JsonProperty("conTipcalculo")
	public void setConTipcalculo(String conTipcalculo){
		this.conTipcalculo = conTipcalculo;
	}
		
	@JsonProperty("conValor")
	public BigDecimal getConValor(){
		return this.conValor;
	}
	
	@JsonProperty("conValor")
	public void setConValor(BigDecimal conValor){
		this.conValor = conValor;
	}
		
	@JsonProperty("conFormula")
	public String getConFormula(){
		return this.conFormula;
	}
	
	@JsonProperty("conFormula")
	public void setConFormula(String conFormula){
		this.conFormula = conFormula;
	}
		
	@JsonProperty("conOperacion")
	public String getConOperacion(){
		return this.conOperacion;
	}
	
	@JsonProperty("conOperacion")
	public void setConOperacion(String conOperacion){
		this.conOperacion = conOperacion;
	}
		
	@JsonProperty("conNaturaleza")
	public String getConNaturaleza(){
		return this.conNaturaleza;
	}
	
	@JsonProperty("conNaturaleza")
	public void setConNaturaleza(String conNaturaleza){
		this.conNaturaleza = conNaturaleza;
	}
		
	@JsonProperty("conPreliquidar")
	public String getConPreliquidar(){
		return this.conPreliquidar;
	}
	
	@JsonProperty("conPreliquidar")
	public void setConPreliquidar(String conPreliquidar){
		this.conPreliquidar = conPreliquidar;
	}
		
	@JsonProperty("conAnticipo")
	public String getConAnticipo(){
		return this.conAnticipo;
	}
	
	@JsonProperty("conAnticipo")
	public void setConAnticipo(String conAnticipo){
		this.conAnticipo = conAnticipo;
	}
		
	@JsonProperty("conPagpriori")
	public Short getConPagpriori(){
		return this.conPagpriori;
	}
	
	@JsonProperty("conPagpriori")
	public void setConPagpriori(Short conPagpriori){
		this.conPagpriori = conPagpriori;
	}
		
	@JsonProperty("conFinanciable")
	public String getConFinanciable(){
		return this.conFinanciable;
	}
	
	@JsonProperty("conFinanciable")
	public void setConFinanciable(String conFinanciable){
		this.conFinanciable = conFinanciable;
	}
		
	@JsonProperty("conInivigencia")
	public Byte[] getConInivigencia(){
		return this.conInivigencia;
	}
	
	@JsonProperty("conInivigencia")
	public void setConInivigencia(Byte[] conInivigencia){
		this.conInivigencia = conInivigencia;
	}
		
	@JsonProperty("conFinvigencia")
	public Date getConFinvigencia(){
		return this.conFinvigencia;
	}
	
	@JsonProperty("conFinvigencia")
	public void setConFinvigencia(Date conFinvigencia){
		this.conFinvigencia = conFinvigencia;
	}
		
	@JsonProperty("conEstado")
	public String getConEstado(){
		return this.conEstado;
	}
	
	@JsonProperty("conEstado")
	public void setConEstado(String conEstado){
		this.conEstado = conEstado;
	}
		
	@JsonProperty("prgIderegistro")
	public Integer getPrgIderegistro(){
		return this.prgIderegistro;
	}
	
	@JsonProperty("prgIderegistro")
	public void setPrgIderegistro(Integer prgIderegistro){
		this.prgIderegistro = prgIderegistro;
	}
		
	@JsonProperty("conTipregistro")
	public String getConTipregistro(){
		return this.conTipregistro;
	}
	
	@JsonProperty("conTipregistro")
	public void setConTipregistro(String conTipregistro){
		this.conTipregistro = conTipregistro;
	}
		
	@JsonProperty("conCondonable")
	public String getConCondonable(){
		return this.conCondonable;
	}
	
	@JsonProperty("conCondonable")
	public void setConCondonable(String conCondonable){
		this.conCondonable = conCondonable;
	}
		
	@JsonProperty("conValnulo")
	public String getConValnulo(){
		return this.conValnulo;
	}
	
	@JsonProperty("conValnulo")
	public void setConValnulo(String conValnulo){
		this.conValnulo = conValnulo;
	}
		
	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro){
		this.usuIderegistro = usuIderegistro;
	}
		
	@JsonProperty("funIderegistro")
	public Integer getFunIderegistro(){
		return this.funIderegistro;
	}
	
	@JsonProperty("funIderegistro")
	public void setFunIderegistro(Integer funIderegistro){
		this.funIderegistro = funIderegistro;
	}
		
	@JsonProperty("conSuspende")
	public String getConSuspende(){
		return this.conSuspende;
	}
	
	@JsonProperty("conSuspende")
	public void setConSuspende(String conSuspende){
		this.conSuspende = conSuspende;
	}
		
	@JsonProperty("conIntfinanciacion")
	public String getConIntfinanciacion(){
		return this.conIntfinanciacion;
	}
	
	@JsonProperty("conIntfinanciacion")
	public void setConIntfinanciacion(String conIntfinanciacion){
		this.conIntfinanciacion = conIntfinanciacion;
	}
		
	@JsonProperty("conMetajuste")
	public String getConMetajuste(){
		return this.conMetajuste;
	}
	
	@JsonProperty("conMetajuste")
	public void setConMetajuste(String conMetajuste){
		this.conMetajuste = conMetajuste;
	}
		
	@JsonProperty("conPrecision")
	public Short getConPrecision(){
		return this.conPrecision;
	}
	
	@JsonProperty("conPrecision")
	public void setConPrecision(Short conPrecision){
		this.conPrecision = conPrecision;
	}
		
	@JsonProperty("conContabiliza")
	public String getConContabiliza(){
		return this.conContabiliza;
	}
	
	@JsonProperty("conContabiliza")
	public void setConContabiliza(String conContabiliza){
		this.conContabiliza = conContabiliza;
	}
		
	@JsonProperty("conLiquidaservicio")
	public boolean getConLiquidaservicio(){
		return this.conLiquidaservicio;
	}
	
	@JsonProperty("conLiquidaservicio")
	public void setConLiquidaservicio(boolean conLiquidaservicio){
		this.conLiquidaservicio = conLiquidaservicio;
	}
	
	@JsonProperty("conPropiedad")
    public String getConPropiedad() {
		return conPropiedad;
	}

	@JsonProperty("conPropiedad")
	public void setConPropiedad(String conPropiedad) {
		this.conPropiedad = conPropiedad;
	}
	
	@JsonProperty("aprovechamiento")
	public boolean isAprovechamiento() {
		return aprovechamiento;
	}

	@JsonProperty("aprovechamiento")
	public void setAprovechamiento(boolean aprovechamiento) {
		this.aprovechamiento = aprovechamiento;
	}

	@JsonProperty("incentivoAprovechamiento")
	public boolean isIncentivoAprovechamiento() {
		return incentivoAprovechamiento;
	}

	@JsonProperty("incentivoAprovechamiento")
	public void setIncentivoAprovechamiento(boolean incentivoAprovechamiento) {
		this.incentivoAprovechamiento = incentivoAprovechamiento;
	}



	/**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);        
        hash = 37 * hash + Objects.hashCode(this.estConcepto);
        hash = 37 * hash + Objects.hashCode(this.conNombre);
        hash = 37 * hash + Objects.hashCode(this.conAlias);
        hash = 37 * hash + Objects.hashCode(this.conAbreviatura);
        hash = 37 * hash + Objects.hashCode(this.conTipcalculo);
        hash = 37 * hash + Objects.hashCode(this.conValor);
        hash = 37 * hash + Objects.hashCode(this.conFormula);
        hash = 37 * hash + Objects.hashCode(this.conOperacion);
        hash = 37 * hash + Objects.hashCode(this.conNaturaleza);
        hash = 37 * hash + Objects.hashCode(this.conPreliquidar);
        hash = 37 * hash + Objects.hashCode(this.conAnticipo);
        hash = 37 * hash + Objects.hashCode(this.conPagpriori);
        hash = 37 * hash + Objects.hashCode(this.conFinanciable);
        hash = 37 * hash + Objects.hashCode(this.conInivigencia);
        hash = 37 * hash + Objects.hashCode(this.conFinvigencia);
        hash = 37 * hash + Objects.hashCode(this.conEstado);
        hash = 37 * hash + Objects.hashCode(this.prgIderegistro);
        hash = 37 * hash + Objects.hashCode(this.conTipregistro);
        hash = 37 * hash + Objects.hashCode(this.conCondonable);
        hash = 37 * hash + Objects.hashCode(this.conValnulo);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funIderegistro);
        hash = 37 * hash + Objects.hashCode(this.conSuspende);
        hash = 37 * hash + Objects.hashCode(this.conIntfinanciacion);
        hash = 37 * hash + Objects.hashCode(this.conMetajuste);
        hash = 37 * hash + Objects.hashCode(this.conPrecision);
        hash = 37 * hash + Objects.hashCode(this.conContabiliza);
        hash = 37 * hash + (this.conLiquidaservicio ? 0 : 1);
  
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ConConceptoDTO que se pasa
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
        final ConConceptoDTO other = (ConConceptoDTO) obj;
                
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.estConcepto, other.estConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.conNombre, other.conNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.conAlias, other.conAlias)) {
            return false;
        }
        
        if (!Objects.equals(this.conAbreviatura, other.conAbreviatura)) {
            return false;
        }
        
        if (!Objects.equals(this.conTipcalculo, other.conTipcalculo)) {
            return false;
        }
        
        if (!Objects.equals(this.conValor, other.conValor)) {
            return false;
        }
        
        if (!Objects.equals(this.conFormula, other.conFormula)) {
            return false;
        }
        
        if (!Objects.equals(this.conOperacion, other.conOperacion)) {
            return false;
        }
        
        if (!Objects.equals(this.conNaturaleza, other.conNaturaleza)) {
            return false;
        }
        
        if (!Objects.equals(this.conPreliquidar, other.conPreliquidar)) {
            return false;
        }
        
        if (!Objects.equals(this.conAnticipo, other.conAnticipo)) {
            return false;
        }
        
        if (!Objects.equals(this.conPagpriori, other.conPagpriori)) {
            return false;
        }
        
        if (!Objects.equals(this.conFinanciable, other.conFinanciable)) {
            return false;
        }
        
        if (!Objects.equals(this.conInivigencia, other.conInivigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.conFinvigencia, other.conFinvigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.conEstado, other.conEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.prgIderegistro, other.prgIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.conTipregistro, other.conTipregistro)) {
            return false;
        }
        
        if (!Objects.equals(this.conCondonable, other.conCondonable)) {
            return false;
        }
        
        if (!Objects.equals(this.conValnulo, other.conValnulo)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.funIderegistro, other.funIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.conSuspende, other.conSuspende)) {
            return false;
        }
        
        if (!Objects.equals(this.conIntfinanciacion, other.conIntfinanciacion)) {
            return false;
        }
        
        if (!Objects.equals(this.conMetajuste, other.conMetajuste)) {
            return false;
        }
        
        if (!Objects.equals(this.conPrecision, other.conPrecision)) {
            return false;
        }
        
        if (!Objects.equals(this.conContabiliza, other.conContabiliza)) {
            return false;
        }
        
        return Objects.equals(this.conLiquidaservicio, other.conLiquidaservicio);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

