package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ParLabParametrosLabels;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Service;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class ManejadorParLabParametrosLabels
 */
@Service
public interface ManejadorParLabParametrosLabels extends ManejadorCrud<ParLabParametrosLabels,Long>, IManejadorCrud<ParLabParametrosLabels,Long> {
}
