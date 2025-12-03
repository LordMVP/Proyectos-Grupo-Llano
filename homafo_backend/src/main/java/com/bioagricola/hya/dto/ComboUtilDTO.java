package com.bioagricola.hya.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

/**
 * Clase que define estructura dto para combos
 *
 * @author dsolano
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ComboUtilDTO {

    private Integer idGrupo;

    private String id;

    private String nombre;

    private String code;

    private String tipo;

    private Boolean riesgo;

    List<ComboUtilDTO> itemsHijos;

    public ComboUtilDTO() {
    }

    public ComboUtilDTO(String id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public ComboUtilDTO(Integer idGrupo, String id, String nombre) {
        this.idGrupo = idGrupo;
        this.id = id;
        this.nombre = nombre;
    }

    public ComboUtilDTO(String id, String nombre, String code) {
        this.id = id;
        this.nombre = nombre;
        this.code = code;
    }
}
