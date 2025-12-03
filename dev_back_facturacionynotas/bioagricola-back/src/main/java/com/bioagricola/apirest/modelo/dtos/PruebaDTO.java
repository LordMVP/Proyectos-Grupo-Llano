package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;
import java.util.List;

public class PruebaDTO implements Serializable {
	
	private List<PruebaCalculosDTO> facturas;
	
	public PruebaDTO() {
		//constructor por defecto
	}

	public List<PruebaCalculosDTO> getFacturas() {
		return facturas;
	}

	public void setFacturas(List<PruebaCalculosDTO> facturas) {
		this.facturas = facturas;
	}
	
	

}
