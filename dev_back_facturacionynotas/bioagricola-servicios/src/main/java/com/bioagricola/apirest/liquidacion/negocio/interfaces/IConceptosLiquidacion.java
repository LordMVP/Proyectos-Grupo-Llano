package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ColiConliquidaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestConceptosLiquidacion;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IConceptosLiquidacion {

	public List<ColiConliquidaDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public ColiConliquidaDTO crear(ColiConliquidaDTO coliConliquidaDTO);

	public ColiConliquidaDTO actualizar(ColiConliquidaDTO coliConliquidaDTO);

	public String eliminar(Integer uniConcepto, Integer uniLiquidacion);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public Object[] getConceptosLiquidacion(RequestConceptosLiquidacion requestId);

}
