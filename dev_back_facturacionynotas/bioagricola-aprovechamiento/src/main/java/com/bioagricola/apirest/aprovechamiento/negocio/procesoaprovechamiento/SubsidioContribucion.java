package com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento;

import com.bioagricola.apirest.modelo.manejadores.IManejadorAprDistRecaudoPeriodo;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprDistSubsidiosContribuciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

@Service
@EnableAsync
@EnableScheduling
public class SubsidioContribucion {
    private final IManejadorAprDistSubsidiosContribuciones manejadorAprDistSubsidiosContribuciones;

    @Autowired
    public SubsidioContribucion(IManejadorAprDistSubsidiosContribuciones manejadorAprDistSubsidiosContribuciones) {
        this.manejadorAprDistSubsidiosContribuciones = manejadorAprDistSubsidiosContribuciones;
    }

    public void procesarSubsidiosRangoPeriodos(Integer fechaInicio, Integer fechaFin) {
        manejadorAprDistSubsidiosContribuciones.procesarSubsidiosRangoPeriodos(fechaInicio, fechaFin);
    }


}
