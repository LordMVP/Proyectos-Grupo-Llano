package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class DecaDesccalidadDTO {

	private Long decaIdregistr;
	private Boolean descAplicado;
	private Long dsusIderegistr;
	private Long facIderegistro;
	private BigDecimal factorDesc;
	private Timestamp fechaRegistro;
	private BigDecimal interesAplicado;
	private Integer perIdeordenAplic;
	private Integer perIderegistroActivo;
	private Integer perIderegistroTarifas;
	private BigDecimal porcentajeInteres;
	private Long rutIderegistro;
	private BigDecimal saldoTotalDesc;
	private Integer uniConceptoFacturacion;
	private Integer uniConceptoTarifas;
	private Integer uniConceptoInteres;
	private Integer usuIderegistro;
	private BigDecimal valorToneladas;
	private BigDecimal valorTotalDesc;

	public DecaDesccalidadDTO() {
		super();
	}

	public Long getDecaIdregistr() {
		return decaIdregistr;
	}

	public void setDecaIdregistr(Long decaIdregistr) {
		this.decaIdregistr = decaIdregistr;
	}

	public Boolean getDescAplicado() {
		return descAplicado;
	}

	public void setDescAplicado(Boolean descAplicado) {
		this.descAplicado = descAplicado;
	}

	public Long getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Long getFacIderegistro() {
		return facIderegistro;
	}

	public void setFacIderegistro(Long facIderegistro) {
		this.facIderegistro = facIderegistro;
	}

	public BigDecimal getFactorDesc() {
		return factorDesc;
	}

	public void setFactorDesc(BigDecimal factorDesc) {
		this.factorDesc = factorDesc;
	}

	public Timestamp getFechaRegistro() {
		return fechaRegistro;
	}

	public void setFechaRegistro(Timestamp fechaRegistro) {
		this.fechaRegistro = fechaRegistro;
	}

	public BigDecimal getInteresAplicado() {
		return interesAplicado;
	}

	public void setInteresAplicado(BigDecimal interesAplicado) {
		this.interesAplicado = interesAplicado;
	}

	public Integer getPerIdeordenAplic() {
		return perIdeordenAplic;
	}

	public void setPerIdeordenAplic(Integer perIdeordenAplic) {
		this.perIdeordenAplic = perIdeordenAplic;
	}

	public Integer getPerIderegistroActivo() {
		return perIderegistroActivo;
	}

	public void setPerIderegistroActivo(Integer perIderegistroActivo) {
		this.perIderegistroActivo = perIderegistroActivo;
	}

	public Integer getPerIderegistroTarifas() {
		return perIderegistroTarifas;
	}

	public void setPerIderegistroTarifas(Integer perIderegistroTarifas) {
		this.perIderegistroTarifas = perIderegistroTarifas;
	}

	public BigDecimal getPorcentajeInteres() {
		return porcentajeInteres;
	}

	public void setPorcentajeInteres(BigDecimal porcentajeInteres) {
		this.porcentajeInteres = porcentajeInteres;
	}

	public Long getRutIderegistro() {
		return rutIderegistro;
	}

	public void setRutIderegistro(Long rutIderegistro) {
		this.rutIderegistro = rutIderegistro;
	}

	public BigDecimal getSaldoTotalDesc() {
		return saldoTotalDesc;
	}

	public void setSaldoTotalDesc(BigDecimal saldoTotalDesc) {
		this.saldoTotalDesc = saldoTotalDesc;
	}

	public Integer getUniConceptoFacturacion() {
		return uniConceptoFacturacion;
	}

	public void setUniConceptoFacturacion(Integer uniConceptoFacturacion) {
		this.uniConceptoFacturacion = uniConceptoFacturacion;
	}

	public Integer getUniConceptoTarifas() {
		return uniConceptoTarifas;
	}

	public void setUniConceptoTarifas(Integer uniConceptoTarifas) {
		this.uniConceptoTarifas = uniConceptoTarifas;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public BigDecimal getValorToneladas() {
		return valorToneladas;
	}

	public void setValorToneladas(BigDecimal valorToneladas) {
		this.valorToneladas = valorToneladas;
	}

	public BigDecimal getValorTotalDesc() {
		return valorTotalDesc;
	}

	public void setValorTotalDesc(BigDecimal valorTotalDesc) {
		this.valorTotalDesc = valorTotalDesc;
	}

	public Integer getUniConceptoInteres() {
		return uniConceptoInteres;
	}

	public void setUniConceptoInteres(Integer uniConceptoInteres) {
		this.uniConceptoInteres = uniConceptoInteres;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((decaIdregistr == null) ? 0 : decaIdregistr.hashCode());
		result = prime * result + ((descAplicado == null) ? 0 : descAplicado.hashCode());
		result = prime * result + ((dsusIderegistr == null) ? 0 : dsusIderegistr.hashCode());
		result = prime * result + ((facIderegistro == null) ? 0 : facIderegistro.hashCode());
		result = prime * result + ((factorDesc == null) ? 0 : factorDesc.hashCode());
		result = prime * result + ((fechaRegistro == null) ? 0 : fechaRegistro.hashCode());
		result = prime * result + ((interesAplicado == null) ? 0 : interesAplicado.hashCode());
		result = prime * result + ((perIdeordenAplic == null) ? 0 : perIdeordenAplic.hashCode());
		result = prime * result + ((perIderegistroActivo == null) ? 0 : perIderegistroActivo.hashCode());
		result = prime * result + ((perIderegistroTarifas == null) ? 0 : perIderegistroTarifas.hashCode());
		result = prime * result + ((porcentajeInteres == null) ? 0 : porcentajeInteres.hashCode());
		result = prime * result + ((rutIderegistro == null) ? 0 : rutIderegistro.hashCode());
		result = prime * result + ((saldoTotalDesc == null) ? 0 : saldoTotalDesc.hashCode());
		result = prime * result + ((uniConceptoFacturacion == null) ? 0 : uniConceptoFacturacion.hashCode());
		result = prime * result + ((uniConceptoInteres == null) ? 0 : uniConceptoInteres.hashCode());
		result = prime * result + ((uniConceptoTarifas == null) ? 0 : uniConceptoTarifas.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		result = prime * result + ((valorToneladas == null) ? 0 : valorToneladas.hashCode());
		result = prime * result + ((valorTotalDesc == null) ? 0 : valorTotalDesc.hashCode());
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
		DecaDesccalidadDTO other = (DecaDesccalidadDTO) obj;
		if (decaIdregistr == null) {
			if (other.decaIdregistr != null)
				return false;
		} else if (!decaIdregistr.equals(other.decaIdregistr))
			return false;
		if (descAplicado == null) {
			if (other.descAplicado != null)
				return false;
		} else if (!descAplicado.equals(other.descAplicado))
			return false;
		if (dsusIderegistr == null) {
			if (other.dsusIderegistr != null)
				return false;
		} else if (!dsusIderegistr.equals(other.dsusIderegistr))
			return false;
		if (facIderegistro == null) {
			if (other.facIderegistro != null)
				return false;
		} else if (!facIderegistro.equals(other.facIderegistro))
			return false;
		if (factorDesc == null) {
			if (other.factorDesc != null)
				return false;
		} else if (!factorDesc.equals(other.factorDesc))
			return false;
		if (fechaRegistro == null) {
			if (other.fechaRegistro != null)
				return false;
		} else if (!fechaRegistro.equals(other.fechaRegistro))
			return false;
		if (interesAplicado == null) {
			if (other.interesAplicado != null)
				return false;
		} else if (!interesAplicado.equals(other.interesAplicado))
			return false;
		if (perIdeordenAplic == null) {
			if (other.perIdeordenAplic != null)
				return false;
		} else if (!perIdeordenAplic.equals(other.perIdeordenAplic))
			return false;
		if (perIderegistroActivo == null) {
			if (other.perIderegistroActivo != null)
				return false;
		} else if (!perIderegistroActivo.equals(other.perIderegistroActivo))
			return false;
		if (perIderegistroTarifas == null) {
			if (other.perIderegistroTarifas != null)
				return false;
		} else if (!perIderegistroTarifas.equals(other.perIderegistroTarifas))
			return false;
		if (porcentajeInteres == null) {
			if (other.porcentajeInteres != null)
				return false;
		} else if (!porcentajeInteres.equals(other.porcentajeInteres))
			return false;
		if (rutIderegistro == null) {
			if (other.rutIderegistro != null)
				return false;
		} else if (!rutIderegistro.equals(other.rutIderegistro))
			return false;
		if (saldoTotalDesc == null) {
			if (other.saldoTotalDesc != null)
				return false;
		} else if (!saldoTotalDesc.equals(other.saldoTotalDesc))
			return false;
		if (uniConceptoFacturacion == null) {
			if (other.uniConceptoFacturacion != null)
				return false;
		} else if (!uniConceptoFacturacion.equals(other.uniConceptoFacturacion))
			return false;
		if (uniConceptoInteres == null) {
			if (other.uniConceptoInteres != null)
				return false;
		} else if (!uniConceptoInteres.equals(other.uniConceptoInteres))
			return false;
		if (uniConceptoTarifas == null) {
			if (other.uniConceptoTarifas != null)
				return false;
		} else if (!uniConceptoTarifas.equals(other.uniConceptoTarifas))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		if (valorToneladas == null) {
			if (other.valorToneladas != null)
				return false;
		} else if (!valorToneladas.equals(other.valorToneladas))
			return false;
		if (valorTotalDesc == null) {
			if (other.valorTotalDesc != null)
				return false;
		} else if (!valorTotalDesc.equals(other.valorTotalDesc))
			return false;
		return true;
	}

}
