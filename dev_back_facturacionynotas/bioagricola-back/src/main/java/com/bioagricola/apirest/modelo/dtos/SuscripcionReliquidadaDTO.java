package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DAO que contiene la información de la entidad CicCicloDTO que se transmite
 * por los servicios REST. Solo se transmiten los atributos simples, es decir,
 * se omiten aquellos atributos que definen relaciones con otras entidades.
 * 
 * @author GeneradorCRUD
 */
@XmlRootElement
public class SuscripcionReliquidadaDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long idSuscripcion;
	private Long numeroFactura;
	private String tipoUso;
	private String tipoUsoAnterior;
	private String codigoAnterior;
	private String periodo;
	private String ciclo;
	private String empresaAlterna;
	private BigDecimal tarifaFinalFacturada;
	private BigDecimal tarifaFinalDescuento;
	private BigDecimal totalDescuento;
	private Short estrato;
	private BigDecimal estratoAnterior;
	private String nombreTercero; 
	private String documentoTercero; 
	private String direccion; 
	private String barrio;
	private String catastral;
	private String eliminaCod; 
	private BigDecimal valorEmitido;
	private BigDecimal valorAjustar; 
	private BigDecimal saldoElimina;
	private BigDecimal saldoAdiciona;

	public SuscripcionReliquidadaDTO() {

	}

	/**
	 * Constructor para las consultas de suscripciones reliquidadas por descuento de deshabitado y puerta a puerta
	 * 
	 * @param idSuscripcion
	 * @param numeroFactura
	 * @param tipoUso
	 * @param codigoAnterior
	 * @param periodo
	 * @param ciclo
	 * @param empresaAlterna
	 * @param tarifaFinalFacturada
	 * @param tarifaFinalDescuento
	 * @param totalDescuento
	 */
	public SuscripcionReliquidadaDTO(Long idSuscripcion, Long numeroFactura, String tipoUso, String codigoAnterior,
			String periodo, String ciclo, String empresaAlterna, BigDecimal tarifaFinalFacturada,
			BigDecimal tarifaFinalDescuento, BigDecimal totalDescuento) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.numeroFactura = numeroFactura;
		this.tipoUso = tipoUso;
		this.codigoAnterior = codigoAnterior;
		this.periodo = periodo;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.tarifaFinalFacturada = tarifaFinalFacturada;
		this.tarifaFinalDescuento = tarifaFinalDescuento;
		this.totalDescuento = totalDescuento;
	}

	/**
	 * Constructor para las consultas de suscripciones reliquidadas por estrato
	 * 
	 * @param idSuscripcion
	 * @param numeroFactura
	 * @param tipoUso
	 * @param estrato
	 * @param estratoAnterior
	 * @param codigoAnterior
	 * @param periodo
	 * @param ciclo
	 * @param empresaAlterna
	 * @param tarifaFinalFacturada
	 * @param tarifaFinalDescuento
	 * @param totalDescuento
	 */
	public SuscripcionReliquidadaDTO(Long idSuscripcion, Long numeroFactura, String tipoUso, Short estrato,
			BigDecimal estratoAnterior, String codigoAnterior, String periodo, String ciclo, String empresaAlterna,
			BigDecimal tarifaFinalFacturada, BigDecimal tarifaFinalDescuento, BigDecimal totalDescuento) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.numeroFactura = numeroFactura;
		this.tipoUso = tipoUso;
		this.codigoAnterior = codigoAnterior;
		this.periodo = periodo;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.tarifaFinalFacturada = tarifaFinalFacturada;
		this.tarifaFinalDescuento = tarifaFinalDescuento;
		this.totalDescuento = totalDescuento;
		this.estrato = estrato;
		this.estratoAnterior = estratoAnterior;
	}
	
	/**
	 * Constructor para las consultas de suscripciones reliquidadas por tipo de uso
	 * 
	 * @param idSuscripcion
	 * @param numeroFactura
	 * @param tipoUso
	 * @param tipoUsoAnterior
	 * @param codigoAnterior
	 * @param periodo
	 * @param ciclo
	 * @param empresaAlterna
	 * @param tarifaFinalFacturada
	 * @param tarifaFinalDescuento
	 * @param totalDescuento
	 */
	public SuscripcionReliquidadaDTO(Long idSuscripcion, Long numeroFactura, String tipoUso, String tipoUsoAnterior,
			String codigoAnterior, String periodo, String ciclo, String empresaAlterna, Short estrato, BigDecimal tarifaFinalFacturada,
			BigDecimal tarifaFinalDescuento, BigDecimal totalDescuento) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.numeroFactura = numeroFactura;
		this.tipoUso = tipoUso;
		this.tipoUsoAnterior = tipoUsoAnterior;
		this.codigoAnterior = codigoAnterior;
		this.periodo = periodo;
		this.ciclo = ciclo;
		this.empresaAlterna = empresaAlterna;
		this.estrato = estrato;
		this.tarifaFinalFacturada = tarifaFinalFacturada;
		this.tarifaFinalDescuento = tarifaFinalDescuento;
		this.totalDescuento = totalDescuento;
	}
	
	
	public SuscripcionReliquidadaDTO(Long idSuscripcion,String codigoAnterior,Long numeroFactura,String periodo,
			String nombreTercero, String documentoTercero, String direccion, String barrio, String catastral, String eliminaCod, BigDecimal valorEmitido,
			BigDecimal valorAjustar, BigDecimal saldoElimina, BigDecimal saldoAdiciona) {
		super();
		this.idSuscripcion = idSuscripcion;
		this.codigoAnterior = codigoAnterior;
		this.numeroFactura = numeroFactura;
		this.periodo = periodo;
		this.nombreTercero =  nombreTercero;
		this.documentoTercero = documentoTercero;
		this.direccion = direccion;
		this.barrio =  barrio;
		this.catastral = catastral;
		this.eliminaCod =  eliminaCod; 
		this.valorEmitido =  valorEmitido;
		this.valorAjustar = valorAjustar; 
		this.saldoElimina = saldoElimina;
		this.saldoAdiciona =  saldoAdiciona;

	}

	public String getNombreTercero() {
		return nombreTercero;
	}

	public void setNombreTercero(String nombreTercero) {
		this.nombreTercero = nombreTercero;
	}

	public String getDocumentoTercero() {
		return documentoTercero;
	}

	public void setDocumentoTercero(String documentoTercero) {
		this.documentoTercero = documentoTercero;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getBarrio() {
		return barrio;
	}

	public void setBarrio(String barrio) {
		this.barrio = barrio;
	}

	public String getCatastral() {
		return catastral;
	}

	public void setCatastral(String catastral) {
		this.catastral = catastral;
	}

	public String getEliminaCod() {
		return eliminaCod;
	}

	public void setEliminaCod(String eliminaCod) {
		this.eliminaCod = eliminaCod;
	}

	public BigDecimal getValorEmitido() {
		return valorEmitido;
	}

	public void setValorEmitido(BigDecimal valorEmitido) {
		this.valorEmitido = valorEmitido;
	}

	public BigDecimal getValorAjustar() {
		return valorAjustar;
	}

	public void setValorAjustar(BigDecimal valorAjustar) {
		this.valorAjustar = valorAjustar;
	}

	public BigDecimal getSaldoElimina() {
		return saldoElimina;
	}

	public void setSaldoElimina(BigDecimal saldoElimina) {
		this.saldoElimina = saldoElimina;
	}

	public BigDecimal getSaldoAdiciona() {
		return saldoAdiciona;
	}

	public void setSaldoAdiciona(BigDecimal saldoAdiciona) {
		this.saldoAdiciona = saldoAdiciona;
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

	@JsonProperty("periodo")
	public String getPeriodo() {
		return periodo;
	}

	@JsonProperty("periodo")
	public void setPeriodo(String periodo) {
		this.periodo = periodo;
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

	@JsonProperty("tarifaFinalFacturada")
	public BigDecimal getTarifaFinalFacturada() {
		return tarifaFinalFacturada;
	}

	@JsonProperty("tarifaFinalFacturada")
	public void setTarifaFinalFacturada(BigDecimal tarifaFinalFacturada) {
		this.tarifaFinalFacturada = tarifaFinalFacturada;
	}

	@JsonProperty("tarifaFinalDescuento")
	public BigDecimal getTarifaFinalDescuento() {
		return tarifaFinalDescuento;
	}

	@JsonProperty("tarifaFinalDescuento")
	public void setTarifaFinalDescuento(BigDecimal tarifaFinalDescuento) {
		this.tarifaFinalDescuento = tarifaFinalDescuento;
	}

	@JsonProperty("totalDescuento")
	public BigDecimal getTotalDescuento() {
		return totalDescuento;
	}

	@JsonProperty("totalDescuento")
	public void setTotalDescuento(BigDecimal totalDescuento) {
		this.totalDescuento = totalDescuento;
	}

	@JsonProperty("estrato")
	public Short getEstrato() {
		return estrato;
	}

	@JsonProperty("estrato")
	public void setEstrato(Short estrato) {
		this.estrato = estrato;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((barrio == null) ? 0 : barrio.hashCode());
		result = prime * result + ((catastral == null) ? 0 : catastral.hashCode());
		result = prime * result + ((ciclo == null) ? 0 : ciclo.hashCode());
		result = prime * result + ((codigoAnterior == null) ? 0 : codigoAnterior.hashCode());
		result = prime * result + ((direccion == null) ? 0 : direccion.hashCode());
		result = prime * result + ((documentoTercero == null) ? 0 : documentoTercero.hashCode());
		result = prime * result + ((eliminaCod == null) ? 0 : eliminaCod.hashCode());
		result = prime * result + ((empresaAlterna == null) ? 0 : empresaAlterna.hashCode());
		result = prime * result + ((estrato == null) ? 0 : estrato.hashCode());
		result = prime * result + ((estratoAnterior == null) ? 0 : estratoAnterior.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((nombreTercero == null) ? 0 : nombreTercero.hashCode());
		result = prime * result + ((numeroFactura == null) ? 0 : numeroFactura.hashCode());
		result = prime * result + ((periodo == null) ? 0 : periodo.hashCode());
		result = prime * result + ((saldoAdiciona == null) ? 0 : saldoAdiciona.hashCode());
		result = prime * result + ((saldoElimina == null) ? 0 : saldoElimina.hashCode());
		result = prime * result + ((tarifaFinalDescuento == null) ? 0 : tarifaFinalDescuento.hashCode());
		result = prime * result + ((tarifaFinalFacturada == null) ? 0 : tarifaFinalFacturada.hashCode());
		result = prime * result + ((tipoUso == null) ? 0 : tipoUso.hashCode());
		result = prime * result + ((tipoUsoAnterior == null) ? 0 : tipoUsoAnterior.hashCode());
		result = prime * result + ((totalDescuento == null) ? 0 : totalDescuento.hashCode());
		result = prime * result + ((valorAjustar == null) ? 0 : valorAjustar.hashCode());
		result = prime * result + ((valorEmitido == null) ? 0 : valorEmitido.hashCode());
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
		SuscripcionReliquidadaDTO other = (SuscripcionReliquidadaDTO) obj;
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
		if (documentoTercero == null) {
			if (other.documentoTercero != null)
				return false;
		} else if (!documentoTercero.equals(other.documentoTercero))
			return false;
		if (eliminaCod == null) {
			if (other.eliminaCod != null)
				return false;
		} else if (!eliminaCod.equals(other.eliminaCod))
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
		if (estratoAnterior == null) {
			if (other.estratoAnterior != null)
				return false;
		} else if (!estratoAnterior.equals(other.estratoAnterior))
			return false;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (nombreTercero == null) {
			if (other.nombreTercero != null)
				return false;
		} else if (!nombreTercero.equals(other.nombreTercero))
			return false;
		if (numeroFactura == null) {
			if (other.numeroFactura != null)
				return false;
		} else if (!numeroFactura.equals(other.numeroFactura))
			return false;
		if (periodo == null) {
			if (other.periodo != null)
				return false;
		} else if (!periodo.equals(other.periodo))
			return false;
		if (saldoAdiciona == null) {
			if (other.saldoAdiciona != null)
				return false;
		} else if (!saldoAdiciona.equals(other.saldoAdiciona))
			return false;
		if (saldoElimina == null) {
			if (other.saldoElimina != null)
				return false;
		} else if (!saldoElimina.equals(other.saldoElimina))
			return false;
		if (tarifaFinalDescuento == null) {
			if (other.tarifaFinalDescuento != null)
				return false;
		} else if (!tarifaFinalDescuento.equals(other.tarifaFinalDescuento))
			return false;
		if (tarifaFinalFacturada == null) {
			if (other.tarifaFinalFacturada != null)
				return false;
		} else if (!tarifaFinalFacturada.equals(other.tarifaFinalFacturada))
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
		if (totalDescuento == null) {
			if (other.totalDescuento != null)
				return false;
		} else if (!totalDescuento.equals(other.totalDescuento))
			return false;
		if (valorAjustar == null) {
			if (other.valorAjustar != null)
				return false;
		} else if (!valorAjustar.equals(other.valorAjustar))
			return false;
		if (valorEmitido == null) {
			if (other.valorEmitido != null)
				return false;
		} else if (!valorEmitido.equals(other.valorEmitido))
			return false;
		return true;
	}

}
