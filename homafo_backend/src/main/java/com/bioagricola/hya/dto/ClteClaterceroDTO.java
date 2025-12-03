package com.bioagricola.hya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClteClaterceroDTO {
    private Long clteIderegistr;
    @NotNull(message = "unidad es obligatorio")
    private Long uniClatercero;
    @NotNull(message = "tercero es obligatorio")
    private Long terIderegistro;
    @NotNull(message = "usuario es obligatorio")
    private Integer usuIderegistro;
}
