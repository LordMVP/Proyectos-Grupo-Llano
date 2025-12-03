package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.io.IOException;
import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ParParametroDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public interface IParParametro {

	public List<ParParametroDTO> consultaParametrosAccionDeshabitado() throws JsonParseException, JsonMappingException, IOException;
	public Integer consultaHolguraInicioVigencia() throws JsonParseException, JsonMappingException, IOException;
}
