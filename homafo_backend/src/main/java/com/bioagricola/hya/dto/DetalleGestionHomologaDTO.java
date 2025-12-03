package com.bioagricola.hya.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class DetalleGestionHomologaDTO {
    private Long dghoIderegistr;
    private Long ghomIderegistr;
    private Long dsusIderegistr;
    private Long empIderegistro;
    private String dsusPcodigo;
    private String dghoEstado;
    private List<Integer> dghoConsumo;
    private String dghoObservaciones;
    private String dghoNumeromedidor;
    private Date dghoFecharegistro;
    private Date dghoFechaactualiza;
    private Long usuIderegistro;
    private Long susIderegistroHomologa;
    private Long susIderegistroHomologados;
}
