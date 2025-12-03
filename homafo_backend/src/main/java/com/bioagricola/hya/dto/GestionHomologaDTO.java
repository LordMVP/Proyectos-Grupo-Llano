package com.bioagricola.hya.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class GestionHomologaDTO {
    private Long ghomIderegistr;
    private Integer susIderegistro;
    private Date ghomFecharegistro;
    private Date ghomFechaactualiza;
    private Long perIderegistro;
    private String ghomEstado;
    private Long usuIderegistro;
    private Long empIderegistro;
    private String observaciones;
    private Long dsusIderegistr;
    private Integer cnreIderegistr;
    private List<DetalleGestionHomologaDTO> detalles = new ArrayList<>();
}
