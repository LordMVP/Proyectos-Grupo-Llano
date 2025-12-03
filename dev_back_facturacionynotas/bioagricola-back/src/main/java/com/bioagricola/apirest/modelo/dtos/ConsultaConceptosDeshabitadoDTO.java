package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ConsultaConceptosDeshabitadoDTO implements Serializable {
	
	private String nombreConcepto;
	
	private BigDecimal tarifaFinal;
	
	private BigDecimal tarifaDesocupado;
	
	private BigDecimal totalDescuento;
	
	
	

	public ConsultaConceptosDeshabitadoDTO() {
		super();
	}

	public String getNombreConcepto() {
		return nombreConcepto;
	}

	public void setNombreConcepto(String nombreConcepto) {
		this.nombreConcepto = nombreConcepto;
	}

	public BigDecimal getTarifaFinal() {
		return tarifaFinal;
	}

	public void setTarifaFinal(BigDecimal tarifaFinal) {
		this.tarifaFinal = tarifaFinal;
	}

	public BigDecimal getTarifaDesocupado() {
		return tarifaDesocupado;
	}

	public void setTarifaDesocupado(BigDecimal tarifaDesocupado) {
		this.tarifaDesocupado = tarifaDesocupado;
	}

	public BigDecimal getTotalDescuento() {
		return totalDescuento;
	}

	public void setTotalDescuento(BigDecimal totalDescuento) {
		this.totalDescuento = totalDescuento;
	}
	
	
	

}
