package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class VisitasSolDTO implements Serializable {
	
	private long visitasolid;
	
	private String visitasolcedrec;
	
	private String visitasolcodcua;
	
	private String visitasolcodemp;
	
	private String visitasolcodnov;
	
	private String visitasolcodrep;
	
	private String visitasolcodsus;
	
	private String visitasolempcon;
	
	private String visitasolempenv;
	
	private String visitasolest;
	
	private String visitasolestdig;
	
	private String visitasolfav;
	
	private Timestamp visitasolfecgra;
	
	private Date visitasolfecvis;
	
	private String visitasolgra;
	
	private String visitasolhorreal;
	
	private String visitasolhorvis;
	
	private String visitasolloc;
	
	private String visitasolnivpre;
	
	private BigDecimal visitasolnolab;
	
	private String visitasolnomrec;
	
	private Integer visitasolnumafe;
	
	private String visitasolnumgui;
	
	private BigDecimal visitasolnumlec;
	
	private String visitasolnumpqr;
	
	private String visitasolobs;
	
	private String visitasolobsdig;
	
	private String visitasolradcad;
	
	private String visitasolres;
	
	private String visitasolsus;
	
	private Boolean visitasolswtapl;
	
	private String visitasoltar;
	
	private String visitasoltie;
	
	private String visitasoltipesc;
	
	private String visitasoltiprup;
	
	private String visitasoltipuso;
	
	private String visitasoluniele;
	
	private String visitasolusugra; 
	
	private BigDecimal visitasolvlrrec;
	
	public VisitasSolDTO() {
		super();
	}

	@JsonProperty("visitasol_id")
	public long getVisitasolid() {
		return visitasolid;
	}

	@JsonProperty("visitasol_id")
	public void setVisitasolid(long visitasolid) {
		this.visitasolid = visitasolid;
	}

	@JsonProperty("visitasol_cedrec")
	public String getVisitasolcedrec() {
		return visitasolcedrec;
	}

	@JsonProperty("visitasol_cedrec")
	public void setVisitasolcedrec(String visitasolcedrec) {
		this.visitasolcedrec = visitasolcedrec;
	}

	@JsonProperty("visitasol_codcua")
	public String getVisitasolcodcua() {
		return visitasolcodcua;
	}

	@JsonProperty("visitasol_codcua")
	public void setVisitasolcodcua(String visitasolcodcua) {
		this.visitasolcodcua = visitasolcodcua;
	}

	@JsonProperty("visitasol_codemp")
	public String getVisitasolcodemp() {
		return visitasolcodemp;
	}

	@JsonProperty("visitasol_codemp")
	public void setVisitasolcodemp(String visitasolcodemp) {
		this.visitasolcodemp = visitasolcodemp;
	}

	@JsonProperty("visitasol_codnov")
	public String getVisitasolcodnov() {
		return visitasolcodnov;
	}

	@JsonProperty("visitasol_codnov")
	public void setVisitasolcodnov(String visitasolcodnov) {
		this.visitasolcodnov = visitasolcodnov;
	}

	@JsonProperty("visitasol_codrep")
	public String getVisitasolcodrep() {
		return visitasolcodrep;
	}

	@JsonProperty("visitasol_codrep")
	public void setVisitasolcodrep(String visitasolcodrep) {
		this.visitasolcodrep = visitasolcodrep;
	}

	@JsonProperty("visitasol_codsus")
	public String getVisitasolcodsus() {
		return visitasolcodsus;
	}

	@JsonProperty("visitasol_codsus")
	public void setVisitasolcodsus(String visitasolcodsus) {
		this.visitasolcodsus = visitasolcodsus;
	}

	@JsonProperty("visitasol_empcon")
	public String getVisitasolempcon() {
		return visitasolempcon;
	}

	@JsonProperty("visitasol_empcon")
	public void setVisitasolempcon(String visitasolempcon) {
		this.visitasolempcon = visitasolempcon;
	}

	@JsonProperty("visitasol_empenv")
	public String getVisitasolempenv() {
		return visitasolempenv;
	}

	@JsonProperty("visitasol_empenv")
	public void setVisitasolempenv(String visitasolempenv) {
		this.visitasolempenv = visitasolempenv;
	}

	@JsonProperty("visitasol_est")
	public String getVisitasolest() {
		return visitasolest;
	}

	@JsonProperty("visitasol_est")
	public void setVisitasolest(String visitasolest) {
		this.visitasolest = visitasolest;
	}

	@JsonProperty("visitasol_estdig")
	public String getVisitasolestdig() {
		return visitasolestdig;
	}

	@JsonProperty("visitasol_estdig")
	public void setVisitasolestdig(String visitasolestdig) {
		this.visitasolestdig = visitasolestdig;
	}

	@JsonProperty("visitasol_fav")
	public String getVisitasolfav() {
		return visitasolfav;
	}

	@JsonProperty("visitasol_fav")
	public void setVisitasolfav(String visitasolfav) {
		this.visitasolfav = visitasolfav;
	}

	@JsonProperty("visitasol_fecgra")
	public Timestamp getVisitasolfecgra() {
		return visitasolfecgra;
	}

	@JsonProperty("visitasol_fecgra")
	public void setVisitasolfecgra(Timestamp visitasolfecgra) {
		this.visitasolfecgra = visitasolfecgra;
	}

	@JsonProperty("visitasol_fecvis")
	public Date getVisitasolfecvis() {
		return visitasolfecvis;
	}

	@JsonProperty("visitasol_fecvis")
	public void setVisitasolfecvis(Date visitasolfecvis) {
		this.visitasolfecvis = visitasolfecvis;
	}

	@JsonProperty("visitasol_gra")
	public String getVisitasolgra() {
		return visitasolgra;
	}

	@JsonProperty("visitasol_gra")
	public void setVisitasolgra(String visitasolgra) {
		this.visitasolgra = visitasolgra;
	}

	@JsonProperty("visitasol_horreal")
	public String getVisitasolhorreal() {
		return visitasolhorreal;
	}

	@JsonProperty("visitasol_horreal")
	public void setVisitasolhorreal(String visitasolhorreal) {
		this.visitasolhorreal = visitasolhorreal;
	}

	@JsonProperty("visitasol_horvis")
	public String getVisitasolhorvis() {
		return visitasolhorvis;
	}

	@JsonProperty("visitasol_horvis")
	public void setVisitasolhorvis(String visitasolhorvis) {
		this.visitasolhorvis = visitasolhorvis;
	}
	
	@JsonProperty("visitasol_loc")
	public String getVisitasolloc() {
		return visitasolloc;
	}

	@JsonProperty("visitasol_loc")
	public void setVisitasolloc(String visitasolloc) {
		this.visitasolloc = visitasolloc;
	}

	@JsonProperty("visitasol_nivpre")
	public String getVisitasolnivpre() {
		return visitasolnivpre;
	}

	@JsonProperty("visitasol_nivpre")
	public void setVisitasolnivpre(String visitasolnivpre) {
		this.visitasolnivpre = visitasolnivpre;
	}

	@JsonProperty("visitasol_nolab")
	public BigDecimal getVisitasolnolab() {
		return visitasolnolab;
	}

	@JsonProperty("visitasol_nolab")
	public void setVisitasolnolab(BigDecimal visitasolnolab) {
		this.visitasolnolab = visitasolnolab;
	}

	@JsonProperty("visitasol_nomrec")
	public String getVisitasolnomrec() {
		return visitasolnomrec;
	}

	@JsonProperty("visitasol_nomrec")
	public void setVisitasolnomrec(String visitasolnomrec) {
		this.visitasolnomrec = visitasolnomrec;
	}

	@JsonProperty("visitasol_numafe")
	public Integer getVisitasolnumafe() {
		return visitasolnumafe;
	}

	@JsonProperty("visitasol_numafe")
	public void setVisitasolnumafe(Integer visitasolnumafe) {
		this.visitasolnumafe = visitasolnumafe;
	}

	@JsonProperty("visitasol_numgui")
	public String getVisitasolnumgui() {
		return visitasolnumgui;
	}

	@JsonProperty("visitasol_numgui")
	public void setVisitasolnumgui(String visitasolnumgui) {
		this.visitasolnumgui = visitasolnumgui;
	}

	@JsonProperty("visitasol_numlec")
	public BigDecimal getVisitasolnumlec() {
		return visitasolnumlec;
	}

	@JsonProperty("visitasol_numlec")
	public void setVisitasolnumlec(BigDecimal visitasolnumlec) {
		this.visitasolnumlec = visitasolnumlec;
	}

	@JsonProperty("visitasol_numpqr")
	public String getVisitasolnumpqr() {
		return visitasolnumpqr;
	}

	@JsonProperty("visitasol_numpqr")
	public void setVisitasolnumpqr(String visitasolnumpqr) {
		this.visitasolnumpqr = visitasolnumpqr;
	}

	@JsonProperty("visitasol_obs")
	public String getVisitasolobs() {
		return visitasolobs;
	}

	@JsonProperty("visitasol_obs")
	public void setVisitasolobs(String visitasolobs) {
		this.visitasolobs = visitasolobs;
	}

	@JsonProperty("visitasol_obsdig")
	public String getVisitasolobsdig() {
		return visitasolobsdig;
	}

	@JsonProperty("visitasol_obsdig")
	public void setVisitasolobsdig(String visitasolobsdig) {
		this.visitasolobsdig = visitasolobsdig;
	}

	@JsonProperty("visitasol_radcad")
	public String getVisitasolradcad() {
		return visitasolradcad;
	}

	@JsonProperty("visitasol_radcad")
	public void setVisitasolradcad(String visitasolradcad) {
		this.visitasolradcad = visitasolradcad;
	}

	@JsonProperty("visitasol_res")
	public String getVisitasolres() {
		return visitasolres;
	}

	@JsonProperty("visitasol_res")
	public void setVisitasolres(String visitasolres) {
		this.visitasolres = visitasolres;
	}

	@JsonProperty("visitasol_sus")
	public String getVisitasolsus() {
		return visitasolsus;
	}

	@JsonProperty("visitasol_sus")
	public void setVisitasolsus(String visitasolsus) {
		this.visitasolsus = visitasolsus;
	}

	@JsonProperty("visitasol_swtapl")
	public Boolean getVisitasolswtapl() {
		return visitasolswtapl;
	}

	@JsonProperty("visitasol_swtapl")
	public void setVisitasolswtapl(Boolean visitasolswtapl) {
		this.visitasolswtapl = visitasolswtapl;
	}

	@JsonProperty("visitasol_tar")
	public String getVisitasoltar() {
		return visitasoltar;
	}

	@JsonProperty("visitasol_tar")
	public void setVisitasoltar(String visitasoltar) {
		this.visitasoltar = visitasoltar;
	}

	@JsonProperty("visitasol_tie")
	public String getVisitasoltie() {
		return visitasoltie;
	}

	@JsonProperty("visitasol_tie")
	public void setVisitasoltie(String visitasoltie) {
		this.visitasoltie = visitasoltie;
	}

	@JsonProperty("visitasol_tipesc")
	public String getVisitasoltipesc() {
		return visitasoltipesc;
	}

	@JsonProperty("visitasol_tipesc")
	public void setVisitasoltipesc(String visitasoltipesc) {
		this.visitasoltipesc = visitasoltipesc;
	}

	@JsonProperty("visitasol_tiprup")
	public String getVisitasoltiprup() {
		return visitasoltiprup;
	}

	@JsonProperty("visitasol_tiprup")
	public void setVisitasoltiprup(String visitasoltiprup) {
		this.visitasoltiprup = visitasoltiprup;
	}

	@JsonProperty("visitasol_tipuso")
	public String getVisitasoltipuso() {
		return visitasoltipuso;
	}

	@JsonProperty("visitasol_tipuso")
	public void setVisitasoltipuso(String visitasoltipuso) {
		this.visitasoltipuso = visitasoltipuso;
	}

	@JsonProperty("visitasol_uniele")
	public String getVisitasoluniele() {
		return visitasoluniele;
	}

	@JsonProperty("visitasol_uniele")
	public void setVisitasoluniele(String visitasoluniele) {
		this.visitasoluniele = visitasoluniele;
	}

	@JsonProperty("visitasol_usugra")
	public String getVisitasolusugra() {
		return visitasolusugra;
	}

	@JsonProperty("visitasol_usugra")
	public void setVisitasolusugra(String visitasolusugra) {
		this.visitasolusugra = visitasolusugra;
	}

	@JsonProperty("visitasol_vlrrec")
	public BigDecimal getVisitasolvlrrec() {
		return visitasolvlrrec;
	}

	@JsonProperty("visitasol_vlrrec")
	public void setVisitasolvlrrec(BigDecimal visitasolvlrrec) {
		this.visitasolvlrrec = visitasolvlrrec;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((visitasolcedrec == null) ? 0 : visitasolcedrec.hashCode());
		result = prime * result + ((visitasolcodcua == null) ? 0 : visitasolcodcua.hashCode());
		result = prime * result + ((visitasolcodemp == null) ? 0 : visitasolcodemp.hashCode());
		result = prime * result + ((visitasolcodnov == null) ? 0 : visitasolcodnov.hashCode());
		result = prime * result + ((visitasolcodrep == null) ? 0 : visitasolcodrep.hashCode());
		result = prime * result + ((visitasolcodsus == null) ? 0 : visitasolcodsus.hashCode());
		result = prime * result + ((visitasolempcon == null) ? 0 : visitasolempcon.hashCode());
		result = prime * result + ((visitasolempenv == null) ? 0 : visitasolempenv.hashCode());
		result = prime * result + ((visitasolest == null) ? 0 : visitasolest.hashCode());
		result = prime * result + ((visitasolestdig == null) ? 0 : visitasolestdig.hashCode());
		result = prime * result + ((visitasolfav == null) ? 0 : visitasolfav.hashCode());
		result = prime * result + ((visitasolfecgra == null) ? 0 : visitasolfecgra.hashCode());
		result = prime * result + ((visitasolfecvis == null) ? 0 : visitasolfecvis.hashCode());
		result = prime * result + ((visitasolgra == null) ? 0 : visitasolgra.hashCode());
		result = prime * result + ((visitasolhorreal == null) ? 0 : visitasolhorreal.hashCode());
		result = prime * result + ((visitasolhorvis == null) ? 0 : visitasolhorvis.hashCode());
		result = prime * result + (int) (visitasolid ^ (visitasolid >>> 32));
		result = prime * result + ((visitasolloc == null) ? 0 : visitasolloc.hashCode());
		result = prime * result + ((visitasolnivpre == null) ? 0 : visitasolnivpre.hashCode());
		result = prime * result + ((visitasolnolab == null) ? 0 : visitasolnolab.hashCode());
		result = prime * result + ((visitasolnomrec == null) ? 0 : visitasolnomrec.hashCode());
		result = prime * result + ((visitasolnumafe == null) ? 0 : visitasolnumafe.hashCode());
		result = prime * result + ((visitasolnumgui == null) ? 0 : visitasolnumgui.hashCode());
		result = prime * result + ((visitasolnumlec == null) ? 0 : visitasolnumlec.hashCode());
		result = prime * result + ((visitasolnumpqr == null) ? 0 : visitasolnumpqr.hashCode());
		result = prime * result + ((visitasolobs == null) ? 0 : visitasolobs.hashCode());
		result = prime * result + ((visitasolobsdig == null) ? 0 : visitasolobsdig.hashCode());
		result = prime * result + ((visitasolradcad == null) ? 0 : visitasolradcad.hashCode());
		result = prime * result + ((visitasolres == null) ? 0 : visitasolres.hashCode());
		result = prime * result + ((visitasolsus == null) ? 0 : visitasolsus.hashCode());
		result = prime * result + ((visitasolswtapl == null) ? 0 : visitasolswtapl.hashCode());
		result = prime * result + ((visitasoltar == null) ? 0 : visitasoltar.hashCode());
		result = prime * result + ((visitasoltie == null) ? 0 : visitasoltie.hashCode());
		result = prime * result + ((visitasoltipesc == null) ? 0 : visitasoltipesc.hashCode());
		result = prime * result + ((visitasoltiprup == null) ? 0 : visitasoltiprup.hashCode());
		result = prime * result + ((visitasoltipuso == null) ? 0 : visitasoltipuso.hashCode());
		result = prime * result + ((visitasoluniele == null) ? 0 : visitasoluniele.hashCode());
		result = prime * result + ((visitasolusugra == null) ? 0 : visitasolusugra.hashCode());
		result = prime * result + ((visitasolvlrrec == null) ? 0 : visitasolvlrrec.hashCode());
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
		VisitasSolDTO other = (VisitasSolDTO) obj;
		if (visitasolcedrec == null) {
			if (other.visitasolcedrec != null)
				return false;
		} else if (!visitasolcedrec.equals(other.visitasolcedrec))
			return false;
		if (visitasolcodcua == null) {
			if (other.visitasolcodcua != null)
				return false;
		} else if (!visitasolcodcua.equals(other.visitasolcodcua))
			return false;
		if (visitasolcodemp == null) {
			if (other.visitasolcodemp != null)
				return false;
		} else if (!visitasolcodemp.equals(other.visitasolcodemp))
			return false;
		if (visitasolcodnov == null) {
			if (other.visitasolcodnov != null)
				return false;
		} else if (!visitasolcodnov.equals(other.visitasolcodnov))
			return false;
		if (visitasolcodrep == null) {
			if (other.visitasolcodrep != null)
				return false;
		} else if (!visitasolcodrep.equals(other.visitasolcodrep))
			return false;
		if (visitasolcodsus == null) {
			if (other.visitasolcodsus != null)
				return false;
		} else if (!visitasolcodsus.equals(other.visitasolcodsus))
			return false;
		if (visitasolempcon == null) {
			if (other.visitasolempcon != null)
				return false;
		} else if (!visitasolempcon.equals(other.visitasolempcon))
			return false;
		if (visitasolempenv == null) {
			if (other.visitasolempenv != null)
				return false;
		} else if (!visitasolempenv.equals(other.visitasolempenv))
			return false;
		if (visitasolest == null) {
			if (other.visitasolest != null)
				return false;
		} else if (!visitasolest.equals(other.visitasolest))
			return false;
		if (visitasolestdig == null) {
			if (other.visitasolestdig != null)
				return false;
		} else if (!visitasolestdig.equals(other.visitasolestdig))
			return false;
		if (visitasolfav == null) {
			if (other.visitasolfav != null)
				return false;
		} else if (!visitasolfav.equals(other.visitasolfav))
			return false;
		if (visitasolfecgra == null) {
			if (other.visitasolfecgra != null)
				return false;
		} else if (!visitasolfecgra.equals(other.visitasolfecgra))
			return false;
		if (visitasolfecvis == null) {
			if (other.visitasolfecvis != null)
				return false;
		} else if (!visitasolfecvis.equals(other.visitasolfecvis))
			return false;
		if (visitasolgra == null) {
			if (other.visitasolgra != null)
				return false;
		} else if (!visitasolgra.equals(other.visitasolgra))
			return false;
		if (visitasolhorreal == null) {
			if (other.visitasolhorreal != null)
				return false;
		} else if (!visitasolhorreal.equals(other.visitasolhorreal))
			return false;
		if (visitasolhorvis == null) {
			if (other.visitasolhorvis != null)
				return false;
		} else if (!visitasolhorvis.equals(other.visitasolhorvis))
			return false;
		if (visitasolid != other.visitasolid)
			return false;
		if (visitasolloc == null) {
			if (other.visitasolloc != null)
				return false;
		} else if (!visitasolloc.equals(other.visitasolloc))
			return false;
		if (visitasolnivpre == null) {
			if (other.visitasolnivpre != null)
				return false;
		} else if (!visitasolnivpre.equals(other.visitasolnivpre))
			return false;
		if (visitasolnolab == null) {
			if (other.visitasolnolab != null)
				return false;
		} else if (!visitasolnolab.equals(other.visitasolnolab))
			return false;
		if (visitasolnomrec == null) {
			if (other.visitasolnomrec != null)
				return false;
		} else if (!visitasolnomrec.equals(other.visitasolnomrec))
			return false;
		if (visitasolnumafe == null) {
			if (other.visitasolnumafe != null)
				return false;
		} else if (!visitasolnumafe.equals(other.visitasolnumafe))
			return false;
		if (visitasolnumgui == null) {
			if (other.visitasolnumgui != null)
				return false;
		} else if (!visitasolnumgui.equals(other.visitasolnumgui))
			return false;
		if (visitasolnumlec == null) {
			if (other.visitasolnumlec != null)
				return false;
		} else if (!visitasolnumlec.equals(other.visitasolnumlec))
			return false;
		if (visitasolnumpqr == null) {
			if (other.visitasolnumpqr != null)
				return false;
		} else if (!visitasolnumpqr.equals(other.visitasolnumpqr))
			return false;
		if (visitasolobs == null) {
			if (other.visitasolobs != null)
				return false;
		} else if (!visitasolobs.equals(other.visitasolobs))
			return false;
		if (visitasolobsdig == null) {
			if (other.visitasolobsdig != null)
				return false;
		} else if (!visitasolobsdig.equals(other.visitasolobsdig))
			return false;
		if (visitasolradcad == null) {
			if (other.visitasolradcad != null)
				return false;
		} else if (!visitasolradcad.equals(other.visitasolradcad))
			return false;
		if (visitasolres == null) {
			if (other.visitasolres != null)
				return false;
		} else if (!visitasolres.equals(other.visitasolres))
			return false;
		if (visitasolsus == null) {
			if (other.visitasolsus != null)
				return false;
		} else if (!visitasolsus.equals(other.visitasolsus))
			return false;
		if (visitasolswtapl == null) {
			if (other.visitasolswtapl != null)
				return false;
		} else if (!visitasolswtapl.equals(other.visitasolswtapl))
			return false;
		if (visitasoltar == null) {
			if (other.visitasoltar != null)
				return false;
		} else if (!visitasoltar.equals(other.visitasoltar))
			return false;
		if (visitasoltie == null) {
			if (other.visitasoltie != null)
				return false;
		} else if (!visitasoltie.equals(other.visitasoltie))
			return false;
		if (visitasoltipesc == null) {
			if (other.visitasoltipesc != null)
				return false;
		} else if (!visitasoltipesc.equals(other.visitasoltipesc))
			return false;
		if (visitasoltiprup == null) {
			if (other.visitasoltiprup != null)
				return false;
		} else if (!visitasoltiprup.equals(other.visitasoltiprup))
			return false;
		if (visitasoltipuso == null) {
			if (other.visitasoltipuso != null)
				return false;
		} else if (!visitasoltipuso.equals(other.visitasoltipuso))
			return false;
		if (visitasoluniele == null) {
			if (other.visitasoluniele != null)
				return false;
		} else if (!visitasoluniele.equals(other.visitasoluniele))
			return false;
		if (visitasolusugra == null) {
			if (other.visitasolusugra != null)
				return false;
		} else if (!visitasolusugra.equals(other.visitasolusugra))
			return false;
		if (visitasolvlrrec == null) {
			if (other.visitasolvlrrec != null)
				return false;
		} else if (!visitasolvlrrec.equals(other.visitasolvlrrec))
			return false;
		return true;
	}
	
}
