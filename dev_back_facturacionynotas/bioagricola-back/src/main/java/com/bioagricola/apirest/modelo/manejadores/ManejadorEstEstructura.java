package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.EstEstructura;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorEstEstructura extends ManejadorCrud<EstEstructura,Integer>,IManejadorCrud<EstEstructura,Integer>{

	/**
	 * Método de consulta de tipo de nota segun la clase del mismo
	 * */	
	@Query("select distinct uu.uniNombre1, " +
			"uu.uniIderegistro " +			
			"from EstEstructura ee " +
			"inner join EsemEstempresa em on em.id.estIderegistro = ee.estIderegistro " + 
			"inner join UniUnidad uu on uu.estIderegistro = ee.estIderegistro " + 
			 "where em.empresa.empresaSevemp = :idEmpresa "+
			"and ee.claIderegistro = :claRegistro")
	List<Object[]> consultaTipoNota(@Param("idEmpresa") int idEmpresa, 
			@Param("claRegistro") int claRegistro);
	
}