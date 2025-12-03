package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CplcConperliqconsolidado;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorCplcConperliqconsolidado
extends ManejadorCrud<CplcConperliqconsolidado, Integer>, IManejadorCrud<CplcConperliqconsolidado, Integer> {

}
