package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.CnreCnvrecaudoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ICnreCnvrecaudo {

	public List<CnreCnvrecaudoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public CnreCnvrecaudoDTO crear(CnreCnvrecaudoDTO cnreCnvrecaudoDTO);

	public CnreCnvrecaudoDTO actualizar(CnreCnvrecaudoDTO cnreCnvrecaudoDTO);

	public String eliminar(Integer cnreIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
