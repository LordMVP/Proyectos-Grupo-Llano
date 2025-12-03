package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.SusSuscripcion;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Service;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre
 * la tabla correspondiente a la entidad SusSuscripcion.
 *
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorSusSuscripcion extends ManejadorCrud<SusSuscripcion, Long>, IManejadorCrud<SusSuscripcion, Long> {


    // protected region Use esta region para su implementacion del manejador on begin

    // protected region Use esta region para su implementacion del manejador end
}

