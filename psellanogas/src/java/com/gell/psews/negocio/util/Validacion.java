/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.util;

/**
 *
 * @author lrey
 */
public class Validacion {

    public static boolean esNumero(String valor) {
        String expresion = "[\\d]*";
        return valor.matches(expresion);
    }

    public static Integer getNumeroExcepcion(String valor) {
        if (esNumero(valor)) {
            return Integer.parseInt(valor);
        }
        return -1;
    }
}
