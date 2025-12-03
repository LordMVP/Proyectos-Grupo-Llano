package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.LiusLiqusoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ILiusLiquso {

	public List<LiusLiqusoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public LiusLiqusoDTO crear(LiusLiqusoDTO liusLiqusoDTO);

	public LiusLiqusoDTO actualizar(LiusLiqusoDTO liusLiqusoDTO);

	public String eliminar(Integer liusIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
