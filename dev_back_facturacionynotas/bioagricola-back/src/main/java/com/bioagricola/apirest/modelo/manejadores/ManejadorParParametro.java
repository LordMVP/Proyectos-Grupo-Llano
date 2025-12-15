package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.ParParametro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorParParametro extends ManejadorCrud<ParParametro,Integer>,IManejadorCrud<ParParametro,Integer>{

	/**
	 * Método de consulta de parámetros según la empresa en sesión
	 * */
	@Query(value = "select pp from ParParametro pp where pp.empIderegistro = :idEmpresa ", nativeQuery = false)
	ParParametro consultaParametros(@Param("idEmpresa") int idEmpresa);

	
}
