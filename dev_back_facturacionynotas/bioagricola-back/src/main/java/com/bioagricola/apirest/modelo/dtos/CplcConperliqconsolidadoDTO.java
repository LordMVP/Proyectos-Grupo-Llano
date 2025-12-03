package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

public class CplcConperliqconsolidadoDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer cplcIdregistro;
	
	private Integer prlIderegistro;
	
	private Integer coliAprovIderegistro;
	
	private BigDecimal cplcVlrLiq;
	
	public CplcConperliqconsolidadoDTO()
	{
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
