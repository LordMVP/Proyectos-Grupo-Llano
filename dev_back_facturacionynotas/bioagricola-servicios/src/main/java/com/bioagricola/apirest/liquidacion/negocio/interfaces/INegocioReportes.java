package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

public interface INegocioReportes {
	public ByteArrayOutputStream facturasLiquidadas(String typeFile, String listaSuscripciones, String tipoNota);

	public ByteArrayOutputStream facturasLiquidadasFuturo(String typeFile, String listaSuscripciones);

	public ByteArrayOutputStream facturasLiquidadaEstrato(String typeFile, String listaSuscripciones)
			throws JsonParseException, JsonMappingException, IOException;

//	public String facturasLiquidadas(String typeFile, String listaSuscripciones); 
	public ByteArrayOutputStream facturasLiquidadaTipoUso(String typeFile, String listaSuscripciones, Integer tipoNota);
	public ByteArrayOutputStream facturasLiquidadasAforo(String typeFile, String listaSuscripciones, Integer tipoNota);
	
	public ByteArrayOutputStream notasInclusionDeuda(String typeFile, String listaSuscripciones, Integer tipoNota, Integer accionRealizar, Boolean eliminarSuscripcion);
}
