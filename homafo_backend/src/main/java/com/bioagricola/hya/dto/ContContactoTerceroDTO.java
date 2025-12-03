package com.bioagricola.hya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContContactoTerceroDTO {

    private Long contIderegistro;
    private Long terTerceroId;
    private Long uniUnidadId;
    private String contValor;
}
