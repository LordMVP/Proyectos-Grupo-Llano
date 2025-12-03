package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="dicn_disconven")
@NamedQuery(name = "DicnDisconven.findAll", query = "SELECT p FROM DicnDisconven p")
public class DicnDisconven implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_DICN_DISCONVEN_PK = "dicnIderegistr";
	public static final String ENTIDAD_DICN_DISCONVEN_CNRE_IDEREGISTR = "cnreIderegistr";
	public static final String ENTIDAD_DICN_DISCONVEN_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_DICN_DISCONVEN_UNI_TIPSUSCRIPC = "uniTipsuscripc";
	public static final String ENTIDAD_DICN_DISCONVEN_DICN_VALOR = "dicnValor";
	public static final String ENTIDAD_DICN_DISCONVEN_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_DICN_DISCONVEN_DICN_PAGPRIORIDAD = "dicnPagprioridad";
	public static final String ENTIDAD_DICN_DISCONVEN_DICN_PROPRIORIDAD = "dicnProprioridad";
	public static final String ENTIDAD_DICN_DISCONVEN_DICN_EMPFACTURA = "dicnEmpfactura";
    private static final String[] ATRIBUTOS_ENTIDAD_DICN_DISCONVEN
            = {ENTIDAD_DICN_DISCONVEN_DICN_EMPFACTURA, ENTIDAD_DICN_DISCONVEN_USU_IDEREGISTRO, ENTIDAD_DICN_DISCONVEN_PK, ENTIDAD_DICN_DISCONVEN_CNRE_IDEREGISTR, ENTIDAD_DICN_DISCONVEN_UNI_TIPSUSCRIPC, ENTIDAD_DICN_DISCONVEN_DICN_PROPRIORIDAD, ENTIDAD_DICN_DISCONVEN_DICN_VALOR, ENTIDAD_DICN_DISCONVEN_EMP_IDEREGISTRO, ENTIDAD_DICN_DISCONVEN_DICN_PAGPRIORIDAD};

	@Id
    @Column(name="dicn_ideregistr")
	private Integer dicnIderegistr;

    @PodamExclude
	@Column(name="cnre_ideregistr")
	private Integer cnreIderegistr;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="uni_tipsuscripc")
	private Integer uniTipsuscripc;
	
	@Column(name="dicn_valor")
	private BigDecimal dicnValor;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="dicn_pagprioridad")
	private Short dicnPagprioridad;
	
	@Column(name="dicn_proprioridad")
	private Short dicnProprioridad;
	
	@Column(name="dicn_empfactura")
	@Size(min=0, max= 1)
	private String dicnEmpfactura;
	

	@ManyToOne
	@JoinColumn(name="cnre_ideregistr", referencedColumnName="cnre_ideregistr", insertable = false, updatable = false)
	@PodamExclude
    private CnreCnvrecaudo cnreCnvrecaudodicnDisconvenCnreIderegistrFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DicnDisconven(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getDicnIderegistr(){
		return this.dicnIderegistr;
	}
	
	public void setDicnIderegistr(Integer dicnIderegistr){
	
		this.dicnIderegistr = dicnIderegistr;
	}
	
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	public void setCnreIderegistr(Integer cnreIderegistr){
	
		this.cnreIderegistr = cnreIderegistr;
	}
		
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	public void setEmpIderegistro(Integer empIderegistro){
	
		this.empIderegistro = empIderegistro;
	}
		
	public Integer getUniTipsuscripc(){
		return this.uniTipsuscripc;
	}
	
	public void setUniTipsuscripc(Integer uniTipsuscripc){
	
		this.uniTipsuscripc = uniTipsuscripc;
	}
		
	public BigDecimal getDicnValor(){
		return this.dicnValor;
	}
	
	public void setDicnValor(BigDecimal dicnValor){
	
		this.dicnValor = dicnValor;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Short getDicnPagprioridad(){
		return this.dicnPagprioridad;
	}
	
	public void setDicnPagprioridad(Short dicnPagprioridad){
	
		this.dicnPagprioridad = dicnPagprioridad;
	}
		
	public Short getDicnProprioridad(){
		return this.dicnProprioridad;
	}
	
	public void setDicnProprioridad(Short dicnProprioridad){
	
		this.dicnProprioridad = dicnProprioridad;
	}
		
	public String getDicnEmpfactura(){
		return this.dicnEmpfactura;
	}
	
	public void setDicnEmpfactura(String dicnEmpfactura){
	
		this.dicnEmpfactura = dicnEmpfactura;
	}
		

    public CnreCnvrecaudo getCnreCnvrecaudodicnDisconvenCnreIderegistrFkey(){
		return this.cnreCnvrecaudodicnDisconvenCnreIderegistrFkey; 
	}
	
	public void setCnreCnvrecaudodicnDisconvenCnreIderegistrFkey(CnreCnvrecaudo cnreCnvrecaudodicnDisconvenCnreIderegistrFkey){
		this.cnreCnvrecaudodicnDisconvenCnreIderegistrFkey = cnreCnvrecaudodicnDisconvenCnreIderegistrFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_DICN_DISCONVEN) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadDicnDisconven() {
		return ATRIBUTOS_ENTIDAD_DICN_DISCONVEN;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.dicnIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.dicnValor);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dicnPagprioridad);
        hash = 37 * hash + Objects.hashCode(this.dicnProprioridad);
        hash = 37 * hash + Objects.hashCode(this.dicnEmpfactura);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DicnDisconven que se pasa
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
        final DicnDisconven other = (DicnDisconven) obj;
        
        if (!Objects.equals(this.dicnIderegistr, other.dicnIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnValor, other.dicnValor)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnPagprioridad, other.dicnPagprioridad)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnProprioridad, other.dicnProprioridad)) {
            return false;
        }
        
        return Objects.equals(this.dicnEmpfactura, other.dicnEmpfactura);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

