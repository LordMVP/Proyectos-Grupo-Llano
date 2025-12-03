package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.DireDisrecaudoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDireDisrecaudo {

	public List<DireDisrecaudoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DireDisrecaudoDTO crear(DireDisrecaudoDTO direDisrecaudoDTO);

	public DireDisrecaudoDTO actualizar(DireDisrecaudoDTO direDisrecaudoDTO);

	public String eliminar(Long direIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
