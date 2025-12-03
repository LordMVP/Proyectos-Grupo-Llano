package com.bioagricola.homologaciones.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.gson.annotations.SerializedName;

/**
 * Clase que define dto de restauracion de contraseña.
 * @author cperez@progracol.com
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestorePasswordDto {

    private Integer codigo;
    private String mensaje;

    @SerializedName("datos")
    private RestoreDataPasswordDto datos;

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public RestoreDataPasswordDto getDatos() {
        return datos;
    }

    public void setDatos(RestoreDataPasswordDto datos) {
        this.datos = datos;
    }
}
