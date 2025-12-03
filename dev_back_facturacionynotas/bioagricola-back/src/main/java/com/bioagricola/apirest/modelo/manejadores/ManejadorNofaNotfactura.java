package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.NofaNotfactura;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad NofaNotfactura.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorNofaNotfactura
		extends ManejadorCrud<NofaNotfactura, Integer>, IManejadorCrud<NofaNotfactura, Integer> {

}
