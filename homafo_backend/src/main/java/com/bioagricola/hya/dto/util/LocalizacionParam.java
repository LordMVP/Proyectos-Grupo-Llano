package com.bioagricola.hya.dto.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocalizacionParam {
    private String token;
    private String address;
    private String address2;
    private String neighborhood;
    private String city;
}
