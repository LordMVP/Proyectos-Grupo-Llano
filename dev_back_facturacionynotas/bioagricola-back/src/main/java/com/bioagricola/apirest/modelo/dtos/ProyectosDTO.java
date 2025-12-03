package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProyectosDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String proyectoNom;

	private String proyectoLlacom;

	private Long proyectoIderegistro;

	private String proyectoformato;

	private String proyectoCodemp;

	private String proyectoCodciu;

	private String proyectoCod;

	private Long departamentoIderegistro;

	private Long cueIderegistro;

	public ProyectosDTO() {
		// Constructor por defecto
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

	public Long getProyectoIderegistro() {
		return proyectoIderegistro;
	}

	public void setProyectoIderegistro(Long proyectoIderegistro) {
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
