package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.io.IOException;

import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public interface IDecaDesccalidad {

	public ResponseDescuentosCalidadDTO aplicarDescCalidad() throws JsonParseException, JsonMappingException, IOException;

}
