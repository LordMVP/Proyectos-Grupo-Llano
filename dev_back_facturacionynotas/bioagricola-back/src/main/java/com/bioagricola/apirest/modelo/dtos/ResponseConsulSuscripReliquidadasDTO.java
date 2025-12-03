package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ResponseConsulSuscripReliquidadasDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<SuscripcionReliquidadaDTO> data;
	private int paginas;

	public ResponseConsulSuscripReliquidadasDTO() {
		super();
	}

	@JsonProperty("data")
	public List<SuscripcionReliquidadaDTO> getData() {
		return data;
	}

	@JsonProperty("data")
	public void setData(List<SuscripcionReliquidadaDTO> data) {
		this.data = data;
	}

	@JsonProperty("paginas")
	public int getPaginas() {
		return paginas;
	}

	@JsonProperty("paginas")
	public void setPaginas(int paginas) {
		this.paginas = paginas;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((data == null) ? 0 : data.hashCode());
		result = prime * result + paginas;
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
		ResponseConsulSuscripReliquidadasDTO other = (ResponseConsulSuscripReliquidadasDTO) obj;
		if (data == null) {
			if (other.data != null)
				return false;
		} else if (!data.equals(other.data))
			return false;
		if (paginas != other.paginas)
			return false;
		return true;
	}

	
	
}
