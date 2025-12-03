package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="ter_tercero")
@NamedQuery(name = "TerTercero.findAll", query = "SELECT p FROM TerTercero p")
public class TerTercero implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_TER_TERCERO_PK = "terIderegistro";
	public static final String ENTIDAD_TER_TERCERO_TER_DOCUMENTO = "terDocumento";
	public static final String ENTIDAD_TER_TERCERO_TER_NOMBRE = "terNombre";
	public static final String ENTIDAD_TER_TERCERO_TER_APELLIDO = "terApellido";
	public static final String ENTIDAD_TER_TERCERO_TER_NOMCOMPLETO = "terNomcompleto";
	public static final String ENTIDAD_TER_TERCERO_TER_SEXO = "terSexo";
	public static final String ENTIDAD_TER_TERCERO_TER_TELCELULAR = "terTelcelular";
	public static final String ENTIDAD_TER_TERCERO_TER_TELFIJO = "terTelfijo";
	public static final String ENTIDAD_TER_TERCERO_EST_TIPTERCERO = "estTiptercero";
	public static final String ENTIDAD_TER_TERCERO_UNI_TIPTERCERO = "uniTiptercero";
	public static final String ENTIDAD_TER_TERCERO_TER_CORREO = "terCorreo";
	public static final String ENTIDAD_TER_TERCERO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_TER_TERCERO_CIUDAD_COD = "ciudadCod";
	public static final String ENTIDAD_TER_TERCERO_TER_DOCEXPEDICION = "terDocexpedicion";
	public static final String ENTIDAD_TER_TERCERO_UNI_TIPIDENTIFICA = "uniTipidentifica";
	public static final String ENTIDAD_TER_TERCERO_TER_FECNACIMIENTO = "terFecnacimiento";
	public static final String ENTIDAD_TER_TERCERO_TER_DIGVERIFICACION = "terDigverificacion";
	public static final String ENTIDAD_TER_TERCERO_TER_INFOADICIONAL = "terInfoadicional";
    private static final String[] ATRIBUTOS_ENTIDAD_TER_TERCERO
            = {ENTIDAD_TER_TERCERO_TER_SEXO, ENTIDAD_TER_TERCERO_TER_TELCELULAR, ENTIDAD_TER_TERCERO_TER_DOCUMENTO, ENTIDAD_TER_TERCERO_TER_DIGVERIFICACION, ENTIDAD_TER_TERCERO_TER_NOMCOMPLETO, ENTIDAD_TER_TERCERO_TER_APELLIDO, ENTIDAD_TER_TERCERO_CIUDAD_COD, ENTIDAD_TER_TERCERO_USU_IDEREGISTRO, ENTIDAD_TER_TERCERO_TER_INFOADICIONAL, ENTIDAD_TER_TERCERO_TER_DOCEXPEDICION, ENTIDAD_TER_TERCERO_EST_TIPTERCERO, ENTIDAD_TER_TERCERO_UNI_TIPIDENTIFICA, ENTIDAD_TER_TERCERO_UNI_TIPTERCERO, ENTIDAD_TER_TERCERO_TER_CORREO, ENTIDAD_TER_TERCERO_TER_NOMBRE, ENTIDAD_TER_TERCERO_PK, ENTIDAD_TER_TERCERO_TER_TELFIJO, ENTIDAD_TER_TERCERO_TER_FECNACIMIENTO};

	@Id
    @Column(name="ter_ideregistro")
	private Long terIderegistro;

	@Column(name="ter_documento")
	@Size(min=0, max= 20)
	private String terDocumento;
	
	@Column(name="ter_nombre")
	@Size(min=0, max= 50)
	private String terNombre;
	
	@Column(name="ter_apellido")
	@Size(min=0, max= 50)
	private String terApellido;
	
	@Column(name="ter_nomcompleto")
	@Size(min=0, max= 101)
	private String terNomcompleto;
	
	@Column(name="ter_sexo")
	@Size(min=0, max= 1)
	private String terSexo;
	
	@Column(name="ter_telcelular")
	@Size(min=0, max= 20)
	private String terTelcelular;
	
	@Column(name="ter_telfijo")
	@Size(min=0, max= 20)
	private String terTelfijo;
	
	@Column(name="est_tiptercero")
	private Integer estTiptercero;
	
	@Column(name="uni_tiptercero")
	private Integer uniTiptercero;
	
	@Column(name="ter_correo")
	@Size(min=0, max= 250)
	private String terCorreo;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="ciudad_cod")
	@Size(min=0, max= 5)
	private String ciudadCod;
	
	@Column(name="ter_docexpedicion")
	private Byte[] terDocexpedicion;
	
	@Column(name="uni_tipidentifica")
	private Integer uniTipidentifica;
	
	@Column(name="ter_fecnacimiento")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date terFecnacimiento;
	
	@Column(name="ter_digverificacion")
	private Short terDigverificacion;
	
	@Column(name="ter_infoadicional")
	@Size(min=0, max= 1)
	private String terInfoadicional;
	

	@OneToMany(mappedBy="terTerceroclteClaterceroTerIderegistroFkey")
	@PodamExclude
    private List<ClteClatercero> clteClaterceroTerIderegistroFkeyes;
	@OneToMany(mappedBy="terTercerodsusDetsuscripTerIderegistroFkey")
	@PodamExclude
    private List<DsusDetsuscrip> dsusDetsuscripTerIderegistroFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public TerTercero(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	public void setTerIderegistro(Long terIderegistro){
	
		this.terIderegistro = terIderegistro;
	}
	
	public String getTerDocumento(){
		return this.terDocumento;
	}
	
	public void setTerDocumento(String terDocumento){
	
		this.terDocumento = terDocumento;
	}
		
	public String getTerNombre(){
		return this.terNombre;
	}
	
	public void setTerNombre(String terNombre){
	
		this.terNombre = terNombre;
	}
		
	public String getTerApellido(){
		return this.terApellido;
	}
	
	public void setTerApellido(String terApellido){
	
		this.terApellido = terApellido;
	}
		
	public String getTerNomcompleto(){
		return this.terNomcompleto;
	}
	
	public void setTerNomcompleto(String terNomcompleto){
	
		this.terNomcompleto = terNomcompleto;
	}
		
	public String getTerSexo(){
		return this.terSexo;
	}
	
	public void setTerSexo(String terSexo){
	
		this.terSexo = terSexo;
	}
		
	public String getTerTelcelular(){
		return this.terTelcelular;
	}
	
	public void setTerTelcelular(String terTelcelular){
	
		this.terTelcelular = terTelcelular;
	}
		
	public String getTerTelfijo(){
		return this.terTelfijo;
	}
	
	public void setTerTelfijo(String terTelfijo){
	
		this.terTelfijo = terTelfijo;
	}
		
	public Integer getEstTiptercero(){
		return this.estTiptercero;
	}
	
	public void setEstTiptercero(Integer estTiptercero){
	
		this.estTiptercero = estTiptercero;
	}
		
	public Integer getUniTiptercero(){
		return this.uniTiptercero;
	}
	
	public void setUniTiptercero(Integer uniTiptercero){
	
		this.uniTiptercero = uniTiptercero;
	}
		
	public String getTerCorreo(){
		return this.terCorreo;
	}
	
	public void setTerCorreo(String terCorreo){
	
		this.terCorreo = terCorreo;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public String getCiudadCod(){
		return this.ciudadCod;
	}
	
	public void setCiudadCod(String ciudadCod){
	
		this.ciudadCod = ciudadCod;
	}
		
	public Byte[] getTerDocexpedicion(){
		return this.terDocexpedicion;
	}
	
	public void setTerDocexpedicion(Byte[] terDocexpedicion){
	
		this.terDocexpedicion = terDocexpedicion;
	}
		
	public Integer getUniTipidentifica(){
		return this.uniTipidentifica;
	}
	
	public void setUniTipidentifica(Integer uniTipidentifica){
	
		this.uniTipidentifica = uniTipidentifica;
	}
		
	public Date getTerFecnacimiento(){
		return this.terFecnacimiento;
	}
	
	public void setTerFecnacimiento(Date terFecnacimiento){
	
		this.terFecnacimiento = terFecnacimiento;
	}
		
	public Short getTerDigverificacion(){
		return this.terDigverificacion;
	}
	
	public void setTerDigverificacion(Short terDigverificacion){
	
		this.terDigverificacion = terDigverificacion;
	}
		
	public String getTerInfoadicional(){
		return this.terInfoadicional;
	}
	
	public void setTerInfoadicional(String terInfoadicional){
	
		this.terInfoadicional = terInfoadicional;
	}
		

    public List<ClteClatercero> getClteClaterceroTerIderegistroFkeyesList(){
		return this.clteClaterceroTerIderegistroFkeyes;
	}
	
	public void setClteClaterceroTerIderegistroFkeyesList(List<ClteClatercero> clteClaterceroTerIderegistroFkeyes){
		this.clteClaterceroTerIderegistroFkeyes = clteClaterceroTerIderegistroFkeyes;
	}
			
    public List<DsusDetsuscrip> getDsusDetsuscripTerIderegistroFkeyesList(){
		return this.dsusDetsuscripTerIderegistroFkeyes;
	}
	
	public void setDsusDetsuscripTerIderegistroFkeyesList(List<DsusDetsuscrip> dsusDetsuscripTerIderegistroFkeyes){
		this.dsusDetsuscripTerIderegistroFkeyes = dsusDetsuscripTerIderegistroFkeyes;
	}
			

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_TER_TERCERO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadTerTercero() {
		return ATRIBUTOS_ENTIDAD_TER_TERCERO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.terDocumento);
        hash = 37 * hash + Objects.hashCode(this.terNombre);
        hash = 37 * hash + Objects.hashCode(this.terApellido);
        hash = 37 * hash + Objects.hashCode(this.terNomcompleto);
        hash = 37 * hash + Objects.hashCode(this.terSexo);
        hash = 37 * hash + Objects.hashCode(this.terTelcelular);
        hash = 37 * hash + Objects.hashCode(this.terTelfijo);
        hash = 37 * hash + Objects.hashCode(this.estTiptercero);
        hash = 37 * hash + Objects.hashCode(this.uniTiptercero);
        hash = 37 * hash + Objects.hashCode(this.terCorreo);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.ciudadCod);
        hash = 37 * hash + Objects.hashCode(this.terDocexpedicion);
        hash = 37 * hash + Objects.hashCode(this.uniTipidentifica);
        hash = 37 * hash + Objects.hashCode(this.terFecnacimiento);
        hash = 37 * hash + Objects.hashCode(this.terDigverificacion);
        hash = 37 * hash + Objects.hashCode(this.terInfoadicional);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad TerTercero que se pasa
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
        final TerTercero other = (TerTercero) obj;
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terDocumento, other.terDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.terNombre, other.terNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.terApellido, other.terApellido)) {
            return false;
        }
        
        if (!Objects.equals(this.terNomcompleto, other.terNomcompleto)) {
            return false;
        }
        
        if (!Objects.equals(this.terSexo, other.terSexo)) {
            return false;
        }
        
        if (!Objects.equals(this.terTelcelular, other.terTelcelular)) {
            return false;
        }
        
        if (!Objects.equals(this.terTelfijo, other.terTelfijo)) {
            return false;
        }
        
        if (!Objects.equals(this.estTiptercero, other.estTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTiptercero, other.uniTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.terCorreo, other.terCorreo)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.ciudadCod, other.ciudadCod)) {
            return false;
        }
        
        if (!Objects.equals(this.terDocexpedicion, other.terDocexpedicion)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipidentifica, other.uniTipidentifica)) {
            return false;
        }
        
        if (!Objects.equals(this.terFecnacimiento, other.terFecnacimiento)) {
            return false;
        }
        
        if (!Objects.equals(this.terDigverificacion, other.terDigverificacion)) {
            return false;
        }
        
        return Objects.equals(this.terInfoadicional, other.terInfoadicional);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

