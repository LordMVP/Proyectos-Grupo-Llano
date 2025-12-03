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
public class ConceptoSuscripcionReliquidadaDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String nombreConcepto;
	private BigDecimal tarifaFinalFacturada;
	private BigDecimal tarifaFinalDescuento;
	private BigDecimal totalDescuento;
	private Long idSuscripcion;
	private String periodo;
	private String nombreTercero;
	private String documentoTercero;
	private String direccion;
	private String documento;
	private String tipoDocumento;
	private Integer idConcepto;
	private String codigoAnterior;
	private Long idDetalle;
	private BigDecimal valorEmitido;
	private BigDecimal valorAdicionar;
	private Integer porcentaje;
	private Integer saldo;
	private Boolean input;

	public ConceptoSuscripcionReliquidadaDTO() {

	}

	public ConceptoSuscripcionReliquidadaDTO(String nombreConcepto, BigDecimal tarifaFinalFacturada,
			BigDecimal tarifaFinalDescuento, BigDecimal totalDescuento, Long idSuscripcion, String periodo,
			String nombreTercero, String documentoTercero, String direccion, String documento, String tipoDocumento) {
		super();
		this.nombreConcepto = nombreConcepto;
		this.tarifaFinalFacturada = tarifaFinalFacturada;
		this.tarifaFinalDescuento = tarifaFinalDescuento;
		this.totalDescuento = totalDescuento;
		this.idSuscripcion = idSuscripcion;
		this.periodo = periodo;
		this.nombreTercero = nombreTercero;
		this.documentoTercero = documentoTercero;
		this.direccion = direccion;
		this.documento = documento;
		this.tipoDocumento = tipoDocumento;
	}

	/**
	 * consutructor consulta conceptos deuda con valor en valorAdicionar
	 * 
	 * @param idDetalle
	 * @param idConcepto
	 * @param nombreConcepto
	 * @param valorEmitido
	 * @param valorAdicionar
	 * @param porcentaje
	 * @param saldo
	 * @param input
	 */
	public ConceptoSuscripcionReliquidadaDTO(Long idDetalle, Integer idConcepto, String nombreConcepto,
			BigDecimal valorEmitido, BigDecimal valorAdicionar, Integer porcentaje, Integer saldo, Boolean input) {
		super();
		this.idDetalle = idDetalle;
		this.idConcepto = idConcepto;
		this.nombreConcepto = nombreConcepto;
		this.valorEmitido = valorEmitido;
		this.valorAdicionar = valorAdicionar;
		this.porcentaje = porcentaje;
		this.saldo = saldo;
		this.input = input;

	}

	/**
	 * constructor consulta informacion tercero
	 * 
	 * @param nombreTercero
	 * @param direccion
	 * @param documento
	 * @param tipoDocumento
	 */
	public ConceptoSuscripcionReliquidadaDTO(String nombreTercero,  String documento,
			String tipoDocumento , String codigoAnterior, String  direccion ) {
		super();
		this.nombreTercero = nombreTercero;
		this.documento = documento;
		this.tipoDocumento = tipoDocumento;
		this.codigoAnterior = codigoAnterior;
		this.direccion = direccion;
	}

	public BigDecimal getValorEmitido() {
		return valorEmitido;
	}

	public void setValorEmitido(BigDecimal valorEmitido) {
		this.valorEmitido = valorEmitido;
	}

	public BigDecimal getValorAdicionar() {
		return valorAdicionar;
	}

	public void setValorAdicionar(BigDecimal valorAdicionar) {
		this.valorAdicionar = valorAdicionar;
	}

	public Integer getPorcentaje() {
		return porcentaje;
	}

	public void setPorcentaje(Integer porcentaje) {
		this.porcentaje = porcentaje;
	}

	public Integer getSaldo() {
		return saldo;
	}

	public void setSaldo(Integer saldo) {
		this.saldo = saldo;
	}

	public Boolean getInput() {
		return input;
	}

	public void setInput(Boolean input) {
		this.input = input;
	}

	public Integer getIdConcepto() {
		return idConcepto;
	}

	public void setIdConcepto(Integer idConcepto) {
		this.idConcepto = idConcepto;
	}

	public String getCodigoAnterior() {
		return codigoAnterior;
	}

	public void setCodigoAnterior(String codigoAnterior) {
		this.codigoAnterior = codigoAnterior;
	}

	public Long getIdDetalle() {
		return idDetalle;
	}

	public void setIdDetalle(Long idDetalle) {
		this.idDetalle = idDetalle;
	}

	@JsonProperty("nombreConcepto")
	public String getNombreConcepto() {
		return nombreConcepto;
	}

	@JsonProperty("nombreConcepto")
	public void setNombreConcepto(String nombreConcepto) {
		this.nombreConcepto = nombreConcepto;
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

	@JsonProperty("idSuscripcion")
	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	@JsonProperty("idSuscripcion")
	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	@JsonProperty("periodo")
	public String getPeriodo() {
		return periodo;
	}

	@JsonProperty("periodo")
	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	@JsonProperty("nombreTercero")
	public String getNombreTercero() {
		return nombreTercero;
	}

	@JsonProperty("nombreTercero")
	public void setNombreTercero(String nombreTercero) {
		this.nombreTercero = nombreTercero;
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

	@JsonProperty("documento")
	public String getDocumento() {
		return documento;
	}

	@JsonProperty("documento")
	public void setDocumento(String documento) {
		this.documento = documento;
	}

	@JsonProperty("tipoDocumento")
	public String getTipoDocumento() {
		return tipoDocumento;
	}

	@JsonProperty("tipoDocumento")
	public void setTipoDocumento(String tipoDocumento) {
		this.tipoDocumento = tipoDocumento;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((codigoAnterior == null) ? 0 : codigoAnterior.hashCode());
		result = prime * result + ((direccion == null) ? 0 : direccion.hashCode());
		result = prime * result + ((documento == null) ? 0 : documento.hashCode());
		result = prime * result + ((documentoTercero == null) ? 0 : documentoTercero.hashCode());
		result = prime * result + ((idConcepto == null) ? 0 : idConcepto.hashCode());
		result = prime * result + ((idDetalle == null) ? 0 : idDetalle.hashCode());
		result = prime * result + ((idSuscripcion == null) ? 0 : idSuscripcion.hashCode());
		result = prime * result + ((input == null) ? 0 : input.hashCode());
		result = prime * result + ((nombreConcepto == null) ? 0 : nombreConcepto.hashCode());
		result = prime * result + ((nombreTercero == null) ? 0 : nombreTercero.hashCode());
		result = prime * result + ((periodo == null) ? 0 : periodo.hashCode());
		result = prime * result + ((porcentaje == null) ? 0 : porcentaje.hashCode());
		result = prime * result + ((saldo == null) ? 0 : saldo.hashCode());
		result = prime * result + ((tarifaFinalDescuento == null) ? 0 : tarifaFinalDescuento.hashCode());
		result = prime * result + ((tarifaFinalFacturada == null) ? 0 : tarifaFinalFacturada.hashCode());
		result = prime * result + ((tipoDocumento == null) ? 0 : tipoDocumento.hashCode());
		result = prime * result + ((totalDescuento == null) ? 0 : totalDescuento.hashCode());
		result = prime * result + ((valorAdicionar == null) ? 0 : valorAdicionar.hashCode());
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
		ConceptoSuscripcionReliquidadaDTO other = (ConceptoSuscripcionReliquidadaDTO) obj;
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
		if (documentoTercero == null) {
			if (other.documentoTercero != null)
				return false;
		} else if (!documentoTercero.equals(other.documentoTercero))
			return false;
		if (idConcepto == null) {
			if (other.idConcepto != null)
				return false;
		} else if (!idConcepto.equals(other.idConcepto))
			return false;
		if (idDetalle == null) {
			if (other.idDetalle != null)
				return false;
		} else if (!idDetalle.equals(other.idDetalle))
			return false;
		if (idSuscripcion == null) {
			if (other.idSuscripcion != null)
				return false;
		} else if (!idSuscripcion.equals(other.idSuscripcion))
			return false;
		if (input == null) {
			if (other.input != null)
				return false;
		} else if (!input.equals(other.input))
			return false;
		if (nombreConcepto == null) {
			if (other.nombreConcepto != null)
				return false;
		} else if (!nombreConcepto.equals(other.nombreConcepto))
			return false;
		if (nombreTercero == null) {
			if (other.nombreTercero != null)
				return false;
		} else if (!nombreTercero.equals(other.nombreTercero))
			return false;
		if (periodo == null) {
			if (other.periodo != null)
				return false;
		} else if (!periodo.equals(other.periodo))
			return false;
		if (porcentaje == null) {
			if (other.porcentaje != null)
				return false;
		} else if (!porcentaje.equals(other.porcentaje))
			return false;
		if (saldo == null) {
			if (other.saldo != null)
				return false;
		} else if (!saldo.equals(other.saldo))
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
		if (tipoDocumento == null) {
			if (other.tipoDocumento != null)
				return false;
		} else if (!tipoDocumento.equals(other.tipoDocumento))
			return false;
		if (totalDescuento == null) {
			if (other.totalDescuento != null)
				return false;
		} else if (!totalDescuento.equals(other.totalDescuento))
			return false;
		if (valorAdicionar == null) {
			if (other.valorAdicionar != null)
				return false;
		} else if (!valorAdicionar.equals(other.valorAdicionar))
			return false;
		if (valorEmitido == null) {
			if (other.valorEmitido != null)
				return false;
		} else if (!valorEmitido.equals(other.valorEmitido))
			return false;
		return true;
	}

}
