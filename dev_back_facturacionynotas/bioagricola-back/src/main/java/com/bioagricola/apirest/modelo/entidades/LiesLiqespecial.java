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
@Table(name="lies_liqespecial")
@NamedQuery(name = "LiesLiqespecial.findAll", query = "SELECT p FROM LiesLiqespecial p")
public class LiesLiqespecial implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_LIES_LIQESPECIAL_PK = "liesIderegistr";
	public static final String ENTIDAD_LIES_LIQESPECIAL_LIES_VLRLIMITE = "liesVlrlimite";
	public static final String ENTIDAD_LIES_LIQESPECIAL_UNI_MUNICIPIO = "uniMunicipio";
	public static final String ENTIDAD_LIES_LIQESPECIAL_UNI_BARRIO = "uniBarrio";
	public static final String ENTIDAD_LIES_LIQESPECIAL_PRO_CATESTRATO = "proCatestrato";
	public static final String ENTIDAD_LIES_LIQESPECIAL_UNI_TIPUSOSUSCR = "uniTipusosuscr";
	public static final String ENTIDAD_LIES_LIQESPECIAL_DSUS_IDEREGISTR = "dsusIderegistr";
	public static final String ENTIDAD_LIES_LIQESPECIAL_UNI_LIQUIDACION = "uniLiquidacion";
	public static final String ENTIDAD_LIES_LIQESPECIAL_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_LIES_LIQESPECIAL_TER_IDEREGISTRO = "terIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_LIES_LIQESPECIAL
            = {ENTIDAD_LIES_LIQESPECIAL_DSUS_IDEREGISTR, ENTIDAD_LIES_LIQESPECIAL_UNI_TIPUSOSUSCR, ENTIDAD_LIES_LIQESPECIAL_LIES_VLRLIMITE, ENTIDAD_LIES_LIQESPECIAL_PK, ENTIDAD_LIES_LIQESPECIAL_UNI_BARRIO, ENTIDAD_LIES_LIQESPECIAL_UNI_MUNICIPIO, ENTIDAD_LIES_LIQESPECIAL_USU_IDEREGISTRO, ENTIDAD_LIES_LIQESPECIAL_TER_IDEREGISTRO, ENTIDAD_LIES_LIQESPECIAL_UNI_LIQUIDACION, ENTIDAD_LIES_LIQESPECIAL_PRO_CATESTRATO};

	@Id
    @Column(name="lies_ideregistr")
	private Long liesIderegistr;

	@Column(name="lies_vlrlimite")
	private BigDecimal liesVlrlimite;
	
	@Column(name="uni_municipio")
	private Integer uniMunicipio;
	
	@Column(name="uni_barrio")
	private Integer uniBarrio;
	
	@Column(name="pro_catestrato")
	private Short proCatestrato;
	
    @PodamExclude
	@Column(name="uni_tipusosuscr")
	private Integer uniTipusosuscr;
	
    @PodamExclude
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	
    @PodamExclude
	@Column(name="uni_liquidacion")
	private Integer uniLiquidacion;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="ter_ideregistro")
	private Long terIderegistro;
	

	@ManyToOne
	@JoinColumn(name="dsus_ideregistr", referencedColumnName="dsus_ideregistr", insertable = false, updatable = false)
	@PodamExclude
    private DsusDetsuscrip dsusDetsuscripliesLiqespecialDsusIderegistrFkey;
    
		
	@ManyToOne
	@JoinColumn(name="uni_liquidacion", referencedColumnName="uni_liquidacion", insertable = false, updatable = false)
	@PodamExclude
    private LiqLiquidacion liqLiquidacionliesLiqespecialUniLiquidacionFkey;
    
		
	@ManyToOne
	@JoinColumn(name="uni_tipusosuscr", referencedColumnName="uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private UniUnidad uniUnidadliesLiqespecialUniTipusosuscrFkey;
    
		

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiesLiqespecial(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getLiesIderegistr(){
		return this.liesIderegistr;
	}
	
	public void setLiesIderegistr(Long liesIderegistr){
	
		this.liesIderegistr = liesIderegistr;
	}
	
	public BigDecimal getLiesVlrlimite(){
		return this.liesVlrlimite;
	}
	
	public void setLiesVlrlimite(BigDecimal liesVlrlimite){
	
		this.liesVlrlimite = liesVlrlimite;
	}
		
	public Integer getUniMunicipio(){
		return this.uniMunicipio;
	}
	
	public void setUniMunicipio(Integer uniMunicipio){
	
		this.uniMunicipio = uniMunicipio;
	}
		
	public Integer getUniBarrio(){
		return this.uniBarrio;
	}
	
	public void setUniBarrio(Integer uniBarrio){
	
		this.uniBarrio = uniBarrio;
	}
		
	public Short getProCatestrato(){
		return this.proCatestrato;
	}
	
	public void setProCatestrato(Short proCatestrato){
	
		this.proCatestrato = proCatestrato;
	}
		
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	public void setUniTipusosuscr(Integer uniTipusosuscr){
	
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	public void setDsusIderegistr(Long dsusIderegistr){
	
		this.dsusIderegistr = dsusIderegistr;
	}
		
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	public void setUniLiquidacion(Integer uniLiquidacion){
	
		this.uniLiquidacion = uniLiquidacion;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	public void setTerIderegistro(Long terIderegistro){
	
		this.terIderegistro = terIderegistro;
	}
		

    public DsusDetsuscrip getDsusDetsuscripliesLiqespecialDsusIderegistrFkey(){
		return this.dsusDetsuscripliesLiqespecialDsusIderegistrFkey; 
	}
	
	public void setDsusDetsuscripliesLiqespecialDsusIderegistrFkey(DsusDetsuscrip dsusDetsuscripliesLiqespecialDsusIderegistrFkey){
		this.dsusDetsuscripliesLiqespecialDsusIderegistrFkey = dsusDetsuscripliesLiqespecialDsusIderegistrFkey;
	}
    public LiqLiquidacion getLiqLiquidacionliesLiqespecialUniLiquidacionFkey(){
		return this.liqLiquidacionliesLiqespecialUniLiquidacionFkey; 
	}
	
	public void setLiqLiquidacionliesLiqespecialUniLiquidacionFkey(LiqLiquidacion liqLiquidacionliesLiqespecialUniLiquidacionFkey){
		this.liqLiquidacionliesLiqespecialUniLiquidacionFkey = liqLiquidacionliesLiqespecialUniLiquidacionFkey;
	}
    public UniUnidad getUniUnidadliesLiqespecialUniTipusosuscrFkey(){
		return this.uniUnidadliesLiqespecialUniTipusosuscrFkey; 
	}
	
	public void setUniUnidadliesLiqespecialUniTipusosuscrFkey(UniUnidad uniUnidadliesLiqespecialUniTipusosuscrFkey){
		this.uniUnidadliesLiqespecialUniTipusosuscrFkey = uniUnidadliesLiqespecialUniTipusosuscrFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_LIES_LIQESPECIAL) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadLiesLiqespecial() {
		return ATRIBUTOS_ENTIDAD_LIES_LIQESPECIAL;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.liesIderegistr);        
        hash = 37 * hash + Objects.hashCode(this.liesVlrlimite);
        hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
        hash = 37 * hash + Objects.hashCode(this.uniBarrio);
        hash = 37 * hash + Objects.hashCode(this.proCatestrato);
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiesLiqespecial que se pasa
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
        final LiesLiqespecial other = (LiesLiqespecial) obj;
        
        if (!Objects.equals(this.liesIderegistr, other.liesIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.liesVlrlimite, other.liesVlrlimite)) {
            return false;
        }
        
        if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
            return false;
        }
        
        if (!Objects.equals(this.uniBarrio, other.uniBarrio)) {
            return false;
        }
        
        if (!Objects.equals(this.proCatestrato, other.proCatestrato)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.terIderegistro, other.terIderegistro);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

