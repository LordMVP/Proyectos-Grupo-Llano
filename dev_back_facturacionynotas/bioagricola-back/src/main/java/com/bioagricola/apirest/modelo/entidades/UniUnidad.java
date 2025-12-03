package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "uni_unidad")
@NamedQuery(name = "UniUnidad.findAll", query = "SELECT p FROM UniUnidad p")
public class UniUnidad implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_UNI_UNIDAD_PK = "uniIderegistro";
	public static final String ENTIDAD_UNI_UNIDAD_EST_IDEREGISTRO = "estIderegistro";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO1 = "uniCodigo1";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO2 = "uniCodigo2";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO3 = "uniCodigo3";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO4 = "uniCodigo4";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO5 = "uniCodigo5";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NOMBRE1 = "uniNombre1";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NOMBRE2 = "uniNombre2";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NOMBRE3 = "uniNombre3";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NOMBRE4 = "uniNombre4";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NOMBRE5 = "uniNombre5";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_ORDEN = "uniOrden";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_NIVEL = "uniNivel";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_CODIGO = "uniCodigo";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_IDEPADRE = "uniIdepadre";
	public static final String ENTIDAD_UNI_UNIDAD_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_PROPIEDAD = "uniPropiedad";
	public static final String ENTIDAD_UNI_UNIDAD_UNI_FECHA = "uniFecha";
	private static final String[] ATRIBUTOS_ENTIDAD_UNI_UNIDAD = { ENTIDAD_UNI_UNIDAD_UNI_NOMBRE3,
			ENTIDAD_UNI_UNIDAD_UNI_PROPIEDAD, ENTIDAD_UNI_UNIDAD_UNI_NOMBRE4, ENTIDAD_UNI_UNIDAD_PK,
			ENTIDAD_UNI_UNIDAD_UNI_NOMBRE5, ENTIDAD_UNI_UNIDAD_UNI_ORDEN, ENTIDAD_UNI_UNIDAD_UNI_IDEPADRE,
			ENTIDAD_UNI_UNIDAD_UNI_NOMBRE1, ENTIDAD_UNI_UNIDAD_UNI_NOMBRE2, ENTIDAD_UNI_UNIDAD_UNI_CODIGO3,
			ENTIDAD_UNI_UNIDAD_UNI_CODIGO4, ENTIDAD_UNI_UNIDAD_UNI_CODIGO5, ENTIDAD_UNI_UNIDAD_UNI_CODIGO,
			ENTIDAD_UNI_UNIDAD_EST_IDEREGISTRO, ENTIDAD_UNI_UNIDAD_UNI_NIVEL, ENTIDAD_UNI_UNIDAD_USU_IDEREGISTRO,
			ENTIDAD_UNI_UNIDAD_UNI_FECHA, ENTIDAD_UNI_UNIDAD_UNI_CODIGO1, ENTIDAD_UNI_UNIDAD_UNI_CODIGO2 };

	@Id
	@Column(name = "uni_ideregistro")
	private Integer uniIderegistro;

	@Column(name = "est_ideregistro")
	private Integer estIderegistro;

	@Column(name = "uni_codigo1")
	@Size(min = 0, max = 15)
	private String uniCodigo1;

	@Column(name = "uni_codigo2")
	@Size(min = 0, max = 15)
	private String uniCodigo2;

	@Column(name = "uni_codigo3")
	@Size(min = 0, max = 15)
	private String uniCodigo3;

	@Column(name = "uni_codigo4")
	@Size(min = 0, max = 15)
	private String uniCodigo4;

	@Column(name = "uni_codigo5")
	@Size(min = 0, max = 15)
	private String uniCodigo5;

	@Column(name = "uni_nombre1")
	@Size(min = 0, max = 100)
	private String uniNombre1;

	@Column(name = "uni_nombre2")
	@Size(min = 0, max = 50)
	private String uniNombre2;

	@Column(name = "uni_nombre3")
	@Size(min = 0, max = 30)
	private String uniNombre3;

	@Column(name = "uni_nombre4")
	@Size(min = 0, max = 30)
	private String uniNombre4;

	@Column(name = "uni_nombre5")
	@Size(min = 0, max = 30)
	private String uniNombre5;

	@Column(name = "uni_orden")
	private BigDecimal uniOrden;

	@Column(name = "uni_nivel")
	private Short uniNivel;

	@Column(name = "uni_codigo")
	@Size(min = 0, max = 16)
	private String uniCodigo;

	@PodamExclude
	@Column(name = "uni_idepadre")
	private Integer uniIdepadre;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name = "uni_propiedad")
	@Size(min = 0, max = 1)
	private String uniPropiedad;

	@Column(name = "uni_fecha")
	private Byte[] uniFecha;

	@ManyToOne
	@JoinColumn(name = "uni_idepadre", referencedColumnName = "uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private UniUnidad uniUnidaduniUnidadUniIdepadreFkey;

	@OneToMany(mappedBy = "uniUnidadclteClaterceroUniClaterceroFkey")
	@PodamExclude
	private List<ClteClatercero> clteClaterceroUniClaterceroFkeyes;
	@OneToMany(mappedBy = "uniUnidadconConceptoUniConceptoFkey")
	@PodamExclude
	private List<ConConcepto> conConceptoUniConceptoFkeyes;
	@OneToMany(mappedBy = "uniUnidaddocDocumentoUniDocumentoFkey")
	@PodamExclude
	private List<DocDocumento> docDocumentoUniDocumentoFkeyes;
	@OneToMany(mappedBy = "uniUnidadliesLiqespecialUniTipusosuscrFkey")
	@PodamExclude
	private List<LiesLiqespecial> liesLiqespecialUniTipusosuscrFkeyes;
	@OneToMany(mappedBy = "uniUnidadtidoTipdocumenUniTipdocumentFkey")
	@PodamExclude
	private List<TidoTipdocumen> tidoTipdocumenUniTipdocumentFkeyes;
	@OneToMany(mappedBy = "uniUnidaduniUnidadUniIdepadreFkey")
	@PodamExclude
	private List<UniUnidad> uniUnidadUniIdepadreFkeyesHijos;

	// bi-directional many-to-one association to ProPropiedad
	@OneToMany(mappedBy = "uniUnidad")
	@PodamExclude
	private List<ProPropiedad> proPropiedads;

	// bi-directional many-to-one association to PrunPrgunidad
	@OneToMany(mappedBy = "uniUnidad")
	@PodamExclude
	private List<PrunPrgunidad> prunPrgunidads;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	

	public UniUnidad() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public Integer getUniIderegistro() {
		return this.uniIderegistro;
	}

	public void setUniIderegistro(Integer uniIderegistro) {

		this.uniIderegistro = uniIderegistro;
	}

	public Integer getEstIderegistro() {
		return this.estIderegistro;
	}

	public void setEstIderegistro(Integer estIderegistro) {

		this.estIderegistro = estIderegistro;
	}

	public String getUniCodigo1() {
		return this.uniCodigo1;
	}

	public void setUniCodigo1(String uniCodigo1) {

		this.uniCodigo1 = uniCodigo1;
	}

	public String getUniCodigo2() {
		return this.uniCodigo2;
	}

	public void setUniCodigo2(String uniCodigo2) {

		this.uniCodigo2 = uniCodigo2;
	}

	public String getUniCodigo3() {
		return this.uniCodigo3;
	}

	public void setUniCodigo3(String uniCodigo3) {

		this.uniCodigo3 = uniCodigo3;
	}

	public String getUniCodigo4() {
		return this.uniCodigo4;
	}

	public void setUniCodigo4(String uniCodigo4) {

		this.uniCodigo4 = uniCodigo4;
	}

	public String getUniCodigo5() {
		return this.uniCodigo5;
	}

	public void setUniCodigo5(String uniCodigo5) {

		this.uniCodigo5 = uniCodigo5;
	}

	public String getUniNombre1() {
		return this.uniNombre1;
	}

	public void setUniNombre1(String uniNombre1) {

		this.uniNombre1 = uniNombre1;
	}

	public String getUniNombre2() {
		return this.uniNombre2;
	}

	public void setUniNombre2(String uniNombre2) {

		this.uniNombre2 = uniNombre2;
	}

	public String getUniNombre3() {
		return this.uniNombre3;
	}

	public void setUniNombre3(String uniNombre3) {

		this.uniNombre3 = uniNombre3;
	}

	public String getUniNombre4() {
		return this.uniNombre4;
	}

	public void setUniNombre4(String uniNombre4) {

		this.uniNombre4 = uniNombre4;
	}

	public String getUniNombre5() {
		return this.uniNombre5;
	}

	public void setUniNombre5(String uniNombre5) {

		this.uniNombre5 = uniNombre5;
	}

	public BigDecimal getUniOrden() {
		return this.uniOrden;
	}

	public void setUniOrden(BigDecimal uniOrden) {

		this.uniOrden = uniOrden;
	}

	public Short getUniNivel() {
		return this.uniNivel;
	}

	public void setUniNivel(Short uniNivel) {

		this.uniNivel = uniNivel;
	}

	public String getUniCodigo() {
		return this.uniCodigo;
	}

	public void setUniCodigo(String uniCodigo) {

		this.uniCodigo = uniCodigo;
	}

	public Integer getUniIdepadre() {
		return this.uniIdepadre;
	}

	public void setUniIdepadre(Integer uniIdepadre) {

		this.uniIdepadre = uniIdepadre;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public String getUniPropiedad() {
		return this.uniPropiedad;
	}

	public void setUniPropiedad(String uniPropiedad) {

		this.uniPropiedad = uniPropiedad;
	}

	public Byte[] getUniFecha() {
		return this.uniFecha;
	}

	public void setUniFecha(Byte[] uniFecha) {

		this.uniFecha = uniFecha;
	}

	public List<ClteClatercero> getClteClaterceroUniClaterceroFkeyesList() {
		return this.clteClaterceroUniClaterceroFkeyes;
	}

	public void setClteClaterceroUniClaterceroFkeyesList(List<ClteClatercero> clteClaterceroUniClaterceroFkeyes) {
		this.clteClaterceroUniClaterceroFkeyes = clteClaterceroUniClaterceroFkeyes;
	}

	public List<ConConcepto> getConConceptoUniConceptoFkeyesList() {
		return this.conConceptoUniConceptoFkeyes;
	}

	public void setConConceptoUniConceptoFkeyesList(List<ConConcepto> conConceptoUniConceptoFkeyes) {
		this.conConceptoUniConceptoFkeyes = conConceptoUniConceptoFkeyes;
	}

	public List<DocDocumento> getDocDocumentoUniDocumentoFkeyesList() {
		return this.docDocumentoUniDocumentoFkeyes;
	}

	public void setDocDocumentoUniDocumentoFkeyesList(List<DocDocumento> docDocumentoUniDocumentoFkeyes) {
		this.docDocumentoUniDocumentoFkeyes = docDocumentoUniDocumentoFkeyes;
	}

	public List<LiesLiqespecial> getLiesLiqespecialUniTipusosuscrFkeyesList() {
		return this.liesLiqespecialUniTipusosuscrFkeyes;
	}

	public void setLiesLiqespecialUniTipusosuscrFkeyesList(List<LiesLiqespecial> liesLiqespecialUniTipusosuscrFkeyes) {
		this.liesLiqespecialUniTipusosuscrFkeyes = liesLiqespecialUniTipusosuscrFkeyes;
	}

	public List<TidoTipdocumen> getTidoTipdocumenUniTipdocumentFkeyesList() {
		return this.tidoTipdocumenUniTipdocumentFkeyes;
	}

	public void setTidoTipdocumenUniTipdocumentFkeyesList(List<TidoTipdocumen> tidoTipdocumenUniTipdocumentFkeyes) {
		this.tidoTipdocumenUniTipdocumentFkeyes = tidoTipdocumenUniTipdocumentFkeyes;
	}

	public List<UniUnidad> getUniUnidadUniIdepadreFkeyesHijosList() {
		return this.uniUnidadUniIdepadreFkeyesHijos;
	}

	public void setUniUnidadUniIdepadreFkeyesHijosList(List<UniUnidad> uniUnidadUniIdepadreFkeyesHijos) {
		this.uniUnidadUniIdepadreFkeyesHijos = uniUnidadUniIdepadreFkeyesHijos;
	}

	public UniUnidad getUniUnidaduniUnidadUniIdepadreFkey() {
		return this.uniUnidaduniUnidadUniIdepadreFkey;
	}

	public void setUniUnidaduniUnidadUniIdepadreFkey(UniUnidad uniUnidaduniUnidadUniIdepadreFkey) {
		this.uniUnidaduniUnidadUniIdepadreFkey = uniUnidaduniUnidadUniIdepadreFkey;
	}

	public List<ProPropiedad> getProPropiedads() {
		return this.proPropiedads;
	}

	public void setProPropiedads(List<ProPropiedad> proPropiedads) {
		this.proPropiedads = proPropiedads;
	}

	public ProPropiedad addProPropiedad(ProPropiedad proPropiedad) {
		getProPropiedads().add(proPropiedad);
		proPropiedad.setUniUnidad(this);

		return proPropiedad;
	}

	public ProPropiedad removeProPropiedad(ProPropiedad proPropiedad) {
		getProPropiedads().remove(proPropiedad);
		proPropiedad.setUniUnidad(null);

		return proPropiedad;
	}
	
	public List<PrunPrgunidad> getPrunPrgunidads() {
		return prunPrgunidads;
	}

	public void setPrunPrgunidads(List<PrunPrgunidad> prunPrgunidads) {
		this.prunPrgunidads = prunPrgunidads;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_UNI_UNIDAD) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadUniUnidad() {
		return ATRIBUTOS_ENTIDAD_UNI_UNIDAD;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.uniIderegistro);
		hash = 37 * hash + Objects.hashCode(this.estIderegistro);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo1);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo2);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo3);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo4);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo5);
		hash = 37 * hash + Objects.hashCode(this.uniNombre1);
		hash = 37 * hash + Objects.hashCode(this.uniNombre2);
		hash = 37 * hash + Objects.hashCode(this.uniNombre3);
		hash = 37 * hash + Objects.hashCode(this.uniNombre4);
		hash = 37 * hash + Objects.hashCode(this.uniNombre5);
		hash = 37 * hash + Objects.hashCode(this.uniOrden);
		hash = 37 * hash + Objects.hashCode(this.uniNivel);
		hash = 37 * hash + Objects.hashCode(this.uniCodigo);
		hash = 37 * hash + Objects.hashCode(this.uniIdepadre);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
		hash = 37 * hash + Objects.hashCode(this.uniPropiedad);
		hash = 37 * hash + Objects.hashCode(this.uniFecha);

		return hash;
	}

	/**
	 * Valida la igualdad de la instancia de la entidad UniUnidad que se pasa como
	 * parámetro comprobando que comparten los mismos valores en cada uno de sus
	 * atributos. Solo se tienen en cuenta los atributos simples, es decir, se
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
		final UniUnidad other = (UniUnidad) obj;

		if (!Objects.equals(this.uniIderegistro, other.uniIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.estIderegistro, other.estIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo1, other.uniCodigo1)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo2, other.uniCodigo2)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo3, other.uniCodigo3)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo4, other.uniCodigo4)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo5, other.uniCodigo5)) {
			return false;
		}

		if (!Objects.equals(this.uniNombre1, other.uniNombre1)) {
			return false;
		}

		if (!Objects.equals(this.uniNombre2, other.uniNombre2)) {
			return false;
		}

		if (!Objects.equals(this.uniNombre3, other.uniNombre3)) {
			return false;
		}

		if (!Objects.equals(this.uniNombre4, other.uniNombre4)) {
			return false;
		}

		if (!Objects.equals(this.uniNombre5, other.uniNombre5)) {
			return false;
		}

		if (!Objects.equals(this.uniOrden, other.uniOrden)) {
			return false;
		}

		if (!Objects.equals(this.uniNivel, other.uniNivel)) {
			return false;
		}

		if (!Objects.equals(this.uniCodigo, other.uniCodigo)) {
			return false;
		}

		if (!Objects.equals(this.uniIdepadre, other.uniIdepadre)) {
			return false;
		}

		if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.uniPropiedad, other.uniPropiedad)) {
			return false;
		}

		return Objects.equals(this.uniFecha, other.uniFecha);

	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
