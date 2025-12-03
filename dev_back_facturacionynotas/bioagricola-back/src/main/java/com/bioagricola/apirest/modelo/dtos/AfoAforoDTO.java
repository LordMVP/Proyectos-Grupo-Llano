package com.bioagricola.apirest.modelo.dtos;

import java.math.BigDecimal;
import java.util.Date;

public class AfoAforoDTO {

	private Integer afoIderegistro;
	private Integer afoCantidadfrecuenciarecoleccion;
	private String afoEstado;
	private Date afoFecha;
	private Date afoFechaactualizacion;
	private Date afoFechafinvegencia;
	private Date afoFechainicio;
	private String afoFrecuenciarecoleccion;
	private Integer afoIdeafopadre;
	private String afoNumpqr;
	private String afoObservaciones;
	private Integer barrioIderegistro;
	private BigDecimal mafvFactor;
	private Integer rureIderegistro;
	private Integer terAforador;
	private Integer tfdIderegistro;
	private Integer uniClasesuscripcionaforo;
	private Integer uniComplemento;
	private Integer uniTipoaforo;
	private Integer uniTipogenerador;
	private Integer usuIderegistro;

	public Integer getAfoIderegistro() {
		return afoIderegistro;
	}

	public void setAfoIderegistro(Integer afoIderegistro) {
		this.afoIderegistro = afoIderegistro;
	}

	public Integer getAfoCantidadfrecuenciarecoleccion() {
		return afoCantidadfrecuenciarecoleccion;
	}

	public void setAfoCantidadfrecuenciarecoleccion(Integer afoCantidadfrecuenciarecoleccion) {
		this.afoCantidadfrecuenciarecoleccion = afoCantidadfrecuenciarecoleccion;
	}

	public String getAfoEstado() {
		return afoEstado;
	}

	public void setAfoEstado(String afoEstado) {
		this.afoEstado = afoEstado;
	}

	public Date getAfoFecha() {
		return afoFecha;
	}

	public void setAfoFecha(Date afoFecha) {
		this.afoFecha = afoFecha;
	}

	public Date getAfoFechaactualizacion() {
		return afoFechaactualizacion;
	}

	public void setAfoFechaactualizacion(Date afoFechaactualizacion) {
		this.afoFechaactualizacion = afoFechaactualizacion;
	}

	public Date getAfoFechafinvegencia() {
		return afoFechafinvegencia;
	}

	public void setAfoFechafinvegencia(Date afoFechafinvegencia) {
		this.afoFechafinvegencia = afoFechafinvegencia;
	}

	public Date getAfoFechainicio() {
		return afoFechainicio;
	}

	public void setAfoFechainicio(Date afoFechainicio) {
		this.afoFechainicio = afoFechainicio;
	}

	public String getAfoFrecuenciarecoleccion() {
		return afoFrecuenciarecoleccion;
	}

	public void setAfoFrecuenciarecoleccion(String afoFrecuenciarecoleccion) {
		this.afoFrecuenciarecoleccion = afoFrecuenciarecoleccion;
	}

	public Integer getAfoIdeafopadre() {
		return afoIdeafopadre;
	}

	public void setAfoIdeafopadre(Integer afoIdeafopadre) {
		this.afoIdeafopadre = afoIdeafopadre;
	}

	public String getAfoNumpqr() {
		return afoNumpqr;
	}

	public void setAfoNumpqr(String afoNumpqr) {
		this.afoNumpqr = afoNumpqr;
	}

	public String getAfoObservaciones() {
		return afoObservaciones;
	}

	public void setAfoObservaciones(String afoObservaciones) {
		this.afoObservaciones = afoObservaciones;
	}

	public Integer getBarrioIderegistro() {
		return barrioIderegistro;
	}

	public void setBarrioIderegistro(Integer barrioIderegistro) {
		this.barrioIderegistro = barrioIderegistro;
	}

	public BigDecimal getMafvFactor() {
		return mafvFactor;
	}

	public void setMafvFactor(BigDecimal mafvFactor) {
		this.mafvFactor = mafvFactor;
	}

	public Integer getRureIderegistro() {
		return rureIderegistro;
	}

	public void setRureIderegistro(Integer rureIderegistro) {
		this.rureIderegistro = rureIderegistro;
	}

	public Integer getTerAforador() {
		return terAforador;
	}

	public void setTerAforador(Integer terAforador) {
		this.terAforador = terAforador;
	}

	public Integer getTfdIderegistro() {
		return tfdIderegistro;
	}

	public void setTfdIderegistro(Integer tfdIderegistro) {
		this.tfdIderegistro = tfdIderegistro;
	}

	public Integer getUniClasesuscripcionaforo() {
		return uniClasesuscripcionaforo;
	}

	public void setUniClasesuscripcionaforo(Integer uniClasesuscripcionaforo) {
		this.uniClasesuscripcionaforo = uniClasesuscripcionaforo;
	}

	public Integer getUniComplemento() {
		return uniComplemento;
	}

	public void setUniComplemento(Integer uniComplemento) {
		this.uniComplemento = uniComplemento;
	}

	public Integer getUniTipoaforo() {
		return uniTipoaforo;
	}

	public void setUniTipoaforo(Integer uniTipoaforo) {
		this.uniTipoaforo = uniTipoaforo;
	}

	public Integer getUniTipogenerador() {
		return uniTipogenerador;
	}

	public void setUniTipogenerador(Integer uniTipogenerador) {
		this.uniTipogenerador = uniTipogenerador;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((afoCantidadfrecuenciarecoleccion == null) ? 0 : afoCantidadfrecuenciarecoleccion.hashCode());
		result = prime * result + ((afoEstado == null) ? 0 : afoEstado.hashCode());
		result = prime * result + ((afoFecha == null) ? 0 : afoFecha.hashCode());
		result = prime * result + ((afoFechaactualizacion == null) ? 0 : afoFechaactualizacion.hashCode());
		result = prime * result + ((afoFechafinvegencia == null) ? 0 : afoFechafinvegencia.hashCode());
		result = prime * result + ((afoFechainicio == null) ? 0 : afoFechainicio.hashCode());
		result = prime * result + ((afoFrecuenciarecoleccion == null) ? 0 : afoFrecuenciarecoleccion.hashCode());
		result = prime * result + ((afoIdeafopadre == null) ? 0 : afoIdeafopadre.hashCode());
		result = prime * result + ((afoIderegistro == null) ? 0 : afoIderegistro.hashCode());
		result = prime * result + ((afoNumpqr == null) ? 0 : afoNumpqr.hashCode());
		result = prime * result + ((afoObservaciones == null) ? 0 : afoObservaciones.hashCode());
		result = prime * result + ((barrioIderegistro == null) ? 0 : barrioIderegistro.hashCode());
		result = prime * result + ((mafvFactor == null) ? 0 : mafvFactor.hashCode());
		result = prime * result + ((rureIderegistro == null) ? 0 : rureIderegistro.hashCode());
		result = prime * result + ((terAforador == null) ? 0 : terAforador.hashCode());
		result = prime * result + ((tfdIderegistro == null) ? 0 : tfdIderegistro.hashCode());
		result = prime * result + ((uniClasesuscripcionaforo == null) ? 0 : uniClasesuscripcionaforo.hashCode());
		result = prime * result + ((uniComplemento == null) ? 0 : uniComplemento.hashCode());
		result = prime * result + ((uniTipoaforo == null) ? 0 : uniTipoaforo.hashCode());
		result = prime * result + ((uniTipogenerador == null) ? 0 : uniTipogenerador.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
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
		AfoAforoDTO other = (AfoAforoDTO) obj;
		if (afoCantidadfrecuenciarecoleccion == null) {
			if (other.afoCantidadfrecuenciarecoleccion != null)
				return false;
		} else if (!afoCantidadfrecuenciarecoleccion.equals(other.afoCantidadfrecuenciarecoleccion))
			return false;
		if (afoEstado == null) {
			if (other.afoEstado != null)
				return false;
		} else if (!afoEstado.equals(other.afoEstado))
			return false;
		if (afoFecha == null) {
			if (other.afoFecha != null)
				return false;
		} else if (!afoFecha.equals(other.afoFecha))
			return false;
		if (afoFechaactualizacion == null) {
			if (other.afoFechaactualizacion != null)
				return false;
		} else if (!afoFechaactualizacion.equals(other.afoFechaactualizacion))
			return false;
		if (afoFechafinvegencia == null) {
			if (other.afoFechafinvegencia != null)
				return false;
		} else if (!afoFechafinvegencia.equals(other.afoFechafinvegencia))
			return false;
		if (afoFechainicio == null) {
			if (other.afoFechainicio != null)
				return false;
		} else if (!afoFechainicio.equals(other.afoFechainicio))
			return false;
		if (afoFrecuenciarecoleccion == null) {
			if (other.afoFrecuenciarecoleccion != null)
				return false;
		} else if (!afoFrecuenciarecoleccion.equals(other.afoFrecuenciarecoleccion))
			return false;
		if (afoIdeafopadre == null) {
			if (other.afoIdeafopadre != null)
				return false;
		} else if (!afoIdeafopadre.equals(other.afoIdeafopadre))
			return false;
		if (afoIderegistro == null) {
			if (other.afoIderegistro != null)
				return false;
		} else if (!afoIderegistro.equals(other.afoIderegistro))
			return false;
		if (afoNumpqr == null) {
			if (other.afoNumpqr != null)
				return false;
		} else if (!afoNumpqr.equals(other.afoNumpqr))
			return false;
		if (afoObservaciones == null) {
			if (other.afoObservaciones != null)
				return false;
		} else if (!afoObservaciones.equals(other.afoObservaciones))
			return false;
		if (barrioIderegistro == null) {
			if (other.barrioIderegistro != null)
				return false;
		} else if (!barrioIderegistro.equals(other.barrioIderegistro))
			return false;
		if (mafvFactor == null) {
			if (other.mafvFactor != null)
				return false;
		} else if (!mafvFactor.equals(other.mafvFactor))
			return false;
		if (rureIderegistro == null) {
			if (other.rureIderegistro != null)
				return false;
		} else if (!rureIderegistro.equals(other.rureIderegistro))
			return false;
		if (terAforador == null) {
			if (other.terAforador != null)
				return false;
		} else if (!terAforador.equals(other.terAforador))
			return false;
		if (tfdIderegistro == null) {
			if (other.tfdIderegistro != null)
				return false;
		} else if (!tfdIderegistro.equals(other.tfdIderegistro))
			return false;
		if (uniClasesuscripcionaforo == null) {
			if (other.uniClasesuscripcionaforo != null)
				return false;
		} else if (!uniClasesuscripcionaforo.equals(other.uniClasesuscripcionaforo))
			return false;
		if (uniComplemento == null) {
			if (other.uniComplemento != null)
				return false;
		} else if (!uniComplemento.equals(other.uniComplemento))
			return false;
		if (uniTipoaforo == null) {
			if (other.uniTipoaforo != null)
				return false;
		} else if (!uniTipoaforo.equals(other.uniTipoaforo))
			return false;
		if (uniTipogenerador == null) {
			if (other.uniTipogenerador != null)
				return false;
		} else if (!uniTipogenerador.equals(other.uniTipogenerador))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
