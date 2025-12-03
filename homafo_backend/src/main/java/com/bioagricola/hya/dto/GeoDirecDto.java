package com.bioagricola.hya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeoDirecDto {
    private String direccion;
    private String complemento;
    private String barrio;
    private String ciudad;

}
