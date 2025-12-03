package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ConsultaPqrDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IReclamo {

	public List<ConsultaPqrDTO> consultaPqr(String numeroPqr, Long idSuscripcion, String nombreTercero,
			String terceroDocumento) throws InvalidParameterException;

}
