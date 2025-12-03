package com.bioagricola.homologaciones.dto;

import com.bioagricola.common.util.ENUM_COLUMN_TYPE_DATA;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class ParametrizacionImcolRequest
{
	private Integer idImcol;
	private String nombre;
    private String descripcion;
    private ENUM_COLUMN_TYPE_DATA tipoDato;
    private Boolean obligatorio;
    private String validador;
    private String tipoResolucion;
    private String json;

}
