package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.PerPeriodoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IPerPeriodo {

	public List<PerPeriodoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public PerPeriodoDTO crear(PerPeriodoDTO perPeriodoDTO);

	public PerPeriodoDTO actualizar(PerPeriodoDTO perPeriodoDTO);

	public String eliminar(Integer perIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
