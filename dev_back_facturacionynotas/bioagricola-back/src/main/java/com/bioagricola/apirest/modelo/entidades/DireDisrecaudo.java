package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name="dire_disrecaudo")
@NamedQuery(name = "DireDisrecaudo.findAll", query = "SELECT p FROM DireDisrecaudo p")
public class DireDisrecaudo implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_DIRE_DISRECAUDO_PK = "direIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DIRE_VLRRECAUDO = "direVlrrecaudo";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DIRE_SDORECAUDO = "direSdorecaudo";
	public static final String ENTIDAD_DIRE_DISRECAUDO_REC_IDEREGISTRO = "recIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DICN_IDEREGISTR = "dicnIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DSUS_IDEREGISTR = "dsusIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_UNI_DOCUMENTO = "uniDocumento";
	public static final String ENTIDAD_DIRE_DISRECAUDO_UNI_TIPDOCUMENT = "uniTipdocument";
	public static final String ENTIDAD_DIRE_DISRECAUDO_UNI_CONCEPTO = "uniConcepto";
	public static final String ENTIDAD_DIRE_DISRECAUDO_PER_IDEREGISTRO = "perIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_CIC_IDEREGISTRO = "cicIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_CIC_ANO = "cicAno";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DCSG_IDEREGISTR = "dcsgIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DIRE_VERSION = "direVersion";
	public static final String ENTIDAD_DIRE_DISRECAUDO_MVI_IDEREGISTRO = "mviIderegistro";
	public static final String ENTIDAD_DIRE_DISRECAUDO_MVRE_IDEREGISTR = "mvreIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_MVCS_IDEREGISTR = "mvcsIderegistr";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DIRE_IDEORIGEN = "direIdeorigen";
	public static final String ENTIDAD_DIRE_DISRECAUDO_DIRE_IDEPADRE = "direIdepadre";
    private static final String[] ATRIBUTOS_ENTIDAD_DIRE_DISRECAUDO
            = {ENTIDAD_DIRE_DISRECAUDO_PER_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_DIRE_VLRRECAUDO, ENTIDAD_DIRE_DISRECAUDO_DIRE_SDORECAUDO, ENTIDAD_DIRE_DISRECAUDO_CIC_ANO, ENTIDAD_DIRE_DISRECAUDO_DIRE_VERSION, ENTIDAD_DIRE_DISRECAUDO_UNI_TIPDOCUMENT, ENTIDAD_DIRE_DISRECAUDO_UNI_DOCUMENTO, ENTIDAD_DIRE_DISRECAUDO_USU_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_MVI_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_PK, ENTIDAD_DIRE_DISRECAUDO_EMP_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_DSUS_IDEREGISTR, ENTIDAD_DIRE_DISRECAUDO_MVCS_IDEREGISTR, ENTIDAD_DIRE_DISRECAUDO_UNI_CONCEPTO, ENTIDAD_DIRE_DISRECAUDO_DICN_IDEREGISTR, ENTIDAD_DIRE_DISRECAUDO_REC_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_CIC_IDEREGISTRO, ENTIDAD_DIRE_DISRECAUDO_MVRE_IDEREGISTR, ENTIDAD_DIRE_DISRECAUDO_DIRE_IDEORIGEN, ENTIDAD_DIRE_DISRECAUDO_DIRE_IDEPADRE, ENTIDAD_DIRE_DISRECAUDO_DCSG_IDEREGISTR};

	@Id
    @Column(name="dire_ideregistr")
	private Long direIderegistr;

	@Column(name="dire_vlrrecaudo")
	private BigDecimal direVlrrecaudo;
	
	@Column(name="dire_sdorecaudo")
	private BigDecimal direSdorecaudo;
	
    @PodamExclude
	@Column(name="rec_ideregistro")
	private Long recIderegistro;
	
	@Column(name="dicn_ideregistr")
	private Integer dicnIderegistr;
	
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	
	@Column(name="uni_documento")
	private Integer uniDocumento;
	
	@Column(name="uni_tipdocument")
	private Integer uniTipdocument;
	
	@Column(name="uni_concepto")
	private Integer uniConcepto;
	
	@Column(name="per_ideregistro")
	private Integer perIderegistro;
	
	@Column(name="cic_ideregistro")
	private Integer cicIderegistro;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="cic_ano")
	private Short cicAno;
	
	@Column(name="dcsg_ideregistr")
	private Long dcsgIderegistr;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="dire_version")
	private Long direVersion;
	
	@Column(name="mvi_ideregistro")
	private Long mviIderegistro;
	
	@Column(name="mvre_ideregistr")
	private Long mvreIderegistr;
	
	@Column(name="mvcs_ideregistr")
	private Long mvcsIderegistr;
	
	@Column(name="dire_ideorigen")
	private Long direIdeorigen;
	
	@Column(name="dire_idepadre")
	private Long direIdepadre;
	

	@ManyToOne
	@JoinColumn(name="rec_ideregistro", referencedColumnName="rec_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private RecRecaudo recRecaudodireDisrecaudoRecIderegistroFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DireDisrecaudo(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getDireIderegistr(){
		return this.direIderegistr;
	}
	
	public void setDireIderegistr(Long direIderegistr){
	
		this.direIderegistr = direIderegistr;
	}
	
	public BigDecimal getDireVlrrecaudo(){
		return this.direVlrrecaudo;
	}
	
	public void setDireVlrrecaudo(BigDecimal direVlrrecaudo){
	
		this.direVlrrecaudo = direVlrrecaudo;
	}
		
	public BigDecimal getDireSdorecaudo(){
		return this.direSdorecaudo;
	}
	
	public void setDireSdorecaudo(BigDecimal direSdorecaudo){
	
		this.direSdorecaudo = direSdorecaudo;
	}
		
	public Long getRecIderegistro(){
		return this.recIderegistro;
	}
	
	public void setRecIderegistro(Long recIderegistro){
	
		this.recIderegistro = recIderegistro;
	}
		
	public Integer getDicnIderegistr(){
		return this.dicnIderegistr;
	}
	
	public void setDicnIderegistr(Integer dicnIderegistr){
	
		this.dicnIderegistr = dicnIderegistr;
	}
		
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	public void setDsusIderegistr(Long dsusIderegistr){
	
		this.dsusIderegistr = dsusIderegistr;
	}
		
	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	public void setUniDocumento(Integer uniDocumento){
	
		this.uniDocumento = uniDocumento;
	}
		
	public Integer getUniTipdocument(){
		return this.uniTipdocument;
	}
	
	public void setUniTipdocument(Integer uniTipdocument){
	
		this.uniTipdocument = uniTipdocument;
	}
		
	public Integer getUniConcepto(){
		return this.uniConcepto;
	}
	
	public void setUniConcepto(Integer uniConcepto){
	
		this.uniConcepto = uniConcepto;
	}
		
	public Integer getPerIderegistro(){
		return this.perIderegistro;
	}
	
	public void setPerIderegistro(Integer perIderegistro){
	
		this.perIderegistro = perIderegistro;
	}
		
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	public void setCicIderegistro(Integer cicIderegistro){
	
		this.cicIderegistro = cicIderegistro;
	}
		
	public Integer getEmpIderegistro(){
		return this.empIderegistro;
	}
	
	public void setEmpIderegistro(Integer empIderegistro){
	
		this.empIderegistro = empIderegistro;
	}
		
	public Short getCicAno(){
		return this.cicAno;
	}
	
	public void setCicAno(Short cicAno){
	
		this.cicAno = cicAno;
	}
		
	public Long getDcsgIderegistr(){
		return this.dcsgIderegistr;
	}
	
	public void setDcsgIderegistr(Long dcsgIderegistr){
	
		this.dcsgIderegistr = dcsgIderegistr;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Long getDireVersion(){
		return this.direVersion;
	}
	
	public void setDireVersion(Long direVersion){
	
		this.direVersion = direVersion;
	}
		
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	public void setMviIderegistro(Long mviIderegistro){
	
		this.mviIderegistro = mviIderegistro;
	}
		
	public Long getMvreIderegistr(){
		return this.mvreIderegistr;
	}
	
	public void setMvreIderegistr(Long mvreIderegistr){
	
		this.mvreIderegistr = mvreIderegistr;
	}
		
	public Long getMvcsIderegistr(){
		return this.mvcsIderegistr;
	}
	
	public void setMvcsIderegistr(Long mvcsIderegistr){
	
		this.mvcsIderegistr = mvcsIderegistr;
	}
		
	public Long getDireIdeorigen(){
		return this.direIdeorigen;
	}
	
	public void setDireIdeorigen(Long direIdeorigen){
	
		this.direIdeorigen = direIdeorigen;
	}
		
	public Long getDireIdepadre(){
		return this.direIdepadre;
	}
	
	public void setDireIdepadre(Long direIdepadre){
	
		this.direIdepadre = direIdepadre;
	}
		

    public RecRecaudo getRecRecaudodireDisrecaudoRecIderegistroFkey(){
		return this.recRecaudodireDisrecaudoRecIderegistroFkey; 
	}
	
	public void setRecRecaudodireDisrecaudoRecIderegistroFkey(RecRecaudo recRecaudodireDisrecaudoRecIderegistroFkey){
		this.recRecaudodireDisrecaudoRecIderegistroFkey = recRecaudodireDisrecaudoRecIderegistroFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_DIRE_DISRECAUDO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadDireDisrecaudo() {
		return ATRIBUTOS_ENTIDAD_DIRE_DISRECAUDO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.direIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.direVlrrecaudo);
        hash = 37 * hash + Objects.hashCode(this.direSdorecaudo);
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dicnIderegistr);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.uniConcepto);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.dcsgIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.direVersion);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.mvreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvcsIderegistr);
        hash = 37 * hash + Objects.hashCode(this.direIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.direIdepadre);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DireDisrecaudo que se pasa
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
        final DireDisrecaudo other = (DireDisrecaudo) obj;
        
        if (!Objects.equals(this.direIderegistr, other.direIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.direVlrrecaudo, other.direVlrrecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.direSdorecaudo, other.direSdorecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dicnIderegistr, other.dicnIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
            return false;
        }
        
        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicAno, other.cicAno)) {
            return false;
        }
        
        if (!Objects.equals(this.dcsgIderegistr, other.dcsgIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.direVersion, other.direVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.mvreIderegistr, other.mvreIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.mvcsIderegistr, other.mvcsIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.direIdeorigen, other.direIdeorigen)) {
            return false;
        }
        
        return Objects.equals(this.direIdepadre, other.direIdepadre);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

