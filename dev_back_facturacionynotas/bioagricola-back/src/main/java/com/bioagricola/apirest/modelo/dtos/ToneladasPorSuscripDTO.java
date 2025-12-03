package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;

public class ToneladasPorSuscripDTO {

	private Long dsusIdregistr;
	private Integer uniConcepto;
	private BigDecimal valorToneladas;

	public ToneladasPorSuscripDTO(Long dsusIdregistr, Integer uniConcepto, BigDecimal valorToneladas) {
		super();
		this.dsusIdregistr = dsusIdregistr;
		this.uniConcepto = uniConcepto;
		this.valorToneladas = valorToneladas;
	}

	public ToneladasPorSuscripDTO() {
		super();
	}

	public Long getDsusIdregistr() {
		return dsusIdregistr;
	}

	public void setDsusIdregistr(Long dsusIdregistr) {
		this.dsusIdregistr = dsusIdregistr;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public BigDecimal getValorToneladas() {
		return valorToneladas;
	}

	public void setValorToneladas(BigDecimal valorToneladas) {
		this.valorToneladas = valorToneladas;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dsusIdregistr == null) ? 0 : dsusIdregistr.hashCode());
		result = prime * result + ((uniConcepto == null) ? 0 : uniConcepto.hashCode());
		result = prime * result + ((valorToneladas == null) ? 0 : valorToneladas.hashCode());
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
		ToneladasPorSuscripDTO other = (ToneladasPorSuscripDTO) obj;
		if (dsusIdregistr == null) {
			if (other.dsusIdregistr != null)
				return false;
		} else if (!dsusIdregistr.equals(other.dsusIdregistr))
			return false;
		if (uniConcepto == null) {
			if (other.uniConcepto != null)
				return false;
		} else if (!uniConcepto.equals(other.uniConcepto))
			return false;
		if (valorToneladas == null) {
			if (other.valorToneladas != null)
				return false;
		} else if (!valorToneladas.equals(other.valorToneladas))
			return false;
		return true;
	}

}
