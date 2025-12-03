package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ConsultaDetalleSuscripcionDTO implements Serializable {

	private Long idSuscripcion;
	private String codigo;
	private String estado;
	private String tipoUso;
	private Short estrato;
	private String nombreCompletoTercero;
	private String documentoTercero;
	private String direccion;
	private String barrio;
	private String catastral;
	private String ciclo;
	private Long facNumero;
	private String perNombre;
	private BigDecimal estratoAnterior;
	private String tipoUsoAnterior;
	private Boolean disabled;
	private BigDecimal tafnaFactura;
	private BigDecimal tafnaExtraOrdinario;
	private BigDecimal valorEmitidoFactura;
	private BigDecimal valorAAjustar;
	private Double saldoEmitido;
	private String estadoSuscripcion;

	public ConsultaDetalleSuscripcionDTO() {
		super();
	}

	/**
	 * Constructor del objeto para recibir el resultado de la consultad e facturas
	 * para la nota de adición o eliminación de deuda
	 * 
	 * @param idSuscripcion
	 * @param codigo
	 * @param estado
	 * @param tipoUso
	 * @param estrato
	 * @param nombreCompletoTercero
	 * @param documentoTercero
	 * @param direccion
	 * @param barrio
	 * @param catastral
	 * @param ciclo
	 * @param facNumero
	 * @param perNombre
	 * @param valorEmitidoFactura
	 * @param valorAAjustar
	 * @param saldoEmitido
	 * @param estadoSuscripcion
	 */
	public ConsultaDetalleSuscripcionDTO(Long idSuscripcion, String codigo, Long facNumero, String perNombre,
			Short estrato, String estado, String tipoUso, String nombreCompletoTercero, String documentoTercero,
			String direccion, String barrio, String catastral, String ciclo, BigDecimal valorEmitidoFactura,
			BigDecimal valorAAjustar, Double saldoEmitido, String estadoSuscripcion) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.codigo = codigo;
		this.estado = estado;
		this.tipoUso = tipoUso;
		this.estrato = estrato;
		this.nombreCompletoTercero = nombreCompletoTercero;
		this.documentoTercero = documentoTercero;
		this.direccion = direccion;
		this.barrio = barrio;
		this.catastral = catastral;
		this.ciclo = ciclo;
		this.facNumero = facNumero;
		this.perNombre = perNombre;
		this.valorEmitidoFactura = valorEmitidoFactura;
		this.valorAAjustar = valorAAjustar;
		this.saldoEmitido = saldoEmitido;
		this.estadoSuscripcion = estadoSuscripcion;
	}

	/**
	 * Constructor creado para recibir la respuesta de la consulta de facturas
	 * aforadas
	 * 
	 * @param idSuscripcion
	 * @param codigo
	 * @param estado
	 * @param tipoUso
	 * @param estrato
	 * @param nombreCompletoTercero
	 * @param documentoTercero
	 * @param direccion
	 * @param barrio
	 * @param catastral
	 * @param ciclo
	 * @param facNumero
	 * @param perNombre
	 * @param tafnaFactura
	 * @param tafnaExtraOrdinario
	 */
	public ConsultaDetalleSuscripcionDTO(Long idSuscripcion, String codigo, Long facNumero, String perNombre,
			BigDecimal tafnaFactura, Short estrato, String estado, String tipoUso, String nombreCompletoTercero,
			String documentoTercero, String direccion, String barrio, String catastral, String ciclo) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.codigo = codigo;
		this.estado = estado;
		this.tipoUso = tipoUso;
		this.estrato = estrato;
		this.nombreCompletoTercero = nombreCompletoTercero;
		this.documentoTercero = documentoTercero;
		this.direccion = direccion;
		this.barrio = barrio;
		this.catastral = catastral;
		this.ciclo = ciclo;
		this.facNumero = facNumero;
		this.perNombre = perNombre;
		this.tafnaFactura = tafnaFactura;
	}

	@JsonProperty("tafnaFactura")
	public BigDecimal getTafnaFactura() {
		return tafnaFactura;
	}

	@JsonProperty("tafnaFactura")
	public void setTafnaFactura(BigDecimal tafnaFactura) {
		this.tafnaFactura = tafnaFactura;
	}

	@JsonProperty("tafnaExtraOrdinario")
	public BigDecimal getTafnaExtraOrdinario() {
		return tafnaExtraOrdinario;
	}

	@JsonProperty("tafnaExtraOrdinario")
	public void setTafnaExtraOrdinario(BigDecimal tafnaExtraOrdinario) {
		this.tafnaExtraOrdinario = tafnaExtraOrdinario;
	}

	@JsonProperty("idSuscripcion")
	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("codigo")
	public String getCodigo() {
		return codigo;
	}

	@JsonProperty("codigo")
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	@JsonProperty("estado")
	public String getEstado() {
		return estado;
	}

	@JsonProperty("estado")
	public void setEstado(String estado) {
		this.estado = estado;
	}

	@JsonProperty("tipoUso")
	public String getTipoUso() {
		return tipoUso;
	}

	@JsonProperty("tipoUso")
	public void setTipoUso(String tipoUso) {
		this.tipoUso = tipoUso;
	}

	@JsonProperty("estrato")
	public Short getEstrato() {
		return estrato;
	}

	@JsonProperty("estrato")
	public void setEstrato(Short estrato) {
		this.estrato = estrato;
	}

	@JsonProperty("nombreCompletoTercero")
	public String getNombreCompletoTercero() {
		return nombreCompletoTercero;
	}

	@JsonProperty("nombreCompletoTercero")
	public void setNombreCompletoTercero(String nombreCompletoTercero) {
		this.nombreCompletoTercero = nombreCompletoTercero;
	}

	@JsonProperty("documentoTercero")
	public String getDocumentoTercero() {
		return documentoTercero;
	}

	@JsonProperty("documentoTercero")
	public void setDocumentoTercero(String documentoTercero) {
		this.documentoTercero = documentoTercero;
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

	@JsonProperty("catastral")
	public String getCatastral() {
		return catastral;
	}

	@JsonProperty("catastral")
	public void setCatastral(String catastral) {
		this.catastral = catastral;
	}

	@JsonProperty("ciclo")
	public String getCiclo() {
		return ciclo;
	}

	@JsonProperty("ciclo")
	public void setCiclo(String ciclo) {
		this.ciclo = ciclo;
	}

	@JsonProperty("facNumero")
	public Long getFacNumero() {
		return facNumero;
	}

	@JsonProperty("facNumero")
	public void setFacNumero(Long facNumero) {
		this.facNumero = facNumero;
	}

	@JsonProperty("perNombre")
	public String getPerNombre() {
		return perNombre;
	}

	@JsonProperty("perNombre")
	public void setPerNombre(String perNombre) {
		this.perNombre = perNombre;
	}

	@JsonProperty("estratoAnterior")
	public BigDecimal getEstratoAnterior() {
		return estratoAnterior;
	}

	@JsonProperty("estratoAnterior")
	public void setEstratoAnterior(BigDecimal estratoAnterior) {
		this.estratoAnterior = estratoAnterior;
	}

	@JsonProperty("tipoUsoAnterior")
	public String getTipoUsoAnterior() {
		return tipoUsoAnterior;
	}

	@JsonProperty("tipoUsoAnterior")
	public void setTipoUsoAnterior(String tipoUsoAnterior) {
		this.tipoUsoAnterior = tipoUsoAnterior;
	}

	@JsonProperty("disabled")
	public Boolean getDisabled() {
		return disabled;
	}

	@JsonProperty("disabled")
	public void setDisabled(Boolean disabled) {
		this.disabled = disabled;
	}

	@JsonProperty("valorEmitidoFactura")
	public BigDecimal getValorEmitidoFactura() {
		return valorEmitidoFactura;
	}

	@JsonProperty("valorEmitidoFactura")
	public void setValorEmitidoFactura(BigDecimal valorEmitidoFactura) {
		this.valorEmitidoFactura = valorEmitidoFactura;
	}

	@JsonProperty("valorAAjustar")
	public BigDecimal getValorAAjustar() {
		return valorAAjustar;
	}

	@JsonProperty("valorAAjustar")
	public void setValorAAjustar(BigDecimal valorAAjustar) {
		this.valorAAjustar = valorAAjustar;
	}

	@JsonProperty("saldoEmitido")
	public Double getSaldoEmitido() {
		return saldoEmitido;
	}

	@JsonProperty("saldoEmitido")
	public void setSaldoEmitido(Double saldoEmitido) {
		this.saldoEmitido = saldoEmitido;
	}

	@JsonProperty("estadoSuscripcion")
	public String getEstadoSuscripcion() {
		return estadoSuscripcion;
	}

	@JsonProperty("estadoSuscripcion")
	public void setEstadoSuscripcion(String estadoSuscripcion) {
		this.estadoSuscripcion = estadoSuscripcion;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((barrio == null) ? 0 : barrio.hashCode());
		result = prime * result + ((catastral == null) ? 0 : catastral.hashCode());
		result = prime * result + ((ciclo == null) ? 0 : ciclo.hashCode());
		result = prime * result + ((codigo == null) ? 0 : codigo.hashCode());
		result = prime * result + ((direccion == null) ? 0 : direccion.hashCode());
		result = prime * result + ((disabled == null) ? 0 : disabled.hashCode());
		result = prime * result + ((documentoTercero == null) ? 0 : documentoTercero.hashCode());
		result = prime * result + ((estado == null) ? 0 : estado.hashCode());
		result = prime * result + ((estadoSuscripcion == null) ? 0 : estadoSuscripcion.hashCode());
		result = prime * result + ((estrato == null) ? 0 : estrato.hashCode());
		result = prime * result + ((estratoAnterior == null) ? 0 : estratoAnterior.hashCode());
		result = prime * result + ((facNumero == null) ? 0 : facNumero.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((nombreCompletoTercero == null) ? 0 : nombreCompletoTercero.hashCode());
		result = prime * result + ((perNombre == null) ? 0 : perNombre.hashCode());
		result = prime * result + ((saldoEmitido == null) ? 0 : saldoEmitido.hashCode());
		result = prime * result + ((tafnaExtraOrdinario == null) ? 0 : tafnaExtraOrdinario.hashCode());
		result = prime * result + ((tafnaFactura == null) ? 0 : tafnaFactura.hashCode());
		result = prime * result + ((tipoUso == null) ? 0 : tipoUso.hashCode());
		result = prime * result + ((tipoUsoAnterior == null) ? 0 : tipoUsoAnterior.hashCode());
		result = prime * result + ((valorAAjustar == null) ? 0 : valorAAjustar.hashCode());
		result = prime * result + ((valorEmitidoFactura == null) ? 0 : valorEmitidoFactura.hashCode());
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
		ConsultaDetalleSuscripcionDTO other = (ConsultaDetalleSuscripcionDTO) obj;
		if (barrio == null) {
			if (other.barrio != null)
				return false;
		} else if (!barrio.equals(other.barrio))
			return false;
		if (catastral == null) {
			if (other.catastral != null)
				return false;
		} else if (!catastral.equals(other.catastral))
			return false;
		if (ciclo == null) {
			if (other.ciclo != null)
				return false;
		} else if (!ciclo.equals(other.ciclo))
			return false;
		if (codigo == null) {
			if (other.codigo != null)
				return false;
		} else if (!codigo.equals(other.codigo))
			return false;
		if (direccion == null) {
			if (other.direccion != null)
				return false;
		} else if (!direccion.equals(other.direccion))
			return false;
		if (disabled == null) {
			if (other.disabled != null)
				return false;
		} else if (!disabled.equals(other.disabled))
			return false;
		if (documentoTercero == null) {
			if (other.documentoTercero != null)
				return false;
		} else if (!documentoTercero.equals(other.documentoTercero))
			return false;
		if (estado == null) {
			if (other.estado != null)
				return false;
		} else if (!estado.equals(other.estado))
			return false;
		if (estadoSuscripcion == null) {
			if (other.estadoSuscripcion != null)
				return false;
		} else if (!estadoSuscripcion.equals(other.estadoSuscripcion))
			return false;
		if (estrato == null) {
			if (other.estrato != null)
				return false;
		} else if (!estrato.equals(other.estrato))
			return false;
		if (estratoAnterior == null) {
			if (other.estratoAnterior != null)
				return false;
		} else if (!estratoAnterior.equals(other.estratoAnterior))
			return false;
		if (facNumero == null) {
			if (other.facNumero != null)
				return false;
		} else if (!facNumero.equals(other.facNumero))
			return false;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (nombreCompletoTercero == null) {
			if (other.nombreCompletoTercero != null)
				return false;
		} else if (!nombreCompletoTercero.equals(other.nombreCompletoTercero))
			return false;
		if (perNombre == null) {
			if (other.perNombre != null)
				return false;
		} else if (!perNombre.equals(other.perNombre))
			return false;
		if (saldoEmitido == null) {
			if (other.saldoEmitido != null)
				return false;
		} else if (!saldoEmitido.equals(other.saldoEmitido))
			return false;
		if (tafnaExtraOrdinario == null) {
			if (other.tafnaExtraOrdinario != null)
				return false;
		} else if (!tafnaExtraOrdinario.equals(other.tafnaExtraOrdinario))
			return false;
		if (tafnaFactura == null) {
			if (other.tafnaFactura != null)
				return false;
		} else if (!tafnaFactura.equals(other.tafnaFactura))
			return false;
		if (tipoUso == null) {
			if (other.tipoUso != null)
				return false;
		} else if (!tipoUso.equals(other.tipoUso))
			return false;
		if (tipoUsoAnterior == null) {
			if (other.tipoUsoAnterior != null)
				return false;
		} else if (!tipoUsoAnterior.equals(other.tipoUsoAnterior))
			return false;
		if (valorAAjustar == null) {
			if (other.valorAAjustar != null)
				return false;
		} else if (!valorAAjustar.equals(other.valorAAjustar))
			return false;
		if (valorEmitidoFactura == null) {
			if (other.valorEmitidoFactura != null)
				return false;
		} else if (!valorEmitidoFactura.equals(other.valorEmitidoFactura))
			return false;
		return true;
	}

}
