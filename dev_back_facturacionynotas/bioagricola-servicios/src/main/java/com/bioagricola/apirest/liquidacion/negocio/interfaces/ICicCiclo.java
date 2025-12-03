package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.CicCicloDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ICicCiclo {

	public List<CicCicloDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public CicCicloDTO crear(CicCicloDTO cicCicloDTO);

	public CicCicloDTO actualizar(CicCicloDTO cicCicloDTO);

	public String eliminar(Integer cicIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public List<CicCicloDTO> consultaCiclos() throws InvalidParameterException;
}
