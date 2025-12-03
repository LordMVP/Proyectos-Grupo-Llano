package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "cplc_conperliqconsolidado", schema="aseo")
@NamedQuery(name = "CplcConperliqconsolidado.findAll", query = "SELECT p FROM CplcConperliqconsolidado p")

public class CplcConperliqconsolidado implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "aseo.cplc_conperliqconsolidado_cplc_idregistro_seq", sequenceName = "aseo.cplc_conperliqconsolidado_cplc_idregistro_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.cplc_conperliqconsolidado_cplc_idregistro_seq")
	@Column(name = "cplc_idregistro")
	private Integer cplcIdregistro;
	
	@Column(name = "prl_ideregistro")
	private Integer prlIderegistro;
	
	@Column(name = "coli_aprov_ideregistro")
	private Integer coliAprovIderegistro;
	
	@Column(name = "cplc_vlr_liq")
	private BigDecimal cplcVlrLiq;
	
	public CplcConperliqconsolidado() {
		//constructor por defecto
	}

	public Integer getCplcIdregistro() {
		return cplcIdregistro;
	}

	public void setCplcIdregistro(Integer cplcIdregistro) {
		this.cplcIdregistro = cplcIdregistro;
	}

	public Integer getPrlIderegistro() {
		return prlIderegistro;
	}

	public void setPrlIderegistro(Integer prlIderegistro) {
		this.prlIderegistro = prlIderegistro;
	}

	public Integer getColiAprovIderegistro() {
		return coliAprovIderegistro;
	}

	public void setColiAprovIderegistro(Integer coliAprovIderegistro) {
		this.coliAprovIderegistro = coliAprovIderegistro;
	}

	public BigDecimal getCplcVlrLiq() {
		return cplcVlrLiq;
	}

	public void setCplcVlrLiq(BigDecimal cplcVlrLiq) {
		this.cplcVlrLiq = cplcVlrLiq;
	}
	
	

}
