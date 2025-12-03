package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ReclamoDTO implements Serializable {

	private String reclamonumpqr;

	private String reclamotipsol;

	private Date reclamofecsol;

	private String reclamonomsol;

	private String reclamoidsol;

	private String reclamocodsus;

	private String reclamotelsol;

	private String reclamocelsol;

	private String reclamoemail;

	private String reclamoobssol;

	private String reclamoest;

	private String reclamocodemp;

	private String reclamotipate;

	private String reclamotipnot;

	private String reclamocodrec;

	private String reclamocodage;

	private String reclamocodpro;

	private String reclamocodbar;

	private String reclamotiprep;

	private String reclamodir;

	private String reclamodeprep;

	private Boolean reclamoswteme;

	private String reclamousugra;

	private Date reclamofecgra;

	private String reclamosus;

	private String reclamoempcon;

	private Boolean reclamoswtpro;

	private String reclamonombar;

	private String reclamoswtcamvlr;

	private String reclamopqrdep;

	private Boolean reclamoswtdes;

	private String reclamocamvlr;

	private Date reclamofecamp;

	private String reclamohorsol;

	private String reclamofue;

	private String reclamodet;

	private String reclamoesteme;

	private String reclamoradprev;

	private String reclamollacom;

	private Boolean reclamoswtema;

	private String reclamonumfac;

	private Boolean reclamoswtrepsui;

	private Date reclamofeclis;

	private String reclamodirnot;

	private String reclamobarnot;

	private String reclamocornot;

	private String reclamotelnot;

	private BigDecimal reclamonumane;

	private String reclamoclasol;

	private String reclamousuact;

	private Date reclamofecact;

	private String reclamonomter;

	private String reclamocedter;

	private String reclamotelter;

	private BigDecimal venideregistro;

	private Short reclamoswtcontactos;

	public ReclamoDTO() {
		super();
	}

	@JsonProperty("reclamo_numpqr")
	public String getReclamonumpqr() {
		return reclamonumpqr;
	}

	@JsonProperty("reclamo_numpqr")
	public void setReclamonumpqr(String reclamonumpqr) {
		this.reclamonumpqr = reclamonumpqr;
	}

	@JsonProperty("reclamo_tipsol")
	public String getReclamotipsol() {
		return reclamotipsol;
	}

	@JsonProperty("reclamo_tipsol")
	public void setReclamotipsol(String reclamotipsol) {
		this.reclamotipsol = reclamotipsol;
	}

	@JsonProperty("reclamo_fecsol")
	public Date getReclamofecsol() {
		return reclamofecsol;
	}

	@JsonProperty("reclamo_fecsol")
	public void setReclamofecsol(Date reclamofecsol) {
		this.reclamofecsol = reclamofecsol;
	}

	@JsonProperty("reclamo_nomsol")
	public String getReclamonomsol() {
		return reclamonomsol;
	}

	@JsonProperty("reclamo_nomsol")
	public void setReclamonomsol(String reclamonomsol) {
		this.reclamonomsol = reclamonomsol;
	}

	@JsonProperty("reclamo_idsol")
	public String getReclamoidsol() {
		return reclamoidsol;
	}

	@JsonProperty("reclamo_idsol")
	public void setReclamoidsol(String reclamoidsol) {
		this.reclamoidsol = reclamoidsol;
	}

	@JsonProperty("reclamo_codsus")
	public String getReclamocodsus() {
		return reclamocodsus;
	}

	@JsonProperty("reclamo_codsus")
	public void setReclamocodsus(String reclamocodsus) {
		this.reclamocodsus = reclamocodsus;
	}

	@JsonProperty("reclamo_telsol")
	public String getReclamotelsol() {
		return reclamotelsol;
	}

	@JsonProperty("reclamo_telsol")
	public void setReclamotelsol(String reclamotelsol) {
		this.reclamotelsol = reclamotelsol;
	}

	@JsonProperty("reclamo_celsol")
	public String getReclamocelsol() {
		return reclamocelsol;
	}

	@JsonProperty("reclamo_celsol")
	public void setReclamocelsol(String reclamocelsol) {
		this.reclamocelsol = reclamocelsol;
	}

	@JsonProperty("reclamo_email")
	public String getReclamoemail() {
		return reclamoemail;
	}

	@JsonProperty("reclamo_email")
	public void setReclamoemail(String reclamoemail) {
		this.reclamoemail = reclamoemail;
	}

	@JsonProperty("reclamo_obssol")
	public String getReclamoobssol() {
		return reclamoobssol;
	}

	@JsonProperty("reclamo_obssol")
	public void setReclamoobssol(String reclamoobssol) {
		this.reclamoobssol = reclamoobssol;
	}

	@JsonProperty("reclamo_est")
	public String getReclamoest() {
		return reclamoest;
	}

	@JsonProperty("reclamo_est")
	public void setReclamoest(String reclamoest) {
		this.reclamoest = reclamoest;
	}

	@JsonProperty("reclamo_codemp")
	public String getReclamocodemp() {
		return reclamocodemp;
	}

	@JsonProperty("reclamo_codemp")
	public void setReclamocodemp(String reclamocodemp) {
		this.reclamocodemp = reclamocodemp;
	}

	@JsonProperty("reclamo_tipate")
	public String getReclamotipate() {
		return reclamotipate;
	}

	@JsonProperty("reclamo_tipate")
	public void setReclamotipate(String reclamotipate) {
		this.reclamotipate = reclamotipate;
	}

	@JsonProperty("reclamo_tipnot")
	public String getReclamotipnot() {
		return reclamotipnot;
	}

	@JsonProperty("reclamo_tipnot")
	public void setReclamotipnot(String reclamotipnot) {
		this.reclamotipnot = reclamotipnot;
	}

	@JsonProperty("reclamo_codrec")
	public String getReclamocodrec() {
		return reclamocodrec;
	}

	@JsonProperty("reclamo_codrec")
	public void setReclamocodrec(String reclamocodrec) {
		this.reclamocodrec = reclamocodrec;
	}

	@JsonProperty("reclamo_codage")
	public String getReclamocodage() {
		return reclamocodage;
	}

	@JsonProperty("reclamo_codage")
	public void setReclamocodage(String reclamocodage) {
		this.reclamocodage = reclamocodage;
	}

	@JsonProperty("reclamo_codpro")
	public String getReclamocodpro() {
		return reclamocodpro;
	}

	@JsonProperty("reclamo_codpro")
	public void setReclamocodpro(String reclamocodpro) {
		this.reclamocodpro = reclamocodpro;
	}

	@JsonProperty("reclamo_codbar")
	public String getReclamocodbar() {
		return reclamocodbar;
	}

	@JsonProperty("reclamo_codbar")
	public void setReclamocodbar(String reclamocodbar) {
		this.reclamocodbar = reclamocodbar;
	}

	@JsonProperty("reclamo_tiprep")
	public String getReclamotiprep() {
		return reclamotiprep;
	}

	@JsonProperty("reclamo_tiprep")
	public void setReclamotiprep(String reclamotiprep) {
		this.reclamotiprep = reclamotiprep;
	}

	@JsonProperty("reclamo_dir")
	public String getReclamodir() {
		return reclamodir;
	}

	@JsonProperty("reclamo_dir")
	public void setReclamodir(String reclamodir) {
		this.reclamodir = reclamodir;
	}

	@JsonProperty("reclamo_deprep")
	public String getReclamodeprep() {
		return reclamodeprep;
	}

	@JsonProperty("reclamo_deprep")
	public void setReclamodeprep(String reclamodeprep) {
		this.reclamodeprep = reclamodeprep;
	}

	@JsonProperty("reclamoswteme")
	public Boolean getReclamoswteme() {
		return reclamoswteme;
	}

	@JsonProperty("reclamo_swteme")
	public void setReclamoswteme(Boolean reclamoswteme) {
		this.reclamoswteme = reclamoswteme;
	}

	@JsonProperty("reclamo_usugra")
	public String getReclamousugra() {
		return reclamousugra;
	}

	@JsonProperty("reclamo_usugra")
	public void setReclamousugra(String reclamousugra) {
		this.reclamousugra = reclamousugra;
	}

	@JsonProperty("reclamo_fecgra")
	public Date getReclamofecgra() {
		return reclamofecgra;
	}

	@JsonProperty("reclamo_fecgra")
	public void setReclamofecgra(Date reclamofecgra) {
		this.reclamofecgra = reclamofecgra;
	}

	@JsonProperty("reclamo_sus")
	public String getReclamosus() {
		return reclamosus;
	}

	@JsonProperty("reclamo_sus")
	public void setReclamosus(String reclamosus) {
		this.reclamosus = reclamosus;
	}

	@JsonProperty("reclamo_empcon")
	public String getReclamoempcon() {
		return reclamoempcon;
	}

	@JsonProperty("reclamo_empcon")
	public void setReclamoempcon(String reclamoempcon) {
		this.reclamoempcon = reclamoempcon;
	}

	@JsonProperty("reclamo_swtpro")
	public Boolean getReclamoswtpro() {
		return reclamoswtpro;
	}

	@JsonProperty("reclamo_swtpro")
	public void setReclamoswtpro(Boolean reclamoswtpro) {
		this.reclamoswtpro = reclamoswtpro;
	}

	@JsonProperty("reclamo_nombar")
	public String getReclamonombar() {
		return reclamonombar;
	}

	@JsonProperty("reclamo_nombar")
	public void setReclamonombar(String reclamonombar) {
		this.reclamonombar = reclamonombar;
	}

	@JsonProperty("reclamo_swtcamvlr")
	public String getReclamoswtcamvlr() {
		return reclamoswtcamvlr;
	}

	@JsonProperty("reclamo_swtcamvlr")
	public void setReclamoswtcamvlr(String reclamoswtcamvlr) {
		this.reclamoswtcamvlr = reclamoswtcamvlr;
	}

	@JsonProperty("reclamo_pqrdep")
	public String getReclamopqrdep() {
		return reclamopqrdep;
	}

	@JsonProperty("reclamo_pqrdep")
	public void setReclamopqrdep(String reclamopqrdep) {
		this.reclamopqrdep = reclamopqrdep;
	}

	@JsonProperty("reclamo_swtdes")
	public Boolean getReclamoswtdes() {
		return reclamoswtdes;
	}

	@JsonProperty("reclamo_swtdes")
	public void setReclamoswtdes(Boolean reclamoswtdes) {
		this.reclamoswtdes = reclamoswtdes;
	}

	@JsonProperty("reclamo_camvlr")
	public String getReclamocamvlr() {
		return reclamocamvlr;
	}

	@JsonProperty("reclamo_camvlr")
	public void setReclamocamvlr(String reclamocamvlr) {
		this.reclamocamvlr = reclamocamvlr;
	}

	@JsonProperty("reclamo_fecamp")
	public Date getReclamofecamp() {
		return reclamofecamp;
	}

	@JsonProperty("reclamo_fecamp")
	public void setReclamofecamp(Date reclamofecamp) {
		this.reclamofecamp = reclamofecamp;
	}

	@JsonProperty("reclamo_horsol")
	public String getReclamohorsol() {
		return reclamohorsol;
	}

	@JsonProperty("reclamo_horsol")
	public void setReclamohorsol(String reclamohorsol) {
		this.reclamohorsol = reclamohorsol;
	}

	@JsonProperty("reclamo_fue")
	public String getReclamofue() {
		return reclamofue;
	}

	@JsonProperty("reclamo_fue")
	public void setReclamofue(String reclamofue) {
		this.reclamofue = reclamofue;
	}

	@JsonProperty("reclamo_det")
	public String getReclamodet() {
		return reclamodet;
	}

	@JsonProperty("reclamo_det")
	public void setReclamodet(String reclamodet) {
		this.reclamodet = reclamodet;
	}

	@JsonProperty("reclamo_esteme")
	public String getReclamoesteme() {
		return reclamoesteme;
	}

	@JsonProperty("reclamo_esteme")
	public void setReclamoesteme(String reclamoesteme) {
		this.reclamoesteme = reclamoesteme;
	}

	@JsonProperty("reclamo_radprev")
	public String getReclamoradprev() {
		return reclamoradprev;
	}

	@JsonProperty("reclamo_radprev")
	public void setReclamoradprev(String reclamoradprev) {
		this.reclamoradprev = reclamoradprev;
	}

	@JsonProperty("reclamo_llacom")
	public String getReclamollacom() {
		return reclamollacom;
	}

	@JsonProperty("reclamo_llacom")
	public void setReclamollacom(String reclamollacom) {
		this.reclamollacom = reclamollacom;
	}

	@JsonProperty("reclamo_swtema")
	public Boolean getReclamoswtema() {
		return reclamoswtema;
	}

	@JsonProperty("reclamo_swtema")
	public void setReclamoswtema(Boolean reclamoswtema) {
		this.reclamoswtema = reclamoswtema;
	}

	@JsonProperty("reclamo_numfac")
	public String getReclamonumfac() {
		return reclamonumfac;
	}

	@JsonProperty("reclamo_numfac")
	public void setReclamonumfac(String reclamonumfac) {
		this.reclamonumfac = reclamonumfac;
	}

	@JsonProperty("reclamo_swtrepsui")
	public Boolean getReclamoswtrepsui() {
		return reclamoswtrepsui;
	}

	@JsonProperty("reclamo_swtrepsui")
	public void setReclamoswtrepsui(Boolean reclamoswtrepsui) {
		this.reclamoswtrepsui = reclamoswtrepsui;
	}

	@JsonProperty("reclamo_feclis")
	public Date getReclamofeclis() {
		return reclamofeclis;
	}

	@JsonProperty("reclamo_feclis")
	public void setReclamofeclis(Date reclamofeclis) {
		this.reclamofeclis = reclamofeclis;
	}

	@JsonProperty("reclamo_dirnot")
	public String getReclamodirnot() {
		return reclamodirnot;
	}

	@JsonProperty("reclamo_dirnot")
	public void setReclamodirnot(String reclamodirnot) {
		this.reclamodirnot = reclamodirnot;
	}

	@JsonProperty("reclamo_barnot")
	public String getReclamobarnot() {
		return reclamobarnot;
	}

	@JsonProperty("reclamo_barnot")
	public void setReclamobarnot(String reclamobarnot) {
		this.reclamobarnot = reclamobarnot;
	}

	@JsonProperty("reclamo_cornot")
	public String getReclamocornot() {
		return reclamocornot;
	}

	@JsonProperty("reclamo_cornot")
	public void setReclamocornot(String reclamocornot) {
		this.reclamocornot = reclamocornot;
	}

	@JsonProperty("reclamo_telnot")
	public String getReclamotelnot() {
		return reclamotelnot;
	}

	@JsonProperty("reclamo_telnot")
	public void setReclamotelnot(String reclamotelnot) {
		this.reclamotelnot = reclamotelnot;
	}

	@JsonProperty("reclamo_numane")
	public BigDecimal getReclamonumane() {
		return reclamonumane;
	}

	@JsonProperty("reclamo_numane")
	public void setReclamonumane(BigDecimal reclamonumane) {
		this.reclamonumane = reclamonumane;
	}

	@JsonProperty("reclamo_clasol")
	public String getReclamoclasol() {
		return reclamoclasol;
	}

	@JsonProperty("reclamo_clasol")
	public void setReclamoclasol(String reclamoclasol) {
		this.reclamoclasol = reclamoclasol;
	}

	@JsonProperty("reclamo_usuact")
	public String getReclamousuact() {
		return reclamousuact;
	}

	@JsonProperty("reclamo_usuact")
	public void setReclamousuact(String reclamousuact) {
		this.reclamousuact = reclamousuact;
	}

	@JsonProperty("reclamo_fecact")
	public Date	getReclamofecact() {
		return reclamofecact;
	}

	@JsonProperty("reclamo_fecact")
	public void setReclamofecact(Date reclamofecact) {
		this.reclamofecact = reclamofecact;
	}

	@JsonProperty("reclamo_nomter")
	public String getReclamonomter() {
		return reclamonomter;
	}

	@JsonProperty("reclamo_nomter")
	public void setReclamonomter(String reclamonomter) {
		this.reclamonomter = reclamonomter;
	}

	@JsonProperty("reclamo_cedter")
	public String getReclamocedter() {
		return reclamocedter;
	}

	@JsonProperty("reclamo_cedter")
	public void setReclamocedter(String reclamocedter) {
		this.reclamocedter = reclamocedter;
	}

	@JsonProperty("reclamo_telter")
	public String getReclamotelter() {
		return reclamotelter;
	}

	@JsonProperty("reclamo_telter")
	public void setReclamotelter(String reclamotelter) {
		this.reclamotelter = reclamotelter;
	}

	@JsonProperty("ven_ideregistro")
	public BigDecimal getVenideregistro() {
		return venideregistro;
	}

	@JsonProperty("ven_ideregistro")
	public void setVenideregistro(BigDecimal venideregistro) {
		this.venideregistro = venideregistro;
	}

	@JsonProperty("reclamo_swtcontactos")
	public Short getReclamoswtcontactos() {
		return reclamoswtcontactos;
	}

	@JsonProperty("reclamo_swtcontactos")
	public void setReclamoswtcontactos(Short reclamoswtcontactos) {
		this.reclamoswtcontactos = reclamoswtcontactos;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((reclamobarnot == null) ? 0 : reclamobarnot.hashCode());
		result = prime * result + ((reclamocamvlr == null) ? 0 : reclamocamvlr.hashCode());
		result = prime * result + ((reclamocedter == null) ? 0 : reclamocedter.hashCode());
		result = prime * result + ((reclamocelsol == null) ? 0 : reclamocelsol.hashCode());
		result = prime * result + ((reclamoclasol == null) ? 0 : reclamoclasol.hashCode());
		result = prime * result + ((reclamocodage == null) ? 0 : reclamocodage.hashCode());
		result = prime * result + ((reclamocodbar == null) ? 0 : reclamocodbar.hashCode());
		result = prime * result + ((reclamocodemp == null) ? 0 : reclamocodemp.hashCode());
		result = prime * result + ((reclamocodpro == null) ? 0 : reclamocodpro.hashCode());
		result = prime * result + ((reclamocodrec == null) ? 0 : reclamocodrec.hashCode());
		result = prime * result + ((reclamocodsus == null) ? 0 : reclamocodsus.hashCode());
		result = prime * result + ((reclamocornot == null) ? 0 : reclamocornot.hashCode());
		result = prime * result + ((reclamodeprep == null) ? 0 : reclamodeprep.hashCode());
		result = prime * result + ((reclamodet == null) ? 0 : reclamodet.hashCode());
		result = prime * result + ((reclamodir == null) ? 0 : reclamodir.hashCode());
		result = prime * result + ((reclamodirnot == null) ? 0 : reclamodirnot.hashCode());
		result = prime * result + ((reclamoemail == null) ? 0 : reclamoemail.hashCode());
		result = prime * result + ((reclamoempcon == null) ? 0 : reclamoempcon.hashCode());
		result = prime * result + ((reclamoest == null) ? 0 : reclamoest.hashCode());
		result = prime * result + ((reclamoesteme == null) ? 0 : reclamoesteme.hashCode());
		result = prime * result + ((reclamofecact == null) ? 0 : reclamofecact.hashCode());
		result = prime * result + ((reclamofecamp == null) ? 0 : reclamofecamp.hashCode());
		result = prime * result + ((reclamofecgra == null) ? 0 : reclamofecgra.hashCode());
		result = prime * result + ((reclamofeclis == null) ? 0 : reclamofeclis.hashCode());
		result = prime * result + ((reclamofecsol == null) ? 0 : reclamofecsol.hashCode());
		result = prime * result + ((reclamofue == null) ? 0 : reclamofue.hashCode());
		result = prime * result + ((reclamohorsol == null) ? 0 : reclamohorsol.hashCode());
		result = prime * result + ((reclamoidsol == null) ? 0 : reclamoidsol.hashCode());
		result = prime * result + ((reclamollacom == null) ? 0 : reclamollacom.hashCode());
		result = prime * result + ((reclamonombar == null) ? 0 : reclamonombar.hashCode());
		result = prime * result + ((reclamonomsol == null) ? 0 : reclamonomsol.hashCode());
		result = prime * result + ((reclamonomter == null) ? 0 : reclamonomter.hashCode());
		result = prime * result + ((reclamonumane == null) ? 0 : reclamonumane.hashCode());
		result = prime * result + ((reclamonumfac == null) ? 0 : reclamonumfac.hashCode());
		result = prime * result + ((reclamonumpqr == null) ? 0 : reclamonumpqr.hashCode());
		result = prime * result + ((reclamoobssol == null) ? 0 : reclamoobssol.hashCode());
		result = prime * result + ((reclamopqrdep == null) ? 0 : reclamopqrdep.hashCode());
		result = prime * result + ((reclamoradprev == null) ? 0 : reclamoradprev.hashCode());
		result = prime * result + ((reclamosus == null) ? 0 : reclamosus.hashCode());
		result = prime * result + ((reclamoswtcamvlr == null) ? 0 : reclamoswtcamvlr.hashCode());
		result = prime * result + ((reclamoswtcontactos == null) ? 0 : reclamoswtcontactos.hashCode());
		result = prime * result + ((reclamoswtdes == null) ? 0 : reclamoswtdes.hashCode());
		result = prime * result + ((reclamoswtema == null) ? 0 : reclamoswtema.hashCode());
		result = prime * result + ((reclamoswteme == null) ? 0 : reclamoswteme.hashCode());
		result = prime * result + ((reclamoswtpro == null) ? 0 : reclamoswtpro.hashCode());
		result = prime * result + ((reclamoswtrepsui == null) ? 0 : reclamoswtrepsui.hashCode());
		result = prime * result + ((reclamotelnot == null) ? 0 : reclamotelnot.hashCode());
		result = prime * result + ((reclamotelsol == null) ? 0 : reclamotelsol.hashCode());
		result = prime * result + ((reclamotelter == null) ? 0 : reclamotelter.hashCode());
		result = prime * result + ((reclamotipate == null) ? 0 : reclamotipate.hashCode());
		result = prime * result + ((reclamotipnot == null) ? 0 : reclamotipnot.hashCode());
		result = prime * result + ((reclamotiprep == null) ? 0 : reclamotiprep.hashCode());
		result = prime * result + ((reclamotipsol == null) ? 0 : reclamotipsol.hashCode());
		result = prime * result + ((reclamousuact == null) ? 0 : reclamousuact.hashCode());
		result = prime * result + ((reclamousugra == null) ? 0 : reclamousugra.hashCode());
		result = prime * result + ((venideregistro == null) ? 0 : venideregistro.hashCode());
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
		ReclamoDTO other = (ReclamoDTO) obj;
		if (reclamobarnot == null) {
			if (other.reclamobarnot != null)
				return false;
		} else if (!reclamobarnot.equals(other.reclamobarnot))
			return false;
		if (reclamocamvlr == null) {
			if (other.reclamocamvlr != null)
				return false;
		} else if (!reclamocamvlr.equals(other.reclamocamvlr))
			return false;
		if (reclamocedter == null) {
			if (other.reclamocedter != null)
				return false;
		} else if (!reclamocedter.equals(other.reclamocedter))
			return false;
		if (reclamocelsol == null) {
			if (other.reclamocelsol != null)
				return false;
		} else if (!reclamocelsol.equals(other.reclamocelsol))
			return false;
		if (reclamoclasol == null) {
			if (other.reclamoclasol != null)
				return false;
		} else if (!reclamoclasol.equals(other.reclamoclasol))
			return false;
		if (reclamocodage == null) {
			if (other.reclamocodage != null)
				return false;
		} else if (!reclamocodage.equals(other.reclamocodage))
			return false;
		if (reclamocodbar == null) {
			if (other.reclamocodbar != null)
				return false;
		} else if (!reclamocodbar.equals(other.reclamocodbar))
			return false;
		if (reclamocodemp == null) {
			if (other.reclamocodemp != null)
				return false;
		} else if (!reclamocodemp.equals(other.reclamocodemp))
			return false;
		if (reclamocodpro == null) {
			if (other.reclamocodpro != null)
				return false;
		} else if (!reclamocodpro.equals(other.reclamocodpro))
			return false;
		if (reclamocodrec == null) {
			if (other.reclamocodrec != null)
				return false;
		} else if (!reclamocodrec.equals(other.reclamocodrec))
			return false;
		if (reclamocodsus == null) {
			if (other.reclamocodsus != null)
				return false;
		} else if (!reclamocodsus.equals(other.reclamocodsus))
			return false;
		if (reclamocornot == null) {
			if (other.reclamocornot != null)
				return false;
		} else if (!reclamocornot.equals(other.reclamocornot))
			return false;
		if (reclamodeprep == null) {
			if (other.reclamodeprep != null)
				return false;
		} else if (!reclamodeprep.equals(other.reclamodeprep))
			return false;
		if (reclamodet == null) {
			if (other.reclamodet != null)
				return false;
		} else if (!reclamodet.equals(other.reclamodet))
			return false;
		if (reclamodir == null) {
			if (other.reclamodir != null)
				return false;
		} else if (!reclamodir.equals(other.reclamodir))
			return false;
		if (reclamodirnot == null) {
			if (other.reclamodirnot != null)
				return false;
		} else if (!reclamodirnot.equals(other.reclamodirnot))
			return false;
		if (reclamoemail == null) {
			if (other.reclamoemail != null)
				return false;
		} else if (!reclamoemail.equals(other.reclamoemail))
			return false;
		if (reclamoempcon == null) {
			if (other.reclamoempcon != null)
				return false;
		} else if (!reclamoempcon.equals(other.reclamoempcon))
			return false;
		if (reclamoest == null) {
			if (other.reclamoest != null)
				return false;
		} else if (!reclamoest.equals(other.reclamoest))
			return false;
		if (reclamoesteme == null) {
			if (other.reclamoesteme != null)
				return false;
		} else if (!reclamoesteme.equals(other.reclamoesteme))
			return false;
		if (reclamofecact == null) {
			if (other.reclamofecact != null)
				return false;
		} else if (!reclamofecact.equals(other.reclamofecact))
			return false;
		if (reclamofecamp == null) {
			if (other.reclamofecamp != null)
				return false;
		} else if (!reclamofecamp.equals(other.reclamofecamp))
			return false;
		if (reclamofecgra == null) {
			if (other.reclamofecgra != null)
				return false;
		} else if (!reclamofecgra.equals(other.reclamofecgra))
			return false;
		if (reclamofeclis == null) {
			if (other.reclamofeclis != null)
				return false;
		} else if (!reclamofeclis.equals(other.reclamofeclis))
			return false;
		if (reclamofecsol == null) {
			if (other.reclamofecsol != null)
				return false;
		} else if (!reclamofecsol.equals(other.reclamofecsol))
			return false;
		if (reclamofue == null) {
			if (other.reclamofue != null)
				return false;
		} else if (!reclamofue.equals(other.reclamofue))
			return false;
		if (reclamohorsol == null) {
			if (other.reclamohorsol != null)
				return false;
		} else if (!reclamohorsol.equals(other.reclamohorsol))
			return false;
		if (reclamoidsol == null) {
			if (other.reclamoidsol != null)
				return false;
		} else if (!reclamoidsol.equals(other.reclamoidsol))
			return false;
		if (reclamollacom == null) {
			if (other.reclamollacom != null)
				return false;
		} else if (!reclamollacom.equals(other.reclamollacom))
			return false;
		if (reclamonombar == null) {
			if (other.reclamonombar != null)
				return false;
		} else if (!reclamonombar.equals(other.reclamonombar))
			return false;
		if (reclamonomsol == null) {
			if (other.reclamonomsol != null)
				return false;
		} else if (!reclamonomsol.equals(other.reclamonomsol))
			return false;
		if (reclamonomter == null) {
			if (other.reclamonomter != null)
				return false;
		} else if (!reclamonomter.equals(other.reclamonomter))
			return false;
		if (reclamonumane == null) {
			if (other.reclamonumane != null)
				return false;
		} else if (!reclamonumane.equals(other.reclamonumane))
			return false;
		if (reclamonumfac == null) {
			if (other.reclamonumfac != null)
				return false;
		} else if (!reclamonumfac.equals(other.reclamonumfac))
			return false;
		if (reclamonumpqr == null) {
			if (other.reclamonumpqr != null)
				return false;
		} else if (!reclamonumpqr.equals(other.reclamonumpqr))
			return false;
		if (reclamoobssol == null) {
			if (other.reclamoobssol != null)
				return false;
		} else if (!reclamoobssol.equals(other.reclamoobssol))
			return false;
		if (reclamopqrdep == null) {
			if (other.reclamopqrdep != null)
				return false;
		} else if (!reclamopqrdep.equals(other.reclamopqrdep))
			return false;
		if (reclamoradprev == null) {
			if (other.reclamoradprev != null)
				return false;
		} else if (!reclamoradprev.equals(other.reclamoradprev))
			return false;
		if (reclamosus == null) {
			if (other.reclamosus != null)
				return false;
		} else if (!reclamosus.equals(other.reclamosus))
			return false;
		if (reclamoswtcamvlr == null) {
			if (other.reclamoswtcamvlr != null)
				return false;
		} else if (!reclamoswtcamvlr.equals(other.reclamoswtcamvlr))
			return false;
		if (reclamoswtcontactos == null) {
			if (other.reclamoswtcontactos != null)
				return false;
		} else if (!reclamoswtcontactos.equals(other.reclamoswtcontactos))
			return false;
		if (reclamoswtdes == null) {
			if (other.reclamoswtdes != null)
				return false;
		} else if (!reclamoswtdes.equals(other.reclamoswtdes))
			return false;
		if (reclamoswtema == null) {
			if (other.reclamoswtema != null)
				return false;
		} else if (!reclamoswtema.equals(other.reclamoswtema))
			return false;
		if (reclamoswteme == null) {
			if (other.reclamoswteme != null)
				return false;
		} else if (!reclamoswteme.equals(other.reclamoswteme))
			return false;
		if (reclamoswtpro == null) {
			if (other.reclamoswtpro != null)
				return false;
		} else if (!reclamoswtpro.equals(other.reclamoswtpro))
			return false;
		if (reclamoswtrepsui == null) {
			if (other.reclamoswtrepsui != null)
				return false;
		} else if (!reclamoswtrepsui.equals(other.reclamoswtrepsui))
			return false;
		if (reclamotelnot == null) {
			if (other.reclamotelnot != null)
				return false;
		} else if (!reclamotelnot.equals(other.reclamotelnot))
			return false;
		if (reclamotelsol == null) {
			if (other.reclamotelsol != null)
				return false;
		} else if (!reclamotelsol.equals(other.reclamotelsol))
			return false;
		if (reclamotelter == null) {
			if (other.reclamotelter != null)
				return false;
		} else if (!reclamotelter.equals(other.reclamotelter))
			return false;
		if (reclamotipate == null) {
			if (other.reclamotipate != null)
				return false;
		} else if (!reclamotipate.equals(other.reclamotipate))
			return false;
		if (reclamotipnot == null) {
			if (other.reclamotipnot != null)
				return false;
		} else if (!reclamotipnot.equals(other.reclamotipnot))
			return false;
		if (reclamotiprep == null) {
			if (other.reclamotiprep != null)
				return false;
		} else if (!reclamotiprep.equals(other.reclamotiprep))
			return false;
		if (reclamotipsol == null) {
			if (other.reclamotipsol != null)
				return false;
		} else if (!reclamotipsol.equals(other.reclamotipsol))
			return false;
		if (reclamousuact == null) {
			if (other.reclamousuact != null)
				return false;
		} else if (!reclamousuact.equals(other.reclamousuact))
			return false;
		if (reclamousugra == null) {
			if (other.reclamousugra != null)
				return false;
		} else if (!reclamousugra.equals(other.reclamousugra))
			return false;
		if (venideregistro == null) {
			if (other.venideregistro != null)
				return false;
		} else if (!venideregistro.equals(other.venideregistro))
			return false;
		return true;
	}

}
