package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.dtos.ProgresoLiqAprovDTO;
import java.util.concurrent.CompletableFuture;

public interface ILiquidacion {
    CompletableFuture<Long> iniciarLiquidacion(IniciarProcesoDTO iniciarProcesoDTO) throws Exception;
    ProgresoLiqAprovDTO progresoLiquidacion(Integer proceso);
    void aprobarProceso();
    void descartarProceso();

}
