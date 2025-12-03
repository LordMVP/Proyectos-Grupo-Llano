package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CoreConrelacio;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad CoreConrelacio.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorCoreConrelacio extends ManejadorCrud<CoreConrelacio,Integer>,IManejadorCrud<CoreConrelacio,Integer>{
	
	@Query(value =	"SELECT"
			+ " fun.fun_ideregistro idfuncionrelacionada,"
			+ " fun.fun_nombre funcion"
			+ " FROM"
			+ " core_conrelacio core INNER JOIN fun_funcion fun ON core.fun_ideregistro=fun.fun_ideregistro"
			+ " WHERE"
			+ " core.uni_concepto = :idconceptoliquidar AND uni_conrelacion = :idconceptorelacionado", nativeQuery = true)
	public Object getFuncionRelacionada(Integer idconceptorelacionado,Integer idconceptoliquidar);
	
}

