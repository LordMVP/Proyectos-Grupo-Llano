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
 * The persistent class for the varpr_varperreg database table.
 * 
 */
@Entity
@Table(name="varpr_varperreg", schema = "aseo")
@NamedQuery(name="VarprVarperreg.findAll", query="SELECT v FROM VarprVarperreg v")
public class VarprVarperreg implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "aseo.sq_varpr_ideregistro", sequenceName = "aseo.sq_varpr_ideregistro", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.sq_varpr_ideregistro")
	@Column(name="varpr_ideregistro")
	private Integer varprIderegistro;

	@Column(name="arpr_ideregistro")
	private Integer arprIderegistro;

	@Column(name="con_ideregistro")
	private Integer conIderegistro;

	@Column(name="emp_ideregistro")
	private Integer empIderegistro;

	@Column(name="per_ideregistro")
	private Integer perIderegistro;

	@Column(name="raco_ideregistro")
	private Integer racoIderegistro;

	@Column(name="usu_ideregistro_cer")
	private Integer usuIderegistroCer;

	@Column(name="usu_ideregistro_gb")
	private Integer usuIderegistroGb;

	@Column(name="varpr_estado")
	private String varprEstado;

	@Column(name="varpr_estado_registro")
	private String varprEstadoRegistro;

	@Column(name="varpr_feccertificacion")
	private Timestamp varprFeccertificacion;

	@Column(name="varpr_fecgrabacion")
	private Timestamp varprFecgrabacion;

	@Column(name="varpr_valor")
	private BigDecimal varprValor;

	public VarprVarperreg() {
		//constructor por defecto
	}

	public Integer getVarprIderegistro() {
		return this.varprIderegistro;
	}

	public void setVarprIderegistro(Integer varprIderegistro) {
		this.varprIderegistro = varprIderegistro;
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

	public Integer getRacoIderegistro() {
		return this.racoIderegistro;
	}

	public void setRacoIderegistro(Integer racoIderegistro) {
		this.racoIderegistro = racoIderegistro;
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

	public String getVarprEstado() {
		return this.varprEstado;
	}

	public void setVarprEstado(String varprEstado) {
		this.varprEstado = varprEstado;
	}

	public String getVarprEstadoRegistro() {
		return this.varprEstadoRegistro;
	}

	public void setVarprEstadoRegistro(String varprEstadoRegistro) {
		this.varprEstadoRegistro = varprEstadoRegistro;
	}

	public Timestamp getVarprFeccertificacion() {
		return this.varprFeccertificacion;
	}

	public void setVarprFeccertificacion(Timestamp varprFeccertificacion) {
		this.varprFeccertificacion = varprFeccertificacion;
	}

	public Timestamp getVarprFecgrabacion() {
		return this.varprFecgrabacion;
	}

	public void setVarprFecgrabacion(Timestamp varprFecgrabacion) {
		this.varprFecgrabacion = varprFecgrabacion;
	}

	public BigDecimal getVarprValor() {
		return this.varprValor;
	}

	public void setVarprValor(BigDecimal varprValor) {
		this.varprValor = varprValor;
	}

}