package com.bioagricola.hya.dto;

import lombok.Data;

@Data
public class RrbaRutaRecoleccionBarridoDTO {
    private Long rrbaIdRegistro;
    private Long rutIderegistro;
    private Long dsusIderegistr;
    private Long rutIdMacroRuta;
    private String rutEstado;

    private Long rrbaIdRegistroBar;
    private Long rutIderegistroBar;
    private String rutEstadoBar;

}
