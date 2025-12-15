package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.PerPeriodoDTO;
import com.bioagricola.apirest.aprovechamiento.payload.PeriodoFacturacionPrestacionForm;

import java.util.List;

public interface IPeriodo {
    Object getPeriodo() throws Exception;
    List<PerPeriodoDTO> getPeriodos();

    List<PerPeriodoDTO> getPeriodosCon();

    List<PeriodoFacturacionPrestacionForm> getPeriodosApro(Integer idPeriodo);
}
