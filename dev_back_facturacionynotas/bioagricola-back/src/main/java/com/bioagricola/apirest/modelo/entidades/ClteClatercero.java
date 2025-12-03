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
@Table(name="clte_clatercero")
@NamedQuery(name = "ClteClatercero.findAll", query = "SELECT p FROM ClteClatercero p")
public class ClteClatercero implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CLTE_CLATERCERO_PK = "clteIderegistr";
	public static final String ENTIDAD_CLTE_CLATERCERO_UNI_CLATERCERO = "uniClatercero";
	public static final String ENTIDAD_CLTE_CLATERCERO_TER_IDEREGISTRO = "terIderegistro";
	public static final String ENTIDAD_CLTE_CLATERCERO_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_CLTE_CLATERCERO
            = {ENTIDAD_CLTE_CLATERCERO_TER_IDEREGISTRO, ENTIDAD_CLTE_CLATERCERO_UNI_CLATERCERO, ENTIDAD_CLTE_CLATERCERO_USU_IDEREGISTRO, ENTIDAD_CLTE_CLATERCERO_PK};

	@Id
    @Column(name="clte_ideregistr")
	private Long clteIderegistr;

    @PodamExclude
	@Column(name="uni_clatercero")
	private Integer uniClatercero;
	
    @PodamExclude
	@Column(name="ter_ideregistro")
	private Long terIderegistro;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	

	@ManyToOne
	@JoinColumn(name="ter_ideregistro", referencedColumnName="ter_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private TerTercero terTerceroclteClaterceroTerIderegistroFkey;
    
		
	@ManyToOne
	@JoinColumn(name="uni_clatercero", referencedColumnName="uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private UniUnidad uniUnidadclteClaterceroUniClaterceroFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public ClteClatercero(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getClteIderegistr(){
		return this.clteIderegistr;
	}
	
	public void setClteIderegistr(Long clteIderegistr){
	
		this.clteIderegistr = clteIderegistr;
	}
	
	public Integer getUniClatercero(){
		return this.uniClatercero;
	}
	
	public void setUniClatercero(Integer uniClatercero){
	
		this.uniClatercero = uniClatercero;
	}
		
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	public void setTerIderegistro(Long terIderegistro){
	
		this.terIderegistro = terIderegistro;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		

    public TerTercero getTerTerceroclteClaterceroTerIderegistroFkey(){
		return this.terTerceroclteClaterceroTerIderegistroFkey; 
	}
	
	public void setTerTerceroclteClaterceroTerIderegistroFkey(TerTercero terTerceroclteClaterceroTerIderegistroFkey){
		this.terTerceroclteClaterceroTerIderegistroFkey = terTerceroclteClaterceroTerIderegistroFkey;
	}
    public UniUnidad getUniUnidadclteClaterceroUniClaterceroFkey(){
		return this.uniUnidadclteClaterceroUniClaterceroFkey; 
	}
	
	public void setUniUnidadclteClaterceroUniClaterceroFkey(UniUnidad uniUnidadclteClaterceroUniClaterceroFkey){
		this.uniUnidadclteClaterceroUniClaterceroFkey = uniUnidadclteClaterceroUniClaterceroFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_CLTE_CLATERCERO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadClteClatercero() {
		return ATRIBUTOS_ENTIDAD_CLTE_CLATERCERO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.clteIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.uniClatercero);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad ClteClatercero que se pasa
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
        final ClteClatercero other = (ClteClatercero) obj;
        
        if (!Objects.equals(this.clteIderegistr, other.clteIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniClatercero, other.uniClatercero)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

