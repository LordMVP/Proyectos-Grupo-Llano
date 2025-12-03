package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ReporteSuscripcionesReliquidadasDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long idSuscripcion;
	private Long numeroFactura;
	private String codigoAnterior;
	private String nombre;
	private String documento;
	private String direccion;
	private String barrio;
	private String periodoDeshabitado;
	private String ciclo;
	private String empresaAlterna;
	private Short estrato;
	private BigDecimal tarifaFinalDeshabitada;

	public ReporteSuscripcionesReliquidadasDTO() {

	}

	public ReporteSuscripcionesReliquidadasDTO(Long idSuscripcion, Long numeroFactura, String codigoAnterior,
			String nombre, String documento, String direccion, String barrio, String periodoDeshabitado, String ciclo,
			String empresaAlterna, Short estrato,  BigDecimal tarifaFinalDeshabitada) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.numeroFactura = numeroFactura;
		this.codigoAnterior = codigoAnterior;
		this.nombre = nombre;
		this.documento = documento;
		this.direccion = direccion;
		this.barrio = barrio;
		this.periodoDeshabitado = periodoDeshabitado;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.estrato = estrato;
		this.tarifaFinalDeshabitada = tarifaFinalDeshabitada;
	}

	@JsonProperty("idSuscripcion")
	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("numeroFactura")
	public Long getNumeroFactura() {
		return numeroFactura;
	}

	@JsonProperty("numeroFactura")
	public void setNumeroFactura(Long numeroFactura) {
		this.numeroFactura = numeroFactura;
	}

	@JsonProperty("codigoAnterior")
	public String getCodigoAnterior() {
		return codigoAnterior;
	}

	@JsonProperty("codigoAnterior")
	public void setCodigoAnterior(String codigoAnterior) {
		this.codigoAnterior = codigoAnterior;
	}

	@JsonProperty("nombre")
	public String getNombre() {
		return nombre;
	}

	@JsonProperty("nombre")
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	@JsonProperty("documento")
	public String getDocumento() {
		return documento;
	}

	@JsonProperty("documento")
	public void setDocumento(String documento) {
		this.documento = documento;
	}

	@JsonProperty("direccion")
	public String getDireccion() {
		return direccion;
	}

	@JsonProperty("direccion")
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	@JsonProperty("barrio")
	public String getBarrio() {
		return barrio;
	}

	@JsonProperty("barrio")
	public void setBarrio(String barrio) {
		this.barrio = barrio;
	}

	@JsonProperty("periodoDeshabitado")
	public String getPeriodoDeshabitado() {
		return periodoDeshabitado;
	}

	@JsonProperty("periodoDeshabitado")
	public void setPeriodoDeshabitado(String periodoDeshabitado) {
		this.periodoDeshabitado = periodoDeshabitado;
	}

	@JsonProperty("ciclo")
	public String getCiclo() {
		return ciclo;
	}

	@JsonProperty("ciclo")
	public void setCiclo(String ciclo) {
		this.ciclo = ciclo;
	}

	@JsonProperty("empresaAlterna")
	public String getEmpresaAlterna() {
		return empresaAlterna;
	}

	@JsonProperty("empresaAlterna")
	public void setEmpresaAlterna(String empresaAlterna) {
		this.empresaAlterna = empresaAlterna;
	}	

	@JsonProperty("estrato")
	public Short getEstrato() {
		return estrato;
	}

	@JsonProperty("estrato")
	public void setEstrato(Short estrato) {
		this.estrato = estrato;
	}

	@JsonProperty("tarifaFinalDeshabitada")
	public BigDecimal getTarifaFinalDeshabitada() {
		return tarifaFinalDeshabitada;
	}

	@JsonProperty("tarifaFinalDeshabitada")
	public void setTarifaFinalDeshabitada(BigDecimal tarifaFinalDeshabitada) {
		this.tarifaFinalDeshabitada = tarifaFinalDeshabitada;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((barrio == null) ? 0 : barrio.hashCode());
		result = prime * result + ((ciclo == null) ? 0 : ciclo.hashCode());
		result = prime * result + ((codigoAnterior == null) ? 0 : codigoAnterior.hashCode());
		result = prime * result + ((direccion == null) ? 0 : direccion.hashCode());
		result = prime * result + ((documento == null) ? 0 : documento.hashCode());
		result = prime * result + ((empresaAlterna == null) ? 0 : empresaAlterna.hashCode());
		result = prime * result + ((estrato == null) ? 0 : estrato.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((nombre == null) ? 0 : nombre.hashCode());
		result = prime * result + ((numeroFactura == null) ? 0 : numeroFactura.hashCode());
		result = prime * result + ((periodoDeshabitado == null) ? 0 : periodoDeshabitado.hashCode());
		result = prime * result + ((tarifaFinalDeshabitada == null) ? 0 : tarifaFinalDeshabitada.hashCode());
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
		ReporteSuscripcionesReliquidadasDTO other = (ReporteSuscripcionesReliquidadasDTO) obj;
		if (barrio == null) {
			if (other.barrio != null)
				return false;
		} else if (!barrio.equals(other.barrio))
			return false;
		if (ciclo == null) {
			if (other.ciclo != null)
				return false;
		} else if (!ciclo.equals(other.ciclo))
			return false;
		if (codigoAnterior == null) {
			if (other.codigoAnterior != null)
				return false;
		} else if (!codigoAnterior.equals(other.codigoAnterior))
			return false;
		if (direccion == null) {
			if (other.direccion != null)
				return false;
		} else if (!direccion.equals(other.direccion))
			return false;
		if (documento == null) {
			if (other.documento != null)
				return false;
		} else if (!documento.equals(other.documento))
			return false;
		if (empresaAlterna == null) {
			if (other.empresaAlterna != null)
				return false;
		} else if (!empresaAlterna.equals(other.empresaAlterna))
			return false;
		if (estrato == null) {
			if (other.estrato != null)
				return false;
		} else if (!estrato.equals(other.estrato))
			return false;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (nombre == null) {
			if (other.nombre != null)
				return false;
		} else if (!nombre.equals(other.nombre))
			return false;
		if (numeroFactura == null) {
			if (other.numeroFactura != null)
				return false;
		} else if (!numeroFactura.equals(other.numeroFactura))
			return false;
		if (periodoDeshabitado == null) {
			if (other.periodoDeshabitado != null)
				return false;
		} else if (!periodoDeshabitado.equals(other.periodoDeshabitado))
			return false;
		if (tarifaFinalDeshabitada == null) {
			if (other.tarifaFinalDeshabitada != null)
				return false;
		} else if (!tarifaFinalDeshabitada.equals(other.tarifaFinalDeshabitada))
			return false;
		return true;
	}

	
}
