package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name="lius_liquso")
@NamedQuery(name = "LiusLiquso.findAll", query = "SELECT p FROM LiusLiquso p")
public class LiusLiquso implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_LIUS_LIQUSO_PK = "liusIderegistr";
	public static final String ENTIDAD_LIUS_LIQUSO_UNI_TIPUSOSUSCR = "uniTipusosuscr";
	public static final String ENTIDAD_LIUS_LIQUSO_UNI_LIQUIDACION = "uniLiquidacion";
	public static final String ENTIDAD_LIUS_LIQUSO_LIUS_DESVIACION = "liusDesviacion";
	public static final String ENTIDAD_LIUS_LIQUSO_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_LIUS_LIQUSO
            = {ENTIDAD_LIUS_LIQUSO_UNI_LIQUIDACION, ENTIDAD_LIUS_LIQUSO_PK, ENTIDAD_LIUS_LIQUSO_UNI_TIPUSOSUSCR, ENTIDAD_LIUS_LIQUSO_LIUS_DESVIACION, ENTIDAD_LIUS_LIQUSO_USU_IDEREGISTRO};

	@Id
    @Column(name="lius_ideregistr")
	private Integer liusIderegistr;

	@Column(name="uni_tipusosuscr")
	private Integer uniTipusosuscr;
	
	@Column(name="uni_liquidacion")
	private Integer uniLiquidacion;
	
	@Column(name="lius_desviacion")
	private BigDecimal liusDesviacion;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiusLiquso(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getLiusIderegistr(){
		return this.liusIderegistr;
	}
	
	public void setLiusIderegistr(Integer liusIderegistr){
	
		this.liusIderegistr = liusIderegistr;
	}
	
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	public void setUniTipusosuscr(Integer uniTipusosuscr){
	
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	public void setUniLiquidacion(Integer uniLiquidacion){
	
		this.uniLiquidacion = uniLiquidacion;
	}
		
	public BigDecimal getLiusDesviacion(){
		return this.liusDesviacion;
	}
	
	public void setLiusDesviacion(BigDecimal liusDesviacion){
	
		this.liusDesviacion = liusDesviacion;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		


	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_LIUS_LIQUSO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadLiusLiquso() {
		return ATRIBUTOS_ENTIDAD_LIUS_LIQUSO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.liusIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.liusDesviacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiusLiquso que se pasa
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
        final LiusLiquso other = (LiusLiquso) obj;
        
        if (!Objects.equals(this.liusIderegistr, other.liusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.liusDesviacion, other.liusDesviacion)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

