package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DocDocumento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad DocDocumento.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorDocDocumento extends ManejadorCrud<DocDocumento,Integer>,IManejadorCrud<DocDocumento,Integer>{

	/**
	 * Método de consulta de documentos según la empresa en sesión
	 * */
	@Query(value = "select dd.uni_documento , uu.uni_nombre1 from doc_documento dd "
			+ "inner join (select distinct uni_documento from liq_liquidacion ll) as liquidaciones on liquidaciones.uni_documento = dd.uni_documento "
			+ "inner join uni_unidad uu on uu.uni_ideregistro = dd.uni_documento "
			+ "inner join esem_estempresa ee on ee.est_ideregistro = uu.est_ideregistro "
			+ "where ee.emp_ideregistro = :idEmpresa"
			, nativeQuery = true)
	public List<Object[]> consultaDocumentos(int idEmpresa);
	
}

