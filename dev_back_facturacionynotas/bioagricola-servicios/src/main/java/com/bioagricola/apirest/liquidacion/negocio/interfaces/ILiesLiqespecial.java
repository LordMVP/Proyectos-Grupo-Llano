package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.LiesLiqespecialDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ILiesLiqespecial {

	public List<LiesLiqespecialDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public LiesLiqespecialDTO crear(LiesLiqespecialDTO liesLiqespecialDTO);

	public LiesLiqespecialDTO actualizar(LiesLiqespecialDTO liesLiqespecialDTO);

	public String eliminar(Long liesIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
