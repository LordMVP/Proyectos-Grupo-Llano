package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.EsemEstempresa;
import com.bioagricola.apirest.modelo.entidades.EsemEstempresaPK;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad PerPeriodo.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorEsemEstempresa extends ManejadorCrud<EsemEstempresa,EsemEstempresaPK>,IManejadorCrud<EsemEstempresa,EsemEstempresaPK>{
	
	
}
