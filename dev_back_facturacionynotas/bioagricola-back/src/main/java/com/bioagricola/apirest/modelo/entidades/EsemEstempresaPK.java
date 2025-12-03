package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * The primary key class for the esem_estempresa database table.
 * 
 */
@Embeddable
public class EsemEstempresaPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="est_ideregistro", insertable=false, updatable=false)
	private Integer estIderegistro;

	@Column(name="emp_ideregistro", insertable=false, updatable=false)
	private Integer empIderegistro;

	public EsemEstempresaPK() {
		//constructor por defecto
	}
	public Integer getEstIderegistro() {
		return this.estIderegistro;
	}
	public void setEstIderegistro(Integer estIderegistro) {
		this.estIderegistro = estIderegistro;
	}
	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}
	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof EsemEstempresaPK)) {
			return false;
		}
		EsemEstempresaPK castOther = (EsemEstempresaPK)other;
		return 
			this.estIderegistro.equals(castOther.estIderegistro)
			&& this.empIderegistro.equals(castOther.empIderegistro);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.estIderegistro.hashCode();
		hash = hash * prime + this.empIderegistro.hashCode();
		
		return hash;
	}
}