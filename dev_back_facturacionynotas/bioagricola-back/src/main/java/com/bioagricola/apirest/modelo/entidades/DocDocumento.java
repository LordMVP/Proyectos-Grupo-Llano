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
@Table(name="doc_documento")
@NamedQuery(name = "DocDocumento.findAll", query = "SELECT p FROM DocDocumento p")
public class DocDocumento implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_DOC_DOCUMENTO_PK = "uniDocumento";
	public static final String ENTIDAD_DOC_DOCUMENTO_EST_DOCUMENTO = "estDocumento";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_NOMBRE = "docNombre";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_ABREVIATURA = "docAbreviatura";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_FINANCIABLE = "docFinanciable";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_TIPO = "docTipo";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_CONTABILIZA = "docContabiliza";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_CONSIGNA = "docConsigna";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_PRESUPUESTO = "docPresupuesto";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_RECAUDO = "docRecaudo";
	public static final String ENTIDAD_DOC_DOCUMENTO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_DEVOLUCION = "docDevolucion";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_ANTICIPO = "docAnticipo";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_REGISTRO = "docRegistro";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_NITCONTABIL = "docNitcontabil";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_MAXIMPRESION = "docMaximpresion";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_PAGPRIORI = "docPagpriori";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_APLICAFES = "docAplicafes";
	public static final String ENTIDAD_DOC_DOCUMENTO_DOC_APLICAFELEC = "docAplicafelec";
    private static final String[] ATRIBUTOS_ENTIDAD_DOC_DOCUMENTO
            = {ENTIDAD_DOC_DOCUMENTO_DOC_CONSIGNA, ENTIDAD_DOC_DOCUMENTO_DOC_ANTICIPO, ENTIDAD_DOC_DOCUMENTO_DOC_PAGPRIORI, ENTIDAD_DOC_DOCUMENTO_DOC_NOMBRE, ENTIDAD_DOC_DOCUMENTO_DOC_MAXIMPRESION, ENTIDAD_DOC_DOCUMENTO_DOC_DEVOLUCION, ENTIDAD_DOC_DOCUMENTO_DOC_RECAUDO, ENTIDAD_DOC_DOCUMENTO_DOC_REGISTRO, ENTIDAD_DOC_DOCUMENTO_DOC_PRESUPUESTO, ENTIDAD_DOC_DOCUMENTO_DOC_ABREVIATURA, ENTIDAD_DOC_DOCUMENTO_PK, ENTIDAD_DOC_DOCUMENTO_DOC_APLICAFES, ENTIDAD_DOC_DOCUMENTO_EST_DOCUMENTO, ENTIDAD_DOC_DOCUMENTO_USU_IDEREGISTRO, ENTIDAD_DOC_DOCUMENTO_DOC_APLICAFELEC, ENTIDAD_DOC_DOCUMENTO_DOC_FINANCIABLE, ENTIDAD_DOC_DOCUMENTO_DOC_TIPO, ENTIDAD_DOC_DOCUMENTO_DOC_CONTABILIZA, ENTIDAD_DOC_DOCUMENTO_DOC_NITCONTABIL};

	@Id
    @Column(name="uni_documento")
	private Integer uniDocumento;

	@Column(name="est_documento")
	private Integer estDocumento;
	
	@Column(name="doc_nombre")
	@Size(min=0, max= 100)
	private String docNombre;
	
	@Column(name="doc_abreviatura")
	@Size(min=0, max= 5)
	private String docAbreviatura;
	
	@Column(name="doc_financiable")
	@Size(min=0, max= 1)
	private String docFinanciable;
	
	@Column(name="doc_tipo")
	@Size(min=0, max= 2)
	private String docTipo;
	
	@Column(name="doc_contabiliza")
	@Size(min=0, max= 1)
	private String docContabiliza;
	
	@Column(name="doc_consigna")
	@Size(min=0, max= 1)
	private String docConsigna;
	
	@Column(name="doc_presupuesto")
	@Size(min=0, max= 1)
	private String docPresupuesto;
	
	@Column(name="doc_recaudo")
	@Size(min=0, max= 1)
	private String docRecaudo;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="doc_devolucion")
	@Size(min=0, max= 1)
	private String docDevolucion;
	
	@Column(name="doc_anticipo")
	@Size(min=0, max= 1)
	private String docAnticipo;
	
	@Column(name="doc_registro")
	@Size(min=0, max= 1)
	private String docRegistro;
	
	@Column(name="doc_nitcontabil")
	@Size(min=0, max= 1)
	private String docNitcontabil;
	
	@Column(name="doc_maximpresion")
	private Short docMaximpresion;
	
	@Column(name="doc_pagpriori")
	private Short docPagpriori;
	
	@Column(name="doc_aplicafes")
	@Size(min=0, max= 1)
	private String docAplicafes;
	
	@Column(name="doc_aplicafelec")
	@Size(min=0, max= 1)
	private String docAplicafelec;
	

	@ManyToOne
	@JoinColumn(name="uni_documento", referencedColumnName="uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private UniUnidad uniUnidaddocDocumentoUniDocumentoFkey;
    
		
	@OneToMany(mappedBy="docDocumentofacFacturaDocDocumentoFkey")
	@PodamExclude
    private List<FacFactura> facFacturaDocDocumentoFkeyes;
	@OneToMany(mappedBy="docDocumentofkRecdocDocumento")
	@PodamExclude
    private List<RecRecaudo> fkRecdocDocumentos;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public DocDocumento(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getUniDocumento(){
		return this.uniDocumento;
	}
	
	public void setUniDocumento(Integer uniDocumento){
	
		this.uniDocumento = uniDocumento;
	}
	
	public Integer getEstDocumento(){
		return this.estDocumento;
	}
	
	public void setEstDocumento(Integer estDocumento){
	
		this.estDocumento = estDocumento;
	}
		
	public String getDocNombre(){
		return this.docNombre;
	}
	
	public void setDocNombre(String docNombre){
	
		this.docNombre = docNombre;
	}
		
	public String getDocAbreviatura(){
		return this.docAbreviatura;
	}
	
	public void setDocAbreviatura(String docAbreviatura){
	
		this.docAbreviatura = docAbreviatura;
	}
		
	public String getDocFinanciable(){
		return this.docFinanciable;
	}
	
	public void setDocFinanciable(String docFinanciable){
	
		this.docFinanciable = docFinanciable;
	}
		
	public String getDocTipo(){
		return this.docTipo;
	}
	
	public void setDocTipo(String docTipo){
	
		this.docTipo = docTipo;
	}
		
	public String getDocContabiliza(){
		return this.docContabiliza;
	}
	
	public void setDocContabiliza(String docContabiliza){
	
		this.docContabiliza = docContabiliza;
	}
		
	public String getDocConsigna(){
		return this.docConsigna;
	}
	
	public void setDocConsigna(String docConsigna){
	
		this.docConsigna = docConsigna;
	}
		
	public String getDocPresupuesto(){
		return this.docPresupuesto;
	}
	
	public void setDocPresupuesto(String docPresupuesto){
	
		this.docPresupuesto = docPresupuesto;
	}
		
	public String getDocRecaudo(){
		return this.docRecaudo;
	}
	
	public void setDocRecaudo(String docRecaudo){
	
		this.docRecaudo = docRecaudo;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public String getDocDevolucion(){
		return this.docDevolucion;
	}
	
	public void setDocDevolucion(String docDevolucion){
	
		this.docDevolucion = docDevolucion;
	}
		
	public String getDocAnticipo(){
		return this.docAnticipo;
	}
	
	public void setDocAnticipo(String docAnticipo){
	
		this.docAnticipo = docAnticipo;
	}
		
	public String getDocRegistro(){
		return this.docRegistro;
	}
	
	public void setDocRegistro(String docRegistro){
	
		this.docRegistro = docRegistro;
	}
		
	public String getDocNitcontabil(){
		return this.docNitcontabil;
	}
	
	public void setDocNitcontabil(String docNitcontabil){
	
		this.docNitcontabil = docNitcontabil;
	}
		
	public Short getDocMaximpresion(){
		return this.docMaximpresion;
	}
	
	public void setDocMaximpresion(Short docMaximpresion){
	
		this.docMaximpresion = docMaximpresion;
	}
		
	public Short getDocPagpriori(){
		return this.docPagpriori;
	}
	
	public void setDocPagpriori(Short docPagpriori){
	
		this.docPagpriori = docPagpriori;
	}
		
	public String getDocAplicafes(){
		return this.docAplicafes;
	}
	
	public void setDocAplicafes(String docAplicafes){
	
		this.docAplicafes = docAplicafes;
	}
		
	public String getDocAplicafelec(){
		return this.docAplicafelec;
	}
	
	public void setDocAplicafelec(String docAplicafelec){
	
		this.docAplicafelec = docAplicafelec;
	}
		

    public List<FacFactura> getFacFacturaDocDocumentoFkeyesList(){
		return this.facFacturaDocDocumentoFkeyes;
	}
	
	public void setFacFacturaDocDocumentoFkeyesList(List<FacFactura> facFacturaDocDocumentoFkeyes){
		this.facFacturaDocDocumentoFkeyes = facFacturaDocDocumentoFkeyes;
	}
			
    public List<RecRecaudo> getFkRecdocDocumentosList(){
		return this.fkRecdocDocumentos;
	}
	
	public void setFkRecdocDocumentosList(List<RecRecaudo> fkRecdocDocumentos){
		this.fkRecdocDocumentos = fkRecdocDocumentos;
	}
			
    public UniUnidad getUniUnidaddocDocumentoUniDocumentoFkey(){
		return this.uniUnidaddocDocumentoUniDocumentoFkey; 
	}
	
	public void setUniUnidaddocDocumentoUniDocumentoFkey(UniUnidad uniUnidaddocDocumentoUniDocumentoFkey){
		this.uniUnidaddocDocumentoUniDocumentoFkey = uniUnidaddocDocumentoUniDocumentoFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_DOC_DOCUMENTO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadDocDocumento() {
		return ATRIBUTOS_ENTIDAD_DOC_DOCUMENTO;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);        
        hash = 37 * hash + Objects.hashCode(this.estDocumento);
        hash = 37 * hash + Objects.hashCode(this.docNombre);
        hash = 37 * hash + Objects.hashCode(this.docAbreviatura);
        hash = 37 * hash + Objects.hashCode(this.docFinanciable);
        hash = 37 * hash + Objects.hashCode(this.docTipo);
        hash = 37 * hash + Objects.hashCode(this.docContabiliza);
        hash = 37 * hash + Objects.hashCode(this.docConsigna);
        hash = 37 * hash + Objects.hashCode(this.docPresupuesto);
        hash = 37 * hash + Objects.hashCode(this.docRecaudo);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.docDevolucion);
        hash = 37 * hash + Objects.hashCode(this.docAnticipo);
        hash = 37 * hash + Objects.hashCode(this.docRegistro);
        hash = 37 * hash + Objects.hashCode(this.docNitcontabil);
        hash = 37 * hash + Objects.hashCode(this.docMaximpresion);
        hash = 37 * hash + Objects.hashCode(this.docPagpriori);
        hash = 37 * hash + Objects.hashCode(this.docAplicafes);
        hash = 37 * hash + Objects.hashCode(this.docAplicafelec);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad DocDocumento que se pasa
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
        final DocDocumento other = (DocDocumento) obj;
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.estDocumento, other.estDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.docNombre, other.docNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.docAbreviatura, other.docAbreviatura)) {
            return false;
        }
        
        if (!Objects.equals(this.docFinanciable, other.docFinanciable)) {
            return false;
        }
        
        if (!Objects.equals(this.docTipo, other.docTipo)) {
            return false;
        }
        
        if (!Objects.equals(this.docContabiliza, other.docContabiliza)) {
            return false;
        }
        
        if (!Objects.equals(this.docConsigna, other.docConsigna)) {
            return false;
        }
        
        if (!Objects.equals(this.docPresupuesto, other.docPresupuesto)) {
            return false;
        }
        
        if (!Objects.equals(this.docRecaudo, other.docRecaudo)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.docDevolucion, other.docDevolucion)) {
            return false;
        }
        
        if (!Objects.equals(this.docAnticipo, other.docAnticipo)) {
            return false;
        }
        
        if (!Objects.equals(this.docRegistro, other.docRegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.docNitcontabil, other.docNitcontabil)) {
            return false;
        }
        
        if (!Objects.equals(this.docMaximpresion, other.docMaximpresion)) {
            return false;
        }
        
        if (!Objects.equals(this.docPagpriori, other.docPagpriori)) {
            return false;
        }
        
        if (!Objects.equals(this.docAplicafes, other.docAplicafes)) {
            return false;
        }
        
        return Objects.equals(this.docAplicafelec, other.docAplicafelec);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

