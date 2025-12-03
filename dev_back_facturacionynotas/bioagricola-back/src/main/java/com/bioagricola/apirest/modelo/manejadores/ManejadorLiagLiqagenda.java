package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.LiagLiqagenda;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad LiagLiqagenda.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorLiagLiqagenda extends ManejadorCrud<LiagLiqagenda,Integer>,IManejadorCrud<LiagLiqagenda,Integer>{
	

    // protected region Use esta region para su implementacion del manejador on begin 
    
    // protected region Use esta region para su implementacion del manejador end        
}

