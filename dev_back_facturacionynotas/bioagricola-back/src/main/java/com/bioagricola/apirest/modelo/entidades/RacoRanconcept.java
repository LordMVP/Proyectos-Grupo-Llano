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
@Table(name="raco_ranconcept")
@NamedQuery(name = "RacoRanconcept.findAll", query = "SELECT p FROM RacoRanconcept p")
public class RacoRanconcept implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_RACO_RANCONCEPT_PK = "racoIderegistr";
	public static final String ENTIDAD_RACO_RANCONCEPT_UNI_CONCEPTO = "uniConcepto";
	public static final String ENTIDAD_RACO_RANCONCEPT_RACO_RANINICIAL = "racoRaninicial";
	public static final String ENTIDAD_RACO_RANCONCEPT_RACO_RANFINAL = "racoRanfinal";
	public static final String ENTIDAD_RACO_RANCONCEPT_RACO_VALOR = "racoValor";
	public static final String ENTIDAD_RACO_RANCONCEPT_RACO_FORMULA = "racoFormula";
	public static final String ENTIDAD_RACO_RANCONCEPT_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_RACO_RANCONCEPT
            = {ENTIDAD_RACO_RANCONCEPT_RACO_RANINICIAL, ENTIDAD_RACO_RANCONCEPT_RACO_VALOR, ENTIDAD_RACO_RANCONCEPT_PK, ENTIDAD_RACO_RANCONCEPT_USU_IDEREGISTRO, ENTIDAD_RACO_RANCONCEPT_UNI_CONCEPTO, ENTIDAD_RACO_RANCONCEPT_RACO_RANFINAL, ENTIDAD_RACO_RANCONCEPT_RACO_FORMULA};

	@Id
    @Column(name="raco_ideregistr")
	private Integer racoIderegistr;

	@Column(name="uni_concepto")
	private Integer uniConcepto;
	
	@Column(name="raco_raninicial")
	private BigDecimal racoRaninicial;
	
	@Column(name="raco_ranfinal")
	private BigDecimal racoRanfinal;
	
	@Column(name="raco_valor")
	private BigDecimal racoValor;
	
	@Column(name="raco_formula")
	private String racoFormula;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	


	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RacoRanconcept(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getRacoIderegistr(){
		return this.racoIderegistr;
	}
	
	public void setRacoIderegistr(Integer racoIderegistr){
	
		this.racoIderegistr = racoIderegistr;
	}
	
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	public void setUniConcepto(Integer uniConcepto){
	
		this.uniConcepto = uniConcepto;
	}
		
	public BigDecimal getRacoRaninicial(){
		return this.racoRaninicial;
	}
	
	public void setRacoRaninicial(BigDecimal racoRaninicial){
	
		this.racoRaninicial = racoRaninicial;
	}
		
	public BigDecimal getRacoRanfinal(){
		return this.racoRanfinal;
	}
	
	public void setRacoRanfinal(BigDecimal racoRanfinal){
	
		this.racoRanfinal = racoRanfinal;
	}
		
	public BigDecimal getRacoValor(){
		return this.racoValor;
	}
	
	public void setRacoValor(BigDecimal racoValor){
	
		this.racoValor = racoValor;
	}
		
	public String getRacoFormula(){
		return this.racoFormula;
	}
	
	public void setRacoFormula(String racoFormula){
	
		this.racoFormula = racoFormula;
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
        for (final String atr : ATRIBUTOS_ENTIDAD_RACO_RANCONCEPT) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadRacoRanconcept() {
		return ATRIBUTOS_ENTIDAD_RACO_RANCONCEPT;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.racoIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.racoRaninicial);
        hash = 37 * hash + Objects.hashCode(this.racoRanfinal);
        hash = 37 * hash + Objects.hashCode(this.racoValor);
        hash = 37 * hash + Objects.hashCode(this.racoFormula);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad RacoRanconcept que se pasa
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
        final RacoRanconcept other = (RacoRanconcept) obj;
        
        if (!Objects.equals(this.racoIderegistr, other.racoIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.racoRaninicial, other.racoRaninicial)) {
            return false;
        }
        
        if (!Objects.equals(this.racoRanfinal, other.racoRanfinal)) {
            return false;
        }
        
        if (!Objects.equals(this.racoValor, other.racoValor)) {
            return false;
        }
        
        if (!Objects.equals(this.racoFormula, other.racoFormula)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

