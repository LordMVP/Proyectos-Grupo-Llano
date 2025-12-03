package com.bioagricola.apirest.modelo.dtos;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonProperty;

@XmlRootElement
public class ResponseMarcacionTarifaDeshabitadoDTO {

	private List<MarcacionTarifaDTO> data;
	private int paginas;

	public ResponseMarcacionTarifaDeshabitadoDTO() {
		super();
	}

	@JsonProperty("data")
	public List<MarcacionTarifaDTO> getData() {
		return data;
	}

	@JsonProperty("data")
	public void setData(List<MarcacionTarifaDTO> data) {
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
		ResponseMarcacionTarifaDeshabitadoDTO other = (ResponseMarcacionTarifaDeshabitadoDTO) obj;
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
