package com.bioagricola.apirest.modelo.dtos;

import java.io.Serializable;

public class TerceroPorFactDTO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private String terDocumento;

    private Short terDigverificacion;

    private String terNomcompleto;

    private String terApellido;

    private Long terIderegistro;

    public TerceroPorFactDTO(String terNomcompleto, Long terIderegistro) {
        this.terNomcompleto = terNomcompleto;
        this.terIderegistro = terIderegistro;
    }

    public TerceroPorFactDTO(String terDocumento, Short terDigverificacion, String terNomcompleto, String terApellido, Long terIderegistro) {
        this.terDocumento = terDocumento;
        this.terDigverificacion = terDigverificacion;
        this.terNomcompleto = terNomcompleto;
        this.terApellido = terApellido;
        this.terIderegistro = terIderegistro;
    }

    public String getTerNomcompleto() {
        return terNomcompleto;
    }

    public void setTerNomcompleto(String terNomcompleto) {
        this.terNomcompleto = terNomcompleto;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public String getTerDocumento() {
        return terDocumento;
    }

    public void setTerDocumento(String terDocumento) {
        this.terDocumento = terDocumento;
    }

    public Short getTerDigverificacion() {
        return terDigverificacion;
    }

    public void setTerDigverificacion(Short terDigverificacion) {
        this.terDigverificacion = terDigverificacion;
    }

    public String getTerApellido() {
        return terApellido;
    }

    public void setTerApellido(String terApellido) {
        this.terApellido = terApellido;
    }

}
