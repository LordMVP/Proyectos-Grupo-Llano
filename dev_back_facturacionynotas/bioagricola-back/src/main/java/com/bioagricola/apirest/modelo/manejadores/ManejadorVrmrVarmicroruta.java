package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.VrmrVarmicroruta;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorVrmrVarmicroruta
		extends ManejadorCrud<VrmrVarmicroruta, Integer>, IManejadorCrud<VrmrVarmicroruta, Integer> {

}
