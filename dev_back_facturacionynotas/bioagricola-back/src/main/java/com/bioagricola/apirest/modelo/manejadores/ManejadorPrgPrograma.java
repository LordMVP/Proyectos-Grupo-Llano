package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.PrgPrograma;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorPrgPrograma extends ManejadorCrud<PrgPrograma,Integer>,IManejadorCrud<PrgPrograma,Integer>{

	/**
	 * Método de consulta de parámetros según la empresa en sesión
	 * */
	@Query("select pp from PrgPrograma pp "
			+ " where pp.prgIderegistro = :idPrograma "
			+ " and pp.usuIderegistro = :idUsuario ")
	PrgPrograma consultaPrograma(@Param("idPrograma") int idPrograma, @Param("idUsuario") int idUsuario);
	
}
