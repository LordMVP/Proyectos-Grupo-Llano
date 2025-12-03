package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;


/**
 * The persistent class for the prun_prgunidad database table.
 * 
 */
@Entity
@Table(name="prun_prgunidad")
@NamedQuery(name="PrunPrgunidad.findAll", query="SELECT p FROM PrunPrgunidad p")
public class PrunPrgunidad implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="prun_ideregistr")
	private Long prunIderegistr;

	@Column(name="prg_ideregistro")
	private Integer prgIderegistro;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="uni_ideregistro")
	private Integer uniIderegistro;

	//bi-directional many-to-one association to UniUnidad
	@ManyToOne
	@JoinColumn(name="uni_ideregistro", referencedColumnName="uni_ideregistro", insertable = false, updatable = false)
	private UniUnidad uniUnidad;

	//bi-directional many-to-one association to UspuUsuprgunid
	@OneToMany(mappedBy="prunPrgunidad")
	private List<UspuUsuprgunid> uspuUsuprgunids;

	public PrunPrgunidad() {
	}

	public Long getPrunIderegistr() {
		return this.prunIderegistr;
	}

	public void setPrunIderegistr(Long prunIderegistr) {
		this.prunIderegistr = prunIderegistr;
	}

	public Integer getPrgIderegistro() {
		return this.prgIderegistro;
	}

	public void setPrgIderegistro(Integer prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public UniUnidad getUniUnidad() {
		return this.uniUnidad;
	}

	public void setUniUnidad(UniUnidad uniUnidad) {
		this.uniUnidad = uniUnidad;
	}

	public List<UspuUsuprgunid> getUspuUsuprgunids() {
		return this.uspuUsuprgunids;
	}

	public void setUspuUsuprgunids(List<UspuUsuprgunid> uspuUsuprgunids) {
		this.uspuUsuprgunids = uspuUsuprgunids;
	}

	public UspuUsuprgunid addUspuUsuprgunid(UspuUsuprgunid uspuUsuprgunid) {
		getUspuUsuprgunids().add(uspuUsuprgunid);
		uspuUsuprgunid.setPrunPrgunidad(this);

		return uspuUsuprgunid;
	}

	public UspuUsuprgunid removeUspuUsuprgunid(UspuUsuprgunid uspuUsuprgunid) {
		getUspuUsuprgunids().remove(uspuUsuprgunid);
		uspuUsuprgunid.setPrunPrgunidad(null);

		return uspuUsuprgunid;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((prgIderegistro == null) ? 0 : prgIderegistro.hashCode());
		result = prime * result + ((prunIderegistr == null) ? 0 : prunIderegistr.hashCode());
		result = prime * result + ((uniUnidad == null) ? 0 : uniUnidad.hashCode());
		result = prime * result + ((uspuUsuprgunids == null) ? 0 : uspuUsuprgunids.hashCode());
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
		PrunPrgunidad other = (PrunPrgunidad) obj;
		if (prgIderegistro == null) {
			if (other.prgIderegistro != null)
				return false;
		} else if (!prgIderegistro.equals(other.prgIderegistro))
			return false;
		if (prunIderegistr == null) {
			if (other.prunIderegistr != null)
				return false;
		} else if (!prunIderegistr.equals(other.prunIderegistr))
			return false;
		if (uniUnidad == null) {
			if (other.uniUnidad != null)
				return false;
		} else if (!uniUnidad.equals(other.uniUnidad))
			return false;
		if (uspuUsuprgunids == null) {
			if (other.uspuUsuprgunids != null)
				return false;
		} else if (!uspuUsuprgunids.equals(other.uspuUsuprgunids))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}
	
	

}