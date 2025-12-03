package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CuapCuentaAprovechamientoDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer cuaIderegistro;
	
	private Integer praIderegistro;
	
	private Integer liqVersion;
	
	private Long terIderegistro;
	
	private Long liqValorFacturado;
	
	private Long liqValorRecaudado;
	
	private Long liqValorCcFacturado;
	
	private Long liqValorCcRecaudado;
	
	private Long liqValorTaFacturado;
	
	private Long liqValorTaRecaudado;
	
	private Long liqValorIaFacturado;
	
	private Long liqValorIaRecaudado;
	
	private Date liqFecha;
	
	private Integer liqNumeroFacturasAPagar;
	
	private String liqEstado;
	
	private Integer uniLiquidacion;
	
	private Long liqAjusteAFactura;
	
	private Integer uniDocumento;
	
	private Integer uniTipdocument;
	
	private Long liqValorCcAjusteFacturado;
	
	private Long liqValorCcAjusteRecaudado;
	
	private Long liqValorTaAjusteFacturado;
	
	private Long liqValorTaAjusteRecaudado;
	
	public CuapCuentaAprovechamientoDTO() {
		//constructor por defecto
	}

	public Integer getCuaIderegistro() {
		return cuaIderegistro;
	}

	public void setCuaIderegistro(Integer cuaIderegistro) {
		this.cuaIderegistro = cuaIderegistro;
	}

	public Integer getPraIderegistro() {
		return praIderegistro;
	}

	public void setPraIderegistro(Integer praIderegistro) {
		this.praIderegistro = praIderegistro;
	}

	public Integer getLiqVersion() {
		return liqVersion;
	}

	public void setLiqVersion(Integer liqVersion) {
		this.liqVersion = liqVersion;
	}

	public Long getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Long terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Long getLiqValorFacturado() {
		return liqValorFacturado;
	}

	public void setLiqValorFacturado(Long liqValorFacturado) {
		this.liqValorFacturado = liqValorFacturado;
	}

	public Long getLiqValorRecaudado() {
		return liqValorRecaudado;
	}

	public void setLiqValorRecaudado(Long liqValorRecaudado) {
		this.liqValorRecaudado = liqValorRecaudado;
	}

	public Long getLiqValorCcFacturado() {
		return liqValorCcFacturado;
	}

	public void setLiqValorCcFacturado(Long liqValorCcFacturado) {
		this.liqValorCcFacturado = liqValorCcFacturado;
	}

	public Long getLiqValorCcRecaudado() {
		return liqValorCcRecaudado;
	}

	public void setLiqValorCcRecaudado(Long liqValorCcRecaudado) {
		this.liqValorCcRecaudado = liqValorCcRecaudado;
	}

	public Long getLiqValorTaFacturado() {
		return liqValorTaFacturado;
	}

	public void setLiqValorTaFacturado(Long liqValorTaFacturado) {
		this.liqValorTaFacturado = liqValorTaFacturado;
	}

	public Long getLiqValorTaRecaudado() {
		return liqValorTaRecaudado;
	}

	public void setLiqValorTaRecaudado(Long liqValorTaRecaudado) {
		this.liqValorTaRecaudado = liqValorTaRecaudado;
	}

	public Long getLiqValorIaFacturado() {
		return liqValorIaFacturado;
	}

	public void setLiqValorIaFacturado(Long liqValorIaFacturado) {
		this.liqValorIaFacturado = liqValorIaFacturado;
	}

	public Long getLiqValorIaRecaudado() {
		return liqValorIaRecaudado;
	}

	public void setLiqValorIaRecaudado(Long liqValorIaRecaudado) {
		this.liqValorIaRecaudado = liqValorIaRecaudado;
	}

	public Date getLiqFecha() {
		return liqFecha;
	}

	public void setLiqFecha(Date liqFecha) {
		this.liqFecha = liqFecha;
	}

	public Integer getLiqNumeroFacturasAPagar() {
		return liqNumeroFacturasAPagar;
	}

	public void setLiqNumeroFacturasAPagar(Integer liqNumeroFacturasAPagar) {
		this.liqNumeroFacturasAPagar = liqNumeroFacturasAPagar;
	}

	public String getLiqEstado() {
		return liqEstado;
	}

	public void setLiqEstado(String liqEstado) {
		this.liqEstado = liqEstado;
	}

	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Long getLiqAjusteAFactura() {
		return liqAjusteAFactura;
	}

	public void setLiqAjusteAFactura(Long liqAjusteAFactura) {
		this.liqAjusteAFactura = liqAjusteAFactura;
	}

	public Integer getUniDocumento() {
		return uniDocumento;
	}

	public void setUniDocumento(Integer uniDocumento) {
		this.uniDocumento = uniDocumento;
	}

	public Integer getUniTipdocument() {
		return uniTipdocument;
	}

	public void setUniTipdocument(Integer uniTipdocument) {
		this.uniTipdocument = uniTipdocument;
	}

	public Long getLiqValorCcAjusteFacturado() {
		return liqValorCcAjusteFacturado;
	}

	public void setLiqValorCcAjusteFacturado(Long liqValorCcAjusteFacturado) {
		this.liqValorCcAjusteFacturado = liqValorCcAjusteFacturado;
	}

	public Long getLiqValorCcAjusteRecaudado() {
		return liqValorCcAjusteRecaudado;
	}

	public void setLiqValorCcAjusteRecaudado(Long liqValorCcAjusteRecaudado) {
		this.liqValorCcAjusteRecaudado = liqValorCcAjusteRecaudado;
	}

	public Long getLiqValorTaAjusteFacturado() {
		return liqValorTaAjusteFacturado;
	}

	public void setLiqValorTaAjusteFacturado(Long liqValorTaAjusteFacturado) {
		this.liqValorTaAjusteFacturado = liqValorTaAjusteFacturado;
	}

	public Long getLiqValorTaAjusteRecaudado() {
		return liqValorTaAjusteRecaudado;
	}

	public void setLiqValorTaAjusteRecaudado(Long liqValorTaAjusteRecaudado) {
		this.liqValorTaAjusteRecaudado = liqValorTaAjusteRecaudado;
	}
	
	
	
	
	

}
