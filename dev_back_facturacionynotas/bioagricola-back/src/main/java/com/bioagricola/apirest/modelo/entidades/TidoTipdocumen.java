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
@Table(name="tido_tipdocumen")
@NamedQuery(name = "TidoTipdocumen.findAll", query = "SELECT p FROM TidoTipdocumen p")
public class TidoTipdocumen implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_PK = "uniTipdocument";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_EST_TIPDOCUMENT = "estTipdocument";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_NOMBRE = "tidoNombre";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_ABREVIATUR = "tidoAbreviatur";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_METREGISTR = "tidoMetregistr";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_GENSUSPEND = "tidoGensuspend";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_NITCONTABIL = "tidoNitcontabil";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOFINANCIA = "tidoMaxcuofinancia";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOUNIFICA = "tidoMaxcuounifica";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOREESTRUC = "tidoMaxcuoreestruc";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOABONOK = "tidoMaxcuoabonok";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_FINVENCIDO = "tidoFinvencido";
	public static final String ENTIDAD_TIDO_TIPDOCUMEN_TIDO_PAGPRIORI = "tidoPagpriori";
    private static final String[] ATRIBUTOS_ENTIDAD_TIDO_TIPDOCUMEN
            = {ENTIDAD_TIDO_TIPDOCUMEN_EST_TIPDOCUMENT, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_NITCONTABIL, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_GENSUSPEND, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOUNIFICA, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOABONOK, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOREESTRUC, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_FINVENCIDO, ENTIDAD_TIDO_TIPDOCUMEN_PK, ENTIDAD_TIDO_TIPDOCUMEN_USU_IDEREGISTRO, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_ABREVIATUR, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_MAXCUOFINANCIA, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_PAGPRIORI, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_METREGISTR, ENTIDAD_TIDO_TIPDOCUMEN_TIDO_NOMBRE};

	@Id
    @Column(name="uni_tipdocument")
	private Integer uniTipdocument;

	@Column(name="est_tipdocument")
	private Integer estTipdocument;
	
	@Column(name="tido_nombre")
	@Size(min=0, max= 100)
	private String tidoNombre;
	
	@Column(name="tido_abreviatur")
	@Size(min=0, max= 5)
	private String tidoAbreviatur;
	
	@Column(name="tido_metregistr")
	@Size(min=0, max= 1)
	private String tidoMetregistr;
	
	@Column(name="tido_gensuspend")
	@Size(min=0, max= 1)
	private String tidoGensuspend;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="tido_nitcontabil")
	@Size(min=0, max= 1)
	private String tidoNitcontabil;
	
	@Column(name="tido_maxcuofinancia")
	private Short tidoMaxcuofinancia;
	
	@Column(name="tido_maxcuounifica")
	private Short tidoMaxcuounifica;
	
	@Column(name="tido_maxcuoreestruc")
	private Short tidoMaxcuoreestruc;
	
	@Column(name="tido_maxcuoabonok")
	private Short tidoMaxcuoabonok;
	
	@Column(name="tido_finvencido")
	@Size(min=0, max= 1)
	private String tidoFinvencido;
	
	@Column(name="tido_pagpriori")
	private Short tidoPagpriori;
	
	@Column(name="tido_estado")
	private String tidoEstado;
	

	@ManyToOne
	@JoinColumn(name="uni_tipdocument", referencedColumnName="uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private UniUnidad uniUnidadtidoTipdocumenUniTipdocumentFkey;
    
		
	@OneToMany(mappedBy="tidoTipdocumenfacFacturaTidoTipdocumenFkey")
	@PodamExclude
    private List<FacFactura> facFacturaTidoTipdocumenFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public TidoTipdocumen(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getUniTipdocument(){
		return this.uniTipdocument;
	}
	
	public void setUniTipdocument(Integer uniTipdocument){
	
		this.uniTipdocument = uniTipdocument;
	}
	
	public Integer getEstTipdocument(){
		return this.estTipdocument;
	}
	
	public void setEstTipdocument(Integer estTipdocument){
	
		this.estTipdocument = estTipdocument;
	}
		
	public String getTidoNombre(){
		return this.tidoNombre;
	}
	
	public void setTidoNombre(String tidoNombre){
	
		this.tidoNombre = tidoNombre;
	}
		
	public String getTidoAbreviatur(){
		return this.tidoAbreviatur;
	}
	
	public void setTidoAbreviatur(String tidoAbreviatur){
	
		this.tidoAbreviatur = tidoAbreviatur;
	}
		
	public String getTidoMetregistr(){
		return this.tidoMetregistr;
	}
	
	public void setTidoMetregistr(String tidoMetregistr){
	
		this.tidoMetregistr = tidoMetregistr;
	}
		
	public String getTidoGensuspend(){
		return this.tidoGensuspend;
	}
	
	public void setTidoGensuspend(String tidoGensuspend){
	
		this.tidoGensuspend = tidoGensuspend;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public String getTidoNitcontabil(){
		return this.tidoNitcontabil;
	}
	
	public void setTidoNitcontabil(String tidoNitcontabil){
	
		this.tidoNitcontabil = tidoNitcontabil;
	}
		
	public Short getTidoMaxcuofinancia(){
		return this.tidoMaxcuofinancia;
	}
	
	public void setTidoMaxcuofinancia(Short tidoMaxcuofinancia){
	
		this.tidoMaxcuofinancia = tidoMaxcuofinancia;
	}
		
	public Short getTidoMaxcuounifica(){
		return this.tidoMaxcuounifica;
	}
	
	public void setTidoMaxcuounifica(Short tidoMaxcuounifica){
	
		this.tidoMaxcuounifica = tidoMaxcuounifica;
	}
		
	public Short getTidoMaxcuoreestruc(){
		return this.tidoMaxcuoreestruc;
	}
	
	public void setTidoMaxcuoreestruc(Short tidoMaxcuoreestruc){
	
		this.tidoMaxcuoreestruc = tidoMaxcuoreestruc;
	}
		
	public Short getTidoMaxcuoabonok(){
		return this.tidoMaxcuoabonok;
	}
	
	public void setTidoMaxcuoabonok(Short tidoMaxcuoabonok){
	
		this.tidoMaxcuoabonok = tidoMaxcuoabonok;
	}
		
	public String getTidoFinvencido(){
		return this.tidoFinvencido;
	}
	
	public void setTidoFinvencido(String tidoFinvencido){
	
		this.tidoFinvencido = tidoFinvencido;
	}
		
	public Short getTidoPagpriori(){
		return this.tidoPagpriori;
	}
	
	public void setTidoPagpriori(Short tidoPagpriori){
	
		this.tidoPagpriori = tidoPagpriori;
	}
		

    public List<FacFactura> getFacFacturaTidoTipdocumenFkeyesList(){
		return this.facFacturaTidoTipdocumenFkeyes;
	}
	
	public void setFacFacturaTidoTipdocumenFkeyesList(List<FacFactura> facFacturaTidoTipdocumenFkeyes){
		this.facFacturaTidoTipdocumenFkeyes = facFacturaTidoTipdocumenFkeyes;
	}
			
    public UniUnidad getUniUnidadtidoTipdocumenUniTipdocumentFkey(){
		return this.uniUnidadtidoTipdocumenUniTipdocumentFkey; 
	}
	
	public void setUniUnidadtidoTipdocumenUniTipdocumentFkey(UniUnidad uniUnidadtidoTipdocumenUniTipdocumentFkey){
		this.uniUnidadtidoTipdocumenUniTipdocumentFkey = uniUnidadtidoTipdocumenUniTipdocumentFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_TIDO_TIPDOCUMEN) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadTidoTipdocumen() {
		return ATRIBUTOS_ENTIDAD_TIDO_TIPDOCUMEN;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);        
        hash = 37 * hash + Objects.hashCode(this.estTipdocument);
        hash = 37 * hash + Objects.hashCode(this.tidoNombre);
        hash = 37 * hash + Objects.hashCode(this.tidoAbreviatur);
        hash = 37 * hash + Objects.hashCode(this.tidoMetregistr);
        hash = 37 * hash + Objects.hashCode(this.tidoGensuspend);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.tidoNitcontabil);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuofinancia);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuounifica);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuoreestruc);
        hash = 37 * hash + Objects.hashCode(this.tidoMaxcuoabonok);
        hash = 37 * hash + Objects.hashCode(this.tidoFinvencido);
        hash = 37 * hash + Objects.hashCode(this.tidoPagpriori);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad TidoTipdocumen que se pasa
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
        final TidoTipdocumen other = (TidoTipdocumen) obj;
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.estTipdocument, other.estTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoNombre, other.tidoNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoAbreviatur, other.tidoAbreviatur)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMetregistr, other.tidoMetregistr)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoGensuspend, other.tidoGensuspend)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoNitcontabil, other.tidoNitcontabil)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuofinancia, other.tidoMaxcuofinancia)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuounifica, other.tidoMaxcuounifica)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuoreestruc, other.tidoMaxcuoreestruc)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoMaxcuoabonok, other.tidoMaxcuoabonok)) {
            return false;
        }
        
        if (!Objects.equals(this.tidoFinvencido, other.tidoFinvencido)) {
            return false;
        }
        
        return Objects.equals(this.tidoPagpriori, other.tidoPagpriori);
                
    }


	public String getTidoEstado() {
		return tidoEstado;
	}


	public void setTidoEstado(String tidoEstado) {
		this.tidoEstado = tidoEstado;
	}
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

