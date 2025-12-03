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
@Table(name="liq_liquidacion")
@NamedQuery(name = "LiqLiquidacion.findAll", query = "SELECT p FROM LiqLiquidacion p")
public class LiqLiquidacion implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_LIQ_LIQUIDACION_PK = "uniLiquidacion";
	public static final String ENTIDAD_LIQ_LIQUIDACION_EST_LIQUIDACION = "estLiquidacion";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_NOMBRE = "liqNombre";
	public static final String ENTIDAD_LIQ_LIQUIDACION_UNI_DOCUMENTO = "uniDocumento";
	public static final String ENTIDAD_LIQ_LIQUIDACION_UNI_TIPDOCUMENT = "uniTipdocument";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_INIVIGENCIA = "liqInivigencia";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_FINVIGENCIA = "liqFinvigencia";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_VENCLASIFIC = "liqVenclasific";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_ESTADO = "liqEstado";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_HISTORICO = "liqHistorico";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_DIAVENCIM = "liqDiavencim";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_DIASUSPENS = "liqDiasuspens";
	public static final String ENTIDAD_LIQ_LIQUIDACION_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_TIPCUOTA = "liqTipcuota";
	public static final String ENTIDAD_LIQ_LIQUIDACION_LIQ_CTRVENTAS = "liqCtrventas";
	public static final String ENTIDAD_LIQ_LIQUIDACION_HLIQ_IDEREGISTR = "hliqIderegistr";
    private static final String[] ATRIBUTOS_ENTIDAD_LIQ_LIQUIDACION
            = {ENTIDAD_LIQ_LIQUIDACION_USU_IDEREGISTRO, ENTIDAD_LIQ_LIQUIDACION_LIQ_DIAVENCIM, ENTIDAD_LIQ_LIQUIDACION_LIQ_INIVIGENCIA, ENTIDAD_LIQ_LIQUIDACION_EST_LIQUIDACION, ENTIDAD_LIQ_LIQUIDACION_LIQ_HISTORICO, ENTIDAD_LIQ_LIQUIDACION_UNI_TIPDOCUMENT, ENTIDAD_LIQ_LIQUIDACION_LIQ_DIASUSPENS, ENTIDAD_LIQ_LIQUIDACION_LIQ_CTRVENTAS, ENTIDAD_LIQ_LIQUIDACION_LIQ_NOMBRE, ENTIDAD_LIQ_LIQUIDACION_UNI_DOCUMENTO, ENTIDAD_LIQ_LIQUIDACION_LIQ_FINVIGENCIA, ENTIDAD_LIQ_LIQUIDACION_LIQ_VENCLASIFIC, ENTIDAD_LIQ_LIQUIDACION_HLIQ_IDEREGISTR, ENTIDAD_LIQ_LIQUIDACION_LIQ_ESTADO, ENTIDAD_LIQ_LIQUIDACION_LIQ_TIPCUOTA, ENTIDAD_LIQ_LIQUIDACION_PK};

	@Id
    @Column(name="uni_liquidacion")
	private Integer uniLiquidacion;

	@Column(name="est_liquidacion")
	private Integer estLiquidacion;
	
	@Column(name="liq_nombre")
	@Size(min=0, max= 100)
	private String liqNombre;
	
	@Column(name="uni_documento")
	private Integer uniDocumento;
	
	@Column(name="uni_tipdocument")
	private Integer uniTipdocument;
	
	@Column(name="liq_inivigencia")
	private Byte[] liqInivigencia;
	
	@Column(name="liq_finvigencia")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date liqFinvigencia;
	
	@Column(name="liq_venclasific")
	@Size(min=0, max= 2)
	private String liqVenclasific;
	
	@Column(name="liq_estado")
	@Size(min=0, max= 1)
	private String liqEstado;
	
	@Column(name="liq_historico")
	@Size(min=0, max= 1)
	private String liqHistorico;
	
	@Column(name="liq_diavencim")
	private Integer liqDiavencim;
	
	@Column(name="liq_diasuspens")
	private Integer liqDiasuspens;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="liq_tipcuota")
	@Size(min=0, max= 1)
	private String liqTipcuota;
	
	@Column(name="liq_ctrventas")
	@Size(min=0, max= 1)
	private String liqCtrventas;
	
	@Column(name="hliq_ideregistr")
	private Long hliqIderegistr;
	

	@OneToMany(mappedBy="liqLiquidacioncoliConliquidaUniLiquidacionFkey")
	@PodamExclude
    private List<ColiConliquida> coliConliquidaUniLiquidacionFkeyes;
	@OneToMany(mappedBy="liqLiquidacionliagLiqagendaUniLiquidacionFkey")
	@PodamExclude
    private List<LiagLiqagenda> liagLiqagendaUniLiquidacionFkeyes;
	@OneToMany(mappedBy="liqLiquidacionliesLiqespecialUniLiquidacionFkey")
	@PodamExclude
    private List<LiesLiqespecial> liesLiqespecialUniLiquidacionFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public LiqLiquidacion(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	public void setUniLiquidacion(Integer uniLiquidacion){
	
		this.uniLiquidacion = uniLiquidacion;
	}
	
	public Integer getEstLiquidacion(){
		return this.estLiquidacion;
	}
	
	public void setEstLiquidacion(Integer estLiquidacion){
	
		this.estLiquidacion = estLiquidacion;
	}
		
	public String getLiqNombre(){
		return this.liqNombre;
	}
	
	public void setLiqNombre(String liqNombre){
	
		this.liqNombre = liqNombre;
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
		
	public Byte[] getLiqInivigencia(){
		return this.liqInivigencia;
	}
	
	public void setLiqInivigencia(Byte[] liqInivigencia){
	
		this.liqInivigencia = liqInivigencia;
	}
		
	public Date getLiqFinvigencia(){
		return this.liqFinvigencia;
	}
	
	public void setLiqFinvigencia(Date liqFinvigencia){
	
		this.liqFinvigencia = liqFinvigencia;
	}
		
	public String getLiqVenclasific(){
		return this.liqVenclasific;
	}
	
	public void setLiqVenclasific(String liqVenclasific){
	
		this.liqVenclasific = liqVenclasific;
	}
		
	public String getLiqEstado(){
		return this.liqEstado;
	}
	
	public void setLiqEstado(String liqEstado){
	
		this.liqEstado = liqEstado;
	}
		
	public String getLiqHistorico(){
		return this.liqHistorico;
	}
	
	public void setLiqHistorico(String liqHistorico){
	
		this.liqHistorico = liqHistorico;
	}
		
	public Integer getLiqDiavencim(){
		return this.liqDiavencim;
	}
	
	public void setLiqDiavencim(Integer liqDiavencim){
	
		this.liqDiavencim = liqDiavencim;
	}
		
	public Integer getLiqDiasuspens(){
		return this.liqDiasuspens;
	}
	
	public void setLiqDiasuspens(Integer liqDiasuspens){
	
		this.liqDiasuspens = liqDiasuspens;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public String getLiqTipcuota(){
		return this.liqTipcuota;
	}
	
	public void setLiqTipcuota(String liqTipcuota){
	
		this.liqTipcuota = liqTipcuota;
	}
		
	public String getLiqCtrventas(){
		return this.liqCtrventas;
	}
	
	public void setLiqCtrventas(String liqCtrventas){
	
		this.liqCtrventas = liqCtrventas;
	}
		
	public Long getHliqIderegistr(){
		return this.hliqIderegistr;
	}
	
	public void setHliqIderegistr(Long hliqIderegistr){
	
		this.hliqIderegistr = hliqIderegistr;
	}
		

    public List<ColiConliquida> getColiConliquidaUniLiquidacionFkeyesList(){
		return this.coliConliquidaUniLiquidacionFkeyes;
	}
	
	public void setColiConliquidaUniLiquidacionFkeyesList(List<ColiConliquida> coliConliquidaUniLiquidacionFkeyes){
		this.coliConliquidaUniLiquidacionFkeyes = coliConliquidaUniLiquidacionFkeyes;
	}
			
    public List<LiagLiqagenda> getLiagLiqagendaUniLiquidacionFkeyesList(){
		return this.liagLiqagendaUniLiquidacionFkeyes;
	}
	
	public void setLiagLiqagendaUniLiquidacionFkeyesList(List<LiagLiqagenda> liagLiqagendaUniLiquidacionFkeyes){
		this.liagLiqagendaUniLiquidacionFkeyes = liagLiqagendaUniLiquidacionFkeyes;
	}
			
    public List<LiesLiqespecial> getLiesLiqespecialUniLiquidacionFkeyesList(){
		return this.liesLiqespecialUniLiquidacionFkeyes;
	}
	
	public void setLiesLiqespecialUniLiquidacionFkeyesList(List<LiesLiqespecial> liesLiqespecialUniLiquidacionFkeyes){
		this.liesLiqespecialUniLiquidacionFkeyes = liesLiqespecialUniLiquidacionFkeyes;
	}
			

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_LIQ_LIQUIDACION) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadLiqLiquidacion() {
		return ATRIBUTOS_ENTIDAD_LIQ_LIQUIDACION;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);        
        hash = 37 * hash + Objects.hashCode(this.estLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.liqNombre);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.liqInivigencia);
        hash = 37 * hash + Objects.hashCode(this.liqFinvigencia);
        hash = 37 * hash + Objects.hashCode(this.liqVenclasific);
        hash = 37 * hash + Objects.hashCode(this.liqEstado);
        hash = 37 * hash + Objects.hashCode(this.liqHistorico);
        hash = 37 * hash + Objects.hashCode(this.liqDiavencim);
        hash = 37 * hash + Objects.hashCode(this.liqDiasuspens);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.liqTipcuota);
        hash = 37 * hash + Objects.hashCode(this.liqCtrventas);
        hash = 37 * hash + Objects.hashCode(this.hliqIderegistr);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad LiqLiquidacion que se pasa
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
        final LiqLiquidacion other = (LiqLiquidacion) obj;
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.estLiquidacion, other.estLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.liqNombre, other.liqNombre)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.liqInivigencia, other.liqInivigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.liqFinvigencia, other.liqFinvigencia)) {
            return false;
        }
        
        if (!Objects.equals(this.liqVenclasific, other.liqVenclasific)) {
            return false;
        }
        
        if (!Objects.equals(this.liqEstado, other.liqEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.liqHistorico, other.liqHistorico)) {
            return false;
        }
        
        if (!Objects.equals(this.liqDiavencim, other.liqDiavencim)) {
            return false;
        }
        
        if (!Objects.equals(this.liqDiasuspens, other.liqDiasuspens)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.liqTipcuota, other.liqTipcuota)) {
            return false;
        }
        
        if (!Objects.equals(this.liqCtrventas, other.liqCtrventas)) {
            return false;
        }
        
        return Objects.equals(this.hliqIderegistr, other.hliqIderegistr);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

