package com.bioagricola.hya.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * Clase que define los parametros del filtro de homologacion
 */
@Data
public class FiltroHomologacionDTO {
    private Integer idempresa;
    private String medidor;
    private String codigo;
    private Long idsus;
    private List<Integer> consumo;
    private String estrato;
    private String tipoUso;
    private Date fechaIni;
    private Date fechaFin;
}
