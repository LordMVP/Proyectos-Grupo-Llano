package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.DrecDetrecaudoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDrecDetrecaudo {

	public List<DrecDetrecaudoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DrecDetrecaudoDTO crear(DrecDetrecaudoDTO drecDetrecaudoDTO);

	public DrecDetrecaudoDTO actualizar(DrecDetrecaudoDTO drecDetrecaudoDTO);

	public String eliminar(Long drecIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
