package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.FunFuncion;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad FunFuncion.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorFunFuncion extends ManejadorCrud<FunFuncion,String>,IManejadorCrud<FunFuncion,String>{
	

	@Query(value =	"select "
			+ "               fun_nombre nombre,fun_descripcion descripcion,"
			+ "               fun_tipo  tipo,fun_ideregistro idfuncion, fun_parametro numeroparametros,"
			+ "               usu_ideregistro idusuario"
			+ "              from fun_funcion where fun_ideregistro=:idfuncion", nativeQuery = true)
	public Object getFuncion(Integer idfuncion);
}

