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
@Table(name = "con_concepto")
@NamedQuery(name = "ConConcepto.findAll", query = "SELECT p FROM ConConcepto p")
public class ConConcepto implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_CON_CONCEPTO_PK = "uniConcepto";
	public static final String ENTIDAD_CON_CONCEPTO_EST_CONCEPTO = "estConcepto";
	public static final String ENTIDAD_CON_CONCEPTO_CON_NOMBRE = "conNombre";
	public static final String ENTIDAD_CON_CONCEPTO_CON_ALIAS = "conAlias";
	public static final String ENTIDAD_CON_CONCEPTO_CON_ABREVIATURA = "conAbreviatura";
	public static final String ENTIDAD_CON_CONCEPTO_CON_TIPCALCULO = "conTipcalculo";
	public static final String ENTIDAD_CON_CONCEPTO_CON_VALOR = "conValor";
	public static final String ENTIDAD_CON_CONCEPTO_CON_FORMULA = "conFormula";
	public static final String ENTIDAD_CON_CONCEPTO_CON_OPERACION = "conOperacion";
	public static final String ENTIDAD_CON_CONCEPTO_CON_NATURALEZA = "conNaturaleza";
	public static final String ENTIDAD_CON_CONCEPTO_CON_PRELIQUIDAR = "conPreliquidar";
	public static final String ENTIDAD_CON_CONCEPTO_CON_ANTICIPO = "conAnticipo";
	public static final String ENTIDAD_CON_CONCEPTO_CON_PAGPRIORI = "conPagpriori";
	public static final String ENTIDAD_CON_CONCEPTO_CON_FINANCIABLE = "conFinanciable";
	public static final String ENTIDAD_CON_CONCEPTO_CON_INIVIGENCIA = "conInivigencia";
	public static final String ENTIDAD_CON_CONCEPTO_CON_FINVIGENCIA = "conFinvigencia";
	public static final String ENTIDAD_CON_CONCEPTO_CON_ESTADO = "conEstado";
	public static final String ENTIDAD_CON_CONCEPTO_PRG_IDEREGISTRO = "prgIderegistro";
	public static final String ENTIDAD_CON_CONCEPTO_CON_TIPREGISTRO = "conTipregistro";
	public static final String ENTIDAD_CON_CONCEPTO_CON_CONDONABLE = "conCondonable";
	public static final String ENTIDAD_CON_CONCEPTO_CON_VALNULO = "conValnulo";
	public static final String ENTIDAD_CON_CONCEPTO_USU_IDEREGISTRO = "usuIderegistro";
	public static final String ENTIDAD_CON_CONCEPTO_FUN_IDEREGISTRO = "funIderegistro";
	public static final String ENTIDAD_CON_CONCEPTO_CON_SUSPENDE = "conSuspende";
	public static final String ENTIDAD_CON_CONCEPTO_CON_INTFINANCIACION = "conIntfinanciacion";
	public static final String ENTIDAD_CON_CONCEPTO_CON_METAJUSTE = "conMetajuste";
	public static final String ENTIDAD_CON_CONCEPTO_CON_PRECISION = "conPrecision";
	public static final String ENTIDAD_CON_CONCEPTO_CON_CONTABILIZA = "conContabiliza";
	public static final String ENTIDAD_CON_CONCEPTO_CON_LIQUIDASERVICIO = "conLiquidaservicio";
	public static final String ENTIDAD_CON_CONCEPTO_CON_PROPIEDAD = "conPropiedad";
	private static final String[] ATRIBUTOS_ENTIDAD_CON_CONCEPTO = { ENTIDAD_CON_CONCEPTO_CON_METAJUSTE,
			ENTIDAD_CON_CONCEPTO_USU_IDEREGISTRO, ENTIDAD_CON_CONCEPTO_CON_PRELIQUIDAR,
			ENTIDAD_CON_CONCEPTO_CON_SUSPENDE, ENTIDAD_CON_CONCEPTO_CON_INIVIGENCIA, ENTIDAD_CON_CONCEPTO_CON_OPERACION,
			ENTIDAD_CON_CONCEPTO_CON_PRECISION, ENTIDAD_CON_CONCEPTO_CON_VALNULO, ENTIDAD_CON_CONCEPTO_CON_CONTABILIZA,
			ENTIDAD_CON_CONCEPTO_CON_ANTICIPO, ENTIDAD_CON_CONCEPTO_FUN_IDEREGISTRO,
			ENTIDAD_CON_CONCEPTO_CON_FINANCIABLE, ENTIDAD_CON_CONCEPTO_CON_ALIAS, ENTIDAD_CON_CONCEPTO_CON_CONDONABLE,
			ENTIDAD_CON_CONCEPTO_EST_CONCEPTO, ENTIDAD_CON_CONCEPTO_CON_PAGPRIORI, ENTIDAD_CON_CONCEPTO_PRG_IDEREGISTRO,
			ENTIDAD_CON_CONCEPTO_CON_FINVIGENCIA, ENTIDAD_CON_CONCEPTO_CON_TIPREGISTRO,
			ENTIDAD_CON_CONCEPTO_CON_INTFINANCIACION, ENTIDAD_CON_CONCEPTO_CON_FORMULA,
			ENTIDAD_CON_CONCEPTO_CON_NATURALEZA, ENTIDAD_CON_CONCEPTO_CON_TIPCALCULO,
			ENTIDAD_CON_CONCEPTO_CON_LIQUIDASERVICIO, ENTIDAD_CON_CONCEPTO_CON_NOMBRE, ENTIDAD_CON_CONCEPTO_CON_ESTADO,
			ENTIDAD_CON_CONCEPTO_CON_VALOR, ENTIDAD_CON_CONCEPTO_CON_ABREVIATURA, ENTIDAD_CON_CONCEPTO_PK, ENTIDAD_CON_CONCEPTO_CON_PROPIEDAD };

	@Id
	@Column(name = "uni_concepto")
	private Integer uniConcepto;

	@Column(name = "est_concepto")
	private Integer estConcepto;

	@Column(name = "con_nombre")
	@Size(min = 0, max = 100)
	private String conNombre;

	@Column(name = "con_alias")
	@Size(min = 0, max = 10)
	private String conAlias;

	@Column(name = "con_abreviatura")
	@Size(min = 0, max = 20)
	private String conAbreviatura;

	@Column(name = "con_tipcalculo")
	@Size(min = 0, max = 1)
	private String conTipcalculo;

	@Column(name = "con_valor")
	private BigDecimal conValor;

	@Column(name = "con_formula")
	private String conFormula;

	@Column(name = "con_operacion")
	@Size(min = 0, max = 1)
	private String conOperacion;

	@Column(name = "con_naturaleza")
	@Size(min = 0, max = 1)
	private String conNaturaleza;

	@Column(name = "con_preliquidar")
	@Size(min = 0, max = 1)
	private String conPreliquidar;

	@Column(name = "con_anticipo")
	@Size(min = 0, max = 1)
	private String conAnticipo;

	@Column(name = "con_pagpriori")
	private Short conPagpriori;

	@Column(name = "con_financiable")
	@Size(min = 0, max = 1)
	private String conFinanciable;

	@Column(name = "con_inivigencia")
	private Byte[] conInivigencia;

	@Column(name = "con_finvigencia")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date conFinvigencia;

	@Column(name = "con_estado")
	@Size(min = 0, max = 1)
	private String conEstado;

	@Column(name = "prg_ideregistro")
	private Integer prgIderegistro;

	@Column(name = "con_tipregistro")
	@Size(min = 0, max = 1)
	private String conTipregistro;

	@Column(name = "con_condonable")
	@Size(min = 0, max = 1)
	private String conCondonable;

	@Column(name = "con_valnulo")
	@Size(min = 0, max = 1)
	private String conValnulo;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name = "fun_ideregistro")
	private Integer funIderegistro;

	@Column(name = "con_suspende")
	@Size(min = 0, max = 1)
	private String conSuspende;

	@Column(name = "con_intfinanciacion")
	@Size(min = 0, max = 1)
	private String conIntfinanciacion;

	@Column(name = "con_metajuste")
	@Size(min = 0, max = 1)
	private String conMetajuste;

	@Column(name = "con_precision")
	private Short conPrecision;

	@Column(name = "con_contabiliza")
	@Size(min = 0, max = 1)
	private String conContabiliza;

	@Column(name = "con_liquidaservicio")
	private boolean conLiquidaservicio;

	@Column(name = "con_propiedad", columnDefinition = "json")
	private String conPropiedad;

	@ManyToOne
	@JoinColumn(name = "uni_concepto", referencedColumnName = "uni_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private UniUnidad uniUnidadconConceptoUniConceptoFkey;

	@OneToMany(mappedBy = "conConceptocoliConliquidaUniConceptoFkey")
	@PodamExclude
	private List<ColiConliquida> coliConliquidaUniConceptoFkeyes;
	@OneToMany(mappedBy = "conConceptodfacDetfacturaUniConceptoFkey")
	@PodamExclude
	private List<DfacDetfactura> dfacDetfacturaUniConceptoFkeyes;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public ConConcepto() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public Integer getUniConcepto() {
		return this.uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {

		this.uniConcepto = uniConcepto;
	}

	public Integer getEstConcepto() {
		return this.estConcepto;
	}

	public void setEstConcepto(Integer estConcepto) {

		this.estConcepto = estConcepto;
	}

	public String getConNombre() {
		return this.conNombre;
	}

	public void setConNombre(String conNombre) {

		this.conNombre = conNombre;
	}

	public String getConAlias() {
		return this.conAlias;
	}

	public void setConAlias(String conAlias) {

		this.conAlias = conAlias;
	}

	public String getConAbreviatura() {
		return this.conAbreviatura;
	}

	public void setConAbreviatura(String conAbreviatura) {

		this.conAbreviatura = conAbreviatura;
	}

	public String getConTipcalculo() {
		return this.conTipcalculo;
	}

	public void setConTipcalculo(String conTipcalculo) {

		this.conTipcalculo = conTipcalculo;
	}

	public BigDecimal getConValor() {
		return this.conValor;
	}

	public void setConValor(BigDecimal conValor) {

		this.conValor = conValor;
	}

	public String getConFormula() {
		return this.conFormula;
	}

	public void setConFormula(String conFormula) {

		this.conFormula = conFormula;
	}

	public String getConOperacion() {
		return this.conOperacion;
	}

	public void setConOperacion(String conOperacion) {

		this.conOperacion = conOperacion;
	}

	public String getConNaturaleza() {
		return this.conNaturaleza;
	}

	public void setConNaturaleza(String conNaturaleza) {

		this.conNaturaleza = conNaturaleza;
	}

	public String getConPreliquidar() {
		return this.conPreliquidar;
	}

	public void setConPreliquidar(String conPreliquidar) {

		this.conPreliquidar = conPreliquidar;
	}

	public String getConAnticipo() {
		return this.conAnticipo;
	}

	public void setConAnticipo(String conAnticipo) {

		this.conAnticipo = conAnticipo;
	}

	public Short getConPagpriori() {
		return this.conPagpriori;
	}

	public void setConPagpriori(Short conPagpriori) {

		this.conPagpriori = conPagpriori;
	}

	public String getConFinanciable() {
		return this.conFinanciable;
	}

	public void setConFinanciable(String conFinanciable) {

		this.conFinanciable = conFinanciable;
	}

	public Byte[] getConInivigencia() {
		return this.conInivigencia;
	}

	public void setConInivigencia(Byte[] conInivigencia) {

		this.conInivigencia = conInivigencia;
	}

	public Date getConFinvigencia() {
		return this.conFinvigencia;
	}

	public void setConFinvigencia(Date conFinvigencia) {

		this.conFinvigencia = conFinvigencia;
	}

	public String getConEstado() {
		return this.conEstado;
	}

	public void setConEstado(String conEstado) {

		this.conEstado = conEstado;
	}

	public Integer getPrgIderegistro() {
		return this.prgIderegistro;
	}

	public void setPrgIderegistro(Integer prgIderegistro) {

		this.prgIderegistro = prgIderegistro;
	}

	public String getConTipregistro() {
		return this.conTipregistro;
	}

	public void setConTipregistro(String conTipregistro) {

		this.conTipregistro = conTipregistro;
	}

	public String getConCondonable() {
		return this.conCondonable;
	}

	public void setConCondonable(String conCondonable) {

		this.conCondonable = conCondonable;
	}

	public String getConValnulo() {
		return this.conValnulo;
	}

	public void setConValnulo(String conValnulo) {

		this.conValnulo = conValnulo;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public Integer getFunIderegistro() {
		return this.funIderegistro;
	}

	public void setFunIderegistro(Integer funIderegistro) {

		this.funIderegistro = funIderegistro;
	}

	public String getConSuspende() {
		return this.conSuspende;
	}

	public void setConSuspende(String conSuspende) {

		this.conSuspende = conSuspende;
	}

	public String getConIntfinanciacion() {
		return this.conIntfinanciacion;
	}

	public void setConIntfinanciacion(String conIntfinanciacion) {

		this.conIntfinanciacion = conIntfinanciacion;
	}

	public String getConMetajuste() {
		return this.conMetajuste;
	}

	public void setConMetajuste(String conMetajuste) {

		this.conMetajuste = conMetajuste;
	}

	public Short getConPrecision() {
		return this.conPrecision;
	}

	public void setConPrecision(Short conPrecision) {

		this.conPrecision = conPrecision;
	}

	public String getConContabiliza() {
		return this.conContabiliza;
	}

	public void setConContabiliza(String conContabiliza) {

		this.conContabiliza = conContabiliza;
	}

	public boolean getConLiquidaservicio() {
		return this.conLiquidaservicio;
	}

	public void setConLiquidaservicio(boolean conLiquidaservicio) {

		this.conLiquidaservicio = conLiquidaservicio;
	}

	public List<ColiConliquida> getColiConliquidaUniConceptoFkeyesList() {
		return this.coliConliquidaUniConceptoFkeyes;
	}

	public void setColiConliquidaUniConceptoFkeyesList(List<ColiConliquida> coliConliquidaUniConceptoFkeyes) {
		this.coliConliquidaUniConceptoFkeyes = coliConliquidaUniConceptoFkeyes;
	}

	public List<DfacDetfactura> getDfacDetfacturaUniConceptoFkeyesList() {
		return this.dfacDetfacturaUniConceptoFkeyes;
	}

	public void setDfacDetfacturaUniConceptoFkeyesList(List<DfacDetfactura> dfacDetfacturaUniConceptoFkeyes) {
		this.dfacDetfacturaUniConceptoFkeyes = dfacDetfacturaUniConceptoFkeyes;
	}

	public UniUnidad getUniUnidadconConceptoUniConceptoFkey() {
		return this.uniUnidadconConceptoUniConceptoFkey;
	}

	public void setUniUnidadconConceptoUniConceptoFkey(UniUnidad uniUnidadconConceptoUniConceptoFkey) {
		this.uniUnidadconConceptoUniConceptoFkey = uniUnidadconConceptoUniConceptoFkey;
	}

	public String getConPropiedad() {
		return conPropiedad;
	}

	public void setConPropiedad(String conPropiedad) {
		this.conPropiedad = conPropiedad;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_CON_CONCEPTO) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadConConcepto() {
		return ATRIBUTOS_ENTIDAD_CON_CONCEPTO;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.uniConcepto);
		hash = 37 * hash + Objects.hashCode(this.estConcepto);
		hash = 37 * hash + Objects.hashCode(this.conNombre);
		hash = 37 * hash + Objects.hashCode(this.conAlias);
		hash = 37 * hash + Objects.hashCode(this.conAbreviatura);
		hash = 37 * hash + Objects.hashCode(this.conTipcalculo);
		hash = 37 * hash + Objects.hashCode(this.conValor);
		hash = 37 * hash + Objects.hashCode(this.conFormula);
		hash = 37 * hash + Objects.hashCode(this.conOperacion);
		hash = 37 * hash + Objects.hashCode(this.conNaturaleza);
		hash = 37 * hash + Objects.hashCode(this.conPreliquidar);
		hash = 37 * hash + Objects.hashCode(this.conAnticipo);
		hash = 37 * hash + Objects.hashCode(this.conPagpriori);
		hash = 37 * hash + Objects.hashCode(this.conFinanciable);
		hash = 37 * hash + Objects.hashCode(this.conInivigencia);
		hash = 37 * hash + Objects.hashCode(this.conFinvigencia);
		hash = 37 * hash + Objects.hashCode(this.conEstado);
		hash = 37 * hash + Objects.hashCode(this.prgIderegistro);
		hash = 37 * hash + Objects.hashCode(this.conTipregistro);
		hash = 37 * hash + Objects.hashCode(this.conCondonable);
		hash = 37 * hash + Objects.hashCode(this.conValnulo);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
		hash = 37 * hash + Objects.hashCode(this.funIderegistro);
		hash = 37 * hash + Objects.hashCode(this.conSuspende);
		hash = 37 * hash + Objects.hashCode(this.conIntfinanciacion);
		hash = 37 * hash + Objects.hashCode(this.conMetajuste);
		hash = 37 * hash + Objects.hashCode(this.conPrecision);
		hash = 37 * hash + Objects.hashCode(this.conContabiliza);
		hash = 37 * hash + (this.conLiquidaservicio ? 0 : 1);

		return hash;
	}

	/**
	 * Valida la igualdad de la instancia de la entidad ConConcepto que se pasa como
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
		final ConConcepto other = (ConConcepto) obj;

		if (!Objects.equals(this.uniConcepto, other.uniConcepto)) {
			return false;
		}

		if (!Objects.equals(this.estConcepto, other.estConcepto)) {
			return false;
		}

		if (!Objects.equals(this.conNombre, other.conNombre)) {
			return false;
		}

		if (!Objects.equals(this.conAlias, other.conAlias)) {
			return false;
		}

		if (!Objects.equals(this.conAbreviatura, other.conAbreviatura)) {
			return false;
		}

		if (!Objects.equals(this.conTipcalculo, other.conTipcalculo)) {
			return false;
		}

		if (!Objects.equals(this.conValor, other.conValor)) {
			return false;
		}

		if (!Objects.equals(this.conFormula, other.conFormula)) {
			return false;
		}

		if (!Objects.equals(this.conOperacion, other.conOperacion)) {
			return false;
		}

		if (!Objects.equals(this.conNaturaleza, other.conNaturaleza)) {
			return false;
		}

		if (!Objects.equals(this.conPreliquidar, other.conPreliquidar)) {
			return false;
		}

		if (!Objects.equals(this.conAnticipo, other.conAnticipo)) {
			return false;
		}

		if (!Objects.equals(this.conPagpriori, other.conPagpriori)) {
			return false;
		}

		if (!Objects.equals(this.conFinanciable, other.conFinanciable)) {
			return false;
		}

		if (!Objects.equals(this.conInivigencia, other.conInivigencia)) {
			return false;
		}

		if (!Objects.equals(this.conFinvigencia, other.conFinvigencia)) {
			return false;
		}

		if (!Objects.equals(this.conEstado, other.conEstado)) {
			return false;
		}

		if (!Objects.equals(this.prgIderegistro, other.prgIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.conTipregistro, other.conTipregistro)) {
			return false;
		}

		if (!Objects.equals(this.conCondonable, other.conCondonable)) {
			return false;
		}

		if (!Objects.equals(this.conValnulo, other.conValnulo)) {
			return false;
		}

		if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.funIderegistro, other.funIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.conSuspende, other.conSuspende)) {
			return false;
		}

		if (!Objects.equals(this.conIntfinanciacion, other.conIntfinanciacion)) {
			return false;
		}

		if (!Objects.equals(this.conMetajuste, other.conMetajuste)) {
			return false;
		}

		if (!Objects.equals(this.conPrecision, other.conPrecision)) {
			return false;
		}

		if (!Objects.equals(this.conContabiliza, other.conContabiliza)) {
			return false;
		}

		return Objects.equals(this.conLiquidaservicio, other.conLiquidaservicio);

	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
