package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.ColiConliquida;
import com.bioagricola.apirest.modelo.entidades.ColiConliquidaPK;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ColiConliquida.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorColiConliquida extends ManejadorCrud<ColiConliquida,ColiConliquidaPK>,IManejadorCrud<ColiConliquida,ColiConliquidaPK>{
	
	@Query(value =	"select coli.uni_concepto idconcepto, con.con_preliquidar preliquidar "
					+" from coli_conliquida coli "
					+ " inner join con_concepto con "
					+ " on coli.uni_concepto = con.uni_concepto "
					+ " where coli.uni_liquidacion = :idliquidacion "
					+ " And (CASE "
					+ " WHEN con.con_finvigencia IS NULL THEN "
					+ " con.con_finvigencia IS NULL "
					+ " ELSE "
					+ " con.con_finvigencia >= now()  "
					+ " END )", nativeQuery = true)
	public Object[] getConceptosLiquidacion(Integer idliquidacion);
	    
}

