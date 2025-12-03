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
 * The persistent class for the solicitudes database table.
 * 
 */
@Entity
@Table(name="solicitudes")
@NamedQuery(name="Solicitudes.findAll", query="SELECT s FROM Solicitudes s")
public class Solicitudes implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="solicitud_llacom")
	private String solicitudLlacom;

	@Column(name="solicitud_cau")
	private String solicitudCau;

	@Column(name="solicitud_cod")
	private String solicitudCod;

	@Column(name="solicitud_coddepemp")
	private String solicitudCoddepemp;

	@Column(name="solicitud_codemp")
	private String solicitudCodemp;

	@Column(name="solicitud_gru")
	private String solicitudGru;

	@Column(name="solicitud_grucau")
	private String solicitudGrucau;

	@Column(name="solicitud_itedep")
	private String solicitudItedep;

	@Column(name="solicitud_nom")
	private String solicitudNom;

	@Column(name="solicitud_nosus")
	private Boolean solicitudNosus;

	@Column(name="solicitud_swtact")
	private Boolean solicitudSwtact;

	@Column(name="solicitud_swtampfec")
	private Boolean solicitudSwtampfec;

	@Column(name="solicitud_swtcampro")
	private Boolean solicitudSwtcampro;

	@Column(name="solicitud_swtcie")
	private Boolean solicitudSwtcie;

	@Column(name="solicitud_swtcom")
	private Boolean solicitudSwtcom;

	@Column(name="solicitud_swtdes")
	private Boolean solicitudSwtdes;

	@Column(name="solicitud_swteme")
	private Boolean solicitudSwteme;

	@Column(name="solicitud_swtfac")
	private Boolean solicitudSwtfac;

	@Column(name="solicitud_swtfin")
	private Boolean solicitudSwtfin;

	@Column(name="solicitud_swtnocob")
	private Boolean solicitudSwtnocob;

	@Column(name="solicitud_swtprog")
	private Boolean solicitudSwtprog;

	@Column(name="solicitud_swtpys")
	private Boolean solicitudSwtpys;

	@Column(name="solicitud_tiptra")
	private String solicitudTiptra;

	public Solicitudes() {
	}

	public String getSolicitudLlacom() {
		return this.solicitudLlacom;
	}

	public void setSolicitudLlacom(String solicitudLlacom) {
		this.solicitudLlacom = solicitudLlacom;
	}

	public String getSolicitudCau() {
		return this.solicitudCau;
	}

	public void setSolicitudCau(String solicitudCau) {
		this.solicitudCau = solicitudCau;
	}

	public String getSolicitudCod() {
		return this.solicitudCod;
	}

	public void setSolicitudCod(String solicitudCod) {
		this.solicitudCod = solicitudCod;
	}

	public String getSolicitudCoddepemp() {
		return this.solicitudCoddepemp;
	}

	public void setSolicitudCoddepemp(String solicitudCoddepemp) {
		this.solicitudCoddepemp = solicitudCoddepemp;
	}

	public String getSolicitudCodemp() {
		return this.solicitudCodemp;
	}

	public void setSolicitudCodemp(String solicitudCodemp) {
		this.solicitudCodemp = solicitudCodemp;
	}

	public String getSolicitudGru() {
		return this.solicitudGru;
	}

	public void setSolicitudGru(String solicitudGru) {
		this.solicitudGru = solicitudGru;
	}

	public String getSolicitudGrucau() {
		return this.solicitudGrucau;
	}

	public void setSolicitudGrucau(String solicitudGrucau) {
		this.solicitudGrucau = solicitudGrucau;
	}

	public String getSolicitudItedep() {
		return this.solicitudItedep;
	}

	public void setSolicitudItedep(String solicitudItedep) {
		this.solicitudItedep = solicitudItedep;
	}

	public String getSolicitudNom() {
		return this.solicitudNom;
	}

	public void setSolicitudNom(String solicitudNom) {
		this.solicitudNom = solicitudNom;
	}

	public Boolean getSolicitudNosus() {
		return this.solicitudNosus;
	}

	public void setSolicitudNosus(Boolean solicitudNosus) {
		this.solicitudNosus = solicitudNosus;
	}

	public Boolean getSolicitudSwtact() {
		return this.solicitudSwtact;
	}

	public void setSolicitudSwtact(Boolean solicitudSwtact) {
		this.solicitudSwtact = solicitudSwtact;
	}

	public Boolean getSolicitudSwtampfec() {
		return this.solicitudSwtampfec;
	}

	public void setSolicitudSwtampfec(Boolean solicitudSwtampfec) {
		this.solicitudSwtampfec = solicitudSwtampfec;
	}

	public Boolean getSolicitudSwtcampro() {
		return this.solicitudSwtcampro;
	}

	public void setSolicitudSwtcampro(Boolean solicitudSwtcampro) {
		this.solicitudSwtcampro = solicitudSwtcampro;
	}

	public Boolean getSolicitudSwtcie() {
		return this.solicitudSwtcie;
	}

	public void setSolicitudSwtcie(Boolean solicitudSwtcie) {
		this.solicitudSwtcie = solicitudSwtcie;
	}

	public Boolean getSolicitudSwtcom() {
		return this.solicitudSwtcom;
	}

	public void setSolicitudSwtcom(Boolean solicitudSwtcom) {
		this.solicitudSwtcom = solicitudSwtcom;
	}

	public Boolean getSolicitudSwtdes() {
		return this.solicitudSwtdes;
	}

	public void setSolicitudSwtdes(Boolean solicitudSwtdes) {
		this.solicitudSwtdes = solicitudSwtdes;
	}

	public Boolean getSolicitudSwteme() {
		return this.solicitudSwteme;
	}

	public void setSolicitudSwteme(Boolean solicitudSwteme) {
		this.solicitudSwteme = solicitudSwteme;
	}

	public Boolean getSolicitudSwtfac() {
		return this.solicitudSwtfac;
	}

	public void setSolicitudSwtfac(Boolean solicitudSwtfac) {
		this.solicitudSwtfac = solicitudSwtfac;
	}

	public Boolean getSolicitudSwtfin() {
		return this.solicitudSwtfin;
	}

	public void setSolicitudSwtfin(Boolean solicitudSwtfin) {
		this.solicitudSwtfin = solicitudSwtfin;
	}

	public Boolean getSolicitudSwtnocob() {
		return this.solicitudSwtnocob;
	}

	public void setSolicitudSwtnocob(Boolean solicitudSwtnocob) {
		this.solicitudSwtnocob = solicitudSwtnocob;
	}

	public Boolean getSolicitudSwtprog() {
		return this.solicitudSwtprog;
	}

	public void setSolicitudSwtprog(Boolean solicitudSwtprog) {
		this.solicitudSwtprog = solicitudSwtprog;
	}

	public Boolean getSolicitudSwtpys() {
		return this.solicitudSwtpys;
	}

	public void setSolicitudSwtpys(Boolean solicitudSwtpys) {
		this.solicitudSwtpys = solicitudSwtpys;
	}

	public String getSolicitudTiptra() {
		return this.solicitudTiptra;
	}

	public void setSolicitudTiptra(String solicitudTiptra) {
		this.solicitudTiptra = solicitudTiptra;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((solicitudCau == null) ? 0 : solicitudCau.hashCode());
		result = prime * result + ((solicitudCod == null) ? 0 : solicitudCod.hashCode());
		result = prime * result + ((solicitudCoddepemp == null) ? 0 : solicitudCoddepemp.hashCode());
		result = prime * result + ((solicitudCodemp == null) ? 0 : solicitudCodemp.hashCode());
		result = prime * result + ((solicitudGru == null) ? 0 : solicitudGru.hashCode());
		result = prime * result + ((solicitudGrucau == null) ? 0 : solicitudGrucau.hashCode());
		result = prime * result + ((solicitudItedep == null) ? 0 : solicitudItedep.hashCode());
		result = prime * result + ((solicitudLlacom == null) ? 0 : solicitudLlacom.hashCode());
		result = prime * result + ((solicitudNom == null) ? 0 : solicitudNom.hashCode());
		result = prime * result + ((solicitudNosus == null) ? 0 : solicitudNosus.hashCode());
		result = prime * result + ((solicitudSwtact == null) ? 0 : solicitudSwtact.hashCode());
		result = prime * result + ((solicitudSwtampfec == null) ? 0 : solicitudSwtampfec.hashCode());
		result = prime * result + ((solicitudSwtcampro == null) ? 0 : solicitudSwtcampro.hashCode());
		result = prime * result + ((solicitudSwtcie == null) ? 0 : solicitudSwtcie.hashCode());
		result = prime * result + ((solicitudSwtcom == null) ? 0 : solicitudSwtcom.hashCode());
		result = prime * result + ((solicitudSwtdes == null) ? 0 : solicitudSwtdes.hashCode());
		result = prime * result + ((solicitudSwteme == null) ? 0 : solicitudSwteme.hashCode());
		result = prime * result + ((solicitudSwtfac == null) ? 0 : solicitudSwtfac.hashCode());
		result = prime * result + ((solicitudSwtfin == null) ? 0 : solicitudSwtfin.hashCode());
		result = prime * result + ((solicitudSwtnocob == null) ? 0 : solicitudSwtnocob.hashCode());
		result = prime * result + ((solicitudSwtprog == null) ? 0 : solicitudSwtprog.hashCode());
		result = prime * result + ((solicitudSwtpys == null) ? 0 : solicitudSwtpys.hashCode());
		result = prime * result + ((solicitudTiptra == null) ? 0 : solicitudTiptra.hashCode());
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
		Solicitudes other = (Solicitudes) obj;
		if (solicitudCau == null) {
			if (other.solicitudCau != null)
				return false;
		} else if (!solicitudCau.equals(other.solicitudCau))
			return false;
		if (solicitudCod == null) {
			if (other.solicitudCod != null)
				return false;
		} else if (!solicitudCod.equals(other.solicitudCod))
			return false;
		if (solicitudCoddepemp == null) {
			if (other.solicitudCoddepemp != null)
				return false;
		} else if (!solicitudCoddepemp.equals(other.solicitudCoddepemp))
			return false;
		if (solicitudCodemp == null) {
			if (other.solicitudCodemp != null)
				return false;
		} else if (!solicitudCodemp.equals(other.solicitudCodemp))
			return false;
		if (solicitudGru == null) {
			if (other.solicitudGru != null)
				return false;
		} else if (!solicitudGru.equals(other.solicitudGru))
			return false;
		if (solicitudGrucau == null) {
			if (other.solicitudGrucau != null)
				return false;
		} else if (!solicitudGrucau.equals(other.solicitudGrucau))
			return false;
		if (solicitudItedep == null) {
			if (other.solicitudItedep != null)
				return false;
		} else if (!solicitudItedep.equals(other.solicitudItedep))
			return false;
		if (solicitudLlacom == null) {
			if (other.solicitudLlacom != null)
				return false;
		} else if (!solicitudLlacom.equals(other.solicitudLlacom))
			return false;
		if (solicitudNom == null) {
			if (other.solicitudNom != null)
				return false;
		} else if (!solicitudNom.equals(other.solicitudNom))
			return false;
		if (solicitudNosus == null) {
			if (other.solicitudNosus != null)
				return false;
		} else if (!solicitudNosus.equals(other.solicitudNosus))
			return false;
		if (solicitudSwtact == null) {
			if (other.solicitudSwtact != null)
				return false;
		} else if (!solicitudSwtact.equals(other.solicitudSwtact))
			return false;
		if (solicitudSwtampfec == null) {
			if (other.solicitudSwtampfec != null)
				return false;
		} else if (!solicitudSwtampfec.equals(other.solicitudSwtampfec))
			return false;
		if (solicitudSwtcampro == null) {
			if (other.solicitudSwtcampro != null)
				return false;
		} else if (!solicitudSwtcampro.equals(other.solicitudSwtcampro))
			return false;
		if (solicitudSwtcie == null) {
			if (other.solicitudSwtcie != null)
				return false;
		} else if (!solicitudSwtcie.equals(other.solicitudSwtcie))
			return false;
		if (solicitudSwtcom == null) {
			if (other.solicitudSwtcom != null)
				return false;
		} else if (!solicitudSwtcom.equals(other.solicitudSwtcom))
			return false;
		if (solicitudSwtdes == null) {
			if (other.solicitudSwtdes != null)
				return false;
		} else if (!solicitudSwtdes.equals(other.solicitudSwtdes))
			return false;
		if (solicitudSwteme == null) {
			if (other.solicitudSwteme != null)
				return false;
		} else if (!solicitudSwteme.equals(other.solicitudSwteme))
			return false;
		if (solicitudSwtfac == null) {
			if (other.solicitudSwtfac != null)
				return false;
		} else if (!solicitudSwtfac.equals(other.solicitudSwtfac))
			return false;
		if (solicitudSwtfin == null) {
			if (other.solicitudSwtfin != null)
				return false;
		} else if (!solicitudSwtfin.equals(other.solicitudSwtfin))
			return false;
		if (solicitudSwtnocob == null) {
			if (other.solicitudSwtnocob != null)
				return false;
		} else if (!solicitudSwtnocob.equals(other.solicitudSwtnocob))
			return false;
		if (solicitudSwtprog == null) {
			if (other.solicitudSwtprog != null)
				return false;
		} else if (!solicitudSwtprog.equals(other.solicitudSwtprog))
			return false;
		if (solicitudSwtpys == null) {
			if (other.solicitudSwtpys != null)
				return false;
		} else if (!solicitudSwtpys.equals(other.solicitudSwtpys))
			return false;
		if (solicitudTiptra == null) {
			if (other.solicitudTiptra != null)
				return false;
		} else if (!solicitudTiptra.equals(other.solicitudTiptra))
			return false;
		return true;
	}
	
	

}