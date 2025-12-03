package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.NotNotaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestNotNotaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface INotNota {

	public NotNotaDTO agregarNota (RequestNotNotaDTO nuevaNota ) throws InvalidParameterException;
}
