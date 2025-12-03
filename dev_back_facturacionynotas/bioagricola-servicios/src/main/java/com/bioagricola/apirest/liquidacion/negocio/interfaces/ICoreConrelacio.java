package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.CoreConrelacioDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ICoreConrelacio {

	public List<CoreConrelacioDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public CoreConrelacioDTO crear(CoreConrelacioDTO coreConrelacioDTO);

	public CoreConrelacioDTO actualizar(CoreConrelacioDTO coreConrelacioDTO);

	public String eliminar(Integer coreIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
