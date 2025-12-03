package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
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
@Table(name="cnre_cnvrecaudo")
@NamedQuery(name = "CnreCnvrecaudo.findAll", query = "SELECT p FROM CnreCnvrecaudo p")
public class CnreCnvrecaudo implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CNRE_CNVRECAUDO_PK = "cnreIderegistr";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_CNRE_NOMBRE = "cnreNombre";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_CNRE_ESTADO = "cnreEstado";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_CNRE_NUMCONTRAT = "cnreNumcontrat";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_CNRE_TIPDISTRIB = "cnreTipdistrib";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_CNRE_OBLIGA = "cnreObliga";
	public static final String ENTIDAD_CNRE_CNVRECAUDO_USU_IDEREGISTRO = "usuIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_CNRE_CNVRECAUDO
            = {ENTIDAD_CNRE_CNVRECAUDO_USU_IDEREGISTRO, ENTIDAD_CNRE_CNVRECAUDO_PK, ENTIDAD_CNRE_CNVRECAUDO_CNRE_OBLIGA, ENTIDAD_CNRE_CNVRECAUDO_CNRE_ESTADO, ENTIDAD_CNRE_CNVRECAUDO_CNRE_TIPDISTRIB, ENTIDAD_CNRE_CNVRECAUDO_CNRE_NOMBRE, ENTIDAD_CNRE_CNVRECAUDO_CNRE_NUMCONTRAT};

	@Id
    @Column(name="cnre_ideregistr")
	private Integer cnreIderegistr;

	@Column(name="cnre_nombre")
	@Size(min=0, max= 50)
	private String cnreNombre;
	
	@Column(name="cnre_estado")
	@Size(min=0, max= 1)
	private String cnreEstado;
	
	@Column(name="cnre_numcontrat")
	private Integer cnreNumcontrat;
	
	@Column(name="cnre_tipdistrib")
	@Size(min=0, max= 2)
	private String cnreTipdistrib;
	
	@Column(name="cnre_obliga")
	@Size(min=0, max= 1)
	private String cnreObliga;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	

	@OneToMany(mappedBy="cnreCnvrecaudodicnDisconvenCnreIderegistrFkey")
	@PodamExclude
    private List<DicnDisconven> dicnDisconvenCnreIderegistrFkeyes;
	@OneToMany(mappedBy="cnreCnvrecaudosusSuscripcionCnreIderegistrFkey")
	@PodamExclude
    private List<SusSuscripcion> susSuscripcionCnreIderegistrFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public CnreCnvrecaudo(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	public void setCnreIderegistr(Integer cnreIderegistr){
	
		this.cnreIderegistr = cnreIderegistr;
	}
	
	public String getCnreNombre(){
		return this.cnreNombre;
	}
	
	public void setCnreNombre(String cnreNombre){
	
		this.cnreNombre = cnreNombre;
	}
		
	public String getCnreEstado(){
		return this.cnreEstado;
	}
	
	public void setCnreEstado(String cnreEstado){
	
		this.cnreEstado = cnreEstado;
	}
		
	public Integer getCnreNumcontrat(){
		return this.cnreNumcontrat;
	}
	
	public void setCnreNumcontrat(Integer cnreNumcontrat){
	
		this.cnreNumcontrat = cnreNumcontrat;
	}
		
	public String getCnreTipdistrib(){
		return this.cnreTipdistrib;
	}
	
	public void setCnreTipdistrib(String cnreTipdistrib){
	
		this.cnreTipdistrib = cnreTipdistrib;
	}
		
	public String getCnreObliga(){
		return this.cnreObliga;
	}
	
	public void setCnreObliga(String cnreObliga){
	
		this.cnreObliga = cnreObliga;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		

    public List<DicnDisconven> getDicnDisconvenCnreIderegistrFkeyesList(){
		return this.dicnDisconvenCnreIderegistrFkeyes;
	}
	
	public void setDicnDisconvenCnreIderegistrFkeyesList(List<DicnDisconven> dicnDisconvenCnreIderegistrFkeyes){
		this.dicnDisconvenCnreIderegistrFkeyes = dicnDisconvenCnreIderegistrFkeyes;
	}
			
    public List<SusSuscripcion> getSusSuscripcionCnreIderegistrFkeyesList(){
		return this.susSuscripcionCnreIderegistrFkeyes;
	}
	
	public void setSusSuscripcionCnreIderegistrFkeyesList(List<SusSuscripcion> susSuscripcionCnreIderegistrFkeyes){
		this.susSuscripcionCnreIderegistrFkeyes = susSuscripcionCnreIderegistrFkeyes;
	}
			

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_CNRE_CNVRECAUDO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadCnreCnvrecaudo() {
		return ATRIBUTOS_ENTIDAD_CNRE_CNVRECAUDO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.cnreNombre);
        hash = 37 * hash + Objects.hashCode(this.cnreEstado);
        hash = 37 * hash + Objects.hashCode(this.cnreNumcontrat);
        hash = 37 * hash + Objects.hashCode(this.cnreTipdistrib);
        hash = 37 * hash + Objects.hashCode(this.cnreObliga);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad CnreCnvrecaudo que se pasa
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
        final CnreCnvrecaudo other = (CnreCnvrecaudo) obj;
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreNombre, other.cnreNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreEstado, other.cnreEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreNumcontrat, other.cnreNumcontrat)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreTipdistrib, other.cnreTipdistrib)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreObliga, other.cnreObliga)) {
            return false;
        }
        
        return Objects.equals(this.usuIderegistro, other.usuIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

