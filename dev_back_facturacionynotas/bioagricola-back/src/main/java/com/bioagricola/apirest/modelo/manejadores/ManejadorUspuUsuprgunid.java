package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.UspuUsuprgunid;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ParParametro.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorUspuUsuprgunid extends ManejadorCrud<UspuUsuprgunid,Long>,IManejadorCrud<UspuUsuprgunid,Long>{

	/**
	 * Método de consulta de parámetros según la empresa en sesión
	 * */
	@Query("select pp from ParParametro pp "
			+ " where pp.empIderegistro = :idEmpresa ")
	UspuUsuprgunid consultaParametrosAccion(@Param("idEmpresa") int idEmpresa);
	
	/**
	 * Método de consulta de si existe relación con el programa y la unidad
	 * para definir permisos de usuario administrador 
	 * 
	 * @param idUsuario
	 * @param prunIderegistr
	 * @return
	 */
	@Query("select uu from UspuUsuprgunid uu "
			+ "where uu.usuIderegistro = :idUsuario "
			+ "and uu.prunPrgunidad.prunIderegistr = :prunIderegistr")
	UspuUsuprgunid consultaPrivilegioDeshabitado(@Param("idUsuario") int idUsuario, @Param("prunIderegistr") Integer prunIderegistr);
	
}
