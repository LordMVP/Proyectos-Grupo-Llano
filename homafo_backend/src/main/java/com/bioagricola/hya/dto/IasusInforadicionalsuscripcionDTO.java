package com.bioagricola.hya.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class IasusInforadicionalsuscripcionDTO {
    private Long iasusIderegistro;
    private Long susIderegistro;
    private Long dsusIderegistr;
    private Boolean iasusCobrojuridico;
    private Boolean iasusPagapeaje;
    private String iasusReferenciacomercial;
    private String iasusNombreestablecimiento;
}
