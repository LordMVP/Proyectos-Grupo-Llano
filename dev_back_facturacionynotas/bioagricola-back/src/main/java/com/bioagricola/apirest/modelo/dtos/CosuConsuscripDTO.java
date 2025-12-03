package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CosuConsuscrip que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class CosuConsuscripDTO implements Serializable {

	private Integer cosuIderegistr;

	private BigDecimal cosuCantidad;

	private String cosuEstado;

	private Timestamp cosuFecfinal;

	private Timestamp cosuFecinicio;

	private BigDecimal cosuVlrtotal;

	private BigDecimal cosuVlrunitari;

	private Integer uniConcepto;

	private Integer uniLiquidacion;

	private Integer usuIderegistro;

	// protected region atributos adicionales on begin
	// Escriba en esta sección sus modificaciones

	// protected region atributos adicionales end

	public CosuConsuscripDTO() {
		// protected region procedimientos adicionales de inicialización on begin
		// Escriba en esta sección sus modificaciones

		// protected region procedimientos adicionales de inicialización end
	}

	@JsonProperty("cosuIderegistr")
	public Integer getCosuIderegistr() {
		return cosuIderegistr;
	}

	@JsonProperty("cosuIderegistr")
	public void setCosuIderegistr(Integer cosuIderegistr) {
		this.cosuIderegistr = cosuIderegistr;
	}

	@JsonProperty("cosuCantidad")
	public BigDecimal getCosuCantidad() {
		return cosuCantidad;
	}

	@JsonProperty("cosuCantidad")
	public void setCosuCantidad(BigDecimal cosuCantidad) {
		this.cosuCantidad = cosuCantidad;
	}

	@JsonProperty("cosuEstado")
	public String getCosuEstado() {
		return cosuEstado;
	}

	@JsonProperty("cosuEstado")
	public void setCosuEstado(String cosuEstado) {
		this.cosuEstado = cosuEstado;
	}

	@JsonProperty("cosuFecfinal")
	public Timestamp getCosuFecfinal() {
		return cosuFecfinal;
	}

	@JsonProperty("cosuFecfinal")
	public void setCosuFecfinal(Timestamp cosuFecfinal) {
		this.cosuFecfinal = cosuFecfinal;
	}

	@JsonProperty("cosuFecinicio")
	public Timestamp getCosuFecinicio() {
		return cosuFecinicio;
	}

	@JsonProperty("cosuFecinicio")
	public void setCosuFecinicio(Timestamp cosuFecinicio) {
		this.cosuFecinicio = cosuFecinicio;
	}

	@JsonProperty("cosuVlrtotal")
	public BigDecimal getCosuVlrtotal() {
		return cosuVlrtotal;
	}

	@JsonProperty("cosuVlrtotal")
	public void setCosuVlrtotal(BigDecimal cosuVlrtotal) {
		this.cosuVlrtotal = cosuVlrtotal;
	}

	@JsonProperty("cosuVlrunitari")
	public BigDecimal getCosuVlrunitari() {
		return cosuVlrunitari;
	}

	@JsonProperty("cosuVlrunitari")
	public void setCosuVlrunitari(BigDecimal cosuVlrunitari) {
		this.cosuVlrunitari = cosuVlrunitari;
	}

	@JsonProperty("uniConcepto")
	public Integer getUniConcepto() {
		return uniConcepto;
	}

	@JsonProperty("uniConcepto")
	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	@JsonProperty("uniLiquidacion")
	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	@JsonProperty("uniLiquidacion")
	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	@JsonProperty("usuIderegistro")
	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	@JsonProperty("usuIderegistro")
	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cosuCantidad == null) ? 0 : cosuCantidad.hashCode());
		result = prime * result + ((cosuEstado == null) ? 0 : cosuEstado.hashCode());
		result = prime * result + ((cosuFecfinal == null) ? 0 : cosuFecfinal.hashCode());
		result = prime * result + ((cosuFecinicio == null) ? 0 : cosuFecinicio.hashCode());
		result = prime * result + ((cosuIderegistr == null) ? 0 : cosuIderegistr.hashCode());
		result = prime * result + ((cosuVlrtotal == null) ? 0 : cosuVlrtotal.hashCode());
		result = prime * result + ((cosuVlrunitari == null) ? 0 : cosuVlrunitari.hashCode());
		result = prime * result + ((uniConcepto == null) ? 0 : uniConcepto.hashCode());
		result = prime * result + ((uniLiquidacion == null) ? 0 : uniLiquidacion.hashCode());
		result = prime * result + ((usuIderegistro == null) ? 0 : usuIderegistro.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CosuConsuscripDTO other = (CosuConsuscripDTO) obj;
		if (cosuCantidad == null) {
			if (other.cosuCantidad != null)
				return false;
		} else if (!cosuCantidad.equals(other.cosuCantidad))
			return false;
		if (cosuEstado == null) {
			if (other.cosuEstado != null)
				return false;
		} else if (!cosuEstado.equals(other.cosuEstado))
			return false;
		if (cosuFecfinal == null) {
			if (other.cosuFecfinal != null)
				return false;
		} else if (!cosuFecfinal.equals(other.cosuFecfinal))
			return false;
		if (cosuFecinicio == null) {
			if (other.cosuFecinicio != null)
				return false;
		} else if (!cosuFecinicio.equals(other.cosuFecinicio))
			return false;
		if (cosuIderegistr == null) {
			if (other.cosuIderegistr != null)
				return false;
		} else if (!cosuIderegistr.equals(other.cosuIderegistr))
			return false;
		if (cosuVlrtotal == null) {
			if (other.cosuVlrtotal != null)
				return false;
		} else if (!cosuVlrtotal.equals(other.cosuVlrtotal))
			return false;
		if (cosuVlrunitari == null) {
			if (other.cosuVlrunitari != null)
				return false;
		} else if (!cosuVlrunitari.equals(other.cosuVlrunitari))
			return false;
		if (uniConcepto == null) {
			if (other.uniConcepto != null)
				return false;
		} else if (!uniConcepto.equals(other.uniConcepto))
			return false;
		if (uniLiquidacion == null) {
			if (other.uniLiquidacion != null)
				return false;
		} else if (!uniLiquidacion.equals(other.uniLiquidacion))
			return false;
		if (usuIderegistro == null) {
			if (other.usuIderegistro != null)
				return false;
		} else if (!usuIderegistro.equals(other.usuIderegistro))
			return false;
		return true;
	}

}
