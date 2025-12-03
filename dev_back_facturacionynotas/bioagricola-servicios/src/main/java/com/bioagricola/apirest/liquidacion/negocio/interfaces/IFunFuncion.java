package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.FunFuncionDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IFunFuncion {

	public List<FunFuncionDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public FunFuncionDTO crear(FunFuncionDTO funFuncionDTO);

	public FunFuncionDTO actualizar(FunFuncionDTO funFuncionDTO);

	public String eliminar(String funNombre);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
