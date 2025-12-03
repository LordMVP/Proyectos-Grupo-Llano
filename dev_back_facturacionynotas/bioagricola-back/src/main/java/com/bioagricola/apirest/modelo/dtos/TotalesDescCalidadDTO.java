package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;

public class TotalesDescCalidadDTO {

	private String conNombreIndicador;
	private String periodo;
	private BigDecimal totalDescuento;
	private BigDecimal totalInteresCorriente;
	private BigDecimal totalInteresMoratorio;

	public TotalesDescCalidadDTO() {
		super();
	}

	public TotalesDescCalidadDTO(String conNombreIndicador, String periodo, BigDecimal totalDescuento,
			BigDecimal totalInteresCorriente, BigDecimal totalInteresMoratorio) {
		super();
		this.conNombreIndicador = conNombreIndicador;
		this.periodo = periodo;
		this.totalDescuento = totalDescuento;
		this.totalInteresCorriente = totalInteresCorriente;
		this.totalInteresMoratorio = totalInteresMoratorio;
	}

	public String getConNombreIndicador() {
		return conNombreIndicador;
	}

	public void setConNombreIndicador(String conNombreIndicador) {
		this.conNombreIndicador = conNombreIndicador;
	}

	public String getPeriodo() {
		return periodo;
	}

	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	public BigDecimal getTotalDescuento() {
		return totalDescuento;
	}

	public void setTotalDescuento(BigDecimal totalDescuento) {
		this.totalDescuento = totalDescuento;
	}

	public BigDecimal getTotalInteresCorriente() {
		return totalInteresCorriente;
	}

	public void setTotalInteresCorriente(BigDecimal totalInteresCorriente) {
		this.totalInteresCorriente = totalInteresCorriente;
	}

	public BigDecimal getTotalInteresMoratorio() {
		return totalInteresMoratorio;
	}

	public void setTotalInteresMoratorio(BigDecimal totalInteresMoratorio) {
		this.totalInteresMoratorio = totalInteresMoratorio;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((conNombreIndicador == null) ? 0 : conNombreIndicador.hashCode());
		result = prime * result + ((periodo == null) ? 0 : periodo.hashCode());
		result = prime * result + ((totalDescuento == null) ? 0 : totalDescuento.hashCode());
		result = prime * result + ((totalInteresCorriente == null) ? 0 : totalInteresCorriente.hashCode());
		result = prime * result + ((totalInteresMoratorio == null) ? 0 : totalInteresMoratorio.hashCode());
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
		TotalesDescCalidadDTO other = (TotalesDescCalidadDTO) obj;
		if (conNombreIndicador == null) {
			if (other.conNombreIndicador != null)
				return false;
		} else if (!conNombreIndicador.equals(other.conNombreIndicador))
			return false;
		if (periodo == null) {
			if (other.periodo != null)
				return false;
		} else if (!periodo.equals(other.periodo))
			return false;
		if (totalDescuento == null) {
			if (other.totalDescuento != null)
				return false;
		} else if (!totalDescuento.equals(other.totalDescuento))
			return false;
		if (totalInteresCorriente == null) {
			if (other.totalInteresCorriente != null)
				return false;
		} else if (!totalInteresCorriente.equals(other.totalInteresCorriente))
			return false;
		if (totalInteresMoratorio == null) {
			if (other.totalInteresMoratorio != null)
				return false;
		} else if (!totalInteresMoratorio.equals(other.totalInteresMoratorio))
			return false;
		return true;
	}

}
