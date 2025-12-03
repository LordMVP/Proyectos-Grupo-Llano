package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
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
@Table(name="coli_conliquida")
@NamedQuery(name = "ColiConliquida.findAll", query = "SELECT p FROM ColiConliquida p")
public class ColiConliquida implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_COLI_CONLIQUIDA_PK_UNI_CONCEPTO = "coliConliquidaPK.uniConcepto";
	public static final String ENTIDAD_COLI_CONLIQUIDA_PK_UNI_LIQUIDACION = "coliConliquidaPK.uniLiquidacion";
	public static final String ENTIDAD_COLI_CONLIQUIDA_COLI_IMPRIMIR = "coliImprimir";
	public static final String ENTIDAD_COLI_CONLIQUIDA_COLI_IDEREGISTR = "coliIderegistr";
	public static final String ENTIDAD_COLI_CONLIQUIDA_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA
            = {ENTIDAD_COLI_CONLIQUIDA_COLI_IMPRIMIR, ENTIDAD_COLI_CONLIQUIDA_COLI_IDEREGISTR, ENTIDAD_COLI_CONLIQUIDA_PK_UNI_CONCEPTO, ENTIDAD_COLI_CONLIQUIDA_USU_IDEREGISTRO, ENTIDAD_COLI_CONLIQUIDA_PK_UNI_LIQUIDACION};

	@EmbeddedId
	private ColiConliquidaPK coliConliquidaPK;

	@Column(name="coli_imprimir")
	@Size(min=0, max= 1)
	private String coliImprimir;
	
	@Column(name="coli_ideregistr")
	private Integer coliIderegistr;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	

	@ManyToOne
	@JoinColumn(name="uni_concepto", referencedColumnName="uni_concepto", insertable = false, updatable = false)
	@PodamExclude
    private ConConcepto conConceptocoliConliquidaUniConceptoFkey;
    
		
	@ManyToOne
	@JoinColumn(name="uni_liquidacion", referencedColumnName="uni_liquidacion", insertable = false, updatable = false)
	@PodamExclude
    private LiqLiquidacion liqLiquidacioncoliConliquidaUniLiquidacionFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ColiConliquida(){
		coliConliquidaPK = new ColiConliquidaPK();
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public ColiConliquidaPK getColiConliquidaPK(){
		return this.coliConliquidaPK;
	}
	
	public void setColiConliquidaPK(ColiConliquidaPK coliConliquidaPK){
		this.coliConliquidaPK   = coliConliquidaPK ;
	}  
	
	public String getColiImprimir(){
		return this.coliImprimir;
	}
	
	public void setColiImprimir(String coliImprimir){
	
		this.coliImprimir = coliImprimir;
	}
		
	public Integer getColiIderegistr(){
		return this.coliIderegistr;
	}
	
	public void setColiIderegistr(Integer coliIderegistr){
	
		this.coliIderegistr = coliIderegistr;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		

    public ConConcepto getConConceptocoliConliquidaUniConceptoFkey(){
		return this.conConceptocoliConliquidaUniConceptoFkey; 
	}
	
	public void setConConceptocoliConliquidaUniConceptoFkey(ConConcepto conConceptocoliConliquidaUniConceptoFkey){
		this.conConceptocoliConliquidaUniConceptoFkey = conConceptocoliConliquidaUniConceptoFkey;
	}
    public LiqLiquidacion getLiqLiquidacioncoliConliquidaUniLiquidacionFkey(){
		return this.liqLiquidacioncoliConliquidaUniLiquidacionFkey; 
	}
	
	public void setLiqLiquidacioncoliConliquidaUniLiquidacionFkey(LiqLiquidacion liqLiquidacioncoliConliquidaUniLiquidacionFkey){
		this.liqLiquidacioncoliConliquidaUniLiquidacionFkey = liqLiquidacioncoliConliquidaUniLiquidacionFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadColiConliquida() {
		return ATRIBUTOS_ENTIDAD_COLI_CONLIQUIDA;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.coliConliquidaPK);        
        hash = 37 * hash + Objects.hashCode(this.coliImprimir);
        hash = 37 * hash + Objects.hashCode(this.coliIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ColiConliquida que se pasa
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
        final ColiConliquida other = (ColiConliquida) obj;
        
        if (!Objects.equals(this.coliConliquidaPK, other.coliConliquidaPK)) {
            return false;
        }
        
        if (!Objects.equals(this.coliImprimir, other.coliImprimir)) {
            return false;
        }
        
        if (!Objects.equals(this.coliIderegistr, other.coliIderegistr)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

