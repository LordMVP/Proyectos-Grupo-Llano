package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * The persistent class for the vrmr_varmicroruta database table.
 * 
 */
@Entity
@Table(name = "vrmr_varmicroruta", schema = "aseo")
@NamedQuery(name = "VrmrVarmicroruta.findAll", query = "SELECT v FROM VrmrVarmicroruta v")
public class VrmrVarmicroruta implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "aseo.sq_vrmr_ideregistro", sequenceName = "aseo.sq_vrmr_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.sq_vrmr_ideregistro")
	@Column(name = "vrmr_ideregistro")
	private Integer vrmrIderegistro;

	@Column(name = "arpr_ideregistro")
	private Integer arprIderegistro;

	@Column(name = "con_ideregistro")
	private Integer conIderegistro;

	@Column(name = "emp_ideregistro")
	private Integer empIderegistro;

	@Column(name = "per_ideregistro")
	private Integer perIderegistro;

	@Column(name = "rut_idemicroruta")
	private Integer rutIdemicroruta;

	@Column(name = "usu_ideregistro_cer")
	private Integer usuIderegistroCer;

	@Column(name = "usu_ideregistro_gb")
	private Integer usuIderegistroGb;

	@Column(name = "vrmr_descripcion")
	private String vrmrDescripcion;

	@Column(name = "vrmr_estado")
	private String vrmrEstado;

	@Column(name = "vrmr_estadoregistro")
	private String vrmrEstadoregistro;

	@Column(name = "vrmr_feccerficicacion")
	private Timestamp vrmrFeccerficicacion;

	@Column(name = "vrmr_fecgrabacion")
	private Timestamp vrmrFecgrabacion;

	@Column(name = "vrmr_valor")
	private BigDecimal vrmrValor;

	public VrmrVarmicroruta() {
		//constructor por defecto
	}

	public Integer getVrmrIderegistro() {
		return this.vrmrIderegistro;
	}

	public void setVrmrIderegistro(Integer vrmrIderegistro) {
		this.vrmrIderegistro = vrmrIderegistro;
	}

	public Integer getArprIderegistro() {
		return this.arprIderegistro;
	}

	public void setArprIderegistro(Integer arprIderegistro) {
		this.arprIderegistro = arprIderegistro;
	}

	public Integer getConIderegistro() {
		return this.conIderegistro;
	}

	public void setConIderegistro(Integer conIderegistro) {
		this.conIderegistro = conIderegistro;
	}

	public Integer getEmpIderegistro() {
		return this.empIderegistro;
	}

	public void setEmpIderegistro(Integer empIderegistro) {
		this.empIderegistro = empIderegistro;
	}

	public Integer getPerIderegistro() {
		return this.perIderegistro;
	}

	public void setPerIderegistro(Integer perIderegistro) {
		this.perIderegistro = perIderegistro;
	}

	public Integer getRutIdemicroruta() {
		return this.rutIdemicroruta;
	}

	public void setRutIdemicroruta(Integer rutIdemicroruta) {
		this.rutIdemicroruta = rutIdemicroruta;
	}

	public Integer getUsuIderegistroCer() {
		return this.usuIderegistroCer;
	}

	public void setUsuIderegistroCer(Integer usuIderegistroCer) {
		this.usuIderegistroCer = usuIderegistroCer;
	}

	public Integer getUsuIderegistroGb() {
		return this.usuIderegistroGb;
	}

	public void setUsuIderegistroGb(Integer usuIderegistroGb) {
		this.usuIderegistroGb = usuIderegistroGb;
	}

	public String getVrmrDescripcion() {
		return this.vrmrDescripcion;
	}

	public void setVrmrDescripcion(String vrmrDescripcion) {
		this.vrmrDescripcion = vrmrDescripcion;
	}

	public String getVrmrEstado() {
		return this.vrmrEstado;
	}

	public void setVrmrEstado(String vrmrEstado) {
		this.vrmrEstado = vrmrEstado;
	}

	public String getVrmrEstadoregistro() {
		return this.vrmrEstadoregistro;
	}

	public void setVrmrEstadoregistro(String vrmrEstadoregistro) {
		this.vrmrEstadoregistro = vrmrEstadoregistro;
	}

	public Timestamp getVrmrFeccerficicacion() {
		return this.vrmrFeccerficicacion;
	}

	public void setVrmrFeccerficicacion(Timestamp vrmrFeccerficicacion) {
		this.vrmrFeccerficicacion = vrmrFeccerficicacion;
	}

	public Timestamp getVrmrFecgrabacion() {
		return this.vrmrFecgrabacion;
	}

	public void setVrmrFecgrabacion(Timestamp vrmrFecgrabacion) {
		this.vrmrFecgrabacion = vrmrFecgrabacion;
	}

	public BigDecimal getVrmrValor() {
		return this.vrmrValor;
	}

	public void setVrmrValor(BigDecimal vrmrValor) {
		this.vrmrValor = vrmrValor;
	}

}