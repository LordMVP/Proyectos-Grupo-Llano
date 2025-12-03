package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.RecRecaudoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IRecRecaudo {

	public List<RecRecaudoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public RecRecaudoDTO crear(RecRecaudoDTO recRecaudoDTO);

	public RecRecaudoDTO actualizar(RecRecaudoDTO recRecaudoDTO);

	public String eliminar(Long recIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
