package com.bioagricola.apirest.modelo.entidades;


import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the servicios_agenda database table.
 * 
 */
@Entity
@Table(name="servicios_agenda")
@NamedQuery(name="ServiciosAgenda.findAll", query="SELECT s FROM ServiciosAgenda s")
public class ServiciosAgenda implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="serage_cod")
	private long serageCod;

	@Column(name="serage_codage")
	private String serageCodage;

	@Column(name="serage_coddepemp")
	private String serageCoddepemp;

	@Column(name="serage_codemp")
	private String serageCodemp;

	@Column(name="serage_codpro")
	private String serageCodpro;

	@Column(name="serage_codser")
	private String serageCodser;

	@Column(name="serage_etaant")
	private String serageEtaant;

	@Column(name="serage_etasig")
	private String serageEtasig;

	@Column(name="serage_fecgra")
	private Timestamp serageFecgra;

	@Column(name="serage_nivser")
	private BigDecimal serageNivser;

	@Column(name="serage_ordser")
	private BigDecimal serageOrdser;

	@Column(name="serage_swtact")
	private Boolean serageSwtact;

	@Column(name="serage_usugra")
	private String serageUsugra;

	@Column(name="uni_novrevision")
	private Integer uniNovrevision;

	public ServiciosAgenda() {
	}

	public long getSerageCod() {
		return this.serageCod;
	}

	public void setSerageCod(long serageCod) {
		this.serageCod = serageCod;
	}

	public String getSerageCodage() {
		return this.serageCodage;
	}

	public void setSerageCodage(String serageCodage) {
		this.serageCodage = serageCodage;
	}

	public String getSerageCoddepemp() {
		return this.serageCoddepemp;
	}

	public void setSerageCoddepemp(String serageCoddepemp) {
		this.serageCoddepemp = serageCoddepemp;
	}

	public String getSerageCodemp() {
		return this.serageCodemp;
	}

	public void setSerageCodemp(String serageCodemp) {
		this.serageCodemp = serageCodemp;
	}

	public String getSerageCodpro() {
		return this.serageCodpro;
	}

	public void setSerageCodpro(String serageCodpro) {
		this.serageCodpro = serageCodpro;
	}

	public String getSerageCodser() {
		return this.serageCodser;
	}

	public void setSerageCodser(String serageCodser) {
		this.serageCodser = serageCodser;
	}

	public String getSerageEtaant() {
		return this.serageEtaant;
	}

	public void setSerageEtaant(String serageEtaant) {
		this.serageEtaant = serageEtaant;
	}

	public String getSerageEtasig() {
		return this.serageEtasig;
	}

	public void setSerageEtasig(String serageEtasig) {
		this.serageEtasig = serageEtasig;
	}

	public Timestamp getSerageFecgra() {
		return this.serageFecgra;
	}

	public void setSerageFecgra(Timestamp serageFecgra) {
		this.serageFecgra = serageFecgra;
	}

	public BigDecimal getSerageNivser() {
		return this.serageNivser;
	}

	public void setSerageNivser(BigDecimal serageNivser) {
		this.serageNivser = serageNivser;
	}

	public BigDecimal getSerageOrdser() {
		return this.serageOrdser;
	}

	public void setSerageOrdser(BigDecimal serageOrdser) {
		this.serageOrdser = serageOrdser;
	}

	public Boolean getSerageSwtact() {
		return this.serageSwtact;
	}

	public void setSerageSwtact(Boolean serageSwtact) {
		this.serageSwtact = serageSwtact;
	}

	public String getSerageUsugra() {
		return this.serageUsugra;
	}

	public void setSerageUsugra(String serageUsugra) {
		this.serageUsugra = serageUsugra;
	}

	public Integer getUniNovrevision() {
		return this.uniNovrevision;
	}

	public void setUniNovrevision(Integer uniNovrevision) {
		this.uniNovrevision = uniNovrevision;
	}

}