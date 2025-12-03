package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "pdia_pardistribucionincentivo", schema="aseo")
@NamedQuery(name = "PdiaPardistribucionincentivo.findAll", query = "SELECT p FROM PdiaPardistribucionincentivo p")
public class PdiaPardistribucionincentivo implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "pdia_ideregistro")
	private Integer pdiaIderegistro;
	
	@Column(name = "pdia_fechainiciovigencia")
	private Date pdiaFechainiciovigencia;
	
	@Column(name = "pdia_fechafinvigencia")
	private Date pdiaFechafinvigencia;
	
	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name = "ter_ideregistro")
	private Integer terIderegistro;
	
	@Column(name = "pdia_pordistribucion")
	private BigDecimal pdiaPordistribucion;
	
	@Column(name = "uni_concepto")
	private Integer uniConcepto;
	
	@Column(name = "uni_municipio")
	private Long uniMunicipio;
	
	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name = "pdia_fecharegistro")
	private Date pdiaFecharegistro;
	
	@Column(name = "pdia_estado")
	private String pdiaEstado;
	
	public PdiaPardistribucionincentivo() {
		//constructor por defecto
	}

	public Integer getPdiaIderegistro() {
		return pdiaIderegistro;
	}

	public void setPdiaIderegistro(Integer pdiaIderegistro) {
		this.pdiaIderegistro = pdiaIderegistro;
	}

	public Date getPdiaFechainiciovigencia() {
		return pdiaFechainiciovigencia;
	}

	public void setPdiaFechainiciovigencia(Date pdiaFechainiciovigencia) {
		this.pdiaFechainiciovigencia = pdiaFechainiciovigencia;
	}

	public Date getPdiaFechafinvigencia() {
		return pdiaFechafinvigencia;
	}

	public void setPdiaFechafinvigencia(Date pdiaFechafinvigencia) {
		this.pdiaFechafinvigencia = pdiaFechafinvigencia;
	}

	public Integer getEmpIderegistro() {
		return empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Integer getTerIderegistro() {
		return terIderegistro;
	}

	public void setTerIderegistro(Integer terIderegistro) {
		this.terIderegistro = terIderegistro;
	}

	public BigDecimal getPdiaPordistribucion() {
		return pdiaPordistribucion;
	}

	public void setPdiaPordistribucion(BigDecimal pdiaPordistribucion) {
		this.pdiaPordistribucion = pdiaPordistribucion;
	}

	public Integer getUniConcepto() {
		return uniConcepto;
	}

	public void setUniConcepto(Integer uniConcepto) {
		this.uniConcepto = uniConcepto;
	}

	public Long getUniMunicipio() {
		return uniMunicipio;
	}

	public void setUniMunicipio(Long uniMunicipio) {
		this.uniMunicipio = uniMunicipio;
	}

	public Integer getUsuIderegistro() {
		return usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

	public Date getPdiaFecharegistro() {
		return pdiaFecharegistro;
	}

	public void setPdiaFecharegistro(Date pdiaFecharegistro) {
		this.pdiaFecharegistro = pdiaFecharegistro;
	}

	public String getPdiaEstado() {
		return pdiaEstado;
	}

	public void setPdiaEstado(String pdiaEstado) {
		this.pdiaEstado = pdiaEstado;
	}
	
	
	

}
