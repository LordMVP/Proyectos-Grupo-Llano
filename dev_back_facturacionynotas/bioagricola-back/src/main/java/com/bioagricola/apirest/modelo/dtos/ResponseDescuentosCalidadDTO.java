package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ResponseDescuentosCalidadDTO {

	private List<TotalesDescCalidadDTO> listaTotalPorIndicador;
	private Integer codResp;
	private String error;

	public ResponseDescuentosCalidadDTO() {
		super();
	}

	@JsonProperty("listaTotalPorIndicador")
	public List<TotalesDescCalidadDTO> getListaTotalPorIndicador() {
		return listaTotalPorIndicador;
	}

	@JsonProperty("listaTotalPorIndicador")
	public void setListaTotalPorIndicador(List<TotalesDescCalidadDTO> listaTotalPorIndicador) {
		this.listaTotalPorIndicador = listaTotalPorIndicador;
	}

	@JsonProperty("codResp")
	public Integer getCodResp() {
		return codResp;
	}

	@JsonProperty("codResp")
	public void setCodResp(Integer codResp) {
		this.codResp = codResp;
	}

	@JsonProperty("error")
	public String getError() {
		return error;
	}

	@JsonProperty("error")
	public void setError(String error) {
		this.error = error;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((codResp == null) ? 0 : codResp.hashCode());
		result = prime * result + ((error == null) ? 0 : error.hashCode());
		result = prime * result + ((listaTotalPorIndicador == null) ? 0 : listaTotalPorIndicador.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ResponseDescuentosCalidadDTO other = (ResponseDescuentosCalidadDTO) obj;
		if (codResp == null) {
			if (other.codResp != null)
				return false;
		} else if (!codResp.equals(other.codResp))
			return false;
		if (error == null) {
			if (other.error != null)
				return false;
		} else if (!error.equals(other.error))
			return false;
		if (listaTotalPorIndicador == null) {
			if (other.listaTotalPorIndicador != null)
				return false;
		} else if (!listaTotalPorIndicador.equals(other.listaTotalPorIndicador))
			return false;
		return true;
	}

}
