package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ColiConliquidaAproDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer coliAprovIderegistro;
	
	private Integer terIderegistro;
	
	private String terNomcompleto;
	
	private Integer uniConcepto;
	
	private String conNombre;
	
	private Integer uniLiquidacion;
	
	private String liqNombre;
	
	private Integer usuIderegistro;
	
	private BigDecimal uniPorcentaje;
	
	private Integer uniDocumento;
	
	private String docNombre;
	
	private Integer uniTipdocument;
	
	private String tidoNombre;
	
	private String coliEstado;
	
	private String proyectoLlacom;
	
	private String municipio;
	
	private Date fechaCreacion;
	
	
	
	public ColiConliquidaAproDTO() {
		//constructor por defecto
	}

	public Integer getColiAprovIderegistro() {
		return coliAprovIderegistro;
	}

	public void setColiAprovIderegistro(Integer coliAprovIderegistro) {
		this.coliAprovIderegistro = coliAprovIderegistro;
	}

	public Integer getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Integer terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Integer getUniLiquidacion() {
		return uniLiquidacion;
	}

	public void setUniLiquidacion(Integer uniLiquidacion) {
		this.uniLiquidacion = uniLiquidacion;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}
	
	public BigDecimal getUniPorcentaje() {
		return uniPorcentaje;
	}

	public void setUniPorcentaje(BigDecimal uniPorcentaje) {
		this.uniPorcentaje = uniPorcentaje;
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

	public String getColiEstado() {
		return coliEstado;
	}

	public void setColiEstado(String coliEstado) {
		this.coliEstado = coliEstado;
	}

	public String getTerNomcompleto() {
		return terNomcompleto;
	}

	public void setTerNomcompleto(String terNomcompleto) {
		this.terNomcompleto = terNomcompleto;
	}

	public String getConNombre() {
		return conNombre;
	}

	public void setConNombre(String conNombre) {
		this.conNombre = conNombre;
	}

	public String getLiqNombre() {
		return liqNombre;
	}

	public void setLiqNombre(String liqNombre) {
		this.liqNombre = liqNombre;
	}

	public String getDocNombre() {
		return docNombre;
	}

	public void setDocNombre(String docNombre) {
		this.docNombre = docNombre;
	}

	public String getTidoNombre() {
		return tidoNombre;
	}

	public void setTidoNombre(String tidoNombre) {
		this.tidoNombre = tidoNombre;
	}

	public String getProyectoLlacom() {
		return proyectoLlacom;
	}

	public void setProyectoLlacom(String proyectoLlacom) {
		this.proyectoLlacom = proyectoLlacom;
	}

	public Date getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public String getMunicipio() {
		return municipio;
	}

	public void setMunicipio(String municipio) {
		this.municipio = municipio;
	}
	
	
	
	
}
