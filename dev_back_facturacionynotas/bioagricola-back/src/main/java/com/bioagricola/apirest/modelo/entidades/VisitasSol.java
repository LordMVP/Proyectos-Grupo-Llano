package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


/**
 * The persistent class for the visitas_sol database table.
 * 
 */
@Entity
@Table(name="visitas_sol")
@NamedQuery(name="VisitasSol.findAll", query="SELECT v FROM VisitasSol v")
public class VisitasSol implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="visitasol_id")
	private long visitasolId;

	@Column(name="visitasol_cedrec")
	private String visitasolCedrec;

	@Column(name="visitasol_codcua")
	private String visitasolCodcua;

	@Column(name="visitasol_codemp")
	private String visitasolCodemp;

	@Column(name="visitasol_codnov")
	private String visitasolCodnov;

	@Column(name="visitasol_codrep")
	private String visitasolCodrep;

	@Column(name="visitasol_codsus")
	private String visitasolCodsus;

	@Column(name="visitasol_empcon")
	private String visitasolEmpcon;

	@Column(name="visitasol_empenv")
	private String visitasolEmpenv;

	@Column(name="visitasol_est")
	private String visitasolEst;

	@Column(name="visitasol_estdig")
	private String visitasolEstdig;

	@Column(name="visitasol_fav")
	private String visitasolFav;

	@Column(name="visitasol_fecgra")
	private Timestamp visitasolFecgra;

	@Temporal(TemporalType.DATE)
	@Column(name="visitasol_fecvis")
	private Date visitasolFecvis;

	@Column(name="visitasol_gra")
	private String visitasolGra;

	@Column(name="visitasol_horreal")
	private String visitasolHorreal;

	@Column(name="visitasol_horvis")
	private String visitasolHorvis;

	@Column(name="visitasol_loc")
	private String visitasolLoc;

	@Column(name="visitasol_nivpre")
	private String visitasolNivpre;

	@Column(name="visitasol_nolab")
	private BigDecimal visitasolNolab;

	@Column(name="visitasol_nomrec")
	private String visitasolNomrec;

	@Column(name="visitasol_numafe")
	private Integer visitasolNumafe;

	@Column(name="visitasol_numgui")
	private String visitasolNumgui;

	@Column(name="visitasol_numlec")
	private BigDecimal visitasolNumlec;

	@Column(name="visitasol_numpqr")
	private String visitasolNumpqr;

	@Column(name="visitasol_obs")
	private String visitasolObs;

	@Column(name="visitasol_obsdig")
	private String visitasolObsdig;

	@Column(name="visitasol_radcad")
	private String visitasolRadcad;

	@Column(name="visitasol_res")
	private String visitasolRes;

	@Column(name="visitasol_sus")
	private String visitasolSus;

	@Column(name="visitasol_swtapl")
	private Boolean visitasolSwtapl;

	@Column(name="visitasol_tar")
	private String visitasolTar;

	@Column(name="visitasol_tie")
	private String visitasolTie;

	@Column(name="visitasol_tipesc")
	private String visitasolTipesc;

	@Column(name="visitasol_tiprup")
	private String visitasolTiprup;

	@Column(name="visitasol_tipuso")
	private String visitasolTipuso;

	@Column(name="visitasol_uniele")
	private String visitasolUniele;

	@Column(name="visitasol_usugra")
	private String visitasolUsugra;

	@Column(name="visitasol_vlrrec")
	private BigDecimal visitasolVlrrec;

	public VisitasSol() {
		//constructor por defecto
	}

	public long getVisitasolId() {
		return this.visitasolId;
	}

	public void setVisitasolId(long visitasolId) {
		this.visitasolId = visitasolId;
	}

	public String getVisitasolCedrec() {
		return this.visitasolCedrec;
	}

	public void setVisitasolCedrec(String visitasolCedrec) {
		this.visitasolCedrec = visitasolCedrec;
	}

	public String getVisitasolCodcua() {
		return this.visitasolCodcua;
	}

	public void setVisitasolCodcua(String visitasolCodcua) {
		this.visitasolCodcua = visitasolCodcua;
	}

	public String getVisitasolCodemp() {
		return this.visitasolCodemp;
	}

	public void setVisitasolCodemp(String visitasolCodemp) {
		this.visitasolCodemp = visitasolCodemp;
	}

	public String getVisitasolCodnov() {
		return this.visitasolCodnov;
	}

	public void setVisitasolCodnov(String visitasolCodnov) {
		this.visitasolCodnov = visitasolCodnov;
	}

	public String getVisitasolCodrep() {
		return this.visitasolCodrep;
	}

	public void setVisitasolCodrep(String visitasolCodrep) {
		this.visitasolCodrep = visitasolCodrep;
	}

	public String getVisitasolCodsus() {
		return this.visitasolCodsus;
	}

	public void setVisitasolCodsus(String visitasolCodsus) {
		this.visitasolCodsus = visitasolCodsus;
	}

	public String getVisitasolEmpcon() {
		return this.visitasolEmpcon;
	}

	public void setVisitasolEmpcon(String visitasolEmpcon) {
		this.visitasolEmpcon = visitasolEmpcon;
	}

	public String getVisitasolEmpenv() {
		return this.visitasolEmpenv;
	}

	public void setVisitasolEmpenv(String visitasolEmpenv) {
		this.visitasolEmpenv = visitasolEmpenv;
	}

	public String getVisitasolEst() {
		return this.visitasolEst;
	}

	public void setVisitasolEst(String visitasolEst) {
		this.visitasolEst = visitasolEst;
	}

	public String getVisitasolEstdig() {
		return this.visitasolEstdig;
	}

	public void setVisitasolEstdig(String visitasolEstdig) {
		this.visitasolEstdig = visitasolEstdig;
	}

	public String getVisitasolFav() {
		return this.visitasolFav;
	}

	public void setVisitasolFav(String visitasolFav) {
		this.visitasolFav = visitasolFav;
	}

	public Timestamp getVisitasolFecgra() {
		return this.visitasolFecgra;
	}

	public void setVisitasolFecgra(Timestamp visitasolFecgra) {
		this.visitasolFecgra = visitasolFecgra;
	}

	public Date getVisitasolFecvis() {
		return this.visitasolFecvis;
	}

	public void setVisitasolFecvis(Date visitasolFecvis) {
		this.visitasolFecvis = visitasolFecvis;
	}

	public String getVisitasolGra() {
		return this.visitasolGra;
	}

	public void setVisitasolGra(String visitasolGra) {
		this.visitasolGra = visitasolGra;
	}

	public String getVisitasolHorreal() {
		return this.visitasolHorreal;
	}

	public void setVisitasolHorreal(String visitasolHorreal) {
		this.visitasolHorreal = visitasolHorreal;
	}

	public String getVisitasolHorvis() {
		return this.visitasolHorvis;
	}

	public void setVisitasolHorvis(String visitasolHorvis) {
		this.visitasolHorvis = visitasolHorvis;
	}

	public String getVisitasolLoc() {
		return this.visitasolLoc;
	}

	public void setVisitasolLoc(String visitasolLoc) {
		this.visitasolLoc = visitasolLoc;
	}

	public String getVisitasolNivpre() {
		return this.visitasolNivpre;
	}

	public void setVisitasolNivpre(String visitasolNivpre) {
		this.visitasolNivpre = visitasolNivpre;
	}

	public BigDecimal getVisitasolNolab() {
		return this.visitasolNolab;
	}

	public void setVisitasolNolab(BigDecimal visitasolNolab) {
		this.visitasolNolab = visitasolNolab;
	}

	public String getVisitasolNomrec() {
		return this.visitasolNomrec;
	}

	public void setVisitasolNomrec(String visitasolNomrec) {
		this.visitasolNomrec = visitasolNomrec;
	}

	public Integer getVisitasolNumafe() {
		return this.visitasolNumafe;
	}

	public void setVisitasolNumafe(Integer visitasolNumafe) {
		this.visitasolNumafe = visitasolNumafe;
	}

	public String getVisitasolNumgui() {
		return this.visitasolNumgui;
	}

	public void setVisitasolNumgui(String visitasolNumgui) {
		this.visitasolNumgui = visitasolNumgui;
	}

	public BigDecimal getVisitasolNumlec() {
		return this.visitasolNumlec;
	}

	public void setVisitasolNumlec(BigDecimal visitasolNumlec) {
		this.visitasolNumlec = visitasolNumlec;
	}

	public String getVisitasolNumpqr() {
		return this.visitasolNumpqr;
	}

	public void setVisitasolNumpqr(String visitasolNumpqr) {
		this.visitasolNumpqr = visitasolNumpqr;
	}

	public String getVisitasolObs() {
		return this.visitasolObs;
	}

	public void setVisitasolObs(String visitasolObs) {
		this.visitasolObs = visitasolObs;
	}

	public String getVisitasolObsdig() {
		return this.visitasolObsdig;
	}

	public void setVisitasolObsdig(String visitasolObsdig) {
		this.visitasolObsdig = visitasolObsdig;
	}

	public String getVisitasolRadcad() {
		return this.visitasolRadcad;
	}

	public void setVisitasolRadcad(String visitasolRadcad) {
		this.visitasolRadcad = visitasolRadcad;
	}

	public String getVisitasolRes() {
		return this.visitasolRes;
	}

	public void setVisitasolRes(String visitasolRes) {
		this.visitasolRes = visitasolRes;
	}

	public String getVisitasolSus() {
		return this.visitasolSus;
	}

	public void setVisitasolSus(String visitasolSus) {
		this.visitasolSus = visitasolSus;
	}

	public Boolean getVisitasolSwtapl() {
		return this.visitasolSwtapl;
	}

	public void setVisitasolSwtapl(Boolean visitasolSwtapl) {
		this.visitasolSwtapl = visitasolSwtapl;
	}

	public String getVisitasolTar() {
		return this.visitasolTar;
	}

	public void setVisitasolTar(String visitasolTar) {
		this.visitasolTar = visitasolTar;
	}

	public String getVisitasolTie() {
		return this.visitasolTie;
	}

	public void setVisitasolTie(String visitasolTie) {
		this.visitasolTie = visitasolTie;
	}

	public String getVisitasolTipesc() {
		return this.visitasolTipesc;
	}

	public void setVisitasolTipesc(String visitasolTipesc) {
		this.visitasolTipesc = visitasolTipesc;
	}

	public String getVisitasolTiprup() {
		return this.visitasolTiprup;
	}

	public void setVisitasolTiprup(String visitasolTiprup) {
		this.visitasolTiprup = visitasolTiprup;
	}

	public String getVisitasolTipuso() {
		return this.visitasolTipuso;
	}

	public void setVisitasolTipuso(String visitasolTipuso) {
		this.visitasolTipuso = visitasolTipuso;
	}

	public String getVisitasolUniele() {
		return this.visitasolUniele;
	}

	public void setVisitasolUniele(String visitasolUniele) {
		this.visitasolUniele = visitasolUniele;
	}

	public String getVisitasolUsugra() {
		return this.visitasolUsugra;
	}

	public void setVisitasolUsugra(String visitasolUsugra) {
		this.visitasolUsugra = visitasolUsugra;
	}

	public BigDecimal getVisitasolVlrrec() {
		return this.visitasolVlrrec;
	}

	public void setVisitasolVlrrec(BigDecimal visitasolVlrrec) {
		this.visitasolVlrrec = visitasolVlrrec;
	}

}