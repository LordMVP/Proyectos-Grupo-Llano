package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class PaenParametrosentradanotaDTO {

	private Integer paenIderegistro;
	private Integer empIderegistro;
	private Timestamp paenFechaedicion;
	private String paenSqlstring;
	private String paenTipocalculo;
	private BigDecimal paenValor;
	private Long prgIderegistro;
	private Long uniConcepto;
	private Long usuIderegistro;

	public Integer getPaenIderegistro() {
		return paenIderegistro;
	}

	public void setPaenIderegistro(Integer paenIderegistro) {
		this.paenIderegistro = paenIderegistro;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Timestamp getPaenFechaedicion() {
		return paenFechaedicion;
	}

	public void setPaenFechaedicion(Timestamp paenFechaedicion) {
		this.paenFechaedicion = paenFechaedicion;
	}

	public String getPaenSqlstring() {
		return paenSqlstring;
	}

	public void setPaenSqlstring(String paenSqlstring) {
		this.paenSqlstring = paenSqlstring;
	}

	public String getPaenTipocalculo() {
		return paenTipocalculo;
	}

	public void setPaenTipocalculo(String paenTipocalculo) {
		this.paenTipocalculo = paenTipocalculo;
	}

	public BigDecimal getPaenValor() {
		return paenValor;
	}

	public void setPaenValor(BigDecimal paenValor) {
		this.paenValor = paenValor;
	}

	public Long getPrgIderegistro() {
		return prgIderegistro;
	}

	public void setPrgIderegistro(Long prgIderegistro) {
		this.prgIderegistro = prgIderegistro;
	}

	public Long getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Long uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Long getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

}
