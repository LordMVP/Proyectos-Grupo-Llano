/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.llanogas.achagua.persistencia.dto;

/**
 *
 * @author hrey
 */
public class RespuestaDTO {

    private String mensaje;
    private long idRecaudoEntidad;
    private int codigoRespuesta;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public long getIdRecaudoEntidad() {
        return idRecaudoEntidad;
    }

    public void setIdRecaudoEntidad(long idRecaudoEntidad) {
        this.idRecaudoEntidad = idRecaudoEntidad;
    }

    public int getCodigoRespuesta() {
        return codigoRespuesta;
    }

    public void setCodigoRespuesta(int codigoRespuesta) {
        this.codigoRespuesta = codigoRespuesta;
    }

}
