package com.bioagricola.apirest.modelo.entidades;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ciudades")

public class Ciudades implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "ciudad_cod")
	private String ciudadCod;
	
	@Column(name = "ciudad_nom")
	private String ciudadNom;
	
	@Column(name = "ciudad_coddep")
	private String ciudadCoddep;
	
	@Column(name = "ciudad_codemp")
	private String ciudadCodemp;
	
	public Ciudades() {
		//constructor por defecto
	}

	public String getCiudadCod() {
		return ciudadCod;
	}

	public void setCiudadCod(String ciudadCod) {
		this.ciudadCod = ciudadCod;
	}

	public String getCiudadNom() {
		return ciudadNom;
	}

	public void setCiudadNom(String ciudadNom) {
		this.ciudadNom = ciudadNom;
	}

	public String getCiudadCoddep() {
		return ciudadCoddep;
	}

	public void setCiudadCoddep(String ciudadCoddep) {
		this.ciudadCoddep = ciudadCoddep;
	}

	public String getCiudadCodemp() {
		return ciudadCodemp;
	}

	public void setCiudadCodemp(String ciudadCodemp) {
		this.ciudadCodemp = ciudadCodemp;
	}
	
	
	
	
}
