package com.bioagricola.apirest.modelo.dtos;

public class RespuestaMarcacionTarifaDTO {

	private long idSuscripcion;
	private String tipoUso;
	private String codigoAnterior;
	private String periodoDesde;
	private String periodoHasta;
	private String ciclo;
	private String empresaAlterna;
	private short estrato;
	private String accionDeMarcacion;

	public RespuestaMarcacionTarifaDTO() {
		super();
	}

	public RespuestaMarcacionTarifaDTO(long idSuscripcion, String tipoUso, String codigoAnterior, String ciclo, String empresaAlterna, short estrato) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.tipoUso = tipoUso;
		this.codigoAnterior = codigoAnterior;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.estrato = estrato;
	}

	public String getAccionDeMarcacion() {
		return accionDeMarcacion;
	}

	public void setAccionDeMarcacion(String accionDeMarcacion) {
		this.accionDeMarcacion = accionDeMarcacion;
	}

	public long getIdSuscripcion() {
		return idSuscripcion;
	}

	public void setIdSuscripcion(long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	public String getTipoUso() {
		return tipoUso;
	}

	public void setTipoUso(String tipoUso) {
		this.tipoUso = tipoUso;
	}

	public String getCodigoAnterior() {
		return codigoAnterior;
	}

	public void setCodigoAnterior(String codigoAnterior) {
		this.codigoAnterior = codigoAnterior;
	}

	public String getPeriodoDesde() {
		return periodoDesde;
	}

	public void setPeriodoDesde(String periodoDesde) {
		this.periodoDesde = periodoDesde;
	}

	public String getPeriodoHasta() {
		return periodoHasta;
	}

	public void setPeriodoHasta(String periodoHasta) {
		this.periodoHasta = periodoHasta;
	}

	public String getCiclo() {
		return ciclo;
	}

	public void setCiclo(String ciclo) {
		this.ciclo = ciclo;
	}

	public String getEmpresaAlterna() {
		return empresaAlterna;
	}

	public void setEmpresaAlterna(String empresaAlterna) {
		this.empresaAlterna = empresaAlterna;
	}

	public short getEstrato() {
		return estrato;
	}

	public void setEstrato(short estrato) {
		this.estrato = estrato;
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
		RespuestaMarcacionTarifaDTO other = (RespuestaMarcacionTarifaDTO) obj;
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
		if (tipoUso == null) {
			if (other.tipoUso != null)
				return false;
		} else if (!tipoUso.equals(other.tipoUso))
			return false;
		return true;
	}

	
}
