package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="core_conrelacio")
@NamedQuery(name = "CoreConrelacio.findAll", query = "SELECT p FROM CoreConrelacio p")
public class CoreConrelacio implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CORE_CONRELACIO_PK = "coreIderegistr";
	public static final String ENTIDAD_CORE_CONRELACIO_UNI_CONCEPTO = "uniConcepto";
	public static final String ENTIDAD_CORE_CONRELACIO_UNI_CONRELACION = "uniConrelacion";
	public static final String ENTIDAD_CORE_CONRELACIO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_CORE_CONRELACIO_FUN_IDEREGISTRO = "funIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_CORE_CONRELACIO
            = {ENTIDAD_CORE_CONRELACIO_UNI_CONRELACION, ENTIDAD_CORE_CONRELACIO_FUN_IDEREGISTRO, ENTIDAD_CORE_CONRELACIO_UNI_CONCEPTO, ENTIDAD_CORE_CONRELACIO_PK, ENTIDAD_CORE_CONRELACIO_USU_IDEREGISTRO};

	@Id
    @Column(name="core_ideregistr")
	private Integer coreIderegistr;

	@Column(name="uni_concepto")
	private Integer uniConcepto;
	
	@Column(name="uni_conrelacion")
	private Integer uniConrelacion;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="fun_ideregistro")
	private Integer funIderegistro;
	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public CoreConrelacio(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getCoreIderegistr(){
		return this.coreIderegistr;
	}
	
	public void setCoreIderegistr(Integer coreIderegistr){
	
		this.coreIderegistr = coreIderegistr;
	}
	
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	public void setUniConcepto(Integer uniConcepto){
	
		this.uniConcepto = uniConcepto;
	}
		
	public Integer getUniConrelacion(){
		return this.uniConrelacion;
	}
	
	public void setUniConrelacion(Integer uniConrelacion){
	
		this.uniConrelacion = uniConrelacion;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Integer getFunIderegistro(){
		return this.funIderegistro;
	}
	
	public void setFunIderegistro(Integer funIderegistro){
	
		this.funIderegistro = funIderegistro;
	}
		


	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_CORE_CONRELACIO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadCoreConrelacio() {
		return ATRIBUTOS_ENTIDAD_CORE_CONRELACIO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.coreIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.uniConrelacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad CoreConrelacio que se pasa
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
        final CoreConrelacio other = (CoreConrelacio) obj;
        
        if (!Objects.equals(this.coreIderegistr, other.coreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConrelacion, other.uniConrelacion)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.funIderegistro, other.funIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

