package com.bioagricola.homologaciones.dto;

/**
 * Clase que define dto de cambio de contraseña.
 * @author cperez@progracol.com
 */
public class UserChangePassDto {

    private String usuario;
    private String clave;
    private int idEmpresa;
    private ParametersDto parametros;

    public UserChangePassDto(String usuario, String clave, int idEmpresa, ParametersDto parametros) {
        this.usuario = usuario;
        this.clave = clave;
        this.idEmpresa = idEmpresa;
        this.parametros = parametros;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public int getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(int idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public ParametersDto getParametros() {
        return parametros;
    }

    public void setParametros(ParametersDto parametros) {
        this.parametros = parametros;
    }
}
