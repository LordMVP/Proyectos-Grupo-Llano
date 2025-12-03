package com.bioagricola.hya.dto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class AforoVisitaDto {

    private Integer aforoId;

    private String nombreEstablecimiento;

    private String claseAforo;

    private String tipoAforo;

    private String fuente;

    private String suscripcion;

    private String visitasTotal;

    private String visitasRealizadas;

    private String fechaAsignacion;

    private String codSusBio;

    private Integer visitaId;

    private Integer visitaConsecutivo;

    private String observacion;

    private String barrio;

    private String direccion;

    private String semana;

    private String radicado;

    private Map<String,Object> image;

    private String codSusMulti;

    private List<Map<String,Object>> suscripcionesMulti;

    private Double locationX;

    private Double locationY;

    private String fechaVisita;

}
