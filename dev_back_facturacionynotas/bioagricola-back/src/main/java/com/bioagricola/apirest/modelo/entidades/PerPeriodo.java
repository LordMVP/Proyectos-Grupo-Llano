package com.bioagricola.apirest.modelo.entidades;

import uk.co.jemos.podam.annotations.PodamExclude;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * The persistent class for the CATEGORIES database table.
 *
 */
@Entity
@Table(name = "per_periodo")
@NamedQuery(name = "PerPeriodo.findAll", query = "SELECT p FROM PerPeriodo p")
public class PerPeriodo implements Serializable {

	private static final long serialVersionUID = 1L;

	// Definicion de atributos de la entidad (Exceptuando relaciones)
	public static final String ENTIDAD_PER_PERIODO_PK = "perIderegistro";
	public static final String ENTIDAD_PER_PERIODO_PER_IDEORDEN = "perIdeorden";
	public static final String ENTIDAD_PER_PERIODO_CIC_IDEREGISTRO = "cicIderegistro";
	public static final String ENTIDAD_PER_PERIODO_PER_NOMBRE = "perNombre";
	public static final String ENTIDAD_PER_PERIODO_PER_ESTADO = "perEstado";
	public static final String ENTIDAD_PER_PERIODO_PER_BLOFECHA = "perBlofecha";
	public static final String ENTIDAD_PER_PERIODO_PER_FECINICIAL = "perFecinicial";
	public static final String ENTIDAD_PER_PERIODO_PER_FECFINAL = "perFecfinal";
	public static final String ENTIDAD_PER_PERIODO_PER_FECVENCE = "perFecvence";
	public static final String ENTIDAD_PER_PERIODO_PER_FECSUSPENS = "perFecsuspens";
	public static final String ENTIDAD_PER_PERIODO_USU_IDEREGISTRO = "usuIderegistro";
	private static final String[] ATRIBUTOS_ENTIDAD_PER_PERIODO = { ENTIDAD_PER_PERIODO_CIC_IDEREGISTRO,
			ENTIDAD_PER_PERIODO_PER_ESTADO, ENTIDAD_PER_PERIODO_PER_FECINICIAL, ENTIDAD_PER_PERIODO_PER_IDEORDEN,
			ENTIDAD_PER_PERIODO_PER_FECFINAL, ENTIDAD_PER_PERIODO_PER_FECSUSPENS, ENTIDAD_PER_PERIODO_PK,
			ENTIDAD_PER_PERIODO_PER_NOMBRE, ENTIDAD_PER_PERIODO_PER_FECVENCE, ENTIDAD_PER_PERIODO_USU_IDEREGISTRO,
			ENTIDAD_PER_PERIODO_PER_BLOFECHA };

	@Id
	@Column(name = "per_ideregistro")
	private Integer perIderegistro;

	@Column(name = "per_ideorden")
	private Short perIdeorden;

	@PodamExclude
	@Column(name = "cic_ideregistro")
	private Integer cicIderegistro;

	@Column(name = "per_nombre")
	@Size(min = 0, max = 30)
	private String perNombre;

	@Column(name = "per_estado")
	@Size(min = 0, max = 1)
	private String perEstado;

	@Column(name = "per_blofecha")
	@Size(min = 0, max = 1)
	private String perBlofecha;

	@Column(name = "per_fecinicial")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date perFecinicial;

	@Column(name = "per_fecfinal")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date perFecfinal;

	@Column(name = "per_fecvence")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date perFecvence;

	@Column(name = "per_fecsuspens")
	@Temporal(javax.persistence.TemporalType.TIMESTAMP)
	private Date perFecsuspens;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	// bi-directional many-to-one association to NotNota
	@OneToMany(mappedBy = "perPeriodo")
	private List<NotNota> notNotas;

	@ManyToOne
	@JoinColumn(name = "cic_ideregistro", referencedColumnName = "cic_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private CicCiclo cicCicloperPeriodoCicIderegistroFkey;

	// bi-directional many-to-one association to DperDetperiodo
	@OneToMany(mappedBy = "perPeriodo")
	private List<DperDetperiodo> dperDetperiodos;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public PerPeriodo() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	public PerPeriodo(Short perIdeorden, String perEstado, Date perFecinicial, Date perFecfinal) {
		this.perIdeorden = perIdeorden;
		this.perEstado = perEstado;
		this.perFecinicial = perFecinicial;
		this.perFecfinal = perFecfinal;
	}

	public Integer getPerIderegistro() {
		return this.perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {

		this.perIderegistro = perIderegistro;
	}

	public Short getPerIdeorden() {
		return this.perIdeorden;
	}

	public void setPerIdeorden(Short perIdeorden) {

		this.perIdeorden = perIdeorden;
	}

	public Integer getCicIderegistro() {
		return this.cicIderegistro;
	}

	public void setCicIderegistro(Integer cicIderegistro) {

		this.cicIderegistro = cicIderegistro;
	}

	public String getPerNombre() {
		return this.perNombre;
	}

	public void setPerNombre(String perNombre) {

		this.perNombre = perNombre;
	}

	public String getPerEstado() {
		return this.perEstado;
	}

	public void setPerEstado(String perEstado) {

		this.perEstado = perEstado;
	}

	public String getPerBlofecha() {
		return this.perBlofecha;
	}

	public void setPerBlofecha(String perBlofecha) {

		this.perBlofecha = perBlofecha;
	}

	public Date getPerFecinicial() {
		return this.perFecinicial;
	}

	public void setPerFecinicial(Date perFecinicial) {

		this.perFecinicial = perFecinicial;
	}

	public Date getPerFecfinal() {
		return this.perFecfinal;
	}

	public void setPerFecfinal(Date perFecfinal) {

		this.perFecfinal = perFecfinal;
	}

	public Date getPerFecvence() {
		return this.perFecvence;
	}

	public void setPerFecvence(Date perFecvence) {

		this.perFecvence = perFecvence;
	}

	public Date getPerFecsuspens() {
		return this.perFecsuspens;
	}

	public void setPerFecsuspens(Date perFecsuspens) {

		this.perFecsuspens = perFecsuspens;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {

		this.usuIderegistro = usuIderegistro;
	}

	public CicCiclo getCicCicloperPeriodoCicIderegistroFkey() {
		return this.cicCicloperPeriodoCicIderegistroFkey;
	}

	public void setCicCicloperPeriodoCicIderegistroFkey(CicCiclo cicCicloperPeriodoCicIderegistroFkey) {
		this.cicCicloperPeriodoCicIderegistroFkey = cicCicloperPeriodoCicIderegistroFkey;
	}

	public List<NotNota> getNotNotas() {
		return notNotas;
	}

	public void setNotNotas(List<NotNota> notNotas) {
		this.notNotas = notNotas;
	}

	public List<DperDetperiodo> getDperDetperiodos() {
		return dperDetperiodos;
	}

	public void setDperDetperiodos(List<DperDetperiodo> dperDetperiodos) {
		this.dperDetperiodos = dperDetperiodos;
	}

	/**
	 * Verifica si la entidad contiene el atributo que se pasa como parámetro
	 *
	 * @param atributo Nombre del atributo a validar
	 * @return Verdadero si la entidad contiene al atributo.
	 */
	public static boolean contieneAtributo(String atributo) {

		boolean contiene = false;
		for (final String atr : ATRIBUTOS_ENTIDAD_PER_PERIODO) {
			if (atr.equals(atributo)) {
				contiene = true;
			}
		}

		return contiene;
	}

	public static String[] getAtributosEntidadPerPeriodo() {
		return ATRIBUTOS_ENTIDAD_PER_PERIODO;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		int hash = 3;

		hash = 37 * hash + Objects.hashCode(this.perIderegistro);
		hash = 37 * hash + Objects.hashCode(this.perIdeorden);
		hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
		hash = 37 * hash + Objects.hashCode(this.perNombre);
		hash = 37 * hash + Objects.hashCode(this.perEstado);
		hash = 37 * hash + Objects.hashCode(this.perBlofecha);
		hash = 37 * hash + Objects.hashCode(this.perFecinicial);
		hash = 37 * hash + Objects.hashCode(this.perFecfinal);
		hash = 37 * hash + Objects.hashCode(this.perFecvence);
		hash = 37 * hash + Objects.hashCode(this.perFecsuspens);
		hash = 37 * hash + Objects.hashCode(this.usuIderegistro);

		return hash;
	}

	/**
	 * Valida la igualdad de la instancia de la entidad PerPeriodo que se pasa como
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
		final PerPeriodo other = (PerPeriodo) obj;

		if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.perIdeorden, other.perIdeorden)) {
			return false;
		}

		if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
			return false;
		}

		if (!Objects.equals(this.perNombre, other.perNombre)) {
			return false;
		}

		if (!Objects.equals(this.perEstado, other.perEstado)) {
			return false;
		}

		if (!Objects.equals(this.perBlofecha, other.perBlofecha)) {
			return false;
		}

		if (!Objects.equals(this.perFecinicial, other.perFecinicial)) {
			return false;
		}

		if (!Objects.equals(this.perFecfinal, other.perFecfinal)) {
			return false;
		}

		if (!Objects.equals(this.perFecvence, other.perFecvence)) {
			return false;
		}

		if (!Objects.equals(this.perFecsuspens, other.perFecsuspens)) {
			return false;
		}

		return Objects.equals(this.usuIderegistro, other.usuIderegistro);

	}

	// protected region metodos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region metodos adicionales end

}
