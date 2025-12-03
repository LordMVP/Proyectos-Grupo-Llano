package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.PrgProgramaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IPrgPrograma {
	
	public PrgProgramaDTO consultaPrograma(Integer idPrograma) throws InvalidParameterException;

}
