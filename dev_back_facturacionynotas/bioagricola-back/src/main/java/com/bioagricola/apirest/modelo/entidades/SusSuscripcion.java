package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="sus_suscripcion")
@NamedQuery(name = "SusSuscripcion.findAll", query = "SELECT p FROM SusSuscripcion p")
public class SusSuscripcion implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_SUS_SUSCRIPCION_PK = "susIderegistro";
	public static final String ENTIDAD_SUS_SUSCRIPCION_TER_IDEREGISTRO = "terIderegistro";
	public static final String ENTIDAD_SUS_SUSCRIPCION_CNRE_IDEREGISTR = "cnreIderegistr";
	public static final String ENTIDAD_SUS_SUSCRIPCION_SUS_MODCONVENIO = "susModconvenio";
	public static final String ENTIDAD_SUS_SUSCRIPCION_SUS_DESCRIPCION = "susDescripcion";
	public static final String ENTIDAD_SUS_SUSCRIPCION_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_SUS_SUSCRIPCION
            = {ENTIDAD_SUS_SUSCRIPCION_TER_IDEREGISTRO, ENTIDAD_SUS_SUSCRIPCION_PK, ENTIDAD_SUS_SUSCRIPCION_SUS_MODCONVENIO, ENTIDAD_SUS_SUSCRIPCION_CNRE_IDEREGISTR, ENTIDAD_SUS_SUSCRIPCION_SUS_DESCRIPCION, ENTIDAD_SUS_SUSCRIPCION_USU_IDEREGISTRO};

	@Id
    @Column(name="sus_ideregistro")
	private Long susIderegistro;

	@Column(name="ter_ideregistro")
	private Long terIderegistro;
	
    @PodamExclude
	@Column(name="cnre_ideregistr")
	private Integer cnreIderegistr;
	
	@Column(name="sus_modconvenio")
	@Size(min=0, max= 1)
	private String susModconvenio;
	
	@Column(name="sus_descripcion")
	@Size(min=0, max= 150)
	private String susDescripcion;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	

	@ManyToOne
	@JoinColumn(name="cnre_ideregistr", referencedColumnName="cnre_ideregistr", insertable = false, updatable = false)
	@PodamExclude
    private CnreCnvrecaudo cnreCnvrecaudosusSuscripcionCnreIderegistrFkey;
    
		
	@OneToMany(mappedBy="susSuscripciondsusDetsuscripSusIderegistroFkey")
	@PodamExclude
    private List<DsusDetsuscrip> dsusDetsuscripSusIderegistroFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public SusSuscripcion(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getSusIderegistro(){
		return this.susIderegistro;
	}
	
	public void setSusIderegistro(Long susIderegistro){
	
		this.susIderegistro = susIderegistro;
	}
	
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	public void setTerIderegistro(Long terIderegistro){
	
		this.terIderegistro = terIderegistro;
	}
		
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	public void setCnreIderegistr(Integer cnreIderegistr){
	
		this.cnreIderegistr = cnreIderegistr;
	}
		
	public String getSusModconvenio(){
		return this.susModconvenio;
	}
	
	public void setSusModconvenio(String susModconvenio){
	
		this.susModconvenio = susModconvenio;
	}
		
	public String getSusDescripcion(){
		return this.susDescripcion;
	}
	
	public void setSusDescripcion(String susDescripcion){
	
		this.susDescripcion = susDescripcion;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		

    public List<DsusDetsuscrip> getDsusDetsuscripSusIderegistroFkeyesList(){
		return this.dsusDetsuscripSusIderegistroFkeyes;
	}
	
	public void setDsusDetsuscripSusIderegistroFkeyesList(List<DsusDetsuscrip> dsusDetsuscripSusIderegistroFkeyes){
		this.dsusDetsuscripSusIderegistroFkeyes = dsusDetsuscripSusIderegistroFkeyes;
	}
			
    public CnreCnvrecaudo getCnreCnvrecaudosusSuscripcionCnreIderegistrFkey(){
		return this.cnreCnvrecaudosusSuscripcionCnreIderegistrFkey; 
	}
	
	public void setCnreCnvrecaudosusSuscripcionCnreIderegistrFkey(CnreCnvrecaudo cnreCnvrecaudosusSuscripcionCnreIderegistrFkey){
		this.cnreCnvrecaudosusSuscripcionCnreIderegistrFkey = cnreCnvrecaudosusSuscripcionCnreIderegistrFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_SUS_SUSCRIPCION) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadSusSuscripcion() {
		return ATRIBUTOS_ENTIDAD_SUS_SUSCRIPCION;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.susModconvenio);
        hash = 37 * hash + Objects.hashCode(this.susDescripcion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad SusSuscripcion que se pasa
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
        final SusSuscripcion other = (SusSuscripcion) obj;
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.susModconvenio, other.susModconvenio)) {
            return false;
        }
        
        if (!Objects.equals(this.susDescripcion, other.susDescripcion)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

