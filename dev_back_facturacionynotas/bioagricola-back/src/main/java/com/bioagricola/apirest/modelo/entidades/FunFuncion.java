package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.Size;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="fun_funcion")
@NamedQuery(name = "FunFuncion.findAll", query = "SELECT p FROM FunFuncion p")
public class FunFuncion implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_FUN_FUNCION_PK = "funNombre";
	public static final String ENTIDAD_FUN_FUNCION_FUN_DESCRIPCION = "funDescripcion";
	public static final String ENTIDAD_FUN_FUNCION_FUN_UBICACION = "funUbicacion";
	public static final String ENTIDAD_FUN_FUNCION_FUN_TIPO = "funTipo";
	public static final String ENTIDAD_FUN_FUNCION_FUN_IDEREGISTRO = "funIderegistro";
	public static final String ENTIDAD_FUN_FUNCION_FUN_PARAMETRO = "funParametro";
	public static final String ENTIDAD_FUN_FUNCION_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_FUN_FUNCION_FUN_SQL = "funSql";
	public static final String ENTIDAD_FUN_FUNCION_FUN_CLASE = "funClase";
    private static final String[] ATRIBUTOS_ENTIDAD_FUN_FUNCION
            = {ENTIDAD_FUN_FUNCION_FUN_TIPO, ENTIDAD_FUN_FUNCION_FUN_IDEREGISTRO, ENTIDAD_FUN_FUNCION_USU_IDEREGISTRO, ENTIDAD_FUN_FUNCION_FUN_SQL, ENTIDAD_FUN_FUNCION_FUN_PARAMETRO, ENTIDAD_FUN_FUNCION_FUN_CLASE, ENTIDAD_FUN_FUNCION_FUN_DESCRIPCION, ENTIDAD_FUN_FUNCION_FUN_UBICACION, ENTIDAD_FUN_FUNCION_PK};

	@Id
    @Column(name="fun_nombre")
	@Size(min=0, max= 255)
	private String funNombre;

	@Column(name="fun_descripcion")
	private String funDescripcion;
	
	@Column(name="fun_ubicacion")
	@Size(min=0, max= 255)
	private String funUbicacion;
	
	@Column(name="fun_tipo")
	@Size(min=0, max= 1)
	private String funTipo;
	
	@Column(name="fun_ideregistro")
	private Integer funIderegistro;
	
	@Column(name="fun_parametro")
	private Short funParametro;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="fun_sql")
	private String funSql;
	
	@Column(name="fun_clase")
	@Size(min=0, max= 1)
	private String funClase;
	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public FunFuncion(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public String getFunNombre(){
		return this.funNombre;
	}
	
	public void setFunNombre(String funNombre){
	
		this.funNombre = funNombre;
	}
	
	public String getFunDescripcion(){
		return this.funDescripcion;
	}
	
	public void setFunDescripcion(String funDescripcion){
	
		this.funDescripcion = funDescripcion;
	}
		
	public String getFunUbicacion(){
		return this.funUbicacion;
	}
	
	public void setFunUbicacion(String funUbicacion){
	
		this.funUbicacion = funUbicacion;
	}
		
	public String getFunTipo(){
		return this.funTipo;
	}
	
	public void setFunTipo(String funTipo){
	
		this.funTipo = funTipo;
	}
		
	public Integer getFunIderegistro(){
		return this.funIderegistro;
	}
	
	public void setFunIderegistro(Integer funIderegistro){
	
		this.funIderegistro = funIderegistro;
	}
		
	public Short getFunParametro(){
		return this.funParametro;
	}
	
	public void setFunParametro(Short funParametro){
	
		this.funParametro = funParametro;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public String getFunSql(){
		return this.funSql;
	}
	
	public void setFunSql(String funSql){
	
		this.funSql = funSql;
	}
		
	public String getFunClase(){
		return this.funClase;
	}
	
	public void setFunClase(String funClase){
	
		this.funClase = funClase;
	}
		


	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_FUN_FUNCION) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadFunFuncion() {
		return ATRIBUTOS_ENTIDAD_FUN_FUNCION;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.funNombre);        
        hash = 37 * hash + Objects.hashCode(this.funDescripcion);
        hash = 37 * hash + Objects.hashCode(this.funUbicacion);
        hash = 37 * hash + Objects.hashCode(this.funTipo);
        hash = 37 * hash + Objects.hashCode(this.funIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funParametro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.funSql);
        hash = 37 * hash + Objects.hashCode(this.funClase);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad FunFuncion que se pasa
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
        final FunFuncion other = (FunFuncion) obj;
        
        if (!Objects.equals(this.funNombre, other.funNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.funDescripcion, other.funDescripcion)) {
            return false;
        }
        
        if (!Objects.equals(this.funUbicacion, other.funUbicacion)) {
            return false;
        }
        
        if (!Objects.equals(this.funTipo, other.funTipo)) {
            return false;
        }
        
        if (!Objects.equals(this.funIderegistro, other.funIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.funParametro, other.funParametro)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.funSql, other.funSql)) {
            return false;
        }
        
        return Objects.equals(this.funClase, other.funClase);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

