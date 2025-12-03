package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.DicnDisconvenDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDicnDisconven {

	public List<DicnDisconvenDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DicnDisconvenDTO crear(DicnDisconvenDTO dicnDisconvenDTO);

	public DicnDisconvenDTO actualizar(DicnDisconvenDTO dicnDisconvenDTO);

	public String eliminar(Integer dicnIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
