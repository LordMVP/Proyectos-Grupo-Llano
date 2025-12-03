package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


/**
 * The persistent class for the rrba_rutarecoleccionbarrido database table.
 * 
 */
@Entity
@Table(name="rrba_rutarecoleccionbarrido", schema = "aseo")
@NamedQuery(name="RrbaRutarecoleccionbarrido.findAll", query="SELECT r FROM RrbaRutarecoleccionbarrido r")
public class RrbaRutarecoleccionbarrido implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "aseo.rutrecbar_recoleccion_barrido_rutrecbar_ideregistro_seq", sequenceName = "aseo.rutrecbar_recoleccion_barrido_rutrecbar_ideregistro_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aseo.rutrecbar_recoleccion_barrido_rutrecbar_ideregistro_seq")
	@Column(name="rrba_ideregistro")
	private Integer rrbaIderegistro;

	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;

	@Column(name="rure_ideregistro")
	private Integer rureIderegistro;

	@Column(name="rut_idemacroruta")
	private Long rutIdemacroruta;

	@Column(name="rut_ideregistro")
	private Long rutIderegistro;

	@Column(name="rutrecbar_swtact")
	private String rutrecbarSwtact;

	@Column(name="usu_ideregistro")
	private Long usuIderegistro;

	public RrbaRutarecoleccionbarrido() {
		//constructor por defecto
	}

	public Integer getRrbaIderegistro() {
		return this.rrbaIderegistro;
	}

	public void setRrbaIderegistro(Integer rrbaIderegistro) {
		this.rrbaIderegistro = rrbaIderegistro;
	}

	public Long getDsusIderegistr() {
		return this.dsusIderegistr;
	}

	public void setDsusIderegistr(Long dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

	public Integer getRureIderegistro() {
		return this.rureIderegistro;
	}

	public void setRureIderegistro(Integer rureIderegistro) {
		this.rureIderegistro = rureIderegistro;
	}

	public Long getRutIdemacroruta() {
		return this.rutIdemacroruta;
	}

	public void setRutIdemacroruta(Long rutIdemacroruta) {
		this.rutIdemacroruta = rutIdemacroruta;
	}

	public Long getRutIderegistro() {
		return this.rutIderegistro;
	}

	public void setRutIderegistro(Long rutIderegistro) {
		this.rutIderegistro = rutIderegistro;
	}

	public String getRutrecbarSwtact() {
		return this.rutrecbarSwtact;
	}

	public void setRutrecbarSwtact(String rutrecbarSwtact) {
		this.rutrecbarSwtact = rutrecbarSwtact;
	}

	public Long getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Long usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

}