package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="liag_liqagenda")
@NamedQuery(name = "LiagLiqagenda.findAll", query = "SELECT p FROM LiagLiqagenda p")
public class LiagLiqagenda implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_LIAG_LIQAGENDA_PK = "liagIderegistr";
	public static final String ENTIDAD_LIAG_LIQAGENDA_AGENDA_IDEREGISTRO = "agendaIderegistro";
	public static final String ENTIDAD_LIAG_LIQAGENDA_UNI_LIQUIDACION = "uniLiquidacion";
    private static final String[] ATRIBUTOS_ENTIDAD_LIAG_LIQAGENDA
            = {ENTIDAD_LIAG_LIQAGENDA_AGENDA_IDEREGISTRO, ENTIDAD_LIAG_LIQAGENDA_UNI_LIQUIDACION, ENTIDAD_LIAG_LIQAGENDA_PK};

	@Id
    @Column(name="liag_ideregistr")
	private Integer liagIderegistr;

	@Column(name="agenda_ideregistro")
	private Integer agendaIderegistro;
	
    @PodamExclude
	@Column(name="uni_liquidacion")
	private Integer uniLiquidacion;
	

	@ManyToOne
	@JoinColumn(name="uni_liquidacion", referencedColumnName="uni_liquidacion", insertable = false, updatable = false)
	@PodamExclude
    private LiqLiquidacion liqLiquidacionliagLiqagendaUniLiquidacionFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiagLiqagenda(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getLiagIderegistr(){
		return this.liagIderegistr;
	}
	
	public void setLiagIderegistr(Integer liagIderegistr){
	
		this.liagIderegistr = liagIderegistr;
	}
	
	public Integer getAgendaIderegistro(){
		return this.agendaIderegistro;
	}
	
	public void setAgendaIderegistro(Integer agendaIderegistro){
	
		this.agendaIderegistro = agendaIderegistro;
	}
		
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	public void setUniLiquidacion(Integer uniLiquidacion){
	
		this.uniLiquidacion = uniLiquidacion;
	}
		

    public LiqLiquidacion getLiqLiquidacionliagLiqagendaUniLiquidacionFkey(){
		return this.liqLiquidacionliagLiqagendaUniLiquidacionFkey; 
	}
	
	public void setLiqLiquidacionliagLiqagendaUniLiquidacionFkey(LiqLiquidacion liqLiquidacionliagLiqagendaUniLiquidacionFkey){
		this.liqLiquidacionliagLiqagendaUniLiquidacionFkey = liqLiquidacionliagLiqagendaUniLiquidacionFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_LIAG_LIQAGENDA) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadLiagLiqagenda() {
		return ATRIBUTOS_ENTIDAD_LIAG_LIQAGENDA;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.liagIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.agendaIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiagLiqagenda que se pasa
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
        final LiagLiqagenda other = (LiagLiqagenda) obj;
        
        if (!Objects.equals(this.liagIderegistr, other.liagIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.agendaIderegistro, other.agendaIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.uniLiquidacion, other.uniLiquidacion);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

