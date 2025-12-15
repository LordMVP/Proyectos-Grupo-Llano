package com.bioagricola.apirest.aprovechamiento.negocio.procesoliquidacion;

import com.bioagricola.apirest.modelo.dtos.CprCtrprocesoDTO;
import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrproceso;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HandlerCprCtrProceso {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(HandlerCprCtrProceso.class);

    @Autowired
    private ManejadorCprCtrproceso manejadorCprCtrproceso;

    @Autowired
    private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;

    public Long registrarProcesoApro(CprCtrprocesoDTO cprCtrprocesoDTO){
        try {
            String campos = " cpr_estado, cpr_fecinicio, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro ";
            String valores = " '" + cprCtrprocesoDTO.getCprEstado() + "','" + cprCtrprocesoDTO.getCprFecinicio() + "'," + cprCtrprocesoDTO.getCprCanregistro() + "," + cprCtrprocesoDTO.getPrgIderegistro() + ","
                    + cprCtrprocesoDTO.getAccIderegistro() + "," + cprCtrprocesoDTO.getEmpIderegistro() + "," + cprCtrprocesoDTO.getCprIdehilo() + "," + cprCtrprocesoDTO.getUsuIderegistro() + " ";

            Long procesoId = manejadorCprCtrprocesoRespository.insertar("cpr_ctrproceso", campos, valores,
                    "returning cpr_ideregistro");
            return procesoId;
        }catch (Exception e){
            LOGGER.error("ocurrió un error al registrar el proceso",e);
        }
        return null;
    }
    public CprCtrProceso existeEjecucionHilo(CprCtrprocesoDTO cprCtrprocesoDTO){
        try {
            List<CprCtrProceso> procesoEjecucionPorHilo = this.manejadorCprCtrproceso.getProcesoEjecucionPorHilo(cprCtrprocesoDTO.getPrgIderegistro(), cprCtrprocesoDTO.getEmpIderegistro(), cprCtrprocesoDTO.getCprIdehilo());
            if(procesoEjecucionPorHilo != null && !procesoEjecucionPorHilo.isEmpty()){
                CprCtrProceso procesoGuardado = procesoEjecucionPorHilo.get(0);
                return procesoGuardado;
            }
        }catch (Exception ex){
            LOGGER.error("Error al consultar si ya existe un proceso con el mismo hilo");
        }
        return null;
    }

    public void actualizarCantidadHilo(CprCtrProceso procesoGuardado){
        procesoGuardado.setCprCanregistro(procesoGuardado.getCprCanregistro()+1);
        this.manejadorCprCtrproceso.save(procesoGuardado);
    }

    public CprCtrProceso findById(Long idProceso){
        Optional<CprCtrProceso> byId = this.manejadorCprCtrproceso.findById(idProceso);
        return byId.isPresent() ? byId.get(): null;
    }
}
