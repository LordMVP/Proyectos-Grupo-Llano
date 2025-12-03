package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import javax.persistence.*;
import javax.validation.constraints.Size;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name = "dfac_detfactura")
@NamedQuery(name = "DfacDetfactura.findAll", query = "SELECT p FROM DfacDetfactura p")
public class DfacDetfactura implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_DFAC_DETFACTURA_PK = "dfacIderegistr";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_ESTADO = "dfacEstado";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_IDEORIGEN = "dfacIdeorigen";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_CANTIDAD = "dfacCantidad";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_VLRUNITARI = "dfacVlrunitari";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_VLRTOTAL = "dfacVlrtotal";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_VLRREAL = "dfacVlrreal";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_SDOREAL = "dfacSdoreal";
	public static final String ENTIDAD_DFAC_DETFACTURA_FAC_IDEREGISTRO = "facIderegistro";
	public static final String ENTIDAD_DFAC_DETFACTURA_UNI_CONCEPTO = "uniConcepto";
	public static final String ENTIDAD_DFAC_DETFACTURA_DAMO_IDEREGISTR = "damoIderegistr";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_IDEPADRE = "dfacIdepadre";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFIN_IDEREGISTR = "dfinIderegistr";
	public static final String ENTIDAD_DFAC_DETFACTURA_DFAC_VERSION = "dfacVersion";
	public static final String ENTIDAD_DFAC_DETFACTURA_SCO_IDEREGISTRO = "scoIderegistro";
	public static final String ENTIDAD_DFAC_DETFACTURA_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_DFAC_DETFACTURA_MVMC_IDEREGISTR = "mvmcIderegistr";
	public static final String ENTIDAD_DFAC_DETFACTURA_EMP_IDEREGISTRO = "empIderegistro";

	private static final String[] ATRIBUTOS_ENTIDAD_DFAC_DETFACTURA = { ENTIDAD_DFAC_DETFACTURA_DFAC_IDEORIGEN,
			ENTIDAD_DFAC_DETFACTURA_PK, ENTIDAD_DFAC_DETFACTURA_UNI_CONCEPTO, ENTIDAD_DFAC_DETFACTURA_DFAC_IDEPADRE,
			ENTIDAD_DFAC_DETFACTURA_DFAC_VLRUNITARI, ENTIDAD_DFAC_DETFACTURA_DFAC_VLRREAL,
			ENTIDAD_DFAC_DETFACTURA_SCO_IDEREGISTRO, ENTIDAD_DFAC_DETFACTURA_MVMC_IDEREGISTR,
			ENTIDAD_DFAC_DETFACTURA_DFAC_CANTIDAD, ENTIDAD_DFAC_DETFACTURA_DFIN_IDEREGISTR,
			ENTIDAD_DFAC_DETFACTURA_DFAC_VERSION, ENTIDAD_DFAC_DETFACTURA_USU_IDEREGISTRO,
			ENTIDAD_DFAC_DETFACTURA_DFAC_SDOREAL, ENTIDAD_DFAC_DETFACTURA_FAC_IDEREGISTRO,
			ENTIDAD_DFAC_DETFACTURA_DFAC_VLRTOTAL, ENTIDAD_DFAC_DETFACTURA_DAMO_IDEREGISTR,
			ENTIDAD_DFAC_DETFACTURA_DFAC_ESTADO, ENTIDAD_DFAC_DETFACTURA_EMP_IDEREGISTRO };

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dfac_ideregistr")
	private Long dfacIderegistr;

	@Column(name = "dfac_estado")
	@Size(min = 0, max = 1)
	private String dfacEstado;

	@Column(name = "dfac_ideorigen")
	private Long dfacIdeorigen;

	@Column(name = "dfac_cantidad")
	private BigDecimal dfacCantidad;

	@Column(name = "dfac_vlrunitari")
	private BigDecimal dfacVlrunitari;

	@Column(name = "dfac_vlrtotal")
	private BigDecimal dfacVlrtotal;

	@Column(name = "dfac_vlrreal")
	private BigDecimal dfacVlrreal;

	@Column(name = "dfac_sdoreal")
	private BigDecimal dfacSdoreal;

	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@PodamExclude
	@Column(name = "fac_ideregistro")
	private Long facIderegistro;

	@PodamExclude
	@Column(name = "uni_concepto")
	private Integer uniConcepto;

	@Column(name = "damo_ideregistr")
	private Long damoIderegistr;

	@Column(name = "dfac_idepadre")
	private Long dfacIdepadre;

	@Column(name = "dfin_ideregistr")
	private Long dfinIderegistr;

	@Column(name = "dfac_version")
	private Integer dfacVersion;

	@Column(name = "sco_ideregistro")
	private Long scoIderegistro;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name = "mvmc_ideregistr")
	private Long mvmcIderegistr;

	@ManyToOne
	@JoinColumn(name = "uni_concepto", referencedColumnName = "uni_concepto", insertable = false, updatable = false)
	@PodamExclude
	private ConConcepto conConceptodfacDetfacturaUniConceptoFkey;

	@ManyToOne
	@JoinColumn(name = "fac_ideregistro", referencedColumnName = "fac_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private FacFactura facFacturadfacDetfacturaFacIderegistroFkey;

	// bi-directional many-to-one association to NofaNotfactura
	@OneToMany(mappedBy = "dfacDetfactura1")
	private List<NofaNotfactura> nofaNotfacturas1;

	// bi-directional many-to-one association to NofaNotfactura
	@OneToMany(mappedBy = "dfacDetfactura2")
	private List<NofaNotfactura> nofaNotfacturas2;

	public DfacDetfactura() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Long getDfacIderegistr() {
		return this.dfacIderegistr;
	}

	public void setDfacIderegistr(Long dfacIderegistr) {

		this.dfacIderegistr = dfacIderegistr;
	}

	public String getDfacEstado() {
		return this.dfacEstado;
	}

	public void setDfacEstado(String dfacEstado) {

		this.dfacEstado = dfacEstado;
	}

	public Long getDfacIdeorigen() {
		return this.dfacIdeorigen;
	}

	public void setDfacIdeorigen(Long dfacIdeorigen) {

		this.dfacIdeorigen = dfacIdeorigen;
	}

	public BigDecimal getDfacCantidad() {
		return this.dfacCantidad;
	}

	public void setDfacCantidad(BigDecimal dfacCantidad) {

		this.dfacCantidad = dfacCantidad;
	}

	public BigDecimal getDfacVlrunitari() {
		return this.dfacVlrunitari;
	}

	public void setDfacVlrunitari(BigDecimal dfacVlrunitari) {

		this.dfacVlrunitari = dfacVlrunitari;
	}

	public BigDecimal getDfacVlrtotal() {
		return this.dfacVlrtotal;
	}

	public void setDfacVlrtotal(BigDecimal dfacVlrtotal) {

		this.dfacVlrtotal = dfacVlrtotal;
	}

	public BigDecimal getDfacVlrreal() {
		return this.dfacVlrreal;
	}

	public void setDfacVlrreal(BigDecimal dfacVlrreal) {

		this.dfacVlrreal = dfacVlrreal;
	}

	public BigDecimal getDfacSdoreal() {
		return this.dfacSdoreal;
	}

	public void setDfacSdoreal(BigDecimal dfacSdoreal) {

		this.dfacSdoreal = dfacSdoreal;
	}

	public Long getFacIderegistro() {
		return this.facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {

		this.facIderegistro = facIderegistro;
	}

	public Integer getUniConcepto() {
		return this.uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {

		this.uniConcepto = uniConcepto;
	}

	public Long getDamoIderegistr() {
		return this.damoIderegistr;
	}

	public void setDamoIderegistr(Long damoIderegistr) {

		this.damoIderegistr = damoIderegistr;
	}

	public Long getDfacIdepadre() {
		return this.dfacIdepadre;
	}

	public void setDfacIdepadre(Long dfacIdepadre) {

		this.dfacIdepadre = dfacIdepadre;
	}

	public Long getDfinIderegistr() {
		return this.dfinIderegistr;
	}

	public void setDfinIderegistr(Long dfinIderegistr) {

		this.dfinIderegistr = dfinIderegistr;
	}

	public Integer getDfacVersion() {
		return this.dfacVersion;
	}

	public void setDfacVersion(Integer dfacVersion) {

		this.dfacVersion = dfacVersion;
	}

	public Long getScoIderegistro() {
		return this.scoIderegistro;
	}

	public void setScoIderegistro(Long scoIderegistro) {

		this.scoIderegistro = scoIderegistro;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public Long getMvmcIderegistr() {
		return this.mvmcIderegistr;
	}

	public void setMvmcIderegistr(Long mvmcIderegistr) {

		this.mvmcIderegistr = mvmcIderegistr;
	}

	public List<NofaNotfactura> getNofaNotfacturas1() {
		return nofaNotfacturas1;
	}

	public void setNofaNotfacturas1(List<NofaNotfactura> nofaNotfacturas1) {
		this.nofaNotfacturas1 = nofaNotfacturas1;
	}

	public List<NofaNotfactura> getNofaNotfacturas2() {
		return nofaNotfacturas2;
	}

	public void setNofaNotfacturas2(List<NofaNotfactura> nofaNotfacturas2) {
		this.nofaNotfacturas2 = nofaNotfacturas2;
	}

	public ConConcepto getConConceptodfacDetfacturaUniConceptoFkey() {
		return this.conConceptodfacDetfacturaUniConceptoFkey;
	}

	public void setConConceptodfacDetfacturaUniConceptoFkey(ConConcepto conConceptodfacDetfacturaUniConceptoFkey) {
		this.conConceptodfacDetfacturaUniConceptoFkey = conConceptodfacDetfacturaUniConceptoFkey;
	}

	public FacFactura getFacFacturadfacDetfacturaFacIderegistroFkey() {
		return this.facFacturadfacDetfacturaFacIderegistroFkey;
	}

	public void setFacFacturadfacDetfacturaFacIderegistroFkey(FacFactura facFacturadfacDetfacturaFacIderegistroFkey) {
		this.facFacturadfacDetfacturaFacIderegistroFkey = facFacturadfacDetfacturaFacIderegistroFkey;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_DFAC_DETFACTURA) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadDfacDetfactura() {
		return ATRIBUTOS_ENTIDAD_DFAC_DETFACTURA;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.dfacIderegistr);
		hash = 37 * hash + Objects.hashCode(this.dfacEstado);
		hash = 37 * hash + Objects.hashCode(this.dfacIdeorigen);
		hash = 37 * hash + Objects.hashCode(this.dfacCantidad);
		hash = 37 * hash + Objects.hashCode(this.dfacVlrunitari);
		hash = 37 * hash + Objects.hashCode(this.dfacVlrtotal);
		hash = 37 * hash + Objects.hashCode(this.dfacVlrreal);
		hash = 37 * hash + Objects.hashCode(this.dfacSdoreal);
		hash = 37 * hash + Objects.hashCode(this.facIderegistro);
		hash = 37 * hash + Objects.hashCode(this.uniConcepto);
		hash = 37 * hash + Objects.hashCode(this.damoIderegistr);
		hash = 37 * hash + Objects.hashCode(this.dfacIdepadre);
		hash = 37 * hash + Objects.hashCode(this.dfinIderegistr);
		hash = 37 * hash + Objects.hashCode(this.dfacVersion);
		hash = 37 * hash + Objects.hashCode(this.scoIderegistro);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
		hash = 37 * hash + Objects.hashCode(this.mvmcIderegistr);

		return hash;
	}

	/**
	 * Valida la igualdad de la instancia de la entidad DfacDetfactura que se pasa
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
		final DfacDetfactura other = (DfacDetfactura) obj;

		if (!Objects.equals(this.dfacIderegistr, other.dfacIderegistr)) {
			return false;
		}

		if (!Objects.equals(this.dfacEstado, other.dfacEstado)) {
			return false;
		}

		if (!Objects.equals(this.dfacIdeorigen, other.dfacIdeorigen)) {
			return false;
		}

		if (!Objects.equals(this.dfacCantidad, other.dfacCantidad)) {
			return false;
		}

		if (!Objects.equals(this.dfacVlrunitari, other.dfacVlrunitari)) {
			return false;
		}

		if (!Objects.equals(this.dfacVlrtotal, other.dfacVlrtotal)) {
			return false;
		}

		if (!Objects.equals(this.dfacVlrreal, other.dfacVlrreal)) {
			return false;
		}

		if (!Objects.equals(this.dfacSdoreal, other.dfacSdoreal)) {
			return false;
		}

		if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
			return false;
		}

		if (!Objects.equals(this.damoIderegistr, other.damoIderegistr)) {
			return false;
		}

		if (!Objects.equals(this.dfacIdepadre, other.dfacIdepadre)) {
			return false;
		}

		if (!Objects.equals(this.dfinIderegistr, other.dfinIderegistr)) {
			return false;
		}

		if (!Objects.equals(this.dfacVersion, other.dfacVersion)) {
			return false;
		}

		if (!Objects.equals(this.scoIderegistro, other.scoIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
			return false;
		}

		return Objects.equals(this.mvmcIderegistr, other.mvmcIderegistr);

	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
