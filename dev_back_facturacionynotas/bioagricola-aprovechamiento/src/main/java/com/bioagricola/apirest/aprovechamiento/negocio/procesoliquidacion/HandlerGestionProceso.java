package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.IniciarProcesoDTO;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.entidades.PrlLiquidacionapro;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrproceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrlLiquidacionapro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;

@Service
public class HandlerGestionProceso {
    
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(PagoAprovechamientoThread.class);

    @Autowired
    private ManejadorPrlLiquidacionapro manejadorPrlLiquidacionapro;

    @Autowired
    private HandlerProcesoLiquidacion handlerProcesoLiq;
    
    @Autowired
    private ManejadorCprCtrproceso manejadorCprCtrproceso;

    private Integer registroProceso;

    public void registrarProcesoLiquidacion(IniciarProcesoDTO iniciarProcesoDTO, String estado){
        PrlLiquidacionapro proceso = new PrlLiquidacionapro();
        proceso.setPrlEstado(estado);
        proceso.setPrlFechaEjecucion(new Date());
        proceso.setPrlUsuIderegistro(JwtUtil.auditoriaDTO.getIdUsuario());
        proceso.setPrlAnio(iniciarProcesoDTO.getAnoCiclo());
        this.manejadorPrlLiquidacionapro.save(proceso);
        this.registroProceso = proceso.getPrlIderegistro();
        iniciarProcesoDTO.setIdProceso(registroProceso);
    }

    @Async
    public CompletableFuture<Long> lanzarProcesos(IniciarProcesoDTO iniciarProcesoDTO) throws Exception{
        this.registrarProcesoLiquidacion(iniciarProcesoDTO, "E");

        try {
            this.handlerProcesoLiq.setIniciarProcesoDTO(iniciarProcesoDTO);
            List<Object[]> procesoTerminado = this.handlerProcesoLiq.ejecutar();
            if(procesoTerminado != null && !procesoTerminado.isEmpty()){
                Object [] obj = procesoTerminado.get(0);
                actualizarProceso(iniciarProcesoDTO,Long.parseLong(obj[0].toString()));
            }
        } catch (Exception ex) {
            LOGGER.error("No se ha podido ejecutar el proceso de consolidación de aprovechamiento, razón: "+ex.getMessage());
            actualizarProceso(iniciarProcesoDTO, null);
        }      
        return  CompletableFuture.completedFuture(Long.valueOf(String.valueOf(Math.random())));
    }

    private void actualizarProceso(IniciarProcesoDTO iniciarProcesoDto, Long maprc_ideregistr) throws NegocioException {
        Optional<PrlLiquidacionapro> procesoById = this.manejadorPrlLiquidacionapro.findById(this.registroProceso);
        if(procesoById.isPresent()){
            procesoById.get().setPrlEstado("P");
            procesoById.get().setMaprcIderegistr(maprc_ideregistr);
            this.manejadorPrlLiquidacionapro.save(procesoById.get());
            List<CprCtrProceso> procesos = this.manejadorCprCtrproceso.getProcesos(iniciarProcesoDto.getPrograma(), iniciarProcesoDto.getIdEmpresa(), "A");
            for (CprCtrProceso proceso : procesos) {
                proceso.setCprEstado("I");
                proceso.setCprFecfinal(new Date(System.currentTimeMillis()));
                this.manejadorCprCtrproceso.save(proceso);
            }
        }else{
            throw new NegocioException(String.format("No se pudo actualizar el registro del proceso %d", this.registroProceso));
        }
    }
    
    public void gestionarProceso(Long mapcrIdregistr, String proceso){
        switch (proceso) {
            case "APROBAR":
                this.handlerProcesoLiq.aprobar(mapcrIdregistr);
                break;
            case "DESCARTAR":
                this.handlerProcesoLiq.descartar(mapcrIdregistr);
                break;
        }
    }
}
