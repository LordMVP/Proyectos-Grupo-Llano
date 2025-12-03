package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.NotNota;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorNotNota extends ManejadorCrud<NotNota, Long>, IManejadorCrud<NotNota, String> {


}
