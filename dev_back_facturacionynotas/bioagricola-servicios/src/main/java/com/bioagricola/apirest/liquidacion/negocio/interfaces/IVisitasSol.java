package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.io.IOException;

import com.bioagricola.apirest.modelo.dtos.RequestVisitasSolDTO;
import com.bioagricola.apirest.modelo.entidades.VisitasSol;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public interface IVisitasSol {

	public VisitasSol agregarRegistro(RequestVisitasSolDTO agregarSol) throws InvalidParameterException, JsonParseException, JsonMappingException, IOException;

}
