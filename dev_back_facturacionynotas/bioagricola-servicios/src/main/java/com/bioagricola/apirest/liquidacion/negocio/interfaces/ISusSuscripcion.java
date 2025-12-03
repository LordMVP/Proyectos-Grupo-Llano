package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.SusSuscripcionDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ISusSuscripcion {

	public List<SusSuscripcionDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public SusSuscripcionDTO crear(SusSuscripcionDTO susSuscripcionDTO);

	public SusSuscripcionDTO actualizar(SusSuscripcionDTO susSuscripcionDTO);

	public String eliminar(Long susIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
