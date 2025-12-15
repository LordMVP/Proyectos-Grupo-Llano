package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

public interface IProcesoLiquidacionThread {
    void registrarProceso();
    void validarFactura() throws Exception;
    void agruparFactura();
    void calculosFactura();
}
