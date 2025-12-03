package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.LiqLiquidacionDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ILiqLiquidacion {

	public List<LiqLiquidacionDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public LiqLiquidacionDTO crear(LiqLiquidacionDTO liqLiquidacionDTO);

	public LiqLiquidacionDTO actualizar(LiqLiquidacionDTO liqLiquidacionDTO);

	public String eliminar(Integer uniLiquidacion);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
