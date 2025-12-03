package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;

public class SuscripPorMicroRutaDTO {

	private Long dsusIderegistr;
	private Integer rutIdemicroruta;
	private BigDecimal vrmrValor;
	private Integer conIderegistro;

	public SuscripPorMicroRutaDTO() {
		super();
	}

	public SuscripPorMicroRutaDTO(Long dsusIderegistr, Integer rutIdemicroruta, BigDecimal vrmrValor,
			Integer conIderegistro) {
		super();
		this.dsusIderegistr = dsusIderegistr;
		this.rutIdemicroruta = rutIdemicroruta;
		this.vrmrValor = vrmrValor;
		this.conIderegistro = conIderegistro;
	}

	public Long getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getRutIdemicroruta() {
		return rutIdemicroruta;
	}

	public void setRutIdemicroruta(Integer rutIdemicroruta) {
		this.rutIdemicroruta = rutIdemicroruta;
	}

	public BigDecimal getVrmrValor() {
		return vrmrValor;
	}

	public void setVrmrValor(BigDecimal vrmrValor) {
		this.vrmrValor = vrmrValor;
	}

	public Integer getConIderegistro() {
		return conIderegistro;
	}

	public void setConIderegistro(Integer conIderegistro) {
		this.conIderegistro = conIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((conIderegistro == null) ? 0 : conIderegistro.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((rutIdemicroruta == null) ? 0 : rutIdemicroruta.hashCode());
		result = prime * result + ((vrmrValor == null) ? 0 : vrmrValor.hashCode());
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
		SuscripPorMicroRutaDTO other = (SuscripPorMicroRutaDTO) obj;
		if (conIderegistro == null) {
			if (other.conIderegistro != null)
				return false;
		} else if (!conIderegistro.equals(other.conIderegistro))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (rutIdemicroruta == null) {
			if (other.rutIdemicroruta != null)
				return false;
		} else if (!rutIdemicroruta.equals(other.rutIdemicroruta))
			return false;
		if (vrmrValor == null) {
			if (other.vrmrValor != null)
				return false;
		} else if (!vrmrValor.equals(other.vrmrValor))
			return false;
		return true;
	}

}
