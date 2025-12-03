package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import uk.co.jemos.podam.annotations.PodamExclude;

/**
 * The persistent class for the dafo_detaforo database table.
 * 
 */
@Entity
@Table(name = "dafo_detaforo", schema = "aseo")
@NamedQuery(name = "DafoDetaforo.findAll", query = "SELECT d FROM DafoDetaforo d")
public class DafoDetaforo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "dafo_ideregistro")
	private Integer dafoIderegistro;

	@Temporal(TemporalType.DATE)
	@Column(name = "afo_fechafinvegencia")
	private Date afoFechafinvegencia;

	@Column(name = "afo_numpqr")
	private String afoNumpqr;

	@Temporal(TemporalType.DATE)
	@Column(name = "dafo_fechactualizacion")
	private Date dafoFechactualizacion;

	@Temporal(TemporalType.DATE)
	@Column(name = "dafo_fecharegistro")
	private Date dafoFecharegistro;

	@Column(name = "dafo_multiusuporcentaje")
	private String dafoMultiusuporcentaje;

	@Column(name = "dsus_ideregistr")
	private Integer dsusIderegistr;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;

	@PodamExclude
	@Column(name = "afo_ideregistro")
	private Integer afoIderegistro;

	// bi-directional many-to-one association to AfoAforo
	@ManyToOne
	@JoinColumn(name = "afo_ideregistro", referencedColumnName = "afo_ideregistro", insertable = false, updatable = false)
	@PodamExclude
	private AfoAforo afoAforo;

	public DafoDetaforo() {
		//constructor por defecto
	}

	public Integer getAfoIderegistro() {
		return afoIderegistro;
	}

	public void setAfoIderegistro(Integer afoIderegistro) {
		this.afoIderegistro = afoIderegistro;
	}

	public Integer getDafoIderegistro() {
		return this.dafoIderegistro;
	}

	public void setDafoIderegistro(Integer dafoIderegistro) {
		this.dafoIderegistro = dafoIderegistro;
	}

	public Date getAfoFechafinvegencia() {
		return this.afoFechafinvegencia;
	}

	public void setAfoFechafinvegencia(Date afoFechafinvegencia) {
		this.afoFechafinvegencia = afoFechafinvegencia;
	}

	public String getAfoNumpqr() {
		return this.afoNumpqr;
	}

	public void setAfoNumpqr(String afoNumpqr) {
		this.afoNumpqr = afoNumpqr;
	}

	public Date getDafoFechactualizacion() {
		return this.dafoFechactualizacion;
	}

	public void setDafoFechactualizacion(Date dafoFechactualizacion) {
		this.dafoFechactualizacion = dafoFechactualizacion;
	}

	public Date getDafoFecharegistro() {
		return this.dafoFecharegistro;
	}

	public void setDafoFecharegistro(Date dafoFecharegistro) {
		this.dafoFecharegistro = dafoFecharegistro;
	}

	public String getDafoMultiusuporcentaje() {
		return this.dafoMultiusuporcentaje;
	}

	public void setDafoMultiusuporcentaje(String dafoMultiusuporcentaje) {
		this.dafoMultiusuporcentaje = dafoMultiusuporcentaje;
	}

	public Integer getDsusIderegistr() {
		return this.dsusIderegistr;
	}

	public void setDsusIderegistr(Integer dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public AfoAforo getAfoAforo() {
		return this.afoAforo;
	}

	public void setAfoAforo(AfoAforo afoAforo) {
		this.afoAforo = afoAforo;
	}

}