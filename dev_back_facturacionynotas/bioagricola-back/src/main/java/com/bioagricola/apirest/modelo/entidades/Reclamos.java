package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "reclamos")
@NamedQuery(name = "Reclamos.findAll", query = "SELECT p FROM Reclamos p")
public class Reclamos implements Serializable {

	@Id
	@Column(name = "reclamo_numpqr")
	private String reclamoNumpqr;

	@Column(name = "reclamo_tipsol")
	private String reclamoTipsol;

	@Temporal(TemporalType.DATE)
	@Column(name = "reclamo_fecsol")
	private Date reclamoFecsol;

	@Column(name = "reclamo_nomsol")
	private String reclamoNomsol;

	@Column(name = "reclamo_idsol")
	private String reclamoIdsol;

	@Column(name = "reclamo_codsus")
	private String reclamoCodsus;

	@Column(name = "reclamo_telsol")
	private String reclamoTelsol;

	@Column(name = "reclamo_celsol")
	private String reclamoCelsol;

	@Column(name = "reclamo_email")
	private String reclamoEmail;

	@Column(name = "reclamo_codsec")
	private String reclamoCodsec;

	@Column(name = "reclamo_obssol")
	private String reclamoObssol;

	@Column(name = "reclamo_est")
	private String reclamoEst;

	@Column(name = "reclamo_codemp")
	private String reclamoCodemp;

	@Column(name = "reclamo_tipate")
	private String reclamoTipate;

	@Column(name = "reclamo_tipnot")
	private String reclamoTipnot;

	@Column(name = "reclamo_codrec")
	private String reclamoCodrec;

	@Column(name = "reclamo_codage")
	private String reclamoCodage;

	@Column(name = "reclamo_codpro")
	private String reclamoCodpro;

	@Column(name = "reclamo_codbar")
	private String reclamoCodbar;

	@Column(name = "reclamo_tiprep")
	private String reclamoTiprep;

	@Column(name = "reclamo_dir")
	private String reclamoDir;

	@Column(name = "reclamo_deprep")
	private String reclamoDeprep;

	@Column(name = "reclamo_swteme")
	private Boolean reclamoSwteme;

	@Column(name = "reclamo_usugra")
	private String reclamoUsugra;

	@Column(name = "reclamo_fecgra")
	private Timestamp reclamoFecgra;

	@Column(name = "reclamo_sus")
	private String reclamoSus;

	@Column(name = "reclamo_empcon")
	private String reclamoEmpcon;

	@Column(name = "reclamo_swtpro")
	private Boolean reclamoSwtpro;

	@Column(name = "reclamo_nombar")
	private String reclamoNombar;

	@Column(name = "reclamo_swtcamvlr")
	private String reclamoSwtcamvlr;

	@Column(name = "reclamo_pqrdep")
	private String reclamoPqrdep;

	@Column(name = "reclamo_swtdes")
	private Boolean reclamoSwtdes;

	@Column(name = "reclamo_camvlr")
	private String reclamoCamvlr;

	@Temporal(TemporalType.DATE)
	@Column(name = "reclamo_fecamp")
	private Date reclamoFecamp;

	@Column(name = "reclamo_horsol")
	private String reclamoHorsol;

	@Column(name = "reclamo_fue")
	private String reclamoFue;

	@Column(name = "reclamo_det")
	private String reclamoDet;

	@Column(name = "reclamo_esteme")
	private String reclamoEsteme;

	@Column(name = "reclamo_radprev")
	private String reclamoRadprev;

	@Column(name = "reclamo_llacom")
	private String reclamoLlacom;

	@Column(name = "reclamo_swtema")
	private Boolean reclamoSwtema;

	@Column(name = "reclamo_numfac")
	private String reclamoNumfac;

	@Column(name = "reclamo_swtrepsui")
	private Boolean reclamoSwtrepsui;

	@Temporal(TemporalType.DATE)
	@Column(name = "reclamo_feclis")
	private Date reclamoFeclis;

	@Column(name = "reclamo_dirnot")
	private String reclamoDirnot;

	@Column(name = "reclamo_barnot")
	private String reclamoBarnot;

	@Column(name = "reclamo_cornot")
	private String reclamoCornot;

	@Column(name = "reclamo_telnot")
	private String reclamoTelnot;

	@Column(name = "reclamo_nompet")
	private String reclamoNompet;

	@Column(name = "reclamo_numane")
	private BigDecimal reclamoNumane;

	@Column(name = "reclamo_clasol")
	private String reclamoClasol;

	@Column(name = "reclamo_usuact")
	private String reclamoUsuact;

	@Column(name = "reclamo_fecact")
	private Timestamp reclamoFecact;

	@Column(name = "reclamo_nomter")
	private String reclamoNomter;

	@Column(name = "reclamo_cedter")
	private String reclamoCedter;

	@Column(name = "reclamo_telter")
	private String reclamoTelter;

	@Column(name = "reclamo_corter")
	private String reclamoCorter;

	@Column(name = "ven_ideregistro")
	private BigDecimal venIderegistro;

	@Column(name = "reclamo_medserfigas")
	private String reclamoMedserfigas;

	@Column(name = "reclamo_swtcontactos")
	private Short reclamoSwtcontactos;

	public Reclamos() {
		super();
	}

	public String getReclamoNumpqr() {
		return reclamoNumpqr;
	}

	public void setReclamoNumpqr(String reclamoNumpqr) {
		this.reclamoNumpqr = reclamoNumpqr;
	}

	public String getReclamoTipsol() {
		return reclamoTipsol;
	}

	public void setReclamoTipsol(String reclamoTipsol) {
		this.reclamoTipsol = reclamoTipsol;
	}

	public Date getReclamoFecsol() {
		return reclamoFecsol;
	}

	public void setReclamoFecsol(Date reclamoFecsol) {
		this.reclamoFecsol = reclamoFecsol;
	}

	public String getReclamoNomsol() {
		return reclamoNomsol;
	}

	public void setReclamoNomsol(String reclamoNomsol) {
		this.reclamoNomsol = reclamoNomsol;
	}

	public String getReclamoIdsol() {
		return reclamoIdsol;
	}

	public void setReclamoIdsol(String reclamoIdsol) {
		this.reclamoIdsol = reclamoIdsol;
	}

	public String getReclamoCodsus() {
		return reclamoCodsus;
	}

	public void setReclamoCodsus(String reclamoCodsus) {
		this.reclamoCodsus = reclamoCodsus;
	}

	public String getReclamoTelsol() {
		return reclamoTelsol;
	}

	public void setReclamoTelsol(String reclamoTelsol) {
		this.reclamoTelsol = reclamoTelsol;
	}

	public String getReclamoCelsol() {
		return reclamoCelsol;
	}

	public void setReclamoCelsol(String reclamoCelsol) {
		this.reclamoCelsol = reclamoCelsol;
	}

	public String getReclamoEmail() {
		return reclamoEmail;
	}

	public void setReclamoEmail(String reclamoEmail) {
		this.reclamoEmail = reclamoEmail;
	}

	public String getReclamoCodsec() {
		return reclamoCodsec;
	}

	public void setReclamoCodsec(String reclamoCodsec) {
		this.reclamoCodsec = reclamoCodsec;
	}

	public String getReclamoObssol() {
		return reclamoObssol;
	}

	public void setReclamoObssol(String reclamoObssol) {
		this.reclamoObssol = reclamoObssol;
	}

	public String getReclamoEst() {
		return reclamoEst;
	}

	public void setReclamoEst(String reclamoEst) {
		this.reclamoEst = reclamoEst;
	}

	public String getReclamoCodemp() {
		return reclamoCodemp;
	}

	public void setReclamoCodemp(String reclamoCodemp) {
		this.reclamoCodemp = reclamoCodemp;
	}

	public String getReclamoTipate() {
		return reclamoTipate;
	}

	public void setReclamoTipate(String reclamoTipate) {
		this.reclamoTipate = reclamoTipate;
	}

	public String getReclamoTipnot() {
		return reclamoTipnot;
	}

	public void setReclamoTipnot(String reclamoTipnot) {
		this.reclamoTipnot = reclamoTipnot;
	}

	public String getReclamoCodrec() {
		return reclamoCodrec;
	}

	public void setReclamoCodrec(String reclamoCodrec) {
		this.reclamoCodrec = reclamoCodrec;
	}

	public String getReclamoCodage() {
		return reclamoCodage;
	}

	public void setReclamoCodage(String reclamoCodage) {
		this.reclamoCodage = reclamoCodage;
	}

	public String getReclamoCodpro() {
		return reclamoCodpro;
	}

	public void setReclamoCodpro(String reclamoCodpro) {
		this.reclamoCodpro = reclamoCodpro;
	}

	public String getReclamoCodbar() {
		return reclamoCodbar;
	}

	public void setReclamoCodbar(String reclamoCodbar) {
		this.reclamoCodbar = reclamoCodbar;
	}

	public String getReclamoTiprep() {
		return reclamoTiprep;
	}

	public void setReclamoTiprep(String reclamoTiprep) {
		this.reclamoTiprep = reclamoTiprep;
	}

	public String getReclamoDir() {
		return reclamoDir;
	}

	public void setReclamoDir(String reclamoDir) {
		this.reclamoDir = reclamoDir;
	}

	public String getReclamoDeprep() {
		return reclamoDeprep;
	}

	public void setReclamoDeprep(String reclamoDeprep) {
		this.reclamoDeprep = reclamoDeprep;
	}

	public Boolean getReclamoSwteme() {
		return reclamoSwteme;
	}

	public void setReclamoSwteme(Boolean reclamoSwteme) {
		this.reclamoSwteme = reclamoSwteme;
	}

	public String getReclamoUsugra() {
		return reclamoUsugra;
	}

	public void setReclamoUsugra(String reclamoUsugra) {
		this.reclamoUsugra = reclamoUsugra;
	}

	public Date getReclamoFecgra() {
		return reclamoFecgra;
	}

	public void setReclamoFecgra(Timestamp reclamoFecgra) {
		this.reclamoFecgra = reclamoFecgra;
	}

	public String getReclamoSus() {
		return reclamoSus;
	}

	public void setReclamoSus(String reclamoSus) {
		this.reclamoSus = reclamoSus;
	}

	public String getReclamoEmpcon() {
		return reclamoEmpcon;
	}

	public void setReclamoEmpcon(String reclamoEmpcon) {
		this.reclamoEmpcon = reclamoEmpcon;
	}

	public Boolean getReclamoSwtpro() {
		return reclamoSwtpro;
	}

	public void setReclamoSwtpro(Boolean reclamoSwtpro) {
		this.reclamoSwtpro = reclamoSwtpro;
	}

	public String getReclamoNombar() {
		return reclamoNombar;
	}

	public void setReclamoNombar(String reclamoNombar) {
		this.reclamoNombar = reclamoNombar;
	}

	public String getReclamoSwtcamvlr() {
		return reclamoSwtcamvlr;
	}

	public void setReclamoSwtcamvlr(String reclamoSwtcamvlr) {
		this.reclamoSwtcamvlr = reclamoSwtcamvlr;
	}

	public String getReclamoPqrdep() {
		return reclamoPqrdep;
	}

	public void setReclamoPqrdep(String reclamoPqrdep) {
		this.reclamoPqrdep = reclamoPqrdep;
	}

	public Boolean getReclamoSwtdes() {
		return reclamoSwtdes;
	}

	public void setReclamoSwtdes(Boolean reclamoSwtdes) {
		this.reclamoSwtdes = reclamoSwtdes;
	}

	public String getReclamoCamvlr() {
		return reclamoCamvlr;
	}

	public void setReclamoCamvlr(String reclamoCamvlr) {
		this.reclamoCamvlr = reclamoCamvlr;
	}

	public Date getReclamoFecamp() {
		return reclamoFecamp;
	}

	public void setReclamoFecamp(Date reclamoFecamp) {
		this.reclamoFecamp = reclamoFecamp;
	}

	public String getReclamoHorsol() {
		return reclamoHorsol;
	}

	public void setReclamoHorsol(String reclamoHorsol) {
		this.reclamoHorsol = reclamoHorsol;
	}

	public String getReclamoFue() {
		return reclamoFue;
	}

	public void setReclamoFue(String reclamoFue) {
		this.reclamoFue = reclamoFue;
	}

	public String getReclamoDet() {
		return reclamoDet;
	}

	public void setReclamoDet(String reclamoDet) {
		this.reclamoDet = reclamoDet;
	}

	public String getReclamoEsteme() {
		return reclamoEsteme;
	}

	public void setReclamoEsteme(String reclamoEsteme) {
		this.reclamoEsteme = reclamoEsteme;
	}

	public String getReclamoRadprev() {
		return reclamoRadprev;
	}

	public void setReclamoRadprev(String reclamoRadprev) {
		this.reclamoRadprev = reclamoRadprev;
	}

	public String getReclamoLlacom() {
		return reclamoLlacom;
	}

	public void setReclamoLlacom(String reclamoLlacom) {
		this.reclamoLlacom = reclamoLlacom;
	}

	public Boolean getReclamoSwtema() {
		return reclamoSwtema;
	}

	public void setReclamoSwtema(Boolean reclamoSwtema) {
		this.reclamoSwtema = reclamoSwtema;
	}

	public String getReclamoNumfac() {
		return reclamoNumfac;
	}

	public void setReclamoNumfac(String reclamoNumfac) {
		this.reclamoNumfac = reclamoNumfac;
	}

	public Boolean getReclamoSwtrepsui() {
		return reclamoSwtrepsui;
	}

	public void setReclamoSwtrepsui(Boolean reclamoSwtrepsui) {
		this.reclamoSwtrepsui = reclamoSwtrepsui;
	}

	public Date getReclamoFeclis() {
		return reclamoFeclis;
	}

	public void setReclamoFeclis(Date reclamoFeclis) {
		this.reclamoFeclis = reclamoFeclis;
	}

	public String getReclamoDirnot() {
		return reclamoDirnot;
	}

	public void setReclamoDirnot(String reclamoDirnot) {
		this.reclamoDirnot = reclamoDirnot;
	}

	public String getReclamoBarnot() {
		return reclamoBarnot;
	}

	public void setReclamoBarnot(String reclamoBarnot) {
		this.reclamoBarnot = reclamoBarnot;
	}

	public String getReclamoCornot() {
		return reclamoCornot;
	}

	public void setReclamoCornot(String reclamoCornot) {
		this.reclamoCornot = reclamoCornot;
	}

	public String getReclamoTelnot() {
		return reclamoTelnot;
	}

	public void setReclamoTelnot(String reclamoTelnot) {
		this.reclamoTelnot = reclamoTelnot;
	}

	public String getReclamoNompet() {
		return reclamoNompet;
	}

	public void setReclamoNompet(String reclamoNompet) {
		this.reclamoNompet = reclamoNompet;
	}

	public BigDecimal getReclamoNumane() {
		return reclamoNumane;
	}

	public void setReclamoNumane(BigDecimal reclamoNumane) {
		this.reclamoNumane = reclamoNumane;
	}

	public String getReclamoClasol() {
		return reclamoClasol;
	}

	public void setReclamoClasol(String reclamoClasol) {
		this.reclamoClasol = reclamoClasol;
	}

	public String getReclamoUsuact() {
		return reclamoUsuact;
	}

	public void setReclamoUsuact(String reclamoUsuact) {
		this.reclamoUsuact = reclamoUsuact;
	}

	public Date getReclamoFecact() {
		return reclamoFecact;
	}

	public void setReclamoFecact(Timestamp reclamoFecact) {
		this.reclamoFecact = reclamoFecact;
	}

	public String getReclamoNomter() {
		return reclamoNomter;
	}

	public void setReclamoNomter(String reclamoNomter) {
		this.reclamoNomter = reclamoNomter;
	}

	public String getReclamoCedter() {
		return reclamoCedter;
	}

	public void setReclamoCedter(String reclamoCedter) {
		this.reclamoCedter = reclamoCedter;
	}

	public String getReclamoTelter() {
		return reclamoTelter;
	}

	public void setReclamoTelter(String reclamoTelter) {
		this.reclamoTelter = reclamoTelter;
	}

	public String getReclamoCorter() {
		return reclamoCorter;
	}

	public void setReclamoCorter(String reclamoCorter) {
		this.reclamoCorter = reclamoCorter;
	}

	public BigDecimal getVenIderegistro() {
		return venIderegistro;
	}

	public void setVenIderegistro(BigDecimal venIderegistro) {
		this.venIderegistro = venIderegistro;
	}

	public String getReclamoMedserfigas() {
		return reclamoMedserfigas;
	}

	public void setReclamoMedserfigas(String reclamoMedserfigas) {
		this.reclamoMedserfigas = reclamoMedserfigas;
	}

	public Short getReclamoSwtcontactos() {
		return reclamoSwtcontactos;
	}

	public void setReclamoSwtcontactos(Short reclamoSwtcontactos) {
		this.reclamoSwtcontactos = reclamoSwtcontactos;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((reclamoBarnot == null) ? 0 : reclamoBarnot.hashCode());
		result = prime * result + ((reclamoCamvlr == null) ? 0 : reclamoCamvlr.hashCode());
		result = prime * result + ((reclamoCedter == null) ? 0 : reclamoCedter.hashCode());
		result = prime * result + ((reclamoCelsol == null) ? 0 : reclamoCelsol.hashCode());
		result = prime * result + ((reclamoClasol == null) ? 0 : reclamoClasol.hashCode());
		result = prime * result + ((reclamoCodage == null) ? 0 : reclamoCodage.hashCode());
		result = prime * result + ((reclamoCodbar == null) ? 0 : reclamoCodbar.hashCode());
		result = prime * result + ((reclamoCodemp == null) ? 0 : reclamoCodemp.hashCode());
		result = prime * result + ((reclamoCodpro == null) ? 0 : reclamoCodpro.hashCode());
		result = prime * result + ((reclamoCodrec == null) ? 0 : reclamoCodrec.hashCode());
		result = prime * result + ((reclamoCodsec == null) ? 0 : reclamoCodsec.hashCode());
		result = prime * result + ((reclamoCodsus == null) ? 0 : reclamoCodsus.hashCode());
		result = prime * result + ((reclamoCornot == null) ? 0 : reclamoCornot.hashCode());
		result = prime * result + ((reclamoCorter == null) ? 0 : reclamoCorter.hashCode());
		result = prime * result + ((reclamoDeprep == null) ? 0 : reclamoDeprep.hashCode());
		result = prime * result + ((reclamoDet == null) ? 0 : reclamoDet.hashCode());
		result = prime * result + ((reclamoDir == null) ? 0 : reclamoDir.hashCode());
		result = prime * result + ((reclamoDirnot == null) ? 0 : reclamoDirnot.hashCode());
		result = prime * result + ((reclamoEmail == null) ? 0 : reclamoEmail.hashCode());
		result = prime * result + ((reclamoEmpcon == null) ? 0 : reclamoEmpcon.hashCode());
		result = prime * result + ((reclamoEst == null) ? 0 : reclamoEst.hashCode());
		result = prime * result + ((reclamoEsteme == null) ? 0 : reclamoEsteme.hashCode());
		result = prime * result + ((reclamoFecact == null) ? 0 : reclamoFecact.hashCode());
		result = prime * result + ((reclamoFecamp == null) ? 0 : reclamoFecamp.hashCode());
		result = prime * result + ((reclamoFecgra == null) ? 0 : reclamoFecgra.hashCode());
		result = prime * result + ((reclamoFeclis == null) ? 0 : reclamoFeclis.hashCode());
		result = prime * result + ((reclamoFecsol == null) ? 0 : reclamoFecsol.hashCode());
		result = prime * result + ((reclamoFue == null) ? 0 : reclamoFue.hashCode());
		result = prime * result + ((reclamoHorsol == null) ? 0 : reclamoHorsol.hashCode());
		result = prime * result + ((reclamoIdsol == null) ? 0 : reclamoIdsol.hashCode());
		result = prime * result + ((reclamoLlacom == null) ? 0 : reclamoLlacom.hashCode());
		result = prime * result + ((reclamoMedserfigas == null) ? 0 : reclamoMedserfigas.hashCode());
		result = prime * result + ((reclamoNombar == null) ? 0 : reclamoNombar.hashCode());
		result = prime * result + ((reclamoNompet == null) ? 0 : reclamoNompet.hashCode());
		result = prime * result + ((reclamoNomsol == null) ? 0 : reclamoNomsol.hashCode());
		result = prime * result + ((reclamoNomter == null) ? 0 : reclamoNomter.hashCode());
		result = prime * result + ((reclamoNumane == null) ? 0 : reclamoNumane.hashCode());
		result = prime * result + ((reclamoNumfac == null) ? 0 : reclamoNumfac.hashCode());
		result = prime * result + ((reclamoNumpqr == null) ? 0 : reclamoNumpqr.hashCode());
		result = prime * result + ((reclamoObssol == null) ? 0 : reclamoObssol.hashCode());
		result = prime * result + ((reclamoPqrdep == null) ? 0 : reclamoPqrdep.hashCode());
		result = prime * result + ((reclamoRadprev == null) ? 0 : reclamoRadprev.hashCode());
		result = prime * result + ((reclamoSus == null) ? 0 : reclamoSus.hashCode());
		result = prime * result + ((reclamoSwtcamvlr == null) ? 0 : reclamoSwtcamvlr.hashCode());
		result = prime * result + ((reclamoSwtcontactos == null) ? 0 : reclamoSwtcontactos.hashCode());
		result = prime * result + ((reclamoSwtdes == null) ? 0 : reclamoSwtdes.hashCode());
		result = prime * result + ((reclamoSwtema == null) ? 0 : reclamoSwtema.hashCode());
		result = prime * result + ((reclamoSwteme == null) ? 0 : reclamoSwteme.hashCode());
		result = prime * result + ((reclamoSwtpro == null) ? 0 : reclamoSwtpro.hashCode());
		result = prime * result + ((reclamoSwtrepsui == null) ? 0 : reclamoSwtrepsui.hashCode());
		result = prime * result + ((reclamoTelnot == null) ? 0 : reclamoTelnot.hashCode());
		result = prime * result + ((reclamoTelsol == null) ? 0 : reclamoTelsol.hashCode());
		result = prime * result + ((reclamoTelter == null) ? 0 : reclamoTelter.hashCode());
		result = prime * result + ((reclamoTipate == null) ? 0 : reclamoTipate.hashCode());
		result = prime * result + ((reclamoTipnot == null) ? 0 : reclamoTipnot.hashCode());
		result = prime * result + ((reclamoTiprep == null) ? 0 : reclamoTiprep.hashCode());
		result = prime * result + ((reclamoTipsol == null) ? 0 : reclamoTipsol.hashCode());
		result = prime * result + ((reclamoUsuact == null) ? 0 : reclamoUsuact.hashCode());
		result = prime * result + ((reclamoUsugra == null) ? 0 : reclamoUsugra.hashCode());
		result = prime * result + ((venIderegistro == null) ? 0 : venIderegistro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Reclamos other = (Reclamos) obj;
		if (reclamoBarnot == null) {
			if (other.reclamoBarnot != null)
				return false;
		} else if (!reclamoBarnot.equals(other.reclamoBarnot))
			return false;
		if (reclamoCamvlr == null) {
			if (other.reclamoCamvlr != null)
				return false;
		} else if (!reclamoCamvlr.equals(other.reclamoCamvlr))
			return false;
		if (reclamoCedter == null) {
			if (other.reclamoCedter != null)
				return false;
		} else if (!reclamoCedter.equals(other.reclamoCedter))
			return false;
		if (reclamoCelsol == null) {
			if (other.reclamoCelsol != null)
				return false;
		} else if (!reclamoCelsol.equals(other.reclamoCelsol))
			return false;
		if (reclamoClasol == null) {
			if (other.reclamoClasol != null)
				return false;
		} else if (!reclamoClasol.equals(other.reclamoClasol))
			return false;
		if (reclamoCodage == null) {
			if (other.reclamoCodage != null)
				return false;
		} else if (!reclamoCodage.equals(other.reclamoCodage))
			return false;
		if (reclamoCodbar == null) {
			if (other.reclamoCodbar != null)
				return false;
		} else if (!reclamoCodbar.equals(other.reclamoCodbar))
			return false;
		if (reclamoCodemp == null) {
			if (other.reclamoCodemp != null)
				return false;
		} else if (!reclamoCodemp.equals(other.reclamoCodemp))
			return false;
		if (reclamoCodpro == null) {
			if (other.reclamoCodpro != null)
				return false;
		} else if (!reclamoCodpro.equals(other.reclamoCodpro))
			return false;
		if (reclamoCodrec == null) {
			if (other.reclamoCodrec != null)
				return false;
		} else if (!reclamoCodrec.equals(other.reclamoCodrec))
			return false;
		if (reclamoCodsec == null) {
			if (other.reclamoCodsec != null)
				return false;
		} else if (!reclamoCodsec.equals(other.reclamoCodsec))
			return false;
		if (reclamoCodsus == null) {
			if (other.reclamoCodsus != null)
				return false;
		} else if (!reclamoCodsus.equals(other.reclamoCodsus))
			return false;
		if (reclamoCornot == null) {
			if (other.reclamoCornot != null)
				return false;
		} else if (!reclamoCornot.equals(other.reclamoCornot))
			return false;
		if (reclamoCorter == null) {
			if (other.reclamoCorter != null)
				return false;
		} else if (!reclamoCorter.equals(other.reclamoCorter))
			return false;
		if (reclamoDeprep == null) {
			if (other.reclamoDeprep != null)
				return false;
		} else if (!reclamoDeprep.equals(other.reclamoDeprep))
			return false;
		if (reclamoDet == null) {
			if (other.reclamoDet != null)
				return false;
		} else if (!reclamoDet.equals(other.reclamoDet))
			return false;
		if (reclamoDir == null) {
			if (other.reclamoDir != null)
				return false;
		} else if (!reclamoDir.equals(other.reclamoDir))
			return false;
		if (reclamoDirnot == null) {
			if (other.reclamoDirnot != null)
				return false;
		} else if (!reclamoDirnot.equals(other.reclamoDirnot))
			return false;
		if (reclamoEmail == null) {
			if (other.reclamoEmail != null)
				return false;
		} else if (!reclamoEmail.equals(other.reclamoEmail))
			return false;
		if (reclamoEmpcon == null) {
			if (other.reclamoEmpcon != null)
				return false;
		} else if (!reclamoEmpcon.equals(other.reclamoEmpcon))
			return false;
		if (reclamoEst == null) {
			if (other.reclamoEst != null)
				return false;
		} else if (!reclamoEst.equals(other.reclamoEst))
			return false;
		if (reclamoEsteme == null) {
			if (other.reclamoEsteme != null)
				return false;
		} else if (!reclamoEsteme.equals(other.reclamoEsteme))
			return false;
		if (reclamoFecact == null) {
			if (other.reclamoFecact != null)
				return false;
		} else if (!reclamoFecact.equals(other.reclamoFecact))
			return false;
		if (reclamoFecamp == null) {
			if (other.reclamoFecamp != null)
				return false;
		} else if (!reclamoFecamp.equals(other.reclamoFecamp))
			return false;
		if (reclamoFecgra == null) {
			if (other.reclamoFecgra != null)
				return false;
		} else if (!reclamoFecgra.equals(other.reclamoFecgra))
			return false;
		if (reclamoFeclis == null) {
			if (other.reclamoFeclis != null)
				return false;
		} else if (!reclamoFeclis.equals(other.reclamoFeclis))
			return false;
		if (reclamoFecsol == null) {
			if (other.reclamoFecsol != null)
				return false;
		} else if (!reclamoFecsol.equals(other.reclamoFecsol))
			return false;
		if (reclamoFue == null) {
			if (other.reclamoFue != null)
				return false;
		} else if (!reclamoFue.equals(other.reclamoFue))
			return false;
		if (reclamoHorsol == null) {
			if (other.reclamoHorsol != null)
				return false;
		} else if (!reclamoHorsol.equals(other.reclamoHorsol))
			return false;
		if (reclamoIdsol == null) {
			if (other.reclamoIdsol != null)
				return false;
		} else if (!reclamoIdsol.equals(other.reclamoIdsol))
			return false;
		if (reclamoLlacom == null) {
			if (other.reclamoLlacom != null)
				return false;
		} else if (!reclamoLlacom.equals(other.reclamoLlacom))
			return false;
		if (reclamoMedserfigas == null) {
			if (other.reclamoMedserfigas != null)
				return false;
		} else if (!reclamoMedserfigas.equals(other.reclamoMedserfigas))
			return false;
		if (reclamoNombar == null) {
			if (other.reclamoNombar != null)
				return false;
		} else if (!reclamoNombar.equals(other.reclamoNombar))
			return false;
		if (reclamoNompet == null) {
			if (other.reclamoNompet != null)
				return false;
		} else if (!reclamoNompet.equals(other.reclamoNompet))
			return false;
		if (reclamoNomsol == null) {
			if (other.reclamoNomsol != null)
				return false;
		} else if (!reclamoNomsol.equals(other.reclamoNomsol))
			return false;
		if (reclamoNomter == null) {
			if (other.reclamoNomter != null)
				return false;
		} else if (!reclamoNomter.equals(other.reclamoNomter))
			return false;
		if (reclamoNumane == null) {
			if (other.reclamoNumane != null)
				return false;
		} else if (!reclamoNumane.equals(other.reclamoNumane))
			return false;
		if (reclamoNumfac == null) {
			if (other.reclamoNumfac != null)
				return false;
		} else if (!reclamoNumfac.equals(other.reclamoNumfac))
			return false;
		if (reclamoNumpqr == null) {
			if (other.reclamoNumpqr != null)
				return false;
		} else if (!reclamoNumpqr.equals(other.reclamoNumpqr))
			return false;
		if (reclamoObssol == null) {
			if (other.reclamoObssol != null)
				return false;
		} else if (!reclamoObssol.equals(other.reclamoObssol))
			return false;
		if (reclamoPqrdep == null) {
			if (other.reclamoPqrdep != null)
				return false;
		} else if (!reclamoPqrdep.equals(other.reclamoPqrdep))
			return false;
		if (reclamoRadprev == null) {
			if (other.reclamoRadprev != null)
				return false;
		} else if (!reclamoRadprev.equals(other.reclamoRadprev))
			return false;
		if (reclamoSus == null) {
			if (other.reclamoSus != null)
				return false;
		} else if (!reclamoSus.equals(other.reclamoSus))
			return false;
		if (reclamoSwtcamvlr == null) {
			if (other.reclamoSwtcamvlr != null)
				return false;
		} else if (!reclamoSwtcamvlr.equals(other.reclamoSwtcamvlr))
			return false;
		if (reclamoSwtcontactos == null) {
			if (other.reclamoSwtcontactos != null)
				return false;
		} else if (!reclamoSwtcontactos.equals(other.reclamoSwtcontactos))
			return false;
		if (reclamoSwtdes == null) {
			if (other.reclamoSwtdes != null)
				return false;
		} else if (!reclamoSwtdes.equals(other.reclamoSwtdes))
			return false;
		if (reclamoSwtema == null) {
			if (other.reclamoSwtema != null)
				return false;
		} else if (!reclamoSwtema.equals(other.reclamoSwtema))
			return false;
		if (reclamoSwteme == null) {
			if (other.reclamoSwteme != null)
				return false;
		} else if (!reclamoSwteme.equals(other.reclamoSwteme))
			return false;
		if (reclamoSwtpro == null) {
			if (other.reclamoSwtpro != null)
				return false;
		} else if (!reclamoSwtpro.equals(other.reclamoSwtpro))
			return false;
		if (reclamoSwtrepsui == null) {
			if (other.reclamoSwtrepsui != null)
				return false;
		} else if (!reclamoSwtrepsui.equals(other.reclamoSwtrepsui))
			return false;
		if (reclamoTelnot == null) {
			if (other.reclamoTelnot != null)
				return false;
		} else if (!reclamoTelnot.equals(other.reclamoTelnot))
			return false;
		if (reclamoTelsol == null) {
			if (other.reclamoTelsol != null)
				return false;
		} else if (!reclamoTelsol.equals(other.reclamoTelsol))
			return false;
		if (reclamoTelter == null) {
			if (other.reclamoTelter != null)
				return false;
		} else if (!reclamoTelter.equals(other.reclamoTelter))
			return false;
		if (reclamoTipate == null) {
			if (other.reclamoTipate != null)
				return false;
		} else if (!reclamoTipate.equals(other.reclamoTipate))
			return false;
		if (reclamoTipnot == null) {
			if (other.reclamoTipnot != null)
				return false;
		} else if (!reclamoTipnot.equals(other.reclamoTipnot))
			return false;
		if (reclamoTiprep == null) {
			if (other.reclamoTiprep != null)
				return false;
		} else if (!reclamoTiprep.equals(other.reclamoTiprep))
			return false;
		if (reclamoTipsol == null) {
			if (other.reclamoTipsol != null)
				return false;
		} else if (!reclamoTipsol.equals(other.reclamoTipsol))
			return false;
		if (reclamoUsuact == null) {
			if (other.reclamoUsuact != null)
				return false;
		} else if (!reclamoUsuact.equals(other.reclamoUsuact))
			return false;
		if (reclamoUsugra == null) {
			if (other.reclamoUsugra != null)
				return false;
		} else if (!reclamoUsugra.equals(other.reclamoUsugra))
			return false;
		if (venIderegistro == null) {
			if (other.venIderegistro != null)
				return false;
		} else if (!venIderegistro.equals(other.venIderegistro))
			return false;
		return true;
	}

}
