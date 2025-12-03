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
import javax.persistence.JoinColumns;
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
@Table(name = "dsus_detsuscrip")
@NamedQuery(name = "DsusDetsuscrip.findAll", query = "SELECT p FROM DsusDetsuscrip p")
public class DsusDetsuscrip implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_DSUS_DETSUSCRIP_PK = "dsusIderegistr";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_ESTADO = "dsusEstado";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_DESCRIPCION = "dsusDescripcion";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_PCODIGO = "dsusPcodigo";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_SUS_IDEREGISTRO = "susIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_TER_IDEREGISTRO = "terIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_PRO_IDEREGISTRO = "proIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_MUNICIPIO = "uniMunicipio";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_BARRIO = "uniBarrio";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_EST_TIPSUSCRIPC = "estTipsuscripc";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_TIPSUSCRIPC = "uniTipsuscripc";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_EST_TIPUSOSUSCR = "estTipusosuscr";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_TIPUSOSUSCR = "uniTipusosuscr";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_EMP_IDEREGISTRO = "empIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_EST_LIQUIDACION = "estLiquidacion";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_LIQUIDACION = "uniLiquidacion";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_CIC_IDEREGISTRO = "cicIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_FECINICIO = "dsusFecinicio";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_FECEXPIRA = "dsusFecexpira";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_PRO_CATESTRATO = "proCatestrato";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_INIESTADO = "dsusIniestado";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_FINESTADO = "dsusFinestado";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_FACTOR = "dsusFactor";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_UNI_ACTSUSCRIPC = "uniActsuscripc";
	public static final String ENTIDAD_DSUS_DETSUSCRIP_DSUS_RESOLESTRATO = "dsusResolestrato";
	private static final String[] ATRIBUTOS_ENTIDAD_DSUS_DETSUSCRIP = { ENTIDAD_DSUS_DETSUSCRIP_UNI_TIPUSOSUSCR,
			ENTIDAD_DSUS_DETSUSCRIP_SUS_IDEREGISTRO, ENTIDAD_DSUS_DETSUSCRIP_DSUS_INIESTADO,
			ENTIDAD_DSUS_DETSUSCRIP_EST_LIQUIDACION, ENTIDAD_DSUS_DETSUSCRIP_USU_IDEREGISTRO,
			ENTIDAD_DSUS_DETSUSCRIP_DSUS_DESCRIPCION, ENTIDAD_DSUS_DETSUSCRIP_DSUS_FECINICIO,
			ENTIDAD_DSUS_DETSUSCRIP_PRO_CATESTRATO, ENTIDAD_DSUS_DETSUSCRIP_PRO_IDEREGISTRO,
			ENTIDAD_DSUS_DETSUSCRIP_CIC_IDEREGISTRO, ENTIDAD_DSUS_DETSUSCRIP_UNI_MUNICIPIO,
			ENTIDAD_DSUS_DETSUSCRIP_UNI_TIPSUSCRIPC, ENTIDAD_DSUS_DETSUSCRIP_PK, ENTIDAD_DSUS_DETSUSCRIP_DSUS_ESTADO,
			ENTIDAD_DSUS_DETSUSCRIP_DSUS_RESOLESTRATO, ENTIDAD_DSUS_DETSUSCRIP_EST_TIPSUSCRIPC,
			ENTIDAD_DSUS_DETSUSCRIP_DSUS_PCODIGO, ENTIDAD_DSUS_DETSUSCRIP_DSUS_FACTOR,
			ENTIDAD_DSUS_DETSUSCRIP_TER_IDEREGISTRO, ENTIDAD_DSUS_DETSUSCRIP_EST_TIPUSOSUSCR,
			ENTIDAD_DSUS_DETSUSCRIP_UNI_LIQUIDACION, ENTIDAD_DSUS_DETSUSCRIP_DSUS_FECEXPIRA,
			ENTIDAD_DSUS_DETSUSCRIP_UNI_ACTSUSCRIPC, ENTIDAD_DSUS_DETSUSCRIP_UNI_BARRIO,
			ENTIDAD_DSUS_DETSUSCRIP_EMP_IDEREGISTRO, ENTIDAD_DSUS_DETSUSCRIP_DSUS_FINESTADO };

	@Id
	@Column(name = "dsus_ideregistr")
	private Long dsusIderegistr;

	@Column(name = "dsus_estado")
	@Size(min = 0, max = 1)
	private String dsusEstado;

	@Column(name = "dsus_descripcion")
	@Size(min = 0, max = 50)
	private String dsusDescripcion;

	@Column(name = "dsus_pcodigo")
	@Size(min = 0, max = 20)
	private String dsusPcodigo;

	@PodamExclude
	@Column(name = "sus_ideregistro")
	private Long susIderegistro;

	@PodamExclude
	@Column(name = "ter_ideregistro")
	private Long terIderegistro;

	@Column(name = "pro_ideregistro")
	private Long proIderegistro;

	@Column(name = "uni_municipio")
	private Integer uniMunicipio;

	@Column(name = "uni_barrio")
	private Integer uniBarrio;

	@Column(name = "est_tipsuscripc")
	private Integer estTipsuscripc;

	@Column(name = "uni_tipsuscripc")
	private Integer uniTipsuscripc;

	@Column(name = "est_tipusosuscr")
	private Integer estTipusosuscr;

	@Column(name = "uni_tipusosuscr")
	private Integer uniTipusosuscr;

	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@Column(name = "est_liquidacion")
	private Integer estLiquidacion;

	@Column(name = "uni_liquidacion")
	private Integer uniLiquidacion;

	@Column(name = "cic_ideregistro")
	private Integer cicIderegistro;

	@Column(name = "dsus_fecinicio")
	@Temporal(javax.persistence.TemporalType.DATE)
	private Date dsusFecinicio;

	@Column(name = "dsus_fecexpira")
	@Temporal(javax.persistence.TemporalType.DATE)
	private Date dsusFecexpira;

	@Column(name = "pro_catestrato")
	private Short proCatestrato;

	@Column(name = "dsus_iniestado")
	@Temporal(javax.persistence.TemporalType.DATE)
	private Date dsusIniestado;

	@Column(name = "dsus_finestado")
	@Temporal(javax.persistence.TemporalType.DATE)
	private Date dsusFinestado;

	@Column(name = "dsus_factor")
	private BigDecimal dsusFactor;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name = "uni_actsuscripc")
	private Integer uniActsuscripc;

	@Column(name = "dsus_resolestrato")
	@Size(min = 0, max = 50)
	private String dsusResolestrato;

	@ManyToOne
	@JoinColumn(name = "sus_ideregistro", referencedColumnName = "sus_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private SusSuscripcion susSuscripciondsusDetsuscripSusIderegistroFkey;

	@ManyToOne
	@JoinColumn(name = "ter_ideregistro", referencedColumnName = "ter_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private TerTercero terTercerodsusDetsuscripTerIderegistroFkey;

	@OneToMany(mappedBy = "dsusDetsuscripfacFacturaDsusIderegistrFkey")
	@PodamExclude
	private List<FacFactura> facFacturaDsusIderegistrFkeyes;
	@OneToMany(mappedBy = "dsusDetsuscripliesLiqespecialDsusIderegistrFkey")
	@PodamExclude
	private List<LiesLiqespecial> liesLiqespecialDsusIderegistrFkeyes;

	// bi-directional many-to-one association to CiemCicempresa
	@ManyToOne
	@JoinColumns({
			@JoinColumn(name = "cic_ideregistro", referencedColumnName = "cic_ideregistro", insertable = false, updatable = false),
			@JoinColumn(name = "emp_ideregistro", referencedColumnName = "emp_ideregistro", insertable = false, updatable = false) })
	private CiemCicempresa ciemCicempresa;

	// bi-directional many-to-one association to CosuConsuscrip
	@OneToMany(mappedBy = "dsusDetsuscrip")
	@PodamExclude
	private List<CosuConsuscrip> cosuConsuscrips;

	// bi-directional many-to-one association to NotNota
	@OneToMany(mappedBy = "dsusDetsuscrip")
	private List<NotNota> notNotas;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public DsusDetsuscrip() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public Long getDsusIderegistr() {
		return this.dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {

		this.dsusIderegistr = dsusIderegistr;
	}

	public String getDsusEstado() {
		return this.dsusEstado;
	}

	public void setDsusEstado(String dsusEstado) {

		this.dsusEstado = dsusEstado;
	}

	public String getDsusDescripcion() {
		return this.dsusDescripcion;
	}

	public void setDsusDescripcion(String dsusDescripcion) {

		this.dsusDescripcion = dsusDescripcion;
	}

	public String getDsusPcodigo() {
		return this.dsusPcodigo;
	}

	public void setDsusPcodigo(String dsusPcodigo) {

		this.dsusPcodigo = dsusPcodigo;
	}

	public Long getSusIderegistro() {
		return this.susIderegistro;
	}

	public void setSusIderegistro(Long susIderegistro) {

		this.susIderegistro = susIderegistro;
	}

	public Long getTerIderegistro() {
		return this.terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {

		this.terIderegistro = terIderegistro;
	}

	public Long getProIderegistro() {
		return this.proIderegistro;
	}

	public void setProIderegistro(Long proIderegistro) {

		this.proIderegistro = proIderegistro;
	}

	public Integer getUniMunicipio() {
		return this.uniMunicipio;
	}

	public void setUniMunicipio(Integer uniMunicipio) {

		this.uniMunicipio = uniMunicipio;
	}

	public Integer getUniBarrio() {
		return this.uniBarrio;
	}

	public void setUniBarrio(Integer uniBarrio) {

		this.uniBarrio = uniBarrio;
	}

	public Integer getEstTipsuscripc() {
		return this.estTipsuscripc;
	}

	public void setEstTipsuscripc(Integer estTipsuscripc) {

		this.estTipsuscripc = estTipsuscripc;
	}

	public Integer getUniTipsuscripc() {
		return this.uniTipsuscripc;
	}

	public void setUniTipsuscripc(Integer uniTipsuscripc) {

		this.uniTipsuscripc = uniTipsuscripc;
	}

	public Integer getEstTipusosuscr() {
		return this.estTipusosuscr;
	}

	public void setEstTipusosuscr(Integer estTipusosuscr) {

		this.estTipusosuscr = estTipusosuscr;
	}

	public Integer getUniTipusosuscr() {
		return this.uniTipusosuscr;
	}

	public void setUniTipusosuscr(Integer uniTipusosuscr) {

		this.uniTipusosuscr = uniTipusosuscr;
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {

		this.empIderegistro = empIderegistro;
	}

	public Integer getEstLiquidacion() {
		return this.estLiquidacion;
	}

	public void setEstLiquidacion(Integer estLiquidacion) {

		this.estLiquidacion = estLiquidacion;
	}

	public Integer getUniLiquidacion() {
		return this.uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {

		this.uniLiquidacion = uniLiquidacion;
	}

	public Integer getCicIderegistro() {
		return this.cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {

		this.cicIderegistro = cicIderegistro;
	}

	public Date getDsusFecinicio() {
		return this.dsusFecinicio;
	}

	public void setDsusFecinicio(Date dsusFecinicio) {

		this.dsusFecinicio = dsusFecinicio;
	}

	public Date getDsusFecexpira() {
		return this.dsusFecexpira;
	}

	public void setDsusFecexpira(Date dsusFecexpira) {

		this.dsusFecexpira = dsusFecexpira;
	}

	public Short getProCatestrato() {
		return this.proCatestrato;
	}

	public void setProCatestrato(Short proCatestrato) {

		this.proCatestrato = proCatestrato;
	}

	public Date getDsusIniestado() {
		return this.dsusIniestado;
	}

	public void setDsusIniestado(Date dsusIniestado) {

		this.dsusIniestado = dsusIniestado;
	}

	public Date getDsusFinestado() {
		return this.dsusFinestado;
	}

	public void setDsusFinestado(Date dsusFinestado) {

		this.dsusFinestado = dsusFinestado;
	}

	public BigDecimal getDsusFactor() {
		return this.dsusFactor;
	}

	public void setDsusFactor(BigDecimal dsusFactor) {

		this.dsusFactor = dsusFactor;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public Integer getUniActsuscripc() {
		return this.uniActsuscripc;
	}

	public void setUniActsuscripc(Integer uniActsuscripc) {

		this.uniActsuscripc = uniActsuscripc;
	}

	public String getDsusResolestrato() {
		return this.dsusResolestrato;
	}

	public void setDsusResolestrato(String dsusResolestrato) {

		this.dsusResolestrato = dsusResolestrato;
	}

	public List<FacFactura> getFacFacturaDsusIderegistrFkeyesList() {
		return this.facFacturaDsusIderegistrFkeyes;
	}

	public void setFacFacturaDsusIderegistrFkeyesList(List<FacFactura> facFacturaDsusIderegistrFkeyes) {
		this.facFacturaDsusIderegistrFkeyes = facFacturaDsusIderegistrFkeyes;
	}

	public List<LiesLiqespecial> getLiesLiqespecialDsusIderegistrFkeyesList() {
		return this.liesLiqespecialDsusIderegistrFkeyes;
	}

	public void setLiesLiqespecialDsusIderegistrFkeyesList(List<LiesLiqespecial> liesLiqespecialDsusIderegistrFkeyes) {
		this.liesLiqespecialDsusIderegistrFkeyes = liesLiqespecialDsusIderegistrFkeyes;
	}

	public SusSuscripcion getSusSuscripciondsusDetsuscripSusIderegistroFkey() {
		return this.susSuscripciondsusDetsuscripSusIderegistroFkey;
	}

	public void setSusSuscripciondsusDetsuscripSusIderegistroFkey(
			SusSuscripcion susSuscripciondsusDetsuscripSusIderegistroFkey) {
		this.susSuscripciondsusDetsuscripSusIderegistroFkey = susSuscripciondsusDetsuscripSusIderegistroFkey;
	}

	public TerTercero getTerTercerodsusDetsuscripTerIderegistroFkey() {
		return this.terTercerodsusDetsuscripTerIderegistroFkey;
	}

	public void setTerTercerodsusDetsuscripTerIderegistroFkey(TerTercero terTercerodsusDetsuscripTerIderegistroFkey) {
		this.terTercerodsusDetsuscripTerIderegistroFkey = terTercerodsusDetsuscripTerIderegistroFkey;
	}

	public CiemCicempresa getCiemCicempresa() {
		return this.ciemCicempresa;
	}

	public void setCiemCicempresa(CiemCicempresa ciemCicempresa) {
		this.ciemCicempresa = ciemCicempresa;
	}

	public List<NotNota> getNotNotas() {
		return notNotas;
	}

	public void setNotNotas(List<NotNota> notNotas) {
		this.notNotas = notNotas;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_DSUS_DETSUSCRIP) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadDsusDetsuscrip() {
		return ATRIBUTOS_ENTIDAD_DSUS_DETSUSCRIP;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.dsusIderegistr);
		hash = 37 * hash + Objects.hashCode(this.dsusEstado);
		hash = 37 * hash + Objects.hashCode(this.dsusDescripcion);
		hash = 37 * hash + Objects.hashCode(this.dsusPcodigo);
		hash = 37 * hash + Objects.hashCode(this.susIderegistro);
		hash = 37 * hash + Objects.hashCode(this.terIderegistro);
		hash = 37 * hash + Objects.hashCode(this.proIderegistro);
		hash = 37 * hash + Objects.hashCode(this.uniMunicipio);
		hash = 37 * hash + Objects.hashCode(this.uniBarrio);
		hash = 37 * hash + Objects.hashCode(this.estTipsuscripc);
		hash = 37 * hash + Objects.hashCode(this.uniTipsuscripc);
		hash = 37 * hash + Objects.hashCode(this.estTipusosuscr);
		hash = 37 * hash + Objects.hashCode(this.uniTipusosuscr);
		hash = 37 * hash + Objects.hashCode(this.empIderegistro);
		hash = 37 * hash + Objects.hashCode(this.estLiquidacion);
		hash = 37 * hash + Objects.hashCode(this.uniLiquidacion);
		hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
		hash = 37 * hash + Objects.hashCode(this.dsusFecinicio);
		hash = 37 * hash + Objects.hashCode(this.dsusFecexpira);
		hash = 37 * hash + Objects.hashCode(this.proCatestrato);
		hash = 37 * hash + Objects.hashCode(this.dsusIniestado);
		hash = 37 * hash + Objects.hashCode(this.dsusFinestado);
		hash = 37 * hash + Objects.hashCode(this.dsusFactor);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
		hash = 37 * hash + Objects.hashCode(this.uniActsuscripc);
		hash = 37 * hash + Objects.hashCode(this.dsusResolestrato);

		return hash;
	}

	/**
	 * Valida la igualdad de la instancia de la entidad DsusDetsuscrip que se pasa
	 * como parámetro comprobando que comparten los mismos valores en cada uno de
	 * sus atributos. Solo se tienen en cuenta los atributos simples, es decir, se
	 * omiten aquellos que definen una relación con otra tabla.
	 *
	 * @param obj Instancia de la categoría a comprobar iguales.
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
		final DsusDetsuscrip other = (DsusDetsuscrip) obj;

		if (!Objects.equals(this.dsusIderegistr, other.dsusIderegistr)) {
			return false;
		}

		if (!Objects.equals(this.dsusEstado, other.dsusEstado)) {
			return false;
		}

		if (!Objects.equals(this.dsusDescripcion, other.dsusDescripcion)) {
			return false;
		}

		if (!Objects.equals(this.dsusPcodigo, other.dsusPcodigo)) {
			return false;
		}

		if (!Objects.equals(this.susIderegistro, other.susIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.terIderegistro, other.terIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.proIderegistro, other.proIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.uniMunicipio, other.uniMunicipio)) {
			return false;
		}

		if (!Objects.equals(this.uniBarrio, other.uniBarrio)) {
			return false;
		}

		if (!Objects.equals(this.estTipsuscripc, other.estTipsuscripc)) {
			return false;
		}

		if (!Objects.equals(this.uniTipsuscripc, other.uniTipsuscripc)) {
			return false;
		}

		if (!Objects.equals(this.estTipusosuscr, other.estTipusosuscr)) {
			return false;
		}

		if (!Objects.equals(this.uniTipusosuscr, other.uniTipusosuscr)) {
			return false;
		}

		if (!Objects.equals(this.empIderegistro, other.empIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.estLiquidacion, other.estLiquidacion)) {
			return false;
		}

		if (!Objects.equals(this.uniLiquidacion, other.uniLiquidacion)) {
			return false;
		}

		if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.dsusFecinicio, other.dsusFecinicio)) {
			return false;
		}

		if (!Objects.equals(this.dsusFecexpira, other.dsusFecexpira)) {
			return false;
		}

		if (!Objects.equals(this.proCatestrato, other.proCatestrato)) {
			return false;
		}

		if (!Objects.equals(this.dsusIniestado, other.dsusIniestado)) {
			return false;
		}

		if (!Objects.equals(this.dsusFinestado, other.dsusFinestado)) {
			return false;
		}

		if (!Objects.equals(this.dsusFactor, other.dsusFactor)) {
			return false;
		}

		if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.uniActsuscripc, other.uniActsuscripc)) {
			return false;
		}

		return Objects.equals(this.dsusResolestrato, other.dsusResolestrato);

	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
