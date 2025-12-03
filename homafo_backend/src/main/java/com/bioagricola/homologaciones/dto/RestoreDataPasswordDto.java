package com.bioagricola.homologaciones.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.google.gson.annotations.SerializedName;

/**
 * Clase que define dto de informacion de la restauracion de contraseña.
 * @author cperez@progracol.com
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestoreDataPasswordDto {

    @SerializedName("Correo")
    private String correo;

    @SerializedName("Usuario")
    private String usuario;

    @SerializedName("Id Confirmacion")
    private String idConfirmacion;

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getIdConfirmacion() {
        return idConfirmacion;
    }

    public void setIdConfirmacion(String idConfirmacion) {
        this.idConfirmacion = idConfirmacion;
    }
}
