package com.bioagricola.hya.dto.util;

import lombok.Data;

@Data
public class Localizacion {
    private String address;
    private CoordenadaDTO location;
    private Double score;
    private CoordenadaMinMax extent;
}
