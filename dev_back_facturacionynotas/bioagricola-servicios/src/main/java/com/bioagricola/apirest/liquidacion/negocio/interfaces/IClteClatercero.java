package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ClteClaterceroDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IClteClatercero {

	public List<ClteClaterceroDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public ClteClaterceroDTO crear(ClteClaterceroDTO clteClaterceroDTO);

	public ClteClaterceroDTO actualizar(ClteClaterceroDTO clteClaterceroDTO);

	public String eliminar(Long clteIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;
}
