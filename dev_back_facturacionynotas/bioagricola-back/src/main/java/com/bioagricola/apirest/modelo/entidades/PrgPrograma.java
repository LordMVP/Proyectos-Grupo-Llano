package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the prg_programa database table.
 * 
 */
@Entity
@Table(name = "prg_programa")
@NamedQuery(name = "PrgPrograma.findAll", query = "SELECT p FROM PrgPrograma p")
public class PrgPrograma implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "prg_ideregistro")
	private Integer prgIderegistro;

	@Column(name = "prg_abreviatura")
	private String prgAbreviatura;

	@Column(name = "prg_localiza")
	private String prgLocaliza;

	@Column(name = "prg_nombre")
	private String prgNombre;

	@Column(name = "prg_tipo")
	private String prgTipo;

	@Column(name = "prg_version")
	private String prgVersion;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	// bi-directional many-to-one association to DperDetperiodo
	@OneToMany(mappedBy = "prgPrograma")
	private List<DperDetperiodo> dperDetperiodos;

	public PrgPrograma() {
		//constructor por defecto
	}

	public Integer getPrgIderegistro() {
		return this.prgIderegistro;
	}

	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	public String getPrgAbreviatura() {
		return this.prgAbreviatura;
	}

	public void setPrgAbreviatura(String prgAbreviatura) {
		this.prgAbreviatura = prgAbreviatura;
	}

	public String getPrgLocaliza() {
		return this.prgLocaliza;
	}

	public void setPrgLocaliza(String prgLocaliza) {
		this.prgLocaliza = prgLocaliza;
	}

	public String getPrgNombre() {
		return this.prgNombre;
	}

	public void setPrgNombre(String prgNombre) {
		this.prgNombre = prgNombre;
	}

	public String getPrgTipo() {
		return this.prgTipo;
	}

	public void setPrgTipo(String prgTipo) {
		this.prgTipo = prgTipo;
	}

	public String getPrgVersion() {
		return this.prgVersion;
	}

	public void setPrgVersion(String prgVersion) {
		this.prgVersion = prgVersion;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

}