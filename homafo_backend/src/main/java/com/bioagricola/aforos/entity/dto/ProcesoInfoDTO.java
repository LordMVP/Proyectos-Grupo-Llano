package com.bioagricola.aforos.entity.dto;
import lombok.Getter;

import java.sql.Timestamp;
import java.time.Duration;

@Getter
public class ProcesoInfoDTO {
    private final Long procesoId;
    private final Timestamp fechaInicio;
    private final Long usuarioId;
    private final Long hiloId;
    private final Duration tiempoTranscurrido;
    private final Timestamp fechaFinal;
    private final Long cantidad;

    public ProcesoInfoDTO(Long procesoId, Timestamp fechaInicio, Long usuarioId, Long hiloId, Timestamp fechaFinal, Duration tiempoTranscurrido,Long cantidad) {
        this.procesoId = procesoId;
        this.fechaInicio = fechaInicio;
        this.usuarioId = usuarioId;
        this.hiloId = hiloId;
        this.fechaFinal = fechaFinal;
        this.tiempoTranscurrido = tiempoTranscurrido;
        this.cantidad = cantidad;
    }
}