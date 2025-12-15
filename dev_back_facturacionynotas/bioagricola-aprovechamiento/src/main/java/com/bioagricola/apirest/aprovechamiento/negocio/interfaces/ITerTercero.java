package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.TerTerceroDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.IOException;
import java.util.List;

public interface ITerTercero {

	public List<TerTerceroDTO> consultaTercerosAprovechadoresPorNombre(String nombre)
			throws JsonParseException, JsonMappingException, IOException, InvalidParameterException;

	public List<TerTerceroDTO> consultaTercerosAprovechadoresPorDocumentoYDigito(String documento, String digito)
			throws JsonParseException, JsonMappingException, IOException, InvalidParameterException;

}
