package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.servicio.utils.UtilAprovechamiento;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Lookup;

@Service
public class HandlerProcesoLiquidacion {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PagoAprovechamientoThread.class);

    @Autowired
    private HandlerFacturaLiquidacion negocioFacturaLiquidacion;

    @Autowired
    private UtilAprovechamiento utilAprovechamiento;

    protected IniciarProcesoDTO iniciarProcesoDTO;

    public HandlerProcesoLiquidacion() {

    }

    @Lookup
    public PagoAprovechamientoThread getPagoAprovechamientoThread() {
        return null;
    }

    public List<Object[]> ejecutar() throws Exception {
        try {
            int cantidadHilos = getCantidadHilos();
            for (int hilo = 1; hilo <= cantidadHilos; hilo++) {
                PagoAprovechamientoThread thread = getPagoAprovechamientoThread();
                thread.setIdHilo(hilo);
                thread.setIniciarProcesoDTO(this.iniciarProcesoDTO);
                thread.run();
            }
            return this.negocioFacturaLiquidacion.ejecutarProcesoAproCast(this.iniciarProcesoDTO.getIdEmpresa(), this.iniciarProcesoDTO.getFechaCorteFacturacion(), this.iniciarProcesoDTO.getIdUsuario());
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage());
        }
        return null;
    }
    
    public void aprobar(Long mapcrIdregistr){
        this.negocioFacturaLiquidacion.ejecutarAprobarProcesoAprovCast(mapcrIdregistr);
    }
    
    public void descartar(Long mapcrIdregistr){
        this.negocioFacturaLiquidacion.ejecutarDescartarProcesoAprovCast(mapcrIdregistr);
    }

    private int getCantidadHilos() throws Exception {
        return this.utilAprovechamiento.getCantidadHilos();
    }

    public IniciarProcesoDTO getIniciarProcesoDTO() {
        return iniciarProcesoDTO;
    }

    public void setIniciarProcesoDTO(IniciarProcesoDTO iniciarProcesoDTO) {
        this.iniciarProcesoDTO = iniciarProcesoDTO;
    }
}
