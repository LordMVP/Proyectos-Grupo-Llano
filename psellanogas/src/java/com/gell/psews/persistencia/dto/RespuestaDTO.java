/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import com.gell.psews.negocio.constantes.EMensajes;

/**
 *
 * @author lrey
 * @param <T> Se especifica el tipo de DTO que se quiere retornar
 */
public class RespuestaDTO<T> {

    private int codigo;
    private String mensaje;
    private T datos;

    public RespuestaDTO() {
    }

    public RespuestaDTO(int codigo, String mensaje) {
        this.codigo = codigo;
        this.mensaje = mensaje;

    }

    public RespuestaDTO(EMensajes respuesta) {
        this.codigo = respuesta.getCodigo();
        this.mensaje = respuesta.getMensaje();
    }

    public int getCodigo() {
        return codigo;
    }

    public RespuestaDTO setCodigo(int codigo) {
        this.codigo = codigo;
        return this;
    }

    public String getMensaje() {
        return mensaje;
    }

    public RespuestaDTO setMensaje(String mensaje) {
        this.mensaje = mensaje;
        return this;
    }

    public T getDatos() {
        return datos;
    }

    public RespuestaDTO setDatos(T datos) {
        this.datos = datos;
        return this;
    }

}
