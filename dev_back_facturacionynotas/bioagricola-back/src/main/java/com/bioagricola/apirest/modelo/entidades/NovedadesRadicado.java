package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the novedades_radicado database table.
 * 
 */
@Entity
@Table(name="novedades_radicado")
@NamedQuery(name="NovedadesRadicado.findAll", query="SELECT n FROM NovedadesRadicado n")
public class NovedadesRadicado implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="novedadradicado_llacom")
	private String novedadradicadoLlacom;

	@Column(name="novedadradicado_ali")
	private String novedadradicadoAli;

	@Column(name="novedadradicado_cod")
	private String novedadradicadoCod;

	@Column(name="novedadradicado_coddepemp")
	private String novedadradicadoCoddepemp;

	@Column(name="novedadradicado_codemp")
	private String novedadradicadoCodemp;

	@Column(name="novedadradicado_gru")
	private String novedadradicadoGru;

	@Column(name="novedadradicado_nom")
	private String novedadradicadoNom;

	@Column(name="novedadradicado_swtact")
	private Boolean novedadradicadoSwtact;

	@Column(name="novedadradicado_swtcammed")
	private Boolean novedadradicadoSwtcammed;

	@Column(name="novedadradicado_swtcamreg")
	private Boolean novedadradicadoSwtcamreg;

	@Column(name="novedadradicado_swtcar")
	private Boolean novedadradicadoSwtcar;

	@Column(name="novedadradicado_swtcrenuesol")
	private Boolean novedadradicadoSwtcrenuesol;

	@Column(name="novedadradicado_swtfac")
	private Boolean novedadradicadoSwtfac;

	@Column(name="novedadradicado_swtfavemp")
	private Boolean novedadradicadoSwtfavemp;

	@Column(name="novedadradicado_swtfavusu")
	private Boolean novedadradicadoSwtfavusu;

	@Column(name="novedadradicado_swtfin")
	private Boolean novedadradicadoSwtfin;

	@Column(name="novedadradicado_swtrep")
	private Boolean novedadradicadoSwtrep;

	public NovedadesRadicado() {
		//constructor por defecto
	}

	public String getNovedadradicadoLlacom() {
		return this.novedadradicadoLlacom;
	}

	public void setNovedadradicadoLlacom(String novedadradicadoLlacom) {
		this.novedadradicadoLlacom = novedadradicadoLlacom;
	}

	public String getNovedadradicadoAli() {
		return this.novedadradicadoAli;
	}

	public void setNovedadradicadoAli(String novedadradicadoAli) {
		this.novedadradicadoAli = novedadradicadoAli;
	}

	public String getNovedadradicadoCod() {
		return this.novedadradicadoCod;
	}

	public void setNovedadradicadoCod(String novedadradicadoCod) {
		this.novedadradicadoCod = novedadradicadoCod;
	}

	public String getNovedadradicadoCoddepemp() {
		return this.novedadradicadoCoddepemp;
	}

	public void setNovedadradicadoCoddepemp(String novedadradicadoCoddepemp) {
		this.novedadradicadoCoddepemp = novedadradicadoCoddepemp;
	}

	public String getNovedadradicadoCodemp() {
		return this.novedadradicadoCodemp;
	}

	public void setNovedadradicadoCodemp(String novedadradicadoCodemp) {
		this.novedadradicadoCodemp = novedadradicadoCodemp;
	}

	public String getNovedadradicadoGru() {
		return this.novedadradicadoGru;
	}

	public void setNovedadradicadoGru(String novedadradicadoGru) {
		this.novedadradicadoGru = novedadradicadoGru;
	}

	public String getNovedadradicadoNom() {
		return this.novedadradicadoNom;
	}

	public void setNovedadradicadoNom(String novedadradicadoNom) {
		this.novedadradicadoNom = novedadradicadoNom;
	}

	public Boolean getNovedadradicadoSwtact() {
		return this.novedadradicadoSwtact;
	}

	public void setNovedadradicadoSwtact(Boolean novedadradicadoSwtact) {
		this.novedadradicadoSwtact = novedadradicadoSwtact;
	}

	public Boolean getNovedadradicadoSwtcammed() {
		return this.novedadradicadoSwtcammed;
	}

	public void setNovedadradicadoSwtcammed(Boolean novedadradicadoSwtcammed) {
		this.novedadradicadoSwtcammed = novedadradicadoSwtcammed;
	}

	public Boolean getNovedadradicadoSwtcamreg() {
		return this.novedadradicadoSwtcamreg;
	}

	public void setNovedadradicadoSwtcamreg(Boolean novedadradicadoSwtcamreg) {
		this.novedadradicadoSwtcamreg = novedadradicadoSwtcamreg;
	}

	public Boolean getNovedadradicadoSwtcar() {
		return this.novedadradicadoSwtcar;
	}

	public void setNovedadradicadoSwtcar(Boolean novedadradicadoSwtcar) {
		this.novedadradicadoSwtcar = novedadradicadoSwtcar;
	}

	public Boolean getNovedadradicadoSwtcrenuesol() {
		return this.novedadradicadoSwtcrenuesol;
	}

	public void setNovedadradicadoSwtcrenuesol(Boolean novedadradicadoSwtcrenuesol) {
		this.novedadradicadoSwtcrenuesol = novedadradicadoSwtcrenuesol;
	}

	public Boolean getNovedadradicadoSwtfac() {
		return this.novedadradicadoSwtfac;
	}

	public void setNovedadradicadoSwtfac(Boolean novedadradicadoSwtfac) {
		this.novedadradicadoSwtfac = novedadradicadoSwtfac;
	}

	public Boolean getNovedadradicadoSwtfavemp() {
		return this.novedadradicadoSwtfavemp;
	}

	public void setNovedadradicadoSwtfavemp(Boolean novedadradicadoSwtfavemp) {
		this.novedadradicadoSwtfavemp = novedadradicadoSwtfavemp;
	}

	public Boolean getNovedadradicadoSwtfavusu() {
		return this.novedadradicadoSwtfavusu;
	}

	public void setNovedadradicadoSwtfavusu(Boolean novedadradicadoSwtfavusu) {
		this.novedadradicadoSwtfavusu = novedadradicadoSwtfavusu;
	}

	public Boolean getNovedadradicadoSwtfin() {
		return this.novedadradicadoSwtfin;
	}

	public void setNovedadradicadoSwtfin(Boolean novedadradicadoSwtfin) {
		this.novedadradicadoSwtfin = novedadradicadoSwtfin;
	}

	public Boolean getNovedadradicadoSwtrep() {
		return this.novedadradicadoSwtrep;
	}

	public void setNovedadradicadoSwtrep(Boolean novedadradicadoSwtrep) {
		this.novedadradicadoSwtrep = novedadradicadoSwtrep;
	}

}