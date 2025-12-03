package com.bioagricola.hya.dto;

import com.bioagricola.common.util.RawJsonDeserializer;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.util.Date;


@Data
public class UniUnidadDTO {
    private Long uniIderegistro;
    private String uniCodigo;
    private String uniCodigo1;
    private String uniCodigo2;
    private String uniCodigo3;
    private String uniCodigo4;
    private String uniCodigo5;
    private String uniNombre1;
    private String uniNombre2;
    private String uniNombre3;
    private String uniNombre4;
    private String uniNombre5;
    private Long uniOrden;
    private Long uniNivel;
    private Date uniFecha;
    @JsonRawValue
    @JsonDeserialize(using = RawJsonDeserializer.class)
    private String uniPropiedad;


}
