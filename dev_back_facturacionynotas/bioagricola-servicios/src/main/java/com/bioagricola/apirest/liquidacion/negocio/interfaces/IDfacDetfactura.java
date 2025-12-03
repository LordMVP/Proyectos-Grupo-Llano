package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.DfacDetfacturaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDfacDetfactura {

	public List<DfacDetfacturaDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DfacDetfacturaDTO crear(DfacDetfacturaDTO dfacDetfacturaDTO);

	public DfacDetfacturaDTO actualizar(DfacDetfacturaDTO dfacDetfacturaDTO);

	public String eliminar(Long dfacIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	//public Long getValorFactura(Integer idFactura);

}
