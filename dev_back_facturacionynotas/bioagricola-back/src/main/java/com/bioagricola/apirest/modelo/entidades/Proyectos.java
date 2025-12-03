package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "proyectos")
@NamedQuery(name = "Proyectos.findAll", query = "SELECT p FROM Proyectos p")
public class Proyectos implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "proyecto_nom")
	private String proyectoNom;

	@Id
	@Column(name = "proyecto_llacom")
	private String proyectoLlacom;

	@Column(name = "proyecto_ideregistro")
	private Integer proyectoIderegistro;

	@Column(name = "proyecto_formato")
	private String proyectoformato;

	@Column(name = "proyecto_codemp")
	private String proyectoCodemp;

	@Column(name = "proyecto_codciu")
	private String proyectoCodciu;

	@Column(name = "proyecto_cod")
	private String proyectoCod;

	@Column(name = "departamento_ideregistro")
	private Long departamentoIderegistro;

	@Column(name = "cue_ideregistro")
	private Long cueIderegistro;

	public Proyectos() {
		// costructor por defecto
	}

	public String getProyectoNom() {
		return proyectoNom;
	}

	public void setProyectoNom(String proyectoNom) {
		this.proyectoNom = proyectoNom;
	}

	public String getProyectoLlacom() {
		return proyectoLlacom;
	}

	public void setProyectoLlacom(String proyectoLlacom) {
		this.proyectoLlacom = proyectoLlacom;
	}

	public Integer getProyectoIderegistro() {
		return proyectoIderegistro;
	}

	public void setProyectoIderegistro(Integer proyectoIderegistro) {
		this.proyectoIderegistro = proyectoIderegistro;
	}

	public String getProyectoformato() {
		return proyectoformato;
	}

	public void setProyectoformato(String proyectoformato) {
		this.proyectoformato = proyectoformato;
	}

	public String getProyectoCodemp() {
		return proyectoCodemp;
	}

	public void setProyectoCodemp(String proyectoCodemp) {
		this.proyectoCodemp = proyectoCodemp;
	}

	public String getProyectoCodciu() {
		return proyectoCodciu;
	}

	public void setProyectoCodciu(String proyectoCodciu) {
		this.proyectoCodciu = proyectoCodciu;
	}

	public String getProyectoCod() {
		return proyectoCod;
	}

	public void setProyectoCod(String proyectoCod) {
		this.proyectoCod = proyectoCod;
	}

	public Long getDepartamentoIderegistro() {
		return departamentoIderegistro;
	}

	public void setDepartamentoIderegistro(Long departamentoIderegistro) {
		this.departamentoIderegistro = departamentoIderegistro;
	}

	public Long getCueIderegistro() {
		return cueIderegistro;
	}

	public void setCueIderegistro(Long cueIderegistro) {
		this.cueIderegistro = cueIderegistro;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
