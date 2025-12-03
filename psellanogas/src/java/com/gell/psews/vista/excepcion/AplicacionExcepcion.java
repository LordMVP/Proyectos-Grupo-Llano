/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.vista.excepcion;

import com.gell.psews.negocio.constantes.EMensajes;

/**
 * Excepción personalizada que se va a mostrar al cliente
 *
 * @author lrey
 */
public class AplicacionExcepcion extends Exception {

    private final int codigo;
    private final String mensaje;

    public AplicacionExcepcion(EMensajes constante) {
        this.codigo = constante.getCodigo();
        this.mensaje = constante.getMensaje();
    }

    public AplicacionExcepcion(int codigo, String mensaje) {
        this.codigo = codigo;
        this.mensaje = mensaje;
    }

    public int getCodigo() {
        return codigo;
    }

    public String getMensaje() {
        return mensaje;
    }

    @Override
    public String toString() {
        return codigo + " " + mensaje;
    }

}
