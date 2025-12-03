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
 * The persistent class for the tip_atenciones database table.
 * 
 */
@Entity
@Table(name = "tip_atenciones")
@NamedQuery(name = "TipAtenciones.findAll", query = "SELECT t FROM TipAtenciones t")
public class TipAtenciones implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "tipatencion_llacom")
	private String tipatencionLlacom;

	@Column(name = "tipatencion_cod")
	private String tipatencionCod;

	@Column(name = "tipatencion_codemp")
	private String tipatencionCodemp;

	@Column(name = "tipatencion_des")
	private String tipatencionDes;

	@Column(name = "tipatencion_swtact")
	private Boolean tipatencionSwtact;

	@Column(name = "tipatencion_swtnot")
	private Boolean tipatencionSwtnot;

	@Column(name = "tipatencion_swtnotcor")
	private Boolean tipatencionSwtnotcor;

	@Column(name = "tipatencion_swtnotesc")
	private Boolean tipatencionSwtnotesc;

	public TipAtenciones() {
		//constructor por defecto
	}

	public String getTipatencionLlacom() {
		return this.tipatencionLlacom;
	}

	public void setTipatencionLlacom(String tipatencionLlacom) {
		this.tipatencionLlacom = tipatencionLlacom;
	}

	public String getTipatencionCod() {
		return this.tipatencionCod;
	}

	public void setTipatencionCod(String tipatencionCod) {
		this.tipatencionCod = tipatencionCod;
	}

	public String getTipatencionCodemp() {
		return this.tipatencionCodemp;
	}

	public void setTipatencionCodemp(String tipatencionCodemp) {
		this.tipatencionCodemp = tipatencionCodemp;
	}

	public String getTipatencionDes() {
		return this.tipatencionDes;
	}

	public void setTipatencionDes(String tipatencionDes) {
		this.tipatencionDes = tipatencionDes;
	}

	public Boolean getTipatencionSwtact() {
		return this.tipatencionSwtact;
	}

	public void setTipatencionSwtact(Boolean tipatencionSwtact) {
		this.tipatencionSwtact = tipatencionSwtact;
	}

	public Boolean getTipatencionSwtnot() {
		return this.tipatencionSwtnot;
	}

	public void setTipatencionSwtnot(Boolean tipatencionSwtnot) {
		this.tipatencionSwtnot = tipatencionSwtnot;
	}

	public Boolean getTipatencionSwtnotcor() {
		return this.tipatencionSwtnotcor;
	}

	public void setTipatencionSwtnotcor(Boolean tipatencionSwtnotcor) {
		this.tipatencionSwtnotcor = tipatencionSwtnotcor;
	}

	public Boolean getTipatencionSwtnotesc() {
		return this.tipatencionSwtnotesc;
	}

	public void setTipatencionSwtnotesc(Boolean tipatencionSwtnotesc) {
		this.tipatencionSwtnotesc = tipatencionSwtnotesc;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((tipatencionCod == null) ? 0 : tipatencionCod.hashCode());
		result = prime * result + ((tipatencionCodemp == null) ? 0 : tipatencionCodemp.hashCode());
		result = prime * result + ((tipatencionDes == null) ? 0 : tipatencionDes.hashCode());
		result = prime * result + ((tipatencionLlacom == null) ? 0 : tipatencionLlacom.hashCode());
		result = prime * result + ((tipatencionSwtact == null) ? 0 : tipatencionSwtact.hashCode());
		result = prime * result + ((tipatencionSwtnot == null) ? 0 : tipatencionSwtnot.hashCode());
		result = prime * result + ((tipatencionSwtnotcor == null) ? 0 : tipatencionSwtnotcor.hashCode());
		result = prime * result + ((tipatencionSwtnotesc == null) ? 0 : tipatencionSwtnotesc.hashCode());
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
		TipAtenciones other = (TipAtenciones) obj;
		if (tipatencionCod == null) {
			if (other.tipatencionCod != null)
				return false;
		} else if (!tipatencionCod.equals(other.tipatencionCod))
			return false;
		if (tipatencionCodemp == null) {
			if (other.tipatencionCodemp != null)
				return false;
		} else if (!tipatencionCodemp.equals(other.tipatencionCodemp))
			return false;
		if (tipatencionDes == null) {
			if (other.tipatencionDes != null)
				return false;
		} else if (!tipatencionDes.equals(other.tipatencionDes))
			return false;
		if (tipatencionLlacom == null) {
			if (other.tipatencionLlacom != null)
				return false;
		} else if (!tipatencionLlacom.equals(other.tipatencionLlacom))
			return false;
		if (tipatencionSwtact == null) {
			if (other.tipatencionSwtact != null)
				return false;
		} else if (!tipatencionSwtact.equals(other.tipatencionSwtact))
			return false;
		if (tipatencionSwtnot == null) {
			if (other.tipatencionSwtnot != null)
				return false;
		} else if (!tipatencionSwtnot.equals(other.tipatencionSwtnot))
			return false;
		if (tipatencionSwtnotcor == null) {
			if (other.tipatencionSwtnotcor != null)
				return false;
		} else if (!tipatencionSwtnotcor.equals(other.tipatencionSwtnotcor))
			return false;
		if (tipatencionSwtnotesc == null) {
			if (other.tipatencionSwtnotesc != null)
				return false;
		} else if (!tipatencionSwtnotesc.equals(other.tipatencionSwtnotesc))
			return false;
		return true;
	}

}