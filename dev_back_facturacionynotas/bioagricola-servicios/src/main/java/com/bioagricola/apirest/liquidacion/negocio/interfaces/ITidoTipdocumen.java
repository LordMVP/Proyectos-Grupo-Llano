package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.TidoTipdocumenDTO;
import com.bioagricola.apirest.modelo.dtos.TipoDocumentoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface ITidoTipdocumen {

	public List<TidoTipdocumenDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public TidoTipdocumenDTO crear(TidoTipdocumenDTO tidoTipdocumenDTO);

	public TidoTipdocumenDTO actualizar(TidoTipdocumenDTO tidoTipdocumenDTO);

	public String eliminar(Integer uniTipdocument);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public List<TipoDocumentoDTO> consultaTiposDocumento(Integer uniDocumento) throws InvalidParameterException;

}
