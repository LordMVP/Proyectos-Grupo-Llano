package com.bioagricola.homologaciones.dto;

import java.util.List;

public class HomologacionInfoBasica
{
	private String terDocumento;
    private String terNomcompleto;
    private Integer naturaleza;
    private String direccion;
    private Integer barrio;
    private Integer sector;
    private Integer departamento;
    private Integer proyecto;
    private String catastralAntes;
    private String castastralNuevo;
    private String matriculaInmobiliaria;
    private String ubicacion;
    private Integer actividadEconomica;
    private String longitud;
    private String latitud;
    private List<Object[]> correos;
    private Integer dsusIderegistr;
    
	public HomologacionInfoBasica() {
		super();
	}

	public String getTerDocumento() {
		return terDocumento;
	}

	public void setTerDocumento(String terDocumento) {
		this.terDocumento = terDocumento;
	}

	public String getTerNomcompleto() {
		return terNomcompleto;
	}

	public void setTerNomcompleto(String terNomcompleto) {
		this.terNomcompleto = terNomcompleto;
	}

	public Integer getNaturaleza() {
		return naturaleza;
	}

	public void setNaturaleza(Integer naturaleza) {
		this.naturaleza = naturaleza;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public Integer getBarrio() {
		return barrio;
	}

	public void setBarrio(Integer barrio) {
		this.barrio = barrio;
	}

	public Integer getSector() {
		return sector;
	}

	public void setSector(Integer sector) {
		this.sector = sector;
	}

	public Integer getDepartamento() {
		return departamento;
	}

	public void setDepartamento(Integer departamento) {
		this.departamento = departamento;
	}

	public Integer getProyecto() {
		return proyecto;
	}

	public void setProyecto(Integer proyecto) {
		this.proyecto = proyecto;
	}

	public String getCatastralAntes() {
		return catastralAntes;
	}

	public void setCatastralAntes(String catastralAntes) {
		this.catastralAntes = catastralAntes;
	}

	public String getCastastralNuevo() {
		return castastralNuevo;
	}

	public void setCastastralNuevo(String castastralNuevo) {
		this.castastralNuevo = castastralNuevo;
	}

	public String getMatriculaInmobiliaria() {
		return matriculaInmobiliaria;
	}

	public void setMatriculaInmobiliaria(String matriculaInmobiliaria) {
		this.matriculaInmobiliaria = matriculaInmobiliaria;
	}

	public String getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(String ubicacion) {
		this.ubicacion = ubicacion;
	}

	public Integer getActividadEconomica() {
		return actividadEconomica;
	}

	public void setActividadEconomica(Integer actividadEconomica) {
		this.actividadEconomica = actividadEconomica;
	}

	public String getLongitud() {
		return longitud;
	}

	public void setLongitud(String longitud) {
		this.longitud = longitud;
	}

	public String getLatitud() {
		return latitud;
	}

	public void setLatitud(String latitud) {
		this.latitud = latitud;
	}

	public List<Object[]> getCorreos() {
		return correos;
	}

	public void setCorreos(List<Object[]> correos) {
		this.correos = correos;
	}

	public Integer getDsusIderegistr() {
		return dsusIderegistr;
	}

	public void setDsusIderegistr(Integer dsusIderegistr) {
		this.dsusIderegistr = dsusIderegistr;
	}

}
