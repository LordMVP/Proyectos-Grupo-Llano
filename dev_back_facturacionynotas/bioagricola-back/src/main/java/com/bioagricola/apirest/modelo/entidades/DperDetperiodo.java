package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import uk.co.jemos.podam.annotations.PodamExclude;


/**
 * The persistent class for the dper_detperiodo database table.
 * 
 */
@Entity
@Table(name="dper_detperiodo")
@NamedQuery(name="DperDetperiodo.findAll", query="SELECT d FROM DperDetperiodo d")
public class DperDetperiodo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="dper_ideregistr")
	private Integer dperIderegistr;

	@Column(name="dper_actividad")
	private String dperActividad;

	@Column(name="dper_ctrdependen")
	private String dperCtrdependen;

	@Column(name="dper_ctrfecha")
	private String dperCtrfecha;

	@Column(name="dper_estado")
	private String dperEstado;

	@Column(name="dper_fecactiva")
	private Timestamp dperFecactiva;

	@Column(name="dper_feccierre")
	private Timestamp dperFeccierre;

	@Column(name="dper_fecfinal")
	private Timestamp dperFecfinal;

	@Column(name="dper_fecinicial")
	private Timestamp dperFecinicial;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	//bi-directional many-to-one association to CicCiclo
	@ManyToOne
	@JoinColumn(name="cic_ideregistro", referencedColumnName="cic_ideregistro")
	@PodamExclude
	private CicCiclo cicCiclo;

	//bi-directional many-to-one association to PerPeriodo
	@ManyToOne
	@JoinColumns({
		@JoinColumn(name="cic_ideregistro", referencedColumnName="cic_ideregistro", insertable = false, updatable = false),
		@JoinColumn(name="per_ideregistro", referencedColumnName="per_ideregistro", insertable = false, updatable = false)
		})
	@PodamExclude
	private PerPeriodo perPeriodo;

	//bi-directional many-to-one association to PrgPrograma
	@ManyToOne
	@JoinColumn(name="prg_ideregistro", referencedColumnName="prg_ideregistro")
	@PodamExclude
	private PrgPrograma prgPrograma;

	public DperDetperiodo() {
		//constructor por defecto
	}

	public Integer getDperIderegistr() {
		return this.dperIderegistr;
	}

	public void setDperIderegistr(Integer dperIderegistr) {
		this.dperIderegistr = dperIderegistr;
	}

	public String getDperActividad() {
		return this.dperActividad;
	}

	public void setDperActividad(String dperActividad) {
		this.dperActividad = dperActividad;
	}

	public String getDperCtrdependen() {
		return this.dperCtrdependen;
	}

	public void setDperCtrdependen(String dperCtrdependen) {
		this.dperCtrdependen = dperCtrdependen;
	}

	public String getDperCtrfecha() {
		return this.dperCtrfecha;
	}

	public void setDperCtrfecha(String dperCtrfecha) {
		this.dperCtrfecha = dperCtrfecha;
	}

	public String getDperEstado() {
		return this.dperEstado;
	}

	public void setDperEstado(String dperEstado) {
		this.dperEstado = dperEstado;
	}

	public Timestamp getDperFecactiva() {
		return this.dperFecactiva;
	}

	public void setDperFecactiva(Timestamp dperFecactiva) {
		this.dperFecactiva = dperFecactiva;
	}

	public Timestamp getDperFeccierre() {
		return this.dperFeccierre;
	}

	public void setDperFeccierre(Timestamp dperFeccierre) {
		this.dperFeccierre = dperFeccierre;
	}

	public Timestamp getDperFecfinal() {
		return this.dperFecfinal;
	}

	public void setDperFecfinal(Timestamp dperFecfinal) {
		this.dperFecfinal = dperFecfinal;
	}

	public Timestamp getDperFecinicial() {
		return this.dperFecinicial;
	}

	public void setDperFecinicial(Timestamp dperFecinicial) {
		this.dperFecinicial = dperFecinicial;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public CicCiclo getCicCiclo() {
		return this.cicCiclo;
	}

	public void setCicCiclo(CicCiclo cicCiclo) {
		this.cicCiclo = cicCiclo;
	}

	public PerPeriodo getPerPeriodo() {
		return this.perPeriodo;
	}

	public void setPerPeriodo(PerPeriodo perPeriodo) {
		this.perPeriodo = perPeriodo;
	}

	public PrgPrograma getPrgPrograma() {
		return this.prgPrograma;
	}

	public void setPrgPrograma(PrgPrograma prgPrograma) {
		this.prgPrograma = prgPrograma;
	}

}