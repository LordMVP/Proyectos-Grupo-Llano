package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
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
import javax.persistence.Temporal;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name="rec_recaudo")
@NamedQuery(name = "RecRecaudo.findAll", query = "SELECT p FROM RecRecaudo p")
public class RecRecaudo implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_REC_RECAUDO_PK = "recIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_REC_FECHA = "recFecha";
	public static final String ENTIDAD_REC_RECAUDO_REC_ESTADO = "recEstado";
	public static final String ENTIDAD_REC_RECAUDO_REC_FECAPLICADO = "recFecaplicado";
	public static final String ENTIDAD_REC_RECAUDO_REC_VLRPAGADO = "recVlrpagado";
	public static final String ENTIDAD_REC_RECAUDO_REC_VLRCAMBIO = "recVlrcambio";
	public static final String ENTIDAD_REC_RECAUDO_REC_VLRAJUSTE = "recVlrajuste";
	public static final String ENTIDAD_REC_RECAUDO_REC_VLRREAL = "recVlrreal";
	public static final String ENTIDAD_REC_RECAUDO_UNI_MEDPAGO = "uniMedpago";
	public static final String ENTIDAD_REC_RECAUDO_CNRE_IDEREGISTR = "cnreIderegistr";
	public static final String ENTIDAD_REC_RECAUDO_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_SUS_IDEREGISTRO = "susIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_TER_IDEREGISTRO = "terIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_UNI_DOCUMENTO = "uniDocumento";
	public static final String ENTIDAD_REC_RECAUDO_REC_IDEORIGEN = "recIdeorigen";
	public static final String ENTIDAD_REC_RECAUDO_REC_IDEPADRE = "recIdepadre";
	public static final String ENTIDAD_REC_RECAUDO_REC_FECPAGO = "recFecpago";
	public static final String ENTIDAD_REC_RECAUDO_UNI_MUNICIPIO = "uniMunicipio";
	public static final String ENTIDAD_REC_RECAUDO_CSG_IDEREGISTRO = "csgIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_REC_VERSION = "recVersion";
	public static final String ENTIDAD_REC_RECAUDO_MVI_IDEREGISTRO = "mviIderegistro";
	public static final String ENTIDAD_REC_RECAUDO_REC_IDEUNIFICAD = "recIdeunificad";
    private static final String[] ATRIBUTOS_ENTIDAD_REC_RECAUDO
            = {ENTIDAD_REC_RECAUDO_REC_VLRCAMBIO, ENTIDAD_REC_RECAUDO_EMP_IDEREGISTRO, ENTIDAD_REC_RECAUDO_REC_FECHA, ENTIDAD_REC_RECAUDO_CNRE_IDEREGISTR, ENTIDAD_REC_RECAUDO_REC_IDEPADRE, ENTIDAD_REC_RECAUDO_USU_IDEREGISTRO, ENTIDAD_REC_RECAUDO_MVI_IDEREGISTRO, ENTIDAD_REC_RECAUDO_REC_ESTADO, ENTIDAD_REC_RECAUDO_REC_VERSION, ENTIDAD_REC_RECAUDO_TER_IDEREGISTRO, ENTIDAD_REC_RECAUDO_REC_IDEUNIFICAD, ENTIDAD_REC_RECAUDO_REC_FECAPLICADO, ENTIDAD_REC_RECAUDO_SUS_IDEREGISTRO, ENTIDAD_REC_RECAUDO_CSG_IDEREGISTRO, ENTIDAD_REC_RECAUDO_REC_VLRPAGADO, ENTIDAD_REC_RECAUDO_REC_IDEORIGEN, ENTIDAD_REC_RECAUDO_PK, ENTIDAD_REC_RECAUDO_UNI_DOCUMENTO, ENTIDAD_REC_RECAUDO_REC_FECPAGO, ENTIDAD_REC_RECAUDO_UNI_MEDPAGO, ENTIDAD_REC_RECAUDO_REC_VLRAJUSTE, ENTIDAD_REC_RECAUDO_REC_VLRREAL, ENTIDAD_REC_RECAUDO_UNI_MUNICIPIO};

	@Id
    @Column(name="rec_ideregistro")
	private Long recIderegistro;

	@Column(name="rec_fecha")
	private Byte[] recFecha;
	
	@Column(name="rec_estado")
	@Size(min=0, max= 1)
	private String recEstado;
	
	@Column(name="rec_fecaplicado")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date recFecaplicado;
	
	@Column(name="rec_vlrpagado")
	private BigDecimal recVlrpagado;
	
	@Column(name="rec_vlrcambio")
	private BigDecimal recVlrcambio;
	
	@Column(name="rec_vlrajuste")
	private BigDecimal recVlrajuste;
	
	@Column(name="rec_vlrreal")
	private BigDecimal recVlrreal;
	
	@Column(name="uni_medpago")
	private Integer uniMedpago;
	
	@Column(name="cnre_ideregistr")
	private Integer cnreIderegistr;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="sus_ideregistro")
	private Long susIderegistro;
	
	@Column(name="ter_ideregistro")
	private Long terIderegistro;
	
    @PodamExclude
	@Column(name="uni_documento")
	private Integer uniDocumento;
	
	@Column(name="rec_ideorigen")
	private Long recIdeorigen;
	
	@Column(name="rec_idepadre")
	private Long recIdepadre;
	
	@Column(name="rec_fecpago")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date recFecpago;
	
	@Column(name="uni_municipio")
	private Integer uniMunicipio;
	
	@Column(name="csg_ideregistro")
	private Long csgIderegistro;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="rec_version")
	private Long recVersion;
	
	@Column(name="mvi_ideregistro")
	private Long mviIderegistro;
	
	@Column(name="rec_ideunificad")
	private Integer recIdeunificad;
	

	@ManyToOne
	@JoinColumn(name="uni_documento", referencedColumnName="uni_documento", insertable = false, updatable = false)
	@PodamExclude
    private DocDocumento docDocumentofkRecdocDocumento;
    
		
	@OneToMany(mappedBy="recRecaudodireDisrecaudoRecIderegistroFkey")
	@PodamExclude
    private List<DireDisrecaudo> direDisrecaudoRecIderegistroFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public RecRecaudo(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getRecIderegistro(){
		return this.recIderegistro;
	}
	
	public void setRecIderegistro(Long recIderegistro){
	
		this.recIderegistro = recIderegistro;
	}
	
	public Byte[] getRecFecha(){
		return this.recFecha;
	}
	
	public void setRecFecha(Byte[] recFecha){
	
		this.recFecha = recFecha;
	}
		
	public String getRecEstado(){
		return this.recEstado;
	}
	
	public void setRecEstado(String recEstado){
	
		this.recEstado = recEstado;
	}
		
	public Date getRecFecaplicado(){
		return this.recFecaplicado;
	}
	
	public void setRecFecaplicado(Date recFecaplicado){
	
		this.recFecaplicado = recFecaplicado;
	}
		
	public BigDecimal getRecVlrpagado(){
		return this.recVlrpagado;
	}
	
	public void setRecVlrpagado(BigDecimal recVlrpagado){
	
		this.recVlrpagado = recVlrpagado;
	}
		
	public BigDecimal getRecVlrcambio(){
		return this.recVlrcambio;
	}
	
	public void setRecVlrcambio(BigDecimal recVlrcambio){
	
		this.recVlrcambio = recVlrcambio;
	}
		
	public BigDecimal getRecVlrajuste(){
		return this.recVlrajuste;
	}
	
	public void setRecVlrajuste(BigDecimal recVlrajuste){
	
		this.recVlrajuste = recVlrajuste;
	}
		
	public BigDecimal getRecVlrreal(){
		return this.recVlrreal;
	}
	
	public void setRecVlrreal(BigDecimal recVlrreal){
	
		this.recVlrreal = recVlrreal;
	}
		
	public Integer getUniMedpago(){
		return this.uniMedpago;
	}
	
	public void setUniMedpago(Integer uniMedpago){
	
		this.uniMedpago = uniMedpago;
	}
		
	public Integer getCnreIderegistr(){
		return this.cnreIderegistr;
	}
	
	public void setCnreIderegistr(Integer cnreIderegistr){
	
		this.cnreIderegistr = cnreIderegistr;
	}
		
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	public void setEmpIderegistro(Integer empIderegistro){
	
		this.empIderegistro = empIderegistro;
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
		
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	public void setUniDocumento(Integer uniDocumento){
	
		this.uniDocumento = uniDocumento;
	}
		
	public Long getRecIdeorigen(){
		return this.recIdeorigen;
	}
	
	public void setRecIdeorigen(Long recIdeorigen){
	
		this.recIdeorigen = recIdeorigen;
	}
		
	public Long getRecIdepadre(){
		return this.recIdepadre;
	}
	
	public void setRecIdepadre(Long recIdepadre){
	
		this.recIdepadre = recIdepadre;
	}
		
	public Date getRecFecpago(){
		return this.recFecpago;
	}
	
	public void setRecFecpago(Date recFecpago){
	
		this.recFecpago = recFecpago;
	}
		
	public Integer getUniMunicipio(){
		return this.uniMunicipio;
	}
	
	public void setUniMunicipio(Integer uniMunicipio){
	
		this.uniMunicipio = uniMunicipio;
	}
		
	public Long getCsgIderegistro(){
		return this.csgIderegistro;
	}
	
	public void setCsgIderegistro(Long csgIderegistro){
	
		this.csgIderegistro = csgIderegistro;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Long getRecVersion(){
		return this.recVersion;
	}
	
	public void setRecVersion(Long recVersion){
	
		this.recVersion = recVersion;
	}
		
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	public void setMviIderegistro(Long mviIderegistro){
	
		this.mviIderegistro = mviIderegistro;
	}
		
	public Integer getRecIdeunificad(){
		return this.recIdeunificad;
	}
	
	public void setRecIdeunificad(Integer recIdeunificad){
	
		this.recIdeunificad = recIdeunificad;
	}
		

    public List<DireDisrecaudo> getDireDisrecaudoRecIderegistroFkeyesList(){
		return this.direDisrecaudoRecIderegistroFkeyes;
	}
	
	public void setDireDisrecaudoRecIderegistroFkeyesList(List<DireDisrecaudo> direDisrecaudoRecIderegistroFkeyes){
		this.direDisrecaudoRecIderegistroFkeyes = direDisrecaudoRecIderegistroFkeyes;
	}
			
    public DocDocumento getDocDocumentofkRecdocDocumento(){
		return this.docDocumentofkRecdocDocumento; 
	}
	
	public void setDocDocumentofkRecdocDocumento(DocDocumento docDocumentofkRecdocDocumento){
		this.docDocumentofkRecdocDocumento = docDocumentofkRecdocDocumento;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_REC_RECAUDO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadRecRecaudo() {
		return ATRIBUTOS_ENTIDAD_REC_RECAUDO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.recFecha);
        hash = 37 * hash + Objects.hashCode(this.recEstado);
        hash = 37 * hash + Objects.hashCode(this.recFecaplicado);
        hash = 37 * hash + Objects.hashCode(this.recVlrpagado);
        hash = 37 * hash + Objects.hashCode(this.recVlrcambio);
        hash = 37 * hash + Objects.hashCode(this.recVlrajuste);
        hash = 37 * hash + Objects.hashCode(this.recVlrreal);
        hash = 37 * hash + Objects.hashCode(this.uniMedpago);
        hash = 37 * hash + Objects.hashCode(this.cnreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.recIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.recIdepadre);
        hash = 37 * hash + Objects.hashCode(this.recFecpago);
        hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
        hash = 37 * hash + Objects.hashCode(this.csgIderegistro);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.recVersion);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.recIdeunificad);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad RecRecaudo que se pasa
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
        final RecRecaudo other = (RecRecaudo) obj;
        
        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecha, other.recFecha)) {
            return false;
        }
        
        if (!Objects.equals(this.recEstado, other.recEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecaplicado, other.recFecaplicado)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrpagado, other.recVlrpagado)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrcambio, other.recVlrcambio)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrajuste, other.recVlrajuste)) {
            return false;
        }
        
        if (!Objects.equals(this.recVlrreal, other.recVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMedpago, other.uniMedpago)) {
            return false;
        }
        
        if (!Objects.equals(this.cnreIderegistr, other.cnreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.recIdeorigen, other.recIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.recIdepadre, other.recIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.recFecpago, other.recFecpago)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
            return false;
        }
        
        if (!Objects.equals(this.csgIderegistro, other.csgIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.recVersion, other.recVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.recIdeunificad, other.recIdeunificad);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

