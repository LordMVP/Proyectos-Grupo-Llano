package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.ClteClatercero;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad ClteClatercero.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorClteClatercero extends ManejadorCrud<ClteClatercero,Long>,IManejadorCrud<ClteClatercero,Long>{
	

    // protected region Use esta region para su implementacion del manejador on begin 
    
    // protected region Use esta region para su implementacion del manejador end        
}

