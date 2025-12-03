package com.bioagricola.homologaciones.dto;

import javax.validation.constraints.NotEmpty;

/**
 * Clase payload para restauracion de contraseña
 * @author cperez@progracol.com
 */
public class RestorePasswordForm {

    @NotEmpty(message = "Usuario es requerido")
    private String username;

    @NotEmpty(message = "Codigo es requerido")
    private String code;

    @NotEmpty(message = "Contraseña es requerido")
    private String password;

    @NotEmpty(message = "Confirmacíon de contraseña es requerido")
    private String confPasword;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfPasword() {
        return confPasword;
    }

    public void setConfPasword(String confPasword) {
        this.confPasword = confPasword;
    }
}
