package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.RacoRanconceptDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IRacoRanconcept {

	public List<RacoRanconceptDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public RacoRanconceptDTO crear(RacoRanconceptDTO racoRanconceptDTO);

	public RacoRanconceptDTO actualizar(RacoRanconceptDTO racoRanconceptDTO);

	public String eliminar(Integer racoIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
