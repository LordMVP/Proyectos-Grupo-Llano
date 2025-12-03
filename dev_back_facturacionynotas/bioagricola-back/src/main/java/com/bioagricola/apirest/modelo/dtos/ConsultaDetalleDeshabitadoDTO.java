package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ConsultaDetalleDeshabitadoDTO implements Serializable{

	private Long idSuscripcion;
	
	private String periodo;
	
	private Long numeroFactura;
	
	private String codigoUsuarioAnterior;
	
	private String estado;
	
	private String tipoUso;

	private String ciclo;
	
	private String estrato;
	
	private String empresaAlterna;
	
	private BigDecimal tarifaFinal;
	
	private BigDecimal tarifaDescuento;
	
	private BigDecimal totalDescuento;
	
	private String nombreCompletoTercero;

	private String direccion;
	
	private String numeroDocumentoReq;
	
	private String nombreDocumentoReq;
	
	private String tipoDocumentoReq;
	
	private String esDeshabitado;
	
	
	

	public ConsultaDetalleDeshabitadoDTO() {
		super();
	}

	public Long getIdSuscripcion() {
		return idSuscripcion;
	}

	public void setIdSuscripcion(Long idSuscripcion) {
		this.idSuscripcion = idSuscripcion;
	}

	public Long getNumeroFactura() {
		return numeroFactura;
	}

	public void setNumeroFactura(Long numeroFactura) {
		this.numeroFactura = numeroFactura;
	}

	public String getCodigoUsuarioAnterior() {
		return codigoUsuarioAnterior;
	}

	public void setCodigoUsuarioAnterior(String codigoUsuarioAnterior) {
		this.codigoUsuarioAnterior = codigoUsuarioAnterior;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public String getTipoUso() {
		return tipoUso;
	}

	public void setTipoUso(String tipoUso) {
		this.tipoUso = tipoUso;
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

	public BigDecimal getTarifaFinal() {
		return tarifaFinal;
	}

	public void setTarifaFinal(BigDecimal tarifaFinal) {
		this.tarifaFinal = tarifaFinal;
	}

	public BigDecimal getTarifaDescuento() {
		return tarifaDescuento;
	}

	public void setTarifaDescuento(BigDecimal tarifaDescuento) {
		this.tarifaDescuento = tarifaDescuento;
	}

	public BigDecimal getTotalDescuento() {
		return totalDescuento;
	}

	public void setTotalDescuento(BigDecimal totalDescuento) {
		this.totalDescuento = totalDescuento;
	}

	public String getPeriodo() {
		return periodo;
	}

	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	public String getEstrato() {
		return estrato;
	}

	public void setEstrato(String estrato) {
		this.estrato = estrato;
	}

	public String getNombreCompletoTercero() {
		return nombreCompletoTercero;
	}

	public void setNombreCompletoTercero(String nombreCompletoTercero) {
		this.nombreCompletoTercero = nombreCompletoTercero;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getNumeroDocumentoReq() {
		return numeroDocumentoReq;
	}

	public void setNumeroDocumentoReq(String numeroDocumentoReq) {
		this.numeroDocumentoReq = numeroDocumentoReq;
	}

	public String getNombreDocumentoReq() {
		return nombreDocumentoReq;
	}

	public void setNombreDocumentoReq(String nombreDocumentoReq) {
		this.nombreDocumentoReq = nombreDocumentoReq;
	}

	public String getTipoDocumentoReq() {
		return tipoDocumentoReq;
	}

	public void setTipoDocumentoReq(String tipoDocumentoReq) {
		this.tipoDocumentoReq = tipoDocumentoReq;
	}

	public String getEsDeshabitado() {
		return esDeshabitado;
	}

	public void setEsDeshabitado(String esDeshabitado) {
		this.esDeshabitado = esDeshabitado;
	}
	
	
	
		
}
