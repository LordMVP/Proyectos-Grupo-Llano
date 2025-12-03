package com.bioagricola.hya.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class RaprRutaAprovechamientoDTO {
    private Long rutaPrIdRegistro;
    private Long rutIderegistro;
    private Long dsusIderegistr;
    private Long terAprovechamiento;
    private Boolean incentivo;
    private Boolean aforado;
    private String rutEstado;
    private Long usuIderegistro;
    private Date dateCreated;
}
