package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.CosuConsuscripDTO;
import com.bioagricola.apirest.modelo.dtos.RequestCosuConsuscripDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ICosuConsuscrip {

	public List<CosuConsuscripDTO> marcacionTarifa(RequestCosuConsuscripDTO cosuConsuscrip) throws InvalidParameterException;
	
}
