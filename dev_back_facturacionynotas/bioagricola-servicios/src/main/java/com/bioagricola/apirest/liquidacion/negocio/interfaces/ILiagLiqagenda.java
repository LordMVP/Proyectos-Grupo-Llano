package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.LiagLiqagendaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ILiagLiqagenda {

	public List<LiagLiqagendaDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public LiagLiqagendaDTO crear(LiagLiqagendaDTO liagLiqagendaDTO);

	public LiagLiqagendaDTO actualizar(LiagLiqagendaDTO liagLiqagendaDTO);

	public String eliminar(Integer liagIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
