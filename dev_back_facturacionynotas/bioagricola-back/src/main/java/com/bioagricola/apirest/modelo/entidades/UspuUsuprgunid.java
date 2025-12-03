package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the uspu_usuprgunid database table.
 * 
 */
@Entity
@Table(name="uspu_usuprgunid")
@NamedQuery(name="UspuUsuprgunid.findAll", query="SELECT u FROM UspuUsuprgunid u")
public class UspuUsuprgunid implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="uspu_ideregistr")
	private Long uspuIderegistr;

	@Column(name="usu_auditoria")
	private Integer usuAuditoria;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name = "prun_ideregistr")
	private Integer prunIderegistr;

	//bi-directional many-to-one association to PrunPrgunidad
	@ManyToOne
	@JoinColumn(name="prun_ideregistr", referencedColumnName="prun_ideregistr", insertable = false, updatable = false)
	private PrunPrgunidad prunPrgunidad;

	public UspuUsuprgunid() {
		//constructor por defecto
	}

	public Long getUspuIderegistr() {
		return this.uspuIderegistr;
	}

	public void setUspuIderegistr(Long uspuIderegistr) {
		this.uspuIderegistr = uspuIderegistr;
	}

	public Integer getUsuAuditoria() {
		return this.usuAuditoria;
	}

	public void setUsuAuditoria(Integer usuAuditoria) {
		this.usuAuditoria = usuAuditoria;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public PrunPrgunidad getPrunPrgunidad() {
		return this.prunPrgunidad;
	}

	public void setPrunPrgunidad(PrunPrgunidad prunPrgunidad) {
		this.prunPrgunidad = prunPrgunidad;
	}
	
	public Integer getPrunIderegistr() {
		return prunIderegistr;
	}

	public void setPrunIderegistr(Integer prunIderegistr) {
		this.prunIderegistr = prunIderegistr;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((prunPrgunidad == null) ? 0 : prunPrgunidad.hashCode());
		result = prime * result + ((uspuIderegistr == null) ? 0 : uspuIderegistr.hashCode());
		result = prime * result + ((usuAuditoria == null) ? 0 : usuAuditoria.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
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
		UspuUsuprgunid other = (UspuUsuprgunid) obj;
		if (prunPrgunidad == null) {
			if (other.prunPrgunidad != null)
				return false;
		} else if (!prunPrgunidad.equals(other.prunPrgunidad))
			return false;
		if (uspuIderegistr == null) {
			if (other.uspuIderegistr != null)
				return false;
		} else if (!uspuIderegistr.equals(other.uspuIderegistr))
			return false;
		if (usuAuditoria == null) {
			if (other.usuAuditoria != null)
				return false;
		} else if (!usuAuditoria.equals(other.usuAuditoria))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}