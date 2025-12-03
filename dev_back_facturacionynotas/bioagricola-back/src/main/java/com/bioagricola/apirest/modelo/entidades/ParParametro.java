package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * The persistent class for the par_parametro database table.
 * 
 */
@Entity
@Table(name = "par_parametro")
@NamedQuery(name = "ParParametro.findAll", query = "SELECT p FROM ParParametro p")
public class ParParametro implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@Column(name = "par_ideregistro")
	private Long parIderegistro;

	@Column(name = "par_parametro")
	private String parparametro1;

	public ParParametro() {
		// constructor por defecto
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Long getParIderegistro() {
		return this.parIderegistro;
	}

	public void setParIderegistro(Long parIderegistro) {
		this.parIderegistro = parIderegistro;
	}

	public String getParParametro() {
		return parparametro1;
	}

	public void setParParametro(String parParametro) {
		this.parparametro1 = parParametro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((empIderegistro == null) ? 0 : empIderegistro.hashCode());
		result = prime * result + ((parIderegistro == null) ? 0 : parIderegistro.hashCode());
		result = prime * result + ((parparametro1 == null) ? 0 : parparametro1.hashCode());
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
		ParParametro other = (ParParametro) obj;
		if (empIderegistro == null) {
			if (other.empIderegistro != null)
				return false;
		} else if (!empIderegistro.equals(other.empIderegistro))
			return false;
		if (parIderegistro == null) {
			if (other.parIderegistro != null)
				return false;
		} else if (!parIderegistro.equals(other.parIderegistro))
			return false;
		if (parparametro1 == null) {
			if (other.parparametro1 != null)
				return false;
		} else if (!parparametro1.equals(other.parparametro1))
			return false;
		return true;
	}

}