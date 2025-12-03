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
 * The persistent class for the nofa_notfactura database table.
 * 
 */
@Entity
@Table(name="nofa_notfactura")
@NamedQuery(name="NofaNotfactura.findAll", query="SELECT n FROM NofaNotfactura n")
public class NofaNotfactura implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="nofa_ideregistr")
	private Long nofaIderegistr;

	@Column(name="fac_ideorigen")
	private Long facIdeorigen;

	@Column(name="fac_ideregistro")
	private Long facIderegistro;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	//bi-directional many-to-one association to DfacDetfactura
	@ManyToOne
	@JoinColumn(name="dfac_ideorigen", referencedColumnName = "dfac_ideorigen")
	private DfacDetfactura dfacDetfactura1;

	//bi-directional many-to-one association to DfacDetfactura
	@ManyToOne
	@JoinColumn(name="dfac_ideregistr", referencedColumnName = "dfac_ideregistr")
	private DfacDetfactura dfacDetfactura2;

	//bi-directional many-to-one association to NotNota
	@ManyToOne
	@JoinColumn(name="not_ideregistro", referencedColumnName = "not_ideregistro")
	private NotNota notNota;

	public NofaNotfactura() {
		//constructor por defecto
	}

	public Long getNofaIderegistr() {
		return this.nofaIderegistr;
	}

	public void setNofaIderegistr(Long nofaIderegistr) {
		this.nofaIderegistr = nofaIderegistr;
	}

	public Long getFacIdeorigen() {
		return this.facIdeorigen;
	}

	public void setFacIdeorigen(Long facIdeorigen) {
		this.facIdeorigen = facIdeorigen;
	}

	public Long getFacIderegistro() {
		return this.facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public DfacDetfactura getDfacDetfactura1() {
		return this.dfacDetfactura1;
	}

	public void setDfacDetfactura1(DfacDetfactura dfacDetfactura1) {
		this.dfacDetfactura1 = dfacDetfactura1;
	}

	public DfacDetfactura getDfacDetfactura2() {
		return this.dfacDetfactura2;
	}

	public void setDfacDetfactura2(DfacDetfactura dfacDetfactura2) {
		this.dfacDetfactura2 = dfacDetfactura2;
	}

	public NotNota getNotNota() {
		return this.notNota;
	}

	public void setNotNota(NotNota notNota) {
		this.notNota = notNota;
	}

}