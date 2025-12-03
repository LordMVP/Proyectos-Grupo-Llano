package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ConConceptoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IConConcepto {

	public List<ConConceptoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public ConConceptoDTO crear(ConConceptoDTO conConceptoDTO);

	public ConConceptoDTO actualizar(ConConceptoDTO conConceptoDTO);

	public String eliminar(Integer uniConcepto);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public Object[] getConceptoInformacion(ConConceptoDTO requestId);

}
