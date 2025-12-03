package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;


/**
 * The persistent class for the est_estructura database table.
 * 
 */
@Entity
@Table(name="est_estructura")
@NamedQuery(name="EstEstructura.findAll", query="SELECT e FROM EstEstructura e")
public class EstEstructura implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="est_ideregistro")
	private Integer estIderegistro;

	@Column(name="cla_ideregistro")
	private Integer claIderegistro;

	@Column(name="est_estado")
	private String estEstado;

	@Column(name="est_nivel")
	private Integer estNivel;

	@Column(name="est_nombre")
	private String estNombre;

	@Column(name="est_tipordena")
	private String estTipordena;

	@Column(name="est_valida")
	private String estValida;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	public EstEstructura() {
		//constructor por defecto
	}

	public Integer getEstIderegistro() {
		return this.estIderegistro;
	}

	public void setEstIderegistro(Integer estIderegistro) {
		this.estIderegistro = estIderegistro;
	}

	public Integer getClaIderegistro() {
		return this.claIderegistro;
	}

	public void setClaIderegistro(Integer claIderegistro) {
		this.claIderegistro = claIderegistro;
	}

	public String getEstEstado() {
		return this.estEstado;
	}

	public void setEstEstado(String estEstado) {
		this.estEstado = estEstado;
	}

	public Integer getEstNivel() {
		return this.estNivel;
	}

	public void setEstNivel(Integer estNivel) {
		this.estNivel = estNivel;
	}

	public String getEstNombre() {
		return this.estNombre;
	}

	public void setEstNombre(String estNombre) {
		this.estNombre = estNombre;
	}

	public String getEstTipordena() {
		return this.estTipordena;
	}

	public void setEstTipordena(String estTipordena) {
		this.estTipordena = estTipordena;
	}

	public String getEstValida() {
		return this.estValida;
	}

	public void setEstValida(String estValida) {
		this.estValida = estValida;
	}

	public Integer getUsuIderegistro() {
		return this.usuIderegistro;
	}

	public void setUsuIderegistro(Integer usuIderegistro) {
		this.usuIderegistro = usuIderegistro;
	}

}