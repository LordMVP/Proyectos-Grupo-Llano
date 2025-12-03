package com.bioagricola.homologaciones.dto;

import com.google.gson.annotations.SerializedName;

/**
 * Clase que define dto de parametros.
 * @author cperez@progracol.com
 */
public class ParametersDto {

    @SerializedName("IdConfirmacion")
    private String idConfirmacion;

    public ParametersDto(String idConfirmacion) {
        this.idConfirmacion = idConfirmacion;
    }

    public String getIdConfirmacion() {
        return idConfirmacion;
    }

    public void setIdConfirmacion(String idConfirmacion) {
        this.idConfirmacion = idConfirmacion;
    }
}
