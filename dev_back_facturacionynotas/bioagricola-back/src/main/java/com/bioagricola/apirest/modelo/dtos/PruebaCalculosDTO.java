package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class PruebaCalculosDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long facIderegistro;
	
	private List<Integer> uniConcepto;
	
	private BigDecimal porcentajeParticipacion;
	
	public PruebaCalculosDTO() {
		//constructor por defecto
	}

	public Long getFacIderegistro() {
		return facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public List<Integer> getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(List<Integer> uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public BigDecimal getPorcentajeParticipacion() {
		return porcentajeParticipacion;
	}

	public void setPorcentajeParticipacion(BigDecimal porcentajeParticipacion) {
		this.porcentajeParticipacion = porcentajeParticipacion;
	}
	
	

	
	
	
	

	
	

}
