package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ResponseConsultaDetalleDeshabitadosDTO implements Serializable {

	private List<ConsultaDetalleDeshabitadoDTO> data;

	public ResponseConsultaDetalleDeshabitadosDTO() {
		super();
	}

	public List<ConsultaDetalleDeshabitadoDTO> getData() {
		return data;
	}

	public void setData(List<ConsultaDetalleDeshabitadoDTO> data) {
		this.data = data;
	}

}
