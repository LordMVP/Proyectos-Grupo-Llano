package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class MarcacionTarifaDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long idSuscripcion;
	private String tipoUso;
	private String codigoAnterior;
	private String periodoDesde;
	private String periodoHasta;
	private String ciclo;
	private String empresaAlterna;
	private short estrato;
	private String accionDeMarcacion;
	private Boolean seCruza;

	public MarcacionTarifaDTO() {
		super();
	}

	public MarcacionTarifaDTO(long idSuscripcion, String tipoUso, String codigoAnterior, String ciclo,
			String empresaAlterna, short estrato) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.tipoUso = tipoUso;
		this.codigoAnterior = codigoAnterior;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.estrato = estrato;
	}

	@JsonProperty("idSuscripcion")
	public long getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("tipoUso")
	public String getTipoUso() {
		return tipoUso;
	}

	@JsonProperty("tipoUso")
	public void setTipoUso(String tipoUso) {
		this.tipoUso = tipoUso;
	}

	@JsonProperty("codigoAnterior")
	public String getCodigoAnterior() {
		return codigoAnterior;
	}

	@JsonProperty("codigoAnterior")
	public void setCodigoAnterior(String codigoAnterior) {
		this.codigoAnterior = codigoAnterior;
	}

	@JsonProperty("periodoDesde")
	public String getPeriodoDesde() {
		return periodoDesde;
	}

	@JsonProperty("periodoDesde")
	public void setPeriodoDesde(String periodoDesde) {
		this.periodoDesde = periodoDesde;
	}

	@JsonProperty("periodoHasta")
	public String getPeriodoHasta() {
		return periodoHasta;
	}

	@JsonProperty("periodoHasta")
	public void setPeriodoHasta(String periodoHasta) {
		this.periodoHasta = periodoHasta;
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
	public short getEstrato() {
		return estrato;
	}

	@JsonProperty("estrato")
	public void setEstrato(short estrato) {
		this.estrato = estrato;
	}

	@JsonProperty("accionDeMarcacion")
	public String getAccionDeMarcacion() {
		return accionDeMarcacion;
	}

	@JsonProperty("accionDeMarcacion")
	public void setAccionDeMarcacion(String accionDeMarcacion) {
		this.accionDeMarcacion = accionDeMarcacion;
	}
	
	@JsonProperty("seCruza")
	public Boolean getSeCruza() {
		return seCruza;
	}

	@JsonProperty("seCruza")
	public void setSeCruza(Boolean seCruza) {
		this.seCruza = seCruza;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accionDeMarcacion == null) ? 0 : accionDeMarcacion.hashCode());
		result = prime * result + ((ciclo == null) ? 0 : ciclo.hashCode());
		result = prime * result + ((codigoAnterior == null) ? 0 : codigoAnterior.hashCode());
		result = prime * result + ((empresaAlterna == null) ? 0 : empresaAlterna.hashCode());
		result = prime * result + estrato;
		result = prime * result + (int) (idSuscripcion ^ (idSuscripcion >>> 32));
		result = prime * result + ((periodoDesde == null) ? 0 : periodoDesde.hashCode());
		result = prime * result + ((periodoHasta == null) ? 0 : periodoHasta.hashCode());
		result = prime * result + ((seCruza == null) ? 0 : seCruza.hashCode());
		result = prime * result + ((tipoUso == null) ? 0 : tipoUso.hashCode());
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
		MarcacionTarifaDTO other = (MarcacionTarifaDTO) obj;
		if (accionDeMarcacion == null) {
			if (other.accionDeMarcacion != null)
				return false;
		} else if (!accionDeMarcacion.equals(other.accionDeMarcacion))
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
		if (empresaAlterna == null) {
			if (other.empresaAlterna != null)
				return false;
		} else if (!empresaAlterna.equals(other.empresaAlterna))
			return false;
		if (estrato != other.estrato)
			return false;
		if (idSuscripcion != other.idSuscripcion)
			return false;
		if (periodoDesde == null) {
			if (other.periodoDesde != null)
				return false;
		} else if (!periodoDesde.equals(other.periodoDesde))
			return false;
		if (periodoHasta == null) {
			if (other.periodoHasta != null)
				return false;
		} else if (!periodoHasta.equals(other.periodoHasta))
			return false;
		if (seCruza == null) {
			if (other.seCruza != null)
				return false;
		} else if (!seCruza.equals(other.seCruza))
			return false;
		if (tipoUso == null) {
			if (other.tipoUso != null)
				return false;
		} else if (!tipoUso.equals(other.tipoUso))
			return false;
		return true;
	}

}
