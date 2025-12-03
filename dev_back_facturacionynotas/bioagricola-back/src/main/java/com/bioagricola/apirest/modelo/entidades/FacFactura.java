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
@Table(name="fac_factura")
@NamedQuery(name = "FacFactura.findAll", query = "SELECT p FROM FacFactura p")
public class FacFactura implements Serializable{

	private static final long serialVersionUID = 1L;
	
	//Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_FAC_FACTURA_PK = "facIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_FAC_NUMERO = "facNumero";
	public static final String ENTIDAD_FAC_FACTURA_FAC_METGENERA = "facMetgenera";
	public static final String ENTIDAD_FAC_FACTURA_FAC_ESTADO = "facEstado";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECHA = "facFecha";
	public static final String ENTIDAD_FAC_FACTURA_FAC_IDEACTUAL = "facIdeactual";
	public static final String ENTIDAD_FAC_FACTURA_FAC_IDEPADRE = "facIdepadre";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECAPROBADA = "facFecaprobada";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECELIMINAD = "facFeceliminad";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECFINANCIA = "facFecfinancia";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECCASTIGAD = "facFeccastigad";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECVENCE = "facFecvence";
	public static final String ENTIDAD_FAC_FACTURA_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_SUS_IDEREGISTRO = "susIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_DSUS_IDEREGISTR = "dsusIderegistr";
	public static final String ENTIDAD_FAC_FACTURA_UNI_TIPSUSCRIPC = "uniTipsuscripc";
	public static final String ENTIDAD_FAC_FACTURA_UNI_TIPUSOSUSCR = "uniTipusosuscr";
	public static final String ENTIDAD_FAC_FACTURA_UNI_LIQUIDACION = "uniLiquidacion";
	public static final String ENTIDAD_FAC_FACTURA_TER_IDEREGISTRO = "terIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_CIC_IDEREGISTRO = "cicIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_PER_IDEREGISTRO = "perIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_UNI_DOCUMENTO = "uniDocumento";
	public static final String ENTIDAD_FAC_FACTURA_UNI_TIPDOCUMENT = "uniTipdocument";
	public static final String ENTIDAD_FAC_FACTURA_AMO_IDEREGISTRO = "amoIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_CIC_ANO = "cicAno";
	public static final String ENTIDAD_FAC_FACTURA_HLIQ_IDEREGISTR = "hliqIderegistr";
	public static final String ENTIDAD_FAC_FACTURA_FAC_SDOREAL = "facSdoreal";
	public static final String ENTIDAD_FAC_FACTURA_FAC_IDEORIGEN = "facIdeorigen";
	public static final String ENTIDAD_FAC_FACTURA_UNI_TIPTERCERO = "uniTiptercero";
	public static final String ENTIDAD_FAC_FACTURA_FAC_FECSUSPENS = "facFecsuspens";
	public static final String ENTIDAD_FAC_FACTURA_FIN_IDEREGISTRO = "finIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_FAC_VERSION = "facVersion";
	public static final String ENTIDAD_FAC_FACTURA_FAC_VLRREAL = "facVlrreal";
	public static final String ENTIDAD_FAC_FACTURA_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_MVI_IDEREGISTRO = "mviIderegistro";
	public static final String ENTIDAD_FAC_FACTURA_FAC_CTRLFELEC = "facCtrlfelec";
    private static final String[] ATRIBUTOS_ENTIDAD_FAC_FACTURA
            = {ENTIDAD_FAC_FACTURA_USU_IDEREGISTRO, ENTIDAD_FAC_FACTURA_SUS_IDEREGISTRO, ENTIDAD_FAC_FACTURA_FAC_FECHA, ENTIDAD_FAC_FACTURA_PER_IDEREGISTRO, ENTIDAD_FAC_FACTURA_UNI_TIPUSOSUSCR, ENTIDAD_FAC_FACTURA_FAC_FECELIMINAD, ENTIDAD_FAC_FACTURA_UNI_TIPDOCUMENT, ENTIDAD_FAC_FACTURA_MVI_IDEREGISTRO, ENTIDAD_FAC_FACTURA_UNI_TIPSUSCRIPC, ENTIDAD_FAC_FACTURA_FAC_FECSUSPENS, ENTIDAD_FAC_FACTURA_FIN_IDEREGISTRO, ENTIDAD_FAC_FACTURA_FAC_IDEACTUAL, ENTIDAD_FAC_FACTURA_DSUS_IDEREGISTR, ENTIDAD_FAC_FACTURA_CIC_IDEREGISTRO, ENTIDAD_FAC_FACTURA_FAC_METGENERA, ENTIDAD_FAC_FACTURA_FAC_CTRLFELEC, ENTIDAD_FAC_FACTURA_FAC_ESTADO, ENTIDAD_FAC_FACTURA_FAC_IDEORIGEN, ENTIDAD_FAC_FACTURA_FAC_IDEPADRE, ENTIDAD_FAC_FACTURA_UNI_LIQUIDACION, ENTIDAD_FAC_FACTURA_FAC_VLRREAL, ENTIDAD_FAC_FACTURA_PK, ENTIDAD_FAC_FACTURA_UNI_DOCUMENTO, ENTIDAD_FAC_FACTURA_HLIQ_IDEREGISTR, ENTIDAD_FAC_FACTURA_FAC_FECAPROBADA, ENTIDAD_FAC_FACTURA_FAC_NUMERO, ENTIDAD_FAC_FACTURA_FAC_FECFINANCIA, ENTIDAD_FAC_FACTURA_TER_IDEREGISTRO, ENTIDAD_FAC_FACTURA_CIC_ANO, ENTIDAD_FAC_FACTURA_UNI_TIPTERCERO, ENTIDAD_FAC_FACTURA_FAC_SDOREAL, ENTIDAD_FAC_FACTURA_FAC_FECCASTIGAD, ENTIDAD_FAC_FACTURA_FAC_FECVENCE, ENTIDAD_FAC_FACTURA_EMP_IDEREGISTRO, ENTIDAD_FAC_FACTURA_AMO_IDEREGISTRO, ENTIDAD_FAC_FACTURA_FAC_VERSION};

	@Id
    @Column(name="fac_ideregistro")
	private Long facIderegistro;

	@Column(name="fac_numero")
	private Long facNumero;
	
	@Column(name="fac_metgenera")
	@Size(min=0, max= 2)
	private String facMetgenera;
	
	@Column(name="fac_estado")
	@Size(min=0, max= 1)
	private String facEstado;
	
	@Column(name="fac_fecha")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFecha;
	
	@Column(name="fac_ideactual")
	private Long facIdeactual;
	
    @PodamExclude
	@Column(name="fac_idepadre")
	private Long facIdepadre;
	
	@Column(name="fac_fecaprobada")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFecaprobada;
	
	@Column(name="fac_feceliminad")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFeceliminad;
	
	@Column(name="fac_fecfinancia")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFecfinancia;
	
	@Column(name="fac_feccastigad")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFeccastigad;
	
	@Column(name="fac_fecvence")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFecvence;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="sus_ideregistro")
	private Long susIderegistro;
	
    @PodamExclude
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	
	@Column(name="uni_tipsuscripc")
	private Integer uniTipsuscripc;
	
	@Column(name="uni_tipusosuscr")
	private Integer uniTipusosuscr;
	
	@Column(name="uni_liquidacion")
	private Integer uniLiquidacion;
	
	@Column(name="ter_ideregistro")
	private Long terIderegistro;
	
	@Column(name="cic_ideregistro")
	private Integer cicIderegistro;
	
	@Column(name="per_ideregistro")
	private Integer perIderegistro;
	
    @PodamExclude
	@Column(name="uni_documento")
	private Integer uniDocumento;
	
    @PodamExclude
	@Column(name="uni_tipdocument")
	private Integer uniTipdocument;
	
	@Column(name="amo_ideregistro")
	private Long amoIderegistro;
	
	@Column(name="cic_ano")
	private Short cicAno;
	
	@Column(name="hliq_ideregistr")
	private Long hliqIderegistr;
	
	@Column(name="fac_sdoreal")
	private BigDecimal facSdoreal;
	
    @PodamExclude
	@Column(name="fac_ideorigen")
	private Long facIdeorigen;
	
	@Column(name="uni_tiptercero")
	private Integer uniTiptercero;
	
	@Column(name="fac_fecsuspens")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date facFecsuspens;
	
	@Column(name="fin_ideregistro")
	private Long finIderegistro;
	
	@Column(name="fac_version")
	private Integer facVersion;
	
	@Column(name="fac_vlrreal")
	private BigDecimal facVlrreal;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="mvi_ideregistro")
	private Long mviIderegistro;
	
	@Column(name="fac_ctrlfelec")
	private Short facCtrlfelec;
	

	@ManyToOne
	@JoinColumn(name="uni_documento", referencedColumnName="uni_documento", insertable = false, updatable = false)
	@PodamExclude
    private DocDocumento docDocumentofacFacturaDocDocumentoFkey;
    
		
	@ManyToOne
	@JoinColumn(name="dsus_ideregistr", referencedColumnName="dsus_ideregistr", insertable = false, updatable = false)
	@PodamExclude
    private DsusDetsuscrip dsusDetsuscripfacFacturaDsusIderegistrFkey;
    
		
	@ManyToOne
	@JoinColumn(name="fac_ideorigen", referencedColumnName="fac_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private FacFactura facFacturafacFacturaFacIdeorigenFkey;
    
		
	@ManyToOne
	@JoinColumn(name="fac_idepadre", referencedColumnName="fac_ideregistro", insertable = false, updatable = false)
	@PodamExclude
    private FacFactura facFacturafacFacturaFacIdepadreFkey;
    
		
	@ManyToOne
	@JoinColumn(name="uni_tipdocument", referencedColumnName="uni_tipdocument", insertable = false, updatable = false)
	@PodamExclude
    private TidoTipdocumen tidoTipdocumenfacFacturaTidoTipdocumenFkey;
    
		
	@OneToMany(mappedBy="facFacturadfacDetfacturaFacIderegistroFkey")
	@PodamExclude
    private List<DfacDetfactura> dfacDetfacturaFacIderegistroFkeyes;
	@OneToMany(mappedBy="facFacturafacFacturaFacIdeorigenFkey")
	@PodamExclude
    private List<FacFactura> facFacturaFacIdeorigenFkeyesHijos;
	@OneToMany(mappedBy="facFacturafacFacturaFacIdepadreFkey")
	@PodamExclude
    private List<FacFactura> facFacturaFacIdepadreFkeyesHijos;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end
	
    public FacFactura(){
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
    }


	public Long getFacIderegistro(){
		return this.facIderegistro;
	}
	
	public void setFacIderegistro(Long facIderegistro){
		this.facIderegistro = facIderegistro;
	}
	
	public Long getFacNumero(){
		return this.facNumero;
	}
	
	public void setFacNumero(Long facNumero){
	
		this.facNumero = facNumero;
	}
		
	public String getFacMetgenera(){
		return this.facMetgenera;
	}
	
	public void setFacMetgenera(String facMetgenera){
	
		this.facMetgenera = facMetgenera;
	}
		
	public String getFacEstado(){
		return this.facEstado;
	}
	
	public void setFacEstado(String facEstado){
	
		this.facEstado = facEstado;
	}
		
	public Date getFacFecha(){
		return this.facFecha;
	}
	
	public void setFacFecha(Date facFecha){
		this.facFecha = facFecha;
	}
		
	public Long getFacIdeactual(){
		return this.facIdeactual;
	}
	
	public void setFacIdeactual(Long facIdeactual){
	
		this.facIdeactual = facIdeactual;
	}
		
	public Long getFacIdepadre(){
		return this.facIdepadre;
	}
	
	public void setFacIdepadre(Long facIdepadre){
	
		this.facIdepadre = facIdepadre;
	}
		
	public Date getFacFecaprobada(){
		return this.facFecaprobada;
	}
	
	public void setFacFecaprobada(Date facFecaprobada){
	
		this.facFecaprobada = facFecaprobada;
	}
		
	public Date getFacFeceliminad(){
		return this.facFeceliminad;
	}
	
	public void setFacFeceliminad(Date facFeceliminad){
	
		this.facFeceliminad = facFeceliminad;
	}
		
	public Date getFacFecfinancia(){
		return this.facFecfinancia;
	}
	
	public void setFacFecfinancia(Date facFecfinancia){
	
		this.facFecfinancia = facFecfinancia;
	}
		
	public Date getFacFeccastigad(){
		return this.facFeccastigad;
	}
	
	public void setFacFeccastigad(Date facFeccastigad){
	
		this.facFeccastigad = facFeccastigad;
	}
		
	public Date getFacFecvence(){
		return this.facFecvence;
	}
	
	public void setFacFecvence(Date facFecvence){
	
		this.facFecvence = facFecvence;
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
		
	public Long getDsusIderegistr(){
		return this.dsusIderegistr;
	}
	
	public void setDsusIderegistr(Long dsusIderegistr){
	
		this.dsusIderegistr = dsusIderegistr;
	}
		
	public Integer getUniTipsuscripc(){
		return this.uniTipsuscripc;
	}
	
	public void setUniTipsuscripc(Integer uniTipsuscripc){
	
		this.uniTipsuscripc = uniTipsuscripc;
	}
		
	public Integer getUniTipusosuscr(){
		return this.uniTipusosuscr;
	}
	
	public void setUniTipusosuscr(Integer uniTipusosuscr){
	
		this.uniTipusosuscr = uniTipusosuscr;
	}
		
	public Integer getUniLiquidacion(){
		return this.uniLiquidacion;
	}
	
	public void setUniLiquidacion(Integer uniLiquidacion){
	
		this.uniLiquidacion = uniLiquidacion;
	}
		
	public Long getTerIderegistro(){
		return this.terIderegistro;
	}
	
	public void setTerIderegistro(Long terIderegistro){
	
		this.terIderegistro = terIderegistro;
	}
		
	public Integer getCicIderegistro(){
		return this.cicIderegistro;
	}
	
	public void setCicIderegistro(Integer cicIderegistro){
	
		this.cicIderegistro = cicIderegistro;
	}
		
	public Integer getPerIderegistro(){
		return this.perIderegistro;
	}
	
	public void setPerIderegistro(Integer perIderegistro){
	
		this.perIderegistro = perIderegistro;
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
		
	public Long getAmoIderegistro(){
		return this.amoIderegistro;
	}
	
	public void setAmoIderegistro(Long amoIderegistro){
	
		this.amoIderegistro = amoIderegistro;
	}
		
	public Short getCicAno(){
		return this.cicAno;
	}
	
	public void setCicAno(Short cicAno){
	
		this.cicAno = cicAno;
	}
		
	public Long getHliqIderegistr(){
		return this.hliqIderegistr;
	}
	
	public void setHliqIderegistr(Long hliqIderegistr){
	
		this.hliqIderegistr = hliqIderegistr;
	}
		
	public BigDecimal getFacSdoreal(){
		return this.facSdoreal;
	}
	
	public void setFacSdoreal(BigDecimal facSdoreal){
	
		this.facSdoreal = facSdoreal;
	}
		
	public Long getFacIdeorigen(){
		return this.facIdeorigen;
	}
	
	public void setFacIdeorigen(Long facIdeorigen){
	
		this.facIdeorigen = facIdeorigen;
	}
		
	public Integer getUniTiptercero(){
		return this.uniTiptercero;
	}
	
	public void setUniTiptercero(Integer uniTiptercero){
	
		this.uniTiptercero = uniTiptercero;
	}
		
	public Date getFacFecsuspens(){
		return this.facFecsuspens;
	}
	
	public void setFacFecsuspens(Date facFecsuspens){
	
		this.facFecsuspens = facFecsuspens;
	}
		
	public Long getFinIderegistro(){
		return this.finIderegistro;
	}
	
	public void setFinIderegistro(Long finIderegistro){
	
		this.finIderegistro = finIderegistro;
	}
		
	public Integer getFacVersion(){
		return this.facVersion;
	}
	
	public void setFacVersion(Integer facVersion){
	
		this.facVersion = facVersion;
	}
		
	public BigDecimal getFacVlrreal(){
		return this.facVlrreal;
	}
	
	public void setFacVlrreal(BigDecimal facVlrreal){
	
		this.facVlrreal = facVlrreal;
	}
		
	public Integer getUsuIderegistro(){
		return this.usuIderegistro;
	}
	
	public void setUsuIderegistro(Integer usuIderegistro){
	
		this.usuIderegistro = usuIderegistro;
	}
		
	public Long getMviIderegistro(){
		return this.mviIderegistro;
	}
	
	public void setMviIderegistro(Long mviIderegistro){
	
		this.mviIderegistro = mviIderegistro;
	}
		
	public Short getFacCtrlfelec(){
		return this.facCtrlfelec;
	}
	
	public void setFacCtrlfelec(Short facCtrlfelec){
	
		this.facCtrlfelec = facCtrlfelec;
	}
		

    public List<DfacDetfactura> getDfacDetfacturaFacIderegistroFkeyesList(){
		return this.dfacDetfacturaFacIderegistroFkeyes;
	}
	
	public void setDfacDetfacturaFacIderegistroFkeyesList(List<DfacDetfactura> dfacDetfacturaFacIderegistroFkeyes){
		this.dfacDetfacturaFacIderegistroFkeyes = dfacDetfacturaFacIderegistroFkeyes;
	}
			
    public List<FacFactura> getFacFacturaFacIdeorigenFkeyesHijosList(){
		return this.facFacturaFacIdeorigenFkeyesHijos;
	}
	
	public void setFacFacturaFacIdeorigenFkeyesHijosList(List<FacFactura> facFacturaFacIdeorigenFkeyesHijos){
		this.facFacturaFacIdeorigenFkeyesHijos = facFacturaFacIdeorigenFkeyesHijos;
	}
			
    public List<FacFactura> getFacFacturaFacIdepadreFkeyesHijosList(){
		return this.facFacturaFacIdepadreFkeyesHijos;
	}
	
	public void setFacFacturaFacIdepadreFkeyesHijosList(List<FacFactura> facFacturaFacIdepadreFkeyesHijos){
		this.facFacturaFacIdepadreFkeyesHijos = facFacturaFacIdepadreFkeyesHijos;
	}
			
    public DocDocumento getDocDocumentofacFacturaDocDocumentoFkey(){
		return this.docDocumentofacFacturaDocDocumentoFkey; 
	}
	
	public void setDocDocumentofacFacturaDocDocumentoFkey(DocDocumento docDocumentofacFacturaDocDocumentoFkey){
		this.docDocumentofacFacturaDocDocumentoFkey = docDocumentofacFacturaDocDocumentoFkey;
	}
    public DsusDetsuscrip getDsusDetsuscripfacFacturaDsusIderegistrFkey(){
		return this.dsusDetsuscripfacFacturaDsusIderegistrFkey; 
	}
	
	public void setDsusDetsuscripfacFacturaDsusIderegistrFkey(DsusDetsuscrip dsusDetsuscripfacFacturaDsusIderegistrFkey){
		this.dsusDetsuscripfacFacturaDsusIderegistrFkey = dsusDetsuscripfacFacturaDsusIderegistrFkey;
	}
    public FacFactura getFacFacturafacFacturaFacIdeorigenFkey(){
		return this.facFacturafacFacturaFacIdeorigenFkey; 
	}
	
	public void setFacFacturafacFacturaFacIdeorigenFkey(FacFactura facFacturafacFacturaFacIdeorigenFkey){
		this.facFacturafacFacturaFacIdeorigenFkey = facFacturafacFacturaFacIdeorigenFkey;
	}
    public FacFactura getFacFacturafacFacturaFacIdepadreFkey(){
		return this.facFacturafacFacturaFacIdepadreFkey; 
	}
	
	public void setFacFacturafacFacturaFacIdepadreFkey(FacFactura facFacturafacFacturaFacIdepadreFkey){
		this.facFacturafacFacturaFacIdepadreFkey = facFacturafacFacturaFacIdepadreFkey;
	}
    public TidoTipdocumen getTidoTipdocumenfacFacturaTidoTipdocumenFkey(){
		return this.tidoTipdocumenfacFacturaTidoTipdocumenFkey; 
	}
	
	public void setTidoTipdocumenfacFacturaTidoTipdocumenFkey(TidoTipdocumen tidoTipdocumenfacFacturaTidoTipdocumenFkey){
		this.tidoTipdocumenfacFacturaTidoTipdocumenFkey = tidoTipdocumenfacFacturaTidoTipdocumenFkey;
	}

	/**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {
		
		boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_FAC_FACTURA) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }
    
    public static String[] getAtributosEntidadFacFactura() {
		return ATRIBUTOS_ENTIDAD_FAC_FACTURA;
	}

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;
        
        hash = 37 * hash + Objects.hashCode(this.facIderegistro);        
        hash = 37 * hash + Objects.hashCode(this.facNumero);
        hash = 37 * hash + Objects.hashCode(this.facMetgenera);
        hash = 37 * hash + Objects.hashCode(this.facEstado);
        hash = 37 * hash + Objects.hashCode(this.facFecha);
        hash = 37 * hash + Objects.hashCode(this.facIdeactual);
        hash = 37 * hash + Objects.hashCode(this.facIdepadre);
        hash = 37 * hash + Objects.hashCode(this.facFecaprobada);
        hash = 37 * hash + Objects.hashCode(this.facFeceliminad);
        hash = 37 * hash + Objects.hashCode(this.facFecfinancia);
        hash = 37 * hash + Objects.hashCode(this.facFeccastigad);
        hash = 37 * hash + Objects.hashCode(this.facFecvence);
        hash = 37 * hash + Objects.hashCode(this.empIderegistro);
        hash = 37 * hash + Objects.hashCode(this.susIderegistro);
        hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
        hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
        hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
        hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
        hash = 37 * hash + Objects.hashCode(this.terIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.amoIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.hliqIderegistr);
        hash = 37 * hash + Objects.hashCode(this.facSdoreal);
        hash = 37 * hash + Objects.hashCode(this.facIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.uniTiptercero);
        hash = 37 * hash + Objects.hashCode(this.facFecsuspens);
        hash = 37 * hash + Objects.hashCode(this.finIderegistro);
        hash = 37 * hash + Objects.hashCode(this.facVersion);
        hash = 37 * hash + Objects.hashCode(this.facVlrreal);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);
        hash = 37 * hash + Objects.hashCode(this.facCtrlfelec);
        
        return hash;
    }

	/**
     * Valida la igualdad de la instancia de la entidad FacFactura que se pasa
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
        final FacFactura other = (FacFactura) obj;
        
        if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.facNumero, other.facNumero)) {
            return false;
        }
        
        if (!Objects.equals(this.facMetgenera, other.facMetgenera)) {
            return false;
        }
        
        if (!Objects.equals(this.facEstado, other.facEstado)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecha, other.facFecha)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdeactual, other.facIdeactual)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdepadre, other.facIdepadre)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecaprobada, other.facFecaprobada)) {
            return false;
        }
        
        if (!Objects.equals(this.facFeceliminad, other.facFeceliminad)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecfinancia, other.facFecfinancia)) {
            return false;
        }
        
        if (!Objects.equals(this.facFeccastigad, other.facFeccastigad)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecvence, other.facFecvence)) {
            return false;
        }
        
        if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
            return false;
        }
        
        if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
            return false;
        }
        
        if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }
        
        if (!Objects.equals(this.amoIderegistro, other.amoIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.cicAno, other.cicAno)) {
            return false;
        }
        
        if (!Objects.equals(this.hliqIderegistr, other.hliqIderegistr)) {
            return false;
        }
        
        if (!Objects.equals(this.facSdoreal, other.facSdoreal)) {
            return false;
        }
        
        if (!Objects.equals(this.facIdeorigen, other.facIdeorigen)) {
            return false;
        }
        
        if (!Objects.equals(this.uniTiptercero, other.uniTiptercero)) {
            return false;
        }
        
        if (!Objects.equals(this.facFecsuspens, other.facFecsuspens)) {
            return false;
        }
        
        if (!Objects.equals(this.finIderegistro, other.finIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.facVersion, other.facVersion)) {
            return false;
        }
        
        if (!Objects.equals(this.facVlrreal, other.facVlrreal)) {
            return false;
        }
        
        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }
        
        if (!Objects.equals(this.mviIderegistro, other.mviIderegistro)) {
            return false;
        }
        
        return Objects.equals(this.facCtrlfelec, other.facCtrlfelec);
                
    }
	
	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

} 

