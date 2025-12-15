package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.Map;

public interface IParParametro {

	public Map<String, Object> consultaParametrosAprovechamiento() throws JsonParseException, JsonMappingException, IOException;
}
