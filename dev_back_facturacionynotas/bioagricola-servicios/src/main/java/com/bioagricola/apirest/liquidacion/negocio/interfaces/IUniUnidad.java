package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.UniUnidadDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IUniUnidad {

	public List<UniUnidadDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public UniUnidadDTO crear(UniUnidadDTO uniUnidadDTO);

	public UniUnidadDTO actualizar(UniUnidadDTO uniUnidadDTO);

	public String eliminar(Integer uniIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
