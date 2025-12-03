package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ResponseConsultaDetalleSuscripcionDTO {

	private List<ConsultaDetalleSuscripcionDTO> data;
	private int pages;
	
	@JsonProperty("data")    
	public List<ConsultaDetalleSuscripcionDTO> getData() {
		return data;
	}
	
	@JsonProperty("data")    
	public void setData(List<ConsultaDetalleSuscripcionDTO> data) {
		this.data = data;
	}
	
	@JsonProperty("pages")    
	public int getPages() {
		return pages;
	}
	
	@JsonProperty("pages")    
	public void setPages(int pages) {
		this.pages = pages;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((data == null) ? 0 : data.hashCode());
		result = prime * result + pages;
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
		ResponseConsultaDetalleSuscripcionDTO other = (ResponseConsultaDetalleSuscripcionDTO) obj;
		if (data == null) {
			if (other.data != null)
				return false;
		} else if (!data.equals(other.data))
			return false;
		if (pages != other.pages)
			return false;
		return true;
	}
	
	
}
