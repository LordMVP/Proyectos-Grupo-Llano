package com.bioagricola.hya.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gell.estandar.dto.ArchivoDTO;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class DsnovDsusNovedadDTO {

    private Integer dsnovIderegistro;

    private Long dsusIderegistro;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dsnovNovFecha;

    private String dsnovNumpqr;

    private Map<String,Object> novVisita;

    private Map<String,Object> novFactura;

    private Map<String,Object> tipSolicitud;

    private List<Object> novedades;

    private String dsnovObservaciones;

    private Integer usuIderegistro;

    private List<ArchivoDTO> dsnovImagenesAz;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private LocalDateTime dsnovFecha;
}
