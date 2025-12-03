package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.HmafHistormaestroaforo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorHmafHistormaestroaforo
		extends ManejadorCrud<HmafHistormaestroaforo, Integer>, IManejadorCrud<HmafHistormaestroaforo, Integer> {

}
