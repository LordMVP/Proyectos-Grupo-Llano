package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.EmpresasDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IEmpresas {

	public List<EmpresasDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public EmpresasDTO crear(EmpresasDTO empresasDTO);

	public EmpresasDTO actualizar(EmpresasDTO empresasDTO);

	public String eliminar(String empresaCod);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

}
