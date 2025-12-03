package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DprlDetliquidacionapro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Service;

@Service
public interface ManejadorDprlDetliquidacionapro extends ManejadorCrud<DprlDetliquidacionapro, Integer>, IManejadorCrud<DprlDetliquidacionapro, Integer> {
}
