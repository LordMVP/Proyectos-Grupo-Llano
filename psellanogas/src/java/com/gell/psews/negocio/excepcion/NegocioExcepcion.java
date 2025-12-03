/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.excepcion;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.vista.excepcion.AplicacionExcepcion;

/**
 * Devuelve los mensajes de las reglas de negocio de la base de datos
 *
 * @author lrey
 */
public class NegocioExcepcion extends AplicacionExcepcion {

    public NegocioExcepcion(EMensajes constante) {
        super(constante);
    }

    public NegocioExcepcion(EMensajes constante, String mensaje) {
        super(constante.getCodigo(), constante.getMensaje().replaceAll("__COMPLEMENTO__", mensaje));
    }

    public NegocioExcepcion(int codigo, String mensaje) {
        super(codigo, mensaje);
    }

}
