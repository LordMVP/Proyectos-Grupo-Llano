package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.ProcesoAprovechamientoDTO;

public interface ILiquidacionHilo {

    void setDatos(Integer idHilo, ProcesoAprovechamientoDTO procesoAprovechamientoDTO);
}
