package com.bioagricola.apirest.modelo.manejadores;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.RacoRanconcept;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad RacoRanconcept.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorRacoRanconcept extends ManejadorCrud<RacoRanconcept,Integer>,IManejadorCrud<RacoRanconcept,Integer>{
	
	
	@Query(value = "select count(*) numero from raco_ranconcept raco where raco.uni_concepto=:idconcepto ", nativeQuery = true)
	public Integer tieneRangoConcepto(Integer idconcepto);
	
	@Query(value = "select raco.raco_ideregistr idrangoconcepto,raco.uni_concepto idconcepto,"
			+ "                 raco.raco_raninicial rangoinicial, raco.raco_ranfinal rangofinal,"
			+ "                 raco.raco_valor valor, raco.raco_formula formula, raco.usu_ideregistro idusuario"
			+ "               from raco_ranconcept  raco "
			+ "               where raco.uni_concepto=:idconcepto and :valortotal between  raco.raco_raninicial and  raco.raco_ranfinal", nativeQuery = true)
	public Object[] getRangoConcepto(Integer idconcepto, BigDecimal valortotal);  
}

