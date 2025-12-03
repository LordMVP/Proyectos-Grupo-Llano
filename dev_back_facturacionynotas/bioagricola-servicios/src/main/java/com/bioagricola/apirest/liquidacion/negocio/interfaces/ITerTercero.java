package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.TerTerceroDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.utils.GeneralBodyResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ITerTercero {

	public List<TerTerceroDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public TerTerceroDTO crear(TerTerceroDTO terTerceroDTO);

	public TerTerceroDTO actualizar(TerTerceroDTO terTerceroDTO);

	public String eliminar(Long terIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	ResponseEntity<GeneralBodyResponse<List<TerTerceroDTO>>> searchClientsByFullNameOrId(String fullname, String id);

	ResponseEntity<GeneralBodyResponse<List<TerTerceroDTO>>> searchTerceroByFullNameOrId(String fullname, String id);
}
