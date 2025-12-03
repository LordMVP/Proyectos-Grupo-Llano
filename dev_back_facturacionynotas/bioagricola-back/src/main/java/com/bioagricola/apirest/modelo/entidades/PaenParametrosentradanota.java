package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * The persistent class for the paen_parametrosentradanotas database table.
 * 
 */
@Entity
@Table(name = "paen_parametrosentradanotas", schema = "aseo")
@NamedQuery(name = "PaenParametrosentradanota.findAll", query = "SELECT p FROM PaenParametrosentradanota p")
public class PaenParametrosentradanota implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "aseo.sq_paen_ideregistro", sequenceName = "aseo.sq_paen_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.sq_paen_ideregistro")
	@Column(name = "paen_ideregistro")
	private Integer paenIderegistro;

	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@Column(name = "paen_fechaedicion")
	private Timestamp paenFechaedicion;

	@Column(name = "paen_sqlstring")
	private String paenSqlstring;

	@Column(name = "paen_tipocalculo")
	private String paenTipocalculo;

	@Column(name = "paen_valor")
	private BigDecimal paenValor;

	@Column(name = "prg_ideregistro")
	private Long prgIderegistro;

	@Column(name = "uni_concepto")
	private Long uniConcepto;

	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;

	public PaenParametrosentradanota() {
		//constructor por defecto
	}

	public Integer getPaenIderegistro() {
		return this.paenIderegistro;
	}

	public void setPaenIderegistro(Integer paenIderegistro) {
		this.paenIderegistro = paenIderegistro;
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Timestamp getPaenFechaedicion() {
		return this.paenFechaedicion;
	}

	public void setPaenFechaedicion(Timestamp paenFechaedicion) {
		this.paenFechaedicion = paenFechaedicion;
	}

	public String getPaenSqlstring() {
		return this.paenSqlstring;
	}

	public void setPaenSqlstring(String paenSqlstring) {
		this.paenSqlstring = paenSqlstring;
	}

	public String getPaenTipocalculo() {
		return this.paenTipocalculo;
	}

	public void setPaenTipocalculo(String paenTipocalculo) {
		this.paenTipocalculo = paenTipocalculo;
	}

	public BigDecimal getPaenValor() {
		return this.paenValor;
	}

	public void setPaenValor(BigDecimal paenValor) {
		this.paenValor = paenValor;
	}

	public Long getPrgIderegistro() {
		return this.prgIderegistro;
	}

	public void setPrgIderegistro(Long prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	public Long getUniConcepto() {
		return this.uniConcepto;
	}

	public void setUniConcepto(Long uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Long getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

}