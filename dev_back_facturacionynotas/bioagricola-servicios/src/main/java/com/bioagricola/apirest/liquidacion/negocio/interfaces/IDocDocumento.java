package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.util.List;

import com.bioagricola.apirest.modelo.dtos.DocDocumentoDTO;
import com.bioagricola.apirest.modelo.dtos.DocumentoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDocDocumento {

	public List<DocDocumentoDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DocDocumentoDTO crear(DocDocumentoDTO docDocumentoDTO);

	public DocDocumentoDTO actualizar(DocDocumentoDTO docDocumentoDTO);

	public String eliminar(Integer uniDocumento);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public List<DocumentoDTO> consultaDocumentos();

}
