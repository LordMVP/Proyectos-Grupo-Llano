package com.bioagricola.hya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

/**
 * Clase de busqueda basica
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BasicSearchDTO {

    @NotNull
    private String search;
}
